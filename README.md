# FuturyCraft — Formulário de Recrutamento de Staff

Formulário público de candidatura para entrar na equipe de staff do servidor de Minecraft FuturyCraft. O jogador passa por um fluxo de 5 etapas, preenche dados pessoais, conta/servidor, perfil e experiência, avalia o servidor e aceita o termo de voluntariado. No fim, os dados são enviados (via API serverless) para a tabela `candidatos` no Supabase, onde o Painel Staff os consome.

## Tecnologias

- HTML/CSS/JS vanilla (sem build, sem bundler) — hospedagem estática.
- Supabase (mesmo projeto do painel: `jssscxlnzytmwzbabvhu`) — escreve na tabela `public.candidatos`.
- [Vercel Serverless Function](api/candidatura.js) — único ponto de escrita no banco.
- Cloudflare Turnstile no passo final (`data-sitekey="0x4AAAAAAEDRSGXn1YoKmbFH"`).
- Google Fonts Montserrat; Font Awesome 6.7.2 só na landing.

## Varáveis de ambiente

| Variável | Onde é usada |
|---|---|
| `SUPABASE_URL` | `api/candidatura.js` |
| `SUPABASE_SERVICE_ROLE_KEY` | `api/candidatura.js` (nunca versionar) |

Não há `vercel.json` nem `.env.example`. `package.json` só tem `@supabase/supabase-js ^2.57.4`, engine Node >=20, sem scripts.

## Fluxo do formulário

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

## Estado entre etapas

Toda etapa acumula os campos no `localStorage` na chave **`futury_candidatura`** (objeto JSON compartilhado). A chave só é removida após resposta `200` do POST. Validação client-side via `alert()` + `event.preventDefault()`.

## API (`api/candidatura.js`)

- Handler Vercel, só aceita `POST` (`GET` → 405).
- Cria cliente Supabase com `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` de env.
- Valida no servidor apenas `nome_completo`, `nick`, `discord`.
- Insere payload em `candidatos` com `.insert([dados]).select().single()`.
- Sucesso → `200 {sucesso, mensagem, candidatura}`; erro → `500` com mensagem do Supabase.

## Schema implícito — tabela `candidatos`

Não existe arquivo `.sql` no repositório; colunas inferidas do payload montado em `js/candidatura-termo.js` (33 campos):

- Pessoal: `nome_completo`, `nick`, `discord`, `idade`, `data_nascimento` (YYYY-MM-DD), `genero`
- Conta: `tipo_conta`, `plataforma`, `acesso_conta`, `tempo_servidor`, `modo_interesse`, `horario_jogo`, `dias_jogo` (array)
- Perfil: `sobre_voce`, `bom_ajudante`, `destaque`, `jogador_toxico`, `suspeita_hack`, `amigo_regra`, `punicao_injusta`, `novo_jogador`, `experiencia_staff`, `servidor_anterior`, `cargo_anterior`, `tempo_staff`, `motivo_saida`
- Feedback: `avaliacao_servidor`, `avaliacao_equipe`, `avaliacao_organizacao`, `avaliacao_eventos`, `avaliacao_atualizacoes`, `melhorias`
- Preenchidas pelo painel depois: `status`, `avaliador`, `data_analise`

## Arquivos-chave

| Arquivo | Papel |
|---|---|
| `api/candidatura.js` | Único insert no banco |
| `js/candidatura-termo.js` | Monta payload final e faz o fetch |
| `js/candidatos.js`, `js/candidatura-conta.js`, `js/candidatura-perfil.js`, `js/candidatura-feedback.js` | Validação + persistência de cada etapa |
| `js/supabase.js` | Cliente Supabase com URL/key hardcoded — **código morto, não carregado** |
| `assets/js/staff.js`, `assets/css/staff.css` | Legado de landing antiga, não referenciados |

## Problemas conhecidos

- Botão "Voltar" da Etapa 2 (`candidatura-conta.html:874`) aponta para `candidatura.html` — página inexistente, deveria ser `candidatos.html`.
- Redirect de segurança em `candidatura-termo.js:54` também aponta para `candidatura.html`.
- Turnstile é decorativo: token nunca é coletado nem verificado na API.
- Anonymous key e URL do Supabase hardcoded no cliente (`js/supabase.js`); sem políticas RLS versionadas — estado real do RLS desconhecido.
- API sem rate-limit, sem sanitização e sem checagem de duplicidade de nick/Discord.
- Links sociais do footer da landing apontam para `#`.
- `assets/images/teste` (1 byte) é lixo acidental.

## Dependência com o painel

O painel (`futurycraft-painel-main`) lê a tabela `candidatos` e atualiza `status`/`avaliador`/`data_analise`. Eles compartilham o mesmo projeto Supabase — mudanças de schema/RLS afetam os dois.

## Camada de upgrade de design (`css/upgrade.css`)

Carregada por último em todas as 8 páginas via `<link>` adicionado antes de `</head>`. Não altera nenhuma função/JS. Conteúdo:

- Tokens globais (`:root` + `body`) que sobrescrevem os `var(--*)` usados pelas páginas de formulário.
- Base: fundo com gradientes deep-space, antialiasing, tipografia `text-wrap` balanceada/pretty.
- Acessibilidade: `:focus-visible` em interativos, `prefers-reduced-motion` desliga animações, `accent-color`, autofill escuro, scrollbar refinado.
- Cards: gradiente de superfície, borda interna superior iluminada, hover lift, sombra dupla.
- Botões: gradiente animado em `background-position`, active press, estado disabled, min-height 48px.
- Inputs/radios/checkboxes: foco com ring + glow, hover, checkbox/radio nativos com `accent-color`.
- Progresso: gradiente animado com sheen + glow.
- Validação: `.erro` ganha animação de shake.
- Responsivo extra: botões full-width ≤640px no formulário.