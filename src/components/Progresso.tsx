import React from 'react';
import { ProgressData } from '../types';
import { initHistory } from '../utils/progressHistory';
import { TrendingUp, Layers, ShieldCheck, Target, MinusCircle, BarChart3, Flame } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine
} from 'recharts';

interface ProgressoProps {
  progress: ProgressData;
  theme?: 'light' | 'dark';
}

export default function Progresso({ progress, theme = 'dark' }: ProgressoProps) {
  const isDark = theme !== 'light';

  const rawHistory = initHistory(progress);
  const chartData = rawHistory.map((entry, i) => ({
    name: i === rawHistory.length - 1 ? 'Hoje' : `Dia ${i + 1}`,
    aprovacao: entry.prob,
    acerto: entry.acerto,
    questoes: entry.questoes,
  }));

  // Mapa de nomes abreviados (máx ~18 chars para caber no eixo)
  const shortName = (name: string) => name
    .replace('Raciocínio Lógico-Matemático', 'Rac. Lógico-Mat.')
    .replace('Língua Portuguesa',            'Língua Portuguesa')
    .replace('Língua Estrangeira',           'Língua Estrangeira')
    .replace('Direito Constitucional',       'D. Constitucional')
    .replace('Direito Processual Penal',     'D. Proc. Penal')
    .replace('Legislação de Trânsito',       'Leg. de Trânsito')
    .replace('Direito Administrativo',       'D. Administrativo')
    .replace('Legislação Especial',          'Leg. Especial')
    .replace('Direito Penal',                'Direito Penal')
    .replace('Direitos Humanos',             'Direitos Humanos')
    .replace('Ética e Cidadania',            'Ética e Cidadania')
    .replace('Geopolítica',                  'Geopolítica')
    .replace('Informática',                  'Informática')
    .replace('Física',                       'Física');

  // Todas as 14 disciplinas — sem filtro de total > 0
  const ALL_DISCIPLINES = [
    'Legislação de Trânsito', 'Língua Portuguesa', 'Direito Constitucional',
    'Direito Administrativo', 'Raciocínio Lógico-Matemático', 'Direito Penal',
    'Legislação Especial', 'Direito Processual Penal', 'Ética e Cidadania',
    'Física', 'Informática', 'Geopolítica', 'Língua Estrangeira', 'Direitos Humanos',
  ];

  const disciplineChart = ALL_DISCIPLINES.map(name => {
    const d = progress.disciplinePerformance[name] || { total: 0, correct: 0, efficiency: 0, status: 'critical' as const };
    return { name: shortName(name), value: d.efficiency, status: d.status, total: d.total };
  }).sort((a, b) => a.value - b.value);

  const netScore  = progress.totalCorrect - progress.totalIncorrect;
  const riskRatio = progress.totalQuestionsAnswered > 0
    ? Math.round((progress.totalIncorrect / progress.totalQuestionsAnswered) * 100) : 0;
  const liquidEff = progress.totalQuestionsAnswered > 0
    ? Math.round((netScore / progress.totalQuestionsAnswered) * 100) : 0;

  const base = isDark ? 'bg-[#080b14] text-white' : 'bg-slate-50 text-slate-900';
  const card = isDark ? 'bg-[#0d1117] border border-white/[0.06] rounded-2xl' : 'bg-white border border-slate-200 rounded-2xl shadow-sm';
  const raised = isDark ? 'bg-[#131a27]' : 'bg-slate-50';
  const muted = isDark ? 'text-slate-400' : 'text-slate-500';
  const faint = isDark ? 'text-slate-500' : 'text-slate-400';
  const track = isDark ? 'bg-white/[0.06]' : 'bg-slate-200';
  const divider = isDark ? 'border-white/[0.06]' : 'border-slate-200';

  const statCards = [
    { label: 'Aprovação Preditiva', value: `${progress.currentApprovalProbability.toFixed(1)}%`, sub: 'Meta: 82%', color: 'text-indigo-400', icon: <Target className="w-4 h-4" />, pill: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' },
    { label: 'Streak', value: `${progress.daysConsecutive}d`, sub: 'dias consecutivos', color: 'text-amber-400', icon: <Flame className="w-4 h-4" />, pill: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
    { label: 'Taxa de Acerto', value: `${Math.round(progress.overallAccuracyRate)}%`, sub: `${progress.totalCorrect}C · ${progress.totalIncorrect}E`, color: 'text-emerald-400', icon: <BarChart3 className="w-4 h-4" />, pill: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
    { label: 'Cobertura Edital', value: `${progress.syllabusCoverage}%`, sub: 'do conteúdo', color: 'text-violet-400', icon: <Layers className="w-4 h-4" />, pill: 'bg-violet-500/10 border-violet-500/20 text-violet-400' },
  ];

  return (
    <div className={`min-h-full prf-theme ${isDark ? '' : 'light-theme'} ${base} font-sans`}>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black tracking-tight">Análise de Desempenho</h1>
          <p className={`text-sm mt-0.5 ${muted}`}>{progress.totalQuestionsAnswered} questões respondidas no total</p>
        </div>

        {/* ── Stats Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statCards.map(s => (
            <div key={s.label} className={`${card} p-4`}>
              <div className={`flex items-center gap-1.5 mb-2 ${s.color}`}>
                {s.icon}
                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${faint}`}>{s.label}</span>
              </div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className={`text-[10px] mt-1 ${faint}`}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Gráfico de Evolução ────────────────────────── */}
        <div className={`${card} p-5`}>
          <div className={`flex items-center justify-between mb-4 pb-3 border-b ${divider}`}>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${faint}`}>
                Curva de Aprovação
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {chartData.length > 1 ? `+${(chartData[chartData.length-1].aprovacao - chartData[0].aprovacao).toFixed(1)}%` : 'Início'} de evolução
            </span>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradAprov" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: isDark ? '#131a27' : '#fff', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, fontSize: 11 }}
                  formatter={(v: number) => [`${v.toFixed(1)}%`, 'Aprovação']}
                />
                <ReferenceLine y={82} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Corte 82%', fill: '#f59e0b', fontSize: 9, position: 'insideTopRight' }} />
                <Area type="monotone" dataKey="aprovacao" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradAprov)" dot={{ fill: '#fbbf24', r: 4, strokeWidth: 2, stroke: isDark ? '#0d1117' : '#fff' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Diagnóstico CEBRASPE + Semáforo ──────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* CEBRASPE */}
          <div className={`${card} p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${faint}`}>Diagnóstico CEBRASPE</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Nota Líquida', value: `${netScore > 0 ? '+' : ''}${netScore} pts`, sub: 'acertos − erros', color: netScore >= 0 ? 'text-emerald-400' : 'text-red-400' },
                { label: 'Eficiência Líquida', value: `${liquidEff}%`, sub: 'aproveitamento real', color: liquidEff >= 60 ? 'text-emerald-400' : 'text-amber-400' },
                { label: 'Taxa de Risco', value: `${riskRatio}%`, sub: 'ideal: < 20%', color: riskRatio < 20 ? 'text-emerald-400' : 'text-red-400' },
              ].map(s => (
                <div key={s.label} className={`${raised} rounded-xl px-4 py-3 flex items-center justify-between`}>
                  <div>
                    <p className="text-xs font-semibold text-white">{s.label}</p>
                    <p className={`text-[10px] ${faint}`}>{s.sub}</p>
                  </div>
                  <span className={`text-lg font-black font-mono ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
            <p className={`text-[10px] italic mt-3 pt-3 border-t ${divider} ${faint} text-center`}>
              "Na dúvida extrema, deixe em branco — errar vale -1."
            </p>
          </div>

          {/* Semáforo de matérias */}
          <div className={`${card} p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${faint}`}>Desempenho por Matéria</span>
            </div>
            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={disciplineChart} layout="vertical" margin={{ top: 2, right: 32, left: 0, bottom: 2 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#475569' }} width={140} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: isDark ? '#131a27' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, borderRadius: 10, fontSize: 11 }}
                    formatter={(v: number, _: string, props: any) => {
                      const total = props?.payload?.total ?? 0;
                      return total === 0 ? ['Sem questões', 'Eficiência'] : [`${v}%`, 'Eficiência'];
                    }}
                  />
                  <ReferenceLine x={60} stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={1.5} label={{ value: '60%', fill: '#f59e0b', fontSize: 9, position: 'top' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16} minPointSize={2}>
                    {disciplineChart.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={
                          entry.total === 0 ? (isDark ? '#334155' : '#cbd5e1') :
                          entry.status === 'safe'    ? '#10b981' :
                          entry.status === 'warning' ? '#f59e0b' : '#ef4444'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Tabela detalhada ───────────────────────────── */}
        <div className={`${card} p-5`}>
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${faint}`}>Detalhamento por Disciplina</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead>
                <tr className={`border-b ${divider}`}>
                  {['Matéria', 'Questões', 'Acertos', 'Eficiência', 'Status'].map(h => (
                    <th key={h} className={`pb-2.5 text-[10px] font-mono font-bold uppercase tracking-wider ${faint} ${h !== 'Matéria' ? 'text-center' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${divider}`}>
                {Object.entries(progress.disciplinePerformance).map(([subj, data]) => (
                  <tr key={subj} className={`${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'} transition-colors`}>
                    <td className="py-3 font-semibold text-white pr-4">{subj}</td>
                    <td className={`py-3 text-center font-mono ${muted}`}>{data.total}</td>
                    <td className="py-3 text-center font-mono text-emerald-400">{data.correct}</td>
                    <td className={`py-3 text-center font-mono font-bold ${
                      data.status === 'safe' ? 'text-emerald-400' :
                      data.status === 'warning' ? 'text-amber-400' : 'text-red-400'
                    }`}>{data.efficiency}%</td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        data.status === 'safe'    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        data.status === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          data.status === 'safe' ? 'bg-emerald-500' :
                          data.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        {data.status === 'safe' ? 'Seguro' : data.status === 'warning' ? 'Atenção' : 'Crítico'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
