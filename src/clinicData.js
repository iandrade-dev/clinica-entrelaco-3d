/**
 * Dados completos dos ambientes da Clínica Entrelaço — Psicologia & Saúde Mental.
 * Inclui especificações arquitetônicas, acessibilidade (ABNT NBR 9050),
 * privacidade/sigilo/acolhimento e normas da Prefeitura, ANVISA e CFP.
 */

export const CLINIC_INFO = {
  name: "Clínica Entrelaço",
  subtitle: "Psicologia & Saúde Mental",
  totalArea: "192 m² (16m × 12m)",
  proposal:
    "Clínica de psicologia com foco em atendimento humanizado, acessível e ético, reunindo cinco abordagens: Gestalt (Ana), Existencialista (Julia), TCC (Lari), Psicodrama (Camilly) e Sistêmica (Maria Eduarda), em salas individuais, Sala Infantil e Sala de Psicodrama.",
};

export const ROOMS = [
  {
    id: "entrada-acessivel",
    name: "Entrada & Rampa Acessível",
    shortLabel: "Entrada PCD",
    category: "Acessibilidade & Fachada",
    area: "14,0 m²",
    badgeColor: "#10b981",
    position: { x: 0, y: 1.2, z: 7.4 },
    cameraPos: { x: 4.5, y: 3.4, z: 12.2 },
    cameraTarget: { x: 0, y: 0.9, z: 7.2 },
    summary:
      "Acesso principal sem barreiras arquitetônicas, com rampa suave, corrimãos em duas alturas, piso tátil direcional e de alerta, além de estacionamento/embarque acessível.",
    acolhimento: [
      "Marquise de proteção contra sol e chuva na chegada do paciente.",
      "Paisagismo com vegetação natural para reduzir a sensação hospitalar fria e transmitir acolhimento desde a calçada.",
      "Dispenser de álcool em gel 70% logo no hall de entrada.",
    ],
    acessibilidade: [
      "Rampa com inclinação máxima de 8,33% (ABNT NBR 9050), com patamar plano de 1,50m × 1,50m antes da porta.",
      "Corrimãos bilaterais contínuos em duas alturas: 0,70m e 0,92m, com prolongamento de 0,30m nas extremidades.",
      "Piso tátil de alerta no início/término da rampa e piso tátil direcional até o balcão da recepção.",
      "Porta de entrada dupla com vão livre mínimo de 1,00m (superior aos 0,80m exigidos).",
    ],
    normas: {
      prefeitura: [
        "Código de Obras Municipal e Lei Brasileira de Inclusão (Lei nº 13.146/2015): obrigatoriedade de rota acessível desde a via pública até todos os ambientes.",
        "ABNT NBR 9050: parâmetros de inclinação de rampas, largura mínima de circulação e sinalização tátil.",
        "Alvará de Funcionamento e Auto de Vistoria do Corpo de Bombeiros (AVCB) com rota de fuga desobstruída.",
      ],
      anvisa: [
        "RDC 50/2002 (ANVISA): acesso de pacientes compatível com macas/cadeiras de rodas e pisos antiderrapantes, lisos e laváveis.",
        "RDC 63/2011: higiene na entrada e controle de vetores (barreiras físicas e telas).",
      ],
      cfp: [
        "Decreto nº 5.296/2004 e orientações do CFP sobre acessibilidade plena: garantir que pessoas com deficiência física, visual ou mobilidade reduzida acessem o serviço sem constrangimento.",
      ],
    },
  },
  {
    id: "recepcao",
    name: "Recepção & Sala de Espera",
    shortLabel: "Recepção",
    category: "Recepção & Acolhimento",
    area: "40,0 m²",
    badgeColor: "#3b82f6",
    position: { x: -4.0, y: 1.5, z: 3.6 },
    cameraPos: { x: -0.6, y: 3.1, z: 6.2 },
    cameraTarget: { x: -4.2, y: 1.0, z: 3.2 },
    summary:
      "Primeiro ponto de contato do paciente com a clínica. Projetada para unir acolhimento sensorial, discrição no atendimento cadastral e acessibilidade universal.",
    acolhimento: [
      "Iluminação indireta e quente (2700K–3000K), paleta de cores suaves (tons terrosos, bege e verde-sálvia) e plantas naturais.",
      "Mobiliário confortável (sofá estofado e poltronas individuais com espaçamento) e tapete macio na área de estar.",
      "Divisória acústica com jardineira entre o balcão de triagem e os assentos de espera, evitando exposição de conversas.",
      "Música ambiente suave para mascaramento sonoro leve e redução da ansiedade pré-sessão.",
    ],
    acessibilidade: [
      "Balcão de recepção com módulo rebaixado a 0,75m–0,85m de altura e recuo inferior livre (≥ 0,30m) para aproximação frontal de cadeira de rodas (NBR 9050).",
      "Assentos reservados para Pessoas com Deficiência (PCD), obesos (assento largo) e gestantes/idosos sinalizados.",
      "Totem e placas com contraste visual e texto ampliado para orientação.",
    ],
    normas: {
      prefeitura: [
        "Código de Obras: ventilação e iluminação adequadas (natural ou mecânica conforme PMOC) e pé-direito mínimo regulamentar (≥ 2,70m).",
        "Lei nº 12.291/2010: exemplar do Código de Defesa do Consumidor (CDC) disponível em local visível.",
      ],
      anvisa: [
        "RDC 50/2002: área de recepção/espera dimensionada proporcionalmente ao número de consultórios (mín. ~1,2 m² por pessoa).",
        "RDC 63/2011: ponto de higienização das mãos (álcool 70%), superfícies laváveis e fluxo organizado sem cruzamento com área suja/resíduos.",
      ],
      cfp: [
        "Código de Ética Profissional do Psicólogo (Art. 9º — Sigilo): atendimento na recepção sem perguntas invasivas em voz alta; agendamento e confirmação discretos (por nome social ou senha).",
        "Resolução CFP nº 13/2022: disponibilização obrigatória de exemplar do Código de Ética Profissional do Psicólogo para consulta pública.",
        "LGPD (Lei 13.709/2018) e CFP: telas de computador voltadas apenas para a recepcionista, sem exposição de agenda ou dados clínicos.",
      ],
    },
  },
  {
    id: "corredor-acessivel",
    name: "Corredor Principal & Circulação",
    shortLabel: "Circulação",
    category: "Acessibilidade & Segurança",
    area: "28,8 m²",
    badgeColor: "#6366f1",
    position: { x: 0, y: 1.4, z: 0.1 },
    cameraPos: { x: -6.8, y: 2.2, z: 0.1 },
    cameraTarget: { x: 4.0, y: 1.2, z: 0.1 },
    summary:
      "Eixo de distribuição com 1,80m de largura livre que conecta a recepção aos consultórios, sala de grupos e sanitários, garantindo fluxo seguro, silencioso e acessível.",
    acolhimento: [
      "Iluminação difusa sem ofuscamento e sinalização clara das salas para reduzir desorientação.",
      "Sistema discreto de mascaramento sonoro (ruído branco suave) no forro para reforçar a privacidade acústica das portas.",
    ],
    acessibilidade: [
      "Largura livre de 1,80m (acima dos 1,20m–1,50m mínimos da NBR 9050), permitindo cruzamento de duas cadeiras de rodas e giro de 360° (diâmetro 1,50m).",
      "Corrimão contínuo em trecho de apoio e piso plano antiderrapante sem degraus ou desníveis.",
      "Placas de identificação das salas com texto ampliado, pictograma e Braille na altura entre 1,20m e 1,60m.",
    ],
    normas: {
      prefeitura: [
        "Corpo de Bombeiros / Prefeitura: iluminação de emergência, placa fotoluminescente/iluminada de 'SAÍDA', extintor e kit de primeiros socorros visível.",
        "ABNT NBR 9050: largura mínima de corredores de uso público e sinalização tátil/visual.",
      ],
      anvisa: [
        "RDC 50/2002: circulação interna com largura mínima para trânsito seguro de pacientes em cadeira de rodas ou maca de emergência.",
        "Revestimento de piso monolítico ou com rejunte mínimo lavável.",
      ],
      cfp: [
        "Art. 1º, alínea 'c' e Art. 9º do Código de Ética: o corredor funciona como zona de transição acústica, evitando que quem aguarda ou circula ouça o conteúdo das sessões.",
      ],
    },
  },
  {
    id: "consultorio-1",
    name: "Consultório 01 — Gestalt-Terapia (Ana)",
    shortLabel: "Consultório 1 (Ana)",
    category: "Sala Normal • Gestalt-Terapia",
    area: "17,7 m²",
    badgeColor: "#8b5cf6",
    position: { x: -6.3, y: 1.4, z: -3.4 },
    cameraPos: { x: -4.8, y: 2.8, z: -1.3 },
    cameraTarget: { x: -6.4, y: 0.9, z: -4.0 },
    summary:
      "Sala de psicoterapia individual da psicóloga Ana (Gestalt-Terapia), com 17,7 m² (acima do mínimo de 7,5 m² da ANVISA). Poltrona frente a frente ao sofá, relógio discreto atrás do paciente, iluminação quente e isolamento acústico.",
    acolhimento: [
      "Disposição em ângulo de 45°–90° entre psicólogo e paciente, evitando postura confrontativa e favorecendo o vínculo terapêutico.",
      "Luminária de piso com luz quente indireta, tapete aconchegante, plantas e estante com livros.",
      "Janela com persiana/película jateada que garante luz natural sem exposição visual externa.",
    ],
    acessibilidade: [
      "Porta maciça com vão livre de 0,90m, maçaneta tipo alavanca (NBR 9050) e espaço livre de giro de 1,50m no interior da sala.",
      "Mobiliário posicionado de modo que o paciente cadeirante escolha permanecer na cadeira de rodas ou transferir-se com facilidade.",
    ],
    normas: {
      prefeitura: [
        "Código de Obras: área de 23,4 m² (muito superior ao mínimo de 7,5 m²), ventilação cruzada/climatização e iluminação natural.",
      ],
      anvisa: [
        "RDC 50/2002: consultório indiferenciado (mínimo 7,5 m² e dimensão mínima 2,20m); paredes e pisos lisos, laváveis e resistentes à desinfecção.",
        "RDC 63/2011: limpeza concorrente e terminal entre atendimentos e manutenção de ar-condicionado (PMOC).",
      ],
      cfp: [
        "Código de Ética (Art. 1º 'c' e Art. 9º): vedação acústica de porta e paredes (drywall duplo com lã de rocha) para garantir sigilo absoluto.",
        "Resolução CFP nº 01/2009: armário metálico/madeira com chave exclusiva sob responsabilidade do psicólogo para guarda de prontuários físicos por no mínimo 5 anos, além de fragmentadora de papel para descarte seguro de rascunhos.",
      ],
    },
  },
  {
    id: "consultorio-2",
    name: "Sala Infantil — Ludoterapia & TCC (Lari)",
    shortLabel: "Sala Infantil (Lari)",
    category: "Sala Infantil",
    area: "17,7 m²",
    badgeColor: "#ec4899",
    position: { x: -2.9, y: 1.4, z: -3.4 },
    cameraPos: { x: -1.4, y: 2.8, z: -1.3 },
    cameraTarget: { x: -2.9, y: 0.8, z: -3.9 },
    summary:
      "Espaço lúdico da psicóloga Lari (TCC e atendimento infantil), com 17,7 m², mobiliário na escala da criança, brinquedos laváveis e segurança física.",
    acolhimento: [
      "Mesa de atividades baixa, almofadas no chão, tapete macio lavável e cesto organizado com brinquedos e jogos simbólicos.",
      "Cores suaves e estimulantes na medida certa, evitando sobrecarga sensorial (importante também para crianças neurodivergentes / TEA).",
      "Estante aberta na altura da criança para autonomia na escolha dos recursos lúdicos.",
    ],
    acessibilidade: [
      "Porta de 0,90m com maçaneta alavanca e circulação livre de obstáculos pontiagudos.",
      "Cantos arredondados nos móveis e tomadas com protetor infantil.",
    ],
    normas: {
      prefeitura: [
        "Segurança predial e Código de Obras: janelas com trava/limitador de abertura e proteção contra acidentes.",
      ],
      anvisa: [
        "RDC 50/2002 e RDC 63/2011: brinquedos e superfícies em materiais laváveis e atóxicos, permitindo higienização frequente após o uso.",
      ],
      cfp: [
        "Orientações do CFP (Art. 1º 'c'): atendimento infantil exige espaço seguro, adequado à faixa etária e equipado com materiais lúdicos diversos, mantendo o mesmo rigor de sigilo acústico e visual.",
      ],
    },
  },
  {
    id: "consultorio-3",
    name: "Consultório 03 — Existencialista (Julia)",
    shortLabel: "Consultório 3 (Julia)",
    category: "Sala Normal • Existencialista",
    area: "17,7 m²",
    badgeColor: "#f59e0b",
    position: { x: 0.5, y: 1.4, z: -3.4 },
    cameraPos: { x: 1.8, y: 2.8, z: -1.3 },
    cameraTarget: { x: 0.4, y: 0.9, z: -4.0 },
    summary:
      "Consultório individual da psicóloga Julia (Psicologia Existencialista), com mesa de apoio, iluminação natural filtrada por película jateada, poltronas acolhedoras e armário trancado para prontuários.",
    acolhimento: [
      "Ambiente silencioso e reflexivo com iluminação uniforme e plantas naturais.",
      "Disposição acolhedora que favorece a escuta fenomenológico-existencial.",
    ],
    acessibilidade: [
      "Porta de 0,90m com maçaneta alavanca e espaço livre de giro de 1,50m (NBR 9050).",
      "Mesa com altura livre inferior adequada para encaixe de cadeira de rodas.",
    ],
    normas: {
      prefeitura: [
        "Conformidade com metragem mínima (17,7 m² > 7,5 m²), iluminação e ventilação municipal.",
      ],
      anvisa: [
        "RDC 50/2002 e RDC 63/2011: superfícies lisas, laváveis e higienizáveis.",
      ],
      cfp: [
        "Código de Ética (Art. 1º 'c' e Art. 9º): isolamento acústico e privacidade visual.",
        "Resolução CFP nº 01/2009: guarda sigilosa de prontuários em armário trancado.",
      ],
    },
  },
  {
    id: "consultorio-4",
    name: "Consultório 04 — Sistêmica (Maria Eduarda)",
    shortLabel: "Consultório 4 (M. Eduarda)",
    category: "Sala Normal • Sistêmica (Adulto e Adolescente)",
    area: "17,7 m²",
    badgeColor: "#eab308",
    position: { x: 3.9, y: 1.4, z: -3.4 },
    cameraPos: { x: 5.2, y: 2.8, z: -1.3 },
    cameraTarget: { x: 3.8, y: 0.9, z: -4.0 },
    summary:
      "Consultório da psicóloga Maria Eduarda (Terapia Sistêmica), voltado ao atendimento individual de adultos e adolescentes, com escuta sistêmica, acolhimento e privacidade.",
    acolhimento: [
      "Ambiente confortável e acolhedor para atendimento individual de adultos e adolescentes.",
      "Iluminação uniforme e regulável, garantindo conforto visual e tranquilidade durante as sessões.",
    ],
    acessibilidade: [
      "Mesa de avaliação com altura livre inferior (≥ 0,73m) permitindo encaixe frontal de cadeira de rodas (NBR 9050).",
      "Porta de 0,90m e área de manobra desimpedida.",
    ],
    normas: {
      prefeitura: [
        "Conformidade com metragem mínima, iluminação e conforto térmico/acústico municipal.",
      ],
      anvisa: [
        "RDC 50/2002 e RDC 63/2011: mobiliário ergonômico, superfícies higienizáveis e organização documental.",
      ],
      cfp: [
        "Resolução CFP nº 31/2022 (Avaliação Psicológica) e SATEPSI: mobiliário adequado (mesa ampla e cadeiras ergonômicas) e armário trancado exclusivo para guarda sigilosa de testes psicológicos privativos e protocolos.",
        "Resolução CFP nº 01/2009: registro documental e prontuário protegido contra acesso de terceiros.",
      ],
    },
  },
  {
    id: "espaco-coletivo",
    name: "Sala de Psicodrama (Camilly)",
    shortLabel: "Psicodrama",
    category: "Sala de Psicodrama • Espaço Coletivo",
    area: "27,5 m²",
    badgeColor: "#0ea5e9",
    position: { x: 2.75, y: 1.5, z: 3.5 },
    cameraPos: { x: 0.6, y: 3.1, z: 5.8 },
    cameraTarget: { x: 3.0, y: 1.0, z: 3.2 },
    summary:
      "Sala dedicada ao Psicodrama (Camilly), sociodrama e dramatizações terapêuticas. Sem mesas fixas no centro, conta com palco circular delimitado no piso, semicírculo de cadeiras leves, cadeira vazia, almofadas de projeção e caixa de adereços.",
    acolhimento: [
      "Palco circular delimitado no chão (cenário moreniano) separando simbolicamente o espaço da ação dramática e o espaço do compartilhamento.",
      "Cadeiras leves em semicírculo para o grupo/plateia e uma cadeira vazia em cena (técnica de dramatização e inversão de papéis).",
      "Almofadas de projeção e cesto de adereços/tecidos junto à parede, além de luminária de piso quente para cenas introspectivas.",
    ],
    acessibilidade: [
      "Porta dupla / larga (1,00m) e layout flexível que acomoda facilmente múltiplos usuários em cadeira de rodas no círculo.",
      "Boa acústica interna (painéis/plantas) facilitando a compreensão para pessoas com perda auditiva.",
    ],
    normas: {
      prefeitura: [
        "Código de Obras: dimensionamento proporcional à lotação máxima (~1,5 m² por participante), ventilação renovada e sinalização de saída.",
      ],
      anvisa: [
        "RDC 50/2002: sala de reuniões/atividades em grupo com renovação de ar adequada e superfícies laváveis.",
      ],
      cfp: [
        "Código de Ética (Art. 9º): contrato de sigilo grupal e isolamento acústico da sala para que o conteúdo compartilhado pelo grupo não vaze para a recepção.",
      ],
    },
  },
  {
    id: "sanitario-pcd",
    name: "Sanitário Acessível (PCD)",
    shortLabel: "Sanitário PCD",
    category: "Acessibilidade & ANVISA",
    area: "11,25 m²",
    badgeColor: "#14b8a6",
    position: { x: 6.75, y: 1.4, z: -3.75 },
    cameraPos: { x: 5.8, y: 2.9, z: -1.4 },
    cameraTarget: { x: 6.9, y: 0.9, z: -4.2 },
    summary:
      "Sanitário unissex totalmente adaptado conforme a ABNT NBR 9050 e RDC 50/2002, com área de transferência, barras de apoio, lavatório acessível e alarme de emergência.",
    acolhimento: [
      "Ambiente amplo, bem iluminado, com ventilação permanente e sinalização inclusiva.",
    ],
    acessibilidade: [
      "Área de giro de 360° (diâmetro de 1,50m) livre de obstáculos dentro do sanitário.",
      "Bacia sanitária com altura entre 0,43m e 0,45m e barras de apoio horizontais (0,80m de comprimento a 0,75m do piso) na parede lateral e de fundo.",
      "Lavatório sem coluna suspenso (altura 0,78m–0,80m) com torneira de alavanca/sensor e espelho inclinado a 10°.",
      "Porta com vão livre de 0,90m abrindo para fora (ou de correr) com puxador horizontal interno e botão de alarme de emergência a 0,40m do piso.",
    ],
    normas: {
      prefeitura: [
        "ABNT NBR 9050 e Decreto nº 5.296/2004: item eliminatório na vistoria do Alvará da Prefeitura.",
      ],
      anvisa: [
        "RDC 50/2002: presença obrigatória de sanitário acessível aos pacientes; piso antiderrapante e impermeável, paredes laváveis até o teto, lixeira com tampa e pedal, sabonete líquido e papel-toalha.",
      ],
      cfp: [
        "Garantia de dignidade, autonomia e privacidade para todos os pacientes atendidos na clínica.",
      ],
    },
  },
  {
    id: "copa-apoio",
    name: "Copa, Apoio & Gestão de Resíduos",
    shortLabel: "Copa & Apoio",
    category: "Infraestrutura ANVISA",
    area: "12,5 m²",
    badgeColor: "#64748b",
    position: { x: 6.75, y: 1.4, z: 3.5 },
    cameraPos: { x: 5.7, y: 2.9, z: 5.6 },
    cameraTarget: { x: 6.9, y: 1.0, z: 3.3 },
    summary:
      "Área restrita à equipe para pausas, preparo de café/chá e gerenciamento adequado de resíduos conforme o PGRSS.",
    acolhimento: [
      "Espaço de descompressão para os psicólogos entre atendimentos, promovendo saúde ocupacional da equipe.",
    ],
    acessibilidade: [
      "Circulação desobstruída e bancada ergonômica.",
    ],
    normas: {
      prefeitura: [
        "Código de Obras: ponto de água, esgoto e ventilação adequados.",
      ],
      anvisa: [
        "RDC 222/2018 (PGRSS): separação de resíduos comuns e recicláveis (lixeira de coleta seletiva) e local específico para armazenamento temporário sem contato com áreas de atendimento.",
        "RDC 63/2011: separação entre área de preparo de alimentos da equipe e guarda de produtos de limpeza (DML).",
      ],
      cfp: [
        "Área restrita à equipe, evitando circulação de pacientes em zonas de apoio técnico.",
      ],
    },
  },
];
