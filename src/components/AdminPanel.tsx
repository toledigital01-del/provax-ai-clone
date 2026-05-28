import React, { useState } from 'react';
import { 
  Compass, Users, BookOpen, HelpCircle, Calendar, CreditCard, Settings, 
  TrendingUp, ArrowLeftRight, Search, Plus, Upload, Link, AlertTriangle, 
  Sparkles, Check, X, ShieldCheck, FileText, Send, Layers, Mail, 
  Phone, CalendarDays, Percent, ArrowUpRight, CheckCircle2, Sliders, ChevronRight,
  Sun, Moon, Loader2
} from 'lucide-react';
import { playClickSound, playSuccessSound, playCorrectSound } from '../utils/audioEffects';

interface AdminPanelProps {
  onBack: () => void;
  theme: 'light' | 'dark';
  toggleTheme?: () => void;
}

// Initial mockup data
const INITIAL_STUDENTS = [
  { id: '1', name: 'Guilherme Toledo', email: 'toledo.digital01@gmail.com', plan: 'Athena Gold', performance: 88, streak: 12, lastAccess: 'Hoje, 14:32', situation: 'safe', notes: 'Aluno altamente engajado, focando na Resolução 432 do CONTRAN.' },
  { id: '2', name: 'Ana Oliveira', email: 'ana.oliveira@gmail.com', plan: 'Athena Gold', performance: 76, streak: 8, lastAccess: 'Hoje, 09:12', situation: 'safe', notes: 'Progresso regular em Física de Trânsito, precisa reforçar colisões.' },
  { id: '3', name: 'Carlos Eduardo', email: 'carlos.edu@hotmail.com', plan: 'Essencial', performance: 58, streak: 0, lastAccess: 'Há 3 dias', situation: 'warning', notes: 'Desempenho em Direito Administrativo caiu. Recomendável propor simulado de reforço.' },
  { id: '4', name: 'Mariana Costa', email: 'mari.costa@gmail.com', plan: 'Essencial', performance: 45, streak: 2, lastAccess: 'Ontem, 20:45', situation: 'critical', notes: 'Risco alto de cancelamento. Pouco tempo de tela no modo foco nesta semana.' },
  { id: '5', name: 'Roberto Mendes', email: 'roberto.prf@gmail.com', plan: 'Gratuito Lite', performance: 92, streak: 15, lastAccess: 'Hoje, 15:10', situation: 'safe', notes: 'Disparou em acerto de questões. Excelente candidato para upgrade de plano.' },
  { id: '6', name: 'Juliana Vieira', email: 'ju.vieira@outlook.com', plan: 'Gratuito Lite', performance: 38, streak: 0, lastAccess: 'Há 5 dias', situation: 'critical', notes: 'Sem atividades práticas registradas há uma semana. Alerta de churn ativo.' }
];

const INITIAL_KNOWLEDGE = [
  { id: 'ctb', discipline: 'Legislação de Trânsito (CTB)', materials: 14, lastUpdate: 'Hoje, 10:15', aiStatus: 'Sincronizada', size: '24.8 MB', priority: 'Alta', trend: 'Crescente', coverage: 87, recurrence: 'Altíssima', weight: '25.0%' },
  { id: 'contran', discipline: 'Resoluções do CONTRAN', materials: 12, lastUpdate: 'Hoje, 11:30', aiStatus: 'Sincronizada', size: '15.6 MB', priority: 'Alta', trend: 'Crescente', coverage: 92, recurrence: 'Altíssima', weight: '15.0%', isContranResolutions: true, contranLink: 'https://www.gov.br/transportes/pt-br/assuntos/transito/senatran/resolucoes-contran' },
  { id: 'port', discipline: 'Língua Portuguesa', materials: 11, lastUpdate: '15/05/2026', aiStatus: 'Sincronizada', size: '18.1 MB', priority: 'Alta', trend: 'Estável', coverage: 74, recurrence: 'Alta', weight: '12.5%' },
  { id: 'rlm', discipline: 'Raciocínio Lógico-Matemático', materials: 9, lastUpdate: '19/05/2026', aiStatus: 'Sincronizada', size: '14.2 MB', priority: 'Média', trend: 'Estável', coverage: 68, recurrence: 'Alta', weight: '8.3%' },
  { id: 'inf', discipline: 'Informática', materials: 7, lastUpdate: '04/05/2026', aiStatus: 'Sincronizada', size: '11.0 MB', priority: 'Média', trend: 'Estável', coverage: 60, recurrence: 'Média', weight: '6.7%' },
  { id: 'fis', discipline: 'Física', materials: 5, lastUpdate: '18/05/2026', aiStatus: 'Sincronizada', size: '6.2 MB', priority: 'Alta', trend: 'Crescente', coverage: 90, recurrence: 'Altíssima', weight: '8.3%' },
  { id: 'etica', discipline: 'Ética e Cidadania', materials: 4, lastUpdate: '12/05/2026', aiStatus: 'Sincronizada', size: '3.5 MB', priority: 'Baixa', trend: 'Em Queda', coverage: 95, recurrence: 'Baixa', weight: '2.5%' },
  { id: 'geo', discipline: 'Geopolítica', materials: 5, lastUpdate: '10/05/2026', aiStatus: 'Sincronizada', size: '4.8 MB', priority: 'Baixa', trend: 'Estável', coverage: 82, recurrence: 'Média', weight: '4.1%' },
  { id: 'estrangeira', discipline: 'Língua Estrangeira (Inglês ou Espanhol)', materials: 6, lastUpdate: '08/05/2026', aiStatus: 'Sincronizada', size: '5.4 MB', priority: 'Média', trend: 'Estável', coverage: 70, recurrence: 'Média', weight: '4.1%' },
  { id: 'admin', discipline: 'Direito Administrativo', materials: 6, lastUpdate: '12/05/2026', aiStatus: 'Sincronizada', size: '9.5 MB', priority: 'Alta', trend: 'Crescente', coverage: 80, recurrence: 'Alta', weight: '6.2%' },
  { id: 'const', discipline: 'Direito Constitucional', materials: 8, lastUpdate: 'Ontem, 16:40', aiStatus: 'Sincronizada', size: '12.4 MB', priority: 'Alta', trend: 'Crescente', coverage: 78, recurrence: 'Alta', weight: '6.2%' },
  { id: 'penal', discipline: 'Direito Penal', materials: 7, lastUpdate: '14/05/2026', aiStatus: 'Sincronizada', size: '8.1 MB', priority: 'Alta', trend: 'Estável', coverage: 85, recurrence: 'Alta', weight: '6.2%' },
  { id: 'proc_penal', discipline: 'Direito Processual Penal', materials: 5, lastUpdate: '11/05/2026', aiStatus: 'Sincronizada', size: '6.9 MB', priority: 'Média', trend: 'Estável', coverage: 72, recurrence: 'Média', weight: '5.0%' },
  { id: 'especial', discipline: 'Legislação Especial', materials: 8, lastUpdate: '13/05/2026', aiStatus: 'Sincronizada', size: '10.3 MB', priority: 'Alta', trend: 'Crescente', coverage: 81, recurrence: 'Alta', weight: '6.2%' },
  { id: 'dh', discipline: 'Direitos Humanos', materials: 4, lastUpdate: '07/05/2026', aiStatus: 'Sincronizada', size: '4.2 MB', priority: 'Baixa', trend: 'Em Queda', coverage: 88, recurrence: 'Baixa', weight: '2.5%' }
];

const INITIAL_QUESTIONS = [
  { id: 'q1', statement: 'Constitui crime de trânsito conduzir veículo automotor com capacidade psicomotora alterada em razão da influência de álcool, sendo constatada tal conduta por meio de teste de etilômetro com medição igual ou superior a 0,34 mg/L de ar alveolar expirado.', answer: 'C', discipline: 'Legislação de Trânsito (CTB)', subtopic: 'Resolução 432 CONTRAN', status: 'Ativa' },
  { id: 'q2', statement: 'As películas refletivas (espelhadas) são permitidas em rodovias federais desde que instaladas unicamente nos vidros laterais traseiros e possuam transmitância de no mínimo 28%.', answer: 'E', discipline: 'Legislação de Trânsito (CTB)', subtopic: 'Resolução 960 CONTRAN', status: 'Ativa' },
  { id: 'q3', statement: 'O princípio da autoexecutoriedade permite que a administração pública aplique a retenção de um caminhão para regularização de carga sem prévia autorização judicial.', answer: 'C', discipline: 'Direito Administrativo', subtopic: 'Ato Administrativo', status: 'Ativa' },
  { id: 'q4', statement: 'Nas colisões frontais entre dois automóveis trafegando em sentidos opostos, a energia cinética total do sistema antes do impacto equivale numericamente à diferença das energias de movimento individuais.', answer: 'E', discipline: 'Física', subtopic: 'Dinâmica de Colisões', status: 'Em Revisão' },
  { id: 'q5', statement: 'A LADV (Licença de Aprendizagem de Direção Veicular) será imediatamente cassada de forma definitiva se o candidato for encontrado dirigindo desacompanhado.', answer: 'E', discipline: 'Legislação de Trânsito (CTB)', subtopic: 'Resolução 789 CONTRAN', status: 'Ativa' }
];

const INITIAL_TEMPLATES = [
  { id: 't1', name: 'Operação Reta Final PRF', cycle: 'Ciclo Semanal de Elite', duration: '90 dias', focus: 'Legislação, Física e Redação', studentsCount: 412 },
  { id: 't2', name: 'Ciclo Básico de Formação Policial', cycle: 'Foco em Teoria de Base', duration: '180 dias', focus: 'Português, Administrativo e Constitucional', studentsCount: 520 },
  { id: 't3', name: 'Simulados de Alta Pressão', cycle: 'Foco 100% de Prática', duration: '45 dias', focus: 'Resolução de Questões C/E Cebraspe', studentsCount: 592 }
];

export default function AdminPanel({ onBack, theme, toggleTheme }: AdminPanelProps) {
  // Navigation active state inside Admin panel (dashboard, alunos, conhecimento, questoes, cronogramas, planos, configuracoes)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alunos' | 'conhecimento' | 'questoes' | 'cronogramas' | 'planos' | 'configuracoes'>('dashboard');
  
  // Interactive database states
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [knowledge, setKnowledge] = useState(INITIAL_KNOWLEDGE);
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);

  // Filter states
  const [studentSearch, setStudentSearch] = useState('');
  const [studentPlanFilter, setStudentPlanFilter] = useState('Todos');
  const [studentRiskFilter, setStudentRiskFilter] = useState('Todos');
  
  // Modals / Detail Drawer
  const [selectedStudent, setSelectedStudent] = useState<typeof INITIAL_STUDENTS[0] | null>(null);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState<string | null>(null); // disciplineId or null

  // Knowledge base addition state
  const [materialType, setMaterialType] = useState<'upload' | 'text' | 'link' | 'flashcard'>('upload');
  const [manualMaterialText, setManualMaterialText] = useState('');
  const [manualMaterialTitle, setManualMaterialTitle] = useState('');
  const [materialLink, setMaterialLink] = useState('');
  const [flashcardFront, setFlashcardFront] = useState('');
  const [flashcardBack, setFlashcardBack] = useState('');

  // Manual Question creation states
  const [newQuestionStatement, setNewQuestionStatement] = useState('');
  const [newQuestionAnswer, setNewQuestionAnswer] = useState<'C' | 'E'>('C');
  const [newQuestionDiscipline, setNewQuestionDiscipline] = useState('Legislação de Trânsito (CTB)');
  const [newQuestionSubtopic, setNewQuestionSubtopic] = useState('');
  const [newQuestionExplanation, setNewQuestionExplanation] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');

  // Athena AI - Automatos de Editais states
  const [subTabKnowledge, setSubTabKnowledge] = useState<'disciplinas' | 'editais'>('disciplinas');
  const [customEditalText, setCustomEditalText] = useState('');
  const [selectedHistoricalEdital, setSelectedHistoricalEdital] = useState<string>('prf_2021');
  const [isProcessingEdital, setIsProcessingEdital] = useState(false);
  const [processingStatusList, setProcessingStatusList] = useState<string[]>([]);
  const [hasCompletedAnalysis, setHasCompletedAnalysis] = useState(false);
  const [successCalibrateBanner, setSuccessCalibrateBanner] = useState(false);

  // Template CRUD states
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [tempTemplateName, setTempTemplateName] = useState('');
  const [tempTemplateCycle, setTempTemplateCycle] = useState('');
  const [tempTemplateDuration, setTempTemplateDuration] = useState('');
  const [tempTemplateFocus, setTempTemplateFocus] = useState('');

  // AI Behavior and Tone Customization States
  const [aiName, setAiName] = useState('Athena AI');
  const [aiTone, setAiTone] = useState('elite'); // elite, motivator, academic, direct
  const [aiStrictness, setAiStrictness] = useState('high'); // high, balance, soft
  const [aiCustomInstruction, setAiCustomInstruction] = useState('Focar em dar dicas de memorização de trânsito, simular pegadinhas do CTB sutilmente e utilizar tom de mentoria de alta performance policial.');
  const [aiPromptVersion, setAiPromptVersion] = useState('v2.4-stable-cebraspe');
  const [isSavingAIConfig, setIsSavingAIConfig] = useState(false);
  const [aiConfigSavedToast, setAiConfigSavedToast] = useState(false);

  // LLM Multi-Provider configuration
  const [aiProvider, setAiProvider] = useState(() => localStorage.getItem('athena_ai_provider') || 'gemini');
  const [openaiApiKey, setOpenaiApiKey] = useState(() => localStorage.getItem('athena_openai_api_key') || '');
  const [anthropicApiKey, setAnthropicApiKey] = useState(() => localStorage.getItem('athena_anthropic_api_key') || '');
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('athena_gemini_api_key') || '');

  // Handle student filter actions
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          s.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesPlan = studentPlanFilter === 'Todos' || s.plan === studentPlanFilter;
    const matchesRisk = studentRiskFilter === 'Todos' || 
                        (studentRiskFilter === 'safe' && s.situation === 'safe') ||
                        (studentRiskFilter === 'warning' && s.situation === 'warning') ||
                        (studentRiskFilter === 'critical' && s.situation === 'critical');
    return matchesSearch && matchesPlan && matchesRisk;
  });

  // Handle active question filter action
  const filteredQuestions = questions.filter(q => {
    return q.statement.toLowerCase().includes(questionSearch.toLowerCase()) ||
           q.discipline.toLowerCase().includes(questionSearch.toLowerCase()) ||
           q.subtopic.toLowerCase().includes(questionSearch.toLowerCase());
  });

  const handleTabChange = (tab: typeof activeTab) => {
    playClickSound();
    setActiveTab(tab);
  };

  const handleOpenStudentDetail = (student: typeof INITIAL_STUDENTS[0]) => {
    playClickSound();
    setSelectedStudent(student);
  };

  const handleSendNotification = () => {
    if (!notificationMsg.trim() || !selectedStudent) return;
    playSuccessSound();
    alert(`Notificação enviada com sucesso para ${selectedStudent.name}: "${notificationMsg}"`);
    setNotificationMsg('');
    setShowNotificationModal(false);
  };

  const handleAddKnowledgeContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddMaterialModal) return;
    
    playSuccessSound();
    // Simulate updating the specific discipline counter and file size
    setKnowledge(prev => prev.map(item => {
      if (item.id === showAddMaterialModal) {
        const currentCount = item.materials;
        const currentInMB = parseFloat(item.size.replace(' MB', ''));
        const addedMB = materialType === 'upload' ? 4.2 : materialType === 'text' ? 0.3 : 0.1;
        return {
          ...item,
          materials: currentCount + 1,
          size: `${(currentInMB + addedMB).toFixed(1)} MB`,
          lastUpdate: 'Hoje, Just Agora',
          aiStatus: 'Sincronizada'
        };
      }
      return item;
    }));

    // Reset fields
    setManualMaterialText('');
    setManualMaterialTitle('');
    setMaterialLink('');
    setFlashcardFront('');
    setFlashcardBack('');
    setShowAddMaterialModal(null);
  };

  const handleRunEditalAnalysis = (isCustom: boolean) => {
    playClickSound();
    setIsProcessingEdital(true);
    setHasCompletedAnalysis(false);
    setProcessingStatusList([]);
    setSuccessCalibrateBanner(false);

    const statuses = [
      "Lendo edital de referência selecionado e identificando seções do concurso...",
      "Executando parsing textual de cláusulas, requisitos e divisão de blocos...",
      "Identificada com sucesso Banca CEBRASPE (Regime de uma resposta errada anula uma certa)...",
      "Analisando distribuição de questões: Bloco I: 55 itens | Bloco II: 30 itens | Bloco III: 35 itens...",
      "Calculando incidência do conjunto de normas de Código de Trânsito Brasileiro e Resoluções CONTRAN prioritárias...",
      "Cruzando referências teóricas com o edital anterior da PRF (2018 vs 2021)...",
      "Análise completa finalizada! Insights inteligentes estratégicos calculados com sucesso pela Athena AI."
    ];

    statuses.forEach((status, i) => {
      setTimeout(() => {
        setProcessingStatusList(prev => [...prev, status]);
        if (i === statuses.length - 1) {
          setIsProcessingEdital(false);
          setHasCompletedAnalysis(true);
          playSuccessSound();
        }
      }, (i + 1) * 700);
    });
  };

  const handleApplyPrioritization = () => {
    playSuccessSound();
    setSuccessCalibrateBanner(true);
    setKnowledge(prev => prev.map(item => {
      if (item.priority === 'Alta') {
        return {
          ...item,
          lastUpdate: 'Ponderado via Recorrência de Edital',
          aiStatus: 'Sincronizada'
        };
      }
      return item;
    }));
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempTemplateName.trim() || !tempTemplateCycle.trim()) {
      alert('Por favor, preencha o nome do modelo e o ciclo.');
      return;
    }

    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? {
        ...t,
        name: tempTemplateName,
        cycle: tempTemplateCycle,
        duration: tempTemplateDuration || '90 dias',
        focus: tempTemplateFocus || 'Diversas disciplinas'
      } : t));
      setEditingTemplate(null);
    } else {
      const newT = {
        id: `t-${Date.now()}`,
        name: tempTemplateName,
        cycle: tempTemplateCycle,
        duration: tempTemplateDuration || '90 dias',
        focus: tempTemplateFocus || 'Diversas disciplinas',
        studentsCount: 0
      };
      setTemplates(prev => [...prev, newT]);
      setShowCreateTemplateModal(false);
    }
    playSuccessSound();
    setTempTemplateName('');
    setTempTemplateCycle('');
    setTempTemplateDuration('');
    setTempTemplateFocus('');
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Deseja realmente excluir este modelo de planejamento?')) {
      setTemplates(prev => prev.filter(t => t.id !== id));
      playClickSound();
    }
  };

  const handleStartEditTemplate = (t: any) => {
    playClickSound();
    setEditingTemplate(t);
    setTempTemplateName(t.name);
    setTempTemplateCycle(t.cycle);
    setTempTemplateDuration(t.duration);
    setTempTemplateFocus(t.focus);
  };

  const handleStartCreateTemplate = () => {
    playClickSound();
    setEditingTemplate(null);
    setTempTemplateName('');
    setTempTemplateCycle('');
    setTempTemplateDuration('90 dias');
    setTempTemplateFocus('');
    setShowCreateTemplateModal(true);
  };

  const handleCreateQuestionManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionStatement.trim() || !newQuestionSubtopic.trim()) {
      alert('Por favor, preencha o enunciado e o subtema.');
      return;
    }

    // AI Classification logic based on content keywords
    const text = newQuestionStatement.toLowerCase();
    let detectedDiscipline = 'Legislação de Trânsito (CTB)'; // Default fallback
    if (text.includes('física') || text.includes('colisão') || text.includes('energia') || text.includes('impacto') || text.includes('movimento') || text.includes('velocidade') || text.includes('frenagem') || text.includes('dinâmica')) {
      detectedDiscipline = 'Física';
    } else if (text.includes('constitucional') || text.includes('constituição') || text.includes('fundamental') || text.includes('cf/88') || text.includes('art.') || text.includes('supremo') || text.includes('federativa') || text.includes('voto')) {
      detectedDiscipline = 'Direito Constitucional';
    } else if (text.includes('administração') || text.includes('ato administrativo') || text.includes('servidor') || text.includes('público') || text.includes('autoexecutoriedade') || text.includes('discricionário') || text.includes('vinculado') || text.includes('licitação') || text.includes('poder de polícia')) {
      detectedDiscipline = 'Direito Administrativo';
    } else if (text.includes('crase') || text.includes('vírgula') || text.includes('sintaxe') || text.includes('ortografia') || text.includes('oração') || text.includes('texto') || text.includes('conjunção') || text.includes('português') || text.includes('pronome')) {
      detectedDiscipline = 'Língua Portuguesa';
    } else if (text.includes('computador') || text.includes('software') || text.includes('internet') || text.includes('ti ') || text.includes('rede ') || text.includes('dados') || text.includes('backup') || text.includes('sistema operacional') || text.includes('linux') || text.includes('windows')) {
      detectedDiscipline = 'Informática';
    } else if (text.includes('proposição') || text.includes('lógica') || text.includes('equivalência') || text.includes('tabela verdade') || text.includes('negação') || text.includes('silogismo') || text.includes('matemática') || text.includes('probabilidade') || text.includes('frequência') || text.includes('conjuntos') || text.includes('equação')) {
      detectedDiscipline = 'Raciocínio Lógico-Matemático';
    } else if (text.includes('ética') || text.includes('moral') || text.includes('cidadania') || text.includes('valores') || text.includes('virtude') || text.includes('dever do servidor') || text.includes('integridade') || text.includes('conduta')) {
      detectedDiscipline = 'Ética e Cidadania';
    } else if (text.includes('geopolítica') || text.includes('população') || text.includes('recursos naturais') || text.includes('macrodivisão') || text.includes('bioma') || text.includes('fronteira') || text.includes('território') || text.includes('migração') || text.includes('geografia')) {
      detectedDiscipline = 'Geopolítica';
    } else if (text.includes('inglês') || text.includes('espanhol') || text.includes('english') || text.includes('idioma') || text.includes('estrangeira') || text.includes('tradução') || text.includes('espanhola') || text.includes('inglesa')) {
      detectedDiscipline = 'Língua Estrangeira (Inglês ou Espanhol)';
    } else if (text.includes('penal') || text.includes('autoria') || text.includes('crime') || text.includes('dolo') || text.includes('culpa') || text.includes('ilicitude') || text.includes('punibilidade') || text.includes('código penal') || text.includes('coação') || text.includes('extorsão') || text.includes('homicídio')) {
      detectedDiscipline = 'Direito Penal';
    } else if (text.includes('processual penal') || text.includes('inquérito') || text.includes('cpp') || text.includes('prisão em flagrante') || text.includes('ação penal') || text.includes('busca e apreensão') || text.includes('prova')) {
      detectedDiscipline = 'Direito Processual Penal';
    } else if (text.includes('especial') || text.includes('estatuto do desarmamento') || text.includes('lei de drogas') || text.includes('tortura') || text.includes('hediondo') || text.includes('lei de abuso') || text.includes('crime organizado')) {
      detectedDiscipline = 'Legislação Especial';
    } else if (text.includes('direitos humanos') || text.includes('declaração universal') || text.includes('dudh') || text.includes('convenção americana') || text.includes('pacto de san josé') || text.includes('tratado internacional')) {
      detectedDiscipline = 'Direitos Humanos';
    }

    const brandNew = {
      id: `q-${Date.now()}`,
      statement: newQuestionStatement,
      answer: newQuestionAnswer,
      discipline: detectedDiscipline,
      subtopic: newQuestionSubtopic,
      status: 'Ativa'
    };

    setQuestions([brandNew, ...questions]);
    setNewQuestionStatement('');
    setNewQuestionSubtopic('');
    setNewQuestionExplanation('');
    playSuccessSound();
    alert(`A Inteligência Artificial Athena identificou com sucesso que esta questão pertence à disciplina: "${detectedDiscipline}". Registro efetuado com sucesso!`);
  };

  const handleDeleteQuestion = (id: string) => {
    playClickSound();
    if (confirm('Tem certeza que deseja inativar esta questão do banco de dados?')) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  return (
    <div className={`bg-[#090d16] text-slate-100 h-screen overflow-hidden flex flex-col font-sans select-none prf-theme ${theme === 'light' ? 'light-theme' : ''}`} id="admin-workspace-view">
      
      {/* LOCAL SUB HEADER */}
      <div className="bg-[#0b0f19] border-b border-[#182030] py-3 px-6 flex items-center justify-between" id="admin-header-strip">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 px-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-md font-mono text-[10px] font-extrabold uppercase tracking-widest animate-pulse shadow-[0_0_12px_rgba(124,58,237,0.35)]">ADMIN PORTAL</span>
          <h2 className="text-sm font-black text-white uppercase tracking-wider">Painel Administrativo ProvaX AI</h2>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <button 
            onClick={() => { playClickSound(); toggleTheme?.(); }}
            className="p-1.5 px-2.5 bg-[#070a13] border border-[#182030] hover:bg-[#182030] hover:text-white rounded-lg text-slate-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title={theme === 'dark' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
            id="admin-theme-toggle-btn"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>

          <button 
            onClick={() => { playClickSound(); onBack(); }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#070a13] border border-[#182030] rounded-lg hover:border-indigo-500/50 hover:text-white transition-all text-xs font-mono font-bold cursor-pointer"
            id="btn-back-to-student-mode"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
            Alternar p/ Área do Aluno
          </button>
        </div>
      </div>

      <div className="flex-1 flex" id="admin-layout-container">
        
        {/* INNER SLEEK ADMIN NAV BAR (LEFT SIDEBAR) */}
        <nav className="w-64 bg-[#070a13] p-4 border-r border-[#141b2b] flex flex-col justify-between" id="admin-sidebar-nav">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8f9cae]/60 font-bold block pb-3">Menu Principal</span>
              <div className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: <Compass className="w-4 h-4" /> },
                  { id: 'alunos', label: 'Alunos', icon: <Users className="w-4 h-4" /> },
                  { id: 'conhecimento', label: 'Base de Conhecimento', icon: <BookOpen className="w-4 h-4" /> },
                  { id: 'questoes', label: 'Questões', icon: <HelpCircle className="w-4 h-4" /> },
                  { id: 'cronogramas', label: 'Cronogramas', icon: <Calendar className="w-4 h-4" /> },
                  { id: 'planos', label: 'Planos', icon: <CreditCard className="w-4 h-4" /> }
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id as any)}
                      className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600/15 text-white border-l-2 border-indigo-500 font-extrabold shadow-[inset_0_1px_1px_rgba(99,102,241,0.15)] text-indigo-400'
                          : 'text-[#8f9cae] hover:text-white hover:bg-[#0f1524]/60'
                      }`}
                      id={`admin-btn-nav-${item.id}`}
                    >
                      <span className={isActive ? 'text-indigo-400' : 'text-[#8f9cae]'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LOWER FOOTER CONFIG */}
          <div className="pt-4 border-t border-[#141b2b]">
            <button
              onClick={() => handleTabChange('configuracoes')}
              className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all text-left cursor-pointer ${
                activeTab === 'configuracoes'
                  ? 'bg-indigo-600/15 text-white border-l-2 border-indigo-500 font-extrabold shadow-[inset_0_1px_1px_rgba(99,102,241,0.15)]'
                  : 'text-[#8f9cae] hover:text-white hover:bg-[#0f1524]/60'
              }`}
              id="admin-btn-nav-configuracoes"
            >
              <Settings className="w-4 h-4 text-[#8f9cae]" />
              <span>Configurações</span>
            </button>
          </div>
        </nav>

        {/* WORKSPACE DETAILED DESKS */}
        <div className="flex-1 p-6 overflow-y-auto" id="admin-workspace-viewport">
          
          {/* ======================= TAB: ADMIN DASHBOARD ======================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in" id="admin-view-dashboard">
              
              {/* Header metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: 'Receita Mensal Recorrente (MRR)', value: 'R$ 34.200', change: '+14% este mês', icon: <CreditCard className="w-5 h-5 text-indigo-400" /> },
                  { title: 'Alunos Ativos', value: '1.524', change: '+180 novos cadastros', icon: <Users className="w-5 h-5 text-emerald-450" /> },
                  { title: 'Churn Mensal', value: '1.2%', change: 'Dentro da meta de 1.5%', icon: <Percent className="w-5 h-5 text-violet-400" /> },
                  { title: 'Banco de Questões', value: '18.421', change: '84 adicionais esta semana', icon: <HelpCircle className="w-5 h-5 text-blue-400" /> }
                ].map((m, idx) => (
                  <div key={idx} className="bg-[#0f1524] border border-[#182030] rounded-xl p-4 space-y-2 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs font-mono text-[#8f9cae] leading-tight uppercase font-medium">{m.title}</span>
                      {m.icon}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xl sm:text-2xl font-black text-white font-mono">{m.value}</span>
                      <span className="text-[10px] text-emerald-400 font-bold block">{m.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Engagement Chart & Alert row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* SVG MINIMALIST PREMIUM LINE CHART (Linear/Stripe style) */}
                <div className="lg:col-span-8 bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Engajamento de Alunos na Plataforma</h3>
                      <p className="text-[10px] font-mono text-slate-500 uppercase">Horas totais acumuladas no modo foco</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-2.5 h-2.5 rounded bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.5)]" /> Histórico Semanal
                      </span>
                    </div>
                  </div>

                  {/* Clean SVG lines graph */}
                  <div className="h-44 relative flex items-end">
                    <svg className="w-full h-full absolute inset-0 text-slate-800" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="20%" x2="100%" y2="20%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="0" y1="80%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                      
                      {/* Smooth Area gradient */}
                      <path d="M 0 150 Q 80 120 160 140 T 320 60 T 480 30 T 640 50 T 800 20 L 100% 150 L 100% 176 L 0 176 Z" className="fill-indigo-500/10" />
                      
                      {/* Premium Stroke path */}
                      <path d="M 0 150 Q 80 120 160 140 T 320 60 T 480 30 T 640 50 T 800 20" fill="none" stroke="#6366f1" strokeWidth="2.5" className="drop-shadow-[0_2px_4px_rgba(99,102,241,0.3)]" />
                    </svg>

                    {/* Chart columns tags */}
                    <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 pt-2 z-10 px-1">
                      <span>Seg</span>
                      <span>Ter</span>
                      <span>Qua</span>
                      <span>Qui</span>
                      <span>Sex</span>
                      <span>Sáb</span>
                      <span>Dom</span>
                    </div>
                  </div>
                </div>

                {/* CRITICAL ALERTS AND ACTIONS COLS (4 cols) */}
                <div className="lg:col-span-4 bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4 shadow-sm">
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-400">Alertas Críticos da Athena AI</h3>

                  <div className="space-y-3">
                    {[
                      { type: 'warning', text: 'Queda média de 12% no streak de estudos do grupo "Essencial". Recomendado emitir motivacional.', date: 'Ontem' },
                      { type: 'critical', text: 'A Resolução CONTRAN 432 sofreu nova alteração interpretativa pela banca CEBRASPE.', date: 'Hoje, 08:35' },
                      { type: 'info', text: '5 alunos em Gratuito Lite atingiram 90% de aproveitamento operacional. Ótima oportunidade de upsell.', date: 'Hoje, 12:44' }
                    ].map((alert, index) => {
                      const bg = theme === 'light'
                        ? (alert.type === 'critical'
                            ? 'bg-red-50 border-red-200 text-red-900'
                            : alert.type === 'warning'
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-900')
                        : (alert.type === 'critical'
                            ? 'bg-red-950/20 border-red-900/30 text-red-400'
                            : alert.type === 'warning'
                            ? 'bg-indigo-950/25 border-indigo-900/30 text-indigo-300'
                            : 'bg-[#070a13] border-[#182030] text-violet-300');

                      const iconColor = theme === 'light'
                        ? (alert.type === 'critical'
                            ? 'text-red-600'
                            : alert.type === 'warning'
                            ? 'text-amber-600'
                            : 'text-indigo-600')
                        : (alert.type === 'critical'
                            ? 'text-red-400'
                            : alert.type === 'warning'
                            ? 'text-indigo-400'
                            : 'text-violet-400');

                      return (
                        <div key={index} className={`p-3 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${bg}`}>
                          <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 animate-pulse ${iconColor}`} />
                          <div className="space-y-0.5">
                            <p className="font-sans font-semibold">{alert.text}</p>
                            <span className="text-[9px] text-slate-500 font-mono font-bold block">{alert.date}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* RECENT USER ACTIVITY TRACKER */}
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Acompanhamento Diário de Alunos</h3>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Lista resumida com detecção active de risco de cancelamento (Churn)</p>
                  </div>
                  <button 
                    onClick={() => handleTabChange('alunos')}
                    className="text-xs font-mono text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Ver Todos os Alunos <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#182030]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#070a13] text-slate-400 font-mono text-[10px] uppercase">
                      <tr>
                        <th className="p-3.5">Nome</th>
                        <th className="p-3.5">Plano</th>
                        <th className="p-3.5">Aproveitamento</th>
                        <th className="p-3.5">Streak</th>
                        <th className="p-3.5">Último Acesso</th>
                        <th className="p-3.5">Situação</th>
                        <th className="p-3.5 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#141b2b]">
                      {students.slice(0, 4).map((s) => (
                        <tr key={s.id} className="hover:bg-[#070a13]/60 transition-colors">
                          <td className="p-3.5 font-bold text-white font-sans">{s.name}</td>
                          <td className="p-3.5 font-mono text-slate-300">{s.plan}</td>
                          <td className="p-3.5 font-mono font-bold text-white">{s.performance}%</td>
                          <td className="p-3.5 font-mono text-slate-400">{s.streak} dias</td>
                          <td className="p-3.5 font-mono text-slate-400">{s.lastAccess}</td>
                          <td className="p-3.5">
                            {s.situation === 'safe' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">Muito Seguro</span>
                            ) : s.situation === 'warning' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">Progresso Lento</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase bg-red-500/10 text-red-400 border border-red-550/20 px-2 py-0.5 rounded">Risco de Churn</span>
                            )}
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleOpenStudentDetail(s)}
                              className="px-2.5 py-1 bg-[#070a13] hover:bg-[#131a2e] border border-[#182030] rounded text-slate-300 transition-colors cursor-pointer text-[11px]"
                            >
                              Ver Perfil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ======================= TAB: STUDENTS MANAGEMENT ======================= */}
          {activeTab === 'alunos' && (
            <div className="space-y-6 animate-fade-in" id="admin-view-alunos">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-black text-white uppercase tracking-wider">Gestão Dedicada de Alunos</h1>
                  <p className="text-xs text-slate-500">Acompanhamento individual de streaks, aproveitamento, acessos e envio direto de notificações.</p>
                </div>
              </div>

              {/* Filters stripe bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0f1524] border border-[#182030] p-4 rounded-xl shadow-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou e-mail..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-1.5 pl-9 pr-4 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <select
                    value={studentPlanFilter}
                    onChange={(e) => setStudentPlanFilter(e.target.value)}
                    className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-1.5 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Todos">Filtro por Plano (Todos)</option>
                    <option value="Athena Gold">Athena Gold</option>
                    <option value="Essencial">Essencial</option>
                    <option value="Gratuito Lite">Gratuito Lite</option>
                  </select>
                </div>

                <div>
                  <select
                    value={studentRiskFilter}
                    onChange={(e) => setStudentRiskFilter(e.target.value)}
                    className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-1.5 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Todos">Filtro por Indicador de Churn (Todos)</option>
                    <option value="safe">Muito Seguro (Em dia)</option>
                    <option value="warning">Progresso Lento (Atenção)</option>
                    <option value="critical">Alto Risco de Cancelamento</option>
                  </select>
                </div>
              </div>

              {/* Data registry list */}
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 shadow-sm">
                <div className="overflow-x-auto rounded-xl border border-[#182030]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#070a13] text-slate-400 font-mono text-[10px] uppercase">
                      <tr>
                        <th className="p-3.5">Nome Aluno</th>
                        <th className="p-3.5">Contato de E-mail</th>
                        <th className="p-3.5">Plano Ativo</th>
                        <th className="p-3.5">Eficiência</th>
                        <th className="p-3.5">Streak Diário</th>
                        <th className="p-3.5">Última Presença</th>
                        <th className="p-3.5">Risco de Churn</th>
                        <th className="p-3.5 text-center text-nowrap">Opções</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#141b2b]">
                      {filteredStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-[#070a13]/40 transition-colors">
                          <td className="p-3.5 font-bold text-white font-sans">{s.name}</td>
                          <td className="p-3.5 font-mono text-slate-400 leading-none">{s.email}</td>
                          <td className="p-3.5 font-mono text-slate-300">{s.plan}</td>
                          <td className="p-3.5 font-mono font-bold text-slate-100">{s.performance}%</td>
                          <td className="p-3.5 font-mono text-emerald-400 font-bold">{s.streak} dias 🔥</td>
                          <td className="p-3.5 font-mono text-slate-400">{s.lastAccess}</td>
                          <td className="p-3.5">
                            {s.situation === 'safe' ? (
                              <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">Sem Risco</span>
                            ) : s.situation === 'warning' ? (
                              <span className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">Risco Médio</span>
                            ) : (
                              <span className="text-[10px] font-mono font-bold bg-red-400/10 text-red-400 border border-red-500/25 px-2 py-0.5 rounded">Risco Crítico</span>
                            )}
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="inline-flex justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenStudentDetail(s)}
                                className="px-2.5 py-1 bg-[#070a13] hover:bg-[#131a2e] border border-[#182030] rounded font-mono text-[10px] transition-colors cursor-pointer text-slate-300"
                              >
                                Perfil
                              </button>
                              <button
                                onClick={() => { playClickSound(); setSelectedStudent(s); setShowNotificationModal(true); }}
                                className="px-2.5 py-1 bg-indigo-650 hover:bg-indigo-550 text-white font-bold rounded font-mono text-[10px] transition-colors cursor-pointer"
                              >
                                Notificar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-500 font-semibold italic">Nenhum aluno localizado sob estes filtros informados.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB: KNOWLEDGE BASE MODULE (BRAIN OF ATHENA) ======================= */}
          {activeTab === 'conhecimento' && (
            <div className="space-y-6 animate-fade-in" id="admin-view-conhecimento">
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="absolute top-0 right-0 w-84 h-84 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-1.5 relative z-10 max-w-xl text-center md:text-left">
                  <div className="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                    <Sparkles className="w-3 h-3 animate-pulse" /> Core Cognitive Engine
                  </div>
                  <h1 className="text-xl font-black text-white uppercase tracking-wider">
                    Base de Conhecimento IA • Cérebro da Athena
                  </h1>
                  <p className="text-slate-400 text-xs font-sans leading-relaxed">
                    Gerencie o intelecto da sua Inteligência Artificial Mentora. Cada edital analisado e material anexado incrementa o aprendizado preditivo da <b>Athena AI</b> sobre como o CEBRASPE pensa.
                  </p>
                </div>
                <div className="flex flex-col items-center shrink-0 font-mono text-[11px] text-slate-500 border border-slate-800 p-3 rounded-xl bg-slate-950/80">
                  <span className="uppercase tracking-wider font-bold">Index Ativo</span>
                  <span className="text-indigo-400 font-extrabold text-sm">ATHENA-BRAIN v5.0</span>
                  <span className="text-emerald-400 font-bold uppercase mt-1">Status: Intelgência Ativa</span>
                </div>
              </div>

              {/* Subtabs for Knowledge Module */}
              <div className="flex border-b border-slate-805 gap-6">
                <button
                  onClick={() => { playClickSound(); setSubTabKnowledge('disciplinas'); }}
                  className={`pb-3 text-xs font-mono uppercase tracking-wider font-extrabold cursor-pointer border-b-2 transition-all ${
                    subTabKnowledge === 'disciplinas'
                      ? 'border-indigo-500 text-white font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-350'
                  }`}
                  id="tab-sub-knowledge-dir"
                >
                  📚 Matérias Catalisadas ({knowledge.length})
                </button>
                <button
                  onClick={() => { playClickSound(); setSubTabKnowledge('editais'); }}
                  className={`pb-3 text-xs font-mono uppercase tracking-wider font-extrabold cursor-pointer border-b-2 transition-all flex items-center gap-1.5 ${
                    subTabKnowledge === 'editais'
                      ? 'border-indigo-500 text-indigo-455 text-indigo-400'
                      : 'border-transparent text-slate-500 hover:text-slate-350'
                  }`}
                  id="tab-sub-knowledge-editor"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Analisador de Editais Athena AI
                </button>
              </div>

              {/* VIEW 1: DIRECTORY OF SUBJECTS */}
              {subTabKnowledge === 'disciplinas' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="grid-knowledge-disciplines">
                  {knowledge.map((item: any) => (
                    <div key={item.id} className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[9px] font-mono uppercase bg-[#070a13] border border-[#182030] px-2 py-0.5 rounded text-slate-400">{item.size}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-mono border px-1.5 py-0.5 rounded font-black uppercase ${
                              item.priority === 'Alta' 
                                ? 'bg-red-500/10 border-red-500/25 text-red-500' 
                                : 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400'
                            }`}>
                              Prioridade: {item.priority}
                            </span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                              item.aiStatus === 'Sincronizada' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse'
                            }`}>{item.aiStatus}</span>
                          </div>
                        </div>

                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-black text-slate-100 font-sans tracking-wide leading-tight">{item.discipline}</h3>
                          {item.isContranResolutions && (
                            <a
                              href={item.contranLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] font-mono font-black text-amber-500 border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-amber-500/20 hover:text-amber-400 transition-all cursor-pointer shrink-0 uppercase tracking-widest animate-pulse"
                              title="Acessar Portal Oficial Senatran"
                            >
                              DENATRAN <ArrowUpRight className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        
                        <div className="space-y-2 pt-1 font-mono text-[10px] text-slate-500 border-t border-[#141b2b]">
                          <div className="flex justify-between">
                            <span>Estimativa de Relevância:</span>
                            <span className="text-white font-bold">{item.weight || '5.0%'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Recorrência CEBRASPE:</span>
                            <span className="text-indigo-400 font-bold">{item.recurrence || 'Média'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tendência da Banca:</span>
                            <span className={item.trend === 'Crescente' ? 'text-emerald-400 font-bold' : item.trend === 'Em Queda' ? 'text-red-400 font-bold' : 'text-slate-300 font-bold'}>
                              {item.trend === 'Crescente' ? '📈 Crescente' : item.trend === 'Em Queda' ? '📉 Em Queda' : '➡️ Estável'}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar of Coverage */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-[9px] font-mono text-slate-500">
                            <span>Cobertura Teórica Simulada:</span>
                            <span className="text-white font-bold">{item.coverage}%</span>
                          </div>
                          <div className="w-full bg-[#070a13] h-1 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)]" style={{ width: `${item.coverage}%` }} />
                          </div>
                        </div>

                        <div className="text-[10px] font-mono text-slate-500 flex justify-between pt-1">
                          <span>Materiais Indexados:</span>
                          <span className="text-slate-300 font-bold">{item.materials} arquivos</span>
                        </div>
                        <p className="text-[9px] font-mono text-slate-500 italic">Atualizado: {item.lastUpdate}</p>
                      </div>

                      <div className="flex pt-2 border-t border-[#141b2b]">
                        <button
                          onClick={() => { playClickSound(); setShowAddMaterialModal(item.id); }}
                          className="w-full py-2 bg-[#070a13] hover:bg-[#131a2e] border border-[#182030] rounded-xl text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar Referência
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* VIEW 2: ATHENA AUTOMATIC EDITAL PROCESSOR */}
              {subTabKnowledge === 'editais' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="athena-edital-analysis-dashboard">
                  
                  {/* Left panel - input */}
                  <div className="lg:col-span-5 bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="pb-2 border-b border-sidebar border-[#182030]">
                      <h3 className="text-xs font-mono font-extrabold uppercase text-slate-400 tracking-wider">Painel de Ingestão de Editais</h3>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-500 uppercase font-black">Modelo de Referência Base</label>
                      <select
                        value={selectedHistoricalEdital}
                        onChange={(e) => { playClickSound(); setSelectedHistoricalEdital(e.target.value); }}
                        className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-1.5 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                      >
                        <option value="prf_2021">Edital Oficial PRF 2021 (CEBRASPE) • Carregado</option>
                        <option value="prf_2026_predic">Athena Predictive PRF 2026 (Projeção Histórica)</option>
                        <option value="pf_2021">Edital Oficial PF 2021 (Agente e Escrivão)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center bg-[#070a13] border border-[#182030] p-2.5 rounded-lg text-[11px] text-[#8f9cae] font-mono">
                        <span>Edital em PDF nos Anexos</span>
                        <span className="text-emerald-400 font-bold">Presente (77 Págs)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black">Texto Bruto / Recortes de Novo Edital</label>
                        <button 
                          type="button" 
                          onClick={() => { playClickSound(); setCustomEditalText("1 DAS DISPOSIÇÕES PRELIMINARES...\na) prova objetiva e prova discursiva, de caráter eliminatório e classificatório, de responsabilidade do Cebraspe...\nLÍNGUA PORTUGUESA: 1 Compreensão e interpretação de textos de gêneros variados. 2 Reconhecimento... RACIOCÍNIO LÓGICO-MATEMÁTICO... INFORMÁTICA... FÍSICA: 1 Cinemática escolar, cinemática vetorial. 2 Movimento circular. 3 Leis de Newton...\nLEGISLAÇÃO DE TRÂNSITO: 1 Lei nº 9.503/1997 (Código de Trânsito Brasileiro) e suas alterações..."); }}
                          className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                        >
                          Carregar Exemplo
                        </button>
                      </div>
                      <textarea
                        rows={5}
                        placeholder="Cole aqui recortes de texto do diário oficial ou trecho do novo edital complementar para cruzamento e predição..."
                        value={customEditalText}
                        onChange={(e) => setCustomEditalText(e.target.value)}
                        className="w-full bg-[#070a13] border border-[#182030] rounded-lg p-3 text-xs text-slate-300 placeholder-slate-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      onClick={() => handleRunEditalAnalysis(!!customEditalText)}
                      disabled={isProcessingEdital}
                      className={`w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                        isProcessingEdital ? 'opacity-50 cursor-not-allowed' : 'hover:from-violet-500 hover:to-indigo-500 hover:shadow-[0_0_15px_rgba(124,58,237,0.35)]'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 animate-pulse text-white" />
                      <span>{isProcessingEdital ? 'Athena analisando edital...' : 'Analisar Edital Automaticamente'}</span>
                    </button>

                    {/* Terminal parsing logs simulation */}
                    {(isProcessingEdital || processingStatusList.length > 0) && (
                      <div className="bg-[#070a13] border border-[#182030] p-4 rounded-xl space-y-2">
                        <span className="text-[9px] font-mono text-slate-600 block uppercase font-black">Athena OCR Processor Logs</span>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[10px] leading-relaxed text-slate-400">
                          {processingStatusList.map((log, lIdx) => (
                            <div key={lIdx} className="flex gap-1.5 items-start">
                              <span className="text-emerald-500 font-bold font-mono">❯</span>
                              <span>{log}</span>
                            </div>
                          ))}
                          {isProcessingEdital && (
                            <div className="text-indigo-400 animate-pulse font-bold text-[9px] font-mono">
                              ⏳ Carregando módulos heurísticos no cérebro da Athena...
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right panel - results & insights dashboards */}
                  <div className="lg:col-span-7 bg-[#0f1524] border border-[#182030] rounded-2xl p-5 flex flex-col justify-between min-h-[480px] shadow-sm">
                    
                    {!hasCompletedAnalysis && !isProcessingEdital ? (
                      <div className="m-auto text-center p-8 max-w-sm space-y-4">
                        <div className="w-14 h-14 rounded-full bg-[#070a13] border border-[#182030] flex items-center justify-center mx-auto text-slate-500">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-mono font-bold uppercase text-slate-300">Aguardando Análise</h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-sans">
                            Simule ou degenere o edital no painel ao lado e a Athena cruzará de forma preditiva os dados com os exames CEBRASPE policiais históricos automaticamente.
                          </p>
                        </div>
                      </div>
                    ) : isProcessingEdital ? (
                      <div className="m-auto text-center p-8 max-w-sm space-y-4">
                        <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400 animate-spin">
                          <Compass className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-mono font-bold uppercase text-indigo-400">Athena Heuristics Active</h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-sans animate-pulse">
                            Extraindo peso das disciplinas e calculando recorrências preditivas para o banco de dados...
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Renders complete stunning analytics and insights!
                      <div className="space-y-5 text-left animate-fade-in">
                        
                        {/* Header metadata */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#182030] pb-4">
                          <div className="space-y-1 text-left">
                            <span className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Processado por Athena AI</span>
                            <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">
                              Análise Concluída: {selectedHistoricalEdital === 'prf_2021' ? 'CEBRASPE PRF Polícia Rodoviária' : selectedHistoricalEdital === 'pf_2021' ? 'CEBRASPE Polícia Federal' : 'Athena Preditivo PRF 2026'}
                            </h3>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-mono text-slate-500 block">Confiança Operacional</span>
                            <span className="text-xs font-mono font-bold text-white uppercase bg-[#070a13] px-2 py-1 border border-[#182030] rounded">99.4% Estável</span>
                          </div>
                        </div>

                        {/* Extracted Stats grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="bg-[#070a13] border border-[#182030] p-2.5 rounded-xl text-left font-mono">
                            <span className="text-[9px] text-slate-500 uppercase block">Atribuição</span>
                            <span className="text-xs text-white font-bold block mt-0.5">Policial</span>
                          </div>
                          <div className="bg-[#070a13] border border-[#182030] p-2.5 rounded-xl text-left font-mono">
                            <span className="text-[9px] text-slate-500 uppercase block">Subsídio Oficial</span>
                            <span className="text-xs text-indigo-400 font-extrabold block mt-0.5">R$ 9.899,88</span>
                          </div>
                          <div className="bg-[#070a13] border border-[#182030] p-2.5 rounded-xl text-left font-mono">
                            <span className="text-[9px] text-slate-500 uppercase block">Regime Provas</span>
                            <span className="text-xs text-emerald-400 font-bold block mt-0.5">Certo / Errado</span>
                          </div>
                          <div className="bg-[#070a13] border border-[#182030] p-2.5 rounded-xl text-left font-mono">
                            <span className="text-[9px] text-slate-500 uppercase block font-mono">Taxa de Erro</span>
                            <span className="text-xs text-red-400 font-bold block mt-0.5">-1.00 Ponto</span>
                          </div>
                        </div>

                        {/* Block weightings calculated automatically */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono uppercase text-slate-500 font-black block">Distribuição e Peso dos Blocos do Edital</span>
                          <div className="space-y-1.5">
                            {[
                              { label: 'Bloco I (Matérias Básicas - ex. Física, Português, RLM)', count: 55, pct: '45.8%', color: 'from-violet-600 to-indigo-600' },
                              { label: 'Bloco II (Legislação de Trânsito - CTB e Resoluções)', count: 30, pct: '25.0%', color: 'from-indigo-500 to-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.3)]' },
                              { label: 'Bloco III (Ciências Jurídicas - Administrativo, Constitucional, Direitos)', count: 35, pct: '29.2%', color: 'from-emerald-500 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]' }
                            ].map((blk, bIdx) => (
                              <div key={bIdx} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-mono text-slate-300">
                                  <span>{blk.label}</span>
                                  <span className="text-white font-extrabold">{blk.count} Itens • {blk.pct}</span>
                                </div>
                                <div className="w-full bg-[#070a13] h-2 rounded-full overflow-hidden">
                                  <div className={`bg-gradient-to-r ${blk.color} h-full rounded-full`} style={{ width: blk.pct }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Critical recurrence mapped by Athena */}
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-mono uppercase text-[#7f8e9c] font-black block">Análise de Tendência e Priorização Heurística (Athena AI)</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="dash-athena-edital-recurr">
                            <div className="bg-[#070a13]/85 border border-[#182030] p-3 rounded-xl space-y-1.5 shadow-sm">
                              <div className="flex items-center gap-1.5 text-red-400 font-bold">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span className="text-[10px] font-mono uppercase font-black">Física: Dinâmica e Colisões</span>
                              </div>
                              <p className="text-[10.5px] text-slate-400 leading-normal">
                                O edital cita Cinemática e Leis de Newton. A IA cruzou e identificou tendência de <b>Alta Recorrência</b> em colisões de trânsito (conservação de momento e energia cinética). <b>Alta Prioridade de estudo</b>.
                              </p>
                            </div>
                            <div className="bg-[#070a13]/85 border border-[#182030] p-3 rounded-xl space-y-1.5 shadow-sm">
                              <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                                <Sparkles className="w-4 h-4 shrink-0 font-bold animate-pulse text-indigo-400" />
                                <span className="text-[10px] font-mono uppercase font-black">Trânsito: Resoluções Licença</span>
                              </div>
                              <p className="text-[10.5px] text-slate-400 leading-normal">
                                Dominância em resoluções específicas CONTRAN regulamentando o CTB (Resoluções 432 Lei Seca, 789 LADV, 960 películas). <b>Tendência Crescente de cobrança de 25% de peso no bloco geral</b>.
                              </p>
                            </div>
                            <div className="bg-[#070a13]/85 border border-[#182030] p-3 rounded-xl space-y-1.5 shadow-sm">
                              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span className="text-[10px] font-mono uppercase font-black">Constitucional: Artigos 5º e 144</span>
                              </div>
                              <p className="text-[10.5px] text-slate-400 leading-normal">
                                Matéria em 100% de estabilidade nos últimos 5 concursos. O artigo 144 descreve diretamente as funções e papéis constitucionais atribuídos à Polícia Rodoviária Federal.
                              </p>
                            </div>
                            <div className="bg-slate-950/80 border border-slate-850 p-3 rounded-xl space-y-1.5">
                              <div className="flex items-center gap-1.5 text-red-500 font-bold">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span className="text-[10px] font-mono uppercase font-black">Direitos Humanos em Queda</span>
                              </div>
                              <p className="text-[10.5px] text-slate-400 leading-normal">
                                De acordo com os últimos cruzamentos da banca, o peso atribuído a Direitos Humanos reduziu em 33% comparado com editais mais antigos. <b>Baixa Prioridade recomendada pela IA</b>.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive recalibrate study schedules */}
                        <div className="pt-3 border-t border-[#182030] space-y-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-xl">
                            <div className="space-y-0.5 text-left">
                              <span className="text-xs font-sans font-extrabold text-slate-100 block">Sincronização Preditiva de Estudos</span>
                              <span className="text-[10.5px] text-slate-400 block leading-relaxed">
                                Calibre de forma imediata o diretório de tópicos e prioridade dos cronogramas dos alunos ativos de acordo com os pesos extraídos.
                              </span>
                            </div>
                            <button
                              onClick={handleApplyPrioritization}
                              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black rounded-lg text-[11px] font-mono uppercase tracking-wider cursor-pointer shadow-md shrink-0 self-center"
                            >
                              Calibrar Sistema de Estudos Mode
                            </button>
                          </div>

                          {successCalibrateBanner && (
                            <div className="bg-emerald-950/40 border border-emerald-900 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in font-mono">
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>SUCESSO: A Athena AI calibrou os pesos curriculares de Legislação de Trânsito (Bloco II) e Física (Colisões) para todos os alunos cadastrados!</span>
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ======================= TAB: QUESTIONS BANK ======================= */}
          {activeTab === 'questoes' && (
            <div className="space-y-6 animate-fade-in" id="admin-view-questoes">
              
              {/* Top PDF proof importer */}
              <div className="bg-[#0f1524] border border-dashed border-indigo-500/30 rounded-2xl p-6 text-center space-y-3 relative overflow-hidden shadow-sm" id="pdf-uploader-strip-zone">
                <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 font-bold">
                  <Upload className="w-6 h-6 animate-bounce text-indigo-400" style={{ animationDuration: '3s' }} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Importação Automatizada de Provas Estilo PDF</h3>
                  <p className="text-xs text-slate-400 max-w-xl mx-auto">
                    Arraste o arquivo original .PDF do concurso (CEBRASPE) ou clique para preencher a carga. A Athena AI fará o parsing, dividirá as assertivas de C/E e criará as chaves de correção automaticamente.
                  </p>
                </div>
                <div className="flex justify-center pt-2">
                  <button onClick={() => { playClickSound(); alert('Operação simulada: PDF processado com zero erros! Foram catalogadas 5 novas questões.'); }} className="px-5 py-2.5 bg-[#070a13] border border-[#182030] hover:border-slate-750 text-xs font-mono font-bold text-white uppercase rounded-xl cursor-pointer">
                    Selecionar Arquivo de Prova Oficial
                  </button>
                </div>
              </div>

              {/* Two columns layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="questions-grid-sublayout">
                
                {/* Left Column manual creator form */}
                <form onSubmit={handleCreateQuestionManual} className="lg:col-span-5 bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4 shadow-sm" id="form-add-question">
                  <div className="pb-2 border-b border-[#182030]">
                    <h3 className="text-xs font-mono font-extrabold uppercase text-slate-400 tracking-wider">Formulário de Cadastro Manual</h3>
                  </div>

                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-violet-400 shrink-0 shadow-sm" />
                      <span className="text-[10px] font-mono font-extrabold uppercase text-violet-400 tracking-wider">Identificação por IA Ativa</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                      Você não precisa definir a disciplina manualmente. O cérebro da <b>Athena AI</b> analisará o enunciado em tempo real e catalogará a disciplina correspondente (CTB, PDF, Física, Direito Admin, Português, etc.) no ato do cadastro.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Subtema Específico</label>
                    <input
                      type="text"
                      placeholder="Ex: Resolução 432 CONTRAN (Art. 306)"
                      value={newQuestionSubtopic}
                      onChange={(e) => setNewQuestionSubtopic(e.target.value)}
                      className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-1.5 px-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Enunciado da Questão (Assertiva CEBRASPE)</label>
                    <textarea
                      rows={3}
                      placeholder="Anexe o texto afirmativo exato exigido na prova..."
                      value={newQuestionStatement}
                      onChange={(e) => setNewQuestionStatement(e.target.value)}
                      className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-2 px-3 text-xs text-slate-300 placeholder-slate-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-sans leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Gabarito Verdadeiro</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => { playClickSound(); setNewQuestionAnswer('C'); }}
                        className={`py-2 text-xs font-mono font-bold rounded-lg border cursor-pointer ${
                          newQuestionAnswer === 'C'
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 font-bold'
                            : 'bg-[#070a13] border-[#182030] text-slate-500 hover:border-slate-800'
                        }`}
                      >
                        Certo (Correto)
                      </button>
                      <button
                        type="button"
                        onClick={() => { playClickSound(); setNewQuestionAnswer('E'); }}
                        className={`py-2 text-xs font-mono font-bold rounded-lg border cursor-pointer ${
                          newQuestionAnswer === 'E'
                            ? 'bg-red-950/40 border-red-500 text-red-400 font-bold'
                            : 'bg-[#070a13] border-[#182030] text-slate-500 hover:border-slate-800'
                        }`}
                      >
                        Errado (Incorreto)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Justificativa da Athena (Gabarito Comentado)</label>
                    <textarea
                      rows={2}
                      placeholder="Explique os erros ou fundamentação doutrinária..."
                      value={newQuestionExplanation}
                      onChange={(e) => setNewQuestionExplanation(e.target.value)}
                      className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-2 px-3 text-xs text-slate-300 placeholder-[#475569] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Cadastrar Questão no Registro
                  </button>
                </form>

                {/* Right Column Question Table database list (7 cols) */}
                <div className="lg:col-span-7 bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4 shadow-sm" id="questions-registry-table">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h3 className="text-xs font-mono font-extrabold uppercase text-slate-400 tracking-wider">Questoes Registradas</h3>
                    <div className="relative max-w-xs w-full">
                      <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-505 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Pesquisar enunciados..."
                        value={questionSearch}
                        onChange={(e) => setQuestionSearch(e.target.value)}
                        className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-1 pl-8 pr-3 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
                    {filteredQuestions.map((q) => (
                      <div key={q.id} className="bg-[#070a13] border border-[#182030] hover:border-slate-800 rounded-xl p-3.5 space-y-2 relative overflow-hidden">
                        <div className="flex items-center justify-between text-[9px] font-mono border-b border-slate-900 pb-1.5">
                          <span className="text-indigo-400 font-extrabold">{q.discipline} • {q.subtopic}</span>
                          <span className="bg-[#0f1524] px-1.5 py-0.5 rounded text-slate-500 font-bold">GABARITO: {q.answer}</span>
                        </div>
                        <p className="text-xs font-sans text-slate-300 leading-normal line-clamp-2 select-text">{q.statement}</p>
                        
                        <div className="flex justify-between items-center pt-1 text-[9px] font-mono">
                          <span className="text-emerald-400 font-semibold">{q.status}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="text-red-400 hover:text-red-300 font-bold cursor-pointer transition-colors"
                          >
                            Excluir Registro
                          </button>
                        </div>
                      </div>
                    ))}

                    {filteredQuestions.length === 0 && (
                      <p className="p-8 text-center text-slate-600 italic text-xs">Nenhuma questão catalogada correspondente encontrada.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ======================= TAB: STUDY TEMPLATES ======================= */}
          {activeTab === 'cronogramas' && (
            <div className="space-y-6 animate-fade-in" id="admin-view-cronogramas">
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-black text-white uppercase tracking-wider">Modelos de Planejamento Inteligente</h1>
                    <p className="text-xs text-slate-400">Distribuição automática de cargas teóricas e práticas pré-definidas para os alunos.</p>
                  </div>
                  <button
                    onClick={handleStartCreateTemplate}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono font-bold text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md self-start sm:self-center shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Criar Novo Modelo
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2" id="cronogramas-grid">
                  {templates.map((t) => (
                    <div key={t.id} className="bg-[#070a13] border border-[#182030] hover:border-indigo-500/30 rounded-2xl p-5 flex flex-col justify-between gap-4 relative transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.08)]">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-mono font-bold uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">{t.duration}</span>
                          <div className="flex items-center gap-1.5 font-mono text-[9px]">
                            <button
                              onClick={() => handleStartEditTemplate(t)}
                              className="text-slate-400 hover:text-white font-bold uppercase cursor-pointer"
                            >
                              Editar
                            </button>
                            <span className="text-slate-850">|</span>
                            <button
                              onClick={() => handleDeleteTemplate(t.id)}
                              className="text-red-400 hover:text-red-300 font-bold uppercase cursor-pointer"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                        <h3 className="text-sm font-black text-slate-100 pt-1 leading-snug">{t.name}</h3>
                        <p className="text-[11px] font-mono text-slate-400">{t.cycle}</p>
                        <dt className="text-[10px] font-mono text-slate-500 pt-2 block">Carga Principal: <b className="text-slate-300">{t.focus}</b></dt>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#182030] text-[10px] font-mono text-slate-500">
                        <span>{t.studentsCount} Alunos seguindo</span>
                        <button onClick={() => { playClickSound(); alert(`Modelo "${t.name}" atribuído com sucesso.`); }} className="text-indigo-400 font-extrabold hover:text-indigo-300 cursor-pointer">
                          Delegar Ciclo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CREATE/EDIT TEMPLATE MODAL */}
              {(showCreateTemplateModal || editingTemplate) && (
                <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
                  <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-6 w-full max-w-md space-y-4 relative shadow-xl">
                    <button
                      onClick={() => { playClickSound(); setShowCreateTemplateModal(false); setEditingTemplate(null); }}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="space-y-1">
                      <h3 className="text-base font-black text-white uppercase tracking-wider">
                        {editingTemplate ? '🛠️ Editar Modelo de Cronograma' : '✨ Novo Modelo de Planejamento'}
                      </h3>
                      <p className="text-xs text-slate-400 leading-normal">
                        Configure as informações básicas. Como não-pedagogo, você não precisa se estressar: as cargas e revisões de estudos são recalibradas heuristicamente por IA.
                      </p>
                    </div>

                    <form onSubmit={handleSaveTemplate} className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Nome Amigável do Modelo</label>
                        <input
                          type="text"
                          required
                          value={tempTemplateName}
                          onChange={(e) => setTempTemplateName(e.target.value)}
                          placeholder="Ex: Operação Reta Final PRF 2026"
                          className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Periocidade / Ciclo de Estudos</label>
                        <input
                          type="text"
                          required
                          value={tempTemplateCycle}
                          onChange={(e) => setTempTemplateCycle(e.target.value)}
                          placeholder="Ex: Ciclo Semanal Avançado"
                          className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Duração Estimada</label>
                          <select
                            value={tempTemplateDuration}
                            onChange={(e) => setTempTemplateDuration(e.target.value)}
                            className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                          >
                            <option value="45 dias">45 dias</option>
                            <option value="90 dias">90 dias</option>
                            <option value="120 dias">120 dias</option>
                            <option value="180 dias">180 dias</option>
                            <option value="360 dias">360 dias</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Pilar de Origem</label>
                          <span className="text-[9.5px] font-mono text-emerald-400 block pt-1 bg-[#070a13] px-2 py-1 rounded border border-[#182030]">
                            Padrão Didático Policial
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Foco e Matérias Principais</label>
                        <input
                          type="text"
                          required
                          value={tempTemplateFocus}
                          onChange={(e) => setTempTemplateFocus(e.target.value)}
                          placeholder="Ex: Legislação de Trânsito, Língua Portuguesa e D. Penal"
                          className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="bg-[#070a13] border border-[#182030] p-2.5 rounded-lg text-[10px] text-slate-400 leading-normal font-mono">
                        💡 <b>Diretriz de Trabalho Inteligente:</b> Deixe que a <b>Athena AI</b> decida as horas precisas. Você cria o roteiro estrutural e o algoritmo de aprovação faz o resto de forma automatizada.
                      </div>

                      <div className="flex gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => { playClickSound(); setShowCreateTemplateModal(false); setEditingTemplate(null); }}
                          className="w-1/2 py-2 border border-[#182030] hover:bg-[#182030] text-slate-300 font-mono font-bold rounded-lg text-[11px] uppercase cursor-pointer transition-all"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="w-1/2 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono font-bold rounded-lg text-[11px] uppercase cursor-pointer shadow-md transition-all text-center"
                        >
                          Salvar Modelo
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* automatic cycle simulator */}
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-mono font-extrabold uppercase text-slate-400 tracking-wider">Configuração Prática de Ciclos Recalibráveis</h3>
                <p className="text-xs text-slate-300 font-sans">Assegura que quando um aluno atrasa um conteúdo, as metas restantes se reorganizam por IA conservando a probabilidade de aprovação.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-[#070a13] border border-[#182030] rounded-xl space-y-2 shadow-sm">
                    <span className="text-[10px] font-mono text-[#7f8e9c] font-bold uppercase">Cálculo de Reestabelecimento</span>
                    <p className="text-xs text-slate-300 font-sans">A Athena AI tentará manter o planejado distribuindo no máximo 45 minutos adicionais por dia para não gerar estresse cognitivo.</p>
                  </div>
                  <div className="p-4 bg-[#070a13] border border-[#182030] rounded-xl space-y-2 shadow-sm">
                    <span className="text-[10px] font-mono text-[#7f8e9c] font-bold uppercase">Meta de Horas Ativa</span>
                    <p className="text-xs text-slate-300 font-sans">O sistema limita jornadas diárias totais de estudo a 8 horas máximas para preservar saúde mental e memória de longo prazo.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'planos' && (
            <div className="space-y-6 animate-fade-in" id="admin-view-planos">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="planos-admin-layout">
                
                <div className="bg-[#0f1524] border border-[#182030] p-5 rounded-2xl space-y-4 shadow-sm">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Planos & Assinaturas Ativas</h3>
                  <p className="text-xs text-slate-400">Visão comercial e distribuição de alunos nas categorias Pro/Premium.</p>
                  
                  <div className="space-y-3">
                    {[
                      { level: 'Athena Gold Premium', price: 'R$ 69,90/mês', count: 412, revenue: 'R$ 28.798' },
                      { level: 'Essencial Pro', price: 'R$ 29,90/mês', count: 181, revenue: 'R$ 5.411' },
                      { level: 'Gratuito Lite', price: 'R$ 0,00', count: 931, revenue: 'R$ 0' }
                    ].map((p, idx) => (
                      <div key={idx} className="p-3 bg-[#070a13] border border-[#182030] rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-200">{p.level}</span>
                          <span className="font-mono text-slate-400 font-bold">{p.price}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span>{p.count} Alunos ativos</span>
                          <span className="text-emerald-400 font-bold">{p.revenue}/mês</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-[#0f1524] border border-[#182030] p-5 rounded-2xl space-y-4 shadow-sm">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Simulador Comercial para Founder Solo</h3>
                  <p className="text-xs text-slate-400">Projete novas receitas convertendo alunos de plano básico para planos premium usando inteligência operacional.</p>
                  
                  <div className="grid grid-cols-2 gap-4 bg-[#070a13] border border-[#182030] p-4 rounded-xl shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Meta de Conversão</span>
                      <p className="text-xl font-bold text-white font-mono">15%</p>
                      <span className="text-[9px] text-slate-500 block">Das contas gratuitas existentes</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Faturamento Adicional</span>
                      <p className="text-xl font-bold text-emerald-400 font-mono">+ R$ 9.786 /mês</p>
                      <span className="text-[9px] text-emerald-400 block">+140 novos assinantes Gold</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Ações Disponíveis da Athena:</span>
                    <ul className="space-y-2 pl-1 text-xs">
                      <li className="flex items-center gap-2 text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Notificar automaticamente alunos gratuitos que estão há 5 dias consecutivos batendo alta pontuação.</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Oferecer degustação de 3 dias no simulador de redação operado pela Inteligência Artificial.</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ======================= TAB: CORE CONFIGURATIONS ======================= */}
          {activeTab === 'configuracoes' && (
            <div className="space-y-6 animate-fade-in" id="admin-view-configuracoes">
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4 shadow-sm">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Configurações Gerais e Credenciais API</h3>
                  <p className="text-xs text-slate-400">Controles de chaves, acesso aos webhooks, segurança operacional e banco de dados local.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 pt-2" id="config-subgrid">
                  <div className="bg-[#070a13] border border-[#182030] p-4 rounded-xl space-y-3">
                    <span className="text-xs font-mono text-indigo-400 font-extrabold block uppercase tracking-wider">Webhooks de Integração Externa</span>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value="https://api.provax.ai/v1/webhooks/status"
                        disabled
                        className="flex-1 bg-[#0f1524] border border-[#182030] rounded px-3 py-2 text-xs text-slate-450 font-mono"
                      />
                      <button onClick={() => { playClickSound(); alert('Link Webhook copiado com sucesso.'); }} className="px-4 py-2 bg-[#0f1524] border border-[#182030] hover:border-indigo-500 hover:text-white rounded-lg text-xs cursor-pointer font-bold transition-all shrink-0">
                        Copiar Link
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500">Notificações automáticas de faturamento e upgrades de planos sincronizados com seu provedor de pagamentos.</p>
                  </div>

                  {/* Dynamic Theme Selection Module */}
                  <div className="bg-[#070a13] border border-[#182030] p-4 rounded-xl space-y-3 col-span-1 md:col-span-2">
                    <span className="text-xs font-mono text-indigo-400 font-extrabold block">Aparência Visual e Temas de Acesso</span>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between bg-[#0f1524] p-3.5 rounded-xl border border-[#182030]">
                      <div className="space-y-1">
                        <span className="text-xs font-black text-white block uppercase tracking-wider">Esquema de Cores do Painel</span>
                        <span className="text-[10px] text-slate-500 block leading-normal">Selecione o esquema de cores predileto para o ambiente administrativo e área do aluno.</span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => { playClickSound(); if (theme === 'light') toggleTheme?.(); }}
                          className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold font-mono rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            theme === 'dark'
                              ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm'
                              : 'bg-transparent border-[#182030] text-slate-400 hover:text-white hover:bg-[#182030]/40'
                          }`}
                        >
                          <Moon className="w-3.5 h-3.5 text-indigo-400" /> Modo Escuro
                        </button>
                        <button
                          type="button"
                          onClick={() => { playClickSound(); if (theme === 'dark') toggleTheme?.(); }}
                          className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold font-mono rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            theme === 'light'
                              ? 'bg-[#1e3a8a]/10 border-indigo-500 text-slate-900 shadow-sm font-bold'
                              : 'bg-transparent border-[#182030] text-slate-400 hover:text-white hover:bg-[#182030]/40'
                          }`}
                        >
                          <Sun className="w-3.5 h-3.5 text-amber-500" /> Modo Claro
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* AI Athena Behavior & Voice Config Card */}
                  <div className="bg-[#070a13] border border-[#182030] p-5 rounded-xl space-y-4 col-span-1 md:col-span-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 py-1 px-3 bg-indigo-600/10 border-l border-b border-[#182030] rounded-bl-xl text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider animate-pulse">
                      Módulo Cognitivo Ativo
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-xs font-mono text-indigo-400 font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-amber-500" /> Configuração da Inteligência Artificial (Athena)
                      </span>
                      <p className="text-xs text-slate-400">
                        Ajuste as diretrizes cognitivas, tom de voz, regras de simulação e como o cérebro da Athena AI deve interagir com os candidatos do ProvaX.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-[#7f8e9c] font-black uppercase">Nome Policial do Bot</label>
                        <input
                          type="text"
                          value={aiName}
                          onChange={(e) => setAiName(e.target.value)}
                          className="w-full bg-[#0f1524] border border-[#182030] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="Ex: Athena AI"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-[#7f8e9c] font-black uppercase">Tom de Voz e Relacionamento</label>
                        <select
                          value={aiTone}
                          onChange={(e) => { playClickSound(); setAiTone(e.target.value); }}
                          className="w-full bg-[#0f1524] border border-[#182030] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="elite">Elite Policial (Exigente, Rigorosa e Tática)</option>
                          <option value="motivator">Motivacional (Empática, Acolhedora e Inspiradora)</option>
                          <option value="academic">Acadêmica & Jurídica (Doutrinária, Formal e Analítica)</option>
                          <option value="direct">Direta (Informativa, Rápido Feedback, Sem Rodeios)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-[#7f8e9c] font-black uppercase">Rigor de Cobrança CEBRASPE</label>
                        <select
                          value={aiStrictness}
                          onChange={(e) => { playClickSound(); setAiStrictness(e.target.value); }}
                          className="w-full bg-[#0f1524] border border-[#182030] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="high">Máximo (Regra pura de cancelamento por erro: 1x1)</option>
                          <option value="balance">Equilibrado (Penaliza erros persistentes no mesmo tópico)</option>
                          <option value="soft">Suave (Foco em incentivo sem deduções punitivas secas)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono text-[#7f8e9c] font-black uppercase">Instruções de Prompt de Sistema (Custom System guidelines)</label>
                        <span className="text-[9px] font-mono text-slate-500">Versão: {aiPromptVersion}</span>
                      </div>
                      <textarea
                        value={aiCustomInstruction}
                        onChange={(e) => setAiCustomInstruction(e.target.value)}
                        rows={3}
                        className="w-full bg-[#0f1524] border border-[#182030] rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-sans leading-relaxed"
                        placeholder="Insira as regras comportamentais específicas adicionais..."
                      />
                    </div>

                    {/* Dynamic Provider Multi-Engine Settings Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#182030]/40 pt-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-[#7f8e9c] font-black uppercase">Engine / Provedor de IA Principal</label>
                        <select
                          value={aiProvider}
                          onChange={(e) => { playClickSound(); setAiProvider(e.target.value); }}
                          className="w-full bg-[#0f1524] border border-[#182030] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="gemini">Google Gemini (Nativo / Padrão)</option>
                          <option value="openai">OpenAI ChatGPT (GPT-4o / GPT-4)</option>
                          <option value="anthropic">Anthropic Claude (Claude 3.5 Sonnet)</option>
                        </select>
                      </div>

                      {aiProvider === 'gemini' && (
                        <div className="space-y-1.5 animate-fade-in">
                          <label className="text-[10px] font-mono text-[#7f8e9c] font-black uppercase">Gemini API Key (Opcional - usa a padrão do servidor se vazia)</label>
                          <input
                            type="password"
                            value={geminiApiKey}
                            onChange={(e) => setGeminiApiKey(e.target.value)}
                            placeholder="Chave nativa do Google AI Studio..."
                            className="w-full bg-[#0f1524] border border-[#182030] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                          />
                        </div>
                      )}

                      {aiProvider === 'openai' && (
                        <div className="space-y-1.5 animate-fade-in">
                          <label className="text-[10px] font-mono text-[#7f8e9c] font-black uppercase">OpenAI API Key (Necessária para habilitar ChatGPT)</label>
                          <input
                            type="password"
                            value={openaiApiKey}
                            onChange={(e) => setOpenaiApiKey(e.target.value)}
                            placeholder="Coloque sua chave sk-proj-..."
                            className="w-full bg-[#0f1524] border border-[#182030] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                          />
                        </div>
                      )}

                      {aiProvider === 'anthropic' && (
                        <div className="space-y-1.5 animate-fade-in">
                          <label className="text-[10px] font-mono text-[#7f8e9c] font-black uppercase">Anthropic API Key (Necessária para habilitar Claude)</label>
                          <input
                            type="password"
                            value={anthropicApiKey}
                            onChange={(e) => setAnthropicApiKey(e.target.value)}
                            placeholder="Coloque sua chave sk-ant-..."
                            className="w-full bg-[#0f1524] border border-[#182030] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#182030]/50">
                      <div className="flex gap-1.5 text-[10px] font-mono text-slate-500">
                        <span>Status:</span>
                        <span className="text-emerald-400 font-extrabold uppercase animate-pulse">● Conectado e Operando via {aiProvider.toUpperCase()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {aiConfigSavedToast && (
                          <span className="text-[10px] text-emerald-400 font-mono font-bold animate-fade-in mr-2 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Salvo com Sucesso!
                          </span>
                        )}
                        <button
                          type="button"
                          disabled={isSavingAIConfig}
                          onClick={() => {
                            playClickSound();
                            setIsSavingAIConfig(true);
                            setTimeout(() => {
                              // Save state variables to localStorage to persist choices locally
                              localStorage.setItem('athena_ai_provider', aiProvider);
                              localStorage.setItem('athena_openai_api_key', openaiApiKey);
                              localStorage.setItem('athena_anthropic_api_key', anthropicApiKey);
                              localStorage.setItem('athena_gemini_api_key', geminiApiKey);
                              localStorage.setItem('athena_ai_name', aiName);
                              localStorage.setItem('athena_ai_tone', aiTone);
                              localStorage.setItem('athena_ai_strictness', aiStrictness);
                              localStorage.setItem('athena_ai_custom_instruction', aiCustomInstruction);
                              
                              playSuccessSound();
                              setIsSavingAIConfig(false);
                              setAiConfigSavedToast(true);
                              setTimeout(() => setAiConfigSavedToast(false), 3000);
                            }, 1000);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all font-mono"
                        >
                          {isSavingAIConfig ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Salvando...
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" /> Salvar Calibração de IA
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ==================================================== */}
      {/* MODAL / SIDEBAR DRAWER: STUDENT DETAIL WINDOW */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0f1524] border border-[#182030] rounded-3xl p-6 max-w-lg w-full relative space-y-5 shadow-2xl animate-scale-up text-left">
            
            <button
              onClick={() => { playClickSound(); setSelectedStudent(null); }}
              className="absolute top-4 right-4 p-1.5 bg-[#070a13] border border-[#182030] hover:bg-[#182030] hover:text-white rounded-lg text-slate-400 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-indigo-400 font-extrabold uppercase bg-[#070a13] px-2.5 py-1 rounded-md border border-[#182030] leading-none">
                {selectedStudent.plan}
              </span>
              <h3 className="text-lg font-black text-white pt-1">{selectedStudent.name}</h3>
              <p className="text-xs font-mono text-slate-400">{selectedStudent.email}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-[#070a13] border border-[#182030] p-3 rounded-xl text-center shadow-sm">
              <div>
                <span className="text-[8px] font-mono text-slate-500 uppercase block">Desempenho</span>
                <span className="text-sm font-semibold text-white font-mono">{selectedStudent.performance}%</span>
              </div>
              <div>
                <span className="text-[8px] font-mono text-slate-500 uppercase block">Streak</span>
                <span className="text-sm font-semibold text-indigo-400 font-extrabold font-mono">{selectedStudent.streak} dias</span>
              </div>
              <div>
                <span className="text-[8px] font-mono text-slate-500 uppercase block">Presença</span>
                <span className="text-sm font-semibold text-slate-300 font-mono text-nowrap text-xs">{selectedStudent.lastAccess}</span>
              </div>
            </div>

            <div className="space-y-1 bg-[#070a13]/60 p-4 rounded-xl border border-[#182030]/50 shadow-inner">
              <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">Dossiê e Observações</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedStudent.notes}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => { playClickSound(); setShowNotificationModal(true); }}
                className="py-2 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold rounded-lg text-xs transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5 fill-white text-white" /> Enviar Aviso Direto
              </button>
              <button
                onClick={() => { playClickSound(); setSelectedStudent(null); }}
                className="py-2 px-4 bg-[#070a13] border border-[#182030] text-slate-300 hover:border-indigo-500 hover:text-white rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Fechar Dossiê
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: DIRECT ALERT NOTIFICATOR */}
      {showNotificationModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-[#0f1524] border border-[#182030] rounded-3xl p-6 max-w-md w-full relative space-y-4 shadow-2xl animate-scale-up text-left">
            <button
              onClick={() => { playClickSound(); setShowNotificationModal(false); }}
              className="absolute top-4 right-4 p-1.5 bg-[#070a13] border border-[#182030] hover:bg-[#182030] rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Escrever Aviso p/ {selectedStudent.name}</h3>
              <p className="text-xs text-slate-400 leading-normal mb-1">Seu aviso aparecerá em tempo real na tela do aluno sob o sistema de alertas prioritários.</p>
            </div>

            <textarea
              rows={4}
              placeholder="Digite a mensagem motivacional ou aviso urgente..."
              value={notificationMsg}
              onChange={(e) => setNotificationMsg(e.target.value)}
              className="w-full bg-[#070a13] border border-[#182030] rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-sans leading-relaxed"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => { playClickSound(); setShowNotificationModal(false); }}
                className="px-4 py-2 bg-[#070a13] border border-[#182030] text-slate-400 rounded-lg text-xs font-mono font-bold hover:text-white"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSendNotification}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 fill-white text-white" /> Confirmar Envio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD MATERIAL INTERACTIVE PORTAL */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1524] border border-[#182030] rounded-3xl p-6 max-w-lg w-full relative space-y-5 shadow-2xl animate-scale-up text-left">
            
            <button
              onClick={() => { playClickSound(); setShowAddMaterialModal(null); }}
              className="absolute top-4 right-4 p-1.5 bg-[#070a13] border border-[#182030] hover:bg-[#182030] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Alimentar Cérebro da Athena</h3>
              <p className="text-xs text-slate-400">Insira materiais de referência para a disciplina: <b className="text-indigo-400 font-extrabold">{knowledge.find(k => k.id === showAddMaterialModal)?.discipline}</b></p>
            </div>

            {/* Inner modal tabs */}
            <div className="flex border border-[#182030] bg-[#070a13] rounded-lg p-1 text-[10px] font-mono">
              {[
                { id: 'upload', label: 'Provas PDF', icon: <Upload className="w-3.5 h-3.5" /> },
                { id: 'text', label: 'Texto Manual', icon: <FileText className="w-3.5 h-3.5" /> },
                { id: 'link', label: 'Links/Fontes', icon: <Link className="w-3.5 h-3.5" /> },
                { id: 'flashcard', label: 'Flashcards', icon: <Layers className="w-3.5 h-3.5" /> }
              ].map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => { playClickSound(); setMaterialType(sub.id as any); }}
                  className={`flex-1 py-1.5 rounded flex items-center justify-center gap-1 cursor-pointer font-bold ${
                    materialType === sub.id ? 'bg-[#0f1524] border border-[#182030] text-white font-black' : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  {sub.icon}
                  <span className="hidden sm:inline">{sub.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleAddKnowledgeContent} className="space-y-4 pt-1">
              {/* UPLOAD FORM */}
              {materialType === 'upload' && (
                <div onClick={() => alert('Arquivo de demonstração selecionado com sucesso!')} className="border border-dashed border-indigo-500/30 hover:border-[#182030] bg-[#070a13] p-8 rounded-xl text-center space-y-2 cursor-pointer transition-colors shadow-inner">
                  <div className="mx-auto w-10 h-10 bg-[#0f1524] border border-[#182030] rounded-lg flex items-center justify-center text-indigo-400">
                    <Upload className="w-5 h-5 animate-bounce" style={{ animationDuration: '4s' }} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">Arraste seu arquivo .PDF, .TXT ou .DOCX</span>
                    <span className="text-[10px] text-slate-500 block pt-0.5">Limite máximo recomendado: 32MB</span>
                  </div>
                </div>
              )}

              {/* MANUAL TEXT FORM */}
              {materialType === 'text' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Título do Material..."
                    value={manualMaterialTitle}
                    onChange={(e) => setManualMaterialTitle(e.target.value)}
                    className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-1.5 px-3 text-xs text-slate-350 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                  <textarea
                    rows={4}
                    placeholder="Cole as anotações do material, súmulas ou nova lei seca aqui..."
                    value={manualMaterialText}
                    onChange={(e) => setManualMaterialText(e.target.value)}
                    className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-1.5 px-3 text-xs text-slate-300 placeholder-slate-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-sans leading-relaxed"
                    required
                  />
                </div>
              )}

              {/* URL LINK FORM */}
              {materialType === 'link' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase font-black">Link da Fonte de Conteúdo</label>
                  <input
                    type="url"
                    placeholder="https://www.planalto.gov.br/ccivil_03/leis/l9503.htm"
                    value={materialLink}
                    onChange={(e) => setMaterialLink(e.target.value)}
                    className="w-full bg-[#070a13] border border-[#182030] rounded-lg py-1.5 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                    required
                  />
                </div>
              )}

              {/* MICRO CONTACT FLASHCARDS */}
              {materialType === 'flashcard' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Frente (Pergunta)</label>
                    <textarea
                      rows={3}
                      placeholder="Ex: Qual o limite de álcool para configurar infração penal?"
                      value={flashcardFront}
                      onChange={(e) => setFlashcardFront(e.target.value)}
                      className="w-full bg-[#070a13] border border-[#182030] rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Verso (Gabarito Curto)</label>
                    <textarea
                      rows={3}
                      placeholder="Ex: Igual ou superior a 0,34 mg/L de ar expirado."
                      value={flashcardBack}
                      onChange={(e) => setFlashcardBack(e.target.value)}
                      className="w-full bg-[#070a13] border border-[#182030] rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { playClickSound(); setShowAddMaterialModal(null); }}
                  className="px-4 py-2 bg-[#070a13] border border-[#182030] hover:bg-[#182030] rounded-lg text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  Confirmar Ingestão <Check className="w-4 h-4 text-white" />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
