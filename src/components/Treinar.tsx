import React, { useState, useEffect, useRef } from 'react';
import { PRF_QUESTIONS, PRF_FLASHCARDS } from '../data/mockData';
import { Question, Flashcard, StudyTask } from '../types';
import { BookOpen, RefreshCw, Layers, Clock, Check, X, HelpCircle, ChevronRight, Play, Pause, AlertTriangle, Sparkles, Plus, CheckCircle2, Shield, Trash2, Zap } from 'lucide-react';
import { playTimerStartSound, playSuccessSound } from '../utils/audioEffects';
import RadarContran from './RadarContran';

interface TreinarProps {
  selectedTaskToTrain: StudyTask | null;
  onQuestionAnswered: (isCorrect: boolean, discipline: string) => void;
  onFocusCycleCompleted: (discipline: string, minutes: number) => void;
  defaultActiveTab?: ModeType;
  theme?: 'dark' | 'light';
}

type ModeType = 'questoes' | 'revisao' | 'flashcards' | 'foco' | 'contran';

export default function Treinar({ selectedTaskToTrain, onQuestionAnswered, onFocusCycleCompleted, defaultActiveTab = 'questoes', theme = 'dark' }: TreinarProps) {
  const [activeTab, setActiveTab] = useState<ModeType>(defaultActiveTab);

  // Sync state when defaultActiveTab changes
  useEffect(() => {
    if (defaultActiveTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab]);

  // Activate Pomodoro focal if a task was assigned from Dashboard
  useEffect(() => {
    if (selectedTaskToTrain) {
      if (selectedTaskToTrain.activityType === 'questões') {
        setActiveTab('questoes');
        setFilterDiscipline(selectedTaskToTrain.discipline);
      } else if (selectedTaskToTrain.activityType === 'teoria' || selectedTaskToTrain.activityType === 'revisão') {
        setActiveTab('foco');
        setFocoDiscipline(selectedTaskToTrain.discipline);
        setFocoTopic(selectedTaskToTrain.title);
      }
    }
  }, [selectedTaskToTrain]);

  // ==================== MODE 1: QUESTÕES (CEBRASPE) ====================
  const [questionsList, setQuestionsList] = useState<Question[]>(PRF_QUESTIONS);
  const [filterDiscipline, setFilterDiscipline] = useState<string>('Todos');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('Todos');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'C' | 'E' | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [sessionAnswered, setSessionAnswered] = useState<number>(0);
  const [sessionCorrect, setSessionCorrect] = useState<number>(0);
  const [sessionErrors, setSessionErrors] = useState<Question[]>([]);
  const [showSessionSummary, setShowSessionSummary] = useState<boolean>(false);
  const [reviewingErrors, setReviewingErrors] = useState<boolean>(false);
  const [filterOnlyErrors, setFilterOnlyErrors] = useState<boolean>(false);

  const wrongQuestionsCount = questionsList.filter(q => q.isCorrect === false).length;

  const filteredQuestions = questionsList.filter(q => {
    const disciplineMatch = filterDiscipline === 'Todos' || q.discipline === filterDiscipline;
    const difficultyMatch = filterDifficulty === 'Todos' || q.difficulty === filterDifficulty;
    const errorMatch = !filterOnlyErrors || q.isCorrect === false;
    return disciplineMatch && difficultyMatch && errorMatch;
  });

  const activeQuestions = reviewingErrors && sessionErrors.length > 0 ? sessionErrors : filteredQuestions;
  const currentQuestion = activeQuestions[currentQIndex] || null;

  useEffect(() => {
    setSessionAnswered(0);
    setSessionCorrect(0);
    setSessionErrors([]);
    setShowSessionSummary(false);
    setReviewingErrors(false);
    setFilterOnlyErrors(false);
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
  }, [filterDiscipline, filterDifficulty]);

  const handleChooseAnswer = (ans: 'C' | 'E') => {
    if (hasAnswered) return;
    setSelectedAnswer(ans);
  };

  const handleConfirmAnswer = () => {
    if (!currentQuestion || !selectedAnswer || hasAnswered) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setHasAnswered(true);

    setQuestionsList(prev => prev.map(q => q.id === currentQuestion.id ? { ...q, userAnswer: selectedAnswer, isCorrect } : q));
    onQuestionAnswered(isCorrect, currentQuestion.discipline);

    setSessionAnswered(prev => prev + 1);
    if (isCorrect) {
      setSessionCorrect(prev => prev + 1);
    } else {
      setSessionErrors(prev => {
        if (prev.some(q => q.id === currentQuestion.id)) return prev;
        return [...prev, { ...currentQuestion, userAnswer: selectedAnswer, isCorrect: false }];
      });
      addQuestionToSpacedRepetition(currentQuestion);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setShowSessionSummary(true);
    }
  };

  const handleGenerateAiQuestion = async () => {
    setIsAiGenerating(true);
    try {
      const disc = filterDiscipline === 'Todos' ? 'Legislação de Trânsito' : filterDiscipline;
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discipline: disc, difficulty: filterDifficulty === 'Todos' ? 'Média' : filterDifficulty }),
      });
      const data = await response.json();
      
      // Add custom new question to the pool
      setQuestionsList(prev => [data, ...prev]);
      setFilterDiscipline(data.discipline); 
      setCurrentQIndex(0);
      setSelectedAnswer(null);
      setHasAnswered(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // ==================== MODE 2: REVISÃO INTELIGENTE (ALGORITMO MULTIPLICATIVO) ====================
  interface SpacedRepetitionItem {
    id: string;
    discipline: string;
    topic: string;
    details: string;
    intervalDays: number;
    nextReviewDate: string; // YYYY-MM-DD
    reviewCount?: number;
  }

  const [revisaoItems, setRevisaoItems] = useState<SpacedRepetitionItem[]>(() => {
    const saved = localStorage.getItem('prf_spaced_repetition_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default high-yield PRF topics with varied default intervals
    return [
      {
        id: 'sr_1',
        discipline: 'Direito Constitucional',
        topic: 'Segurança Pública & Atribuições da PRF (Art. 144 CF)',
        details: 'A Polícia Rodoviária Federal, órgão permanente, organizado e mantido pela União e estruturado em carreira, destina-se, na forma da lei, ao patrulhamento ostensivo das rodovias federais. É responsável direta pelo combate a ilícitos transfronteiriços.',
        intervalDays: 1,
        nextReviewDate: new Date().toISOString().split('T')[0],
      },
      {
        id: 'sr_2',
        discipline: 'Legislação de Trânsito',
        topic: 'Concentração Alcoólica & Infração vs Crime (Art. 306 CTB)',
        details: 'Infração de trânsito regulada pelo Art. 165 CTB ocorre com qualquer teor de álcool por litro de sangue. O crime do Art. 306 ocorre a partir de 0,3mg/L de ar alveolar ou 6dg/L de sangue. A recusa ao teste também gera multa de natureza gravíssima multiplicada por 10 e suspensão.',
        intervalDays: 3,
        nextReviewDate: new Date().toISOString().split('T')[0], // Devido hoje
      },
      {
        id: 'sr_3',
        discipline: 'Legislação de Trânsito',
        topic: 'Medições e Margens de Erro do Etilômetro (Res. CONTRAN 432)',
        details: 'O visor do aparelho indica a quantidade de álcool por ar alveolar. A tabela técnica do INMETRO aplica desconto de segurança: no visor deve constar no mínimo 0,34 mg/L para preencher o limite penal de 0,30 mg/L; e no mínimo 0,05 mg/L no visor para caracterizar a infração administrativa (limite legal é zero).',
        intervalDays: 7,
        nextReviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Em 2 dias
      },
      {
        id: 'sr_4',
        discipline: 'Direito Constitucional',
        topic: 'Limites Constitucionais à Inviolabilidade Domiciliar',
        details: 'A casa é o asilo inviolável do indivíduo. Ninguém nela pode ingressar sem consentimento do morador, à exceção de: 1) Flagrante delito ou desastre; 2) Prestação de socorro (a qualquer hora do dia ou da noite); 3) Determinação Judicial (exclusivamente durante o dia).',
        intervalDays: 21,
        nextReviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Em 5 dias
      },
      {
        id: 'sr_5',
        discipline: 'Física',
        topic: 'Conservação de Energia & Impacto Cinético de Frenagem',
        details: 'Tratando-se de colisões mecânicas, o trabalho da força de frenagem é igual à variação da energia cinética (Ec = m*v²/2). Como a velocidade está elevada ao quadrado, dobrar a velocidade quadruplica a distância necessária para parar completamente o veículo sob mesmo coeficiente de atrito.',
        intervalDays: 1,
        nextReviewDate: new Date().toISOString().split('T')[0], // Devido hoje
      }
    ];
  });

  // Save to localStorage automatically on changes
  useEffect(() => {
    localStorage.setItem('prf_spaced_repetition_items', JSON.stringify(revisaoItems));
  }, [revisaoItems]);

  const [selectedRevisaoItem, setSelectedRevisaoItem] = useState<SpacedRepetitionItem | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [revisaoFilter, setRevisaoFilter] = useState<'todos' | 'urgentes' | 'agendados' | 'dominados'>('todos');
  const [showAddTopicForm, setShowAddTopicForm] = useState<boolean>(false);
  const [newTopicName, setNewTopicName] = useState<string>('');
  const [newTopicDiscipline, setNewTopicDiscipline] = useState<string>('Legislação de Trânsito');
  const [newTopicDetails, setNewTopicDetails] = useState<string>('');
  const [sessionModeActive, setSessionModeActive] = useState<boolean>(false);
  const [sessionQueue, setSessionQueue] = useState<SpacedRepetitionItem[]>([]);
  const [sessionQueueIndex, setSessionQueueIndex] = useState<number>(0);
  const [sessionModeCompleted, setSessionModeCompleted] = useState<boolean>(false);
  const [sessionReviewedCount, setSessionReviewedCount] = useState<number>(0);

  const computeNextInterval = (currentInterval: number, rating: 'esqueci' | 'dificil' | 'bom' | 'facil'): number => {
    switch (rating) {
      case 'esqueci': return 1;
      case 'dificil': return Math.max(1, Math.round(currentInterval * 0.75));
      case 'bom': return Math.max(2, Math.round(currentInterval * 1.5));
      case 'facil': return Math.max(3, Math.round(currentInterval * 2.5));
    }
  };

  const startGuidedSession = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const urgent = revisaoItems.filter(i => i.nextReviewDate <= todayStr);
    if (urgent.length === 0) return;
    setSessionQueue(urgent);
    setSessionQueueIndex(0);
    setSessionModeActive(true);
    setSessionModeCompleted(false);
    setSessionReviewedCount(0);
    setShowSolution(false);
  };

  const handleDeleteRevisaoItem = (id: string) => {
    setRevisaoItems(prev => prev.filter(item => item.id !== id));
  };

  // Automatically insert an incorrect question answered in standard questions to dynamic Spaced Repetition queue
  const addQuestionToSpacedRepetition = (question: Question) => {
    const newItem: SpacedRepetitionItem = {
      id: `sr_q_${question.id}_${Date.now()}`,
      discipline: question.discipline,
      topic: `Reforço: Erro em ${question.subtopic || question.discipline}`,
      details: `Você respondeu incorretamente esta questão.\n\nEnunciado CEBRASPE:\n"${question.statement}"\n\nGabarito Correto: ${question.correctAnswer === 'C' ? 'Certo' : 'Errado'}.\n\nJustificativa Detalhada:\n${question.explanation}`,
      intervalDays: 1,
      nextReviewDate: new Date().toISOString().split('T')[0],
      reviewCount: 0,
    };

    setRevisaoItems(prev => {
      // Avoid duplicate cards for the exact same question
      if (prev.some(item => item.id.includes(question.id))) {
        return prev;
      }
      return [newItem, ...prev];
    });
  };

  const handleResolveReviewWithInterval = (item: SpacedRepetitionItem, rating: 'esqueci' | 'dificil' | 'bom' | 'facil') => {
    const newInterval = computeNextInterval(item.intervalDays, rating);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + newInterval);
    const nextDateStr = futureDate.toISOString().split('T')[0];

    setRevisaoItems(prev => prev.map(sr => {
      if (sr.id === item.id) {
        return { ...sr, intervalDays: newInterval, nextReviewDate: nextDateStr, reviewCount: (sr.reviewCount ?? 0) + 1 };
      }
      return sr;
    }));

    onQuestionAnswered(true, item.discipline);
    playSuccessSound();
    setShowSolution(false);

    if (sessionModeActive) {
      setSessionReviewedCount(prev => prev + 1);
      if (sessionQueueIndex < sessionQueue.length - 1) {
        setSessionQueueIndex(prev => prev + 1);
      } else {
        setSessionModeCompleted(true);
      }
    } else {
      setSelectedRevisaoItem(null);
    }
  };

  // ==================== MODE 3: FLASHCARDS ====================
  const [flashcardDeck, setFlashcardDeck] = useState<Flashcard[]>(PRF_FLASHCARDS);
  const [fcIndex, setFcIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [generatingCard, setGeneratingCard] = useState<boolean>(false);

  const activeCard = flashcardDeck[fcIndex] || null;

  const handleNextCard = () => {
    setIsFlipped(false);
    if (fcIndex < flashcardDeck.length - 1) {
      setFcIndex(fcIndex + 1);
    } else {
      setFcIndex(0);
    }
  };

  const handleCardFeedback = (learned: boolean) => {
    if (!learned && activeCard) {
      const newItem: SpacedRepetitionItem = {
        id: `sr_fc_${activeCard.id}_${Date.now()}`,
        discipline: activeCard.category,
        topic: `Flashcard: ${activeCard.question.slice(0, 80)}`,
        details: activeCard.answer,
        intervalDays: 1,
        nextReviewDate: new Date().toISOString().split('T')[0],
        reviewCount: 0,
      };
      setRevisaoItems(prev => {
        if (prev.some(item => item.id.includes(activeCard.id))) return prev;
        return [newItem, ...prev];
      });
    }
    handleNextCard();
  };

  const handleGenerateAiFlashcard = async () => {
    setGeneratingCard(true);
    try {
      const provider = localStorage.getItem('athena_ai_provider') || 'gemini';
      const openaiKey = localStorage.getItem('athena_openai_api_key') || '';
      const anthropicKey = localStorage.getItem('athena_anthropic_api_key') || '';
      const geminiKey = localStorage.getItem('athena_gemini_api_key') || '';
      const aiName = localStorage.getItem('athena_ai_name') || 'Athena AI';
      const aiTone = localStorage.getItem('athena_ai_tone') || 'elite';
      const aiStrictness = localStorage.getItem('athena_ai_strictness') || 'high';
      const aiCustomInstruction = localStorage.getItem('athena_ai_custom_instruction') || '';

      const response = await fetch('/api/chat-athena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ content: 'Gere um flashcard estratégico inédito de Legislação de Trânsito no formato Pergunta e Resposta curta. Retorne somente esse texto de forma direta, sem introdução.' }],
          provider,
          openaiKey,
          anthropicKey,
          geminiKey,
          aiName,
          aiTone,
          aiStrictness,
          aiCustomInstruction
        })
      });
      const data = await response.json();
      
      const newCard: Flashcard = {
        id: `fc-ai-${Date.now()}`,
        category: 'Trânsito',
        question: data.content.split('Resposta:')[0]?.replace('Pergunta:', '')?.trim() || 'Qual a consequência jurídica da decisão de pronúncia?',
        answer: data.content.split('Resposta:')[1]?.trim() || data.content,
        importance: 'Alta',
      };

      setFlashcardDeck(prev => [newCard, ...prev]);
      setFcIndex(0);
      setIsFlipped(false);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingCard(false);
    }
  };

  // ==================== MODE 4: MODO FOCO (POMODORO) ====================
  const [focoDiscipline, setFocoDiscipline] = useState<string>('Legislação de Trânsito');
  const [focoTopic, setFocoTopic] = useState<string>('Normas Gerais de Circulação e Ultrapassagens');
  const [focoMinutesPreset, setFocoMinutesPreset] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [cycleCompleted, setCycleCompleted] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(focoMinutesPreset * 60);
    setTimerRunning(false);
    setCycleCompleted(false);
  }, [focoMinutesPreset]);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            setCycleCompleted(true);
            playSuccessSound(); // Play success tone when Pomodoro is finished!
            if (timerRef.current) clearInterval(timerRef.current);
            onFocusCycleCompleted(focoDiscipline, focoMinutesPreset);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, focoDiscipline, focoMinutesPreset]);

  const handleToggleTimer = () => {
    const nextRunning = !timerRunning;
    if (nextRunning) {
      playTimerStartSound(); // Play pleasant start study tone
    }
    setTimerRunning(nextRunning);
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(focoMinutesPreset * 60);
    setCycleCompleted(false);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const urgentRevisaoCount = revisaoItems.filter(i => i.nextReviewDate <= new Date().toISOString().split('T')[0]).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (activeTab === 'questoes' && !showSessionSummary) {
        if (!hasAnswered) {
          if (e.key === 'ArrowLeft') { e.preventDefault(); setSelectedAnswer('E'); }
          else if (e.key === 'ArrowRight') { e.preventDefault(); setSelectedAnswer('C'); }
          else if (e.key === 'Enter' && selectedAnswer !== null) { e.preventDefault(); handleConfirmAnswer(); }
        } else {
          if (e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); handleNextQuestion(); }
        }
      }

      if (activeTab === 'flashcards') {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setIsFlipped(prev => !prev); }
        else if (isFlipped) {
          if (e.key === 'ArrowLeft') { e.preventDefault(); handleCardFeedback(false); }
          else if (e.key === 'ArrowRight') { e.preventDefault(); handleCardFeedback(true); }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, hasAnswered, selectedAnswer, showSessionSummary, isFlipped]);

  return (
    <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-900 border-slate-800'} border rounded-2xl p-6 shadow-xl`} id="train-view-container">
      {/* 1. Interactive Tabs */}
      <div className={`border-b ${theme === 'light' ? 'border-gray-200' : 'border-slate-800'} pb-3 mb-6 -mx-2 px-2`}>
        <div className="flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto sm:overflow-visible scrollbar-thin scrollbar-thumb-slate-700 snap-x snap-mandatory">
          {[
            { id: 'questoes', label: 'Questões CEBRASPE', shortLabel: 'Questões', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'revisao', label: 'Revisão Espaçada', shortLabel: 'Revisão', icon: <Layers className="w-4 h-4" /> },
            { id: 'flashcards', label: 'Flashcards', shortLabel: 'Flashcards', icon: <RefreshCw className="w-4 h-4" /> },
            { id: 'contran', label: 'Radar CONTRAN', shortLabel: 'Radar CONTRAN', icon: <Shield className="w-4 h-4 text-amber-500 animate-pulse" /> },
            { id: 'foco', label: 'Modo Foco Pomodoro', shortLabel: 'Pomodoro', icon: <Clock className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ModeType)}
              className={`shrink-0 snap-start flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold font-mono transition-colors border whitespace-nowrap ${
                activeTab === tab.id
                  ? theme === 'light'
                    ? 'bg-blue-50 border-blue-600 text-blue-800 shadow-md'
                    : 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                  : theme === 'light'
                    ? 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
              id={`tab-${tab.id}`}
            >
              {tab.icon}
              <span className="sm:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.id === 'revisao' && urgentRevisaoCount > 0 && (
                <span className="ml-0.5 bg-red-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 leading-none">
                  {urgentRevisaoCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ==================================== TABCONTENT: QUESTÕES ==================================== */}
      {activeTab === 'questoes' && (
        <div className="space-y-6" id="questoes-sub-view">
          {/* Header & Filter Controls */}
          <div className="bg-slate-950 p-4 border border-slate-800/80 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 font-bold">Disciplina</label>
              <select 
                value={filterDiscipline} 
                onChange={(e) => { setFilterDiscipline(e.target.value); setCurrentQIndex(0); }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Todos">Todas as Disciplinas</option>
                <option value="Língua Portuguesa">Língua Portuguesa</option>
                <option value="Raciocínio Lógico-Matemático">Raciocínio Lógico-Matemático</option>
                <option value="Informática">Informática</option>
                <option value="Física">Física</option>
                <option value="Ética e Cidadania">Ética e Cidadania</option>
                <option value="Geopolítica">Geopolítica</option>
                <option value="Língua Estrangeira">Língua Estrangeira</option>
                <option value="Legislação de Trânsito">Legislação de Trânsito</option>
                <option value="Direito Administrativo">Direito Administrativo</option>
                <option value="Direito Constitucional">Direito Constitucional</option>
                <option value="Direito Penal">Direito Penal</option>
                <option value="Direito Processual Penal">Direito Processual Penal</option>
                <option value="Legislação Especial">Legislação Especial</option>
                <option value="Direitos Humanos">Direitos Humanos</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 font-bold">Dificuldade</label>
              <select 
                value={filterDifficulty} 
                onChange={(e) => { setFilterDifficulty(e.target.value); setCurrentQIndex(0); }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Todos">Todas as Dificuldades</option>
                <option value="Fácil">Fácil</option>
                <option value="Média">Média</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>

            <div className="pt-5 justify-self-stretch md:justify-self-end">
              <button 
                onClick={handleGenerateAiQuestion}
                disabled={isAiGenerating}
                className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-lg text-xs shadow-md transition-all disabled:opacity-50"
                id="btn-ai-question"
              >
                <Sparkles className="w-3.5 h-3.5" /> 
                {isAiGenerating ? 'A Athena está escrevendo...' : 'Gerar Questão Inédita por IA'}
              </button>
            </div>
          </div>

          {wrongQuestionsCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap -mt-2" id="error-filter-bar">
              <button
                onClick={() => {
                  setFilterOnlyErrors(prev => !prev);
                  setCurrentQIndex(0);
                  setSelectedAnswer(null);
                  setHasAnswered(false);
                  setShowSessionSummary(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold border transition-all ${
                  filterOnlyErrors
                    ? 'bg-red-950/40 border-red-500/60 text-red-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-red-700/60 hover:text-red-400'
                }`}
                id="btn-filter-only-errors"
              >
                <AlertTriangle className="w-3 h-3" /> Somente Erros ({wrongQuestionsCount})
              </button>
              {filterOnlyErrors && (
                <span className="text-[10px] font-mono text-slate-500 italic">mostrando apenas questões erradas nesta sessão</span>
              )}
            </div>
          )}

          {showSessionSummary ? (
            <div className="space-y-5 animate-fade-in" id="session-summary">
              <div className="text-center space-y-2 pt-2">
                <div className="text-5xl">
                  {sessionAnswered > 0 && sessionCorrect === sessionAnswered ? '🏆' : sessionAnswered > 0 && sessionCorrect / sessionAnswered >= 0.7 ? '🎯' : '📊'}
                </div>
                <h3 className="text-xl font-black text-white">Sessão Concluída!</h3>
                <p className="text-xs text-slate-400 font-mono">
                  {reviewingErrors ? 'Revisão de erros finalizada' : filterDiscipline === 'Todos' ? 'Todas as disciplinas' : filterDiscipline}
                  {filterDifficulty !== 'Todos' && ` · ${filterDifficulty}`}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-white">{sessionAnswered}</div>
                  <div className="text-[10px] font-mono uppercase text-slate-500 mt-0.5">Respondidas</div>
                </div>
                <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-emerald-400">{sessionCorrect}</div>
                  <div className="text-[10px] font-mono uppercase text-emerald-600 mt-0.5">Acertos</div>
                </div>
                <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-red-400">{sessionAnswered - sessionCorrect}</div>
                  <div className="text-[10px] font-mono uppercase text-red-600 mt-0.5">Erros</div>
                </div>
                <div className={`rounded-xl p-4 text-center border ${sessionAnswered > 0 && sessionCorrect / sessionAnswered >= 0.7 ? 'bg-emerald-950/30 border-emerald-900/40' : 'bg-amber-950/30 border-amber-900/40'}`}>
                  <div className={`text-2xl font-black ${sessionAnswered > 0 && sessionCorrect / sessionAnswered >= 0.7 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {sessionAnswered > 0 ? Math.round((sessionCorrect / sessionAnswered) * 100) : 0}%
                  </div>
                  <div className={`text-[10px] font-mono uppercase mt-0.5 ${sessionAnswered > 0 && sessionCorrect / sessionAnswered >= 0.7 ? 'text-emerald-600' : 'text-amber-600'}`}>Taxa</div>
                </div>
              </div>

              <div className="athena-box-style p-4 flex items-start gap-3">
                <span className="text-xl shrink-0">🦉</span>
                <div>
                  <p className="text-xs uppercase font-mono text-athena-title font-semibold tracking-wide mb-1">Análise da Mentora Athena</p>
                  <p className="text-xs text-athena-body leading-relaxed">
                    {sessionAnswered === 0
                      ? 'Nenhuma questão foi respondida nesta sessão.'
                      : sessionCorrect / sessionAnswered >= 0.8
                      ? `Excelente! ${sessionCorrect} de ${sessionAnswered} corretas. Continue nesse ritmo — a aprovação está próxima.`
                      : sessionCorrect / sessionAnswered >= 0.6
                      ? `Bom resultado. Revise os ${sessionAnswered - sessionCorrect} erros para fechar as lacunas antes da prova.`
                      : `Atenção: ${sessionAnswered - sessionCorrect} erros em ${sessionAnswered} questões. Os erros já foram adicionados à sua fila de Revisão Espaçada automaticamente.`}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {!reviewingErrors && sessionErrors.length > 0 && (
                  <button
                    onClick={() => {
                      setReviewingErrors(true);
                      setShowSessionSummary(false);
                      setCurrentQIndex(0);
                      setSelectedAnswer(null);
                      setHasAnswered(false);
                      setSessionAnswered(0);
                      setSessionCorrect(0);
                    }}
                    className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                    id="btn-review-errors"
                  >
                    <AlertTriangle className="w-4 h-4" /> Revisar {sessionErrors.length} {sessionErrors.length === 1 ? 'Erro' : 'Erros'}
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowSessionSummary(false);
                    setReviewingErrors(false);
                    setCurrentQIndex(0);
                    setSelectedAnswer(null);
                    setHasAnswered(false);
                    setSessionAnswered(0);
                    setSessionCorrect(0);
                    setSessionErrors([]);
                  }}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                  id="btn-new-session"
                >
                  <RefreshCw className="w-4 h-4" /> Nova Sessão
                </button>
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="space-y-4" id="active-question-card">
              {/* Progress counter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    Questão <span className="text-white font-bold">{currentQIndex + 1}</span>
                    <span className="text-slate-600"> / </span>
                    <span className="text-slate-300 font-bold">{activeQuestions.length}</span>
                    {(reviewingErrors || filterOnlyErrors) && <span className="ml-2 text-amber-400 font-semibold text-[10px] uppercase tracking-wide">• Revisão de Erros</span>}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold">{sessionCorrect} ✓</span>
                    <span className="text-red-400 font-bold">{sessionAnswered - sessionCorrect} ✗</span>
                  </span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${activeQuestions.length > 0 ? ((currentQIndex + (hasAnswered ? 1 : 0)) / activeQuestions.length) * 100 : 0}%`,
                      background: (reviewingErrors || filterOnlyErrors) ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #059669, #10b981)'
                    }}
                  />
                </div>
              </div>

              {/* Question metadata */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-full text-slate-300">
                  {currentQuestion.discipline} • {currentQuestion.subtopic}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  currentQuestion.difficulty === 'Fácil' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' :
                  currentQuestion.difficulty === 'Média' ? 'bg-yellow-950 text-yellow-500 border border-yellow-900/10' :
                  'bg-red-950 text-red-400 border border-red-900/30'
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>

              {/* CEBRASPE Question Code Block style */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                <span className="absolute top-2 right-4 text-[10px] font-mono text-slate-700 select-none">CEBRASPE EXCLUSIVE</span>
                <p className="text-slate-200 leading-relaxed text-sm font-sans" id="question-statement-text">
                  {currentQuestion.statement}
                </p>
              </div>

              {/* Core Choices (Certo/Errado) */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChooseAnswer('C')}
                  disabled={hasAnswered}
                  className={`p-4 rounded-xl border font-bold text-center transition-all focus:outline-none ${
                    selectedAnswer === 'C'
                      ? 'bg-emerald-600 border-emerald-500 text-white ring-2 ring-emerald-400/30 shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-700/60 hover:text-emerald-400'
                  }`}
                  id="btn-choice-c"
                >
                  <span className="block text-xl mb-1">Certo</span>
                  <span className={`text-[10px] font-mono font-medium ${selectedAnswer === 'C' ? 'text-white/80' : 'text-emerald-600/70'}`}>(Assertiva Verdadeira)</span>
                </button>
                <button
                  onClick={() => handleChooseAnswer('E')}
                  disabled={hasAnswered}
                  className={`p-4 rounded-xl border font-bold text-center transition-all focus:outline-none ${
                    selectedAnswer === 'E'
                      ? 'bg-red-600 border-red-500 text-white ring-2 ring-red-400/30 shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-red-700/60 hover:text-red-400'
                  }`}
                  id="btn-choice-e"
                >
                  <span className="block text-xl mb-1">Errado</span>
                  <span className={`text-[10px] font-mono font-medium ${selectedAnswer === 'E' ? 'text-white/80' : 'text-rose-600/70'}`}>(Assertiva Falsa)</span>
                </button>

              </div>

              {/* Keyboard shortcuts hint */}
              <div className="flex justify-center gap-6 text-[9px] font-mono text-slate-700 select-none -mt-1">
                {!hasAnswered ? (
                  <>
                    <span>← Errado</span>
                    <span>Certo →</span>
                    {selectedAnswer && <span className="text-slate-600">Enter Confirmar</span>}
                  </>
                ) : (
                  <span>Enter / → Próxima questão</span>
                )}
              </div>

              {/* Confirm / Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                {!hasAnswered ? (
                  <button
                    onClick={handleConfirmAnswer}
                    disabled={!selectedAnswer}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md ${
                      selectedAnswer 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-[1.01]' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                    id="btn-submit-answer"
                  >
                    Confirmar Julgamento
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    id="btn-next-question"
                  >
                    Próxima Questão <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Athena's detailed explanation box */}
              {hasAnswered && (
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 animate-slide-up space-y-3" id="explanation-box">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                    <span className="flex items-center gap-2 font-bold text-xs text-slate-300">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <Check className="w-4 h-4 bg-emerald-950 rounded-full p-0.5" /> VOCÊ ACERTOU! 🎉
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-400 font-bold">
                          <X className="w-4 h-4 bg-red-950 rounded-full p-0.5" /> VOCÊ ERROU! ❌
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase">Gabarito: <b className="text-yellow-500">{currentQuestion.correctAnswer === 'C' ? 'Certo' : 'Errado'}</b></span>
                  </div>

                  <div className="athena-box-style p-4 mt-4 flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">🦉</span>
                    <div className="space-y-1">
                      <p className="text-xs uppercase font-mono text-athena-title font-semibold tracking-wide">Veredito da Mentora Athena:</p>
                      <p className="text-xs text-athena-body leading-relaxed font-sans">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500" id="empty-state-questions">
              <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p>Nenhuma questão encontrada para os filtros selecionados.</p>
              <button 
                onClick={handleGenerateAiQuestion}
                disabled={isAiGenerating}
                className="mt-4 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-xs font-mono font-bold text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-800"
              >
                Gerar com IA Athena agora!
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================== TABCONTENT: REVISÃO ESPAÇADA ==================================== */}
      {activeTab === 'revisao' && (
        <div className="space-y-6" id="revisao-sub-view">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" /> Repetição Espaçada Inteligente
              </h3>
              <p className="text-xs text-slate-400">
                Algoritmo multiplicativo de retenção. Seus erros em questões e flashcards são programados automaticamente.
              </p>
            </div>
            {!sessionModeActive && (
              <button
                onClick={() => setShowAddTopicForm(prev => !prev)}
                className={`px-3.5 py-1.5 border text-[11px] font-mono font-bold rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                  showAddTopicForm
                    ? 'bg-emerald-950/40 border-emerald-500 text-white'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:text-white text-slate-300'
                }`}
                id="revisao-quick-add-btn"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-500" /> {showAddTopicForm ? 'Fechar' : 'Adicionar Tópico'}
              </button>
            )}
          </div>

          {!sessionModeActive && showAddTopicForm && (
            <div className="bg-slate-950 border border-emerald-900/30 rounded-xl p-4 space-y-3 animate-fade-in" id="add-topic-inline-form">
              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Novo Tópico de Revisão Espaçada</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Tópico / Lei</label>
                  <input
                    type="text"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    placeholder="Ex: Art. 306 CTB — crime de embriaguez"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Disciplina</label>
                  <select
                    value={newTopicDiscipline}
                    onChange={(e) => setNewTopicDiscipline(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Legislação de Trânsito">Legislação de Trânsito</option>
                    <option value="Direito Constitucional">Direito Constitucional</option>
                    <option value="Direito Penal">Direito Penal</option>
                    <option value="Direito Processual Penal">Direito Processual Penal</option>
                    <option value="Direito Administrativo">Direito Administrativo</option>
                    <option value="Língua Portuguesa">Língua Portuguesa</option>
                    <option value="Raciocínio Lógico-Matemático">Raciocínio Lógico-Matemático</option>
                    <option value="Física">Física</option>
                    <option value="Informática">Informática</option>
                    <option value="Direitos Humanos">Direitos Humanos</option>
                    <option value="Legislação Especial">Legislação Especial</option>
                    <option value="Ética e Cidadania">Ética e Cidadania</option>
                    <option value="Geopolítica">Geopolítica</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Observações / Gabarito para Autoavaliação</label>
                <textarea
                  value={newTopicDetails}
                  onChange={(e) => setNewTopicDetails(e.target.value)}
                  placeholder="Ex: O crime ocorre a partir de 0,34 mg/L no etilômetro..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  onClick={() => { setShowAddTopicForm(false); setNewTopicName(''); setNewTopicDiscipline('Legislação de Trânsito'); setNewTopicDetails(''); }}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!newTopicName.trim()) return;
                    const newItem: SpacedRepetitionItem = {
                      id: `sr_manual_${Date.now()}`,
                      discipline: newTopicDiscipline,
                      topic: newTopicName.trim(),
                      details: newTopicDetails.trim() || 'Defina observações chave durante o estudo.',
                      intervalDays: 1,
                      nextReviewDate: new Date().toISOString().split('T')[0],
                      reviewCount: 0,
                    };
                    setRevisaoItems(prev => [newItem, ...prev]);
                    playSuccessSound();
                    setShowAddTopicForm(false);
                    setNewTopicName('');
                    setNewTopicDiscipline('Legislação de Trânsito');
                    setNewTopicDetails('');
                  }}
                  disabled={!newTopicName.trim()}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold font-mono rounded-lg transition-colors"
                >
                  Adicionar à Fila
                </button>
              </div>
            </div>
          )}

          {/* ---- GUIDED SESSION MODE ---- */}
          {sessionModeActive && !sessionModeCompleted && sessionQueue[sessionQueueIndex] && (() => {
            const item = sessionQueue[sessionQueueIndex];
            return (
              <div className="space-y-4 animate-fade-in" id="guided-session-view">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Sessão Guiada · Card <span className="text-white font-bold mx-1">{sessionQueueIndex + 1}</span> de <span className="text-slate-300 font-bold mx-1">{sessionQueue.length}</span>
                    </span>
                    <button
                      onClick={() => { setSessionModeActive(false); setSessionModeCompleted(false); setSessionQueueIndex(0); setShowSolution(false); }}
                      className="text-slate-500 hover:text-red-400 text-[10px] font-mono font-bold transition-colors"
                    >
                      ✕ Sair da Sessão
                    </button>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                      style={{ width: `${(sessionQueueIndex / sessionQueue.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center gap-3 flex-wrap">
                    <span className="text-[9px] font-mono uppercase bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-emerald-400 font-bold">
                      {item.discipline}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      Intervalo: {item.intervalDays}d{item.reviewCount ? ` · ${item.reviewCount} revisões` : ''}
                    </span>
                  </div>
                  <div className="p-6 space-y-5">
                    <h3 className="text-sm font-bold text-white tracking-tight leading-snug">{item.topic}</h3>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                      <span className="text-[9px] uppercase font-mono font-extrabold text-slate-500 tracking-wider">
                        💡 Desafio Cognitivo (Resgate Mental)
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                        Mentalize a regra jurídica, artigo ou fórmula correspondente antes de revelar.
                      </p>

                      {!showSolution ? (
                        <button
                          onClick={() => setShowSolution(true)}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-xl text-xs font-mono font-bold transition-transform hover:scale-[1.01]"
                        >
                          Revelar Gabarito / Detalhes
                        </button>
                      ) : (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 animate-fade-in">
                          <span className="text-[9px] text-emerald-400 uppercase font-mono font-bold block">Gabarito e Justificativa</span>
                          <p className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">{item.details}</p>
                        </div>
                      )}
                    </div>

                    {showSolution && (
                      <div className="space-y-3 animate-fade-in">
                        <p className="text-center text-xs text-slate-300 font-semibold font-mono">Como foi sua retenção?</p>
                        <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
                          {(['esqueci', 'dificil', 'bom', 'facil'] as const).map((rating) => {
                            const nextInterval = computeNextInterval(item.intervalDays, rating);
                            const cfg = {
                              esqueci: { icon: '❌', label: 'Esqueci', cls: 'bg-red-950/20 border-red-900/40 hover:bg-red-950/50 hover:border-red-500 text-red-400' },
                              dificil: { icon: '⚠️', label: 'Difícil', cls: 'bg-amber-950/20 border-amber-900/40 hover:bg-amber-950/50 hover:border-amber-500 text-amber-500' },
                              bom:     { icon: '⚡', label: 'Bom',    cls: 'bg-indigo-950/20 border-indigo-900/40 hover:bg-indigo-950/50 hover:border-indigo-500 text-indigo-400' },
                              facil:   { icon: '🏆', label: 'Fácil',  cls: 'bg-emerald-950/20 border-emerald-900/40 hover:bg-emerald-950/50 hover:border-emerald-500 text-emerald-400' },
                            }[rating];
                            return (
                              <button
                                key={rating}
                                onClick={() => handleResolveReviewWithInterval(item, rating)}
                                className={`py-2.5 px-2 border rounded-xl text-[10px] font-mono font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${cfg.cls}`}
                              >
                                <span className="text-sm">{cfg.icon}</span>
                                <span>{cfg.label}</span>
                                <span className="text-[9px] opacity-70">{nextInterval === 1 ? '1 dia' : `${nextInterval} dias`}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ---- SESSION COMPLETED ---- */}
          {sessionModeActive && sessionModeCompleted && (
            <div className="text-center space-y-5 py-6 animate-fade-in" id="session-completed-view">
              <div className="text-5xl">🎯</div>
              <div>
                <h3 className="text-xl font-black text-white">Sessão Concluída!</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">{sessionReviewedCount} {sessionReviewedCount === 1 ? 'card revisado' : 'cards revisados'} com sucesso</p>
              </div>
              <div className="athena-box-style p-4 flex items-start gap-3 text-left max-w-sm mx-auto">
                <span className="text-xl shrink-0">🦉</span>
                <p className="text-xs text-athena-body leading-relaxed">
                  Excelente disciplina! Revisar cards diariamente é o que separa candidatos aprovados dos reprovados. Continue amanhã para consolidar a memória de longo prazo.
                </p>
              </div>
              <button
                onClick={() => { setSessionModeActive(false); setSessionModeCompleted(false); setSessionQueueIndex(0); setSessionReviewedCount(0); }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2 mx-auto"
              >
                <Layers className="w-4 h-4" /> Ver Lista Completa
              </button>
            </div>
          )}

          {/* ---- REGULAR LIST VIEW ---- */}
          {!sessionModeActive && (
            <>
              {/* Analytics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="spaced-rep-analytics-dashboard">
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">Total de Itens</span>
                  <span className="text-xl font-bold text-white leading-none">{revisaoItems.length}</span>
                </div>
                <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-3.5 text-center shadow-lg">
                  <span className="text-[10px] font-mono uppercase text-amber-500 block mb-0.5 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block"></span> Urgentes (Hoje)
                  </span>
                  <span className="text-xl font-bold text-white leading-none">{urgentRevisaoCount}</span>
                </div>
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">Agendados (Futuro)</span>
                  <span className="text-xl font-bold text-slate-300 leading-none">
                    {revisaoItems.filter(i => i.nextReviewDate > new Date().toISOString().split('T')[0] && i.intervalDays < 21).length}
                  </span>
                </div>
                <div className="bg-slate-950 border border-emerald-900/30 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] font-mono uppercase text-emerald-500 block mb-0.5">Dominados (≥21d)</span>
                  <span className="text-xl font-bold text-emerald-400 leading-none">
                    {revisaoItems.filter(i => i.intervalDays >= 21).length}
                  </span>
                </div>
              </div>

              {/* Guided session CTA */}
              {urgentRevisaoCount > 0 && (
                <button
                  onClick={startGuidedSession}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  id="btn-start-guided-session"
                >
                  <Zap className="w-4 h-4" /> Iniciar Sessão Guiada — {urgentRevisaoCount} card{urgentRevisaoCount > 1 ? 's' : ''} urgente{urgentRevisaoCount > 1 ? 's' : ''}
                </button>
              )}

              {/* Filter Bar */}
              <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl gap-1 overflow-x-auto" id="revisao-filters-container">
                {[
                  { id: 'todos', label: 'Todos os Itens' },
                  { id: 'urgentes', label: 'Revisões Urgentes' },
                  { id: 'agendados', label: 'Próximos Dias' },
                  { id: 'dominados', label: 'Tópicos Dominados' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setRevisaoFilter(tab.id as any)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
                      revisaoFilter === tab.id
                        ? 'bg-emerald-950/40 border border-emerald-500 text-white shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                    }`}
                    id={`btn-revisao-filter-${tab.id}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Main Repetition List */}
              <div className="space-y-3" id="revisao-items-list-container">
                {revisaoItems
                  .filter(item => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const isUrgent = item.nextReviewDate <= todayStr;
                    const isScheduled = item.nextReviewDate > todayStr && item.intervalDays < 21;
                    const isDominado = item.intervalDays >= 21;
                    if (revisaoFilter === 'urgentes') return isUrgent;
                    if (revisaoFilter === 'agendados') return isScheduled;
                    if (revisaoFilter === 'dominados') return isDominado;
                    return true;
                  })
                  .map((item) => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const isUrgent = item.nextReviewDate <= todayStr;
                    const isDominado = item.intervalDays >= 21;
                    const diffDays = Math.ceil((new Date(item.nextReviewDate).getTime() - new Date(todayStr).getTime()) / (1000 * 60 * 60 * 24));

                    return (
                      <div
                        key={item.id}
                        className={`p-4 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                          isUrgent
                            ? 'bg-slate-900 border-red-900/40 hover:border-red-700/60'
                            : isDominado
                              ? 'bg-slate-900 border-emerald-900/30 hover:border-emerald-800/50'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                        id={`spaced-card-item-${item.id}`}
                      >
                        <div className="space-y-1.5 flex-1 select-none">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="text-[9px] font-mono uppercase bg-slate-800 border border-slate-700 text-slate-400 py-0.5 px-2 rounded-md tracking-wider">
                              {item.discipline}
                            </span>
                            {isUrgent ? (
                              <span className="text-[9px] font-mono bg-red-950/40 border border-red-900/40 text-red-400 py-0.5 px-2 rounded-md font-extrabold flex items-center gap-1 animate-pulse">
                                🚨 Urgente
                              </span>
                            ) : isDominado ? (
                              <span className="text-[9px] font-mono bg-emerald-950/30 border border-emerald-900/30 text-emerald-400 py-0.5 px-2 rounded-md font-bold">
                                🏆 Dominado
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono bg-slate-800 border border-slate-700 text-slate-400 py-0.5 px-2 rounded-md font-bold">
                                📅 Em {diffDays === 1 ? '1 dia' : `${diffDays} dias`} ({item.nextReviewDate.split('-').reverse().slice(0, 2).join('/')})
                              </span>
                            )}
                            <span className="text-[9px] font-mono bg-blue-950/40 border border-blue-900/40 text-blue-400 py-0.5 px-1.5 rounded font-semibold">
                              {item.intervalDays}d{item.reviewCount ? ` · ${item.reviewCount}×` : ''}
                            </span>
                          </div>
                          <p className="text-xs text-slate-100 font-sans font-bold leading-relaxed">{item.topic}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-2 italic font-serif">{item.details}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                          <button
                            onClick={() => { setSelectedRevisaoItem(item); setShowSolution(false); }}
                            className={`py-2 px-4 rounded-xl text-xs font-mono font-extrabold shadow-sm transition-all text-center flex items-center gap-1.5 ${
                              isUrgent
                                ? 'bg-amber-500 hover:bg-amber-400 hover:scale-[1.01] text-slate-950'
                                : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                            id={`btn-revisar-item-${item.id}`}
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Revisar
                          </button>
                          <button
                            onClick={() => handleDeleteRevisaoItem(item.id)}
                            className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                            title="Remover da fila"
                            id={`btn-delete-item-${item.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                {revisaoItems.filter(item => {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const isUrgent = item.nextReviewDate <= todayStr;
                  const isScheduled = item.nextReviewDate > todayStr && item.intervalDays < 21;
                  const isDominado = item.intervalDays >= 21;
                  if (revisaoFilter === 'urgentes') return isUrgent;
                  if (revisaoFilter === 'agendados') return isScheduled;
                  if (revisaoFilter === 'dominados') return isDominado;
                  return true;
                }).length === 0 && (
                  <div className="text-center py-12 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-slate-500" id="spaced-empty-state">
                    <HelpCircle className="w-12 h-12 text-slate-700 mx-auto mb-2" />
                    <p className="text-xs font-semibold">Nenhum tópico sob estes filtros.</p>
                    <p className="text-[10px] text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                      Continue respondendo questões e usando flashcards. Seus erros são adicionados automaticamente!
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-slate-950/55 border border-slate-800/80 p-4 rounded-xl text-xs text-slate-400 leading-relaxed flex items-start gap-2.5">
                <span className="text-base shrink-0">📈</span>
                <div>
                  <p className="font-semibold text-slate-300 text-xs mb-1">Como funciona o algoritmo multiplicativo?</p>
                  <p>
                    Cada avaliação ajusta o intervalo proporcionalmente: <b className="text-slate-300">Esqueci</b> reinicia para 1 dia; <b className="text-slate-300">Difícil</b> reduz 25%; <b className="text-slate-300">Bom</b> aumenta 50%; <b className="text-slate-300">Fácil</b> aumenta 150%. Sem teto — tópicos bem dominados chegam a 30, 60 ou mais dias.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Modal - individual review (not in session mode) */}
          {selectedRevisaoItem && !sessionModeActive && (
            <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="spaced-assessment-modal">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">

                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-emerald-400 font-bold">
                      {selectedRevisaoItem.discipline}
                    </span>
                    <h4 className="text-xs text-slate-400 font-mono">Autoavaliação de Memorização</h4>
                  </div>
                  <button
                    onClick={() => { setSelectedRevisaoItem(null); setShowSolution(false); }}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
                    id="btn-close-spaced-modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-5 flex-1">
                  <div className="space-y-1 select-none">
                    <h3 className="text-sm font-bold text-white tracking-tight">{selectedRevisaoItem.topic}</h3>
                    <span className="text-[9px] text-[#F97316] font-mono leading-none block">
                      Intervalo: {selectedRevisaoItem.intervalDays}d{selectedRevisaoItem.reviewCount ? ` · ${selectedRevisaoItem.reviewCount} revisões` : ''}
                    </span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                    <span className="text-[9px] uppercase font-mono font-extrabold text-slate-500 tracking-wider">
                      💡 Desafio Cognitivo (Resgate Mental)
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      Mentalize a regra jurídica, artigo do CTB ou lei física antes de revelar os detalhes.
                    </p>

                    {!showSolution ? (
                      <button
                        onClick={() => setShowSolution(true)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-xl text-xs font-mono font-bold transition-transform hover:scale-[1.01]"
                        id="btn-reveal-solution"
                      >
                        Revelar Solução / Cartão de Detalhes
                      </button>
                    ) : (
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 animate-fade-in">
                        <span className="text-[9px] text-emerald-400 uppercase font-mono font-bold block">Gabarito e Justificativa Detalhada</span>
                        <p className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">{selectedRevisaoItem.details}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-4">
                  {showSolution ? (
                    <div className="space-y-3">
                      <p className="text-center text-xs text-slate-300 font-semibold font-mono">Como foi sua retenção?</p>
                      <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
                        {(['esqueci', 'dificil', 'bom', 'facil'] as const).map((rating) => {
                          const nextInterval = computeNextInterval(selectedRevisaoItem.intervalDays, rating);
                          const cfg = {
                            esqueci: { icon: '❌', label: 'Esqueci', cls: 'bg-red-950/20 border-red-900/40 hover:bg-red-950/50 hover:border-red-500 text-red-400', id: 'btn-rate-errei' },
                            dificil: { icon: '⚠️', label: 'Difícil', cls: 'bg-amber-950/20 border-amber-900/40 hover:bg-amber-950/50 hover:border-amber-500 text-amber-500', id: 'btn-rate-dificil' },
                            bom:     { icon: '⚡', label: 'Bom',    cls: 'bg-indigo-950/20 border-indigo-900/40 hover:bg-indigo-950/50 hover:border-indigo-500 text-indigo-400', id: 'btn-rate-bom' },
                            facil:   { icon: '🏆', label: 'Fácil',  cls: 'bg-emerald-950/20 border-emerald-900/40 hover:bg-emerald-950/50 hover:border-emerald-500 text-emerald-400', id: 'btn-rate-facil' },
                          }[rating];
                          return (
                            <button
                              key={rating}
                              onClick={() => handleResolveReviewWithInterval(selectedRevisaoItem, rating)}
                              className={`py-2.5 px-2 border rounded-xl text-[10px] font-mono font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${cfg.cls}`}
                              id={cfg.id}
                            >
                              <span className="text-sm">{cfg.icon}</span>
                              <span>{cfg.label}</span>
                              <span className="text-[9px] opacity-70">{nextInterval === 1 ? '1 dia' : `${nextInterval} dias`}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-xs text-slate-500 italic">
                      Clique no botão acima para revelar o gabarito e avaliar sua retenção.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================== TABCONTENT: FLASHCARDS ==================================== */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6" id="flashcards-sub-view">
          {/* Controls bar */}
          <div className="flex justify-between items-center bg-slate-950 border border-slate-800 p-3 rounded-xl flex-wrap gap-4">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span>Deck de Memorização • Ativo: <b className="text-emerald-400">{fcIndex + 1}/{flashcardDeck.length}</b></span>
            </div>
            <button 
              onClick={handleGenerateAiFlashcard}
              disabled={generatingCard}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 py-1.5 px-3.5 rounded-lg text-xs font-bold hover:scale-[1.01] transition-transform shadow disabled:opacity-40"
              id="btn-generate-fc-ai"
            >
              <Sparkles className="w-3 h-3" />
              {generatingCard ? 'Escrevendo...' : 'Gerar Flashcard com IA'}
            </button>
          </div>

          {activeCard ? (
            <div className="flex flex-col items-center justify-center max-w-lg mx-auto" id="flashcard-deck-box">
              {/* Card Container */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`w-full min-h-[220px] bg-slate-950 border rounded-2xl cursor-pointer shadow-lg p-6 flex flex-col justify-between transition-all duration-300 relative select-none ${
                  isFlipped 
                    ? 'border-emerald-500 ring-1 ring-emerald-500/30 shadow-emerald-500/10 shadow-xl' 
                    : 'border-slate-800 hover:border-slate-700/80'
                }`}
                id="interactive-fc-card"
              >
                {/* Category label indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-bold">
                    {activeCard.category}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase">{isFlipped ? 'Resposta' : 'Pergunta'}</span>
                </div>

                {/* Central sentence */}
                <div className="text-center py-6">
                  {isFlipped ? (
                    <p className="text-slate-100 font-medium text-sm sm:text-base leading-relaxed font-sans">{activeCard.answer}</p>
                  ) : (
                    <p className="text-white font-extrabold text-sm sm:text-lg leading-snug font-sans">{activeCard.question}</p>
                  )}
                </div>

                {/* Footer advice */}
                <span className="text-center text-[10px] text-slate-600 font-mono tracking-wide uppercase font-semibold">
                  {isFlipped ? 'Clique para ver a Pergunta' : 'Clique para Revelar a Resposta'}
                </span>
              </div>

              <div className="text-[9px] font-mono text-slate-700 text-center mt-3 select-none">
                {!isFlipped ? 'Space / Enter — Revelar' : '← Esqueci     → Lembrei'}
              </div>

              {/* Action buttons (only displayed once card is flipped over) */}
              {isFlipped && (
                <div className="flex justify-center gap-4 mt-6 w-full animate-fade-in" id="fc-controls">
                  <button 
                    onClick={() => handleCardFeedback(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-red-900/40 bg-red-950/20 text-red-500 hover:bg-red-950/40 font-bold font-mono text-xs transition-colors"
                  >
                    Eu esqueci
                  </button>
                  <button 
                    onClick={() => handleCardFeedback(true)}
                    className="flex-1 py-3 px-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 text-emerald-500 hover:bg-emerald-950/40 font-bold font-mono text-xs transition-colors"
                  >
                    Eu lembrei
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              <p>Nenhum card disponível.</p>
            </div>
          )}
        </div>
      )}

      {/* ==================================== TABCONTENT: MODO FOCO POMODORO ==================================== */}
      {activeTab === 'foco' && (
        <div className="space-y-6" id="foco-sub-view">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="foco-pomodoro-layout">
            
            {/* Left Col: Setup Pomodoro parameters */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-400">Parametrizar Sessão de Foco</h3>
              
              <div className="space-y-2">
                <label className="block text-xs text-slate-400 font-mono font-semibold uppercase">Matéria Foco</label>
                <select 
                  value={focoDiscipline}
                  onChange={(e) => setFocoDiscipline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Língua Portuguesa">Língua Portuguesa</option>
                  <option value="Raciocínio Lógico-Matemático">Raciocínio Lógico-Matemático</option>
                  <option value="Informática">Informática</option>
                  <option value="Física">Física</option>
                  <option value="Ética e Cidadania">Ética e Cidadania</option>
                  <option value="Geopolítica">Geopolítica</option>
                  <option value="Língua Estrangeira">Língua Estrangeira</option>
                  <option value="Legislação de Trânsito">Legislação de Trânsito</option>
                  <option value="Direito Administrativo">Direito Administrativo</option>
                  <option value="Direito Constitucional">Direito Constitucional</option>
                  <option value="Direito Penal">Direito Penal</option>
                  <option value="Direito Processual Penal">Direito Processual Penal</option>
                  <option value="Legislação Especial">Legislação Especial</option>
                  <option value="Direitos Humanos">Direitos Humanos</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-slate-400 font-mono font-semibold uppercase">Tópico ou Atividade</label>
                <input 
                  type="text"
                  value={focoTopic}
                  onChange={(e) => setFocoTopic(e.target.value)}
                  placeholder="Ex: Resoluções do CONTRAN sobre velocidade"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-slate-400 font-mono font-semibold uppercase">Tempo Estimado da Patrulha</label>
                <div className="grid grid-cols-3 gap-2">
                  {[25, 40, 50].map((t) => (
                    <button
                      key={t}
                      onClick={() => setFocoMinutesPreset(t)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                        focoMinutesPreset === t 
                          ? 'bg-emerald-950/40 border-emerald-500 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {t} Minutos
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Visual Countdown Clock */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center space-y-6" id="countdown-flipper">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold block">{focoDiscipline}</span>
                <span className="text-xs text-slate-400 truncate max-w-[200px] block italic">"{focoTopic}"</span>
              </div>

              {/* Big aesthetic clock face */}
              <div className="relative w-40 h-40 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shadow-inner">
                <div className="text-3xl font-black text-white font-mono tracking-tight" id="focus-timer-clock-digits">
                  {formatTime(timeLeft)}
                </div>
                {/* Visual ticking indicator */}
                <div className={`absolute top-0 right-0 bottom-0 left-0 border-4 border-transparent rounded-full border-t-emerald-500 ${timerRunning ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              </div>

              {/* Control Trigger buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleToggleTimer}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
                    timerRunning 
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                  id="btn-foco-toggle"
                >
                  {timerRunning ? <><Pause className="w-4 h-4" /> Pausar</> : <><Play className="w-4 h-4" /> Iniciar Patrulha</>}
                </button>

                <button
                  onClick={handleResetTimer}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl text-xs font-bold hover:text-white"
                  id="btn-foco-reset"
                >
                  Reiniciar
                </button>
              </div>

              {cycleCompleted && (
                <div className="text-emerald-400 text-xs font-bold font-mono text-center flex items-center gap-1.5 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Parabéns! Ciclo de estudos concluído! +0.8% adicionado.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ==================================== TABCONTENT: RADAR CONTRAN ==================================== */}
      {activeTab === 'contran' && (
        <RadarContran />
      )}
    </div>
  );
}
