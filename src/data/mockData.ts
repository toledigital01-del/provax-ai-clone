import { Question, Flashcard, ProgressData, SubscriptionPlan, StudySchedule } from '../types';

export const INITIAL_PROGRESS: ProgressData = {
  daysConsecutive: 5,
  currentApprovalProbability: 48.5, // 48.5%
  overallAccuracyRate: 64.2,
  totalQuestionsAnswered: 134,
  totalCorrect: 86,
  totalIncorrect: 48,
  minutosHoje: 0,
  minutosHojeData: new Date().toISOString().split('T')[0],
  syllabusCoverage: 28.0,
  disciplinePerformance: {
    'Língua Portuguesa': { total: 30, correct: 21, efficiency: 70, status: 'safe' },
    'Raciocínio Lógico-Matemático': { total: 8, correct: 7, efficiency: 87, status: 'safe' },
    'Informática': { total: 4, correct: 4, efficiency: 100, status: 'safe' },
    'Física': { total: 5, correct: 1, efficiency: 20, status: 'critical' },
    'Ética e Cidadania': { total: 0, correct: 0, efficiency: 0, status: 'critical' },
    'Geopolítica': { total: 0, correct: 0, efficiency: 0, status: 'critical' },
    'Língua Estrangeira': { total: 0, correct: 0, efficiency: 0, status: 'critical' },
    'Legislação de Trânsito': { total: 45, correct: 25, efficiency: 55, status: 'warning' },
    'Direito Administrativo': { total: 15, correct: 9, efficiency: 60, status: 'warning' },
    'Direito Constitucional': { total: 20, correct: 15, efficiency: 75, status: 'safe' },
    'Direito Penal': { total: 6, correct: 3, efficiency: 50, status: 'warning' },
    'Direito Processual Penal': { total: 6, correct: 2, efficiency: 33, status: 'critical' },
    'Legislação Especial': { total: 0, correct: 0, efficiency: 0, status: 'critical' },
    'Direitos Humanos': { total: 0, correct: 0, efficiency: 0, status: 'critical' },
  },
  studyStreakHistory: ['2026-05-15', '2026-05-16', '2026-05-17', '2026-05-18', '2026-05-19'],
};

export const PRF_QUESTIONS: Question[] = [
  {
    id: 'q1',
    discipline: 'Legislação de Trânsito',
    subtopic: 'Dos Crimes de Trânsito - Embriaguez',
    statement: 'De acordo com o Código de Trânsito Brasileiro (CTB), conduzir veículo automotor com capacidade psicomotora alterada em razão da influência de álcool dita infração penal, cuja constatação pode ser obtida por meio de teste de etilômetro, exame de sangue, ou ainda por sinais que indiquem alteração da capacidade, nos termos regulamentados pelo CONTRAN.',
    correctAnswer: 'C',
    difficulty: 'Média',
    explanation: 'Correto. O art. 306 do CTB e a Resolução nº 432 do CONTRAN preveem que a infração penal de embriaguez ao volante pode ser constatada por etilômetro (bafômetro) com medição igual ou superior a 0,34 miligrama de álcool por litro de ar alveolar expirado, exame de sangue igual ou superior a 6 decigramas de álcool por litro de sangue, ou por prova testemunhal e conjunto de sinais de alteração.'
  },
  {
    id: 'q2',
    discipline: 'Legislação de Trânsito',
    subtopic: 'Do Sistema Nacional de Trânsito (SNT)',
    statement: 'A Polícia Rodoviária Federal é órgão integrante do Sistema Nacional de Trânsito, competindo-lhe, no âmbito de atuação das rodovias e estradas federais, fiscalizar o trânsito, aplicar penalidades, e arrecadar as multas respectivas das infrações que cometerem os condutores.',
    correctAnswer: 'C',
    difficulty: 'Fácil',
    explanation: 'Correto. Conforme o Art. 20, inciso VI do CTB, compete à Polícia Rodoviária Federal arrecadar as multas das rodovias federais. Além disso, a PRF integra o SNT (Art. 7º, III do CTB).'
  },
  {
    id: 'q3',
    discipline: 'Direito Constitucional',
    subtopic: 'Da Segurança Pública (Art. 144)',
    statement: 'A Polícia Rodoviária Federal, órgão permanente, estruturado em carreira e mantido exclusivamente pelos estados-membros onde atua, destina-se, na forma da lei, ao patrulhamento ostensivo das rodovias federais.',
    correctAnswer: 'E',
    difficulty: 'Média',
    explanation: 'Incorreto. A Polícia Rodoviária Federal é mantida pela UNIÃO, e não pelos estados-membros. O art. 144, § 2º da CF dispõe que a PRF é mantida pela União e destina-se, na forma da lei, ao patrulhamento ostensivo das rodovias federais.'
  },
  {
    id: 'q4',
    discipline: 'Direito Penal',
    subtopic: 'Aplicação da Lei Penal',
    statement: 'Considera-se praticado o crime no momento do resultado, sendo irrelevante o momento da ação ou omissão, conforme adota o Código Penal brasileiro no critério da ubiquidade.',
    correctAnswer: 'E',
    difficulty: 'Difícil',
    explanation: 'Incorreto. O Código Penal adota a teoria da atividade para definir o TEMPO do crime (Art. 4º - considera-se praticado o crime no momento da ação ou omissão, ainda que outro seja o momento do resultado). A teoria da UBIQUIDADE é adotada para o LUGAR do crime (Art. 6º).'
  },
  {
    id: 'q5',
    discipline: 'Direito Administrativo',
    subtopic: 'Atos Administrativos',
    statement: 'O ato administrativo de interdição de um estabelecimento comercial pela fiscalização sanitária decorre da imperatividade e da autoexecutoriedade, dispensando prévia autorização do Poder Judiciário.',
    correctAnswer: 'C',
    difficulty: 'Média',
    explanation: 'Correto. A autoexecutoriedade é o atributo do ato administrativo que permite à Administração Pública executar suas próprias decisões diretamente, inclusive com o uso moderado da força se necessário, independentemente de autorização judicial prévia.'
  },
  {
    id: 'q6',
    discipline: 'Língua Portuguesa',
    subtopic: 'Sintaxe e Reescrita de Frases',
    statement: 'Na frase: "O policial rodoviário, diante de fortes indícios, autuou o condutor infractor.", as vírgulas isolam uma oração subordinada adjetiva explicativa reduzida.',
    correctAnswer: 'E',
    difficulty: 'Difícil',
    explanation: 'Incorreto. O termo "diante de fortes indícios" é um adjunto adverbial antecipado de causa, e não uma oração adjetiva explicativa. As vírgulas estão isolando um adjunto adverbial de longa extensão.'
  },
  {
    id: 'q7',
    discipline: 'Física',
    subtopic: 'Cinemática de Colisão e Frenagem',
    statement: 'Se um motorista avista um obstáculo na pista a 100 metros de distância e aciona os freios que propiciam uma desaceleração constante de 5 m/s², estando o veículo a uma velocidade inicial de 108 km/h (30 m/s), o veículo colidirá com o obstáculo.',
    correctAnswer: 'C',
    difficulty: 'Difícil',
    explanation: 'Correto. Usando a Equação de Torricelli: v² = v0² + 2aΔs. Parando o carro (v=0) com desaceleração de -5 m/s²: 0 = 30² + 2 * (-5) * Δs => 0 = 900 - 10Δs => 10Δs = 900 => Δs = 90 metros. A distância de frenagem é de 90 metros. Porém, o tempo de reação não foi considerado. Se incluirmos o tempo de reação padrão (cerca de 1 segundo a 30 m/s = mais 30 metros percorridos antes de começar a frear), o espaço total necessário é de 120 metros. Como o obstáculo está a 100m, o veículo com certeza sofrerá a colisão.'
  },
  {
    id: 'q8',
    discipline: 'Raciocínio Lógico-Matemático',
    subtopic: 'Estruturas Lógicas e Equivalências',
    statement: 'A proposição "Se o condutor soprou o bafômetro, então a pontuação de aprovação sobe" é logicamente equivalente à proposição "O condutor não soprou o bafômetro ou a pontuação de aprovação sobe".',
    correctAnswer: 'C',
    difficulty: 'Média',
    explanation: 'Correto. P -> Q equivale logicamente a ~P v Q (regra de equivalência lógica da condicional).'
  },
  {
    id: 'q9',
    discipline: 'Legislação de Trânsito',
    subtopic: 'Documentos de Porte Obrigatório',
    statement: 'A Carteira Nacional de Habilitação (CNH) e a Autorização para Conduzir Ciclomotor (ACC) poderão ser apresentadas em meio digital, possuindo fé pública em todo o território nacional, sendo dispensada a sua posse física contanto que o agente fiscalizador tenha acesso aos sistemas digitais de verificação eletrônica.',
    correctAnswer: 'C',
    difficulty: 'Média',
    explanation: 'Correto. De acordo com o parágrafo único do art. 159 do CTB, o porte do documento de habilitação será dispensado quando o agente de trânsito consiga verificar, por meios eletrônicos disponíveis, que o condutor possui habilitação ativa.'
  },
  {
    id: 'q10',
    discipline: 'Direito Constitucional',
    subtopic: 'Direitos Fundamentais - Inviolabilidade domiciliar',
    statement: 'A casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento do morador, salvo em caso de flagrante delito ou desastre, ou para prestar socorro, ou, durante a noite, por determinação judicial.',
    correctAnswer: 'E',
    difficulty: 'Fácil',
    explanation: 'Incorreto. A determinação judicial só autoriza a entrada na casa Alheia durante o DIA, e não durante a noite. À noite, por determinação judicial, não é permitido adentrar (Constituição Federal, Art. 5º, XI).'
  }
];

export const PRF_FLASHCARDS: Flashcard[] = [
  {
    id: 'f1',
    category: 'Trânsito',
    question: 'Qual é o prazo para interpor recurso de multa na JARI?',
    answer: 'Até a data limite constante da notificação da penalidade (não inferior a 30 dias contados da notificação).',
    importance: 'Alta'
  },
  {
    id: 'f2',
    category: 'Trânsito',
    question: 'Qual a velocidade máxima permitida em estradas nas rodovias de pista dupla?',
    answer: 'Pista dupla: 110 km/h para automóveis, camionetas e motocicletas, e 90 km/h para os demais veículos. Pista simples: 100 km/h para automóveis, camionetas e motocicletas, e 90 km/h para os outros.',
    importance: 'Alta'
  },
  {
    id: 'f3',
    category: 'Constitucional',
    question: 'Quem mantém e organiza a Polícia Rodoviária Federal?',
    answer: 'A União. A PRF é um órgão permanente de carreira, instituído e mantido pelo Governo Federal (Art. 144, § 2º da CF).',
    importance: 'Alta'
  },
  {
    id: 'f4',
    category: 'Penal',
    question: 'Qual o tempo de duração da interrupção da prescrição pela decisão de pronúncia?',
    answer: 'A decisão de pronúncia interrompe o prazo prescricional e reseta a contagem integral do prazo correspondente.',
    importance: 'Média'
  },
  {
    id: 'f5',
    category: 'Administrativo',
    question: 'Quais são os 5 atributos clássicos exigidos no ato administrativo (sujeitos a mnemônico)?',
    answer: 'Mnemônico CO-FI-FO-MO-OB (Competência, Finalidade, Forma, Motivo e Objeto). Atributos essenciais do ato.',
    importance: 'Alta'
  },
  {
    id: 'f6',
    category: 'Geral',
    question: 'Qual o peso de Legislação de Trânsito no edital PRF de 2021?',
    answer: 'Altíssimo. Trânsito representou Bloco II exclusivo com 30 questões inteiramente dedicadas do total de 120 (25% do total da prova).',
    importance: 'Alta'
  }
];

export const DEFAULT_SCHEDULE: StudySchedule = {
  weekly: [
    {
      dayOfWeek: 'Segunda-feira',
      disciplines: [
        { name: 'Legislação de Trânsito', duration: 60, activityType: 'teoria', topic: 'Artigos 1º ao 25º: Conceitos Iniciais e SNT' },
        { name: 'Língua Portuguesa', duration: 40, activityType: 'questões', topic: 'Análise de coerência e coesão textual em provas anteriores CEBRASPE' },
        { name: 'Legislação de Trânsito', duration: 20, activityType: 'revisão', topic: 'Revisão ativa por flashcards' }
      ]
    },
    {
      dayOfWeek: 'Terça-feira',
      disciplines: [
        { name: 'Direito Constitucional', duration: 60, activityType: 'teoria', topic: 'Artigo 5º - Direitos e Deveres Fundamentais' },
        { name: 'Física', duration: 45, activityType: 'teoria', topic: 'Cinemática do trauma e cinemática veicular de frenagem' },
        { name: 'Direito Constitucional', duration: 15, activityType: 'questões', topic: '10 questões CEBRASPE de Direitos Fundamentais' }
      ]
    },
    {
      dayOfWeek: 'Quarta-feira',
      disciplines: [
        { name: 'Legislação de Trânsito', duration: 50, activityType: 'teoria', topic: 'Normas Gerais de Circulação e Conduta (Art. 26 ao 48)' },
        { name: 'Direito Penal', duration: 45, activityType: 'teoria', topic: 'Aplicação da Lei Penal e Teoria do Crime' },
        { name: 'Legislação de Trânsito', duration: 25, activityType: 'questões', topic: 'Fixação de normas de conduta estilo C/E' }
      ]
    },
    {
      dayOfWeek: 'Quinta-feira',
      disciplines: [
        { name: 'Língua Portuguesa', duration: 60, activityType: 'teoria', topic: 'Sintaxe e Crase - Regras Gerais e Casos Proibidos' },
        { name: 'Direito Administrativo', duration: 45, activityType: 'teoria', topic: 'Poderes Administrativos - Poder de Polícia da PRF' },
        { name: 'Raciocínio Lógico-Matemático', duration: 30, activityType: 'questões', topic: 'Equivalências de condicionais' }
      ]
    },
    {
      dayOfWeek: 'Sexta-feira',
      disciplines: [
        { name: 'Direito Processual Penal', duration: 50, activityType: 'teoria', topic: 'Inquérito Policial - Natureza, Caracteres e Prazos' },
        { name: 'Informática', duration: 45, activityType: 'teoria', topic: 'Segurança da Informação e Redes de Computadores' },
        { name: 'Física', duration: 25, activityType: 'questões', topic: 'Desacelerações e colisões simples' }
      ]
    },
    {
      dayOfWeek: 'Sábado',
      disciplines: [
        { name: 'Legislação de Trânsito', duration: 40, activityType: 'revisão', topic: 'Revisão ativa dos tópicos acumulados da semana' },
        { name: 'Direito Constitucional', duration: 30, activityType: 'revisão', topic: 'Revisão de Art. 144 (PRF)' },
        { name: 'Simulado Personalizado', duration: 60, activityType: 'simulado', topic: 'Mini Simulado PRF - 20 Questões no Tempo Real' }
      ]
    },
    {
      dayOfWeek: 'Domingo',
      disciplines: [
        { name: 'Atividade Leve / Mentoria de IA', duration: 30, activityType: 'revisão', topic: 'Papo Estratégico com a Athena para ajustes de metas' }
      ]
    }
  ],
  monthly: [
    { weekIndex: 1, theme: 'Fundamentos e Normas Preliminares', focusDisciplines: ['Legislação de Trânsito', 'Língua Portuguesa', 'Direito Constitucional'] },
    { weekIndex: 2, theme: 'Circulação, Segurança Pública e Crime', focusDisciplines: ['Legislação de Trânsito', 'Física', 'Direito Penal'] },
    { weekIndex: 3, theme: 'Poderes, Sintaxe Avançada e Resoluções', focusDisciplines: ['Legislação de Trânsito', 'Direito Administrativo', 'Língua Portuguesa'] },
    { weekIndex: 4, theme: 'Simulado de Fechamento de Ciclo do Edital', focusDisciplines: ['Simulados Completos', 'Revisão de Erros', 'Flashcards Rápidos'] }
  ],
  createdDate: '2026-05-19',
  lastRecalibrated: '2026-05-19'
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    isTrial: false,
    features: [
      'Acesso a 5 questões diárias',
      'Plano de estudos padrão genérico',
      'Até 3 mensagens diárias com a Athena',
      'Flashcards pré-programados limitados'
    ]
  },
  {
    id: 'essencial',
    name: 'Essencial',
    price: 49.90,
    isTrial: false,
    features: [
      'Resolução ilimitada de questões da PRF',
      'Onboarding completo e cronograma personalizado',
      'Flashcards em todos os modos e Lei Seca',
      'Suporte para até 50 mensagens diárias com a Athena',
      'Histórico de progresso e estatísticas básicas'
    ]
  },
  {
    id: 'premium',
    name: 'A Athena Gold',
    price: 97.00,
    isTrial: true,
    features: [
      'Mentora estratégica Athena 100% ILIMITADA',
      'Simulados ilimitados e gerados sob demanda por IA',
      'Análise preditiva CEBRASPE e probabilidade de aprovação real',
      'Biblioteca inteligente de PDFs e YouTube (leitura por IA)',
      'Geração personalizada de questões e flashcards da sua biblioteca',
      'Acesso antecipado a atualizações legislativas urgentes',
      '7 dias GRÁTIS sem cobrança imediata'
    ]
  }
];
