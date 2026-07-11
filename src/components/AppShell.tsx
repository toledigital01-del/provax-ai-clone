import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass, Layers, BookOpen, Award, Clock, MessageSquare,
  TrendingUp, BookMarked, CreditCard, Shield, Sun, Moon,
  LogOut, Menu, X, ChevronLeft, Bell, Search, Flame,
  ChevronRight, Sparkles, User
} from 'lucide-react';
import Logo from './Logo';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
}

interface AppShellProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  userName: string;
  approvalProb: number;
  streak: number;
  subscriptionPlan: string;
  urgentCount?: number;
  isAdmin?: boolean;
  children: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',  label: 'Dashboard',           icon: <Compass className="w-4 h-4" /> },
  { id: 'edital',     label: 'Edital Verticalizado', icon: <Layers className="w-4 h-4" /> },
  { id: 'treinar',    label: 'Treinamento',          icon: <BookOpen className="w-4 h-4" /> },
  { id: 'simulados',  label: 'Simulados',            icon: <Award className="w-4 h-4" /> },
  { id: 'cronograma', label: 'Cronograma',           icon: <Clock className="w-4 h-4" /> },
  { id: 'athena',     label: 'Athena AI',            icon: <MessageSquare className="w-4 h-4" />, badge: '●' },
  { id: 'progresso',  label: 'Progresso',            icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'biblioteca', label: 'Biblioteca',           icon: <BookMarked className="w-4 h-4" /> },
  { id: 'planos',     label: 'Plano Pro',            icon: <CreditCard className="w-4 h-4" /> },
];

export default function AppShell({
  currentTab, onTabChange, onLogout, theme, onToggleTheme,
  userName, approvalProb, streak, subscriptionPlan, urgentCount = 0, isAdmin = false, children
}: AppShellProps) {

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);


  const isDark = theme === 'dark';

  // Fechar menu mobile ao trocar tab
  useEffect(() => { setMobileOpen(false); }, [currentTab]);

  // Fechar search com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(s => !s); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filteredNav = searchQuery
    ? NAV_ITEMS.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : NAV_ITEMS;

  const base = isDark
    ? 'bg-[#080b14] text-white'
    : 'bg-slate-50 text-slate-900';
  const sidebarBg = isDark ? 'bg-[#0a0d18]' : 'bg-white';
  const sidebarBorder = isDark ? 'border-white/[0.06]' : 'border-slate-200';
  const headerBg = isDark ? 'bg-[#080b14]/80' : 'bg-white/80';
  const navActive = isDark
    ? 'bg-indigo-600/15 text-white border-r-2 border-indigo-500'
    : 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600';
  const navIdle = isDark
    ? 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100';

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? 'w-72' : ''}`}>
      {/* Logo + colapso */}
      <div className={`flex items-center ${collapsed && !mobile ? 'justify-center px-3' : 'justify-between px-4'} py-4 border-b ${sidebarBorder}`}>
        {(!collapsed || mobile) && (
          <div className="cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <Logo variant="compact" theme={theme} />
          </div>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(c => !c)}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${isDark ? 'text-slate-500 hover:text-white hover:bg-white/[0.06]' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            {collapsed
              ? <ChevronRight className="w-4 h-4" />
              : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search (só expanded) */}
      {(!collapsed || mobile) && (
        <div className={`px-3 py-3 border-b ${sidebarBorder}`}>
          <button
            onClick={() => setSearchOpen(true)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${isDark ? 'bg-white/[0.04] text-slate-500 hover:bg-white/[0.07]' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1 text-left text-xs">Buscar...</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDark ? 'bg-white/[0.06] text-slate-500' : 'bg-slate-200 text-slate-400'}`}>⌘K</span>
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {(!collapsed || mobile) && (
          <p className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 pb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            Operações PRF
          </p>
        )}
        {NAV_ITEMS.map(item => {
          const isActive = currentTab === item.id || (item.id === 'treinar' && currentTab === 'contran');
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={collapsed && !mobile ? item.label : undefined}
              className={`w-full flex items-center gap-3 rounded-lg transition-all cursor-pointer select-none
                ${collapsed && !mobile ? 'justify-center px-2 py-2.5' : 'px-3 py-2'}
                ${isActive ? navActive : navIdle}`}
            >
              <span className="shrink-0">{item.icon}</span>
              {(!collapsed || mobile) && (
                <>
                  <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                  {item.id === 'athena' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  {item.id === 'planos' && subscriptionPlan === 'free' && (
                    <span className="text-[9px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                      PRO
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin — apenas para admins autenticados */}
      {isAdmin && (!collapsed || mobile) && (
        <div className={`px-3 py-2 border-t ${sidebarBorder}`}>
          <button
            onClick={() => onTabChange('admin')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isDark
                ? 'text-amber-500 hover:bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/20'
                : 'text-amber-600 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 animate-pulse" />
            <span>Painel Admin IA</span>
          </button>
        </div>
      )}


      {/* User info */}
      <div className={`p-3 border-t ${sidebarBorder}`}>
        {collapsed && !mobile ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-xs font-black text-white">
              {userName.slice(0, 1)}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-xs font-black text-white shrink-0">
              {userName.slice(0, 1)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <p className={`text-[10px] font-mono truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {subscriptionPlan === 'premium' ? '✦ Athena Supreme' : subscriptionPlan === 'essencial' ? 'Essencial PRF' : 'Plano Gratuito'}
              </p>
            </div>
            <button onClick={onLogout} title="Sair" className={`p-1.5 rounded-lg cursor-pointer transition-all ${isDark ? 'text-slate-600 hover:text-red-400 hover:bg-red-950/20' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`h-screen flex overflow-hidden ${base}`}>

      {/* ── Sidebar Desktop ─────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={`hidden lg:flex flex-col shrink-0 border-r ${sidebarBg} ${sidebarBorder} overflow-hidden`}
      >
        <SidebarContent />
      </motion.aside>

      {/* ── Sidebar Mobile ──────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col border-r ${sidebarBg} ${sidebarBorder} lg:hidden`}
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className={`${headerBg} backdrop-blur-xl border-b ${sidebarBorder} px-4 lg:px-6 py-3 flex items-center gap-3 shrink-0 sticky top-0 z-30`}>
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(true)}
            className={`lg:hidden p-2 rounded-lg cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb / título */}
          <div className="flex-1 hidden sm:block">
            <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {NAV_ITEMS.find(i => i.id === currentTab)?.label || 'Dashboard'}
            </p>
          </div>

          {/* Busca */}
          <button
            onClick={() => setSearchOpen(true)}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${isDark ? 'bg-white/[0.04] text-slate-500 hover:bg-white/[0.07] border border-white/[0.06]' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 border border-slate-200'}`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs">Buscar</span>
            <span className={`text-[10px] font-mono px-1 py-0.5 rounded ${isDark ? 'bg-white/[0.06]' : 'bg-slate-200'}`}>⌘K</span>
          </button>

          {/* Métricas rápidas */}
          <div className="flex items-center gap-2">
            {/* Streak */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold ${isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>
              <Flame className="w-3.5 h-3.5" />
              <span>{streak}d</span>
            </div>

            {/* Aprovação */}
            <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600'}`}>
              <span>{approvalProb.toFixed(1)}%</span>
            </div>

            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(v => !v)}
                className={`relative p-2 rounded-lg cursor-pointer transition-all ${isDark ? 'text-slate-500 hover:text-white hover:bg-white/[0.06]' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
              >
                <Bell className="w-4 h-4" />
                {urgentCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              {notifOpen && (
                <div className={`absolute right-0 top-full mt-2 w-72 rounded-xl border shadow-xl z-40 ${isDark ? 'bg-[#0d1117] border-white/[0.08]' : 'bg-white border-slate-200'}`}>
                  <div className={`px-4 py-3 border-b ${sidebarBorder}`}>
                    <p className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Notificações</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Você está em dia. Nenhuma notificação nova.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tema */}
            <button
              onClick={onToggleTheme}
              title="Alternar tema"
              className={`p-2 rounded-lg cursor-pointer transition-all ${isDark ? 'text-slate-500 hover:text-white hover:bg-white/[0.06]' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Avatar → Meu Plano */}
            <button
              onClick={() => onTabChange('planos')}
              title="Meu plano"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-xs font-black text-white cursor-pointer shrink-0 hover:scale-105 transition-transform"
            >
              {userName.slice(0, 1)}
            </button>
          </div>
        </header>


        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* ── Search Modal ────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4"
            >
              <div className={`rounded-2xl border shadow-2xl overflow-hidden ${isDark ? 'bg-[#0d1117] border-white/[0.1]' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                  <Search className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar módulo..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                  />
                  <kbd className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDark ? 'bg-white/[0.06] text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                    ESC
                  </kbd>
                </div>
                <div className="py-2">
                  {filteredNav.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">Nenhum resultado</p>
                  ) : filteredNav.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { onTabChange(item.id); setSearchOpen(false); setSearchQuery(''); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all cursor-pointer text-left ${isDark ? 'text-slate-300 hover:bg-white/[0.06]' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
