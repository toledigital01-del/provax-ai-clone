export interface UserOnboarding {
  name: string;
  role: 'PRF';
  hoursPerDay: number;
  testDate: string; // YYYY-MM-DD
  difficulties: string[];
  hasDoneExam: boolean;
  selectedLanguage: 'Inglês' | 'Espanhol';
}

export type TaskType = 'teoria' | 'questões' | 'revisão' | 'simulado';

export interface StudyTask {
  id: string;
  discipline: string;
  activityType: TaskType;
  durationMinutes: number;
  completed: boolean;
  impactScore: number; // impact on approval rate e.g., 0.4%
  title: string;
  athenaJustification: string;
}

export interface DailyMission {
  date: string;
  tasks: StudyTask[];
  totalExpectedMinutes: number;
  potentialApprovalGain: number;
  completed: boolean;
}

export interface Question {
  id: string;
  discipline: string;
  subtopic: string;
  statement: string; // CEBRASPE statement
  correctAnswer: 'C' | 'E'; // Certo / Errado (standard for CEBRASPE)
  difficulty: 'Fácil' | 'Média' | 'Difícil';
  explanation: string;
  userAnswer?: 'C' | 'E' | null;
  isCorrect?: boolean;
}

export interface Flashcard {
  id: string;
  category: string; // Dynamic discipline or subject category (e.g. Trânsito, Português, etc.)
  question: string;
  answer: string;
  importance: 'Alta' | 'Média' | 'Baixa';
  lastReviewed?: string;
  box?: number; // Leitner box system
}

export interface DaySchedule {
  dayOfWeek: string; // 'Segunda', 'Terça', etc.
  disciplines: {
    name: string;
    duration: number;
    activityType: TaskType;
    topic: string;
  }[];
}

export interface MonthlyBlock {
  weekIndex: number;
  theme: string;
  focusDisciplines: string[];
}

export interface StudySchedule {
  weekly: DaySchedule[];
  monthly: MonthlyBlock[];
  createdDate: string;
  lastRecalibrated: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'athena';
  content: string;
  timestamp: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  uploadDate: string;
  fileSize?: string;
  content: string; // Text cached
  type: 'PDF' | 'Anotação' | 'Link YouTube' | 'Apostila';
}

export interface ProgressData {
  daysConsecutive: number;
  currentApprovalProbability: number; // e.g. 42% -> 92%
  overallAccuracyRate: number; // %
  totalQuestionsAnswered: number;
  totalCorrect: number;
  totalIncorrect: number; // tracked separately to compute CEBRASPE liquid score
  minutosHoje: number;      // minutos de foco acumulados hoje
  minutosHojeData: string;  // YYYY-MM-DD para reset diário
  syllabusCoverage: number; // %
  disciplinePerformance: {
    [discipline: string]: {
      total: number;
      correct: number;
      efficiency: number; // %
      status: 'safe' | 'warning' | 'critical'; // green, yellow, red (semaforo visual)
    };
  };
  studyStreakHistory: string[]; // dates estudadas
}

export interface SubscriptionPlan {
  id: 'free' | 'essencial' | 'premium';
  name: string;
  price: number;
  isTrial: boolean;
  features: string[];
}

export interface EditalTopic {
  id: string;
  code: number;
  bloco: 1 | 2 | 3;
  subject: string;
  description: string;
  studied: boolean;
  summary: boolean;
  reviewed: boolean;
  simulated: boolean;
}

