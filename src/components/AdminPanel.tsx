import React, { useState } from 'react';
import {
  Compass, Users, BookOpen, HelpCircle, Calendar, CreditCard, Settings,
  TrendingUp, ArrowLeftRight, Search, Plus, Upload, Link, AlertTriangle,
  Sparkles, Check, X, ShieldCheck, FileText, Send, Layers, Mail,
  Phone, CalendarDays, Percent, ArrowUpRight, CheckCircle2, Sliders, ChevronRight,
  Sun, Moon, Loader2, DollarSign, Bell, BarChart3, Edit2, Trash2, Download,
  ChevronLeft, Filter, RefreshCw, MessageSquare, Target, Flame, Award,
  TrendingDown, AlertCircle, CheckSquare, Eye, Save, Coins, Activity, Zap
} from 'lucide-react';
import { getCreditSummary, getAllEntries, seedDemoData, clearLedger, type CreditEntry } from '../lib/creditTracker';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { playClickSound, playSuccessSound, playCorrectSound } from '../utils/audioEffects';

interface AdminPanelProps {
  onBack: () => void;
  theme: 'light' | 'dark';
  toggleTheme?: () => void;
}

// Initial mockup data
const INITIAL_STUDENTS = [
  { id: '1', name: 'Guilherme Toledo', email: 'toledo.digital01@gmail.com', plan: 'Athena Supreme', performance: 88, streak: 12, lastAccess: 'Hoje, 14:32', situation: 'safe', notes: 'Aluno altamente engajado, focando na Resolução 432 do CONTRAN.' },
  { id: '2', name: 'Ana Oliveira', email: 'ana.oliveira@gmail.com', plan: 'Athena Supreme', performance: 76, streak: 8, lastAccess: 'Hoje, 09:12', situation: 'safe', notes: 'Progresso regular em Física de Trânsito, precisa reforçar colisões.' },
  { id: '3', name: 'Carlos Eduardo', email: 'carlos.edu@hotmail.com', plan: 'Essencial', performance: 58, streak: 0, lastAccess: 'Há 3 dias', situation: 'warning', notes: 'Desempenho em Direito Administrativo caiu. Recomendável propor simulado de reforço.' },
  { id: '4', name: 'Mariana Costa', email: 'mari.costa@gmail.com', plan: 'Essencial', performance: 45, streak: 2, lastAccess: 'Ontem, 20:45', situation: 'critical', notes: 'Risco alto de cancelamento. Pouco tempo de tela no modo foco nesta semana.' },
  { id: '5', name: 'Roberto Mendes', email: 'roberto.prf@gmail.com', plan: 'Gratuito', performance: 92, streak: 15, lastAccess: 'Hoje, 15:10', situation: 'safe', notes: 'Disparou em acerto de questões. Excelente candidato para upgrade de plano.' },
  { id: '6', name: 'Juliana Vieira', email: 'ju.vieira@outlook.com', plan: 'Gratuito', performance: 38, streak: 0, lastAccess: 'Há 5 dias', situation: 'critical', notes: 'Sem atividades práticas registradas há uma semana. Alerta de churn ativo.' }
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alunos' | 'conhecimento' | 'questoes' | 'cronogramas' | 'athena' | 'financeiro' | 'planos' | 'notificacoes' | 'relatorios' | 'configuracoes'>('dashboard');
  
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
  // Nova matéria
  const [showNewDisciplineModal, setShowNewDisciplineModal] = useState(false);
  const [newDisciplineName, setNewDisciplineName] = useState('');
  const [newDisciplinePriority, setNewDisciplinePriority] = useState<'Alta' | 'Média' | 'Baixa'>('Média');
  const [newDisciplineWeight, setNewDisciplineWeight] = useState('5.0%');
  const [newDisciplineRecurrence, setNewDisciplineRecurrence] = useState<'Altíssima' | 'Alta' | 'Média' | 'Baixa'>('Média');

  const handleCreateDiscipline = () => {
    if (!newDisciplineName.trim()) return;
    const newItem = {
      id: `custom-${Date.now()}`,
      discipline: newDisciplineName.trim(),
      materials: 0,
      lastUpdate: new Date().toLocaleDateString('pt-BR'),
      aiStatus: 'Pendente',
      size: '0 KB',
      priority: newDisciplinePriority,
      trend: 'Estável',
      coverage: 0,
      recurrence: newDisciplineRecurrence,
      weight: newDisciplineWeight,
      isCustom: true,
    };
    setKnowledge(prev => [...prev, newItem]);
    setNewDisciplineName('');
    setNewDisciplinePriority('Média');
    setNewDisciplineWeight('5.0%');
    setNewDisciplineRecurrence('Média');
    setShowNewDisciplineModal(false);
    showToastMsg(`Matéria "${newItem.discipline}" criada com sucesso!`);
    playSuccessSound();
  };

  const handleDeleteDiscipline = (id: string) => {
    setKnowledge(prev => prev.filter(k => k.id !== id));
    showToastMsg('Matéria removida.');
  };

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
  const [subTabKnowledge, setSubTabKnowledge] = useState<'disciplinas' | 'editais' | 'drive' | 'geral'>('disciplinas');

  // ── Base Geral de Conhecimento ────────────────────────────────────────────
  type GeneralMaterial = { id: string; title: string; content: string; type: 'text' | 'link' | 'drive'; addedAt: string; };
  type GeneralCategory = { id: string; name: string; icon: string; color: string; materials: GeneralMaterial[]; };

  const [generalCategories, setGeneralCategories] = React.useState<GeneralCategory[]>(() => {
    try { return JSON.parse(localStorage.getItem('provax_general_kb') || '[]'); } catch { return []; }
  });
  const saveGeneral = (cats: GeneralCategory[]) => {
    setGeneralCategories(cats);
    localStorage.setItem('provax_general_kb', JSON.stringify(cats));
  };
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [showNewCategoryModal, setShowNewCategoryModal] = React.useState(false);
  const [newCatName, setNewCatName] = React.useState('');
  const [newCatIcon, setNewCatIcon] = React.useState('📁');
  const [newCatColor, setNewCatColor] = React.useState('indigo');
  const [showAddGeneralMaterial, setShowAddGeneralMaterial] = React.useState(false);
  const [newGenTitle, setNewGenTitle] = React.useState('');
  const [newGenContent, setNewGenContent] = React.useState('');
  const [newGenType, setNewGenType] = React.useState<'text' | 'link' | 'drive'>('text');
  const [newGenDriveLoading, setNewGenDriveLoading] = React.useState(false);
  const [newGenDriveError, setNewGenDriveError] = React.useState('');
  const [newGenDriveUrl, setNewGenDriveUrl] = React.useState('');
  const [newGenDriveFetched, setNewGenDriveFetched] = React.useState(false);
  const [newGenFileName, setNewGenFileName] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [editingCategoryId, setEditingCategoryId] = React.useState<string | null>(null);

  const handleCreateCategory = () => {
    if (!newCatName.trim()) return;
    const cat: GeneralCategory = { id: `cat-${Date.now()}`, name: newCatName.trim(), icon: newCatIcon, color: newCatColor, materials: [] };
    saveGeneral([...generalCategories, cat]);
    setNewCatName(''); setNewCatIcon('📁'); setNewCatColor('indigo');
    setShowNewCategoryModal(false);
    showToastMsg(`Categoria "${cat.name}" criada!`); playSuccessSound();
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewGenDriveError('');
    setNewGenDriveFetched(false);
    setNewGenContent('');
    setNewGenFileName(file.name);
    if (!newGenTitle.trim()) setNewGenTitle(file.name.replace(/\.[^/.]+$/, ''));

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);

    // Tipos de texto — lê conteúdo
    const isReadableText = (
      file.type.startsWith('text/') ||
      ['txt','md','csv','json','xml','html','htm','js','ts','py','java','c','cpp','css','sql','yaml','yml','log'].includes(ext)
    );

    if (isReadableText) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setNewGenContent(text?.slice(0, 50000) || '');
        setNewGenDriveFetched(true);
      };
      reader.onerror = () => setNewGenDriveError('Erro ao ler o arquivo.');
      reader.readAsText(file, 'UTF-8');
    } else {
      // Arquivo binário (PDF, vídeo, áudio, imagem, DOCX...) —
      // não dá para extrair texto no browser sem biblioteca.
      // Registramos os metadados e avisamos o usuário.
      const typeLabel =
        file.type.startsWith('video/') ? '🎬 Vídeo' :
        file.type.startsWith('audio/') ? '🎵 Áudio' :
        file.type.startsWith('image/') ? '🖼️ Imagem' :
        file.type === 'application/pdf' || ext === 'pdf' ? '📄 PDF' :
        ['doc','docx'].includes(ext) ? '📝 Word' :
        ['xls','xlsx'].includes(ext) ? '📊 Excel' :
        ['ppt','pptx'].includes(ext) ? '📊 PowerPoint' :
        '📎 Arquivo';

      // Armazenamos os metadados como conteúdo estruturado
      setNewGenContent(JSON.stringify({
        _fileRef: true,
        name: file.name,
        type: file.type || ext,
        size: `${sizeMB} MB`,
        label: typeLabel,
        note: 'Arquivo registrado — conteúdo binário não extraído',
      }));
      setNewGenDriveFetched(true);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFetchDriveForGeneral = async () => {
    if (!newGenDriveUrl.trim()) return;
    setNewGenDriveLoading(true);
    setNewGenDriveError('');
    setNewGenDriveFetched(false);
    setNewGenContent('');
    try {
      const apiKey = localStorage.getItem('provax_google_api_key') || 'AIzaSyCflyHQfNnXdt5TsXmN_nR0FBm8meEmk-M';
      const res = await fetch('/api/fetch-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newGenDriveUrl, apiKey }),
      });
      const data = await res.json() as any;
      if (!res.ok || data.error) {
        setNewGenDriveError(data.error || 'Erro ao acessar o arquivo.');
      } else {
        setNewGenContent(data.textContent || '');
        if (!newGenTitle.trim()) setNewGenTitle(data.fileName || '');
        setNewGenDriveFetched(true);
      }
    } catch { setNewGenDriveError('Falha de conexão. Tente novamente.'); }
    finally { setNewGenDriveLoading(false); }
  };

  const handleAddGeneralMaterial = () => {
    if (!newGenTitle.trim() || !selectedCategory) return;
    const mat: GeneralMaterial = { id: `mat-${Date.now()}`, title: newGenTitle.trim(), content: newGenContent, type: newGenType === 'drive' ? 'text' : newGenType, addedAt: new Date().toLocaleDateString('pt-BR') };
    saveGeneral(generalCategories.map(c => c.id === selectedCategory ? { ...c, materials: [...c.materials, mat] } : c));
    setNewGenTitle(''); setNewGenContent(''); setNewGenType('text');
    setNewGenDriveUrl(''); setNewGenDriveFetched(false); setNewGenDriveError('');
    setShowAddGeneralMaterial(false);
    showToastMsg('Material adicionado!'); playSuccessSound();
  };
  const handleDeleteGeneralMaterial = (catId: string, matId: string) => {
    saveGeneral(generalCategories.map(c => c.id === catId ? { ...c, materials: c.materials.filter(m => m.id !== matId) } : c));
    showToastMsg('Material removido.');
  };
  const handleDeleteCategory = (catId: string) => {
    saveGeneral(generalCategories.filter(c => c.id !== catId));
    if (selectedCategory === catId) setSelectedCategory(null);
    showToastMsg('Categoria excluída.');
  };
  // Google Drive import — Arquivo único
  const [driveAdminUrl, setDriveAdminUrl] = useState('');
  const [driveAdminLoading, setDriveAdminLoading] = useState(false);
  const [driveAdminResult, setDriveAdminResult] = useState<{ fileName: string; textContent: string; charCount: number; warning?: string } | null>(null);
  const [driveAdminError, setDriveAdminError] = useState('');
  const [driveAdminDiscipline, setDriveAdminDiscipline] = useState('Legislação de Trânsito (CTB)');
  // Google Drive import — Pasta
  const [driveMode, setDriveMode] = useState<'file' | 'folder'>('file');
  const [driveFolderLoading, setDriveFolderLoading] = useState(false);
  const [driveFolderResults, setDriveFolderResults] = useState<Array<{
    id: string; name: string; discipline: string; textContent: string; charCount: number; supported: boolean; error?: string; selected: boolean;
  }>>([]);
  const [driveFolderError, setDriveFolderError] = useState('');
  const [driveFolderImporting, setDriveFolderImporting] = useState(false);

  const handleFetchDriveAdmin = async () => {
    if (!driveAdminUrl.trim()) return;
    setDriveAdminLoading(true);
    setDriveAdminError('');
    setDriveAdminResult(null);
    try {
      const apiKey = localStorage.getItem('provax_google_api_key') || 'AIzaSyCflyHQfNnXdt5TsXmN_nR0FBm8meEmk-M';
      const res = await fetch('/api/fetch-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: driveAdminUrl, apiKey }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setDriveAdminError(data.error || 'Erro ao acessar o arquivo.');
      } else {
        setDriveAdminResult(data);
      }
    } catch { setDriveAdminError('Falha de conexão.'); }
    finally { setDriveAdminLoading(false); }
  };

  const handleFetchDriveFolder = async () => {
    if (!driveAdminUrl.trim()) return;
    setDriveFolderLoading(true);
    setDriveFolderError('');
    setDriveFolderResults([]);
    try {
      const apiKey = localStorage.getItem('provax_google_api_key') || 'AIzaSyCflyHQfNnXdt5TsXmN_nR0FBm8meEmk-M';
      const geminiKey = localStorage.getItem('athena_gemini_api_key_v2') || '';
      const res = await fetch('/api/fetch-drive-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: driveAdminUrl, apiKey, geminiKey }),
      });
      const data = await res.json() as any;
      if (!res.ok || data.error) {
        setDriveFolderError(data.error || 'Erro ao acessar a pasta.');
      } else {
        setDriveFolderResults((data.results || []).map((r: any) => ({ ...r, selected: r.supported && !r.error })));
      }
    } catch { setDriveFolderError('Falha de conexão.'); }
    finally { setDriveFolderLoading(false); }
  };

  const handleImportDriveFolder = () => {
    const toImport = driveFolderResults.filter(r => r.selected && r.textContent);
    if (!toImport.length) return;
    setDriveFolderImporting(true);
    setKnowledge(prev => {
      let updated = [...prev];
      for (const file of toImport) {
        const existing = updated.find(k => k.discipline === file.discipline);
        if (existing) {
          updated = updated.map(k => k.discipline === file.discipline
            ? { ...k, materials: k.materials + 1, lastUpdate: 'Agora', aiStatus: 'Sincronizada' }
            : k);
        } else {
          updated.push({
            id: `drive-${Date.now()}-${file.id}`, discipline: file.discipline,
            materials: 1, lastUpdate: 'Agora', aiStatus: 'Sincronizada',
            size: `${(file.charCount / 1024).toFixed(1)} KB`,
            priority: 'Média', trend: 'Estável', coverage: 0, recurrence: 'Média', weight: '0%',
          });
        }
      }
      return updated;
    });
    setTimeout(() => {
      setDriveFolderImporting(false);
      setDriveFolderResults([]);
      setDriveAdminUrl('');
      setSubTabKnowledge('disciplinas');
      showToastMsg(`${toImport.length} arquivo(s) importados com sucesso!`);
      playSuccessSound();
    }, 800);
  };

  const handleImportDriveAdmin = () => {
    if (!driveAdminResult) return;
    setKnowledge(prev => {
      const existing = prev.find(k => k.discipline === driveAdminDiscipline);
      if (existing) {
        return prev.map(k => k.discipline === driveAdminDiscipline
          ? { ...k, materials: k.materials + 1, size: `${(parseFloat(k.size) + driveAdminResult.charCount / 1024).toFixed(1)} KB`, lastUpdate: 'Agora', aiStatus: 'Sincronizada' }
          : k);
      }
      return [...prev, {
        id: `drive-${Date.now()}`, discipline: driveAdminDiscipline,
        materials: 1, lastUpdate: 'Agora', aiStatus: 'Sincronizada',
        size: `${(driveAdminResult.charCount / 1024).toFixed(1)} KB`,
        priority: 'Média', trend: 'Estável', coverage: 0, recurrence: 'Média', weight: '0%',
      }];
    });
    setDriveAdminUrl('');
    setDriveAdminResult(null);
    setSubTabKnowledge('disciplinas');
    showToastMsg(`"${driveAdminResult.fileName}" importado com sucesso!`);
    playSuccessSound();
  };
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

  // ── Configuração de IA — Claude + GPT ────────────────────────────────────
  const [activeProvider, setActiveProvider] = useState<'anthropic' | 'openai' | 'google'>(() =>
    (localStorage.getItem('athena_ai_provider') || 'anthropic') as 'anthropic' | 'openai' | 'google'
  );
  const [anthropicApiKey, setAnthropicApiKey] = useState(() => localStorage.getItem('athena_anthropic_api_key') || '');
  const [openaiApiKey,    setOpenaiApiKey]    = useState(() => localStorage.getItem('athena_openai_api_key')    || '');
  const [geminiApiKeyNew, setGeminiApiKeyNew] = useState(() => localStorage.getItem('athena_gemini_api_key_v2') || '');
  // Modelos por função — Claude
  const [claudeChatModel,      setChatModel]      = useState(() => localStorage.getItem('athena_claude_chat_model')      || 'claude-haiku-3-5');
  const [claudeQuestionsModel, setQuestionsModel] = useState(() => localStorage.getItem('athena_claude_questions_model') || 'claude-sonnet-4-5');
  const [claudeAnalyzeModel,   setAnalyzeModel]   = useState(() => localStorage.getItem('athena_claude_analyze_model')  || 'claude-sonnet-4-5');
  const [claudeScheduleModel,  setScheduleModel]  = useState(() => localStorage.getItem('athena_claude_schedule_model') || 'claude-haiku-3-5');
  // Modelos por função — GPT
  const [gptChatModel,      setGptChatModel]      = useState(() => localStorage.getItem('athena_gpt_chat_model')      || 'gpt-4o-mini');
  const [gptQuestionsModel, setGptQuestionsModel] = useState(() => localStorage.getItem('athena_gpt_questions_model') || 'gpt-4o');
  const [gptAnalyzeModel,   setGptAnalyzeModel]   = useState(() => localStorage.getItem('athena_gpt_analyze_model')  || 'gpt-4o');
  const [gptScheduleModel,  setGptScheduleModel]  = useState(() => localStorage.getItem('athena_gpt_schedule_model') || 'gpt-4o-mini');
  // Modelos por função — Gemini
  const [geminiChatModel,      setGeminiChatModel]      = useState(() => localStorage.getItem('athena_gemini_chat_model')      || 'gemini-2.0-flash');
  const [geminiQuestionsModel, setGeminiQuestionsModel] = useState(() => localStorage.getItem('athena_gemini_questions_model') || 'gemini-2.5-flash');
  const [geminiAnalyzeModel,   setGeminiAnalyzeModel]   = useState(() => localStorage.getItem('athena_gemini_analyze_model')  || 'gemini-2.5-pro');
  const [geminiScheduleModel,  setGeminiScheduleModel]  = useState(() => localStorage.getItem('athena_gemini_schedule_model') || 'gemini-2.0-flash');
  // UI
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [newModelsAlert, setNewModelsAlert] = useState<string[]>(() => {
    try {
      const known = JSON.parse(localStorage.getItem('provax_known_model_ids') || '[]') as string[];
      const allIds = ['claude-haiku-3-5','claude-sonnet-4-5','claude-sonnet-4','claude-opus-4-5','claude-opus-4','gpt-4o-mini','gpt-4o','gpt-4-turbo','o1-mini','o3-mini'];
      return allIds.filter(id => !known.includes(id));
    } catch { return []; }
  });
  // compatibilidade legada
  const [aiProvider, setAiProvider] = useState(() => localStorage.getItem('athena_ai_provider') || 'anthropic');
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('athena_gemini_api_key') || '');

  const CLAUDE_MODELS_LIST = [
    { id: 'claude-haiku-3-5',  label: 'Claude Haiku 3.5',  badge: 'Rápido · Barato',        badgeCls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5', badge: 'Melhor custo-benefício ⭐', badgeCls: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { id: 'claude-sonnet-4',   label: 'Claude Sonnet 4',   badge: 'Equilibrado',              badgeCls: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { id: 'claude-opus-4-5',   label: 'Claude Opus 4.5',   badge: 'Alta inteligência',        badgeCls: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'claude-opus-4',     label: 'Claude Opus 4',     badge: 'Máxima precisão',          badgeCls: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  ];
  const GPT_MODELS_LIST = [
    { id: 'gpt-4o-mini',   label: 'GPT-4o Mini',      badge: 'Rápido · Barato',        badgeCls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'gpt-4o',        label: 'GPT-4o',           badge: 'Recomendado OpenAI ⭐',   badgeCls: 'text-green-400 bg-green-500/10 border-green-500/20' },
    { id: 'gpt-4-turbo',   label: 'GPT-4 Turbo',      badge: 'Equilibrado',             badgeCls: 'text-green-400 bg-green-500/10 border-green-500/20' },
    { id: 'o1-mini',       label: 'OpenAI o1 Mini',   badge: '🆕 Raciocínio avançado',  badgeCls: 'text-violet-400 bg-violet-500/10 border-violet-500/20', isNew: true },
    { id: 'o3-mini',       label: 'OpenAI o3 Mini',   badge: '🆕 Raciocínio máximo',   badgeCls: 'text-violet-400 bg-violet-500/10 border-violet-500/20', isNew: true },
  ];
  const GEMINI_MODELS_LIST = [
    { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', badge: '🆕 Mais rápido · 1M ctx', badgeCls: 'text-blue-400 bg-blue-500/10 border-blue-500/20', isNew: true },
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', badge: '🆕 Recomendado Google ⭐', badgeCls: 'text-blue-400 bg-blue-500/10 border-blue-500/20', isNew: true },
    { id: 'gemini-2.5-pro',   label: 'Gemini 2.5 Pro',   badge: '🆕 Máxima inteligência',  badgeCls: 'text-sky-400 bg-sky-500/10 border-sky-500/20',  isNew: true },
    { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', badge: 'Estável · Testado',       badgeCls: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { id: 'gemini-1.5-pro',   label: 'Gemini 1.5 Pro',   badge: 'Contexto 2M tokens',      badgeCls: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  ];

  // ── Estado de créditos ────────────────────────────────────────
  const [creditDays, setCreditDays] = useState(30);
  const [creditSummary, setCreditSummary] = useState(() => { seedDemoData(); return getCreditSummary(30); });
  const [creditEntries, setCreditEntries] = useState<CreditEntry[]>(() => getAllEntries(50));
  const refreshCredits = (days = creditDays) => {
    setCreditSummary(getCreditSummary(days));
    setCreditEntries(getAllEntries(50));
  };

  // ── Novos estados ─────────────────────────────────────────────
  // Edição de questões
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [editQStatement, setEditQStatement] = useState('');
  const [editQAnswer, setEditQAnswer] = useState<'C' | 'E'>('C');
  const [editQDiscipline, setEditQDiscipline] = useState('');
  const [editQSubtopic, setEditQSubtopic] = useState('');
  const [editQDifficulty, setEditQDifficulty] = useState<'Fácil' | 'Média' | 'Difícil'>('Média');
  const [newQuestionDifficulty, setNewQuestionDifficulty] = useState<'Fácil' | 'Média' | 'Difícil'>('Média');
  // Paginação de questões
  const [qPage, setQPage] = useState(0);
  const Q_PER_PAGE = 10;
  // Modal de notificação (substituindo alert)
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);
  // Modal de confirmação de exclusão
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteType, setConfirmDeleteType] = useState<'question' | 'template'>('question');
  // Notificações em massa
  const [massNotifMsg, setMassNotifMsg] = useState('');
  const [massNotifSegment, setMassNotifSegment] = useState<'all' | 'risk' | 'inactive' | 'gold'>('all');
  const [massNotifSent, setMassNotifSent] = useState(false);
  const [notifHistory, setNotifHistory] = useState([
    { id: 'n1', segment: 'Alunos em risco', msg: 'Você ainda pode recuperar sua meta semanal!', date: '28/05/2026', sent: 42 },
    { id: 'n2', segment: 'Todos os alunos', msg: 'Novo simulado disponível: CTB Avançado', date: '22/05/2026', sent: 1524 },
  ]);

  // ── Estado de edição de planos ────────────────────────────────
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [planData, setPlanData] = useState([
    { id: 'premium',  name: 'Athena Supreme', price: 97.00,  trial: true,  trialDays: 7,  features: ['Athena ilimitada 24h/dia', 'Simulados infinitos por IA', 'Diagnóstico preditivo CEBRASPE', 'Biblioteca inteligente de PDFs', 'Acesso antecipado a módulos'] },
    { id: 'essencial', name: 'Essencial PRF', price: 49.90, trial: true,  trialDays: 7,  features: ['Simulados ilimitados', 'Cronograma adaptativo', 'Flashcards completos', '50 msgs/dia com Athena', 'Histórico de progresso'] },
    { id: 'free',      name: 'Gratuito',      price: 0,     trial: false, trialDays: 0,  features: ['5 questões diárias', 'Cronograma padrão', '3 msgs/dia com Athena', 'Flashcards limitados'] },
  ]);
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanPrice, setEditPlanPrice] = useState('');
  const [editPlanTrial, setEditPlanTrial] = useState(false);
  const [editPlanTrialDays, setEditPlanTrialDays] = useState(7);
  const [editPlanFeatures, setEditPlanFeatures] = useState('');

  const showToastMsg = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // ── Handle student filter actions ─────────────────────────────
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
    showToastMsg(`Notificação enviada para ${selectedStudent.name}!`);
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
      showToastMsg('Preencha o nome e o ciclo do modelo.', 'error');
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
    setConfirmDeleteId(id);
    setConfirmDeleteType('template');
  };
  const handleConfirmDelete = () => {
    if (!confirmDeleteId) return;
    if (confirmDeleteType === 'question') {
      setQuestions(prev => prev.filter(q => q.id !== confirmDeleteId));
      showToastMsg('Questão removida do banco.');
    } else {
      setTemplates(prev => prev.filter(t => t.id !== confirmDeleteId));
      showToastMsg('Template excluído.');
    }
    setConfirmDeleteId(null);
    playClickSound();
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

  // Salvar edição de questão
  const handleSaveEditQuestion = () => {
    if (!editingQuestion || !editQStatement.trim()) return;
    setQuestions(prev => prev.map(q => q.id === editingQuestion.id
      ? { ...q, statement: editQStatement, answer: editQAnswer, discipline: editQDiscipline, subtopic: editQSubtopic, difficulty: editQDifficulty }
      : q
    ));
    setEditingQuestion(null);
    showToastMsg('Questão atualizada com sucesso!');
    playSuccessSound();
  };
  const handleStartEditQuestion = (q: any) => {
    setEditingQuestion(q);
    setEditQStatement(q.statement);
    setEditQAnswer(q.answer);
    setEditQDiscipline(q.discipline);
    setEditQSubtopic(q.subtopic);
    setEditQDifficulty(q.difficulty || 'Média');
  };

  const handleCreateQuestionManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionStatement.trim() || !newQuestionSubtopic.trim()) {
      showToastMsg('Preencha o enunciado e o subtema.', 'error');
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
    showToastMsg(`Questão adicionada! Athena detectou: "${detectedDiscipline}"`);
  };

  const handleDeleteQuestion = (id: string) => {
    setConfirmDeleteId(id);
    setConfirmDeleteType('question');
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

      <div className="flex-1 flex min-h-0 overflow-hidden" id="admin-layout-container">

        {/* SIDEBAR */}
        <nav className="w-56 bg-[#070a13] border-r border-[#141b2b] flex flex-col justify-between shrink-0 min-h-0" id="admin-sidebar-nav">
          <div className="p-3 space-y-0.5 overflow-y-auto flex-1">

            {/* Principal */}
            <p className="text-[9px] font-mono uppercase tracking-widest text-slate-700 font-bold px-2 pb-1.5 pt-1">Principal</p>
            {[
              { id: 'dashboard',    label: 'Dashboard',    icon: <Compass className="w-4 h-4" /> },
              { id: 'alunos',       label: 'Alunos',        icon: <Users className="w-4 h-4" /> },
              { id: 'questoes',     label: 'Questões',      icon: <HelpCircle className="w-4 h-4" /> },
              { id: 'conhecimento', label: 'Conhecimento',  icon: <BookOpen className="w-4 h-4" /> },
              { id: 'cronogramas',  label: 'Cronogramas',   icon: <Calendar className="w-4 h-4" /> },
            ].map(item => {
              const active = activeTab === item.id;
              return (
                <button key={item.id} onClick={() => handleTabChange(item.id as any)}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                    active ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}>
                  <span className={active ? 'text-indigo-400' : 'text-slate-500'}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}

            {/* Athena AI */}
            <p className="text-[9px] font-mono uppercase tracking-widest text-slate-700 font-bold px-2 pb-1.5 pt-4">Inteligência Artificial</p>
            <button onClick={() => handleTabChange('athena' as any)}
              className={`w-full flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${
                activeTab === 'athena'
                  ? 'bg-violet-600/20 text-violet-300 border-violet-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border-transparent'}`}>
              <span className={activeTab === 'athena' ? 'text-violet-400' : 'text-slate-500'}>
                <Sparkles className="w-4 h-4" />
              </span>
              <span>Athena AI</span>
              <span className="ml-auto text-[8px] font-mono bg-violet-500/15 text-violet-400 border border-violet-500/20 px-1.5 py-0.5 rounded">CENTRAL</span>
            </button>

            {/* Negócio */}
            <p className="text-[9px] font-mono uppercase tracking-widest text-slate-700 font-bold px-2 pb-1.5 pt-4">Negócio</p>
            {[
              { id: 'financeiro',   label: 'Financeiro',    icon: <DollarSign className="w-4 h-4" /> },
              { id: 'planos',       label: 'Planos',        icon: <CreditCard className="w-4 h-4" /> },
              { id: 'notificacoes', label: 'Notificações',  icon: <Bell className="w-4 h-4" /> },
              { id: 'relatorios',   label: 'Relatórios',    icon: <BarChart3 className="w-4 h-4" /> },
            ].map(item => {
              const active = activeTab === item.id;
              return (
                <button key={item.id} onClick={() => handleTabChange(item.id as any)}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                    active ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}>
                  <span className={active ? 'text-indigo-400' : 'text-slate-500'}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-[#141b2b]">
            <button onClick={() => handleTabChange('configuracoes')}
              className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                activeTab === 'configuracoes' ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}>
              <Settings className="w-4 h-4 text-slate-500" /> Configurações
            </button>
          </div>
        </nav>

        {/* WORKSPACE DETAILED DESKS */}
        <div className="flex-1 p-6 overflow-y-auto min-h-0" id="admin-workspace-viewport">
          
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
                
                {/* RECHARTS — Engajamento semanal */}
                <div className="lg:col-span-8 bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white tracking-tight">Engajamento Semanal</h3>
                      <p className="text-[10px] font-mono text-slate-500">Questões respondidas + horas de foco por dia</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Questões</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Horas foco</span>
                    </div>
                  </div>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { dia: 'Seg', questoes: 320, foco: 4.2 },
                        { dia: 'Ter', questoes: 480, foco: 5.8 },
                        { dia: 'Qua', questoes: 390, foco: 4.9 },
                        { dia: 'Qui', questoes: 610, foco: 7.1 },
                        { dia: 'Sex', questoes: 720, foco: 8.3 },
                        { dia: 'Sáb', questoes: 890, foco: 9.4 },
                        { dia: 'Dom', questoes: 540, foco: 6.2 },
                      ]} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gQ" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gF" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#0f1524', border: '1px solid #182030', borderRadius: 8, fontSize: 11 }} />
                        <Area type="monotone" dataKey="questoes" stroke="#6366f1" strokeWidth={2} fill="url(#gQ)" dot={false} />
                        <Area type="monotone" dataKey="foco" stroke="#10b981" strokeWidth={2} fill="url(#gF)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* CRITICAL ALERTS AND ACTIONS COLS (4 cols) */}
                <div className="lg:col-span-4 bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4 shadow-sm">
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-400">Alertas Críticos da Athena AI</h3>

                  <div className="space-y-3">
                    {[
                      { type: 'warning', text: 'Queda média de 12% no streak de estudos do grupo "Essencial". Recomendado emitir motivacional.', date: 'Ontem' },
                      { type: 'critical', text: 'A Resolução CONTRAN 432 sofreu nova alteração interpretativa pela banca CEBRASPE.', date: 'Hoje, 08:35' },
                      { type: 'info', text: '5 alunos no Plano Gratuito atingiram 90% de aproveitamento. Oportunidade de upsell para Athena Supreme.', date: 'Hoje, 12:44' }
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

              {/* ── MÉTRICAS DE RETENÇÃO ──────────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Curva de ativação (dias 1, 7, 30) */}
                <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-white">Curva de Ativação</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">% de alunos que voltaram após o cadastro</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Dia 1',  pct: 82, color: 'bg-emerald-500', note: 'voltaram no dia seguinte' },
                      { label: 'Dia 7',  pct: 61, color: 'bg-indigo-500',  note: 'ainda ativos na semana 1' },
                      { label: 'Dia 30', pct: 44, color: 'bg-amber-500',   note: 'retidos no primeiro mês' },
                      { label: 'Dia 90', pct: 28, color: 'bg-red-500',     note: 'ainda na plataforma' },
                    ].map(r => (
                      <div key={r.label}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-slate-300 w-12">{r.label}</span>
                          <span className="text-slate-500 text-[10px] flex-1 pl-3">{r.note}</span>
                          <span className={`font-black font-mono ${r.pct >= 60 ? 'text-emerald-400' : r.pct >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{r.pct}%</span>
                        </div>
                        <div className="h-2 bg-[#070a13] rounded-full overflow-hidden">
                          <div className={`h-full ${r.color} rounded-full transition-all`} style={{ width: `${r.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-[#182030]">
                    <p className="text-[10px] text-slate-500 font-mono">
                      Benchmark SaaS educacional: D1=70% · D7=50% · D30=30%
                      <span className="text-emerald-400 font-bold ml-2">✓ Acima da média</span>
                    </p>
                  </div>
                </div>

                {/* Churn + LTV */}
                <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-white">Retenção & LTV</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Saúde financeira do negócio</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Churn mensal',    value: '1.2%',      sub: 'meta: < 1.5%',       color: 'text-emerald-400', good: true },
                      { label: 'LTV médio',        value: 'R$ 485',    sub: 'receita por aluno',   color: 'text-indigo-400',  good: true },
                      { label: 'Tempo médio',      value: '4.9 meses', sub: 'até cancelar',        color: 'text-amber-400',   good: null },
                      { label: 'NPS estimado',     value: '+62',       sub: 'promotores vs críticos', color: 'text-emerald-400', good: true },
                    ].map(m => (
                      <div key={m.label} className="bg-[#070a13] border border-[#182030] rounded-xl p-3">
                        <p className="text-[10px] text-slate-500 font-mono uppercase">{m.label}</p>
                        <p className={`text-xl font-black mt-1 font-mono ${m.color}`}>{m.value}</p>
                        <p className={`text-[9px] mt-0.5 font-mono ${m.good === true ? 'text-emerald-500' : m.good === false ? 'text-red-400' : 'text-slate-500'}`}>{m.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Alunos em risco vs. saudáveis */}
                  <div className="space-y-2 pt-3 border-t border-[#182030]">
                    <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Distribuição de saúde</p>
                    <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                      <div className="bg-emerald-500" style={{ width: '58%' }} title="Saudáveis: 58%" />
                      <div className="bg-amber-500" style={{ width: '26%' }} title="Atenção: 26%" />
                      <div className="bg-red-500"   style={{ width: '16%' }} title="Em risco: 16%" />
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-mono">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Saudáveis 58%</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Atenção 26%</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Churn risk 16%</span>
                    </div>
                  </div>
                </div>

                {/* Cohort semanal */}
                <div className="lg:col-span-2 bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white">Cohort Semanal — Novos Alunos</h3>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">Retenção por semana de cadastro (% que voltou)</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[10px] font-mono min-w-[500px]">
                      <thead>
                        <tr className="border-b border-[#182030] text-slate-600 uppercase">
                          <th className="text-left py-2 pr-4">Semana</th>
                          <th className="text-center py-2 pr-3">Alunos</th>
                          <th className="text-center py-2 pr-3">Sem 1</th>
                          <th className="text-center py-2 pr-3">Sem 2</th>
                          <th className="text-center py-2 pr-3">Sem 4</th>
                          <th className="text-center py-2">Sem 8</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#182030]">
                        {[
                          { week: '06/01/2026', total: 38, s1: 84, s2: 71, s4: 58, s8: 41 },
                          { week: '13/01/2026', total: 52, s1: 79, s2: 66, s4: 52, s8: 36 },
                          { week: '20/01/2026', total: 47, s1: 87, s2: 74, s4: 61, s8: null },
                          { week: '27/01/2026', total: 61, s1: 82, s2: 68, s4: null, s8: null },
                          { week: '03/02/2026', total: 73, s1: 91, s2: null, s4: null, s8: null },
                        ].map(row => {
                          const cell = (v: number | null) => {
                            if (v === null) return <span className="text-slate-700">—</span>;
                            const color = v >= 70 ? 'text-emerald-400' : v >= 50 ? 'text-amber-400' : 'text-red-400';
                            const bg    = v >= 70 ? 'bg-emerald-500/10' : v >= 50 ? 'bg-amber-500/10' : 'bg-red-500/10';
                            return <span className={`${color} ${bg} px-2 py-0.5 rounded font-bold`}>{v}%</span>;
                          };
                          return (
                            <tr key={row.week} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-2.5 pr-4 text-slate-400">{row.week}</td>
                              <td className="py-2.5 pr-3 text-center text-slate-300 font-bold">{row.total}</td>
                              <td className="py-2.5 pr-3 text-center">{cell(row.s1)}</td>
                              <td className="py-2.5 pr-3 text-center">{cell(row.s2)}</td>
                              <td className="py-2.5 pr-3 text-center">{cell(row.s4)}</td>
                              <td className="py-2.5 text-center">{cell(row.s8)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
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
                    <option value="Athena Supreme">Athena Supreme</option>
                    <option value="Essencial PRF">Essencial PRF</option>
                    <option value="Gratuito">Gratuito</option>
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
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                  id="tab-sub-knowledge-editor"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Analisador de Editais
                </button>
                <button
                  onClick={() => { playClickSound(); setSubTabKnowledge('drive'); }}
                  className={`pb-3 text-xs font-mono uppercase tracking-wider font-extrabold cursor-pointer border-b-2 transition-all flex items-center gap-1.5 ${
                    subTabKnowledge === 'drive'
                      ? 'border-green-500 text-green-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  📂 Importar Drive
                </button>
                <button
                  onClick={() => { playClickSound(); setSubTabKnowledge('geral'); }}
                  className={`pb-3 text-xs font-mono uppercase tracking-wider font-extrabold cursor-pointer border-b-2 transition-all flex items-center gap-1.5 ${
                    subTabKnowledge === 'geral'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  📖 Base Geral
                </button>
              </div>

              {/* VIEW 1: DIRECTORY OF SUBJECTS */}
              {subTabKnowledge === 'disciplinas' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="grid-knowledge-disciplines">

                  {/* Card: Nova Matéria */}
                  <button
                    onClick={() => setShowNewDisciplineModal(true)}
                    className="bg-[#0f1524] border-2 border-dashed border-[#182030] hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group min-h-[200px]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                      <Plus className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-indigo-400 group-hover:text-indigo-300">Nova Matéria</p>
                      <p className="text-[10px] text-slate-500 mt-1">Adicionar disciplina personalizada</p>
                    </div>
                  </button>

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

                      <div className={`flex gap-2 pt-2 border-t border-[#141b2b] ${item.isCustom ? '' : ''}`}>
                        <button
                          onClick={() => { playClickSound(); setShowAddMaterialModal(item.id); }}
                          className="flex-1 py-2 bg-[#070a13] hover:bg-[#131a2e] border border-[#182030] rounded-xl text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar Referência
                        </button>
                        {item.isCustom && (
                          <button
                            onClick={() => handleDeleteDiscipline(item.id)}
                            className="px-3 py-2 bg-[#070a13] hover:bg-red-950/30 border border-[#182030] hover:border-red-900/40 rounded-xl text-red-500 hover:text-red-400 transition-all cursor-pointer"
                            title="Excluir matéria personalizada"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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
                        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${theme === 'light' ? 'border-slate-200' : 'border-[#182030]'}`}>
                          <div className="space-y-1 text-left">
                            <span className="text-[10px] font-mono text-emerald-600 font-extrabold uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Processado por Athena AI</span>
                            <h3 className={`text-sm font-black uppercase tracking-wider ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>
                              Análise Concluída: {selectedHistoricalEdital === 'prf_2021' ? 'CEBRASPE PRF Polícia Rodoviária' : selectedHistoricalEdital === 'pf_2021' ? 'CEBRASPE Polícia Federal' : 'Athena Preditivo PRF 2026'}
                            </h3>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-[10px] font-mono block ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Confiança Operacional</span>
                            <span className={`text-xs font-mono font-bold uppercase px-2 py-1 border rounded ${theme === 'light' ? 'text-slate-700 bg-slate-100 border-slate-200' : 'text-white bg-[#070a13] border-[#182030]'}`}>99.4% Estável</span>
                          </div>
                        </div>

                        {/* Extracted Stats grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { label: 'Atribuição', value: 'Policial', color: theme === 'light' ? 'text-slate-800' : 'text-white' },
                            { label: 'Subsídio Oficial', value: 'R$ 9.899,88', color: 'text-indigo-500' },
                            { label: 'Regime Provas', value: 'Certo / Errado', color: 'text-emerald-600' },
                            { label: 'Taxa de Erro', value: '-1.00 Ponto', color: 'text-red-500' },
                          ].map(s => (
                            <div key={s.label} className={`p-2.5 rounded-xl text-left font-mono border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#070a13] border-[#182030]'}`}>
                              <span className={`text-[9px] uppercase block ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>{s.label}</span>
                              <span className={`text-xs font-bold block mt-0.5 ${s.color}`}>{s.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Block weightings */}
                        <div className="space-y-2">
                          <span className={`text-[10px] font-mono uppercase font-black block ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>Distribuição e Peso dos Blocos do Edital</span>
                          <div className="space-y-1.5">
                            {[
                              { label: 'Bloco I — Matérias Básicas (Física, Português, RLM)', count: 55, pct: '45.8%', color: 'from-violet-600 to-indigo-600' },
                              { label: 'Bloco II — Legislação de Trânsito (CTB e Resoluções)', count: 30, pct: '25.0%', color: 'from-indigo-500 to-indigo-600' },
                              { label: 'Bloco III — Ciências Jurídicas (Direitos, Administrativo)', count: 35, pct: '29.2%', color: 'from-emerald-500 to-teal-500' }
                            ].map((blk, bIdx) => (
                              <div key={bIdx} className="space-y-1">
                                <div className={`flex justify-between text-[10px] font-mono ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                                  <span>{blk.label}</span>
                                  <span className={`font-extrabold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{blk.count} Itens • {blk.pct}</span>
                                </div>
                                <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'light' ? 'bg-slate-200' : 'bg-[#070a13]'}`}>
                                  <div className={`bg-gradient-to-r ${blk.color} h-full rounded-full`} style={{ width: blk.pct }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Critical recurrence cards — tema-aware */}
                        <div className="space-y-2 pt-1">
                          <span className={`text-[10px] font-mono uppercase font-black block ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>Análise de Tendência e Priorização (Athena AI)</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                              { icon: <AlertTriangle className="w-4 h-4 shrink-0" />, iconCls: 'text-red-500', lightBg: 'bg-red-50 border-red-200', darkBg: 'bg-[#070a13]/85 border-[#182030]', title: 'Física: Dinâmica e Colisões', text: 'O edital cita Cinemática e Leis de Newton. A IA identificou Alta Recorrência em colisões de trânsito (energia cinética). Alta Prioridade de estudo.' },
                              { icon: <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />, iconCls: 'text-indigo-500', lightBg: 'bg-indigo-50 border-indigo-200', darkBg: 'bg-[#070a13]/85 border-[#182030]', title: 'Trânsito: Resoluções Licença', text: 'Dominância em resoluções CONTRAN (432 Lei Seca, 789 LADV, 960 películas). Tendência Crescente de 25% de peso no bloco geral.' },
                              { icon: <CheckCircle2 className="w-4 h-4 shrink-0" />, iconCls: 'text-emerald-600', lightBg: 'bg-emerald-50 border-emerald-200', darkBg: 'bg-[#070a13]/85 border-[#182030]', title: 'Constitucional: Arts. 5º e 144', text: 'Matéria em 100% de estabilidade nos últimos 5 concursos. Art. 144 descreve diretamente as funções da PRF.' },
                              { icon: <AlertTriangle className="w-4 h-4 shrink-0" />, iconCls: 'text-amber-600', lightBg: 'bg-amber-50 border-amber-200', darkBg: 'bg-[#070a13]/85 border-[#182030]', title: 'Direitos Humanos em Queda', text: 'Peso de Direitos Humanos reduziu 33% comparado com editais anteriores. Baixa Prioridade recomendada pela IA.' },
                            ].map((c, i) => (
                              <div key={i} className={`p-3 rounded-xl space-y-1.5 shadow-sm border ${theme === 'light' ? c.lightBg : c.darkBg}`}>
                                <div className={`flex items-center gap-1.5 font-bold ${c.iconCls}`}>
                                  {c.icon}
                                  <span className="text-[10px] font-mono uppercase font-black">{c.title}</span>
                                </div>
                                <p className={`text-[10.5px] leading-normal ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>{c.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interactive recalibrate */}
                        <div className={`pt-3 border-t space-y-2.5 ${theme === 'light' ? 'border-slate-200' : 'border-[#182030]'}`}>
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

              {/* ── VIEW 3: GOOGLE DRIVE IMPORT ──────────────────── */}
              {subTabKnowledge === 'drive' && (
                <div className="space-y-5 max-w-3xl">

                  {/* Header */}
                  <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-2xl shrink-0">📂</div>
                    <div className="flex-1">
                      <h3 className="text-sm font-black text-white">Importar do Google Drive</h3>
                      <p className="text-xs text-slate-400 mt-1">Alimente a Base de Conhecimento da Athena com materiais do seu Drive.</p>
                    </div>
                  </div>

                  {/* Toggle Arquivo / Pasta */}
                  <div className="flex gap-1 bg-[#070a13] border border-[#182030] p-1 rounded-xl w-fit">
                    {[
                      { id: 'file',   label: '📄 Arquivo único',    desc: 'Você escolhe a disciplina' },
                      { id: 'folder', label: '📁 Pasta completa',   desc: 'Gemini categoriza automaticamente' },
                    ].map(m => (
                      <button key={m.id} onClick={() => { setDriveMode(m.id as any); setDriveAdminUrl(''); setDriveAdminResult(null); setDriveAdminError(''); setDriveFolderResults([]); setDriveFolderError(''); }}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all cursor-pointer ${driveMode === m.id ? 'bg-green-600/20 border border-green-500/30 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                        <p className="text-xs font-black">{m.label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{m.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Requisito compartilhamento */}
                  <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3 text-xs flex items-start gap-2">
                    <span className="text-green-400 shrink-0 mt-0.5">ℹ</span>
                    <p className="text-slate-400">
                      <b className="text-green-400">Requisito:</b> {driveMode === 'file' ? 'Arquivo' : 'Pasta e todos os arquivos'} devem estar compartilhados como <b className="text-white">"Qualquer pessoa com o link"</b>.
                      {driveMode === 'folder' && <span className="text-slate-500"> · Gemini 2.0 Flash classifica cada arquivo automaticamente · PDFs serão pulados</span>}
                    </p>
                  </div>

                  {/* ── MODO: ARQUIVO ÚNICO ─────────────────────── */}
                  {driveMode === 'file' && (
                    <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4">
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 font-black uppercase tracking-widest block mb-1.5">Link do Arquivo</label>
                        <div className="flex gap-2">
                          <input type="url" value={driveAdminUrl}
                            onChange={e => { setDriveAdminUrl(e.target.value); setDriveAdminError(''); setDriveAdminResult(null); }}
                            placeholder="https://docs.google.com/document/d/..."
                            className="flex-1 bg-[#070a13] border border-[#182030] focus:border-green-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none font-mono"
                          />
                          <button onClick={handleFetchDriveAdmin} disabled={driveAdminLoading || !driveAdminUrl.trim()}
                            className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${driveAdminUrl.trim() && !driveAdminLoading ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-[#070a13] border border-[#182030] text-slate-600 cursor-not-allowed'}`}>
                            {driveAdminLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Buscando...</> : '📥 Buscar'}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 font-black uppercase tracking-widest block mb-1.5">Disciplina de destino</label>
                        <select value={driveAdminDiscipline} onChange={e => setDriveAdminDiscipline(e.target.value)}
                          className="w-full bg-[#070a13] border border-[#182030] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500">
                          {['Legislação de Trânsito (CTB)','Resoluções do CONTRAN','Língua Portuguesa','Raciocínio Lógico-Matemático','Informática','Física','Ética e Cidadania','Geopolítica','Língua Estrangeira (Inglês ou Espanhol)','Direito Administrativo','Direito Constitucional','Direito Penal','Direito Processual Penal','Legislação Especial','Direitos Humanos'].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      {driveAdminError && <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3"><AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><p className="text-xs text-red-400">{driveAdminError}</p></div>}
                      {driveAdminResult && (
                        <div className="bg-[#070a13] border border-green-500/20 rounded-xl p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div><p className="text-sm font-bold text-white">📄 {driveAdminResult.fileName}</p><p className="text-[10px] font-mono text-slate-500 mt-0.5">{driveAdminResult.charCount.toLocaleString()} caracteres · <b className="text-green-400">{driveAdminDiscipline}</b></p></div>
                            <span className="text-[9px] font-mono font-bold bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-lg shrink-0">✓ Pronto</span>
                          </div>
                          <div className="bg-[#0a0d1a] rounded-lg p-3 text-[10px] font-mono text-slate-400 max-h-24 overflow-y-auto">{driveAdminResult.textContent.slice(0, 400)}{driveAdminResult.textContent.length > 400 && '...'}</div>
                          <div className="flex gap-3">
                            <button onClick={() => { setDriveAdminResult(null); setDriveAdminUrl(''); }} className="flex-1 py-2.5 border border-[#182030] text-slate-400 rounded-xl text-xs font-bold cursor-pointer hover:text-white transition-all">Cancelar</button>
                            <button onClick={handleImportDriveAdmin} className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-black cursor-pointer shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transition-all"><Check className="w-4 h-4" /> Importar</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── MODO: PASTA COMPLETA ────────────────────── */}
                  {driveMode === 'folder' && (
                    <div className="space-y-4">
                      <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4">
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 font-black uppercase tracking-widest block mb-1.5">Link da Pasta do Drive</label>
                          <div className="flex gap-2">
                            <input type="url" value={driveAdminUrl}
                              onChange={e => { setDriveAdminUrl(e.target.value); setDriveFolderError(''); setDriveFolderResults([]); }}
                              placeholder="https://drive.google.com/drive/folders/..."
                              className="flex-1 bg-[#070a13] border border-[#182030] focus:border-green-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none font-mono"
                            />
                            <button onClick={handleFetchDriveFolder} disabled={driveFolderLoading || !driveAdminUrl.trim()}
                              className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${driveAdminUrl.trim() && !driveFolderLoading ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-[#070a13] border border-[#182030] text-slate-600 cursor-not-allowed'}`}>
                              {driveFolderLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analisando...</> : '🔍 Analisar Pasta'}
                            </button>
                          </div>
                          {driveFolderLoading && (
                            <p className="text-[10px] text-amber-400 font-mono mt-2 flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 animate-pulse" /> Gemini 2.0 Flash classificando os arquivos...
                            </p>
                          )}
                        </div>
                        {driveFolderError && <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3"><AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><p className="text-xs text-red-400">{driveFolderError}</p></div>}
                      </div>

                      {/* Resultados da pasta */}
                      {driveFolderResults.length > 0 && (
                        <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-black text-white">{driveFolderResults.length} arquivos encontrados</h4>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                {driveFolderResults.filter(r => r.selected).length} selecionados · {driveFolderResults.filter(r => !r.supported || !!r.error).length} pulados
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => setDriveFolderResults(prev => prev.map(r => ({ ...r, selected: r.supported && !r.error })))}
                                className="text-[10px] text-slate-400 hover:text-white font-mono cursor-pointer">Todos</button>
                              <span className="text-slate-600">·</span>
                              <button onClick={() => setDriveFolderResults(prev => prev.map(r => ({ ...r, selected: false })))}
                                className="text-[10px] text-slate-400 hover:text-white font-mono cursor-pointer">Nenhum</button>
                            </div>
                          </div>

                          {/* Lista de arquivos */}
                          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                            {driveFolderResults.map((r, i) => (
                              <div key={r.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${r.supported && !r.error ? (r.selected ? 'bg-green-500/5 border-green-500/20' : 'bg-[#070a13] border-[#182030] opacity-60') : 'bg-[#070a13] border-[#182030] opacity-40'}`}>
                                {r.supported && !r.error ? (
                                  <input type="checkbox" checked={r.selected} onChange={e => setDriveFolderResults(prev => prev.map((x, j) => j === i ? { ...x, selected: e.target.checked } : x))}
                                    className="w-4 h-4 accent-green-500 cursor-pointer shrink-0" />
                                ) : (
                                  <span className="text-slate-600 text-sm shrink-0">✕</span>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-white truncate">{r.name}</p>
                                  {r.error ? (
                                    <p className="text-[10px] text-amber-400 font-mono">{r.error}</p>
                                  ) : (
                                    <p className="text-[10px] text-slate-500 font-mono">{r.charCount.toLocaleString()} chars</p>
                                  )}
                                </div>
                                {!r.error && r.supported && (
                                  <div className="shrink-0">
                                    <select value={r.discipline}
                                      onChange={e => setDriveFolderResults(prev => prev.map((x, j) => j === i ? { ...x, discipline: e.target.value } : x))}
                                      className="bg-[#0a0d1a] border border-[#182030] rounded-lg px-2 py-1 text-[10px] text-indigo-300 focus:outline-none font-mono max-w-[180px]">
                                      {['Legislação de Trânsito (CTB)','Resoluções do CONTRAN','Língua Portuguesa','Raciocínio Lógico-Matemático','Informática','Física','Ética e Cidadania','Geopolítica','Língua Estrangeira (Inglês ou Espanhol)','Direito Administrativo','Direito Constitucional','Direito Penal','Direito Processual Penal','Legislação Especial','Direitos Humanos','Geral / Não identificado'].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Botão importar pasta */}
                          <div className="flex gap-3 pt-2 border-t border-[#182030]">
                            <button onClick={() => { setDriveFolderResults([]); setDriveAdminUrl(''); }} className="flex-1 py-2.5 border border-[#182030] text-slate-400 rounded-xl text-xs font-bold cursor-pointer hover:text-white transition-all">Cancelar</button>
                            <button onClick={handleImportDriveFolder}
                              disabled={driveFolderImporting || !driveFolderResults.some(r => r.selected)}
                              className={`flex-1 py-2.5 rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-2 transition-all ${driveFolderResults.some(r => r.selected) && !driveFolderImporting ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-[#070a13] border border-[#182030] text-slate-600 cursor-not-allowed'}`}>
                              {driveFolderImporting ? <><Loader2 className="w-4 h-4 animate-spin" /> Importando...</> : <><Check className="w-4 h-4" /> Importar {driveFolderResults.filter(r => r.selected).length} arquivo(s)</>}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dicas */}
                  <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-4">
                    <p className="text-[10px] font-mono text-slate-500 uppercase font-bold mb-2">Dicas</p>
                    <ul className="space-y-1.5 text-[11px] text-slate-400">
                      <li className="flex items-start gap-2"><span className="text-green-400 shrink-0">→</span> Converta PDFs para Google Docs: Drive → clique direito → Abrir com → Google Docs</li>
                      <li className="flex items-start gap-2"><span className="text-green-400 shrink-0">→</span> A classificação automática usa Gemini 2.0 Flash — você pode ajustar antes de importar</li>
                      <li className="flex items-start gap-2"><span className="text-green-400 shrink-0">→</span> Limite: 50.000 caracteres por arquivo · máximo 50 arquivos por pasta</li>
                    </ul>
                  </div>

                </div>
              )}

              {/* ── VIEW 4: BASE GERAL ───────────────────────────── */}
              {subTabKnowledge === 'geral' && (
                <div className="space-y-5">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-sm font-black text-white">Base Geral de Conhecimento</h3>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Repositório livre · sem disciplina · sem peso · consulta da Athena quando necessário
                      </p>
                    </div>
                    <button
                      onClick={() => setShowNewCategoryModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-400 font-bold rounded-xl text-xs cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" /> Nova Categoria
                    </button>
                  </div>

                  {/* Estado vazio */}
                  {generalCategories.length === 0 && !selectedCategory && (
                    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center bg-[#0f1524] border border-[#182030] rounded-2xl">
                      <span className="text-4xl">📖</span>
                      <div>
                        <p className="text-white font-bold">Base Geral vazia</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">
                          Crie categorias para organizar seus materiais — apostilas, livros, legislação extra, qualquer coisa.
                        </p>
                      </div>
                      <button onClick={() => setShowNewCategoryModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold rounded-xl text-sm cursor-pointer hover:bg-amber-500/20 transition-all">
                        <Plus className="w-4 h-4" /> Criar primeira categoria
                      </button>
                    </div>
                  )}

                  {/* Grid de categorias (quando nenhuma selecionada) */}
                  {generalCategories.length > 0 && !selectedCategory && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {generalCategories.map(cat => {
                        const colorMap: Record<string, string> = {
                          indigo: 'border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10',
                          amber:  'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10',
                          emerald:'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10',
                          violet: 'border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10',
                          red:    'border-red-500/30 bg-red-500/5 hover:bg-red-500/10',
                          sky:    'border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/10',
                        };
                        const textMap: Record<string, string> = {
                          indigo: 'text-indigo-400', amber: 'text-amber-400', emerald: 'text-emerald-400',
                          violet: 'text-violet-400', red: 'text-red-400', sky: 'text-sky-400',
                        };
                        return (
                          <div key={cat.id} className={`bg-[#0f1524] border rounded-2xl p-5 cursor-pointer transition-all group ${colorMap[cat.color] || colorMap.indigo}`}
                            onClick={() => setSelectedCategory(cat.id)}>
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-3xl">{cat.icon}</span>
                              <button
                                onClick={e => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                                className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all cursor-pointer p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <h4 className={`text-sm font-black ${textMap[cat.color] || textMap.indigo}`}>{cat.name}</h4>
                            <p className="text-[10px] text-slate-500 mt-1 font-mono">
                              {cat.materials.length} {cat.materials.length === 1 ? 'material' : 'materiais'}
                            </p>
                            <div className="mt-3 pt-3 border-t border-white/[0.04] text-[10px] text-slate-600 font-mono">
                              Clique para abrir →
                            </div>
                          </div>
                        );
                      })}

                      {/* Card nova categoria */}
                      <button onClick={() => setShowNewCategoryModal(true)}
                        className="bg-[#0f1524] border-2 border-dashed border-[#182030] hover:border-amber-500/30 hover:bg-amber-500/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group min-h-[140px]">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 transition-all">
                          <Plus className="w-5 h-5 text-amber-400" />
                        </div>
                        <p className="text-xs font-bold text-amber-400 group-hover:text-amber-300">Nova Categoria</p>
                      </button>
                    </div>
                  )}

                  {/* Vista interna de uma categoria */}
                  {selectedCategory && (() => {
                    const cat = generalCategories.find(c => c.id === selectedCategory);
                    if (!cat) return null;
                    const textMap: Record<string, string> = {
                      indigo: 'text-indigo-400', amber: 'text-amber-400', emerald: 'text-emerald-400',
                      violet: 'text-violet-400', red: 'text-red-400', sky: 'text-sky-400',
                    };
                    return (
                      <div className="space-y-4">
                        {/* Breadcrumb + ações */}
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setSelectedCategory(null)}
                              className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer flex items-center gap-1 transition-colors">
                              ← Base Geral
                            </button>
                            <span className="text-slate-600">/</span>
                            <span className={`text-sm font-black flex items-center gap-1.5 ${textMap[cat.color] || textMap.indigo}`}>
                              {cat.icon} {cat.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">({cat.materials.length} materiais)</span>
                          </div>
                          <button onClick={() => setShowAddGeneralMaterial(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#0f1524] border border-[#182030] hover:border-amber-500/30 text-amber-400 font-bold rounded-xl text-xs cursor-pointer transition-all">
                            <Plus className="w-3.5 h-3.5" /> Adicionar Material
                          </button>
                        </div>

                        {/* Lista de materiais */}
                        {cat.materials.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 gap-3 bg-[#0f1524] border border-[#182030] rounded-2xl text-center">
                            <span className="text-3xl opacity-50">{cat.icon}</span>
                            <p className="text-slate-400 text-sm">Nenhum material ainda</p>
                            <button onClick={() => setShowAddGeneralMaterial(true)}
                              className="text-amber-400 text-xs font-bold cursor-pointer hover:text-amber-300">
                              + Adicionar primeiro material
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {cat.materials.map(mat => (
                              <div key={mat.id} className="bg-[#0f1524] border border-[#182030] hover:border-white/[0.1] rounded-xl p-4 flex items-start gap-3 group transition-all">
                                <span className="text-lg shrink-0 mt-0.5">
                                  {mat.type === 'link' ? '🔗' : '📝'}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-white">{mat.title}</p>
                                  {mat.content && (() => {
                                    try {
                                      const parsed = JSON.parse(mat.content);
                                      if (parsed._fileRef) return (
                                        <p className="text-[11px] text-slate-500 mt-1 font-mono">
                                          {parsed.label} · {parsed.size}
                                        </p>
                                      );
                                    } catch {}
                                    return (
                                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                        {mat.type === 'link'
                                          ? <a href={mat.content} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">{mat.content}</a>
                                          : mat.content}
                                      </p>
                                    );
                                  })()}
                                  <p className="text-[10px] text-slate-600 font-mono mt-1.5">{mat.addedAt}</p>
                                </div>
                                <button
                                  onClick={() => handleDeleteGeneralMaterial(cat.id, mat.id)}
                                  className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all cursor-pointer p-1 shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
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
                  <Upload className="w-6 h-6 animate-pulse text-indigo-400" />
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

                  {/* Paginação */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2">
                    <span>{filteredQuestions.length} questões encontradas</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQPage(p => Math.max(0, p-1))} disabled={qPage === 0}
                        className="px-2 py-1 bg-[#070a13] border border-[#182030] rounded disabled:opacity-40 hover:text-white cursor-pointer">‹</button>
                      <span>Pág {qPage+1} de {Math.max(1, Math.ceil(filteredQuestions.length/Q_PER_PAGE))}</span>
                      <button onClick={() => setQPage(p => Math.min(Math.ceil(filteredQuestions.length/Q_PER_PAGE)-1, p+1))} disabled={(qPage+1)*Q_PER_PAGE >= filteredQuestions.length}
                        className="px-2 py-1 bg-[#070a13] border border-[#182030] rounded disabled:opacity-40 hover:text-white cursor-pointer">›</button>
                    </div>
                  </div>

                  <div className="space-y-3 pr-1">
                    {filteredQuestions.slice(qPage*Q_PER_PAGE, (qPage+1)*Q_PER_PAGE).map((q) => (
                      <div key={q.id} className="bg-[#070a13] border border-[#182030] hover:border-slate-700 rounded-xl p-4 space-y-2.5 transition-all">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-mono font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">{q.discipline}</span>
                            <span className="text-[9px] text-slate-500 font-mono">{q.subtopic}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                              (q as any).difficulty === 'Fácil' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                              (q as any).difficulty === 'Difícil' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                              'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            }`}>{(q as any).difficulty || 'Média'}</span>
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${q.answer === 'C' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                              {q.answer === 'C' ? 'Certo' : 'Errado'}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 select-text">{q.statement}</p>
                        <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04]">
                          <button onClick={() => handleStartEditQuestion(q)}
                            className="flex items-center gap-1 text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">
                            <Edit2 className="w-3 h-3" /> Editar
                          </button>
                          <span className="text-slate-700">·</span>
                          <button onClick={() => handleDeleteQuestion(q.id)}
                            className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-500 hover:text-red-400 cursor-pointer transition-colors">
                            <Trash2 className="w-3 h-3" /> Excluir
                          </button>
                        </div>
                      </div>
                    ))}

                    {filteredQuestions.length === 0 && (
                      <p className="p-8 text-center text-slate-600 italic text-xs">Nenhuma questão encontrada.</p>
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
            <div className="space-y-6 animate-fade-in">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500">Negócio</p>
                  <h1 className="text-xl font-black text-white tracking-tight mt-1">Planos de Assinatura</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Edite nome, preço, trial e benefícios de cada plano.</p>
                </div>
              </div>

              {/* Cards de planos editáveis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {planData.map(plan => {
                  const isEditing = editingPlan === plan.id;
                  const accentCls = plan.id === 'premium' ? 'border-amber-500/40' : plan.id === 'essencial' ? 'border-indigo-500/30' : 'border-white/[0.06]';
                  return (
                    <div key={plan.id} className={`bg-[#0f1524] border rounded-2xl p-5 space-y-4 ${accentCls}`}>
                      {/* Header do plano */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {isEditing ? (
                            <input value={editPlanName} onChange={e => setEditPlanName(e.target.value)}
                              className="bg-[#070a13] border border-[#182030] rounded-lg px-3 py-1.5 text-sm font-black text-white w-full focus:outline-none focus:border-indigo-500" />
                          ) : (
                            <h3 className="text-sm font-black text-white">{plan.name}</h3>
                          )}
                        </div>
                        <button onClick={() => {
                          if (isEditing) {
                            setPlanData(prev => prev.map(p => p.id === plan.id ? {
                              ...p, name: editPlanName,
                              price: parseFloat(editPlanPrice) || p.price,
                              trial: editPlanTrial, trialDays: editPlanTrialDays,
                              features: editPlanFeatures.split('\n').map(f => f.trim()).filter(Boolean),
                            } : p));
                            setEditingPlan(null);
                            showToastMsg(`Plano "${editPlanName}" salvo!`);
                            playSuccessSound();
                          } else {
                            setEditingPlan(plan.id);
                            setEditPlanName(plan.name);
                            setEditPlanPrice(plan.price.toString());
                            setEditPlanTrial(plan.trial);
                            setEditPlanTrialDays(plan.trialDays);
                            setEditPlanFeatures(plan.features.join('\n'));
                          }
                        }}
                          className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                            isEditing ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white'
                          }`}>
                          {isEditing ? <><Check className="w-3 h-3" /> Salvar</> : <><Edit2 className="w-3 h-3" /> Editar</>}
                        </button>
                      </div>

                      {/* Preço */}
                      <div>
                        <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Preço</p>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-sm">R$</span>
                            <input type="number" value={editPlanPrice} onChange={e => setEditPlanPrice(e.target.value)}
                              className="bg-[#070a13] border border-[#182030] rounded-lg px-3 py-1.5 text-sm font-black text-white w-full focus:outline-none focus:border-indigo-500"
                              min="0" step="0.01" />
                            <span className="text-slate-500 text-xs whitespace-nowrap">/mês</span>
                          </div>
                        ) : (
                          <p className="text-2xl font-black text-white font-mono">
                            {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}`}
                            {plan.price > 0 && <span className="text-sm text-slate-500 font-normal">/mês</span>}
                          </p>
                        )}
                      </div>

                      {/* Trial */}
                      {isEditing && (
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={editPlanTrial} onChange={e => setEditPlanTrial(e.target.checked)}
                              className="w-4 h-4 rounded accent-indigo-500" />
                            <span className="text-xs text-slate-300">Período trial grátis</span>
                          </label>
                          {editPlanTrial && (
                            <div className="flex items-center gap-1.5">
                              <input type="number" value={editPlanTrialDays} onChange={e => setEditPlanTrialDays(+e.target.value)}
                                className="bg-[#070a13] border border-[#182030] rounded px-2 py-1 text-xs text-white w-12 text-center focus:outline-none" min="1" />
                              <span className="text-[10px] text-slate-500">dias</span>
                            </div>
                          )}
                        </div>
                      )}
                      {!isEditing && plan.trial && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg inline-block">
                          ✓ {plan.trialDays} dias grátis
                        </span>
                      )}

                      {/* Benefícios */}
                      <div>
                        <p className="text-[10px] font-mono text-slate-500 uppercase mb-2">Benefícios</p>
                        {isEditing ? (
                          <textarea value={editPlanFeatures} onChange={e => setEditPlanFeatures(e.target.value)} rows={5}
                            className="w-full bg-[#070a13] border border-[#182030] rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-mono"
                            placeholder="Um benefício por linha..." />
                        ) : (
                          <ul className="space-y-1.5">
                            {plan.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                <span className={`mt-0.5 shrink-0 ${plan.id === 'premium' ? 'text-amber-400' : 'text-emerald-400'}`}>✓</span>
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {isEditing && (
                        <button onClick={() => setEditingPlan(null)}
                          className="w-full py-2 border border-white/[0.06] text-slate-400 rounded-xl text-xs font-semibold cursor-pointer hover:text-white transition-all">
                          Cancelar
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Visão de assinaturas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
                  <h3 className="text-sm font-black text-white mb-4">Distribuição Atual</h3>
                  <div className="space-y-3">
                    {[
                      { level: 'Athena Supreme',  count: 146,  revenue: 14162 },
                      { level: 'Essencial PRF',   count: 362,  revenue: 18063 },
                      { level: 'Gratuito',        count: 1016, revenue: 0 }
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-3 bg-[#070a13] border border-[#182030] rounded-xl">
                        <span className="font-bold text-slate-200">{p.level}</span>
                        <div className="flex items-center gap-4 text-[10px] font-mono">
                          <span className="text-slate-500">{p.count} alunos</span>
                          <span className="text-emerald-400 font-bold">{p.revenue > 0 ? `R$ ${p.revenue.toLocaleString('pt-BR')}` : '—'}/mês</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-black text-white">Simulador de Conversão</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#070a13] border border-[#182030] p-3 rounded-xl">
                      <p className="text-[10px] font-mono text-slate-500 uppercase">Meta conversão</p>
                      <p className="text-xl font-black text-white font-mono">15%</p>
                      <p className="text-[9px] text-slate-600">das 1.016 contas grátis</p>
                    </div>
                    <div className="bg-[#070a13] border border-[#182030] p-3 rounded-xl">
                      <p className="text-[10px] font-mono text-slate-500 uppercase">Receita adicional</p>
                      <p className="text-xl font-black text-emerald-400 font-mono">+R$ 14,5k</p>
                      <p className="text-[9px] text-slate-600">+152 Athena Supreme</p>
                    </div>
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
                    {/* Google Drive API Key */}
                    <div className="mb-4 pb-4 border-b border-[#182030]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">📂</span>
                        <span className="text-xs font-mono text-green-400 font-extrabold uppercase tracking-wider">Google Drive API Key</span>
                      </div>
                      <input
                        type="password"
                        defaultValue={localStorage.getItem('provax_google_api_key') || 'AIzaSyCflyHQfNnXdt5TsXmN_nR0FBm8meEmk-M'}
                        onChange={e => localStorage.setItem('provax_google_api_key', e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full bg-[#0f1524] border border-[#182030] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-green-500 font-mono"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Permite importar arquivos do Google Drive na Biblioteca.{' '}
                        <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-green-400 hover:underline">Google Cloud Console</a>
                      </p>
                    </div>

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

                  {/* IA movida para a aba Athena AI — ver sidebar */}
                  <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-xl col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-violet-400 shrink-0" />
                      <div>
                        <p className="text-sm font-black text-white">Configurações da Athena AI</p>
                        <p className="text-xs text-slate-400 mt-0.5">Modelos, chaves de API, comportamento e monitoramento de créditos estão na aba <b className="text-violet-400">Athena AI</b> no menu lateral.</p>
                      </div>
                      <button onClick={() => handleTabChange('athena' as any)}
                        className="ml-auto shrink-0 px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-bold rounded-lg cursor-pointer hover:bg-violet-600/30 transition-all">
                        Ir para Athena AI →
                      </button>
                    </div>
                  </div>

                  {/* PLACEHOLDER — IA removida desta seção */}
                  <div className="hidden bg-[#070a13] border border-[#182030] p-5 rounded-xl space-y-4 col-span-1 md:col-span-2 relative overflow-hidden">
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

                    {/* ── Alerta de novos modelos ── */}
                    {newModelsAlert.length > 0 && (
                      <div className="border border-amber-500/30 bg-amber-500/5 rounded-2xl p-4 flex items-start gap-3">
                        <span className="text-xl shrink-0">🆕</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-amber-400">Novos modelos disponíveis!</p>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                            {newModelsAlert.join(', ')} — pode haver opções mais rápidas ou inteligentes para sua configuração atual.
                          </p>
                        </div>
                        <button
                          onClick={() => { localStorage.setItem('provax_known_model_ids', JSON.stringify(['claude-haiku-3-5','claude-sonnet-4-5','claude-sonnet-4','claude-opus-4-5','claude-opus-4','gpt-4o-mini','gpt-4o','gpt-4-turbo','o1-mini','o3-mini'])); setNewModelsAlert([]); }}
                          className="text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 cursor-pointer shrink-0 border border-amber-500/20 px-2 py-1 rounded-lg"
                        >
                          Dispensar
                        </button>
                      </div>
                    )}

                    {/* ── Seleção de Provedor ── */}
                    <div className="border-t border-[#182030]/40 pt-5 space-y-5">
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 font-black uppercase tracking-widest block mb-2">Provedor de IA Principal</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'anthropic', label: 'Claude',  desc: 'Melhor para jurídico',  icon: '🤖', color: 'border-indigo-500 bg-indigo-600/15 text-white' },
                            { id: 'openai',    label: 'GPT',     desc: 'Amplamente testado',     icon: '⚡', color: 'border-green-500 bg-green-600/15 text-white' },
                            { id: 'google',    label: 'Gemini',  desc: 'Contexto 1M · Barato',  icon: '💎', color: 'border-blue-500 bg-blue-600/15 text-white' },
                          ].map(p => (
                            <button key={p.id} onClick={() => setActiveProvider(p.id as any)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${activeProvider === p.id ? p.color : 'bg-[#070a13] border-[#182030] text-slate-400 hover:border-slate-600'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-base">{p.icon}</span>
                                <span className="text-xs font-black">{p.label}</span>
                              </div>
                              <p className="text-[10px] text-slate-500">{p.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                    {/* ── Config do provedor ativo ── */}
                    <div className="space-y-5">

                      {/* Chave da API — dinâmica por provedor */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-mono text-slate-400 font-black uppercase tracking-widest">
                            {activeProvider === 'anthropic' ? 'Anthropic API Key' : 'OpenAI API Key'}
                          </label>
                          <div className="flex items-center gap-2">
                            {(activeProvider === 'anthropic' ? anthropicApiKey : activeProvider === 'openai' ? openaiApiKey : geminiApiKeyNew) && (
                              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" /> Configurada
                              </span>
                            )}
                            <button onClick={() => setApiKeyVisible(v => !v)} className="text-[10px] text-slate-500 hover:text-white font-mono cursor-pointer">
                              {apiKeyVisible ? 'Ocultar' : 'Mostrar'}
                            </button>
                          </div>
                        </div>
                        <input
                          type={apiKeyVisible ? 'text' : 'password'}
                          value={activeProvider === 'anthropic' ? anthropicApiKey : activeProvider === 'openai' ? openaiApiKey : geminiApiKeyNew}
                          onChange={e => activeProvider === 'anthropic' ? setAnthropicApiKey(e.target.value) : activeProvider === 'openai' ? setOpenaiApiKey(e.target.value) : setGeminiApiKeyNew(e.target.value)}
                          placeholder={activeProvider === 'anthropic' ? 'sk-ant-api03-...' : activeProvider === 'openai' ? 'sk-proj-...' : 'AIzaSy...'}
                          className="w-full bg-[#0f1524] border border-[#182030] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
                        />
                        <p className="text-[10px] text-slate-500">
                          {activeProvider === 'anthropic'
                            ? <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">console.anthropic.com</a>
                            : activeProvider === 'openai'
                            ? <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-green-400 hover:underline">platform.openai.com/api-keys</a>
                            : <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">aistudio.google.com/app/apikey</a>
                          }
                        </p>
                      </div>

                      {/* Modelos por função */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-mono text-slate-400 font-black uppercase tracking-widest">Modelo por Função</p>
                        <div className="bg-[#070a13] border border-[#182030] rounded-2xl overflow-hidden">
                          {(activeProvider === 'anthropic' ? [
                            { label: '💬 Chat diário (Athena)',       state: claudeChatModel,      set: setChatModel,      rec: 'claude-haiku-3-5'   },
                            { label: '❓ Geração de questões',         state: claudeQuestionsModel, set: setQuestionsModel, rec: 'claude-sonnet-4-5'  },
                            { label: '📄 Análise de material/edital', state: claudeAnalyzeModel,   set: setAnalyzeModel,   rec: 'claude-sonnet-4-5'  },
                            { label: '📅 Geração de cronograma',      state: claudeScheduleModel,  set: setScheduleModel,  rec: 'claude-haiku-3-5'   },
                          ] : activeProvider === 'openai' ? [
                            { label: '💬 Chat diário (Athena)',       state: gptChatModel,      set: setGptChatModel,      rec: 'gpt-4o-mini'    },
                            { label: '❓ Geração de questões',         state: gptQuestionsModel, set: setGptQuestionsModel, rec: 'gpt-4o'         },
                            { label: '📄 Análise de material/edital', state: gptAnalyzeModel,   set: setGptAnalyzeModel,   rec: 'gpt-4o'         },
                            { label: '📅 Geração de cronograma',      state: gptScheduleModel,  set: setGptScheduleModel,  rec: 'gpt-4o-mini'    },
                          ] : [
                            { label: '💬 Chat diário (Athena)',       state: geminiChatModel,      set: setGeminiChatModel,      rec: 'gemini-2.0-flash' },
                            { label: '❓ Geração de questões',         state: geminiQuestionsModel, set: setGeminiQuestionsModel, rec: 'gemini-2.5-flash' },
                            { label: '📄 Análise de material/edital', state: geminiAnalyzeModel,   set: setGeminiAnalyzeModel,   rec: 'gemini-2.5-pro'   },
                            { label: '📅 Geração de cronograma',      state: geminiScheduleModel,  set: setGeminiScheduleModel,  rec: 'gemini-2.0-flash' },
                          ]).map((row, i) => (
                            <div key={i} className={`flex items-center justify-between gap-4 px-4 py-3 ${i > 0 ? 'border-t border-[#182030]' : ''}`}>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-300">{row.label}</p>
                                <p className="text-[9px] text-slate-600 font-mono">recomendado: {row.rec}</p>
                              </div>
                              <select value={row.state} onChange={e => row.set(e.target.value)}
                                className="bg-[#0f1524] border border-[#182030] rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-indigo-500 font-mono shrink-0">
                                {(activeProvider === 'anthropic' ? CLAUDE_MODELS_LIST : activeProvider === 'openai' ? GPT_MODELS_LIST : GEMINI_MODELS_LIST).map(m => (
                                  <option key={m.id} value={m.id}>{m.label}{(m as any).isNew ? ' 🆕' : ''}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>

                        {/* Guia de modelos com créditos */}
                        <div className="bg-[#070a13] border border-[#182030] rounded-xl overflow-hidden">
                          {/* Header */}
                          <div className="grid grid-cols-12 px-4 py-2 border-b border-[#182030] text-[9px] font-mono font-bold uppercase text-slate-600">
                            <span className="col-span-4">Modelo</span>
                            <span className="col-span-2 text-center">Base</span>
                            <span className="col-span-2 text-center">Mult.</span>
                            <span className="col-span-2 text-center">Total</span>
                            <span className="col-span-2 text-right">Est. mês</span>
                          </div>
                          {/* Rows */}
                          {(activeProvider === 'anthropic' ? CLAUDE_MODELS_LIST : activeProvider === 'openai' ? GPT_MODELS_LIST : GEMINI_MODELS_LIST).map((m, i) => {
                            // Buscar créditos do registro global
                            const creditMap: Record<string, { base: number; multiplier: number; total: number; perMonth: string }> = {
                              'claude-haiku-3-5':  { base: 1, multiplier: 1,  total: 1,  perMonth: '~R$ 50–150'    },
                              'claude-sonnet-4-5': { base: 1, multiplier: 5,  total: 5,  perMonth: '~R$ 100–250'   },
                              'claude-sonnet-4':   { base: 1, multiplier: 8,  total: 8,  perMonth: '~R$ 150–350'   },
                              'claude-opus-4-5':   { base: 1, multiplier: 25, total: 25, perMonth: '~R$ 400–800'   },
                              'claude-opus-4':     { base: 1, multiplier: 40, total: 40, perMonth: '~R$ 600–1.200' },
                              'gemini-2.0-flash':  { base: 1, multiplier: 1,  total: 1,  perMonth: '~R$ 30–80'     },
                              'gemini-2.5-flash':  { base: 1, multiplier: 3,  total: 3,  perMonth: '~R$ 60–150'    },
                              'gemini-2.5-pro':    { base: 1, multiplier: 10, total: 10, perMonth: '~R$ 150–300'   },
                              'gemini-1.5-flash':  { base: 1, multiplier: 1,  total: 1,  perMonth: '~R$ 20–60'     },
                              'gemini-1.5-pro':    { base: 1, multiplier: 7,  total: 7,  perMonth: '~R$ 120–250'   },
                              'gpt-4o-mini':       { base: 1, multiplier: 1,  total: 1,  perMonth: '~R$ 40–100'    },
                              'gpt-4o':            { base: 1, multiplier: 5,  total: 5,  perMonth: '~R$ 100–250'   },
                              'gpt-4-turbo':       { base: 1, multiplier: 10, total: 10, perMonth: '~R$ 180–400'   },
                              'o1-mini':           { base: 1, multiplier: 15, total: 15, perMonth: '~R$ 250–500'   },
                              'o3-mini':           { base: 1, multiplier: 20, total: 20, perMonth: '~R$ 350–700'   },
                            };
                            const c = creditMap[m.id] || { base: 1, multiplier: 1, total: 1, perMonth: '—' };
                            const totalColor = c.total <= 3 ? 'text-emerald-400' : c.total <= 10 ? 'text-amber-400' : 'text-red-400';
                            return (
                              <div key={m.id} className={`grid grid-cols-12 px-4 py-2.5 text-[10px] font-mono items-center ${i > 0 ? 'border-t border-[#182030]' : ''}`}>
                                <div className="col-span-4 flex items-center gap-1.5">
                                  <span className="text-slate-300 truncate">{m.label}</span>
                                  {(m as any).isNew && <span className="text-[7px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1 rounded font-black shrink-0">NEW</span>}
                                </div>
                                <span className="col-span-2 text-center text-slate-500">{c.base} crédito</span>
                                <span className="col-span-2 text-center text-slate-400">x{c.multiplier}</span>
                                <span className={`col-span-2 text-center font-black ${totalColor}`}>{c.total} crédito{c.total > 1 ? 's' : ''}</span>
                                <span className="col-span-2 text-right text-slate-500 text-[9px]">{c.perMonth}</span>
                              </div>
                            );
                          })}
                          {/* Legenda */}
                          <div className="px-4 py-2 border-t border-[#182030] bg-[#0a0d16]">
                            <p className="text-[9px] text-slate-600 font-mono">1 crédito ≈ R$ 0,01 · estimativa para 500 alunos ativos com uso moderado (chat + questões)</p>
                          </div>
                        </div>
                      </div>

                      {/* Status e salvar */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#182030]/50">
                        <div className="flex gap-1.5 text-[10px] font-mono items-center">
                          {(() => {
                            const key = activeProvider === 'anthropic' ? anthropicApiKey : activeProvider === 'openai' ? openaiApiKey : geminiApiKeyNew;
                            const name = activeProvider === 'anthropic' ? 'Claude' : activeProvider === 'openai' ? 'GPT' : 'Gemini';
                            return (<>
                              <span className={`w-2 h-2 rounded-full ${key ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                              <span className={key ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                                {key ? `${name} Ativo` : 'Aguardando chave API'}
                              </span>
                            </>);
                          })()}
                        </div>
                        <div className="flex items-center gap-2">
                          {aiConfigSavedToast && <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Salvo!</span>}
                          <button type="button" disabled={isSavingAIConfig}
                            onClick={() => {
                              playClickSound(); setIsSavingAIConfig(true);
                              setTimeout(() => {
                                const providerName = activeProvider === 'anthropic' ? 'Claude' : activeProvider === 'openai' ? 'GPT' : 'Gemini';
                                localStorage.setItem('athena_ai_provider',          activeProvider);
                                localStorage.setItem('athena_anthropic_api_key',    anthropicApiKey);
                                localStorage.setItem('athena_openai_api_key',       openaiApiKey);
                                localStorage.setItem('athena_gemini_api_key_v2',    geminiApiKeyNew);
                                localStorage.setItem('athena_claude_chat_model',      claudeChatModel);
                                localStorage.setItem('athena_claude_questions_model', claudeQuestionsModel);
                                localStorage.setItem('athena_claude_analyze_model',   claudeAnalyzeModel);
                                localStorage.setItem('athena_claude_schedule_model',  claudeScheduleModel);
                                localStorage.setItem('athena_gpt_chat_model',      gptChatModel);
                                localStorage.setItem('athena_gpt_questions_model', gptQuestionsModel);
                                localStorage.setItem('athena_gpt_analyze_model',   gptAnalyzeModel);
                                localStorage.setItem('athena_gpt_schedule_model',  gptScheduleModel);
                                localStorage.setItem('athena_gemini_chat_model',      geminiChatModel);
                                localStorage.setItem('athena_gemini_questions_model', geminiQuestionsModel);
                                localStorage.setItem('athena_gemini_analyze_model',   geminiAnalyzeModel);
                                localStorage.setItem('athena_gemini_schedule_model',  geminiScheduleModel);
                                localStorage.setItem('athena_ai_name',       aiName);
                                localStorage.setItem('athena_ai_tone',       aiTone);
                                localStorage.setItem('athena_ai_strictness', aiStrictness);
                                localStorage.setItem('athena_ai_custom_instruction', aiCustomInstruction);
                                localStorage.setItem('provax_known_model_ids', JSON.stringify(['claude-haiku-3-5','claude-sonnet-4-5','claude-sonnet-4','claude-opus-4-5','claude-opus-4','gpt-4o-mini','gpt-4o','gpt-4-turbo','o1-mini','o3-mini','gemini-2.0-flash','gemini-2.5-flash','gemini-2.5-pro','gemini-1.5-flash','gemini-1.5-pro']));
                                setNewModelsAlert([]);
                                playSuccessSound(); setIsSavingAIConfig(false); setAiConfigSavedToast(true);
                                showToastMsg(`Configuração ${providerName} salva com sucesso!`);
                                setTimeout(() => setAiConfigSavedToast(false), 3000);
                              }, 800);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all">
                            {isSavingAIConfig ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Salvando...</> : <><Check className="w-3.5 h-3.5" /> Salvar Configuração</>}
                          </button>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════
               ABA: ATHENA AI — Central unificada de IA
          ══════════════════════════════════════════════════════ */}
          {activeTab === 'athena' && (
            <div className="space-y-6 animate-fade-in">

              {/* ── HEADER ─────────────────────────────────────── */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/20 flex items-center justify-center text-lg">🦉</div>
                <div>
                  <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-violet-400">Central de IA</p>
                  <h1 className="text-xl font-black text-white tracking-tight">Athena AI</h1>
                  <p className="text-xs text-slate-400">Provedor · Modelos · Comportamento · Créditos — tudo em um lugar.</p>
                </div>
              </div>

              {/* ── SEÇÃO 1: PROVEDOR & MODELOS ────────────────── */}
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-[#182030]">
                  <Zap className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-black text-white">Provedor e Modelos</span>
                  <span className="text-[10px] text-slate-500 font-mono ml-auto">Configuração por função</span>
                </div>

                {/* Alerta novos modelos */}
                {newModelsAlert.length > 0 && (
                  <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-3 flex items-start gap-3">
                    <span className="text-base shrink-0">🆕</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-amber-400">Novos modelos disponíveis!</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{newModelsAlert.join(', ')}</p>
                    </div>
                    <button onClick={() => { localStorage.setItem('provax_known_model_ids', JSON.stringify(['claude-haiku-3-5','claude-sonnet-4-5','claude-sonnet-4','claude-opus-4-5','claude-opus-4','gpt-4o-mini','gpt-4o','gpt-4-turbo','o1-mini','o3-mini','gemini-2.0-flash','gemini-2.5-flash','gemini-2.5-pro','gemini-1.5-flash','gemini-1.5-pro'])); setNewModelsAlert([]); }}
                      className="text-[10px] font-mono font-bold text-amber-400 border border-amber-500/20 px-2 py-1 rounded-lg cursor-pointer shrink-0">
                      OK
                    </button>
                  </div>
                )}

                {/* Seleção de provedor */}
                <div>
                  <label className="text-[10px] font-mono text-slate-400 font-black uppercase tracking-widest block mb-2">Provedor Principal</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'anthropic', label: 'Claude',  desc: 'Melhor para jurídico',  icon: '🤖', color: 'border-indigo-500 bg-indigo-600/15 text-white' },
                      { id: 'openai',    label: 'GPT',     desc: 'Amplamente testado',     icon: '⚡', color: 'border-green-500 bg-green-600/15 text-white' },
                      { id: 'google',    label: 'Gemini',  desc: 'Contexto 1M · Barato',  icon: '💎', color: 'border-blue-500 bg-blue-600/15 text-white' },
                    ].map(p => (
                      <button key={p.id} onClick={() => setActiveProvider(p.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${activeProvider === p.id ? p.color : 'bg-[#070a13] border-[#182030] text-slate-400 hover:border-slate-600'}`}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-base">{p.icon}</span>
                          <span className="text-xs font-black">{p.label}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chave API */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-slate-400 font-black uppercase tracking-widest">
                      {activeProvider === 'anthropic' ? 'Anthropic API Key' : activeProvider === 'openai' ? 'OpenAI API Key' : 'Google AI API Key'}
                    </label>
                    <div className="flex items-center gap-2">
                      {(activeProvider === 'anthropic' ? anthropicApiKey : activeProvider === 'openai' ? openaiApiKey : geminiApiKeyNew) && (
                        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" /> Ativa
                        </span>
                      )}
                      <button onClick={() => setApiKeyVisible(v => !v)} className="text-[10px] text-slate-500 hover:text-white font-mono cursor-pointer">
                        {apiKeyVisible ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>
                  </div>
                  <input
                    type={apiKeyVisible ? 'text' : 'password'}
                    value={activeProvider === 'anthropic' ? anthropicApiKey : activeProvider === 'openai' ? openaiApiKey : geminiApiKeyNew}
                    onChange={e => activeProvider === 'anthropic' ? setAnthropicApiKey(e.target.value) : activeProvider === 'openai' ? setOpenaiApiKey(e.target.value) : setGeminiApiKeyNew(e.target.value)}
                    placeholder={activeProvider === 'anthropic' ? 'sk-ant-api03-...' : activeProvider === 'openai' ? 'sk-proj-...' : 'AIzaSy...'}
                    className="w-full bg-[#070a13] border border-[#182030] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
                  />
                  <p className="text-[10px] text-slate-500">
                    {activeProvider === 'anthropic'
                      ? <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">console.anthropic.com</a>
                      : activeProvider === 'openai'
                      ? <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-green-400 hover:underline">platform.openai.com/api-keys</a>
                      : <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">aistudio.google.com/app/apikey</a>
                    }
                  </p>
                </div>

                {/* Modelos por função */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-400 font-black uppercase tracking-widest block">Modelo por Função</label>
                  <div className="bg-[#070a13] border border-[#182030] rounded-xl overflow-hidden">
                    {(activeProvider === 'anthropic' ? [
                      { label: '💬 Chat diário',           state: claudeChatModel,      set: setChatModel,      rec: 'claude-haiku-3-5'  },
                      { label: '❓ Geração de questões',    state: claudeQuestionsModel, set: setQuestionsModel, rec: 'claude-sonnet-4-5' },
                      { label: '📄 Análise de material',   state: claudeAnalyzeModel,   set: setAnalyzeModel,   rec: 'claude-sonnet-4-5' },
                      { label: '📅 Cronograma',            state: claudeScheduleModel,  set: setScheduleModel,  rec: 'claude-haiku-3-5'  },
                    ] : activeProvider === 'openai' ? [
                      { label: '💬 Chat diário',           state: gptChatModel,      set: setGptChatModel,      rec: 'gpt-4o-mini' },
                      { label: '❓ Geração de questões',    state: gptQuestionsModel, set: setGptQuestionsModel, rec: 'gpt-4o'      },
                      { label: '📄 Análise de material',   state: gptAnalyzeModel,   set: setGptAnalyzeModel,   rec: 'gpt-4o'      },
                      { label: '📅 Cronograma',            state: gptScheduleModel,  set: setGptScheduleModel,  rec: 'gpt-4o-mini' },
                    ] : [
                      { label: '💬 Chat diário',           state: geminiChatModel,      set: setGeminiChatModel,      rec: 'gemini-2.0-flash' },
                      { label: '❓ Geração de questões',    state: geminiQuestionsModel, set: setGeminiQuestionsModel, rec: 'gemini-2.5-flash' },
                      { label: '📄 Análise de material',   state: geminiAnalyzeModel,   set: setGeminiAnalyzeModel,   rec: 'gemini-2.5-pro'   },
                      { label: '📅 Cronograma',            state: geminiScheduleModel,  set: setGeminiScheduleModel,  rec: 'gemini-2.0-flash' },
                    ]).map((row, i) => (
                      <div key={i} className={`flex items-center justify-between gap-4 px-4 py-3 ${i > 0 ? 'border-t border-[#182030]' : ''}`}>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-300">{row.label}</p>
                          <p className="text-[9px] text-slate-600 font-mono">rec: {row.rec}</p>
                        </div>
                        <select value={row.state} onChange={e => row.set(e.target.value)}
                          className="bg-[#0f1524] border border-[#182030] rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none font-mono shrink-0">
                          {(activeProvider === 'anthropic' ? CLAUDE_MODELS_LIST : activeProvider === 'openai' ? GPT_MODELS_LIST : GEMINI_MODELS_LIST).map(m => (
                            <option key={m.id} value={m.id}>{m.label}{(m as any).isNew ? ' 🆕' : ''}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tabela de créditos por modelo */}
                <div className="bg-[#070a13] border border-[#182030] rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 px-4 py-2 border-b border-[#182030] text-[9px] font-mono font-bold uppercase text-slate-600">
                    <span className="col-span-4">Modelo</span>
                    <span className="col-span-2 text-center">Base</span>
                    <span className="col-span-2 text-center">Mult.</span>
                    <span className="col-span-2 text-center">Total</span>
                    <span className="col-span-2 text-right">Est./mês</span>
                  </div>
                  {(activeProvider === 'anthropic' ? CLAUDE_MODELS_LIST : activeProvider === 'openai' ? GPT_MODELS_LIST : GEMINI_MODELS_LIST).map((m, i) => {
                    const creditMap: Record<string, { base: number; multiplier: number; total: number; perMonth: string }> = {
                      'claude-haiku-3-5':  { base: 1, multiplier: 1,  total: 1,  perMonth: '~R$ 50–150'    },
                      'claude-sonnet-4-5': { base: 1, multiplier: 5,  total: 5,  perMonth: '~R$ 100–250'   },
                      'claude-sonnet-4':   { base: 1, multiplier: 8,  total: 8,  perMonth: '~R$ 150–350'   },
                      'claude-opus-4-5':   { base: 1, multiplier: 25, total: 25, perMonth: '~R$ 400–800'   },
                      'claude-opus-4':     { base: 1, multiplier: 40, total: 40, perMonth: '~R$ 600–1.200' },
                      'gemini-2.0-flash':  { base: 1, multiplier: 1,  total: 1,  perMonth: '~R$ 30–80'     },
                      'gemini-2.5-flash':  { base: 1, multiplier: 3,  total: 3,  perMonth: '~R$ 60–150'    },
                      'gemini-2.5-pro':    { base: 1, multiplier: 10, total: 10, perMonth: '~R$ 150–300'   },
                      'gemini-1.5-flash':  { base: 1, multiplier: 1,  total: 1,  perMonth: '~R$ 20–60'     },
                      'gemini-1.5-pro':    { base: 1, multiplier: 7,  total: 7,  perMonth: '~R$ 120–250'   },
                      'gpt-4o-mini':       { base: 1, multiplier: 1,  total: 1,  perMonth: '~R$ 40–100'    },
                      'gpt-4o':            { base: 1, multiplier: 5,  total: 5,  perMonth: '~R$ 100–250'   },
                      'gpt-4-turbo':       { base: 1, multiplier: 10, total: 10, perMonth: '~R$ 180–400'   },
                      'o1-mini':           { base: 1, multiplier: 15, total: 15, perMonth: '~R$ 250–500'   },
                      'o3-mini':           { base: 1, multiplier: 20, total: 20, perMonth: '~R$ 350–700'   },
                    };
                    const c = creditMap[m.id] || { base: 1, multiplier: 1, total: 1, perMonth: '—' };
                    const totalColor = c.total <= 3 ? 'text-emerald-400' : c.total <= 10 ? 'text-amber-400' : 'text-red-400';
                    return (
                      <div key={m.id} className={`grid grid-cols-12 px-4 py-2.5 text-[10px] font-mono items-center ${i > 0 ? 'border-t border-[#182030]' : ''}`}>
                        <div className="col-span-4 flex items-center gap-1.5">
                          <span className="text-slate-300 truncate">{m.label}</span>
                          {(m as any).isNew && <span className="text-[7px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1 rounded font-black shrink-0">NEW</span>}
                        </div>
                        <span className="col-span-2 text-center text-slate-500">{c.base} cr</span>
                        <span className="col-span-2 text-center text-slate-400">×{c.multiplier}</span>
                        <span className={`col-span-2 text-center font-black ${totalColor}`}>{c.total} cr</span>
                        <span className="col-span-2 text-right text-slate-600 text-[9px]">{c.perMonth}</span>
                      </div>
                    );
                  })}
                  <div className="px-4 py-2 border-t border-[#182030] bg-[#0a0d16]">
                    <p className="text-[9px] text-slate-600 font-mono">1 crédito ≈ R$ 0,01 · estimativa para 500 alunos ativos/mês</p>
                  </div>
                </div>

                {/* Status + Salvar */}
                <div className="flex items-center justify-between pt-2 border-t border-[#182030]/50">
                  <div className="flex gap-1.5 text-[10px] font-mono items-center">
                    {(() => {
                      const key = activeProvider === 'anthropic' ? anthropicApiKey : activeProvider === 'openai' ? openaiApiKey : geminiApiKeyNew;
                      const name = activeProvider === 'anthropic' ? 'Claude' : activeProvider === 'openai' ? 'GPT' : 'Gemini';
                      return (<>
                        <span className={`w-2 h-2 rounded-full ${key ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                        <span className={key ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                          {key ? `${name} Ativo` : 'Aguardando chave API'}
                        </span>
                      </>);
                    })()}
                  </div>
                  <button disabled={isSavingAIConfig} onClick={() => {
                    playClickSound(); setIsSavingAIConfig(true);
                    setTimeout(() => {
                      localStorage.setItem('athena_ai_provider',          activeProvider);
                      localStorage.setItem('athena_anthropic_api_key',    anthropicApiKey);
                      localStorage.setItem('athena_openai_api_key',       openaiApiKey);
                      localStorage.setItem('athena_gemini_api_key_v2',    geminiApiKeyNew);
                      localStorage.setItem('athena_claude_chat_model',      claudeChatModel);
                      localStorage.setItem('athena_claude_questions_model', claudeQuestionsModel);
                      localStorage.setItem('athena_claude_analyze_model',   claudeAnalyzeModel);
                      localStorage.setItem('athena_claude_schedule_model',  claudeScheduleModel);
                      localStorage.setItem('athena_gpt_chat_model',      gptChatModel);
                      localStorage.setItem('athena_gpt_questions_model', gptQuestionsModel);
                      localStorage.setItem('athena_gpt_analyze_model',   gptAnalyzeModel);
                      localStorage.setItem('athena_gpt_schedule_model',  gptScheduleModel);
                      localStorage.setItem('athena_gemini_chat_model',      geminiChatModel);
                      localStorage.setItem('athena_gemini_questions_model', geminiQuestionsModel);
                      localStorage.setItem('athena_gemini_analyze_model',   geminiAnalyzeModel);
                      localStorage.setItem('athena_gemini_schedule_model',  geminiScheduleModel);
                      localStorage.setItem('athena_ai_name',       aiName);
                      localStorage.setItem('athena_ai_tone',       aiTone);
                      localStorage.setItem('athena_ai_strictness', aiStrictness);
                      localStorage.setItem('athena_ai_custom_instruction', aiCustomInstruction);
                      localStorage.setItem('provax_known_model_ids', JSON.stringify(['claude-haiku-3-5','claude-sonnet-4-5','claude-sonnet-4','claude-opus-4-5','claude-opus-4','gpt-4o-mini','gpt-4o','gpt-4-turbo','o1-mini','o3-mini','gemini-2.0-flash','gemini-2.5-flash','gemini-2.5-pro','gemini-1.5-flash','gemini-1.5-pro']));
                      setNewModelsAlert([]);
                      playSuccessSound(); setIsSavingAIConfig(false); setAiConfigSavedToast(true);
                      showToastMsg('Configuração de IA salva!');
                      setTimeout(() => setAiConfigSavedToast(false), 3000);
                    }, 800);
                  }}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-all">
                    {isSavingAIConfig ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Salvando...</> : <><Check className="w-3.5 h-3.5" /> Salvar</>}
                  </button>
                </div>
              </div>

              {/* ── SEÇÃO 2: COMPORTAMENTO DA ATHENA ───────────── */}
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#182030]">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-black text-white">Comportamento da Athena</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-black uppercase">Nome da IA</label>
                    <input value={aiName} onChange={e => setAiName(e.target.value)}
                      className="w-full bg-[#070a13] border border-[#182030] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-black uppercase">Tom</label>
                    <select value={aiTone} onChange={e => setAiTone(e.target.value)}
                      className="w-full bg-[#070a13] border border-[#182030] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                      <option value="elite">Elite — Instrutor policial</option>
                      <option value="motivator">Motivador — Entusiasta</option>
                      <option value="academic">Acadêmico — Formal</option>
                      <option value="direct">Direto — Objetivo</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-black uppercase">Rigor</label>
                    <select value={aiStrictness} onChange={e => setAiStrictness(e.target.value)}
                      className="w-full bg-[#070a13] border border-[#182030] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                      <option value="high">Alto — Cobra resultados</option>
                      <option value="balance">Equilibrado</option>
                      <option value="soft">Suave — Encorajador</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 font-black uppercase">Instrução Personalizada</label>
                  <textarea value={aiCustomInstruction} onChange={e => setAiCustomInstruction(e.target.value)} rows={3}
                    className="w-full bg-[#070a13] border border-[#182030] rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                    placeholder="Regras comportamentais adicionais..." />
                </div>
              </div>

              {/* ── SEÇÃO 3: MONITORAMENTO DE CRÉDITOS ─────────── */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-black text-white">Monitoramento de Créditos</span>
                    <span className="text-[10px] text-slate-500 font-mono">1 cr ≈ R$ 0,01</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={creditDays} onChange={e => { const d = +e.target.value; setCreditDays(d); refreshCredits(d); }}
                      className="bg-[#070a13] border border-[#182030] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none">
                      <option value={7}>7 dias</option>
                      <option value={30}>30 dias</option>
                      <option value={90}>90 dias</option>
                    </select>
                    <button onClick={() => refreshCredits()} className="p-1.5 bg-[#070a13] border border-[#182030] rounded-lg text-slate-400 hover:text-white cursor-pointer">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Total de Créditos', value: creditSummary.totalCredits.toLocaleString('pt-BR'), sub: `${creditDays} dias`, color: 'text-indigo-400', icon: <Zap className="w-4 h-4" /> },
                  { label: 'Custo Estimado', value: `R$ ${creditSummary.totalBRL.toFixed(2)}`, sub: 'em créditos de IA', color: 'text-amber-400', icon: <DollarSign className="w-4 h-4" /> },
                  { label: 'Interações', value: Object.values(creditSummary.byStudent).reduce((s, v) => s + v.interactions, 0).toLocaleString(), sub: 'com IA real', color: 'text-emerald-400', icon: <Activity className="w-4 h-4" /> },
                  { label: 'Alunos Ativos', value: Object.keys(creditSummary.byStudent).length.toString(), sub: 'usaram IA', color: 'text-violet-400', icon: <Users className="w-4 h-4" /> },
                ].map(k => (
                  <div key={k.label} className="bg-[#0f1524] border border-[#182030] rounded-2xl p-4">
                    <div className={`flex items-center gap-1.5 mb-1.5 ${k.color}`}>{k.icon}<p className="text-[10px] font-mono uppercase text-slate-500">{k.label}</p></div>
                    <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{k.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Por aluno */}
                <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Créditos por Aluno</span>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(creditSummary.byStudent)
                      .sort((a, b) => b[1].credits - a[1].credits)
                      .slice(0, 8)
                      .map(([id, data]) => {
                        const maxC = Math.max(...Object.values(creditSummary.byStudent).map(v => v.credits), 1);
                        const pct = (data.credits / maxC) * 100;
                        return (
                          <div key={id}>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-slate-300 font-medium truncate max-w-[55%]">{data.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-500 text-[10px] font-mono">{data.interactions} interações</span>
                                <span className="text-indigo-400 font-black font-mono">{data.credits} cr</span>
                                <span className="text-amber-400 text-[10px] font-mono">R$ {(data.credits * 0.01).toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="h-1.5 bg-[#070a13] rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    {Object.keys(creditSummary.byStudent).length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-6">Nenhum uso registrado ainda.</p>
                    )}
                  </div>
                </div>

                {/* Por modelo */}
                <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Créditos por Modelo</span>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(creditSummary.byModel)
                      .sort((a, b) => b[1].credits - a[1].credits)
                      .map(([model, data]) => {
                        const maxC = Math.max(...Object.values(creditSummary.byModel).map(v => v.credits), 1);
                        const pct = (data.credits / maxC) * 100;
                        const color = model.startsWith('claude') ? 'from-indigo-600 to-indigo-400'
                          : model.startsWith('gpt') || model.startsWith('o') ? 'from-green-600 to-green-400'
                          : 'from-blue-600 to-blue-400';
                        return (
                          <div key={model}>
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="text-slate-300 font-mono truncate max-w-[50%]">{model}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-500">{data.interactions}×</span>
                                <span className="text-amber-400 font-black font-mono">{data.credits} cr</span>
                              </div>
                            </div>
                            <div className="h-1.5 bg-[#070a13] rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    {Object.keys(creditSummary.byModel).length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-6">Nenhum modelo usado ainda.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Por tipo de ação */}
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Créditos por Tipo de Ação</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { key: 'chat',     label: '💬 Chat (Athena)',   color: 'text-indigo-400',  bg: 'bg-indigo-500/10 border-indigo-500/20' },
                    { key: 'question', label: '❓ Geração de Questão', color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20'   },
                    { key: 'analyze',  label: '📄 Análise Material', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
                    { key: 'schedule', label: '📅 Cronograma',       color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                  ].map(a => (
                    <div key={a.key} className={`border rounded-xl p-3 text-center ${a.bg}`}>
                      <p className="text-[11px] text-slate-400 mb-1">{a.label}</p>
                      <p className={`text-xl font-black ${a.color}`}>{creditSummary.byAction[a.key] || 0}</p>
                      <p className="text-[10px] text-slate-500">créditos</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Log de interações recentes */}
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Log de Interações Recentes</span>
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono">{creditEntries.length} registros</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] font-mono">
                    <thead>
                      <tr className="border-b border-[#182030] text-slate-600 uppercase">
                        <th className="text-left py-2 pr-4">Aluno</th>
                        <th className="text-left py-2 pr-4">Ação</th>
                        <th className="text-left py-2 pr-4">Modelo</th>
                        <th className="text-center py-2 pr-4">Créditos</th>
                        <th className="text-right py-2">Horário</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#182030]">
                      {creditEntries.slice(0, 15).map(e => {
                        const actionIcon = { chat: '💬', question: '❓', analyze: '📄', schedule: '📅' }[e.action] || '•';
                        const creditColor = e.credits <= 3 ? 'text-emerald-400' : e.credits <= 10 ? 'text-amber-400' : 'text-red-400';
                        return (
                          <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-2 pr-4 text-slate-300 truncate max-w-[120px]">{e.studentName}</td>
                            <td className="py-2 pr-4 text-slate-400">{actionIcon} {e.action}</td>
                            <td className="py-2 pr-4 text-slate-500 truncate max-w-[130px]">{e.model}</td>
                            <td className={`py-2 pr-4 text-center font-black ${creditColor}`}>{e.credits}</td>
                            <td className="py-2 text-right text-slate-600">
                              {new Date(e.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        );
                      })}
                      {creditEntries.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-slate-600">Nenhuma interação registrada.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* ── ABA: FINANCEIRO (dentro do workspace) ─────────── */}
          {activeTab === 'financeiro' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500">Negócio</p>
                <h1 className="text-xl font-black text-white tracking-tight mt-1">Financeiro</h1>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'MRR', value: 'R$ 34.200', change: '+14%', color: 'text-indigo-400', up: true },
                  { label: 'Ticket Médio', value: 'R$ 67,40', change: '+3%', color: 'text-emerald-400', up: true },
                  { label: 'Churn Rate', value: '1.2%', change: '-0.3%', color: 'text-emerald-400', up: false },
                  { label: 'Alunos Pagantes', value: '508', change: '+42', color: 'text-amber-400', up: true },
                ].map(k => (
                  <div key={k.label} className="bg-[#0f1524] border border-[#182030] rounded-2xl p-4">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">{k.label}</p>
                    <p className={`text-2xl font-black mt-1 ${k.color}`}>{k.value}</p>
                    <p className={`text-[10px] font-mono mt-1 ${k.up ? 'text-emerald-500' : 'text-red-400'}`}>{k.change} este mês</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
                <h3 className="text-sm font-black text-white mb-4">MRR — Últimos 6 meses</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { mes: 'Jan', mrr: 21000 }, { mes: 'Fev', mrr: 24500 },
                      { mes: 'Mar', mrr: 27800 }, { mes: 'Abr', mrr: 29200 },
                      { mes: 'Mai', mrr: 31400 }, { mes: 'Jun', mrr: 34200 },
                    ]} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gMRR2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ background: '#0f1524', border: '1px solid #182030', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, 'MRR']} />
                      <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={2.5} fill="url(#gMRR2)" dot={{ fill: '#6366f1', r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
                  <h3 className="text-sm font-black text-white mb-4">Distribuição de Planos</h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: 'Gratuito', value: 1016 },
                          { name: 'Essencial PRF', value: 362 },
                          { name: 'Athena Supreme', value: 146 },
                        ]} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                          <Cell fill="#334155" /><Cell fill="#6366f1" /><Cell fill="#f59e0b" />
                        </Pie>
                        <Tooltip contentStyle={{ background: '#0f1524', border: '1px solid #182030', borderRadius: 8, fontSize: 11 }} />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
                  <h3 className="text-sm font-black text-white mb-4">Renovações esta semana</h3>
                  <div className="space-y-2.5">
                    {[
                      { name: 'Ana Oliveira', plan: 'Athena Supreme', date: '02/07', value: 'R$ 97,00', risk: false },
                      { name: 'Carlos Eduardo', plan: 'Essencial', date: '03/07', value: 'R$ 49,90', risk: true },
                      { name: 'Mariana Costa', plan: 'Essencial', date: '05/07', value: 'R$ 49,90', risk: true },
                    ].map(r => (
                      <div key={r.name} className="flex items-center justify-between text-xs">
                        <div><p className="text-white font-semibold">{r.name}</p><p className="text-slate-500 text-[10px]">{r.plan} · {r.date}</p></div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400">{r.value}</span>
                          {r.risk && <span className="text-[9px] bg-red-500/10 border border-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-mono">Risco</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ABA: NOTIFICAÇÕES (dentro do workspace) ───────── */}
          {activeTab === 'notificacoes' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500">Comunicação</p>
                <h1 className="text-xl font-black text-white tracking-tight mt-1">Notificações em Massa</h1>
              </div>
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-black text-white">Nova Campanha</h3>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-2">Segmento</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { id: 'all', label: 'Todos os Alunos', count: '1.524' },
                      { id: 'risk', label: 'Em Risco de Churn', count: '38' },
                      { id: 'inactive', label: 'Inativos 3+ dias', count: '142' },
                      { id: 'gold', label: 'Athena Supreme', count: '146' },
                    ].map(s => (
                      <button key={s.id} onClick={() => setMassNotifSegment(s.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${massNotifSegment === s.id ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-[#070a13] border-[#182030] text-slate-400 hover:border-slate-600'}`}>
                        <p className="text-xs font-bold">{s.label}</p>
                        <p className={`text-[10px] font-mono mt-0.5 ${massNotifSegment === s.id ? 'text-indigo-400' : 'text-slate-600'}`}>{s.count} alunos</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1.5">Mensagem</label>
                  <textarea value={massNotifMsg} onChange={e => setMassNotifMsg(e.target.value)} rows={4}
                    placeholder="Ex: Recruta, sua meta semanal está em risco! Faça pelo menos 10 questões hoje."
                    className="w-full bg-[#070a13] border border-[#182030] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 resize-none" />
                  <p className="text-[10px] text-slate-500 mt-1">{massNotifMsg.length}/280</p>
                </div>
                {massNotifSent ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold"><CheckCircle2 className="w-5 h-5" /> Campanha enviada!</div>
                ) : (
                  <button onClick={() => { if (!massNotifMsg.trim()) return; setMassNotifSent(true); const seg = massNotifSegment === 'all' ? 'Todos' : massNotifSegment === 'risk' ? 'Em Risco' : massNotifSegment === 'inactive' ? 'Inativos' : 'Athena Supreme'; setNotifHistory(prev => [{ id: `n-${Date.now()}`, segment: seg, msg: massNotifMsg, date: new Date().toLocaleDateString('pt-BR'), sent: massNotifSegment === 'all' ? 1524 : massNotifSegment === 'risk' ? 38 : massNotifSegment === 'inactive' ? 142 : 146 }, ...prev]); setTimeout(() => { setMassNotifSent(false); setMassNotifMsg(''); }, 3000); playSuccessSound(); }}
                    disabled={!massNotifMsg.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-indigo-500/20">
                    <Send className="w-4 h-4" /> Enviar Campanha
                  </button>
                )}
              </div>
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
                <h3 className="text-sm font-black text-white mb-4">Histórico de Disparos</h3>
                <div className="space-y-3">
                  {notifHistory.map(n => (
                    <div key={n.id} className="flex items-start justify-between gap-3 p-3 bg-[#070a13] border border-[#182030] rounded-xl">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-mono font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">{n.segment}</span>
                          <span className="text-[9px] text-slate-500 font-mono">{n.date}</span>
                        </div>
                        <p className="text-xs text-slate-300 truncate">{n.msg}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0">{n.sent.toLocaleString()} enviados</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ABA: RELATÓRIOS (dentro do workspace) ─────────── */}
          {activeTab === 'relatorios' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500">Análise</p>
                  <h1 className="text-xl font-black text-white tracking-tight mt-1">Relatórios</h1>
                </div>
                <button onClick={() => { showToastMsg('Exportação iniciada — arquivo pronto em segundos!'); playSuccessSound(); }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl text-xs cursor-pointer hover:bg-emerald-600/30 transition-all">
                  <Download className="w-4 h-4" /> Exportar CSV
                </button>
              </div>
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
                <h3 className="text-sm font-black text-white mb-4">Desempenho Médio da Turma por Disciplina</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={[
                      { name: 'Leg. Trânsito', media: 72 }, { name: 'L. Portuguesa', media: 68 },
                      { name: 'D. Constitucional', media: 65 }, { name: 'D. Administrativo', media: 58 },
                      { name: 'Rac. Lógico', media: 55 }, { name: 'D. Penal', media: 61 },
                      { name: 'Leg. Especial', media: 49 }, { name: 'D. Proc. Penal', media: 52 },
                      { name: 'Física', media: 47 }, { name: 'Informática', media: 70 },
                    ]} margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} width={110} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#0f1524', border: '1px solid #182030', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`${v}%`]} />
                      <Bar dataKey="media" radius={[0, 4, 4, 0]} maxBarSize={14}>
                        {[72,68,65,58,55,61,49,52,47,70].map((v, i) => (
                          <Cell key={i} fill={v >= 60 ? '#10b981' : v >= 50 ? '#f59e0b' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
                <h3 className="text-sm font-black text-white mb-4">Top 5 Questões Mais Erradas</h3>
                <div className="space-y-3">
                  {[
                    { q: 'Limite de velocidade em pista simples para motocicletas é de 110 km/h.', disc: 'Leg. Trânsito', erros: '68%' },
                    { q: 'O flagrante presumido ocorre quando o agente é perseguido logo após o crime.', disc: 'D. Proc. Penal', erros: '61%' },
                    { q: 'A EC 19/1998 inseriu a eficiência entre os princípios do art. 37 da CF.', disc: 'D. Constitucional', erros: '57%' },
                    { q: 'A autoexecutoriedade está presente em todos os atos administrativos.', disc: 'D. Administrativo', erros: '54%' },
                    { q: 'Energia cinética é diretamente proporcional à velocidade (relação linear).', disc: 'Física', erros: '52%' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-[#070a13] border border-[#182030] rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black flex items-center justify-center shrink-0">{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{item.q}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{item.disc}</p>
                      </div>
                      <span className="text-sm font-black text-red-400 shrink-0">{item.erros}</span>
                    </div>
                  ))}
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

      {/* ── MODAL: NOVA CATEGORIA BASE GERAL ─────────────────── */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1524] border border-white/[0.08] max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Nova Categoria</h3>
              <button onClick={() => setShowNewCategoryModal(false)} className="text-slate-500 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              {/* Ícone */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-2">Ícone</label>
                <div className="flex flex-wrap gap-2">
                  {['📁','📚','📖','📝','🗂️','💡','⚖️','🚔','📋','🔬','🌐','🎯','📊','📌','🗃️'].map(e => (
                    <button key={e} onClick={() => setNewCatIcon(e)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center cursor-pointer transition-all ${newCatIcon === e ? 'bg-amber-500/20 border border-amber-500/40 scale-110' : 'bg-[#070a13] border border-[#182030] hover:border-slate-600'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-1.5">Nome *</label>
                <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateCategory()}
                  placeholder="Ex: Legislação Extra, Apostilas, Estratégias..."
                  autoFocus
                  className="w-full bg-[#070a13] border border-[#182030] focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none" />
              </div>

              {/* Cor */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-2">Cor</label>
                <div className="flex gap-2">
                  {[
                    { id: 'indigo',  cls: 'bg-indigo-500'  },
                    { id: 'amber',   cls: 'bg-amber-500'   },
                    { id: 'emerald', cls: 'bg-emerald-500' },
                    { id: 'violet',  cls: 'bg-violet-500'  },
                    { id: 'red',     cls: 'bg-red-500'     },
                    { id: 'sky',     cls: 'bg-sky-500'     },
                  ].map(c => (
                    <button key={c.id} onClick={() => setNewCatColor(c.id)}
                      className={`w-8 h-8 rounded-full ${c.cls} transition-all cursor-pointer ${newCatColor === c.id ? 'scale-125 ring-2 ring-white/30' : 'opacity-60 hover:opacity-100'}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-[#182030]">
              <button onClick={() => setShowNewCategoryModal(false)} className="flex-1 py-2.5 border border-white/[0.08] text-slate-400 hover:text-white rounded-xl text-sm font-bold cursor-pointer transition-all">Cancelar</button>
              <button onClick={handleCreateCategory} disabled={!newCatName.trim()}
                className={`flex-1 py-2.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${newCatName.trim() ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-white/[0.04] text-slate-600 cursor-not-allowed'}`}>
                <Plus className="w-4 h-4" /> Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ADICIONAR MATERIAL À CATEGORIA ────────────── */}
      {showAddGeneralMaterial && selectedCategory && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1524] border border-white/[0.08] max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Adicionar Material</h3>
              <button onClick={() => setShowAddGeneralMaterial(false)} className="text-slate-500 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              {/* Tipo */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'text',  label: '📝 Texto',   desc: 'Anotações livres' },
                  { id: 'link',  label: '🔗 Link',     desc: 'URL externa'     },
                  { id: 'drive', label: '📁 Arquivo',  desc: 'Do computador'   },
                ].map(t => (
                  <button key={t.id}
                    onClick={() => { setNewGenType(t.id as any); setNewGenDriveError(''); setNewGenDriveFetched(false); setNewGenContent(''); setNewGenFileName(''); }}
                    className={`py-2.5 px-2 rounded-xl text-center border cursor-pointer transition-all ${newGenType === t.id ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' : 'bg-[#070a13] border-[#182030] text-slate-500 hover:border-slate-600'}`}>
                    <p className="text-xs font-bold">{t.label}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>

              {/* Upload de arquivo do computador */}
              {newGenType === 'drive' && (
                <div className="space-y-3">
                  {/* Zona de upload */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="gen-file-input"
                  />
                  <label
                    htmlFor="gen-file-input"
                    className={`flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${newGenDriveFetched ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-[#182030] hover:border-amber-500/40 hover:bg-amber-500/5'}`}
                  >
                    {newGenDriveFetched ? (
                      <>
                        <span className="text-2xl">✅</span>
                        <div className="text-center">
                          <p className="text-xs font-bold text-emerald-400">{newGenFileName}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{newGenContent.length.toLocaleString()} caracteres · clique para trocar</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">📁</span>
                        <div className="text-center">
                          <p className="text-xs font-bold text-amber-400">Clique para selecionar</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">ou arraste o arquivo aqui</p>
                        </div>
                      </>
                    )}
                  </label>

                  {/* Formatos */}
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {[
                      { icon: '📝', label: 'TXT / MD', note: 'Texto extraído' },
                      { icon: '📄', label: 'PDF / DOC', note: 'Metadados' },
                      { icon: '🎬', label: 'MP4 / AVI', note: 'Metadados' },
                      { icon: '🎵', label: 'MP3 / WAV', note: 'Metadados' },
                    ].map(f => (
                      <div key={f.label} className="bg-[#070a13] border border-[#182030] rounded-lg p-2">
                        <span className="text-base block">{f.icon}</span>
                        <p className="text-[9px] font-mono font-bold text-slate-400 mt-0.5">{f.label}</p>
                        <p className="text-[8px] text-slate-600">{f.note}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-600 text-center font-mono">
                    Qualquer arquivo · textos têm conteúdo extraído · outros ficam registrados
                  </p>

                  {/* Erro */}
                  {newGenDriveError && (
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-red-400">{newGenDriveError}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Título */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-1.5">Título *</label>
                <input type="text" value={newGenTitle} onChange={e => setNewGenTitle(e.target.value)}
                  placeholder={newGenType === 'link' ? 'Ex: Site DENATRAN, Resolução 432...' : newGenType === 'drive' ? 'Nome do material (preenchido automaticamente)' : 'Ex: Resumo de Física...'}
                  className="w-full bg-[#070a13] border border-[#182030] focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none" />
              </div>

              {/* Conteúdo — só para texto e link */}
              {newGenType !== 'drive' && (
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    {newGenType === 'link' ? 'URL' : 'Conteúdo / Anotações'}
                  </label>
                  {newGenType === 'link' ? (
                    <input type="url" value={newGenContent} onChange={e => setNewGenContent(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#070a13] border border-[#182030] focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none font-mono" />
                  ) : (
                    <textarea value={newGenContent} onChange={e => setNewGenContent(e.target.value)} rows={5}
                      placeholder="Cole o texto, anotações, resumos, artigos..."
                      className="w-full bg-[#070a13] border border-[#182030] focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none resize-none" />
                  )}
                </div>
              )}

              {/* Preview do conteúdo Drive */}
              {newGenType === 'drive' && newGenContent && (
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-1.5">Preview do Conteúdo</label>
                  <div className="bg-[#070a13] border border-[#182030] rounded-xl p-3 text-[10px] font-mono text-slate-400 max-h-28 overflow-y-auto leading-relaxed">
                    {newGenContent.slice(0, 500)}{newGenContent.length > 500 && '...'}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2 border-t border-[#182030]">
              <button onClick={() => setShowAddGeneralMaterial(false)} className="flex-1 py-2.5 border border-white/[0.08] text-slate-400 hover:text-white rounded-xl text-sm font-bold cursor-pointer transition-all">Cancelar</button>
              {(() => {
                const canAdd = newGenTitle.trim() && (newGenType !== 'drive' || newGenDriveFetched);
                return (
                  <button onClick={handleAddGeneralMaterial} disabled={!canAdd}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${canAdd ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-white/[0.04] text-slate-600 cursor-not-allowed'}`}>
                    <Plus className="w-4 h-4" />
                    {newGenType === 'drive' && !newGenDriveFetched ? 'Busque o arquivo primeiro' : 'Adicionar'}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
           MODAL: NOVA MATÉRIA PERSONALIZADA
      ══════════════════════════════════════════════════════ */}
      {showNewDisciplineModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1524] border border-white/[0.08] max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-5">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Nova Matéria</h3>
                  <p className="text-[10px] text-slate-500">Disciplina personalizada na base de conhecimento</p>
                </div>
              </div>
              <button onClick={() => setShowNewDisciplineModal(false)} className="text-slate-500 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-1.5">Nome da Matéria *</label>
                <input
                  type="text"
                  value={newDisciplineName}
                  onChange={e => setNewDisciplineName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateDiscipline()}
                  placeholder="Ex: Legislação Ambiental, LGPD, Redação Oficial..."
                  autoFocus
                  className="w-full bg-[#070a13] border border-[#182030] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all"
                />
              </div>

              {/* Prioridade + Recorrência */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-1.5">Prioridade</label>
                  <select value={newDisciplinePriority} onChange={e => setNewDisciplinePriority(e.target.value as any)}
                    className="w-full bg-[#070a13] border border-[#182030] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500">
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-1.5">Recorrência CEBRASPE</label>
                  <select value={newDisciplineRecurrence} onChange={e => setNewDisciplineRecurrence(e.target.value as any)}
                    className="w-full bg-[#070a13] border border-[#182030] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500">
                    <option value="Altíssima">Altíssima</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>
              </div>

              {/* Peso estimado */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-1.5">Peso Estimado na Prova</label>
                <input
                  type="text"
                  value={newDisciplineWeight}
                  onChange={e => setNewDisciplineWeight(e.target.value)}
                  placeholder="Ex: 5.0%"
                  className="w-full bg-[#070a13] border border-[#182030] focus:border-indigo-500 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-[#182030]">
              <button onClick={() => setShowNewDisciplineModal(false)}
                className="flex-1 py-2.5 border border-white/[0.08] text-slate-400 hover:text-white rounded-xl text-sm font-bold transition-all cursor-pointer">
                Cancelar
              </button>
              <button
                onClick={handleCreateDiscipline}
                disabled={!newDisciplineName.trim()}
                className={`flex-1 py-2.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  newDisciplineName.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-white/[0.04] text-slate-600 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" /> Criar Matéria
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
                    <Upload className="w-5 h-5 animate-pulse text-indigo-400" />
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

      {/* BLOCO REMOVIDO — abas já estão dentro do workspace */}
      {false && (
        <div>
          <div>
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500">Negócio</p>
            <h1 className="text-xl font-black text-white tracking-tight mt-1">Financeiro</h1>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'MRR', value: 'R$ 34.200', change: '+14%', color: 'text-indigo-400', up: true },
              { label: 'Ticket Médio', value: 'R$ 67,40', change: '+3%', color: 'text-emerald-400', up: true },
              { label: 'Churn Rate', value: '1.2%', change: '-0.3%', color: 'text-emerald-400', up: false },
              { label: 'Alunos Pagantes', value: '508', change: '+42', color: 'text-amber-400', up: true },
            ].map(k => (
              <div key={k.label} className="bg-[#0f1524] border border-[#182030] rounded-2xl p-4">
                <p className="text-[10px] font-mono text-slate-500 uppercase">{k.label}</p>
                <p className={`text-2xl font-black mt-1 ${k.color}`}>{k.value}</p>
                <p className={`text-[10px] font-mono mt-1 ${k.up ? 'text-emerald-500' : 'text-red-400'}`}>{k.change} este mês</p>
              </div>
            ))}
          </div>

          {/* Gráfico MRR */}
          <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
            <h3 className="text-sm font-black text-white mb-4">MRR — Últimos 6 meses</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { mes: 'Jan', mrr: 21000 }, { mes: 'Fev', mrr: 24500 },
                  { mes: 'Mar', mrr: 27800 }, { mes: 'Abr', mrr: 29200 },
                  { mes: 'Mai', mrr: 31400 }, { mes: 'Jun', mrr: 34200 },
                ]} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gMRR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: '#0f1524', border: '1px solid #182030', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, 'MRR']} />
                  <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={2.5} fill="url(#gMRR)" dot={{ fill: '#6366f1', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribuição de planos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
              <h3 className="text-sm font-black text-white mb-4">Distribuição de Planos</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[
                      { name: 'Gratuito', value: 1016 },
                      { name: 'Essencial', value: 362 },
                      { name: 'Athena Supreme', value: 146 },
                    ]} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                      <Cell fill="#334155" />
                      <Cell fill="#6366f1" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f1524', border: '1px solid #182030', borderRadius: 8, fontSize: 11 }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
              <h3 className="text-sm font-black text-white mb-4">Renovações esta semana</h3>
              <div className="space-y-2.5">
                {[
                  { name: 'Ana Oliveira', plan: 'Athena Supreme', date: '02/07', value: 'R$ 97,00', risk: false },
                  { name: 'Carlos Eduardo', plan: 'Essencial', date: '03/07', value: 'R$ 49,90', risk: true },
                  { name: 'Mariana Costa', plan: 'Essencial', date: '05/07', value: 'R$ 49,90', risk: true },
                  { name: 'Roberto Mendes', plan: 'Gratuito', date: '05/07', value: 'R$ 0,00', risk: false },
                ].map(r => (
                  <div key={r.name} className="flex items-center justify-between text-xs">
                    <div>
                      <p className="text-white font-semibold">{r.name}</p>
                      <p className="text-slate-500 text-[10px]">{r.plan} · {r.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400">{r.value}</span>
                      {r.risk && <span className="text-[9px] bg-red-500/10 border border-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-mono">Risco</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA NOTIFICAÇÕES DUPLICADA REMOVIDA */}
      {false && (
        <div>
          <div>
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500">Comunicação</p>
            <h1 className="text-xl font-black text-white tracking-tight mt-1">Notificações em Massa</h1>
          </div>

          {/* Criador de campanha */}
          <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-white">Nova Campanha</h3>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1.5">Segmento</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 'all', label: 'Todos os Alunos', count: '1.524' },
                  { id: 'risk', label: 'Em Risco de Churn', count: '38' },
                  { id: 'inactive', label: 'Inativos 3+ dias', count: '142' },
                  { id: 'gold', label: 'Athena Supreme', count: '146' },
                ].map(s => (
                  <button key={s.id} onClick={() => setMassNotifSegment(s.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      massNotifSegment === s.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-[#070a13] border-[#182030] text-slate-400 hover:border-slate-600'
                    }`}>
                    <p className="text-xs font-bold">{s.label}</p>
                    <p className={`text-[10px] font-mono mt-0.5 ${massNotifSegment === s.id ? 'text-indigo-400' : 'text-slate-600'}`}>{s.count} alunos</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1.5">Mensagem</label>
              <textarea
                value={massNotifMsg}
                onChange={e => setMassNotifMsg(e.target.value)}
                rows={4}
                placeholder="Ex: Recruta, sua meta semanal está em risco! Faça pelo menos 10 questões hoje para manter o streak."
                className="w-full bg-[#070a13] border border-[#182030] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 resize-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">{massNotifMsg.length}/280 caracteres</p>
            </div>

            {massNotifSent ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5" /> Campanha enviada com sucesso!
              </div>
            ) : (
              <button
                onClick={() => { if (!massNotifMsg.trim()) return; setMassNotifSent(true); const seg = massNotifSegment === 'all' ? 'Todos os Alunos' : massNotifSegment === 'risk' ? 'Em Risco' : massNotifSegment === 'inactive' ? 'Inativos' : 'Athena Supreme'; setNotifHistory(prev => [{ id: `n-${Date.now()}`, segment: seg, msg: massNotifMsg, date: new Date().toLocaleDateString('pt-BR'), sent: massNotifSegment === 'all' ? 1524 : massNotifSegment === 'risk' ? 38 : massNotifSegment === 'inactive' ? 142 : 146 }, ...prev]); setTimeout(() => { setMassNotifSent(false); setMassNotifMsg(''); }, 3000); playSuccessSound(); }}
                disabled={!massNotifMsg.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-indigo-500/20"
              >
                <Send className="w-4 h-4" /> Enviar Campanha
              </button>
            )}
          </div>

          {/* Histórico */}
          <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
            <h3 className="text-sm font-black text-white mb-4">Histórico de Disparos</h3>
            <div className="space-y-3">
              {notifHistory.map(n => (
                <div key={n.id} className="flex items-start justify-between gap-3 p-3 bg-[#070a13] border border-[#182030] rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">{n.segment}</span>
                      <span className="text-[9px] text-slate-500 font-mono">{n.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 truncate">{n.msg}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0">{n.sent.toLocaleString()} enviados</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA RELATÓRIOS DUPLICADA REMOVIDA */}
      {false && (
        <div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500">Análise</p>
              <h1 className="text-xl font-black text-white tracking-tight mt-1">Relatórios</h1>
            </div>
            <button onClick={() => { showToastMsg('Exportação iniciada — arquivo gerado em segundos!'); playSuccessSound(); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl text-xs cursor-pointer hover:bg-emerald-600/30 transition-all">
              <Download className="w-4 h-4" /> Exportar CSV
            </button>
          </div>

          {/* Desempenho por disciplina */}
          <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
            <h3 className="text-sm font-black text-white mb-4">Desempenho Médio da Turma por Disciplina</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={[
                  { name: 'Leg. Trânsito', media: 72, meta: 60 },
                  { name: 'L. Portuguesa', media: 68, meta: 60 },
                  { name: 'D. Constitucional', media: 65, meta: 60 },
                  { name: 'D. Administrativo', media: 58, meta: 60 },
                  { name: 'Rac. Lógico', media: 55, meta: 60 },
                  { name: 'D. Penal', media: 61, meta: 60 },
                  { name: 'Leg. Especial', media: 49, meta: 60 },
                  { name: 'D. Proc. Penal', media: 52, meta: 60 },
                  { name: 'Física', media: 47, meta: 60 },
                  { name: 'Informática', media: 70, meta: 60 },
                ]} margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} width={110} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f1524', border: '1px solid #182030', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`${v}%`]} />
                  <Bar dataKey="media" radius={[0, 4, 4, 0]} maxBarSize={14}>
                    {[72,68,65,58,55,61,49,52,47,70].map((v, i) => (
                      <Cell key={i} fill={v >= 60 ? '#10b981' : v >= 50 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top questões mais erradas */}
          <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-5">
            <h3 className="text-sm font-black text-white mb-4">Top 5 Questões Mais Erradas</h3>
            <div className="space-y-3">
              {[
                { q: 'Limite de velocidade em pista simples para motocicletas é de 110 km/h.', disc: 'Leg. Trânsito', erros: '68%' },
                { q: 'O flagrante presumido ocorre quando o agente é perseguido logo após o crime.', disc: 'D. Proc. Penal', erros: '61%' },
                { q: 'A EC 19/1998 inseriu a eficiência entre os princípios do art. 37 da CF.', disc: 'D. Constitucional', erros: '57%' },
                { q: 'A autoexecutoriedade está presente em todos os atos administrativos.', disc: 'D. Administrativo', erros: '54%' },
                { q: 'Energia cinética é diretamente proporcional à velocidade (relação linear).', disc: 'Física', erros: '52%' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#070a13] border border-[#182030] rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black flex items-center justify-center shrink-0">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{item.q}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{item.disc}</p>
                  </div>
                  <span className="text-sm font-black text-red-400 shrink-0">{item.erros}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST GLOBAL ────────────────────────────────────────── */}
      {showToast && (
        <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-sm font-bold transition-all ${
          toastType === 'success'
            ? 'bg-emerald-600 text-white shadow-emerald-500/30'
            : 'bg-red-600 text-white shadow-red-500/30'
        }`}>
          {toastType === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toastMsg}
        </div>
      )}

      {/* ── MODAL DE CONFIRMAÇÃO DE EXCLUSÃO ─────────────────────── */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-black text-white">Confirmar exclusão</p>
                <p className="text-xs text-slate-400">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 border border-white/[0.08] text-slate-400 hover:text-white rounded-xl text-sm font-bold transition-all cursor-pointer">
                Cancelar
              </button>
              <button onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all cursor-pointer">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DE EDIÇÃO DE QUESTÃO ───────────────────────────── */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0f1524] border border-[#182030] rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">Editar Questão</h3>
              <button onClick={() => setEditingQuestion(null)} className="text-slate-500 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1.5">Enunciado</label>
                <textarea value={editQStatement} onChange={e => setEditQStatement(e.target.value)} rows={4}
                  className="w-full bg-[#070a13] border border-[#182030] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1.5">Gabarito</label>
                  <div className="flex gap-2">
                    {(['C', 'E'] as const).map(a => (
                      <button key={a} onClick={() => setEditQAnswer(a)}
                        className={`flex-1 py-2 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                          editQAnswer === a
                            ? a === 'C' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-red-500/20 border-red-500 text-red-400'
                            : 'bg-[#070a13] border-[#182030] text-slate-400'
                        }`}>{a === 'C' ? 'Certo' : 'Errado'}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1.5">Dificuldade</label>
                  <select value={editQDifficulty} onChange={e => setEditQDifficulty(e.target.value as any)}
                    className="w-full bg-[#070a13] border border-[#182030] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500">
                    <option value="Fácil">Fácil</option>
                    <option value="Média">Média</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1.5">Disciplina</label>
                <input value={editQDiscipline} onChange={e => setEditQDiscipline(e.target.value)}
                  className="w-full bg-[#070a13] border border-[#182030] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1.5">Subtópico</label>
                <input value={editQSubtopic} onChange={e => setEditQSubtopic(e.target.value)}
                  className="w-full bg-[#070a13] border border-[#182030] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingQuestion(null)}
                className="flex-1 py-2.5 border border-white/[0.08] text-slate-400 rounded-xl text-sm font-bold cursor-pointer hover:text-white transition-all">
                Cancelar
              </button>
              <button onClick={handleSaveEditQuestion}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold cursor-pointer flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
                <Save className="w-4 h-4" /> Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
