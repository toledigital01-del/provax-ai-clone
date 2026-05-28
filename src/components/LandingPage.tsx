import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, CheckCircle, ArrowRight, ShieldAlert, Check, 
  MessageSquare, Compass, Star, Award, BookOpen, Clock, Calendar, Layers, 
  Sparkles, ListTodo, HelpCircle, Flame, CreditCard, ChevronRight, Menu, X,
  Sliders, TrendingUp, Scale, AlertTriangle, GraduationCap, ChevronDown, CheckSquare,
  Upload, FileText, Database, UserCheck, Zap, RefreshCw, BarChart3, ArrowRightLeft
} from 'lucide-react';
import Logo from './Logo';
// @ts-ignore
import dashboardMockup from '../assets/images/dashboard_mockup_1779633115616.png';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onLoginDirectly: () => void;
}

export default function LandingPage({ onStartOnboarding, onLoginDirectly }: LandingPageProps) {
  // Navigation & menu states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  // Playground interactive state
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<'edital' | 'questoes' | 'revisao' | 'diagnostico'>('edital');
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [selectedTopic, setSelectedTopic] = useState('Art. 306 CTB - Embriaguez ao Volante');
  const [simulatedAnswer, setSimulatedAnswer] = useState<boolean | null>(null);
  const [isFlippedPlayground, setIsFlippedPlayground] = useState(false);
  const [selectedProfilePlayground, setSelectedProfilePlayground] = useState<'trabalhador' | 'dedicado'>('trabalhador');

  // Sticky scroll list & bottom CTA trigger
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      if (window.scrollY > 500) {
        setShowFloatingCTA(true);
      } else {
        setShowFloatingCTA(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  // Run the playground simulation when changing tabs
  useEffect(() => {
    setSimulationState('idle');
    setSimulatedAnswer(null);
    setIsFlippedPlayground(false);
  }, [activePlaygroundTab]);

  const handleStartSimulation = () => {
    setSimulationState('running');
    setTimeout(() => {
      setSimulationState('completed');
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#11182d] via-[#0d1424] to-[#080d19] text-slate-100 font-sans selection:bg-amber-500/20 selection:text-white" id="landing-container">
      
      {/* 1. SEÇÃO DE CONDIÇÃO ESPECIAL (PRE-HEADER ALERT) */}
      <div className="bg-gradient-to-r from-amber-600/30 via-slate-900 to-amber-600/30 text-slate-300 px-4 py-2 sm:py-2.5 text-center text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 border-b border-white/[0.04] relative z-50">
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span className="font-mono text-sm">
          CONDIÇÃO DE RETRANCAS FECHADAS: Mentoria estratégica da <strong className="text-amber-400">Athena AI</strong> habilitada para novos usuários.
        </span>
      </div>

      {/* 2. STICKY NAVBAR (Linear/Stripe style) */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isSticky 
          ? 'bg-[#11182d]/95 shadow-2xl shadow-indigo-950/10 border-b border-white/[0.06] backdrop-blur-xl' 
          : 'bg-transparent border-b border-transparent'
      }`} id="landing-navbar" style={{ top: isSticky ? '0px' : 'auto' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Left Brand */}
            <div className="flex items-center gap-2 cursor-pointer opacity-95 hover:opacity-100 transition-opacity" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Logo variant="compact" theme="dark" />
            </div>

            {/* Navigation links */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              <a href="#diferencial" onClick={(e) => handleScrollToSection(e, 'diferencial')} className="text-[12.5px] text-slate-400 hover:text-white font-medium tracking-wide transition-colors">Diferencial</a>
              <a href="#playground" onClick={(e) => handleScrollToSection(e, 'playground')} className="text-[12.5px] text-slate-400 hover:text-white font-medium tracking-wide transition-colors">Como funciona</a>
              <a href="#funcionalidades" onClick={(e) => handleScrollToSection(e, 'funcionalidades')} className="text-[12.5px] text-slate-400 hover:text-white font-medium tracking-wide transition-colors">Metodologia</a>
              <a href="#precos" onClick={(e) => handleScrollToSection(e, 'precos')} className="text-[12.5px] text-slate-400 hover:text-white font-medium tracking-wide transition-colors">Preços</a>
            </div>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-5">
              <button onClick={onLoginDirectly} className="text-[12.5px] font-medium text-slate-350 hover:text-white transition-colors cursor-pointer">
                Entrar
              </button>
              <button 
                onClick={onStartOnboarding}
                className="px-4 py-1.5 text-[12px] font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-505 bg-amber-500 hover:bg-amber-400 rounded-lg transition-all cursor-pointer shadow-lg shadow-amber-500/10 hover:scale-[1.02] flex items-center gap-1.5"
                id="landing-signup-btn"
              >
                Inicie Grátis <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/[0.05] bg-[#0a0e1a] overflow-hidden"
              id="landing-mobile-dropdown"
            >
              <div className="px-6 pt-3 pb-8 space-y-4">
                <a href="#diferencial" onClick={(e) => handleScrollToSection(e, 'diferencial')} className="block text-sm text-slate-400 hover:text-white font-medium py-1">Diferencial</a>
                <a href="#playground" onClick={(e) => handleScrollToSection(e, 'playground')} className="block text-sm text-slate-400 hover:text-white font-medium py-1">Como funciona</a>
                <a href="#funcionalidades" onClick={(e) => handleScrollToSection(e, 'funcionalidades')} className="block text-sm text-slate-400 hover:text-white font-medium py-1">Metodologia</a>
                <a href="#precos" onClick={(e) => handleScrollToSection(e, 'precos')} className="block text-sm text-slate-400 hover:text-white font-medium py-1">Preços</a>
                
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.05]">
                  <button 
                    onClick={onLoginDirectly}
                    className="w-full text-center py-2.5 text-xs text-slate-305 border border-white/10 rounded-lg bg-transparent font-medium"
                  >
                    Entrar
                  </button>
                  <button 
                    onClick={onStartOnboarding}
                    className="w-full text-center py-2.5 text-xs text-slate-950 bg-amber-500 font-bold rounded-lg"
                  >
                    Estudar Grátis
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer to compensate for elements */}
      <div className="h-14 sm:h-16" />

      {/* 3. HERO SECTION (Stripe/Linear style with beautiful radial glows) */}
      <section className="relative py-20 sm:py-28 overflow-hidden border-b border-white/[0.03]">
        {/* Glow Backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-indigo-505/5 rounded-full blur-[90px] bg-indigo-600/5 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Column: Copywriting content */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-7 text-left">
              
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-505/10 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-mono font-bold text-amber-400 shadow-lg shadow-amber-950/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span>✦ Exclusivo para o edital da PRF</span>
              </div>

              {/* Core Heavy Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sans font-black tracking-tight text-white leading-[1.1]">
                A primeira IA estratégica criada para acelerar sua <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">aprovação</span> na PRF.
              </h1>

              {/* Precise Subheadline */}
              <p className="text-[#e2e8f0] text-lg sm:text-xl md:text-2xl leading-relaxed font-normal max-w-3xl">
                A <strong className="text-white font-bold">Athena</strong> analisa editais completos, mapeia suas fraquezas em tempo real e calcula automaticamente uma estratégia de estudos de alta performance baseada rigorosamente no perfil da banca <strong className="text-amber-400 font-bold">CEBRASPE</strong>. Estude o conteúdo certo, recorde antes de esquecer e treine com a penalidade real de prova.
              </p>

              {/* Action Rows */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 w-full sm:w-auto pt-4">
                <button 
                  onClick={onStartOnboarding}
                  className="px-10 py-5 text-base sm:text-lg font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Experimentar Grátis</span>
                  <ArrowRight className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                </button>
                
                <a 
                  href="#playground"
                  onClick={(e) => handleScrollToSection(e, 'playground')}
                  className="px-8 py-5 text-base font-bold text-slate-200 border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.08] hover:text-white rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-3"
                >
                  Ver Inteligência em Ação
                </a>
              </div>

              {/* Trust signals */}
              <div className="flex items-center gap-8 pt-3 font-mono text-xs sm:text-sm text-slate-400">
                <span className="flex items-center gap-2"><Check className="w-4.5 h-4.5 text-emerald-400 stroke-[2.5]" /> Sem cartão requerido</span>
                <span className="flex items-center gap-2"><Check className="w-4.5 h-4.5 text-emerald-400 stroke-[2.5]" /> Teste imediato de 7 dias</span>
              </div>
            </div>

            {/* Right Column: Dynamic Mockup Visualization using real dashboard image */}
            <div className="lg:col-span-5 mt-14 lg:mt-0 relative" id="hero-interactive-dashboard">
              {/* Outer decorative glowing ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-indigo-500 to-amber-500 rounded-[28px] opacity-25 blur-lg animate-pulse" />
              
              <div className="relative p-3 bg-gradient-to-b from-white/[0.1] to-white/[0.02] border border-white/[0.15] rounded-[26px] shadow-2xl transition-all duration-500 hover:scale-[1.015] group">
                
                {/* Floating active status indicator */}
                <div className="absolute top-6 left-6 z-20 bg-slate-950/85 border border-amber-500/40 text-amber-400 font-mono text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  🦉 Athena AI Monitorando ao Vivo
                </div>

                {/* Main Dashboard screenshot wrapper */}
                <div className="rounded-[18px] overflow-hidden border border-white/[0.1] relative bg-[#0e1629]">
                  <img 
                    src={dashboardMockup} 
                    alt="ProvaX AI Premium Dashboard Mockup" 
                    className="w-full h-auto object-cover block aspect-video sm:aspect-auto"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Decorative modern glass overlay at the bottom to transition beautifully */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0d1424] via-[#0d1424]/90 to-transparent p-5 pt-12 border-t border-white/[0.03]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Painel de estudos integrado</p>
                        <h4 className="text-sm font-bold text-white mt-0.5">Visão multifuncional da Athena</h4>
                      </div>
                      <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-md font-semibold">
                        Geração ativa habilitada
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SEÇÃO DE POSICIONAMENTO E COMPARAÇÃO (PRIME PROBLEMA) */}
      <section className="py-20 sm:py-28 bg-[#0a0e1a] border-b border-white/[0.03]" id="diferencial">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <span className="text-xs font-mono uppercase text-amber-500 tracking-wider font-extrabold block mb-2">EDUCATIONAL INTELLIGENCE</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Cursinhos tradicionais te dão 1.500 videoaulas. <br className="hidden sm:inline" />
            Nós te damos a <span className="text-amber-500">aprovação</span>.
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Plataformas de estudos antigas tratam todos os vestibulandos ou concurseiros da mesma forma. A Athena customiza cada minuto do seu dia para eficiência total.
          </p>

          {/* Comparison table */}
          <div className="mt-16 bg-white/[0.01] border border-white/[0.06] rounded-2xl overflow-hidden max-w-4xl mx-auto shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/[0.06] text-left">
              
              {/* Method Old */}
              <div className="md:col-span-6 p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-red-950/40 rounded-lg">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                  </div>
                  <strong className="text-slate-350 text-sm font-semibold tracking-wide uppercase">Método Antigo (Estudo Passivo)</strong>
                </div>
                
                <ul className="space-y-4 text-xs sm:text-sm text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                    <span><strong>Volume sem rumo:</strong> Assistir a centenas de horas de aulas teóricas com baixa fixação cerebral real.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                    <span><strong>Cronograma congelado:</strong> Planilhas genéricas em PDF que não se moldam às suas rotinas ou dificuldades semanais.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                    <span><strong>Descarte da curva:</strong> Sem lembrete ativo, seu cérebro deleta 70% do que você estudou após 72 horas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                    <span><strong>Métricas nulas:</strong> Você responde questões de forma aleatória sem calcular a nota de corte preditiva real.</span>
                  </li>
                </ul>
              </div>

              {/* Method ProvaX AI */}
              <div className="md:col-span-6 p-8 space-y-6 bg-amber-500/[0.01]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <strong className="text-white text-sm font-bold tracking-wide uppercase flex items-center gap-1.5">
                    ProvaX AI <span className="text-[10px] font-mono bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest leading-none">ATIVO</span>
                  </strong>
                </div>
                
                <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4.5 h-4.5 text-emerald-500 stroke-[3] shrink-0 mt-0.5" />
                    <span><strong>Precisão Cirúrgica:</strong> Estudo focado em blocos táticos de relevância histórica no CEBRASPE.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4.5 h-4.5 text-emerald-500 stroke-[3] shrink-0 mt-0.5" />
                    <span><strong>Planejador IA Dinâmico:</strong> Cronograma adaptativo que se reconstrói na segunda-feira baseado nessas falhas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4.5 h-4.5 text-emerald-500 stroke-[3] shrink-0 mt-0.5" />
                    <span><strong>Active Recall (Recuperação):</strong> Algoritmo de Spacing inteligente que aciona cartões de memorização programados.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4.5 h-4.5 text-emerald-500 stroke-[3] shrink-0 mt-0.5" />
                    <span><strong>Probabilidade Preditiva:</strong> Uma métrica única de aprovação baseada nas variações de notas de corte reais do cargo.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE PLAYGROUND "ATHENA IN ACTION" (WOW SECTIONS) */}
      <section className="py-24 bg-[#0a0e1a] border-b border-white/[0.03] relative" id="playground">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-mono uppercase bg-amber-550/15 text-amber-500 tracking-wider font-extrabold px-3 py-1 rounded-full bg-amber-500/10 inline-block">
              DEMONSTRAÇÃO INTERATIVA
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Veja a <span className="text-amber-500">Athena AI</span> trabalhando por você
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Explore o painel de simulação interativa e veja como nossa inteligência artificial resolve as principais etapas do seu aprendizado.
            </p>
          </div>

          {/* Tab Selector Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Navigation Tabs */}
            <div className="lg:col-span-4 space-y-2">
              <button
                onClick={() => setActivePlaygroundTab('edital')}
                className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${
                  activePlaygroundTab === 'edital' 
                    ? 'bg-amber-950/20 border-amber-500 text-white' 
                    : 'bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activePlaygroundTab === 'edital' ? 'bg-amber-505/20 text-amber-400 bg-amber-500/20' : 'bg-white/[0.04] text-slate-400 group-hover:text-white'}`}>
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">1 Mapeamento de Edital</h4>
                    <p className="text-[10px] text-slate-500 group-hover:text-slate-450">Análise de PDF estratégica</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-transform" />
              </button>

              <button
                onClick={() => setActivePlaygroundTab('questoes')}
                className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${
                  activePlaygroundTab === 'questoes' 
                    ? 'bg-amber-950/20 border-amber-500 text-white' 
                    : 'bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activePlaygroundTab === 'questoes' ? 'bg-amber-505/20 text-amber-400 bg-amber-500/20' : 'bg-white/[0.04] text-slate-400 group-hover:text-white'}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">2 Geração de Exercício</h4>
                    <p className="text-[10px] text-slate-500 group-hover:text-slate-450">Questões adaptativas CEBRASPE</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-transform" />
              </button>

              <button
                onClick={() => setActivePlaygroundTab('revisao')}
                className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${
                  activePlaygroundTab === 'revisao' 
                    ? 'bg-amber-950/20 border-amber-500 text-white' 
                    : 'bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activePlaygroundTab === 'revisao' ? 'bg-amber-505/20 text-amber-400 bg-amber-500/20' : 'bg-white/[0.04] text-slate-400 group-hover:text-white'}`}>
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">3 Revisão Espaçada</h4>
                    <p className="text-[10px] text-slate-500 group-hover:text-slate-450">Fixação profunda ativa</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-transform" />
              </button>

              <button
                onClick={() => setActivePlaygroundTab('diagnostico')}
                className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${
                  activePlaygroundTab === 'diagnostico' 
                    ? 'bg-amber-950/20 border-amber-500 text-white' 
                    : 'bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activePlaygroundTab === 'diagnostico' ? 'bg-amber-505/20 text-amber-400 bg-amber-500/20' : 'bg-white/[0.04] text-slate-400 group-hover:text-white'}`}>
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">4 Diagnóstico Predizer</h4>
                    <p className="text-[10px] text-slate-500 group-hover:text-slate-450">Risco e nota de corte real</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-transform" />
              </button>
            </div>

            {/* Simulated Live Action Window Console */}
            <div className="lg:col-span-8 bg-white/[0.01] border border-white/[0.06] p-6 sm:p-8 rounded-2xl min-h-[380px] flex flex-col justify-between relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none" />
              
              {/* Header inside simulated screen */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-mono text-slate-500 ml-4">ATHENA CORE SIMULATOR v4.0</span>
                </div>
                <div>
                  <span className="text-[10.5px] font-mono bg-slate-900 px-2 py-0.5 rounded text-amber-400 border border-white/[0.04]">
                    {activePlaygroundTab.toUpperCase()} ACTIVE
                  </span>
                </div>
              </div>

              {/* Dynamic Content Rendering based on selected tab */}
              <div className="flex-1 flex flex-col justify-center py-6">
                
                {/* 1. EDITAL WEB SIMULATOR */}
                {activePlaygroundTab === 'edital' && (
                  <div className="space-y-5">
                    {simulationState === 'idle' && (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-full border border-dashed border-[#F59E0B]/30 flex items-center justify-center mx-auto text-amber-500 bg-amber-500/5">
                          <FileText className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white">Carregue suas Noções ou Editais</h4>
                          <p className="text-[11px] text-slate-400">Simule o upload de um PDF com regras ou leis estratégicas para a Athena extrair.</p>
                        </div>
                        <button
                          onClick={handleStartSimulation}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-450 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-transform hover:scale-[1.01]"
                        >
                          Simular Upload e Análise da Athena
                        </button>
                      </div>
                    )}

                    {simulationState === 'running' && (
                      <div className="space-y-4 text-center">
                        <div className="flex justify-center">
                          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
                        </div>
                        <div className="font-mono text-[11px] text-slate-400 space-y-1">
                          <p className="animate-pulse">📂 Lendo arquivo de noções jurídicas...</p>
                          <p className="opacity-75">✦ Cruzando com lei seca e súmulas do CEBRASPE...</p>
                          <p className="opacity-50">⚡ Estruturando 15 cartões de aprendizagem adaptativos...</p>
                        </div>
                      </div>
                    )}

                    {simulationState === 'completed' && (
                      <div className="space-y-4 text-left bg-slate-950/60 p-4.5 rounded-xl border border-white/[0.04] animate-fade-in text-xs sm:text-xs">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono text-[10.5px]">
                          <CheckCircle className="w-4 h-4 text-emerald-400" /> PROVAS E EDITAL PARSADOS COM SUCESSO!
                        </div>
                        <div className="space-y-2 text-slate-300">
                          <p><strong>Edital mapeado:</strong> Polícia Rodoviária Federal - Bloco II e Legislação de Trânsito específica.</p>
                          <p className="text-slate-400"><strong>Resultado estratégico:</strong> Foram priorizados o Art. 306 (Crime de Trânsito) e Resoluções CONTRAN que representam 40% das notas históricas de trânsito em concursos anteriores.</p>
                        </div>
                        <button
                          onClick={() => setSimulationState('idle')}
                          className="text-[10px] text-amber-400 hover:underline font-mono"
                        >
                          Repetir simulação ↻
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. QUESTÕES POR IA WEB SIMULATOR */}
                {activePlaygroundTab === 'questoes' && (
                  <div className="space-y-4">
                    {simulationState === 'idle' && (
                      <div className="text-center space-y-4">
                        <div className="max-w-xs mx-auto space-y-2">
                          <label className="text-[11px] font-mono text-slate-500 uppercase block mb-1">Escolha o tópico de treinamento:</label>
                          <select
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            className="w-full bg-[#0a0e1a] border border-white/[0.08] text-slate-205 rounded-lg text-xs p-2 focus:outline-none focus:border-amber-500"
                          >
                            <option value="Art. 306 CTB - Embriaguez ao Volante">Art. 306 CTB - Embriaguez ao Volante</option>
                            <option value="Art. 144 CF - Segurança Pública">Art. 144 CF - Segurança Pública</option>
                            <option value="Física Aplicada - Colisão Inelástica">Física Aplicada - Colisão Inelástica</option>
                          </select>
                        </div>
                        <button
                          onClick={handleStartSimulation}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-transform hover:scale-[1.01]"
                        >
                          Gerar Questão Inédita via Athena AI
                        </button>
                      </div>
                    )}

                    {simulationState === 'running' && (
                      <div className="text-center space-y-3">
                        <div className="flex justify-center">
                          <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
                        </div>
                        <p className="font-mono text-[11px] text-slate-400 animate-pulse">
                          Formatando questão inédita no padrão CEBRASPE (Certo/Errado) para o tópico: <strong>{selectedTopic}</strong>...
                        </p>
                      </div>
                    )}

                    {simulationState === 'completed' && (
                      <div className="space-y-4 animate-fade-in text-left">
                        <span className="bg-amber-400/10 text-amber-450 border border-amber-500/20 text-amber-500 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                          Questão Inédita Gerada p/ {selectedTopic}
                        </span>
                        
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-slate-950/40 p-4 rounded-xl border border-white/[0.04]">
                          "Conforme dispositivo regulatório, conduzir veículo com concentração de álcool por litro de sangue igual ou superior a 6 decigramas resulta em crime trânsito formal, cuja consumação independe da ocorrência de sinistro ou dano efetivo."
                        </p>

                        {simulatedAnswer === null ? (
                          <div className="flex gap-4 pt-1">
                            <button
                              onClick={() => setSimulatedAnswer(true)}
                              className="flex-1 py-2 rounded-xl text-center border-2 border-emerald-500 bg-emerald-950/10 hover:bg-emerald-950/30 text-emerald-400 text-xs font-bold font-mono transition-transform hover:scale-[1.01]"
                            >
                              Certo (Verdadeiro!)
                            </button>
                            <button
                              onClick={() => setSimulatedAnswer(false)}
                              className="flex-1 py-2 rounded-xl text-center border border-white/[0.08] hover:border-slate-500 text-slate-400 hover:text-white text-xs font-bold font-mono transition-transform hover:scale-[1.01]"
                            >
                              Errado
                            </button>
                          </div>
                        ) : (
                          <div className="bg-slate-900 border border-white/[0.06] p-4.5 rounded-xl text-xs space-y-2 animate-fade-in relative">
                            {simulatedAnswer === true ? (
                              <p className="text-emerald-450 text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                                🏆 RESPOSTA CERTA! PARABÉNS!
                              </p>
                            ) : (
                              <p className="text-red-400 font-bold flex items-center gap-1.5 text-xs">
                                ❌ O gabarito correto era: Certo.
                              </p>
                            )}
                            <p className="text-slate-300 leading-relaxed">
                              <strong>Justificativa Athena:</strong> O artigo 306 do CTB define crime de perigo abstrato. A comprovação de decigramas estabelecidos em teste de etilômetro ou laudo clínico já consuma o delito criminal, não exigindo risco concreto de acidente. Mantenha este resgaste forte na mente!
                            </p>
                            <button
                              onClick={() => { setSimulatedAnswer(null); setSimulationState('idle'); }}
                              className="text-[10px] text-amber-400 hover:underline font-mono pt-1 block"
                            >
                              Gerar Nova Questão ↻
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. REVISÃO ESPAÇADA WEB SIMULATOR */}
                {activePlaygroundTab === 'revisao' && (
                  <div className="space-y-4">
                    <div className="text-center max-w-sm mx-auto space-y-5">
                      <p className="text-xs text-slate-400">Simule a interação de memorização sem as cores pretas pesadas de antes:</p>
                      
                      <div
                        onClick={() => setIsFlippedPlayground(!isFlippedPlayground)}
                        className={`p-6 rounded-2xl border text-center cursor-pointer transition-all h-36 flex flex-col justify-between items-center ${
                          isFlippedPlayground 
                            ? 'border-emerald-500 bg-emerald-950/10 shadow-lg shadow-emerald-500/5' 
                            : 'border-white/[0.08] hover:border-slate-500 bg-gradient-to-b from-white/[0.01] to-white/[0.03]'
                        }`}
                      >
                        <span className="text-[8.5px] font-mono uppercase bg-slate-900 border border-white/[0.06] px-2 py-0.5 rounded text-amber-400 font-bold tracking-wider mb-2">
                          {isFlippedPlayground ? 'RESPOSTA DA ATHENA' : 'PERGUNTA / TÓPICO'}
                        </span>
                        
                        <p className="text-xs sm:text-xs text-slate-200 leading-relaxed font-bold font-sans">
                          {isFlippedPlayground 
                            ? 'Pista simples: 100 km/h para automóveis, camionetas e motocicletas, e 90 km/h para os outros veículos.' 
                            : 'Pista simples: Qual o limite de velocidade padrão estabelecido na lei para veículos na ausência de sinalização?'}
                        </p>

                        <span className="text-[9.5px] font-mono text-slate-500 underline mt-2 block">
                          {isFlippedPlayground ? 'Clique para retornar' : 'Clique para Revelar Detalhes'}
                        </span>
                      </div>

                      {isFlippedPlayground && (
                        <div className="flex gap-3 justify-center pt-2 animate-fade-in">
                          <button
                            onClick={() => { setIsFlippedPlayground(false); }}
                            className="bg-red-950/20 border border-red-900/40 hover:bg-red-950/45 text-red-450 p-2.5 rounded-xl text-[11px] font-bold font-mono transition-colors text-red-500"
                          >
                            Eu esqueci
                          </button>
                          <button
                            onClick={() => { setIsFlippedPlayground(false); }}
                            className="bg-emerald-950/20 border border-emerald-900/40 hover:bg-emerald-950/45 text-emerald-450 p-2.5 rounded-xl text-[11px] font-bold font-mono transition-colors text-emerald-500"
                          >
                            Eu lembrei
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. DIAGNÓSTICO PREDITIVO WEB SIMULATOR */}
                {activePlaygroundTab === 'diagnostico' && (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-semibold">Perfil de preparação do aluno:</span>
                        <div className="flex gap-2 bg-slate-900 p-0.5 rounded-lg border border-white/[0.04]">
                          <button
                            onClick={() => setSelectedProfilePlayground('trabalhador')}
                            className={`px-3 py-1 text-[10.5px] rounded-md font-mono ${
                              selectedProfilePlayground === 'trabalhador' ? 'bg-[#0f152b] text-white border border-white/[0.05]' : 'text-slate-500 hover:text-white'
                            }`}
                          >
                            Carlos (Trabalha 6h/Dia)
                          </button>
                          <button
                            onClick={() => setSelectedProfilePlayground('dedicado')}
                            className={`px-3 py-1 text-[10.5px] rounded-md font-mono ${
                              selectedProfilePlayground === 'dedicado' ? 'bg-[#0f152b] text-white border border-white/[0.05]' : 'text-slate-500 hover:text-white'
                            }`}
                          >
                            Mariana (Dedicado 8h/Dia)
                          </button>
                        </div>
                      </div>

                      {/* Display Performance Predictive Output */}
                      <div className="bg-slate-950/80 border border-white/[0.05] p-5 rounded-2xl space-y-4 text-left animate-fade-in text-xs sm:text-xs">
                        <div className="flex justify-between items-center pb-2.5 border-b border-white/[0.04]">
                          <div>
                            <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">PLANO PREVISTO CEBRASPE</span>
                            <strong className="text-slate-100 text-xs sm:text-sm">Conselho Athena p/ Próximo Turno</strong>
                          </div>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono font-bold">
                            Nota Líquida: +78 Pontos
                          </span>
                        </div>

                        {selectedProfilePlayground === 'trabalhador' ? (
                          <div className="space-y-2 text-slate-300">
                            <p><strong>Carlos</strong> possui 3h úteis diárias. A Athena otimizou seu cronograma, aplicando <strong>Legislação de Trânsito</strong> (Carga Pesada) nos sábados e fatias de 45 minutos de micro-revisões ativas de Direito Penal durante a semana.</p>
                            <p className="text-slate-400">⭐ <strong>Estimativa de Aprovabilidade:</strong> 82% de probabilidade de passar se mantiver a consistência por mais 4 semanas.</p>
                          </div>
                        ) : (
                          <div className="space-y-2 text-slate-300">
                            <p><strong>Mariana</strong> possui 6h úteis diárias. Ela já completou 92% da teoria do Bloco I e Direito Administrativo. Athena elevou seu plano para <strong>Simulados Completos com Penalidades</strong> e frentes de Física Aplicada avançada.</p>
                            <p className="text-slate-400">⭐ <strong>Estimativa de Aprovabilidade:</strong> 94% de probabilidade histórica de classificação nas primeiras turmas da PRF.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Console Prompt CTA footer info */}
              <div className="mt-4 pt-4 border-t border-white/[0.04] text-[10.5px] text-slate-500 text-center flex justify-between items-center flex-wrap gap-2">
                <span>Esta simulação tática reflete 100% da lógica real do ProvaX AI.</span>
                <button
                  onClick={onStartOnboarding}
                  className="text-amber-400 font-bold font-mono hover:underline inline-flex items-center gap-1"
                >
                  Liberar Minhas Questões Reais <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. GRADE DE METRICAS E PROVA SOCIAL (PROVA SOCIAL) */}
      <section className="bg-[#0a0e1a] py-16 sm:py-20 border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm text-slate-400 font-mono uppercase tracking-wider">
            Candidatos de Alto Desempenho estudam em sintonia operacional
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto" id="social-metrics-matrix">
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-6 space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-500 block font-mono">1.240+</span>
              <span className="text-[11px] text-slate-400 block font-medium">Alunos em streak ativo</span>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-6 space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white block font-mono">82.3%</span>
              <span className="text-[11px] text-slate-400 block font-medium">Média de acerto real</span>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-6 space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white block font-mono">4.2h</span>
              <span className="text-[11px] text-slate-400 block font-medium">Tempo semanal poupado</span>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-6 space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-550 block font-mono text-amber-500">12.000+</span>
              <span className="text-[11px] text-slate-400 block font-medium">Questões CEBRASPE resolvidas</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GRADE DE FUNCIONALIDADES PREMIUM (REFINADA) */}
      <section className="py-20 sm:py-28 bg-[#0a0e1a] border-b border-white/[0.03]" id="funcionalidades">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto space-y-3 text-center mb-16">
            <span className="text-xs font-mono uppercase text-amber-400 tracking-wider font-extrabold block">TUDO INTEGRADO</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Uma Suíte Completa de Inteligência de Concursos
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Cada ferramenta foi taticamente criada para acelerar sua produtividade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Database, title: "Mapeamento Completo PRF", desc: "Varredura do edital focado na banca CEBRASPE, cobrindo Código de Trânsito, resoluções exclusivas e leis secas." },
              { icon: Calendar, title: "Cronograma IA Adaptativo", desc: "Gerado e recalculado dinamicamente toda semana com base na sua rotina e na calibragem de erros." },
              { icon: Zap, title: "Missão do Dia Calibrada", desc: "Sua folha de rotas diária contendo tarefas adaptativas de estudo ativo com impacto real previsto." },
              { icon: Layers, title: "Repetição Espaçada Inteligente", desc: "Resgate ativo de conceitos memorizados antes da curva natural de esquecimento te fazer recomeçar." },
              { icon: BookmarkLeafSimulated, title: "Flashcards com 6 Modos", desc: "Fixação dinâmica por associação, memorização de Lei Seca e cartões inteligentes digitados pela mentora Athena." },
              { icon: Shield, title: "Simulador de Risco Ativo", desc: "Preveja o impacto da penalidade do CEBRASPE de -1 por erro. Aprenda taticamente quando deixar em branco." }
            ].map((feature, id) => {
              const IconComp = feature.icon === BookmarkLeafSimulated ? Sparkles : feature.icon;
              return (
                <div key={id} className="p-6 bg-white/[0.01] border border-white/[0.05] rounded-xl hover:border-amber-500/40 hover:bg-white/[0.02] transition-all duration-300 scale-hover text-left space-y-4">
                  <div className="p-2.5 bg-amber-500/5 rounded-lg w-max border border-amber-500/10">
                    <IconComp className="w-5 h-5 text-amber-500" />
                  </div>
                  <strong className="block text-sm sm:text-base font-bold text-white">{feature.title}</strong>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Mock class to help compile leaf icon */}
      {/* 8. SEÇÃO DE PREÇOS TRANSPARENTES (PREMIUM MATRIX) */}
      <section className="py-20 sm:py-28 bg-[#0a0e1a]" id="precos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase text-amber-400 tracking-wider font-extrabold block">VALOR COGNITIVO</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Acelere sua rota até a nomeação
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Selecione o plano ideal para seu momento de estudos. Cancele quando desejar.
            </p>
          </div>

          {/* Test Drive Highlight Banner */}
          <div className="max-w-3xl mx-auto mb-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4.5 text-center text-xs sm:text-sm text-amber-300 font-medium">
            🎁 <strong>7 Dias de Teste Grátis Habilitados:</strong> Comece hoje sua mentoria ativa totalmente livre de risco.
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch" id="pricing-matrix">
            
            {/* Plan 1: Gratuito */}
            <div className="p-6 sm:p-8 bg-white/[0.01] border border-white/[0.06] rounded-3xl flex flex-col justify-between space-y-8 text-left">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Plano Inicial</h3>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mt-1">Gratuito p/ sempre</p>
                </div>
                
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-lg font-bold text-slate-500">R$</span>
                  <span className="text-4xl font-black text-white">0,00</span>
                  <span className="text-xs text-slate-550 text-slate-500">/mês</span>
                </div>

                <div className="h-[0.5px] bg-white/[0.06]" />

                <ul className="space-y-3.5 text-xs text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>5 questões simuladas diárias</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Plano de cronograma padrão genérico</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Suporte de mentoria limitado (3 msgs)</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={onStartOnboarding}
                className="w-full py-3.5 text-xs text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/[0.15] bg-white/[0.01] hover:bg-white/[0.03] font-bold rounded-xl transition-all cursor-pointer text-center"
              >
                Prosseguir Grátis
              </button>
            </div>

            {/* Plan 2: Essencial */}
            <div className="p-6 sm:p-8 bg-white/[0.01] border border-white/[0.06] rounded-3xl flex flex-col justify-between space-y-8 text-left relative">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Essencial PRF</h3>
                  <p className="text-[10px] font-mono text-amber-450 text-amber-500 uppercase tracking-widest font-bold mt-1">Evolução Focada</p>
                </div>
                
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-lg font-bold text-slate-500">R$</span>
                  <span className="text-4xl font-black text-white">49,90</span>
                  <span className="text-xs text-slate-500">/mês</span>
                </div>

                <div className="h-[0.5px] bg-white/[0.06]" />

                <ul className="space-y-3.5 text-xs text-slate-305 text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Resolução ilimitada de simulados</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Cronograma dinâmico e Missão Diária</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Todos os flashcards e suporte de revisões</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Mentoria limitada (50 mensagens diárias)</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={onStartOnboarding}
                className="w-full py-3.5 text-xs text-slate-905 bg-slate-100 hover:bg-slate-205 text-slate-900 font-bold rounded-xl transition-all cursor-pointer text-center"
              >
                Iniciar Teste Grátis
              </button>
            </div>

            {/* Plan 3: Athena Gold (O Mais Vendido) */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-[#0e162f] to-[#0a0e1a] border-2 border-amber-500 rounded-3xl flex flex-col justify-between space-y-8 text-left relative shadow-2xl shadow-amber-500/[0.03]">
              
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 rounded-full text-[9px] font-mono font-black text-slate-950 tracking-widest uppercase block leading-none">
                A EXPERIÊNCIA DA EXCELÊNCIA
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                    Athena Supreme <Sparkles className="w-4 h-4 text-amber-505 text-amber-505 text-amber-500" />
                  </h3>
                  <p className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold mt-1">Acesso Supremo Ilimitado</p>
                </div>
                
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-lg font-bold text-slate-500">R$</span>
                  <span className="text-4xl font-black text-white">97,00</span>
                  <span className="text-xs text-slate-500">/mês</span>
                </div>

                <div className="h-[0.5px] bg-white/[0.06]" />

                <ul className="space-y-3.5 text-xs text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0 mt-0.5" />
                    <span><strong>Suporte ilimitado da Athena AI 24h/dia</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0 mt-0.5" />
                    <span>Simulados inéditos infinitos criados sob demanda</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0 mt-0.5" />
                    <span>Diagnóstico de Risco e Nota de Corte adaptativa</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0 mt-0.5" />
                    <span>Parser de PDFs (Mapeador de Leitura Seletiva)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0 mt-0.5" />
                    <span>Acesso antecipado a novos módulos estratégico</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={onStartOnboarding}
                className="w-full py-3.5 text-xs text-slate-950 bg-amber-500 hover:bg-amber-400 font-black rounded-xl transition-all hover:scale-[1.015] cursor-pointer text-center shadow-lg shadow-amber-500/10"
              >
                Garantir Acesso Completo
              </button>
            </div>

          </div>

          <p className="text-center font-mono text-[10.5px] text-slate-500 mt-12 tracking-wide">
            Criptografia SSL de alta segurança · Processamento via Stripe · Cancelamento autônomo com um clique
          </p>

        </div>
      </section>

      {/* 9. SEÇÃO FAQ ACCORDION (REFINADO) */}
      <section className="py-20 bg-[#0a0e1a] border-t border-white/[0.03]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Perguntas Frequentes</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Tudo que você precisa saber sobre o ProvaX AI</p>
          </div>

          <div className="space-y-3" id="faq-accordion-container">
            {[
              { q: "O ProvaX AI é atualizado de acordo com o edital mais recente?", a: "Sim! A Athena é alimentada constantemente com as diretrizes do edital oficial mais recente da Polícia Rodoviária Federal, cobrindo Código de Trânsito, resoluções CONTRAN solicitadas e matérias atualizadas." },
              { q: "Como o simulador calcula a penalidade do CEBRASPE?", a: "No ProvaX AI, adotamos rigidamente o padrão oficial de uma questão errada anular uma certa. Caso marque uma opção incorreta, sua pontuação geral é subtraída em 1 ponto. Você desenvolve a maturidade de quando vale a pena chutar." },
              { q: "Posso utilizar meus próprios materiais de estudo?", a: "Sim, no plano Athena Gold você pode anexar seus e-books e PDFs de cursinhos parceiros. Nossa IA lê o arquivo e gera automaticamente simulados e flashcards sobre o conteúdo." },
              { q: "Como funciona a garantia de reembolso?", a: "Oferecemos teste integral de 7 dias grátis. Além disso, se por qualquer razão você não estiver satisfeito após assinar, pode solicitar a devolução dentro do portal em até 7 dias, estornado via Stripe." }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="border border-white/[0.04] bg-white/[0.01] rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-white hover:bg-white/[0.02]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${activeFaq === index ? 'rotate-180 text-amber-500' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/[0.04] bg-white/[0.005]"
                    >
                      <p className="p-4 sm:p-5 text-xs text-slate-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. CTA FINAL DE ALTA CONVERSÃO */}
      <section className="bg-gradient-to-b from-[#0a0e1a] to-[#0a0e1a] py-24 sm:py-32 text-center relative overflow-hidden border-t border-white/[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white">
            Não estude mais com intuições. <br />
            <span className="text-amber-500">Descubra a precisão cirúrgica.</span>
          </h2>
          <p className="text-slate-450 text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            Configure seu perfil cognitivo em menos de 2 minutos e inicie hoje sua nova rotina acelerada.
          </p>

          <button
            onClick={onStartOnboarding}
            className="px-10 py-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl shadow-2xl shadow-amber-550/10 hover:scale-[1.02] transition-all inline-flex items-center gap-2 text-base cursor-pointer"
          >
            Começar Agora Gratuitamente <ArrowRight className="w-5 h-5 text-slate-950 stroke-[3.5]" />
          </button>

          <div className="flex justify-center items-center gap-8 font-mono text-[10px] text-slate-500 pt-6">
            <span>✓ Cancelamento autônomo</span>
            <span>🔒 Stripe Checkout Seguro</span>
            <span>✦ Suporte estratégico Athena AI</span>
          </div>
        </div>
      </section>

      {/* 11. FOOTER (Raycast / Linear Style Minimalist) */}
      <footer className="bg-[#0a0e1a] text-slate-500 text-xs border-t border-white/[0.04] py-16 font-mono tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Column 1 - Brand */}
            <div className="md:col-span-6 space-y-4 text-left">
              <Logo variant="compact" theme="dark" />
              <p className="text-[11px] font-sans text-slate-450 text-slate-400 leading-relaxed max-w-sm">
                O ProvaX AI é a única plataforma de inteligência de concursos estrategicamente modelada para a aprovação na PRF. Desenvolvido por especialistas da área de segurança em parceria com a SYNTRO.
              </p>
            </div>

            {/* Column 2 - Sitemap Links */}
            <div className="md:col-span-3 space-y-3 text-left">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block">Produto</span>
              <ul className="space-y-2 font-sans text-slate-400">
                <li><a href="#diferencial" onClick={(e) => handleScrollToSection(e, 'diferencial')} className="hover:text-amber-500 transition-colors">Diferenciais</a></li>
                <li><a href="#playground" onClick={(e) => handleScrollToSection(e, 'playground')} className="hover:text-amber-500 transition-colors">Como Funciona</a></li>
                <li><a href="#funcionalidades" onClick={(e) => handleScrollToSection(e, 'funcionalidades')} className="hover:text-amber-500 transition-colors">Mapeamento Integrado</a></li>
                <li><a href="#precos" onClick={(e) => handleScrollToSection(e, 'precos')} className="hover:text-amber-505 hover:text-amber-500 transition-colors">Preços Premium</a></li>
              </ul>
            </div>

            {/* Column 3 - Compliancy Notes */}
            <div className="md:col-span-3 space-y-3 text-left">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block">Informações Legais</span>
              <ul className="space-y-2 font-sans text-slate-400">
                <li><span className="hover:text-white cursor-pointer transition-colors">Termos de Serviço</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Políticas de Privacidade</span></li>
                <li><span className="text-slate-500 text-[11px] block">Suporte: contato@provaxai.com.br</span></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/[0.04] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-600">
            <span>© 2026 ProvaX AI. Todos os direitos reservados. · Projetado sob rigorosa inteligência de estudos.</span>
            <span>SYNTRO INCORPORATED.</span>
          </div>
        </div>
      </footer>

      {/* 12. PERSISTENT FLOATING BOTTOM PERSISTENT MOBILE CTA BAR */}
      <AnimatePresence>
        {showFloatingCTA && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-4 inset-x-4 z-40 md:hidden bg-[#0a0e1a]/95 backdrop-blur-md border border-white/[0.08] rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-4"
            id="mobile-bottom-persistent-cta"
          >
            <div className="text-left font-mono">
              <span className="text-[9px] text-amber-500 font-bold block leading-none">PROVAX AI</span>
              <span className="text-[11.5px] text-white font-extrabold block mt-0.5">Estude Grátis p/ PRF</span>
            </div>
            <button 
              onClick={onStartOnboarding}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 rounded-xl flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>Ativar Grátis</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Dummy element identifier to safely handle the simulated placeholder icon property without breaking react execution
function BookmarkLeafSimulated() {
  return null;
}
