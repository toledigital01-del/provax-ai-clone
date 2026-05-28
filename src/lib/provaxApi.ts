import type { Question, StudySchedule, UserOnboarding } from "../types";

type AnalyzeResult = {
  summary: string;
  keyPoints: string[];
  athenaQuestion: Question;
};

export function createSchedule(onboarding?: Partial<UserOnboarding>): StudySchedule {
  const hoursPerDay = Number(onboarding?.hoursPerDay) || 4;
  const totalMinutes = hoursPerDay * 60;
  const difficulties = onboarding?.difficulties || [];
  const lang = onboarding?.selectedLanguage || "Inglês";
  const hasDoneExam = !!onboarding?.hasDoneExam;
  const weekdays = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"];
  const matrix = [
    ["Legislação de Trânsito", "Língua Portuguesa", "Direito Constitucional"],
    ["Direito Penal", "Raciocínio Lógico-Matemático", "Física"],
    ["Legislação de Trânsito", "Direito Administrativo", "Informática"],
    ["Língua Portuguesa", "Direito Processual Penal", `Língua Estrangeira (${lang})`],
    ["Legislação de Trânsito", "Legislação Especial", "Direitos Humanos"],
  ];

  const topicFor = (name: string, index: number) => {
    if (name.includes("Trânsito")) {
      return [
        "Sistema Nacional de Trânsito e competências dos órgãos executivos",
        "Normas gerais de circulação e conduta no CTB",
        "Resolução CONTRAN 432 e fiscalização de alcoolemia",
        "Infrações gravíssimas, penalidades e medidas administrativas",
        "Sinalização, prioridade de passagem e condução defensiva",
      ][index % 5];
    }
    if (name.includes("Portuguesa")) return "Reescrita, regência, crase e coesão textual no padrão CEBRASPE";
    if (name.includes("Constitucional")) return "Art. 144 da CF e estrutura da segurança pública";
    if (name.includes("Penal")) return "Teoria do crime, ilicitude, culpabilidade e abuso de autoridade";
    if (name.includes("Administrativo")) return "Poder de polícia, atos administrativos e responsabilidade estatal";
    if (name.includes("Física")) return "Cinemática, frenagem, colisões e dinâmica veicular";
    if (name.includes("Estrangeira")) return `Vocabulário técnico policial e interpretação em ${lang}`;
    return `Tópicos críticos do edital PRF em ${name}`;
  };

  const weekly = matrix.map((subjects, dayIndex) => ({
    dayOfWeek: weekdays[dayIndex],
    disciplines: subjects.map((name, index) => ({
      name,
      duration: Math.max(25, Math.round((totalMinutes / subjects.length) / 5) * 5),
      activityType: (hasDoneExam ? (index < 2 ? "questões" : "revisão") : (index < 2 ? "teoria" : "revisão")) as StudySchedule["weekly"][number]["disciplines"][number]["activityType"],
      topic: `${topicFor(name, dayIndex)}${difficulties.some((d) => name.toLowerCase().includes(d.toLowerCase())) ? " [reforço adaptativo]" : ""}`,
    })),
  }));

  weekly.push({
    dayOfWeek: "Sábado",
    disciplines: [
      { name: difficulties[0] || "Legislação de Trânsito", duration: Math.max(45, Math.round(totalMinutes * 0.35)), activityType: "questões", topic: "Ciclo corretivo com questões CEBRASPE de alta incidência" },
      { name: "Simulado Inteligente", duration: Math.max(60, Math.round(totalMinutes * 0.55)), activityType: "simulado", topic: "Simulado Certo/Errado com penalidade real da banca" },
    ],
  });
  weekly.push({
    dayOfWeek: "Domingo",
    disciplines: [{ name: "Revisão Geral", duration: 45, activityType: "revisão", topic: "Revisão leve, análise de erros e ajuste da próxima semana" }],
  });

  return {
    weekly,
    monthly: [
      { weekIndex: 1, theme: `Imersão em Legislação de Trânsito e ${difficulties[0] || "Português"}`, focusDisciplines: ["Legislação de Trânsito", difficulties[0] || "Língua Portuguesa"] },
      { weekIndex: 2, theme: "CTB avançado, Física aplicada e Direito Penal", focusDisciplines: ["Legislação de Trânsito", "Física", "Direito Penal"] },
      { weekIndex: 3, theme: "Direitos, informática e língua estrangeira", focusDisciplines: ["Direito Administrativo", "Informática", `Língua Estrangeira (${lang})`] },
      { weekIndex: 4, theme: "Simulados gerais e revisão de erros recorrentes", focusDisciplines: ["Todas as Matérias", "Revisões Críticas", "Simulados"] },
    ],
    createdDate: new Date().toISOString().split("T")[0],
    lastRecalibrated: new Date().toISOString().split("T")[0],
  };
}

export function createQuestion(discipline = "Legislação de Trânsito", difficulty: Question["difficulty"] = "Média"): Question {
  return {
    id: `g-${Date.now()}`,
    discipline,
    subtopic: discipline.includes("Constitucional") ? "Segurança Pública" : "Fiscalização e conduta no trânsito",
    statement: discipline.includes("Constitucional")
      ? "A Polícia Rodoviária Federal, órgão permanente organizado e mantido pela União, destina-se ao patrulhamento ostensivo das rodovias federais."
      : "Nos termos do CTB, a recusa ao teste de alcoolemia configura infração autônoma, sujeitando o condutor às penalidades administrativas previstas para a condução sob influência de álcool.",
    correctAnswer: "C",
    difficulty,
    explanation: discipline.includes("Constitucional")
      ? "Correto. A assertiva reproduz o núcleo do art. 144, §2º, da Constituição Federal."
      : "Correto. O art. 165-A do CTB prevê penalidade administrativa própria para a recusa ao teste, exame clínico ou perícia.",
  };
}

export function chatAthena(message = "", aiName = "Athena AI") {
  const lower = message.toLowerCase();
  const content = lower.includes("ctb") || lower.includes("trânsito") || lower.includes("transito")
    ? `Sou a ${aiName}. Para CTB, priorize os artigos 165, 165-A, 277 e as resoluções de fiscalização. A banca CEBRASPE costuma trocar requisitos de urgência, sinal sonoro e consequências administrativas.`
    : `Sou a ${aiName}. Estratégia imediata: resolva um bloco curto de Certo/Errado, corrija os fundamentos e agende revisão em 1, 3 e 7 dias. O objetivo é aumentar acerto líquido, não volume bruto.`;
  return { content, sender: "athena", timestamp: new Date().toISOString() };
}

export function analyzeMaterial(fileName = "Material", textContent = ""): AnalyzeResult {
  return {
    summary: `Análise do material "${fileName}": o conteúdo foi condensado em pontos estratégicos para revisão PRF, priorizando legislação seca, pegadinhas CEBRASPE e aplicação prática em fiscalização rodoviária.`,
    keyPoints: [
      "Separar regra geral, exceções e penalidades em cartões de revisão",
      "Treinar assertivas Certo/Errado com justificativa legal curta",
      "Revisar o material novamente em 1, 3 e 7 dias",
      textContent.length > 600 ? "Priorizar os trechos com artigos, prazos, competências e sanções" : "Complementar com leitura da lei seca relacionada",
    ],
    athenaQuestion: {
      id: `lib-${Date.now()}`,
      discipline: "Legislação de Trânsito",
      subtopic: "Material analisado pela Athena",
      statement: "A recusa do condutor em assinar o auto de infração, por si só, invalida a autuação administrativa lavrada pelo agente competente.",
      correctAnswer: "E",
      difficulty: "Média",
      explanation: "Errado. A recusa de assinatura não invalida o auto; o agente deve registrar a circunstância no documento conforme o procedimento administrativo aplicável.",
    },
  };
}