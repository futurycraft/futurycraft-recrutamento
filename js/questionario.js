/* ==========================================================
   FUTURYCRAFT
   QUESTIONARIOS POR VAGA x MINIGAME
   Etapa 3 (perfil) é renderizada dinamicamente a partir
   desta config. Cada string é um par:
   { id, secao, texto, dica, max }
   - id      : chave salva em localStorage (id no banco p/
               colunas legadas quando existem).
   - secao   : "sobre" (bloco Sobre você) ou "situacoes".
   - texto   : pergunta exibida.
   - dica    : placeholder.
   - max     : maxlength do textarea.
   Vaga fallback: "ajudante".
========================================================== */

(function(){
    const q = (list) => list;

    window.MODOS_QUESTIONARIO = ["Skyblock", "Rankup", "Survival"];
    window.VAGAS_QUESTIONARIO = ["Ajudante", "Moderador", "Admin"];

    window.QUESTIONARIO = {

        // ================================================
        // SKYBLOCK
        // ================================================
        Skyblock: {

            ajudante: q([
                {
                    id: "sobre_vc",
                    secao: "sobre",
                    texto: "Conte um pouco sobre você.",
                    dica: "Fale sobre sua idade, seu histórico no Skyblock e o que mais gosta de fazer na sua ilha.",
                    max: 800
                },
                {
                    id: "bom_ajudante",
                    secao: "sobre",
                    texto: "O que faz você acreditar que seria um bom Ajudante de Skyblock?",
                    dica: "Explique qualidades como paciência, comunicação e como você contribuiria com os jogadores do Skyblock.",
                    max: 800
                },
                {
                    id: "destaque",
                    secao: "sobre",
                    texto: "No atendimento aos jogadores de Skyblock, em que você se destaca?",
                    dica: "Ex: tirar dúvidas de farms e minions, resolver conflitos entre ilhas, apoiar jogadores novos.",
                    max: 600
                },
                {
                    id: "ajuda_modo",
                    secao: "sobre",
                    texto: "Como você ajudaria um jogador com dúvidas sobre mecânicas de Skyblock (minions, spawners, farms, economia de ilha)?",
                    dica: "Explique como explicaria as mecânicas para jogadores iniciantes e avançados.",
                    max: 700
                },
                {
                    id: "jogador_toxico",
                    secao: "situacoes",
                    texto: "Um jogador está sendo muito tóxico no chat e atrapalhando outras ilhas. O que você faria?",
                    dica: "Explique como conversaria com o jogador, quais medidas tomaria e como evitaria conflitos.",
                    max: 700
                },
                {
                    id: "suspeita_hack",
                    secao: "situacoes",
                    texto: "Você suspeita que um jogador esteja usando hack para farmar recursos no Skyblock, mas não tem provas. Como agiria?",
                    dica: "Explique como investigaria sem acusar injustamente o jogador.",
                    max: 700
                },
                {
                    id: "amigo_regra",
                    secao: "situacoes",
                    texto: "Um amigo seu está quebrando as regras dentro da sua coop ou de outra ilha. O que faria?",
                    dica: "Explique como manteria a imparcialidade mesmo sendo seu amigo.",
                    max: 700
                },
                {
                    id: "novo_jogador",
                    secao: "situacoes",
                    texto: "Um jogador novo no Skyblock pede ajuda enquanto você está ocupado resolvendo outra situação. Como organizaria seu atendimento?",
                    dica: "Explique como priorizaria os atendimentos mantendo uma boa experiência para todos.",
                    max: 700
                }
            ]),

            moderador: q([
                {
                    id: "trajetoria_ajudante",
                    secao: "sobre",
                    texto: "Conte sua trajetória como Ajudante no Skyblock: desde quando atua e o que mais fez pela equipe.",
                    dica: "Cite ações, atendimentos e o impacto que você teve nas ilhas e na staff.",
                    max: 800
                },
                {
                    id: "motivo_vaga",
                    secao: "sobre",
                    texto: "Por que você quer ser Moderador no Skyblock?",
                    dica: "Explique o que o diferencia e como essa função ajudaria o servidor.",
                    max: 800
                },
                {
                    id: "lideranca",
                    secao: "sobre",
                    texto: "Como você guiaria e daria suporte aos Ajudantes do Skyblock no dia a dia?",
                    dica: "Ex: tirar dúvidas de conduta, acompanhar atendimentos e nivelar a equipe.",
                    max: 700
                },
                {
                    id: "conflito_jogadores",
                    secao: "situacoes",
                    texto: "Duas ilhas estão em conflito (roubo de farms ou recursos) e cada dono acusa o outro. Como moderaria a situação?",
                    dica: "Explique como ouviria os dois lados, analisaria provas e tomaria uma decisão justa.",
                    max: 700
                },
                {
                    id: "erro_staff",
                    secao: "situacoes",
                    texto: "Se outro membro da staff aplicasse uma punição errada no Skyblock, como você lidaria?",
                    dica: "Explique como corrigiria sem expor o colega e mantendo a confiança da equipe.",
                    max: 700
                },
                {
                    id: "punicao_injusta",
                    secao: "situacoes",
                    texto: "Um jogador insiste que foi punido injustamente na economia ou na ilha dele. Como responderia?",
                    dica: "Explique como atenderia o jogador, revisaria a punição e daria uma resposta.",
                    max: 700
                },
                {
                    id: "abuso_poder",
                    secao: "situacoes",
                    texto: "Como trataria uma denúncia de abuso de poder de um Ajudante do Skyblock?",
                    dica: "Explique os passos de apuração, sigilo e encaminhamento.",
                    max: 700
                },
                {
                    id: "suspeita_hack",
                    secao: "situacoes",
                    texto: "Organize a apuração de uma suspeita de hack envolvendo vários jogadores do Skyblock.",
                    dica: "Explique como coletar evidências sem gerar acusações injustas.",
                    max: 700
                },
                {
                    id: "regra_modo",
                    secao: "situacoes",
                    texto: "Como definiria punições adequadas para quem destrói a coop de outra pessoa no Skyblock?",
                    dica: "Explique a gradação da punição e a reparação aos afetados.",
                    max: 700
                },
                {
                    id: "prioridades",
                    secao: "situacoes",
                    texto: "Como priorizaria atendimentos e punições em um dia movimentado no Skyblock?",
                    dica: "Explique sua escala de prioridade entre urgências, dúvidas e punições.",
                    max: 600
                }
            ]),

            admin: q([
                {
                    id: "trajetoria_moderador",
                    secao: "sobre",
                    texto: "Conte sua trajetória como Moderador no Skyblock: principais ações, melhorias e resultados.",
                    dica: "Cite decisões importantes e como você ajudou a manter a comunidade satisfeita.",
                    max: 800
                },
                {
                    id: "motivo_vaga",
                    secao: "sobre",
                    texto: "Por que você deseja ser Admin no Skyblock? O que pretende melhorar?",
                    dica: "Explique sua visão para a staff e para a comunidade do servidor.",
                    max: 800
                },
                {
                    id: "gestao_equipe",
                    secao: "sobre",
                    texto: "Como você organizaria a equipe do Skyblock (escalas, responsabilidades e cobrança)?",
                    dica: "Ex: divisão por horários e foco em denúncias, farms e economia de ilha.",
                    max: 700
                },
                {
                    id: "conflito_staff",
                    secao: "situacoes",
                    texto: "Como resolveria um conflito entre dois staffs do Skyblock?",
                    dica: "Explique mediação, ouvir os dois lados e decisão sem parcialidade.",
                    max: 700
                },
                {
                    id: "visao_melhorias",
                    secao: "situacoes",
                    texto: "Do ponto de vista da staff, o que você mudaria ou melhoraria no Skyblock?",
                    dica: "Cite 2-3 mudanças concretas que fariam a diferença para jogadores e equipe.",
                    max: 700
                },
                {
                    id: "abuso_staff",
                    secao: "situacoes",
                    texto: "Como agiria com um staff abusando de poder ou quebrando regras internas do servidor?",
                    dica: "Explique o rito de apuração e as consequências para manter a confiança da comunidade.",
                    max: 700
                },
                {
                    id: "punicao_grave",
                    secao: "situacoes",
                    texto: "Como definiria punições adequadas para quem usasse exploit ou duplicasse itens em larga escala no Skyblock?",
                    dica: "Explique análise do dano, gradação da punição e reparação aos afetados.",
                    max: 700
                },
                {
                    id: "recurso_jogador",
                    secao: "situacoes",
                    texto: "Como trataria um recurso de um jogador contra a decisão de um Moderador do Skyblock?",
                    dica: "Explique revisão imparcial e comunicação clara com o jogador.",
                    max: 700
                },
                {
                    id: "imparcialidade",
                    secao: "situacoes",
                    texto: "Como garantiria imparcialidade e transparência nas decisões da staff do Skyblock?",
                    dica: "Explique registros, critérios públicos e padronização de punições.",
                    max: 700
                },
                {
                    id: "riscos",
                    secao: "situacoes",
                    texto: "Quais riscos você enxerga para a integridade da economia e das ilhas do Skyblock? Como a staff deveria agir?",
                    dica: "Ex: dupe, abuso de coop, mercado paralelo. Explique como mitigar.",
                    max: 700
                }
            ])
        },

        // ================================================
        // RANKUP
        // ================================================
        Rankup: {

            ajudante: q([
                {
                    id: "sobre_vc",
                    secao: "sobre",
                    texto: "Conte um pouco sobre você.",
                    dica: "Fale sobre sua idade, seu histórico no Rankup e o que mais gosta de fazer no servidor.",
                    max: 800
                },
                {
                    id: "bom_ajudante",
                    secao: "sobre",
                    texto: "O que faz você acreditar que seria um bom Ajudante de Rankup?",
                    dica: "Explique qualidades como paciência, comunicação e como você contribuiria com os jogadores do Rankup.",
                    max: 800
                },
                {
                    id: "destaque",
                    secao: "sobre",
                    texto: "No atendimento aos jogadores de Rankup, em que você se destaca?",
                    dica: "Ex: tirar dúvidas de ranks e minas, orientar up de nível, apoiar jogadores novos.",
                    max: 600
                },
                {
                    id: "ajuda_modo",
                    secao: "sobre",
                    texto: "Como você ajudaria um jogador com dúvidas sobre o Rankup (como upar, kits, minas e privilégios de cada rank)?",
                    dica: "Explique como explicaria a progressão de ranks para iniciantes e avançados.",
                    max: 700
                },
                {
                    id: "jogador_toxico",
                    secao: "situacoes",
                    texto: "Um jogador está sendo muito tóxico no chat e atrapalhando a evolução de outros jogadores. O que você faria?",
                    dica: "Explique como conversaria com o jogador, quais medidas tomaria e como evitaria conflitos.",
                    max: 700
                },
                {
                    id: "suspeita_hack",
                    secao: "situacoes",
                    texto: "Você suspeita que um jogador esteja usando hack para upar rank ou farmar nas minas, mas não tem provas. Como agiria?",
                    dica: "Explique como investigaria sem acusar injustamente o jogador.",
                    max: 700
                },
                {
                    id: "amigo_regra",
                    secao: "situacoes",
                    texto: "Um amigo seu está quebrando as regras (ex: transferindo recursos de rank de forma indevida). O que faria?",
                    dica: "Explique como manteria a imparcialidade mesmo sendo seu amigo.",
                    max: 700
                },
                {
                    id: "novo_jogador",
                    secao: "situacoes",
                    texto: "Um jogador novo no Rankup pede ajuda enquanto você está ocupado resolvendo outra situação. Como organizaria seu atendimento?",
                    dica: "Explique como priorizaria os atendimentos mantendo uma boa experiência para todos.",
                    max: 700
                }
            ]),

            moderador: q([
                {
                    id: "trajetoria_ajudante",
                    secao: "sobre",
                    texto: "Conte sua trajetória como Ajudante no Rankup: desde quando atua e o que mais fez pela equipe.",
                    dica: "Cite ações, atendimentos e o impacto que você teve na comunidade do Rankup.",
                    max: 800
                },
                {
                    id: "motivo_vaga",
                    secao: "sobre",
                    texto: "Por que você quer ser Moderador no Rankup?",
                    dica: "Explique o que o diferencia e como essa função ajudaria o servidor.",
                    max: 800
                },
                {
                    id: "lideranca",
                    secao: "sobre",
                    texto: "Como você guiaria e daria suporte aos Ajudantes do Rankup no dia a dia?",
                    dica: "Ex: tirar dúvidas de conduta, acompanhar atendimentos e nivelar a equipe.",
                    max: 700
                },
                {
                    id: "conflito_jogadores",
                    secao: "situacoes",
                    texto: "Dois jogadores disputam uma área de mina e passaram a se atacar no chat. Como moderaria a situação?",
                    dica: "Explique como ouviria os dois lados, analisaria provas e tomaria uma decisão justa.",
                    max: 700
                },
                {
                    id: "erro_staff",
                    secao: "situacoes",
                    texto: "Se outro membro da staff aplicasse uma punição errada no Rankup, como você lidaria?",
                    dica: "Explique como corrigiria sem expor o colega e mantendo a confiança da equipe.",
                    max: 700
                },
                {
                    id: "punicao_injusta",
                    secao: "situacoes",
                    texto: "Um jogador insiste que perdeu o rank ou um privilégio injustamente. Como responderia?",
                    dica: "Explique como atenderia o jogador, revisaria a punição e daria uma resposta.",
                    max: 700
                },
                {
                    id: "abuso_poder",
                    secao: "situacoes",
                    texto: "Como trataria uma denúncia de abuso de poder de um Ajudante do Rankup?",
                    dica: "Explique os passos de apuração, sigilo e encaminhamento.",
                    max: 700
                },
                {
                    id: "suspeita_hack",
                    secao: "situacoes",
                    texto: "Organize a apuração de uma suspeita de hack envolvendo vários jogadores upando rank com velocidade suspeita.",
                    dica: "Explique como coletar evidências sem gerar acusações injustas.",
                    max: 700
                },
                {
                    id: "regra_modo",
                    secao: "situacoes",
                    texto: "Como definiria punições adequadas para quem usasse exploit para upar rank rápido demais?",
                    dica: "Explique a gradação da punição e o ajuste da progressão obtida indevidamente.",
                    max: 700
                },
                {
                    id: "prioridades",
                    secao: "situacoes",
                    texto: "Como priorizaria atendimentos e punições em um dia movimentado no Rankup?",
                    dica: "Explique sua escala de prioridade entre urgências, dúvidas e punições.",
                    max: 600
                }
            ]),

            admin: q([
                {
                    id: "trajetoria_moderador",
                    secao: "sobre",
                    texto: "Conte sua trajetória como Moderador no Rankup: principais ações, melhorias e resultados.",
                    dica: "Cite decisões importantes e como você ajudou a manter a comunidade satisfeita.",
                    max: 800
                },
                {
                    id: "motivo_vaga",
                    secao: "sobre",
                    texto: "Por que você deseja ser Admin no Rankup? O que pretende melhorar?",
                    dica: "Explique sua visão para a staff e para a comunidade do servidor.",
                    max: 800
                },
                {
                    id: "gestao_equipe",
                    secao: "sobre",
                    texto: "Como você organizaria a equipe do Rankup (escalas, responsabilidades e cobrança)?",
                    dica: "Ex: divisão por horários e foco em denúncias, economia e progressão de ranks.",
                    max: 700
                },
                {
                    id: "conflito_staff",
                    secao: "situacoes",
                    texto: "Como resolveria um conflito entre dois staffs do Rankup?",
                    dica: "Explique mediação, ouvir os dois lados e decisão sem parcialidade.",
                    max: 700
                },
                {
                    id: "visao_melhorias",
                    secao: "situacoes",
                    texto: "Do ponto de vista da staff, o que você mudaria ou melhoraria no Rankup?",
                    dica: "Cite 2-3 mudanças concretas que fariam a diferença para jogadores e equipe.",
                    max: 700
                },
                {
                    id: "abuso_staff",
                    secao: "situacoes",
                    texto: "Como agiria com um staff abusando de poder ou quebrando regras internas do servidor?",
                    dica: "Explique o rito de apuração e as consequências para manter a confiança da comunidade.",
                    max: 700
                },
                {
                    id: "punicao_grave",
                    secao: "situacoes",
                    texto: "Como definiria punições adequadas para quem usasse exploit ou duplicasse itens em larga escala no Rankup?",
                    dica: "Explique análise do dano, gradação da punição e reparação aos afetados.",
                    max: 700
                },
                {
                    id: "recurso_jogador",
                    secao: "situacoes",
                    texto: "Como trataria um recurso de um jogador contra a decisão de um Moderador do Rankup?",
                    dica: "Explique revisão imparcial e comunicação clara com o jogador.",
                    max: 700
                },
                {
                    id: "imparcialidade",
                    secao: "situacoes",
                    texto: "Como garantiria imparcialidade e transparência nas decisões da staff do Rankup?",
                    dica: "Explique registros, critérios públicos e padronização de punições.",
                    max: 700
                },
                {
                    id: "riscos",
                    secao: "situacoes",
                    texto: "Quais riscos você enxerga para a integridade da economia do Rankup? Como a staff deveria agir?",
                    dica: "Ex: venda de recursos, dupe, mercados paralelos. Explique como mitigar.",
                    max: 700
                }
            ])
        },

        // ================================================
        // SURVIVAL
        // ================================================
        Survival: {

            ajudante: q([
                {
                    id: "sobre_vc",
                    secao: "sobre",
                    texto: "Conte um pouco sobre você.",
                    dica: "Fale sobre sua idade, seu histórico no Survival e o que mais gosta de fazer (explorar, construir, comercializar).",
                    max: 800
                },
                {
                    id: "bom_ajudante",
                    secao: "sobre",
                    texto: "O que faz você acreditar que seria um bom Ajudante de Survival?",
                    dica: "Explique qualidades como paciência, comunicação e como você contribuiria com os jogadores do Survival.",
                    max: 800
                },
                {
                    id: "destaque",
                    secao: "sobre",
                    texto: "No atendimento aos jogadores de Survival, em que você se destaca?",
                    dica: "Ex: tirar dúvidas de proteção e towns, resolver conflitos, apoiar jogadores novos.",
                    max: 600
                },
                {
                    id: "ajuda_modo",
                    secao: "sobre",
                    texto: "Como você ajudaria um jogador com dúvidas sobre o Survival (proteção de terreno, towns, comércio)?",
                    dica: "Explique como explicaria as mecânicas do survival para iniciantes e avançados.",
                    max: 700
                },
                {
                    id: "jogador_toxico",
                    secao: "situacoes",
                    texto: "Um jogador está sendo muito tóxico no chat e assediando outros jogadores. O que você faria?",
                    dica: "Explique como conversaria com o jogador, quais medidas tomaria e como evitaria conflitos.",
                    max: 700
                },
                {
                    id: "suspeita_hack",
                    secao: "situacoes",
                    texto: "Você suspeita que um jogador esteja usando hack (x-ray) para achar bases, mas não tem provas. Como agiria?",
                    dica: "Explique como investigaria sem acusar injustamente o jogador.",
                    max: 700
                },
                {
                    id: "amigo_regra",
                    secao: "situacoes",
                    texto: "Um amigo seu está quebrando as regras dentro de um town ou de outra proteção. O que faria?",
                    dica: "Explique como manteria a imparcialidade mesmo sendo seu amigo.",
                    max: 700
                },
                {
                    id: "novo_jogador",
                    secao: "situacoes",
                    texto: "Um jogador novo no Survival pede ajuda enquanto você está ocupado resolvendo outra situação. Como organizaria seu atendimento?",
                    dica: "Explique como priorizaria os atendimentos mantendo uma boa experiência para todos.",
                    max: 700
                }
            ]),

            moderador: q([
                {
                    id: "trajetoria_ajudante",
                    secao: "sobre",
                    texto: "Conte sua trajetória como Ajudante no Survival: desde quando atua e o que mais fez pela equipe.",
                    dica: "Cite ações, atendimentos e o impacto que você teve na comunidade do Survival.",
                    max: 800
                },
                {
                    id: "motivo_vaga",
                    secao: "sobre",
                    texto: "Por que você quer ser Moderador no Survival?",
                    dica: "Explique o que o diferencia e como essa função ajudaria o servidor.",
                    max: 800
                },
                {
                    id: "lideranca",
                    secao: "sobre",
                    texto: "Como você guiaria e daria suporte aos Ajudantes do Survival no dia a dia?",
                    dica: "Ex: tirar dúvidas de conduta, acompanhar atendimentos e nivelar a equipe.",
                    max: 700
                },
                {
                    id: "conflito_jogadores",
                    secao: "situacoes",
                    texto: "Dois jogadores brigam por um terreno ou por um claim sobreposto. Como moderaria a situação?",
                    dica: "Explique como ouviria os dois lados, analisaria provas e tomaria uma decisão justa.",
                    max: 700
                },
                {
                    id: "erro_staff",
                    secao: "situacoes",
                    texto: "Se outro membro da staff aplicasse uma punição errada no Survival, como você lidaria?",
                    dica: "Explique como corrigiria sem expor o colega e mantendo a confiança da equipe.",
                    max: 700
                },
                {
                    id: "punicao_injusta",
                    secao: "situacoes",
                    texto: "Um jogador insiste que foi punido injustamente por suposto grief. Como responderia?",
                    dica: "Explique como atenderia o jogador, revisaria a punição e daria uma resposta.",
                    max: 700
                },
                {
                    id: "abuso_poder",
                    secao: "situacoes",
                    texto: "Como trataria uma denúncia de abuso de poder de um Ajudante do Survival?",
                    dica: "Explique os passos de apuração, sigilo e encaminhamento.",
                    max: 700
                },
                {
                    id: "suspeita_hack",
                    secao: "situacoes",
                    texto: "Organize a apuração de uma suspeita de hack envolvendo vários jogadores usando x-ray para achar bases.",
                    dica: "Explique como coletar evidências sem gerar acusações injustas.",
                    max: 700
                },
                {
                    id: "regra_modo",
                    secao: "situacoes",
                    texto: "Como definiria punições adequadas para quem faz grief em uma town ou em uma proteção?",
                    dica: "Explique a gradação da punição e a reparação aos afetados.",
                    max: 700
                },
                {
                    id: "prioridades",
                    secao: "situacoes",
                    texto: "Como priorizaria atendimentos e punições em um dia movimentado no Survival?",
                    dica: "Explique sua escala de prioridade entre urgências, dúvidas e punições.",
                    max: 600
                }
            ]),

            admin: q([
                {
                    id: "trajetoria_moderador",
                    secao: "sobre",
                    texto: "Conte sua trajetória como Moderador no Survival: principais ações, melhorias e resultados.",
                    dica: "Cite decisões importantes e como você ajudou a manter a comunidade satisfeita.",
                    max: 800
                },
                {
                    id: "motivo_vaga",
                    secao: "sobre",
                    texto: "Por que você deseja ser Admin no Survival? O que pretende melhorar?",
                    dica: "Explique sua visão para a staff e para a comunidade do servidor.",
                    max: 800
                },
                {
                    id: "gestao_equipe",
                    secao: "sobre",
                    texto: "Como você organizaria a equipe do Survival (escalas, responsabilidades e cobrança)?",
                    dica: "Ex: divisão por horários e foco em denúncias, proteções e comércio.",
                    max: 700
                },
                {
                    id: "conflito_staff",
                    secao: "situacoes",
                    texto: "Como resolveria um conflito entre dois staffs do Survival?",
                    dica: "Explique mediação, ouvir os dois lados e decisão sem parcialidade.",
                    max: 700
                },
                {
                    id: "visao_melhorias",
                    secao: "situacoes",
                    texto: "Do ponto de vista da staff, o que você mudaria ou melhoraria no Survival?",
                    dica: "Cite 2-3 mudanças concretas que fariam a diferença para jogadores e equipe.",
                    max: 700
                },
                {
                    id: "abuso_staff",
                    secao: "situacoes",
                    texto: "Como agiria com um staff abusando de poder ou quebrando regras internas do servidor?",
                    dica: "Explique o rito de apuração e as consequências para manter a confiança da comunidade.",
                    max: 700
                },
                {
                    id: "punicao_grave",
                    secao: "situacoes",
                    texto: "Como definiria punições adequadas para quem fizesse grief em larga escala ou duplicasse itens na economia do Survival?",
                    dica: "Explique análise do dano, gradação da punição e reparação aos afetados.",
                    max: 700
                },
                {
                    id: "recurso_jogador",
                    secao: "situacoes",
                    texto: "Como trataria um recurso de um jogador contra a decisão de um Moderador do Survival?",
                    dica: "Explique revisão imparcial e comunicação clara com o jogador.",
                    max: 700
                },
                {
                    id: "imparcialidade",
                    secao: "situacoes",
                    texto: "Como garantiria imparcialidade e transparência nas decisões da staff do Survival?",
                    dica: "Explique registros, critérios públicos e padronização de punições.",
                    max: 700
                },
                {
                    id: "riscos",
                    secao: "situacoes",
                    texto: "Quais riscos você enxerga para a integridade das proteções e towns do Survival? Como a staff deveria agir?",
                    dica: "Ex: grief em larga escala, mercado paralelo, exploit de proteção. Explique como mitigar.",
                    max: 700
                }
            ])
        }
    };
})();