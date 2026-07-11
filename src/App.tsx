import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAuth } from './hooks/useAuth';
import AuthPage from './components/AuthPage';
import { supabase } from './lib/supabase';
import { isAdminUser } from './lib/admin';

import { UserOnboarding, StudySchedule, ProgressData, StudyTask, DailyMission, LibraryItem, Message, DaySchedule, TaskType, EditalTopic } from './types';
import Onboarding from './components/Onboarding';
import StreakWidget from './components/StreakWidget';
import AppShell from './components/AppShell';
import Dashboard from './components/Dashboard';
import Treinar from './components/Treinar';
import Simulados from './components/Simulados';
import Cronograma from './components/Cronograma';
import Athena from './components/Athena';
import Progresso from './components/Progresso';
import Biblioteca from './components/Biblioteca';
import Planos from './components/Planos';
import LandingPage from './components/LandingPage';
import Logo from './components/Logo';
import RadarContran from './components/RadarContran';
import AdminPanel from './components/AdminPanel';
import EditalVerticalizado from './components/EditalVerticalizado';
import { INITIAL_EDITAL_TOPICS } from './data/editalData';
import { playSuccessSound, playClickSound, playCorrectSound, isSoundEnabled, setSoundEnabled } from './utils/audioEffects';
import { recordProgressHistory, initHistory } from './utils/progressHistory';
import { trackCredit, seedDemoData } from './lib/creditTracker';

import { 
  ShieldAlert, Compass, BookOpen, Clock, Layers, Award, Flame, 
  MessageSquare, TrendingUp, HelpCircle, User, LogOut, CheckCircle, 
  CreditCard, Sparkles, BookMarked, Menu, X, Sun, Moon, Shield
} from 'lucide-react';

export default function App() {
  // ── Autenticação Supabase ──────────────────────────────────
  const { user, loading: authLoading, initialized } = useAuth();

  // Carregar perfil do Supabase quando usuário loga
  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.name && !onboarding) {
          // Usuário já tem perfil — preencher onboarding com dados do banco
          setOnboarding({
            name: data.name,
            role: 'PRF',
            hoursPerDay: data.hours_per_day || 4,
            testDate: data.test_date || '2026-12-15',
            difficulties: data.difficulties || [],
            hasDoneExam: data.has_done_exam || false,
            selectedLanguage: data.language || 'Inglês',
          });
        }
      });
  }, [user]);

  // Theme state choice: 'dark' | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof localStorage === 'undefined') return 'dark';
    return (localStorage.getItem('prova-x-theme') as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('prova-x-theme', nextTheme);
  };

  // Sound effects enabled toggle state
  const [soundOn, setSoundOn] = useState<boolean>(() => isSoundEnabled());

  const toggleSound = () => {
    const nextSound = !soundOn;
    setSoundOn(nextSound);
    setSoundEnabled(nextSound);
    if (nextSound) {
      // Small feedback click to indicate sound is turned back on
      setTimeout(() => playCorrectSound(), 50);
    }
  };

  // Onboarding metadata state — persistido
  const [onboarding, setOnboarding] = useLocalStorage<UserOnboarding | null>('provax-onboarding', null);
  const [inOnboardingFlow, setInOnboardingFlow] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const isAdmin = isAdminUser(user);


  const handleLoginDirectly = () => {
    playSuccessSound();
    const demoProfile: UserOnboarding = {
      name: 'Carlos Oliveira',
      role: 'PRF',
      hoursPerDay: 4,
      difficulties: ['Física', 'Legislação de Trânsito'],
      testDate: '2026-12-15',
      hasDoneExam: true,
      selectedLanguage: 'Inglês'
    };
    setOnboarding(demoProfile);
    setInOnboardingFlow(false);

    const defaultSchedule: StudySchedule = {
      weekly: [
        {
          dayOfWeek: 'Segunda-feira',
          disciplines: [
            { name: 'Legislação de Trânsito', duration: 90, activityType: 'teoria', topic: 'Normas Gerais de Circulação e Conduta (Art. 26 ao 48 do CTB)' },
            { name: 'Direito Constitucional', duration: 60, activityType: 'questões', topic: 'Artigo 144 da CF e Estrutura de Segurança Pública' }
          ]
        },
        {
          dayOfWeek: 'Terça-feira',
          disciplines: [
            { name: 'Direito Penal', duration: 90, activityType: 'teoria', topic: 'Crimes contra a Administração Pública e Exclusão de Ilicitude' },
            { name: 'Legislação de Trânsito', duration: 60, activityType: 'revisão', topic: 'Resolução CONTRAN 432: Regulamento do Bafômetro' }
          ]
        },
        {
          dayOfWeek: 'Quarta-feira',
          disciplines: [
            { name: 'Língua Portuguesa', duration: 90, activityType: 'questões', topic: 'Sintaxe da Oração, Regência e Reescrita de Frases' },
            { name: 'Direito Administrativo', duration: 60, activityType: 'teoria', topic: 'Poderes Administrativos e Poder de Polícia' }
          ]
        },
        {
          dayOfWeek: 'Quinta-feira',
          disciplines: [
            { name: 'Física', duration: 90, activityType: 'teoria', topic: 'Cinemática da Colisão, Velocidade Média e Frenagem' },
            { name: 'Legislação de Trânsito', duration: 60, activityType: 'questões', topic: 'Multas Graves e Medidas Administrativas de Retenção' }
          ]
        },
        {
          dayOfWeek: 'Sexta-feira',
          disciplines: [
            { name: 'Raciocínio Lógico-Matemático', duration: 90, activityType: 'teoria', topic: 'Proposições Lógicas, Conectivos e Proposições Equivalentes' },
            { name: 'Direitos Humanos', duration: 60, activityType: 'revisão', topic: 'Declaração Universal dos Direitos Humanos (DUDH) e Pacto de San José' }
          ]
        },
        {
          dayOfWeek: 'Sábado',
          disciplines: [
            { name: 'Legislação de Trânsito', duration: 120, activityType: 'simulado', topic: 'Simulado de Trânsito Integrado das Resoluções CONTRAN' }
          ]
        },
        {
          dayOfWeek: 'Domingo',
          disciplines: [
            { name: 'Revisão Geral', duration: 60, activityType: 'revisão', topic: 'Releitura ativa dos resumos e fechamento de metas estratégicas' }
          ]
        }
      ],
      monthly: [
        { weekIndex: 1, theme: 'Imersão Normas de Circulação e Segurança no Trânsito', focusDisciplines: ['Legislação de Trânsito', 'Direito Constitucional'] },
        { weekIndex: 2, theme: 'Velocidade, Colisões, Frenagem e Infração Penal', focusDisciplines: ['Legislação de Trânsito', 'Física', 'Direito Penal'] },
        { weekIndex: 3, theme: 'Poder de Polícia, Agentes Públicos e Sintaxe', focusDisciplines: ['Direito Administrativo', 'Língua Portuguesa', 'Informática'] },
        { weekIndex: 4, theme: 'Simulado Completo do Edital e Redação Dissertativa', focusDisciplines: ['Todas as Matérias'] }
      ],
      createdDate: new Date().toLocaleDateString('pt-BR'),
      lastRecalibrated: new Date().toLocaleDateString('pt-BR')
    };
    setSchedule(defaultSchedule);
    setCurrentTab('dashboard');
  };
  
  // Custom Study plan schedule — persistido
  const [schedule, setSchedule] = useLocalStorage<StudySchedule | null>('provax-schedule', null);

  // Dynamic Metrics Progress data — persistido
  const [progress, setProgress] = useLocalStorage<ProgressData>('provax-progress', {
    approvalHistory: [],
    totalQuestionsAnswered: 12,
    totalCorrect: 9,
    totalIncorrect: 3,
    minutosHoje: 0,
    minutosHojeData: new Date().toISOString().split('T')[0],
    overallAccuracyRate: 75.0,
    syllabusCoverage: 18.4,
    currentApprovalProbability: 41.2,
    daysConsecutive: 3,
    studyStreakHistory: [new Date().toISOString().split('T')[0]],
    disciplinePerformance: {
      'Língua Portuguesa': { total: 5, correct: 4, efficiency: 80, status: 'safe' },
      'Raciocínio Lógico-Matemático': { total: 4, correct: 3, efficiency: 75, status: 'safe' },
      'Informática': { total: 2, correct: 2, efficiency: 100, status: 'safe' },
      'Física': { total: 3, correct: 1, efficiency: 33, status: 'critical' },
      'Ética e Cidadania': { total: 0, correct: 0, efficiency: 0, status: 'critical' },
      'Geopolítica': { total: 1, correct: 1, efficiency: 100, status: 'safe' },
      'Língua Estrangeira': { total: 2, correct: 1, efficiency: 50, status: 'warning' },
      'Legislação de Trânsito': { total: 15, correct: 12, efficiency: 80, status: 'safe' },
      'Direito Administrativo': { total: 3, correct: 2, efficiency: 66, status: 'warning' },
      'Direito Constitucional': { total: 4, correct: 3, efficiency: 75, status: 'safe' },
      'Direito Penal': { total: 3, correct: 2, efficiency: 66, status: 'warning' },
      'Direito Processual Penal': { total: 2, correct: 1, efficiency: 50, status: 'warning' },
      'Legislação Especial': { total: 2, correct: 1, efficiency: 50, status: 'warning' },
      'Direitos Humanos': { total: 0, correct: 0, efficiency: 0, status: 'critical' },
    }
  });

  // Checklist of today done tasks — persistido
  const [completedTasks, setCompletedTasks] = useLocalStorage<string[]>('provax-completed-tasks', []);

  // Syllabus (Edital Verticalizado) state
  const [editalTopics, setEditalTopics] = useState<EditalTopic[]>(() => {
    if (typeof localStorage === 'undefined') return INITIAL_EDITAL_TOPICS;
    const saved = localStorage.getItem('athena-edital-v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore fallback
      }
    }
    return INITIAL_EDITAL_TOPICS;
  });

  // State saver function:
  const saveEditalTopics = (updated: EditalTopic[]) => {
    setEditalTopics(updated);
    localStorage.setItem('athena-edital-v1', JSON.stringify(updated));
    // Also recalculate progress syllabusCoverage dynamically based on edital coverage!
    const totalCheckpoints = updated.length * 4;
    const checkedCheckpoints = updated.reduce((sum, t) => {
      let val = 0;
      if (t.studied) val++;
      if (t.summary) val++;
      if (t.reviewed) val++;
      if (t.simulated) val++;
      return sum + val;
    }, 0);
    const coverage = totalCheckpoints > 0 ? parseFloat(((checkedCheckpoints / totalCheckpoints) * 100).toFixed(1)) : 0;
    
    setProgress(prev => ({
      ...prev,
      syllabusCoverage: coverage
    }));
  };

  // Handler for manual topic toggle
  const handleToggleEditalTopic = (topicId: string, field: 'studied' | 'summary' | 'reviewed' | 'simulated') => {
    playClickSound();
    const updated = editalTopics.map(t => {
      if (t.id === topicId) {
        const nextVal = !t[field];
        if (nextVal) {
          playSuccessSound();
        }
        return {
          ...t,
          [field]: nextVal
        };
      }
      return t;
    });
    saveEditalTopics(updated);
  };

  // Handler for bulk subject toggle "Concluir"
  const handleSetAllTopicsOfSubject = (subjectName: string, state: boolean) => {
    playSuccessSound();
    const updated = editalTopics.map(t => {
      if (t.subject === subjectName) {
        return {
          ...t,
          studied: state,
          summary: state,
          reviewed: state,
          simulated: state
        };
      }
      return t;
    });
    saveEditalTopics(updated);
  };
  
  // Tab views — persistido
  const [currentTab, setCurrentTab] = useLocalStorage<string>('provax-tab', 'dashboard');
  
  // Active selected card task to train in Pomodoro
  const [selectedTaskToTrain, setSelectedTaskToTrain] = useState<StudyTask | null>(null);

  // User Library documents catalogo — persistido
  const [library, setLibrary] = useLocalStorage<LibraryItem[]>('provax-library', [
    {
      id: 'doc-ctb-432',
      title: 'Resolução CONTRAN 432: Regulamentação da Bafômetro e Lei Seca',
      uploadDate: '2026-05-18',
      fileSize: '45.2 KB',
      content: 'A Resolução CONTRAN 432 regulamenta de forma estrita a fiscalização do consumo de álcool e substâncias psicoativas na direção. O limite para infração de trânsito administrativa (Art. 165 CTB) é qualquer concentração de álcool por litro de sangue ou 0.05 miligramas de álcool por litro de ar alveolar expirado (com margem de erro aplicada do bafômetro, na prática acima de 0.04 mg/L). O crime de trânsito (Art. 306 CTB) é configurado acima de 0.34 mg/L de ar alveolar ou 6 decigramas de álcool por litro de sangue.',
      type: 'PDF'
    },
    {
      id: 'doc-cf-144',
      title: 'Artigo 144 CF: Estrutura da Segurança Pública Nacional',
      uploadDate: '2026-05-19',
      fileSize: '12.8 KB',
      content: 'O Artigo 144 da Constituição Federal define a segurança pública federal e estadual. A Polícia Rodoviária Federal (PRF), órgão permanente, organizado e mantido pela União e estruturado em carreira, destina-se, na forma da lei, ao patrulhamento ostensivo das rodovias federais. É distinta da Polícia Federal, Polícia Ferroviária Federal e das polícias civis militares estaduais.',
      type: 'Anotação'
    }
  ]);

  // Conversational thread history — persistido
  const [messages, setMessages] = useLocalStorage<Message[]>('provax-messages', []);

  // User subscription profile tier — persistido
  const [subscriptionPlan, setSubscriptionPlan] = useLocalStorage<'free' | 'essencial' | 'premium'>('provax-plan', 'free');

  // Mobile menu control toggles
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic adaptive schedule builder as robust fallback
  const generateClientAdaptiveSchedule = (onboardingData: UserOnboarding): StudySchedule => {
    const name = onboardingData?.name || 'Recruta';
    const hoursPerDay = Number(onboardingData?.hoursPerDay) || 4;
    const difficulties = onboardingData?.difficulties || [];
    const hasDoneExam = !!onboardingData?.hasDoneExam;
    const lang = onboardingData?.selectedLanguage || 'Inglês';

    const totalMinutes = hoursPerDay * 60;
    const weekdays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
    
    const scheduleMatrix = [
      // Mon (Trânsito focus + Português + Constitucional)
      [
        { name: 'Legislação de Trânsito', baseWeight: 0.45 },
        { name: 'Língua Portuguesa', baseWeight: 0.35 },
        { name: 'Direito Constitucional', baseWeight: 0.20 }
      ],
      // Tue (Penal focus + Raciocínio Lógico-Matemático + Física)
      [
        { name: 'Direito Penal', baseWeight: 0.40 },
        { name: 'Raciocínio Lógico-Matemático', baseWeight: 0.30 },
        { name: 'Física', baseWeight: 0.30 }
      ],
      // Wed (Trânsito heavy + Administrativo + Informática)
      [
        { name: 'Legislação de Trânsito', baseWeight: 0.45 },
        { name: 'Direito Administrativo', baseWeight: 0.30 },
        { name: 'Informática', baseWeight: 0.25 }
      ],
      // Thu (Português + Processual Penal + Foreign Language)
      [
        { name: 'Língua Portuguesa', baseWeight: 0.40 },
        { name: 'Direito Processual Penal', baseWeight: 0.30 },
        { name: `Língua Estrangeira (${lang})`, baseWeight: 0.30 }
      ],
      // Fri (Trânsito focus + Legislação Especial + Direitos Humanos)
      [
        { name: 'Legislação de Trânsito', baseWeight: 0.40 },
        { name: 'Legislação Especial', baseWeight: 0.30 },
        { name: 'Direitos Humanos', baseWeight: 0.30 }
      ]
    ];

    // Boost weights according to student difficulties
    for (let i = 0; i < scheduleMatrix.length; i++) {
      const daySubjects = scheduleMatrix[i];
      let hasDiff = false;
      daySubjects.forEach(ds => {
        const isDiff = difficulties.some(diff => ds.name.toLowerCase().includes(diff.toLowerCase()));
        if (isDiff) {
          ds.baseWeight += 0.15;
          hasDiff = true;
        }
      });

      if (hasDiff) {
        const weightSum = daySubjects.reduce((sum, d) => sum + d.baseWeight, 0);
        daySubjects.forEach(d => {
          d.baseWeight = d.baseWeight / weightSum;
        });
      }
    }

    const weekly: DaySchedule[] = [];
    for (let i = 0; i < 5; i++) {
      const dayName = weekdays[i];
      const daySubjects = scheduleMatrix[i];
      
      const disciplines = daySubjects.map((ds, idx) => {
        const duration = Math.max(25, Math.round((ds.baseWeight * totalMinutes) / 5) * 5);
        
        let activityType: TaskType = 'teoria';
        if (hasDoneExam) {
          activityType = idx === 0 ? 'questões' : idx === 1 ? 'questões' : 'revisão';
        } else {
          activityType = idx === 0 ? 'teoria' : idx === 1 ? 'teoria' : 'revisão';
        }

        const isUserDifficulty = difficulties.some(diff => ds.name.toLowerCase().includes(diff.toLowerCase()));
        if (isUserDifficulty) {
          activityType = hasDoneExam ? 'questões' : 'teoria';
        }

        let topic = '';
        if (ds.name.includes('Trânsito')) {
          const trânsitoTopics = [
            'Artigos 1º ao 16º: Sistema Nacional de Trânsito no CTB',
            'Normas Gerais de Circulação e Conduta (Artigos 26 ao 48 do CTB)',
            'Resolução CONTRAN 432: Testes de alcoolemia e limites práticos',
            'Infrações Gravíssimas, Crimes e sistemática de pontuações',
            'Medidas Administrativas de retenção, remoção de veículos e recolhimento'
          ];
          topic = trânsitoTopics[i % trânsitoTopics.length];
        } else if (ds.name.includes('Portuguesa')) {
          topic = 'Sintaxe e regência de termos - Foco nas permutas de palavras CEBRASPE';
        } else if (ds.name.includes('Constitucional')) {
          topic = 'Defesa do Estado e Segurança Pública (Art. 144 CF)';
        } else if (ds.name.includes('Penal')) {
          topic = 'Teoria do crime: fato típico, culpabilidade, ilicitude e dosimetria';
        } else if (ds.name.includes('Administrativo')) {
          topic = 'Poder de polícia administrativa, discricionariedade e autoexecutoriedade';
        } else if (ds.name.includes('Física')) {
          topic = 'Dinâmica do Trauma: Energia cinética durante desaceleração veicular';
        } else if (ds.name.includes('Estrangeira')) {
          topic = `Análise e vocabulário técnico de ocorrências policiais em ${lang}`;
        } else {
          topic = `Dominando tópicos críticos do edital de segurança e questões de ${ds.name}`;
        }

        if (isUserDifficulty) {
          topic += ` [REFORÇO ADAPTATIVO: Dificuldade de ${name}]`;
        }

        return {
          name: ds.name,
          duration,
          activityType,
          topic
        };
      });

      weekly.push({
        dayOfWeek: dayName,
        disciplines
      });
    }

    const satDuration = Math.max(90, Math.round(totalMinutes * 0.8));
    const mainDifficulty = difficulties[0] || 'Física';
    
    weekly.push({
      dayOfWeek: 'Sábado',
      disciplines: [
        {
          name: mainDifficulty,
          duration: Math.round(satDuration * 0.4),
          activityType: 'questões',
          topic: `Ciclo Corretivo de Nivelamento: Simulados curtos em ${mainDifficulty} para eliminar erros`
        },
        {
          name: 'Simulado Inteligente',
          duration: Math.round(satDuration * 0.6),
          activityType: 'simulado',
          topic: hasDoneExam 
            ? 'Simulado Completo Alto Impacto - 120 Itens modelo Certo/Errado'
            : 'Simulado Progressivo Guiado: Diagnóstico integrado de ansiedade e tempo de prova'
        }
      ]
    });

    weekly.push({
      dayOfWeek: 'Domingo',
      disciplines: [
        {
          name: 'Planejamento de Metas',
          duration: 30,
          activityType: 'revisão',
          topic: `Mentoria Athena AI: Ajustar o rendimento da meta de ${hoursPerDay}h diárias`
        }
      ]
    });

    const firstDifficulty = difficulties[0] || 'Língua Portuguesa';
    const secondDifficulty = difficulties[1] || 'Física';
    const monthly = [
      { 
        weekIndex: 1, 
        theme: `Imersão em Legislação de Trânsito e ${firstDifficulty}`, 
        focusDisciplines: ['Legislação de Trânsito', firstDifficulty, 'Direito Constitucional'] 
      },
      { 
        weekIndex: 2, 
        theme: `Trânsito Avançado, ${secondDifficulty} e Prática Penal`, 
        focusDisciplines: ['Legislação de Trânsito', secondDifficulty, 'Direito Penal'] 
      },
      { 
        weekIndex: 3, 
        theme: `Consolidação de Direito Administrativo, Estratégia de ${lang} e ${difficulties[2] || 'Raciocínio Lógico'}`, 
        focusDisciplines: ['Direito Administrativo', `Língua Estrangeira (${lang})`, difficulties[2] || 'Raciocínio Lógico-Matemático'] 
      },
      { 
        weekIndex: 4, 
        theme: 'Trunfos da Banca CEBRASPE, Simulados Gerais e Redação Dissertativa', 
        focusDisciplines: ['Todas as Matérias', 'Revisões Críticas', 'Simulados Adaptativos'] 
      }
    ];

    return {
      weekly,
      monthly,
      createdDate: new Date().toLocaleDateString('pt-BR'),
      lastRecalibrated: new Date().toLocaleDateString('pt-BR')
    };
  };

  // Hook triggered when onboarding ends successfully
  const handleOnboardingComplete = (data: UserOnboarding, generatedSchedule: any) => {
    setOnboarding(data);
    
    if (generatedSchedule) {
      setSchedule(generatedSchedule);
    } else {
      // Build a beautifully tailored fallback schedule dynamically based on onboarding choices
      const dynamicFallback = generateClientAdaptiveSchedule(data);
      setSchedule(dynamicFallback);
    }
    
    setCurrentTab('dashboard');
  };

  // Toggle checklist of daily mission
  const handleToggleTask = (taskId: string) => {
    playClickSound();
    setCompletedTasks(prev => {
      const exists = prev.includes(taskId);
      let updated;
      if (exists) {
        updated = prev.filter(id => id !== taskId);
      } else {
        updated = [...prev, taskId];
        // Trigger Success feedback sound for completed task
        playSuccessSound();
        
        // Add random correct answered question statistics to progress to simulate gain
        setProgress(old => {
          const addedProb = Math.round((old.currentApprovalProbability + 0.4) * 10) / 10;
          const updated = {
            ...old,
            totalQuestionsAnswered: old.totalQuestionsAnswered + 1,
            totalCorrect: old.totalCorrect + 1,
            overallAccuracyRate: Math.round(((old.totalCorrect + 1) / (old.totalQuestionsAnswered + 1)) * 100),
            currentApprovalProbability: Math.min(99.8, addedProb)
          };
          return { ...updated, approvalHistory: recordProgressHistory(updated) };
        });
      }
      return updated;
    });
  };

  // Callback whenever a question is answered on simulated grids or AI library trials
  const handleQuestionAnswered = (isCorrect: boolean, discipline: string) => {
    if (isCorrect) {
      playCorrectSound();
    } else {
      playClickSound();
    }

    // Automatically mark the simulated checkpoint of the first uncompleted topic in the matching subject
    let marked = false;
    const updatedTopics = editalTopics.map(t => {
      if (!marked && t.subject.toLowerCase() === discipline.toLowerCase() && !t.simulated) {
        marked = true;
        return { ...t, simulated: true };
      }
      return t;
    });
    if (marked) {
      saveEditalTopics(updatedTopics);
    }

    setProgress(prev => {
      const answered = prev.totalQuestionsAnswered + 1;
      const corrects = isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect;
      
      // Fine-grained discipline update
      const currentPerformance = prev.disciplinePerformance[discipline] || { total: 0, correct: 0, efficiency: 15, status: 'critical' as const };
      const subTotal = currentPerformance.total + 1;
      const subCorrect = isCorrect ? currentPerformance.correct + 1 : currentPerformance.correct;
      const efficiency = Math.round((subCorrect / subTotal) * 100);
      const status: 'safe' | 'warning' | 'critical' = efficiency >= 70 ? 'safe' : efficiency >= 50 ? 'warning' : 'critical';

      const updatedPerformance = {
        ...prev.disciplinePerformance,
        [discipline]: { total: subTotal, correct: subCorrect, efficiency, status }
      };

      const originalProb = prev.currentApprovalProbability;
      const probImpact = isCorrect ? 0.3 : -0.2;
      const updatedProb = Math.min(99.6, Math.max(10.0, Math.round((originalProb + probImpact) * 10) / 10));

      const incorrects = isCorrect ? prev.totalIncorrect : prev.totalIncorrect + 1;

      const hoje = new Date().toISOString().split('T')[0];
      const updatedStreak = prev.studyStreakHistory.includes(hoje)
        ? prev.studyStreakHistory
        : [...prev.studyStreakHistory, hoje];
      const updated = {
        ...prev,
        totalQuestionsAnswered: answered,
        totalCorrect: corrects,
        totalIncorrect: incorrects,
        overallAccuracyRate: Math.round((corrects / answered) * 100),
        disciplinePerformance: updatedPerformance,
        currentApprovalProbability: updatedProb,
        studyStreakHistory: updatedStreak,
      };
      return { ...updated, approvalHistory: recordProgressHistory(updated) };
    });
  };

  // Callback when an active Focus study block completes
  const handleFocusCycleCompleted = (discipline: string, minutes: number) => {
    // Automatically mark the studied / summary checkpoints of the first uncompleted topic in the matching subject
    let marked = false;
    const updatedTopics = editalTopics.map(t => {
      if (!marked && t.subject.toLowerCase() === discipline.toLowerCase() && !t.studied) {
        marked = true;
        return { ...t, studied: true, summary: true };
      }
      return t;
    });
    if (marked) {
      saveEditalTopics(updatedTopics);
    }

    setProgress(prev => {
      const bonusCoverage = Math.round((prev.syllabusCoverage + (minutes * 0.05)) * 100) / 100;
      const bonusProb = Math.round((prev.currentApprovalProbability + 0.8) * 10) / 10;
      const hoje = new Date().toISOString().split('T')[0];
      const minutosHoje = prev.minutosHojeData === hoje ? prev.minutosHoje + minutes : minutes;
      const updated = {
        ...prev,
        syllabusCoverage: Math.min(100.0, bonusCoverage),
        currentApprovalProbability: Math.min(99.8, bonusProb),
        daysConsecutive: prev.daysConsecutive + 1,
        minutosHoje,
        minutosHojeData: hoje,
      };
      return { ...updated, approvalHistory: recordProgressHistory(updated, { minutos: minutosHoje }) };
    });
  };

  // Handle addition of custom library summary records
  const handleAddLibraryItem = (newItem: LibraryItem) => {
    setLibrary(prev => [newItem, ...prev]);
  };

  // Seed dados demo na primeira vez
  React.useEffect(() => { seedDemoData(); }, []);

  // ── Handler de mensagens — Athena Claude ─────────────────────────────────
  const handleSendMessage = async (content: string) => {
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      const anthropicKey = localStorage.getItem('athena_anthropic_api_key') || '';
      const claudeModel   = localStorage.getItem('athena_claude_chat_model') || 'claude-haiku-3-5';
      const aiName        = localStorage.getItem('athena_ai_name') || 'Athena AI';
      const aiTone        = localStorage.getItem('athena_ai_tone') || 'elite';
      const aiCustomInstruction = localStorage.getItem('athena_ai_custom_instruction') || '';

      const response = await fetch('/api/chat-athena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          onboarding,
          progress,
          anthropicKey,
          claudeModel,
          aiName,
          aiTone,
          aiCustomInstruction,
        }),
      });
      const data = await response.json();

      const athenaMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'athena',
        content: data.content,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, athenaMsg]);

      // Registrar crédito usado
      const provider = (localStorage.getItem('athena_ai_provider') || 'anthropic') as any;
      const model = provider === 'anthropic'
        ? (localStorage.getItem('athena_claude_chat_model') || 'claude-haiku-3-5')
        : provider === 'openai'
        ? (localStorage.getItem('athena_gpt_chat_model') || 'gpt-4o-mini')
        : (localStorage.getItem('athena_gemini_chat_model') || 'gemini-2.0-flash');
      trackCredit({
        studentId: onboarding?.name?.toLowerCase().replace(/\s/g, '_') || 'unknown',
        studentName: onboarding?.name || 'Aluno',
        action: 'chat',
        provider: data.content ? provider : 'mock',
        model,
      });

      setProgress(old => ({
        ...old,
        currentApprovalProbability: Math.min(99.8, Math.round((old.currentApprovalProbability + 0.1) * 10) / 10)
      }));
    } catch (err) {
      console.error(err);
      // Fallback local robust explanation
      const athenaFallbackMsg: Message = {
        id: `a-fallback-${Date.now()}`,
        sender: 'athena',
        content: `Candidato, nossa plataforma de inteligência artificial de apoio está offline temporariamente, mas tome nota: o Artigo 144 da CF dita o patrulhamento ostensivo das rodovias federais pela PRF. Concentre na nossa meta de trânsito para conquistar seus pontos líquidos hoje!`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, athenaFallbackMsg]);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  const handleNavigateToTrain = (disciplineName: string) => {
    setCurrentTab('treinar');
    setSelectedTaskToTrain({
      id: `temp-${Date.now()}`,
      discipline: disciplineName,
      activityType: 'questões',
      durationMinutes: 30,
      completed: false,
      impactScore: 0.5,
      title: `Maratona: ${disciplineName}`,
      athenaJustification: `Foco total nos subtópicos oficiais extraídos do Edital Verticalizado.`
    });
    setMobileMenuOpen(false);
    playClickSound();
  };

  // Render subviews according to selector
  const renderActiveTab = () => {
    if (!schedule) return null;

    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onboardingName={onboarding?.name || ''}
            testDate={onboarding?.testDate || '2026-12-15'}
            progress={progress}
            schedule={schedule}
            completedTasks={completedTasks}
            onToggleTask={handleToggleTask}
            onNavigate={(tab: string) => { setCurrentTab(tab); setMobileMenuOpen(false); }}
            onSelectTaskToTrain={setSelectedTaskToTrain}
            theme={theme}
          />
        );
      case 'edital':
        return (
          <EditalVerticalizado 
            topics={editalTopics}
            onToggleTopic={handleToggleEditalTopic}
            onSetAllTopicsOfSubject={handleSetAllTopicsOfSubject}
            onNavigateToTrain={handleNavigateToTrain}
            theme={theme}
          />
        );
      case 'treinar':
        return (
          <Treinar
            theme={theme}
            selectedTaskToTrain={selectedTaskToTrain}
            onQuestionAnswered={handleQuestionAnswered}
            onFocusCycleCompleted={handleFocusCycleCompleted}
            defaultActiveTab="questoes"
          />
        );
      case 'simulados':
        return (
          <Simulados
            theme={theme}
            onNavigate={(tab: string) => { setCurrentTab(tab); }}
            onSimuladoFinished={(points: number, count: number, corrects: number, incorrects: number) => {
              setProgress(prev => {
                const newTotal = prev.totalQuestionsAnswered + count;
                const newCorrect = prev.totalCorrect + corrects;
                const newIncorrect = prev.totalIncorrect + incorrects;
                const originalProb = prev.currentApprovalProbability;
                const multiplier = points > (count * 0.6) ? 2.5 : -1.8;
                const updated = {
                  ...prev,
                  totalQuestionsAnswered: newTotal,
                  totalCorrect: newCorrect,
                  totalIncorrect: newIncorrect,
                  overallAccuracyRate: Math.round((newCorrect / newTotal) * 100),
                  currentApprovalProbability: Math.min(99.6, Math.max(10.5, Math.round((originalProb + multiplier) * 10) / 10)),
                  daysConsecutive: prev.daysConsecutive + 1
                };
                return { ...updated, approvalHistory: recordProgressHistory(updated) };
              });
            }}
          />
        );
      case 'cronograma':
        return (
          <Cronograma 
            schedule={schedule}
            onboardingData={onboarding}
            onUpdateSchedule={(newSch: StudySchedule) => setSchedule(newSch)}
            onUpdateOnboardingData={(newData: UserOnboarding) => setOnboarding(newData)}
            theme={theme}
          />
        );
      case 'athena':
        return (
          <Athena
            theme={theme}
            onboarding={onboarding}
            progress={progress}
            messages={messages}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearHistory}
          />
        );
      case 'progresso':
        return <Progresso progress={progress} theme={theme} />;
      case 'biblioteca':
        return (
          <Biblioteca
            theme={theme}
            library={library}
            onAddLibraryItem={handleAddLibraryItem}
            onQuestionAnswered={handleQuestionAnswered}
          />
        );
      case 'planos':
        return (
          <Planos
            theme={theme}
            currentPlanId={subscriptionPlan}
            onPlanUpgraded={(newPlan: 'free' | 'essencial' | 'premium') => setSubscriptionPlan(newPlan)}
          />
        );
      case 'contran':
        return (
          <Treinar
            theme={theme}
            selectedTaskToTrain={selectedTaskToTrain}
            onQuestionAnswered={handleQuestionAnswered}
            onFocusCycleCompleted={handleFocusCycleCompleted}
            defaultActiveTab="contran"
          />
        );
      case 'admin':
        return (
          <AdminPanel 
            onBack={() => { setCurrentTab('dashboard'); playClickSound(); }}
            theme={theme}
          />
        );
      default:
        return <div>Não implementado.</div>;
    }
  };

  // If user hasn't completed onboarding wizard yet, enforce it
  // ── Loading inicial do auth ──────────────────────────────
  if (!initialized || authLoading) {
    return (
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-2xl animate-pulse">🦉</div>
          <p className="text-sm text-slate-400 font-mono">Carregando ProvaX AI...</p>
        </div>
      </div>
    );
  }

  // ── Não autenticado → Tela de auth ───────────────────────
  if (!user) {
    if (!inOnboardingFlow) {
      return (
        <LandingPage
          onStartOnboarding={() => { setAuthInitialMode('register'); setInOnboardingFlow(true); }}
          onLoginDirectly={() => { setAuthInitialMode('login'); setInOnboardingFlow(true); }}
        />
      );
    }
    // Mostra tela de login/cadastro
    return (
      <AuthPage
        theme={theme}
        initialMode={authInitialMode}
        onAuth={() => {
          setInOnboardingFlow(false);
        }}
      />
    );
  }

  if (!onboarding) {

    if (!inOnboardingFlow) {
      return (
        <LandingPage
          onStartOnboarding={() => setInOnboardingFlow(true)}
          onLoginDirectly={handleLoginDirectly}
        />
      );
    }

    return (
      <div className={`min-h-screen bg-slate-950 text-slate-150 flex flex-col font-sans select-none relative prf-theme ${theme === 'light' ? 'light-theme' : ''}`} id="provax-application-workspace">
        {/* Floating Theme Button for Onboarding screen */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white cursor-pointer shadow-lg transition-colors flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider"
            title="Mudar Tema"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-yellow-500" /> : <Moon className="w-4.5 h-4.5 text-indigo-400" />}
            <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>
        </div>
        <Onboarding onComplete={handleOnboardingComplete} theme={theme} />
      </div>
    );
  }

  if (currentTab === 'admin') {
    return (
      <AdminPanel 
        onBack={() => {
          setCurrentTab('dashboard');
          playClickSound();
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <AppShell
      currentTab={currentTab}
      onTabChange={(tab) => { setCurrentTab(tab); playClickSound(); }}
      onLogout={async () => {
        await supabase.auth.signOut();
        setOnboarding(null);
      }}
      theme={theme}
      onToggleTheme={toggleTheme}
      userName={onboarding?.name || 'Recruta'}
      approvalProb={progress.currentApprovalProbability}
      streak={progress.daysConsecutive}
      subscriptionPlan={subscriptionPlan}
    >
      <div className={`prf-theme ${theme === 'light' ? 'light-theme' : ''}`}>
        {renderActiveTab()}
      </div>
    </AppShell>
  );
}
