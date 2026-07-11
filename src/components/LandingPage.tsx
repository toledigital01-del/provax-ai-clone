import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, CheckCircle, ArrowRight, ShieldAlert, Check,
  MessageSquare, Compass, Star, Award, BookOpen, Clock, Calendar, Layers,
  Sparkles, ListTodo, HelpCircle, Flame, CreditCard, ChevronRight, Menu, X,
  Sliders, TrendingUp, Scale, AlertTriangle, GraduationCap, ChevronDown, CheckSquare,
  Upload, FileText, Database, UserCheck, Zap, RefreshCw, BarChart3, ArrowRightLeft,
  PlayCircle, Bookmark, Quote
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
  const [legalPage, setLegalPage] = useState<null | 'terms' | 'privacy'>(null);


  // Playground interactive state
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<'dashboard' | 'treinar' | 'cronograma' | 'simulados'>('dashboard');
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [selectedTopic, setSelectedTopic] = useState('Art. 306 CTB - Embriaguez ao Volante');
  const [simulatedAnswer, setSimulatedAnswer] = useState<boolean | null>(null);
  const [isFlippedPlayground, setIsFlippedPlayground] = useState(false);
  const [selectedProfilePlayground, setSelectedProfilePlayground] = useState<string>('mini');
  const [missionChecked, setMissionChecked] = useState<boolean[]>([false, false, false]);

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

  if (legalPage) {
    const isTerms = legalPage === 'terms';
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#11182d] via-[#0d1424] to-[#080d19] text-slate-100 font-sans">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <button
            onClick={() => setLegalPage(null)}
            className="mb-8 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 uppercase tracking-widest cursor-pointer"
          >
            ← Voltar ao site
          </button>
          <h1 className="text-3xl font-black text-white mb-6">
            {isTerms ? 'Termos de Serviço' : 'Política de Privacidade'}
          </h1>
          <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
            {isTerms ? (
              <>
                <p>Ao utilizar a plataforma ProvaX AI, você concorda com os termos aqui descritos. A plataforma oferece ferramentas de estudo baseadas em inteligência artificial para candidatos ao concurso da Polícia Rodoviária Federal (PRF).</p>
                <p><strong className="text-white">1. Uso da plataforma.</strong> O acesso é pessoal e intransferível. É proibido compartilhar credenciais ou revender o serviço.</p>
                <p><strong className="text-white">2. Pagamentos e cancelamento.</strong> Assinaturas podem ser canceladas a qualquer momento pelo painel do usuário. Reembolsos seguem o Código de Defesa do Consumidor (7 dias).</p>
                <p><strong className="text-white">3. Conteúdo gerado por IA.</strong> Explicações, questões e sugestões produzidas pela Athena são apoio de estudo e não substituem material oficial do edital.</p>
                <p><strong className="text-white">4. Propriedade intelectual.</strong> Toda a interface, marca e códigos são de propriedade da ProvaX AI e protegidos por lei.</p>
                <p><strong className="text-white">5. Alterações.</strong> Estes termos podem ser atualizados a qualquer tempo, com aviso prévio de 15 dias por e-mail.</p>
                <p className="text-xs text-slate-500 pt-6">Última atualização: 11 de julho de 2026 · Dúvidas: contato@provaxai.com.br</p>
              </>
            ) : (
              <>
                <p>Sua privacidade é prioridade. Esta política descreve quais dados coletamos e como são tratados.</p>
                <p><strong className="text-white">1. Dados coletados.</strong> Nome, e-mail, progresso de estudos e histórico de interações com a Athena. Dados de pagamento são processados por parceiros PCI-DSS certificados; não armazenamos números de cartão.</p>
                <p><strong className="text-white">2. Uso dos dados.</strong> Personalização do cronograma, cálculo da probabilidade preditiva e melhoria contínua da IA. Não vendemos nem compartilhamos dados com terceiros para fins de marketing.</p>
                <p><strong className="text-white">3. LGPD.</strong> Você pode solicitar acesso, correção, portabilidade ou exclusão dos seus dados a qualquer momento por contato@provaxai.com.br.</p>
                <p><strong className="text-white">4. Cookies.</strong> Utilizamos cookies estritamente necessários para autenticação e preferências (tema claro/escuro).</p>
                <p><strong className="text-white">5. Segurança.</strong> Criptografia em trânsito (TLS) e em repouso. Autenticação com Supabase Auth. Backups diários redundantes.</p>
                <p className="text-xs text-slate-500 pt-6">Última atualização: 11 de julho de 2026 · Encarregado (DPO): contato@provaxai.com.br</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#11182d] via-[#0d1424] to-[#080d19] text-slate-100 font-sans selection:bg-amber-500/20 selection:text-white" id="landing-container">

      
      {/* 1 + 2. PRE-HEADER + NAVBAR — fixed container */}
      <div className="fixed top-0 left-0 right-0 z-50">

        {/* PRE-HEADER ALERT */}
        <div className="bg-gradient-to-r from-amber-600/30 via-slate-900 to-amber-600/30 text-slate-300 px-4 py-2 text-center text-xs tracking-wider flex items-center justify-center gap-2 border-b border-white/[0.04]">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-mono text-xs sm:text-sm">
            EDITAL PRF EM BREVE: <strong className="text-amber-400">Athena AI</strong> já mapeou todos os conteúdos — sua estratégia começa agora.
          </span>
        </div>

        {/* STICKY NAVBAR */}
        <nav className={`transition-all duration-300 ${
          isSticky
            ? 'bg-[#11182d]/95 shadow-2xl shadow-indigo-950/10 border-b border-white/[0.06] backdrop-blur-xl'
            : 'bg-[#11182d]/60 backdrop-blur-md border-b border-transparent'
        }`} id="landing-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24 sm:h-28">
            
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
              <button onClick={onLoginDirectly} className="text-[12.5px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">
                Entrar
              </button>
              <button 
                onClick={onStartOnboarding}
                className="px-4 py-1.5 text-[12px] font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-all cursor-pointer shadow-lg shadow-amber-500/10 hover:scale-[1.02] flex items-center gap-1.5"
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
              className="md:hidden border-t border-white/[0.05] bg-[#0a0e1a]/95 backdrop-blur-xl overflow-hidden"
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
                    className="w-full text-center py-2.5 text-xs text-slate-300 border border-white/10 rounded-lg bg-transparent font-medium"
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
      </div>{/* end fixed header container */}

      {/* Spacer: pre-header (~33px) + navbar (80px/96px) */}
      <div className="h-[129px] sm:h-[145px]" />

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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-mono font-bold text-amber-400 shadow-lg shadow-amber-950/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span>✦ Exclusivo para o edital da PRF</span>
              </div>

              {/* Core Heavy Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sans font-black tracking-tight text-white leading-[1.1]">
                A primeira IA estratégica criada para acelerar sua <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">aprovação</span> na PRF.
              </h1>

              {/* Precise Subheadline */}
              <p className="text-[#e2e8f0] text-lg sm:text-xl md:text-2xl leading-relaxed font-normal max-w-3xl">
                A <strong className="text-white font-bold">Athena</strong> lê o edital, mapeia suas fraquezas e monta sua estratégia de aprovação — baseada no perfil exato da banca <strong className="text-amber-400 font-bold">CEBRASPE</strong>. Sem chute. Sem desperdício de tempo.
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
                  <PlayCircle className="w-5 h-5 text-amber-400" />
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
                  <strong className="text-slate-300 text-sm font-semibold tracking-wide uppercase">Método Antigo (Estudo Passivo)</strong>
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

      {/* 5. INTERACTIVE PLAYGROUND — PÁGINAS REAIS DO DASHBOARD */}
      <section className="py-24 bg-[#0a0e1a] border-b border-white/[0.03] relative" id="playground">
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-mono uppercase text-amber-500 tracking-wider font-extrabold px-3 py-1 rounded-full bg-amber-500/10 inline-block">
              DEMONSTRAÇÃO INTERATIVA
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Veja a <span className="text-amber-500">Athena AI</span> trabalhando por você
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Navegue pelas páginas reais da plataforma e veja como cada módulo acelera sua aprovação.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Sidebar tabs */}
            <div className="lg:col-span-4 space-y-2">

              <button
                onClick={() => setActivePlaygroundTab('dashboard')}
                className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${
                  activePlaygroundTab === 'dashboard'
                    ? 'bg-amber-950/20 border-amber-500 text-white'
                    : 'bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activePlaygroundTab === 'dashboard' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.04] text-slate-400 group-hover:text-white'}`}>
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">Painel Principal</h4>
                    <p className="text-[10px] text-slate-500 group-hover:text-slate-400">Missão do dia + diagnóstico</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white" />
              </button>

              <button
                onClick={() => setActivePlaygroundTab('treinar')}
                className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${
                  activePlaygroundTab === 'treinar'
                    ? 'bg-amber-950/20 border-amber-500 text-white'
                    : 'bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activePlaygroundTab === 'treinar' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.04] text-slate-400 group-hover:text-white'}`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">Treinar — Questões</h4>
                    <p className="text-[10px] text-slate-500 group-hover:text-slate-400">Questões CEBRASPE reais</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white" />
              </button>

              <button
                onClick={() => setActivePlaygroundTab('cronograma')}
                className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${
                  activePlaygroundTab === 'cronograma'
                    ? 'bg-amber-950/20 border-amber-500 text-white'
                    : 'bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activePlaygroundTab === 'cronograma' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.04] text-slate-400 group-hover:text-white'}`}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">Cronograma Semanal</h4>
                    <p className="text-[10px] text-slate-500 group-hover:text-slate-400">Planejamento adaptativo por IA</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white" />
              </button>

              <button
                onClick={() => setActivePlaygroundTab('simulados')}
                className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${
                  activePlaygroundTab === 'simulados'
                    ? 'bg-amber-950/20 border-amber-500 text-white'
                    : 'bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activePlaygroundTab === 'simulados' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.04] text-slate-400 group-hover:text-white'}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">Simulador de Provas</h4>
                    <p className="text-[10px] text-slate-500 group-hover:text-slate-400">Exames com penalidade CEBRASPE</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white" />
              </button>

            </div>

            {/* Main preview panel */}
            <div className="lg:col-span-8 bg-white/[0.01] border border-white/[0.06] p-5 sm:p-6 rounded-2xl min-h-[420px] flex flex-col justify-between relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none" />

              {/* Browser chrome */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-mono text-slate-500 ml-3">provaxai.com.br/dashboard</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-400 border border-emerald-500/20">● ao vivo</span>
              </div>

              <div className="flex-1 flex flex-col">

                {/* ── PAINEL PRINCIPAL ── */}
                {activePlaygroundTab === 'dashboard' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Suíte de Planejamento Estratégico</p>
                        <h3 className="text-sm font-bold text-white mt-0.5">Bom dia, Candidato 👋</h3>
                      </div>
                      <span className="text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-1 rounded-lg font-bold">92 dias para PRF</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-950/70 border border-white/[0.06] rounded-xl p-3 text-center">
                        <p className="text-[9px] font-mono text-slate-500 uppercase">Nota Líquida</p>
                        <p className="text-xl font-black text-emerald-400 mt-0.5">+12</p>
                        <p className="text-[9px] text-slate-500">pts acumulados</p>
                      </div>
                      <div className="bg-slate-950/70 border border-white/[0.06] rounded-xl p-3 text-center">
                        <p className="text-[9px] font-mono text-slate-500 uppercase">Taxa de Acerto</p>
                        <p className="text-xl font-black text-amber-400 mt-0.5">78%</p>
                        <p className="text-[9px] text-slate-500">últimas 20 q.</p>
                      </div>
                      <div className="bg-slate-950/70 border border-white/[0.06] rounded-xl p-3 text-center">
                        <p className="text-[9px] font-mono text-slate-500 uppercase">Streak</p>
                        <p className="text-xl font-black text-orange-400 mt-0.5">🔥 5</p>
                        <p className="text-[9px] text-slate-500">dias seguidos</p>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 border border-white/[0.05] rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Missão do Dia</span>
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {missionChecked.filter(Boolean).length}/3 concluídas
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {[
                          { label: '10 questões de Legislação de Trânsito', type: 'questões', color: 'bg-indigo-500/10 text-indigo-400' },
                          { label: 'Revisar 5 flashcards de Direito Penal', type: 'revisão', color: 'bg-purple-500/10 text-purple-400' },
                          { label: 'Sessão Modo Foco — 25 minutos', type: 'teoria', color: 'bg-sky-500/10 text-sky-400' },
                        ].map((task, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              const next = [...missionChecked];
                              next[i] = !next[i];
                              setMissionChecked(next);
                            }}
                            className={`w-full flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
                              missionChecked[i]
                                ? 'bg-emerald-950/15 border-emerald-500/25 text-slate-500'
                                : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.10] text-slate-300'
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${missionChecked[i] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                              {missionChecked[i] && <Check className="w-2 h-2 text-white stroke-[3]" />}
                            </div>
                            <p className={`text-[11px] font-medium flex-1 truncate ${missionChecked[i] ? 'line-through opacity-50' : ''}`}>{task.label}</p>
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${task.color}`}>{task.type}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-950/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2">
                      <span className="text-sm shrink-0">🦉</span>
                      <div>
                        <p className="text-[10px] font-mono font-bold text-amber-400 mb-0.5">Recomendação Athena</p>
                        <p className="text-[11px] text-slate-300 leading-relaxed">Ritmo consistente. Foque em <strong className="text-white">Física Aplicada</strong> esta semana — 15 min/dia fecha o gap antes do próximo simulado.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TREINAR — QUESTÕES CEBRASPE ── */}
                {activePlaygroundTab === 'treinar' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-bold uppercase">Legislação de Trânsito</span>
                        <span className="text-[9px] font-mono bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 font-bold uppercase">Difícil</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">Questão 3 de 10</span>
                    </div>

                    <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }} />
                    </div>

                    <div className="bg-slate-950/60 border border-white/[0.07] rounded-xl p-4">
                      <p className="text-[9px] font-mono text-slate-500 uppercase mb-2 tracking-wider">Art. 306 CTB · Certo ou Errado?</p>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                        "Conduzir veículo com concentração de álcool igual ou superior a 6 decigramas por litro de sangue configura crime formal, cuja consumação independe de dano efetivo ao bem jurídico tutelado."
                      </p>
                    </div>

                    {simulatedAnswer === null ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setSimulatedAnswer(true)}
                          className="py-3 rounded-xl border-2 border-emerald-500/60 bg-emerald-950/10 hover:bg-emerald-950/30 text-emerald-400 text-xs font-bold font-mono transition-all hover:scale-[1.01]"
                        >
                          ✓ Certo
                        </button>
                        <button
                          onClick={() => setSimulatedAnswer(false)}
                          className="py-3 rounded-xl border border-red-500/40 bg-red-950/10 hover:bg-red-950/30 text-red-400 text-xs font-bold font-mono transition-all hover:scale-[1.01]"
                        >
                          ✕ Errado
                        </button>
                      </div>
                    ) : (
                      <div className={`rounded-xl p-4 border space-y-2 ${simulatedAnswer ? 'bg-emerald-950/15 border-emerald-500/30' : 'bg-red-950/15 border-red-500/30'}`}>
                        <p className={`text-xs font-bold ${simulatedAnswer ? 'text-emerald-400' : 'text-red-400'}`}>
                          {simulatedAnswer ? '🏆 Resposta correta! Gabarito: CERTO' : '❌ Gabarito: CERTO — você marcou Errado'}
                        </p>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          <strong>Athena:</strong> O Art. 306 CTB é crime de perigo abstrato. A consumação ocorre com a simples comprovação do nível de álcool, sem necessidade de dano concreto.
                        </p>
                        <button onClick={() => setSimulatedAnswer(null)} className="text-[10px] text-amber-400 hover:underline font-mono">
                          Próxima questão ↻
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-[10px] font-mono pt-1">
                      <span className="text-emerald-400 font-bold">✓ 2 corretas</span>
                      <span className="text-red-400 font-bold">✕ 0 erradas</span>
                      <span className="text-amber-400 font-bold ml-auto">Nota líquida: +2</span>
                    </div>
                  </div>
                )}

                {/* ── CRONOGRAMA SEMANAL ── */}
                {activePlaygroundTab === 'cronograma' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Semana atual · IA Adaptativo</p>
                        <h3 className="text-sm font-bold text-white mt-0.5">Cronograma Personalizado</h3>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                        <RefreshCw className="w-2.5 h-2.5 mr-1" /> Atualizado pela IA
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {[
                        { day: 'SEG', today: true, tasks: [{ name: 'Legislação de Trânsito', type: 'teoria', color: 'bg-indigo-500/10 text-indigo-400' }, { name: 'Língua Portuguesa', type: 'teoria', color: 'bg-purple-500/10 text-purple-400' }] },
                        { day: 'TER', today: false, tasks: [{ name: 'Direito Penal', type: 'questões', color: 'bg-amber-500/10 text-amber-400' }, { name: 'Raciocínio Lógico', type: 'teoria', color: 'bg-sky-500/10 text-sky-400' }] },
                        { day: 'QUA', today: false, tasks: [{ name: 'Legislação de Trânsito', type: 'questões', color: 'bg-indigo-500/10 text-indigo-400' }, { name: 'Dir. Administrativo', type: 'teoria', color: 'bg-teal-500/10 text-teal-400' }] },
                        { day: 'QUI', today: false, tasks: [{ name: 'Língua Portuguesa', type: 'questões', color: 'bg-purple-500/10 text-purple-400' }, { name: 'Dir. Processual Penal', type: 'teoria', color: 'bg-rose-500/10 text-rose-400' }] },
                        { day: 'SEX', today: false, tasks: [{ name: 'Legislação de Trânsito', type: 'teoria', color: 'bg-indigo-500/10 text-indigo-400' }, { name: 'Legislação Especial', type: 'revisão', color: 'bg-orange-500/10 text-orange-400' }] },
                        { day: 'SAB', today: false, tasks: [{ name: 'Revisão Geral', type: 'revisão', color: 'bg-emerald-500/10 text-emerald-400' }, { name: 'Simulado Completo', type: 'simulado', color: 'bg-red-500/10 text-red-400' }] },
                      ].map((row) => (
                        <div key={row.day} className={`flex items-center gap-3 p-2 rounded-lg border ${row.today ? 'bg-amber-950/15 border-amber-500/30' : 'bg-white/[0.01] border-white/[0.04]'}`}>
                          <div className={`w-8 text-center shrink-0 ${row.today ? 'text-amber-400' : 'text-slate-500'}`}>
                            <p className="text-[9px] font-mono font-bold uppercase">{row.day}</p>
                            {row.today && <div className="w-1 h-1 bg-amber-500 rounded-full mx-auto mt-0.5" />}
                          </div>
                          <div className="flex flex-wrap gap-1 flex-1">
                            {row.tasks.map((t, ti) => (
                              <span key={ti} className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${t.color}`}>
                                {t.name} <span className="opacity-60">· {t.type}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── SIMULADOR DE PROVAS ── */}
                {activePlaygroundTab === 'simulados' && (
                  <div className="space-y-3">
                    {simulationState === 'idle' && (
                      <>
                        <div>
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Escolha o modo de exame</p>
                          <h3 className="text-sm font-bold text-white mt-0.5">Simulador de Provas</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'mini', label: 'Mini Simulado', desc: '5 questões · 10 min', icon: '⚡' },
                            { id: 'completo', label: 'Simulado Completo', desc: '15 questões · 30 min', icon: '📋' },
                            { id: 'cebraspe', label: 'Foco CEBRASPE', desc: 'Trânsito · 5 min', icon: '🎯' },
                            { id: 'ia', label: 'IA Adaptativo', desc: 'Questões inéditas', icon: '🤖' },
                          ].map((sim) => (
                            <button
                              key={sim.id}
                              onClick={() => setSelectedProfilePlayground(sim.id)}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                selectedProfilePlayground === sim.id
                                  ? 'border-amber-500 bg-amber-950/15'
                                  : 'border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12]'
                              }`}
                            >
                              <span className="text-base block mb-1">{sim.icon}</span>
                              <p className="text-xs font-bold text-white">{sim.label}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{sim.desc}</p>
                            </button>
                          ))}
                        </div>

                        <div className="bg-slate-950/60 border border-white/[0.05] rounded-xl p-3 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-slate-400">Penalidade CEBRASPE: <strong className="text-white">1 errada anula 1 certa.</strong> Nota líquida calculada em tempo real.</p>
                        </div>

                        <button
                          onClick={handleStartSimulation}
                          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all hover:scale-[1.01]"
                        >
                          Iniciar Simulado
                        </button>
                      </>
                    )}

                    {simulationState === 'running' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-mono text-slate-500 uppercase">Em andamento</p>
                            <h3 className="text-sm font-bold text-white mt-0.5">Questão 2 de 5</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-mono text-slate-500 uppercase">Tempo</p>
                            <p className="text-lg font-black text-amber-400 font-mono">08:42</p>
                          </div>
                        </div>

                        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full animate-pulse" style={{ width: '40%' }} />
                        </div>

                        <div className="bg-slate-950/60 border border-white/[0.07] rounded-xl p-4 space-y-3">
                          <p className="text-[9px] font-mono text-slate-500 uppercase">Direito Penal · Médio</p>
                          <p className="text-xs text-slate-200 leading-relaxed font-medium">
                            "O crime culposo se caracteriza pela imprudência, negligência ou imperícia, sendo a responsabilidade penal do agente sempre subjetiva, independente do resultado produzido."
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="py-2 rounded-lg border border-white/[0.08] text-center text-xs font-bold font-mono text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 cursor-pointer transition-all">✓ Certo</div>
                            <div className="py-2 rounded-lg border border-white/[0.08] text-center text-xs font-bold font-mono text-slate-400 hover:border-red-500/50 hover:text-red-400 cursor-pointer transition-all">✕ Errado</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-emerald-400">✓ 1 correta</span>
                          <span className="text-red-400">✕ 0 erradas</span>
                          <span className="text-amber-400">Nota líquida: +1</span>
                        </div>
                      </div>
                    )}

                    {simulationState === 'completed' && (
                      <div className="space-y-3 text-center">
                        <div className="text-4xl">🏆</div>
                        <div>
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Simulado Concluído</p>
                          <h3 className="text-lg font-black text-white mt-1">4 de 5 corretas</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3">
                            <p className="text-sm font-black text-emerald-400">4</p>
                            <p className="text-[9px] text-slate-500">corretas</p>
                          </div>
                          <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3">
                            <p className="text-sm font-black text-red-400">1</p>
                            <p className="text-[9px] text-slate-500">errada</p>
                          </div>
                          <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3">
                            <p className="text-sm font-black text-amber-400">+3</p>
                            <p className="text-[9px] text-slate-500">nota líquida</p>
                          </div>
                        </div>
                        <div className="bg-amber-950/10 border border-amber-500/20 rounded-xl p-3 text-left">
                          <p className="text-[10px] font-mono text-amber-400 font-bold mb-1">🦉 Athena</p>
                          <p className="text-[11px] text-slate-300">Ótimo desempenho. Revise <strong className="text-white">Direito Penal</strong> — padrão recorrente da banca CEBRASPE.</p>
                        </div>
                        <button onClick={() => setSimulationState('idle')} className="text-[10px] text-amber-400 hover:underline font-mono">
                          Novo simulado ↻
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-white/[0.04] text-[10.5px] text-slate-500 flex justify-between items-center flex-wrap gap-2">
                <span>Interface 100% funcional no painel real da plataforma.</span>
                <button onClick={onStartOnboarding} className="text-amber-400 font-bold font-mono hover:underline inline-flex items-center gap-1">
                  Acessar Plataforma <ArrowRight className="w-3 h-3" />
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
              <span className="text-3xl sm:text-4xl font-black text-amber-500 block font-mono">12.000+</span>
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
              { icon: Bookmark, title: "Flashcards com 6 Modos", desc: "Fixação dinâmica por associação, memorização de Lei Seca e cartões inteligentes digitados pela mentora Athena." },
              { icon: Shield, title: "Simulador de Risco Ativo", desc: "Preveja o impacto da penalidade do CEBRASPE de -1 por erro. Aprenda taticamente quando deixar em branco." }
            ].map((feature, id) => {
              const IconComp = feature.icon;
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
                  <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold mt-1">Evolução Focada</p>
                </div>
                
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-lg font-bold text-slate-500">R$</span>
                  <span className="text-4xl font-black text-white">49,90</span>
                  <span className="text-xs text-slate-500">/mês</span>
                </div>

                <div className="h-[0.5px] bg-white/[0.06]" />

                <ul className="space-y-3.5 text-xs text-slate-300">
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

            {/* Plan 3: Athena Supreme (O Mais Vendido) */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-[#0e162f] to-[#0a0e1a] border-2 border-amber-500 rounded-3xl flex flex-col justify-between space-y-8 text-left relative shadow-2xl shadow-amber-500/[0.03]">
              
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 rounded-full text-[9px] font-mono font-black text-slate-950 tracking-widest uppercase block leading-none">
                A EXPERIÊNCIA DA EXCELÊNCIA
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                    Athena Supreme <Sparkles className="w-4 h-4 text-amber-500" />
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

      {/* 9. DEPOIMENTOS */}
      <section className="py-20 sm:py-28 bg-[#080d19] border-t border-white/[0.03]" id="depoimentos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-mono uppercase text-amber-400 tracking-wider font-extrabold block">PROVA SOCIAL</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Quem já estuda com a Athena
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">Candidatos reais, resultados reais.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Lucas Ferreira",
                role: "Aprovado PRF 2024 — 1ª fase",
                avatar: "LF",
                color: "from-amber-600 to-amber-800",
                text: "Em 2 meses com o ProvaX AI, minha média no simulado CEBRASPE foi de 58% para 79%. A Athena identificou minhas falhas em Legislação de Trânsito antes que eu percebesse."
              },
              {
                name: "Camila Souza",
                role: "Estudante dedicada — 6h/dia",
                avatar: "CS",
                color: "from-indigo-600 to-indigo-800",
                text: "O cronograma adaptativo mudou tudo. Antes eu ficava perdida entre matérias. Agora cada semana tem um foco claro e os flashcards reforçam exatamente o que eu esqueço."
              },
              {
                name: "Rafael Mendes",
                role: "Aprovado CONTRAN 2025",
                avatar: "RM",
                color: "from-emerald-700 to-emerald-900",
                text: "O simulador de risco do CEBRASPE é genial. Aprendi quando vale marcar e quando deixar em branco. Economizei mais de 8 pontos de penalidade na prova real."
              }
            ].map((t, i) => (
              <div key={i} className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col gap-5 hover:border-amber-500/20 transition-all">
                <Quote className="w-6 h-6 text-amber-500/40" />
                <p className="text-sm text-slate-300 leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/[0.04]">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-black text-white shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-[11px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. SEÇÃO FAQ ACCORDION (REFINADO) */}
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
              { q: "Posso utilizar meus próprios materiais de estudo?", a: "Sim, no plano Athena Supreme você pode anexar seus e-books e PDFs de cursinhos parceiros. Nossa IA lê o arquivo e gera automaticamente simulados e flashcards sobre o conteúdo." },
              { q: "Como funciona a garantia de reembolso?", a: "Oferecemos teste integral de 7 dias grátis. Além disso, se por qualquer razão você não estiver satisfeito após assinar, pode solicitar a devolução dentro do portal em até 7 dias, estornado via Stripe." },
              { q: "Preciso estudar todos os dias para ter resultado?", a: "Não necessariamente. A Athena adapta o cronograma ao seu ritmo real. Se você tiver apenas 1 hora por dia, ela prioriza os blocos de maior impacto na nota de corte. Consistência supera volume." },
              { q: "A plataforma funciona no celular?", a: "Sim. O ProvaX AI é totalmente responsivo e otimizado para mobile. Você pode resolver simulados, revisar flashcards e conversar com a Athena diretamente pelo smartphone, sem perder nenhuma funcionalidade." },
              { q: "Qual a diferença entre o plano Essencial e o Athena Supreme?", a: "O Essencial cobre o núcleo de estudos: simulados ilimitados, cronograma dinâmico e flashcards. O Athena Supreme adiciona suporte ilimitado 24h com a IA, upload de PDFs próprios, diagnóstico preditivo de nota de corte e acesso antecipado a novos módulos estratégicos." }
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
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
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
              <p className="text-[11px] font-sans text-slate-400 leading-relaxed max-w-sm">
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
                <li><a href="#precos" onClick={(e) => handleScrollToSection(e, 'precos')} className="hover:text-amber-500 transition-colors">Preços Premium</a></li>
              </ul>
            </div>

            {/* Column 3 - Compliancy Notes */}
            <div className="md:col-span-3 space-y-3 text-left">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block">Informações Legais</span>
              <ul className="space-y-2 font-sans text-slate-400">
                <li><button onClick={() => setLegalPage('terms')} className="hover:text-white cursor-pointer transition-colors text-left">Termos de Serviço</button></li>
                <li><button onClick={() => setLegalPage('privacy')} className="hover:text-white cursor-pointer transition-colors text-left">Políticas de Privacidade</button></li>

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

