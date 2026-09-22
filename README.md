# FuturyCraft — Formulário de Recrutamento de Staff + Páginas de Criadores

Repositório do site público de recrutamento do servidor de Minecraft **FuturyCraft**. Contém:

1. **Landing Home/Staff** (`index.html`, `recrutamento.html`) — apresentação do servidor e do processo.
2. **Fluxo de candidatura a Staff** — 5 etapas que acumulam dados no `localStorage`, enviam via API serverless para o Supabase (`tabela candidatos`) e são consumidos pelo **Painel Staff**.
3. **Landing Criadores (YouTuber/Streamer) com wizard de 7 etapas** (`youtuber.html`, `streamer.html`) — apresentação premium + formulário de candidatura em uma única página, com CTA que abre o wizard.

## Tecnologias

- HTML/CSS/JS vanilla (sem build, sem bundler) — hospedagem estática.
- Supabase (mesmo projeto do painel: `jssscxlnzytmwzbabvhu`) — escreve na tabela `public.candidatos`.
- [Vercel Serverless Function](api/candidatura.js) — único ponto de escrita no banco.
- Cloudflare Turnstile (`data-sitekey="0x4AAAAAAEDRSGXn1YoKmbFH"`).
- Google Fonts Montserrat; Font Awesome 6.7.2 só nas landings.

## Varáveis de ambiente

| Variável | Onde é usada |
|---|---|
| `SUPABASE_URL` | `api/candidatura.js` |
| `SUPABASE_SERVICE_ROLE_KEY` | `api/candidatura.js` (nunca versionar) |
| `TURNSTILE_SECRET_KEY` | `api/candidatura.js` (verificação do captcha; sem ela, captcha fica desabilitado) |

Existem `vercel.json` (headers de segurança globais: CSP/`X-Frame-Options`/`nosniff`) e `.env.example`. `package.json` tem `@supabase/supabase-js 2.57.4` (pinned), engine Node >=20, sem scripts.

## Páginas

| Página | Rota | Papel |
|---|---|---|
| Home | `index.html` | Landing do servidor; seções com badges, hierarquia e "COMO FUNCIONA". |
| Staff | `recrutamento.html` | Página de recrutamento com CTA que aponta para o fluxo de candidatura. |
| Etapa 1 — Dados Pessoais | `candidatos.html` | Fluxo de Staff, 20%. |
| Etapa 2 — Conta | `candidatura-conta.html` | 40%. |
| Etapa 3 — Perfil | `candidatura-perfil.html` | 60%. |
| Etapa 4 — Feedback | `candidatura-feedback.html` | 80%. |
| Etapa 5 — Termo | `candidatura-termo.html` | 100% → `POST /api/candidatura`. |
| Sucesso (Staff) | `candidatura-sucesso.html` | Confirmar envio da candidatura. |
| YouTuber | `youtuber.html` | Wizard de 7 etapas (Apresentação + formulário). |
| Streamer | `streamer.html` | Wizard de 7 etapas. |
| Sucesso (Criador) | `sucesso-criador.html` | Confirmar envio do formulário de criador. |

Navbar comum em todas as páginas via `js/site-nav.js` + `css/criadores.css`.

## Fluxo do formulário (Staff)

```
index.html → recrutamento.html → candidatos.html (Etapa 1, 20%)
  → candidatura-conta.html (Etapa 2, 40%)
  → candidatura-perfil.html (Etapa 3, 60%)
  → candidatura-feedback.html (Etapa 4, 80%)
  → candidatura-termo.html (Etapa 5, 100%) → POST /api/candidatura
  → candidatura-sucesso.html
```

Progresso visível via `.progress-fill` com larguras fixas inline (20/40/60/80/100%).

- **Etapa 1** `candidatos.html`: nome, nick (máx 16), Discord, idade (slider), data de nascimento, gênero.
- **Etapa 2** `candidatura-conta.html`: tipo de conta, plataforma, acesso, tempo no servidor, modo de interesse, horário, dias da semana.
- **Etapa 3** `candidatura-perfil.html`: sobre você, bom ajudante, destaque, 5 situações de staff, experiência anterior (bloco condicional).
- **Etapa 4** `candidatura-feedback.html`: 5 avaliações por estrelas + campo melhorias com contador.
- **Etapa 5** `candidatura-termo.html`: aceite do termo + Turnstile + envio.

## Wizard de Criadores (YouTuber/Streamer) — 7 etapas

`youtuber.html` e `streamer.html` são wizard de página única controlado por `js/criador-form.js`:

- **Etapa global 1 — Apresentação**: hero premium + "COMO FUNCIONA" (timeline de 3 etapas) + CTA ("Quero ser criador") que chama `iniciarCandidatura()`.
- **Etapas globais 2–7 — Formulário**: Dados Pessoais → Conta/Servidor → Perfil → Situações → Experiência → Termo/Turnstile.
- O stepper `.wizard-steps` marca os 7 passos (`.ativo`); a barra mostra `1/7` a `7/7`; o Turnstile é resetado apenas ao entrar no último passo.
- `voltarEtapa()` retorna à Apresentação quando o passo é ≤ 1 (volta ao topo).
- Progresso via `etapa-percent` + `.progress-fill` (14% por passo no formulário), persistência em `localStorage` (chave `futury_candidatura`) e envio final igual ao fluxo de Staff.

## Estado entre etapas

Toda etapa acumula os campos no `localStorage` na chave **`futury_candidatura`** (objeto JSON compartilhado). A chave é removida após resposta `200` do POST, e expira automaticamente após 7 dias (dados parciais abandonados são descartados). Validação client-side via `alert()` + `event.preventDefault()`.

## API (`api/candidatura.js`)

- Handler Vercel, só aceita `POST` (`GET` → 405).
- Cria cliente Supabase com `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` de env (secret, nunca no frontend).
- **Allow-list** de 32 campos — nunca insere o body inteiro; `status` é sempre forçado a `Pendente` no servidor.
- Valida server-side: obrigatórios (`nome_completo`, `nick`, `discord`), idade ≥ 13, limites de tamanho.
- **Turnstile verificado no servidor** (`challenges.cloudflare.com/siteverify`) quando `TURNSTILE_SECRET_KEY` existe; sem a env o captcha fica desabilitado. O token é coletado no cliente (`candidatura-termo.js` e `criador-form.js`) e enviado como `turnstile_token`.
- Rate limit: 3 envios / 10 min por IP (mapa em memória — por instância serverless; mover p/ KV se escalar).
- Origem defensiva (403 se `Origin` fora de `*.futurycraft`). Erros genéricos (detalhes do Supabase só em `console`).

## Schema implícito — tabela `candidatos`

Não existe arquivo `.sql` neste repositório; o schema (tabela `candidatos` + RLS) está versionado nas migrations do **painel staff** (`futurycraft-painel-main/supabase/migrations/`). Colunas inferidas do payload montado em `js/candidatura-termo.js` (33 campos):

- Pessoal: `nome_completo`, `nick`, `discord`, `idade`, `data_nascimento` (YYYY-MM-DD), `genero`
- Conta: `tipo_conta`, `plataforma`, `acesso_conta`, `tempo_servidor`, `modo_interesse`, `horario_jogo`, `dias_jogo` (array)
- Perfil: `sobre_voce`, `bom_ajudante`, `destaque`, `jogador_toxico`, `suspeita_hack`, `amigo_regra`, `punicao_injusta`, `novo_jogador`, `experiencia_staff`, `servidor_anterior`, `cargo_anterior`, `tempo_staff`, `motivo_saida`
- Feedback: `avaliacao_servidor`, `avaliacao_equipe`, `avaliacao_organizacao`, `avaliacao_eventos`, `avaliacao_atualizacoes`, `melhorias`
- Preenchidas pelo painel depois: `status`, `avaliador`, `data_analise`

## Arquivos-chave

| Arquivo | Papel |
|---|---|
| `api/candidatura.js` | Único insert no banco |
| `js/candidatura-termo.js` | Monta payload final e faz o fetch (Staff) |
| `js/criador-form.js` | Wizard de 7 etapas da página de criador (YouTuber/Streamer) |
| `js/candidatos.js`, `js/candidatura-conta.js`, `js/candidatura-perfil.js`, `js/candidatura-feedback.js` | Validação + persistência de cada etapa |
| `js/site-nav.js` | Navbar comum |
| `js/supabase.js` | Cliente Supabase com URL/key hardcoded — **código morto, não carregado** |
| `assets/js/staff.js`, `assets/css/staff.css` | Legado de landing antiga, não referenciados |

## Camadas de CSS (todas sem lógica/JS)

| Arquivo | Escopo |
|---|---|
| `css/upgrade.css` | Camada global (tokens `--fc-*`, fundos, guardas de layout/overflow). Carregada em todas as páginas. |
| `css/style.css` | Base legada dos formulários. |
| `css/candidatos.css` | Formulário de Staff (container, progress-card, form-card, campos, botões). |
| `css/candidatura-*.css` | CSS específico de cada etapa (conta/perfil/feedback/termo/sucesso). |
| `css/recrutamento.css` + `css/recrutamento-redesign.css` | Página Staff. |
| `css/home-redesign.css` | Landing Home (hero, seções, steps-timeline, CTA). |
| `css/criadores.css` | Navbar comum + base do site. |
| `css/criadores-redesign.css` | Landing de YouTuber/Streamer (hero, timeline de 3 etapas, wizard de página, formulário compacto). **Carregada por último** nas páginas de criador. |

### Organização de layout (centralização e overflow)

- Container padrão centralizado: `.container { width:min(95%, var(--max-width, 960px)); margin:auto; padding:45px 16px 80px; box-sizing:border-box }`.
- Landing de criadores usa `.container.landing-container` (≤1080px) com formulário/progresso compactos (≤900px, `margin-inline:auto`).
- Guardas globais no `upgrade.css`: `html { overflow-x:clip }`, `img/video { max-width:100% }`, cards e campos com `max-width:100%` — nada estoura a viewport.
- `.steps-timeline.steps-3` colapsa para timeline vertical de 1 coluna em ≤900px (com regra de especificidade própria).
- `.wizard-steps` quebra para 3 por linha em ≤760px; texto longo usa `overflow-wrap:break-word`.

## Problemas conhecidos

- Botão "Voltar" da Etapa 2 (`candidatura-conta.html:874`) aponta para `candidatura.html` — página inexistente, deveria ser `candidatos.html`.
- Redirect de segurança em `candidatura-termo.js:54` também aponta para `candidatura.html`.
- Anonymous key e URL do Supabase hardcoded no cliente (`js/supabase.js`); sem políticas RLS versionadas — estado real do RLS desconhecido.
- API sem sanção de duplicidade de nick/Discord.
- Links sociais do footer da landing apontam para `#`.
- `assets/images/teste` (1 byte) é lixo acidental.

## Dependência com o painel

O painel (`futurycraft-painel-main`) lê a tabela `candidatos` e atualiza `status`/`avaliador`/`data_analise`. Eles compartilham o mesmo projeto Supabase — mudanças de schema/RLS afetam os dois.