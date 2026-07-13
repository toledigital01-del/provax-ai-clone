import React from 'react';
import { StudySchedule, ProgressData, StudyTask } from '../types';
import {
  Check, Play, ArrowRight, Shield, Target, Zap, MinusCircle,
  Clock, Brain, AlertTriangle, Flame, BookOpen, RefreshCw,
  Trophy, Star, TrendingUp, BarChart3, Sparkles, ChevronRight
} from 'lucide-react';
import StreakWidget from './StreakWidget';

interface DashboardProps {
  onboardingName: string;
  testDate: string;
  progress: ProgressData;
  schedule: StudySchedule;
  completedTasks: string[];
  onToggleTask: (taskId: string) => void;
  onNavigate: (tab: string) => void;
  onSelectTaskToTrain: (task: StudyTask) => void;
  theme?: 'light' | 'dark';
}

export default function Dashboard({
  onboardingName,
  testDate,
  progress,
  schedule,
  completedTasks,
  onNavigate,
  onSelectTaskToTrain,
  theme = 'dark',
}: DashboardProps) {
  const isDark = theme === 'dark';

  // ── Métricas ──────────────────────────────────────────────────
  const getDaysRemaining = () => {
    const target = new Date(testDate || '2026-09-01');
    const diff = Math.ceil((target.getTime() - new Date().getTime()) / 86400000);
    return diff > 0 ? diff : 0;
  };

  const totalAnswered = progress?.totalQuestionsAnswered ?? 0;
  const taxa           = progress?.overallAccuracyRate ?? 0;
  const streak         = progress?.daysConsecutive ?? 0;
  const totalCorrect   = progress?.totalCorrect ?? 0;
  const totalIncorrect = progress?.totalIncorrect ?? 0;
  const notaLiquida    = totalCorrect - totalIncorrect;
  const approvalProb   = progress?.currentApprovalProbability ?? 0;
  const CUT_SCORE      = 82;
  const minutosHoje    = progress?.minutosHoje ?? 0;
  const horasHoje      = Math.floor(minutosHoje / 60);
  const minsResto      = minutosHoje % 60;

  // ── Missão do Dia ─────────────────────────────────────────────
  const DAYS_PT = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  const todayName = DAYS_PT[new Date().getDay()];
  const todaySchedule = schedule?.weekly?.find(d =>
    d.dayOfWeek.toLowerCase().startsWith(todayName.toLowerCase().slice(0, 3))
  );

  const actIcon: Record<string, React.ReactNode> = {
    teoria:   <BookOpen  className="w-3.5 h-3.5" />,
    questões: <Target    className="w-3.5 h-3.5" />,
    revisão:  <RefreshCw className="w-3.5 h-3.5" />,
    simulado: <Trophy    className="w-3.5 h-3.5" />,
  };
  const actColor: Record<string, string> = {
    teoria: 'indigo', questões: 'violet', revisão: 'amber', simulado: 'red',
  };
  const actBorder: Record<string, string> = {
    teoria: 'border-l-indigo-500', questões: 'border-l-violet-500',
    revisão: 'border-l-amber-500', simulado: 'border-l-red-500',
  };
  const actText: Record<string, string> = {
    teoria: 'text-indigo-400', questões: 'text-violet-400',
    revisão: 'text-amber-400', simulado: 'text-red-400',
  };

  const goals = todaySchedule?.disciplines?.map((disc, idx) => {
    const taskId = `mission-${todayName}-${idx}`;
    const done = completedTasks.includes(taskId);
    return {
      id: taskId, label: disc.name,
      sublabel: disc.topic?.split('[')[0].trim(),
      duration: disc.duration, activityType: disc.activityType, done,
      onClick: () => {
        onSelectTaskToTrain({
          id: taskId, discipline: disc.name,
          activityType: disc.activityType as any,
          durationMinutes: disc.duration, completed: done, impactScore: 0.6,
          title: `${disc.name} — ${disc.topic?.split('[')[0].trim()}`,
          athenaJustification: `Tarefa do cronograma para ${todayName}.`,
        });
        onNavigate('treinar');
      },
    };
  }) ?? [
    { id: 'g1', label: 'Legislação de Trânsito', sublabel: 'Revisão dos artigos mais cobrados', duration: 60, activityType: 'questões', done: completedTasks.includes('g1'), onClick: () => { onSelectTaskToTrain({ id: 'g1', discipline: 'Legislação de Trânsito', activityType: 'questões', durationMinutes: 60, completed: false, impactScore: 0.8, title: 'Legislação de Trânsito', athenaJustification: 'Foco nas resoluções CONTRAN mais cobradas.' }); onNavigate('treinar'); } },
    { id: 'g2', label: 'Simulado rápido', sublabel: '10 questões padrão CEBRASPE', duration: 15, activityType: 'simulado', done: completedTasks.includes('g2'), onClick: () => onNavigate('simulados') },
  ];

  const completedGoals = goals.filter(g => g.done).length;
  const goalPercent    = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;
  const missionDone    = completedGoals === goals.length && goals.length > 0;

  // ── Diagnósticos ──────────────────────────────────────────────
  const dp = progress?.disciplinePerformance || {};
  const withAnswers = Object.entries(dp)
    .filter(([, v]) => v.total > 0)
    .map(([name, v]) => ({ name, rate: v.efficiency, status: v.status }))
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 3);

  const diagnostics = withAnswers.length > 0 ? withAnswers : [
    { name: 'Física', rate: 0, status: 'critical' as const },
    { name: 'Legislação de Trânsito', rate: 0, status: 'critical' as const },
    { name: 'Língua Portuguesa', rate: 0, status: 'critical' as const },
  ];

  const diagBarColor = (r: number) =>
    r < 50 ? 'bg-red-500' : r < 70 ? 'bg-amber-500' : 'bg-emerald-500';
  const diagTextColor = (r: number) =>
    r < 50 ? 'text-red-400' : r < 70 ? 'text-amber-400' : 'text-emerald-400';
  const diagStatus = (r: number) =>
    r < 50 ? 'Revisar urgente' : r < 70 ? 'Atenção' : 'Em dia ✓';

  const athenaText = diagnostics[0]?.rate < 50
    ? `Foque em ${diagnostics[0].name} esta semana — 15 min/dia de prática ativa fecham o gap antes do próximo simulado.`
    : `Bom desempenho geral. Mantenha a constância em ${diagnostics[0]?.name} para garantir aprovação.`;

  const base = isDark ? 'bg-[#080b14] text-white' : 'bg-slate-50 text-slate-900';
  const card = isDark
    ? 'bg-[#0d1117] border border-white/[0.06] rounded-2xl'
    : 'bg-white border border-slate-200 rounded-2xl shadow-sm';
  const cardRaised = isDark ? 'bg-[#131a27]' : 'bg-slate-50';
  const muted = isDark ? 'text-slate-400' : 'text-slate-500';
  const faint = isDark ? 'text-slate-500' : 'text-slate-400';
  const track = isDark ? 'bg-white/[0.06]' : 'bg-slate-200';

  return (
    <div className={`min-h-full ${base} font-sans`}>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* ── 1. HEADER ──────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Foco na Meta,{' '}
              <span className="text-indigo-400">{onboardingName || 'Recruta'}</span>
            </h1>
            <p className={`text-sm mt-0.5 ${muted}`}>
              Athena preparou sua agenda de alto impacto para hoje.
            </p>
          </div>

          {/* Contador de dias */}
          <div className={`${card} px-5 py-3 text-center shrink-0`}>
            <p className={`text-xs ${faint}`}>Prova em</p>
            <p className="text-3xl font-black text-white leading-none mt-1">{getDaysRemaining()}</p>
            <p className={`text-[11px] ${muted} mt-0.5`}>dias</p>
          </div>
        </div>

        {/* ── 2. MISSÃO DO DIA ───────────────────────────────── */}
        <div className={`${card} p-5`}>
          {/* Header da missão */}
          <div className="flex items-start justify-between gap-3 mb-4 relative">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full ${missionDone ? 'bg-emerald-400' : 'bg-indigo-400'} animate-pulse`} />
                <span className={`text-xs font-semibold ${missionDone ? 'text-emerald-400' : 'text-indigo-400'}`}>
                  {missionDone ? 'Missão concluída!' : `Missão de hoje · ${todayName}`}
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight">
                {missionDone ? 'Parabéns, Recruta! 🏆' : 'Sua agenda de hoje'}
              </h2>
              <p className={`text-xs mt-0.5 ${muted}`}>
                {completedGoals}/{goals.length} tarefas · {goals.reduce((s, g) => s + g.duration, 0)} min no total
              </p>
            </div>

            {/* Streak badge */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl shrink-0 ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
              <Flame className="w-4 h-4 text-amber-400" />
              <div className="text-right">
                <div className="text-lg font-black text-amber-400 leading-none">{streak}</div>
                <div className={`text-[9px] font-mono ${faint}`}>dias</div>
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="mb-4">
            <div className="flex justify-between text-[10px] font-mono mb-1.5">
              <span className={faint}>Progresso do dia</span>
              <span className={`font-bold ${missionDone ? 'text-emerald-400' : 'text-indigo-400'}`}>{Math.round(goalPercent)}%</span>
            </div>
            <div className={`h-1.5 ${track} rounded-full overflow-hidden`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${missionDone ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-indigo-600 to-indigo-400'}`}
                style={{ width: `${goalPercent}%` }}
              />
            </div>
          </div>

          {/* Lista de tarefas */}
          <div className="space-y-2">
            {goals.map(g => {
              const ac = actText[g.activityType] || 'text-indigo-400';
              const ab = actBorder[g.activityType] || 'border-l-indigo-500';
              return (
                <button
                  key={g.id}
                  onClick={g.onClick}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-l-[3px] ${ab} text-left transition-all cursor-pointer group
                    ${g.done
                      ? `${isDark ? 'bg-emerald-950/20 border border-emerald-500/10' : 'bg-emerald-50 border border-emerald-200'} opacity-80`
                      : `${isDark ? 'bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05]' : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'}`
                    }`}
                >
                  {/* Check / ícone */}
                  <span className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all
                    ${g.done ? 'bg-emerald-500 border-emerald-500' : `${isDark ? 'border-white/20' : 'border-slate-300'}`}`}>
                    {g.done
                      ? <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      : <span className={ac}>{actIcon[g.activityType]}</span>
                    }
                  </span>

                  {/* Texto */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${g.done ? `line-through ${muted}` : 'text-white'}`}>
                      {g.label}
                    </p>
                    {g.sublabel && (
                      <p className={`text-[11px] truncate mt-0.5 ${faint}`}>{g.sublabel}</p>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] ${faint} flex items-center gap-1`}>
                      <Clock className="w-3 h-3" />{g.duration}m
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${g.done
                      ? `${isDark ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`
                      : `${isDark ? `bg-white/[0.05] ${ac}` : 'bg-slate-200 text-slate-600'}`}`}>
                      {g.done ? '✓ feito' : g.activityType}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA principal */}
          <button
            onClick={() => missionDone ? onNavigate('progresso') : onNavigate('treinar')}
            className={`w-full mt-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer
              ${missionDone
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}
          >
            {missionDone
              ? <><Star className="w-4 h-4 fill-white" /> Ver meu progresso <ArrowRight className="w-4 h-4" /></>
              : <><Play className="w-4 h-4 fill-white" /> Continuar treinamento <ArrowRight className="w-4 h-4" /></>
            }
          </button>
        </div>

        {/* ── 3. PROBABILIDADE + STATS ───────────────────────── */}
        <div className={`${card} p-5`}>
          {/* Prob de aprovação */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className={`text-xs font-semibold ${approvalProb >= CUT_SCORE ? 'text-emerald-400' : 'text-indigo-400'}`}>
                Probabilidade de Aprovação PRF
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-3xl font-black leading-none ${approvalProb >= CUT_SCORE ? 'text-emerald-400' : 'text-indigo-400'}`}>
                  {approvalProb.toFixed(1)}%
                </span>
                <span className={`text-xs ${muted}`}>
                  {approvalProb >= CUT_SCORE ? '✓ acima do corte' : `faltam ${(CUT_SCORE - approvalProb).toFixed(1)}%`}
                </span>
              </div>
            </div>
            <div className={`text-right shrink-0 px-3 py-2 rounded-xl ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
              <p className={`text-[10px] font-mono ${faint}`}>Corte PRF</p>
              <p className="text-xl font-black text-amber-400">{CUT_SCORE}%</p>
            </div>
          </div>

          {/* Barra de aprovação */}
          <div className={`h-2 ${track} rounded-full overflow-visible relative mb-5`}>
            <div
              className={`h-full rounded-full transition-all duration-700 ${approvalProb >= CUT_SCORE ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-indigo-700 to-indigo-400'}`}
              style={{ width: `${Math.min(approvalProb, 100)}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-amber-400 rounded-full"
              style={{ left: `${CUT_SCORE}%` }}
            />
          </div>

          {/* Stats em grade 2x2 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Taxa de acerto', value: `${Math.round(taxa)}%`, sub: `${totalCorrect}C · ${totalIncorrect}E`, color: 'text-emerald-400', icon: <Target className="w-3.5 h-3.5" /> },
              { label: 'Nota Líquida', value: notaLiquida > 0 ? `+${notaLiquida}` : `${notaLiquida}`, sub: 'acertos − erros', color: notaLiquida >= 0 ? 'text-emerald-400' : 'text-red-400', icon: <MinusCircle className="w-3.5 h-3.5" /> },
              { label: 'Questões', value: `${totalAnswered}`, sub: 'respondidas', color: 'text-indigo-400', icon: <BarChart3 className="w-3.5 h-3.5" /> },
              { label: 'Foco hoje', value: minutosHoje > 0 ? `${horasHoje > 0 ? `${horasHoje}h` : ''}${minsResto > 0 ? `${minsResto}m` : ''}` : '—', sub: `${streak} dias streak`, color: 'text-amber-400', icon: <Zap className="w-3.5 h-3.5" /> },
            ].map(s => (
              <div key={s.label} className={`${cardRaised} rounded-xl p-3`}>
                <div className={`flex items-center gap-1.5 mb-1.5 ${s.color}`}>
                  {s.icon}
                  <span className={`text-[10px] font-medium ${faint}`}>{s.label}</span>
                </div>
                <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                <div className={`text-[10px] mt-0.5 ${faint}`}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. DIAGNÓSTICOS ────────────────────────────────── */}
        <div className={`${card} p-5`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${faint}`}>
              Diagnóstico estratégico
            </span>
          </div>

          <div className="space-y-4">
            {diagnostics.map(d => (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-white">{d.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${diagTextColor(d.rate)}`}>{Math.round(d.rate)}%</span>
                    <button
                      onClick={() => {
                        onSelectTaskToTrain({
                          id: `diag-${d.name}`, discipline: d.name,
                          activityType: 'questões', durationMinutes: 30,
                          completed: false, impactScore: 0.8,
                          title: `Treino focado: ${d.name}`,
                          athenaJustification: `${d.name} com ${Math.round(d.rate)}% — abaixo do necessário.`,
                        });
                        onNavigate('treinar');
                      }}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-all hover:scale-[1.02]
                        ${d.rate < 50
                          ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
                          : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20'}`}
                    >
                      Treinar →
                    </button>
                  </div>
                </div>
                <div className={`h-1.5 ${track} rounded-full overflow-hidden`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${diagBarColor(d.rate)}`}
                    style={{ width: `${Math.max(d.rate, 2)}%` }}
                  />
                </div>
                <p className={`text-[10px] mt-1 ${faint}`}>{diagStatus(d.rate)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. STREAK ──────────────────────────────────────── */}
        <StreakWidget
          daysConsecutive={streak}
          studyStreakHistory={progress?.studyStreakHistory ?? []}
          theme={theme}
          compact={false}
        />

        {/* ── 6. RECOMENDAÇÃO ATHENA ─────────────────────────── */}
        <div className={`rounded-2xl p-4 flex items-start gap-3 ${isDark ? 'bg-indigo-950/30 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-200'}`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-indigo-500/15' : 'bg-indigo-100'}`}>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-indigo-400 mb-1">
              Recomendação da Athena
            </p>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {athenaText}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
