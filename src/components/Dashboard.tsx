import React from 'react';
import { StudySchedule, ProgressData, StudyTask } from '../types';
import { Check, Play, ArrowRight, Shield, Target, Zap, MinusCircle, CalendarDays, Clock, Brain, AlertTriangle } from 'lucide-react';

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

// Palette — PRF Blue
const BLUE = '#1B4FD8';
const BLUE_DARK = '#1339A8';
const BLUE_SOFT = '#EEF3FF';
const BLUE_BORDER = '#BFDBFE';
const BLUE_ICON_BG = '#DBEAFE';
const BLUE_ICON_BORDER = '#93C5FD';
const ORANGE = '#E8A020'; // kept for streak + critical badge + mid diagnostics
const GREEN = '#2D9E6B';
const RED = '#C0392B';
const RED_SOFT = '#E74C3C';
const TEXT = '#1A1A1A';
const MUTED = '#888';

export default function Dashboard({
  onboardingName,
  testDate,
  progress,
  schedule,
  onNavigate,
  onSelectTaskToTrain,
  theme = 'dark',
}: DashboardProps) {
  const isDark = theme === 'dark';
  // Countdown — placeholder target 2026-09-01
  const getDaysRemaining = () => {
    const target = new Date(testDate || '2026-09-01');
    const today = new Date();
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const totalAnswered = progress?.totalQuestionsAnswered ?? 0;
  const taxa = progress?.overallAccuracyRate ?? 0;
  const streak = progress?.daysConsecutive ?? 0;
  const totalCorrect = progress?.totalCorrect ?? 0;
  const totalIncorrect = progress?.totalIncorrect ?? 0;
  const notaLiquida = totalCorrect - totalIncorrect;
  const approvalProb = progress?.currentApprovalProbability ?? 0;
  const CUT_SCORE = 82; // mediana histórica de corte PRF
  const minutosHoje = progress?.minutosHoje ?? 0;
  const horasHoje = Math.floor(minutosHoje / 60);
  const minsResto = minutosHoje % 60;

  // Mission goals
  const goals = [
    {
      id: 'g1',
      label: '10 questões de Legislação',
      done: totalAnswered >= 10,
      status: totalAnswered >= 10 ? 'concluído' : `${Math.min(totalAnswered, 10)}/10`,
      onClick: () => {
        onSelectTaskToTrain({
          id: 'dash-mission-questoes',
          discipline: 'Legislação de Trânsito',
          activityType: 'questões',
          durationMinutes: 60,
          completed: false,
          impactScore: 0.8,
          title: '10 questões de Legislação de Trânsito',
          athenaJustification: 'Foco em legislação para consolidar o bloco de maior peso na PRF.',
        });
        onNavigate('treinar');
      },
    },
    {
      id: 'g2',
      label: 'Revisar 5 flashcards',
      done: false,
      status: '0/5',
      onClick: () => onNavigate('biblioteca'),
    },
    {
      id: 'g3',
      label: 'Sessão Modo Foco 25 min',
      done: false,
      status: 'pendente',
      onClick: () => {
        onSelectTaskToTrain({
          id: 'dash-mission-foco',
          discipline: 'Modo Foco',
          activityType: 'teoria',
          durationMinutes: 25,
          completed: false,
          impactScore: 0.5,
          title: 'Sessão Modo Foco — 25 minutos',
          athenaJustification: 'Bloco de concentração profunda para fixação do conteúdo do dia.',
        });
        onNavigate('treinar');
      },
    },
  ];

  const completedGoals = goals.filter((g) => g.done).length;
  const goalPercent = (completedGoals / goals.length) * 100;

  // Diagnostics — top 3 weakest disciplines that have answers
  const dp = progress?.disciplinePerformance || {};
  const withAnswers = Object.entries(dp)
    .filter(([, v]) => v.total > 0)
    .map(([name, v]) => ({ name, rate: v.efficiency }))
    .sort((a, b) => a.rate - b.rate);

  const diagnostics =
    withAnswers.length > 0
      ? withAnswers.slice(0, 3)
      : [
          { name: 'Física Geral', rate: 0 },
          { name: 'Legislação', rate: 0 },
          { name: 'Língua Port.', rate: 0 },
        ];

  const diagColor = (r: number) => (r < 50 ? RED_SOFT : r < 70 ? ORANGE : GREEN);
  const diagStatus = (r: number) =>
    r < 50 ? 'Revisar urgente' : r < 70 ? 'Atenção' : 'Em dia ✓';

  // Athena recommendation based on worst discipline
  const worst = diagnostics[0];
  const athenaText =
    worst.rate < 50
      ? `Seu ritmo semanal está consistente. Foque em ${worst.name} esta semana — 15 min/dia de prática ativa fecham o gap antes do próximo simulado.`
      : `Bom desempenho geral. Mantenha a constância em ${worst.name} para garantir aprovação no próximo simulado.`;

  const BG         = isDark ? '#0B1120' : '#F5F3EE';
  const SURFACE    = isDark ? '#111827' : '#ffffff';
  const BORDER     = isDark ? '#1F2D45' : '#E8E0D0';
  const TXT        = isDark ? '#F1F5F9' : TEXT;
  const MTXT       = isDark ? '#64748B' : MUTED;
  const TRACK      = isDark ? '#1F2D45' : '#E5EAF2';
  const DIAG_TRACK = isDark ? '#1F2D45' : '#F1ECE1';
  const ITEM_BG    = isDark ? '#1A2540' : '#FAF7F0';
  const BLUE_SOFT_D  = isDark ? '#0D1F3C' : BLUE_SOFT;
  const BLUE_BOR_D   = isDark ? '#1F2D45' : BLUE_BORDER;

  const wrapperStyle: React.CSSProperties = {
    background: BG,
    minHeight: '100%',
    padding: '18px 16px',
    fontFamily: '"DM Sans", system-ui, sans-serif',
    color: TXT,
  };
  const card: React.CSSProperties = {
    background: SURFACE,
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    boxShadow: isDark ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.07)',
    padding: 18,
  };

  return (
    <div style={wrapperStyle}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, color: MTXT, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Suíte de Planejamento Estratégico
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 4px', color: TXT, letterSpacing: '-0.01em' }}>
              Foco na Meta, <span style={{ color: BLUE }}>{onboardingName || 'Recruta'}</span>
            </h1>
            <p style={{ fontSize: 13, color: MTXT, margin: 0 }}>
              Athena compilou sua agenda de alto impacto para hoje.
            </p>
          </div>
          <div style={{ ...card, padding: '10px 16px', textAlign: 'center', minWidth: 110 }}>
            <div style={{ fontSize: 10, color: MTXT, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
              Prova Oficial
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: TXT, lineHeight: 1.1, margin: '2px 0' }}>
              {getDaysRemaining()}
            </div>
            <div style={{ fontSize: 11, color: MTXT }}>dias restantes</div>
          </div>
        </div>

        {/* SPACED REPETITION ALERT */}
        {(() => {
          // Heurística Leitner: derivada do volume respondido + streak
          const base = Math.min(Math.floor(totalAnswered / 5), 18);
          const dueFlashcards = Math.max(base + Math.min(streak, 4), totalAnswered > 0 ? 3 : 0);
          const overdue = Math.max(Math.floor(dueFlashcards * 0.3), dueFlashcards > 0 ? 1 : 0);
          const urgency = overdue >= 5 ? 'high' : overdue >= 2 ? 'mid' : 'low';

          if (dueFlashcards === 0) return null;

          const palette = {
            high: { bg: isDark ? '#2A1010' : '#FDECEC', border: isDark ? '#4A1515' : '#F5B7B1', accent: RED, iconBg: isDark ? '#3A1515' : '#FADBD8' },
            mid: { bg: isDark ? '#2A1E0A' : '#FFF6E5', border: isDark ? '#4A3010' : '#F5D8A0', accent: ORANGE, iconBg: isDark ? '#3A2810' : '#FCE9C7' },
            low: { bg: BLUE_SOFT_D, border: BLUE_BOR_D, accent: BLUE, iconBg: isDark ? '#0D1F3C' : BLUE_ICON_BG },
          }[urgency];

          return (
            <div
              style={{
                background: palette.bg,
                border: `1px solid ${palette.border}`,
                borderLeft: `4px solid ${palette.accent}`,
                borderRadius: 14,
                padding: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: palette.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                <Brain size={20} color={palette.accent} />
                {urgency === 'high' && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      background: RED,
                      color: '#fff',
                      borderRadius: '50%',
                      width: 16,
                      height: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AlertTriangle size={9} />
                  </span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 10, color: palette.accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
                  Revisão espaçada · Leitner
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: TXT, lineHeight: 1.35 }}>
                  Você tem <span style={{ color: palette.accent }}>{dueFlashcards} flashcards</span> para revisar hoje
                  {overdue > 0 && (
                    <span style={{ color: MTXT, fontWeight: 500 }}>
                      {' '}— <span style={{ color: RED, fontWeight: 700 }}>{overdue} atrasados</span>
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: MTXT, marginTop: 2 }}>
                  {urgency === 'high'
                    ? 'Risco de esquecimento alto. Revise antes da próxima sessão.'
                    : urgency === 'mid'
                    ? 'Cartões entrando na zona de esquecimento — 8 min resolvem.'
                    : 'Mantenha o ciclo. Curva de retenção em dia.'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('biblioteca')}
                style={{
                  background: palette.accent,
                  color: '#fff',
                  border: 'none',
                  padding: '9px 14px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'inherit',
                  flexShrink: 0,
                }}
              >
                Revisar agora <ArrowRight size={13} />
              </button>
            </div>
          );
        })()}



        {/* PROBABILIDADE DE APROVAÇÃO */}
        <div
          style={{
            ...card,
            background: approvalProb >= CUT_SCORE
              ? isDark ? 'linear-gradient(135deg, #0D2B1E 0%, #111827 100%)' : 'linear-gradient(135deg, #E7F6EE 0%, #fff 100%)'
              : isDark ? `linear-gradient(135deg, ${BLUE_SOFT_D} 0%, #111827 100%)` : `linear-gradient(135deg, ${BLUE_SOFT} 0%, #fff 100%)`,
            border: `1px solid ${approvalProb >= CUT_SCORE ? (isDark ? '#1A4731' : '#A7F3D0') : BLUE_BOR_D}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: approvalProb >= CUT_SCORE ? GREEN : BLUE, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                Probabilidade de Aprovação PRF
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: approvalProb >= CUT_SCORE ? GREEN : BLUE, lineHeight: 1 }}>
                  {approvalProb.toFixed(1)}%
                </span>
                <span style={{ fontSize: 12, color: MTXT }}>
                  {approvalProb >= CUT_SCORE ? 'acima da nota de corte' : `faltam ${(CUT_SCORE - approvalProb).toFixed(1)}% para o corte`}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: MTXT, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Corte estimado PRF</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: ORANGE }}>{CUT_SCORE}%</div>
            </div>
          </div>

          {/* Barra de progresso com marcador de corte */}
          <div style={{ marginTop: 14 }}>
            <div style={{ height: 10, background: TRACK, borderRadius: 999, overflow: 'visible', position: 'relative' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(approvalProb, 100)}%`,
                  background: approvalProb >= CUT_SCORE
                    ? `linear-gradient(90deg, ${GREEN}, #34D399)`
                    : `linear-gradient(90deg, ${BLUE_DARK}, ${BLUE})`,
                  borderRadius: 999,
                  transition: 'width 0.5s ease',
                }}
              />
              {/* Marcador da nota de corte */}
              <div
                style={{
                  position: 'absolute',
                  left: `${CUT_SCORE}%`,
                  top: -4,
                  bottom: -4,
                  width: 2,
                  background: ORANGE,
                  borderRadius: 2,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 10, color: MTXT }}>0%</span>
              <span style={{ fontSize: 10, color: ORANGE, fontWeight: 700 }}>▲ Corte {CUT_SCORE}%</span>
              <span style={{ fontSize: 10, color: MTXT }}>100%</span>
            </div>
          </div>
        </div>

        {/* MISSION */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <span
              style={{
                background: BLUE_SOFT_D,
                color: BLUE,
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '4px 10px',
                borderRadius: 999,
              }}
            >
              ● Plano ativo de alto impacto
            </span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, textAlign: 'center', margin: 0, color: TXT }}>
            Missão de Hoje
          </h2>
          <p style={{ textAlign: 'center', color: MTXT, fontSize: 12, margin: '4px 0 12px' }}>
            Legislação de Trânsito · 60 min · +50 XP
          </p>
          <div style={{ height: 4, background: TRACK, borderRadius: 999, overflow: 'hidden', margin: '0 auto 14px' }}>
            <div style={{ height: '100%', width: `${goalPercent}%`, background: BLUE, transition: 'width 0.3s' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {goals.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={g.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  background: SURFACE,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = ITEM_BG)}
                onMouseLeave={(e) => (e.currentTarget.style.background = SURFACE)}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: g.done ? GREEN : 'transparent',
                    border: g.done ? `1px solid ${GREEN}` : '1.5px solid #CFC8B8',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {g.done && <Check size={12} color="#fff" strokeWidth={3} />}
                </span>
                <span style={{ flex: 1, fontSize: 14, color: TXT, fontWeight: 500 }}>{g.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    color: g.done ? GREEN : MUTED,
                    fontWeight: 600,
                    background: g.done ? (isDark ? '#0D2B1E' : '#E7F6EE') : DIAG_TRACK,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  {g.status}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('treinar')}
            style={{
              width: '100%',
              marginTop: 14,
              padding: '12px 16px',
              background: BLUE,
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'inherit',
              boxShadow: '0 2px 10px rgba(27,79,216,0.25)',
            }}
          >
            <Play size={14} fill="#fff" /> Iniciar sessão de hoje <ArrowRight size={14} />
          </button>
        </div>

        {/* STATS GRID 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {/* Taxa de acerto */}
          <div style={{ ...card, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Target size={15} color={GREEN} />
              <span style={{ fontSize: 10, color: MTXT, fontWeight: 600 }}>Taxa de acerto</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: GREEN }}>{Math.round(taxa)}%</div>
            <div style={{ fontSize: 10, color: MTXT, marginTop: 2 }}>
              <span style={{ color: GREEN, fontWeight: 600 }}>{totalCorrect}C</span>
              {' '}<span style={{ color: RED, fontWeight: 600 }}>{totalIncorrect}E</span>
              {' '}<span>de {totalAnswered}</span>
            </div>
          </div>

          {/* Nota Líquida CEBRASPE */}
          <div style={{ ...card, borderRadius: 14, border: `1px solid ${notaLiquida >= 0 ? (isDark ? '#1A4731' : '#BBF7D0') : (isDark ? '#4A1515' : '#FECACA')}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <MinusCircle size={15} color={notaLiquida >= 0 ? GREEN : RED} />
              <span style={{ fontSize: 10, color: MTXT, fontWeight: 600 }}>Nota Líquida</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: notaLiquida >= 0 ? GREEN : RED }}>
              {notaLiquida > 0 ? `+${notaLiquida}` : notaLiquida}
            </div>
            <div style={{ fontSize: 10, color: MTXT, marginTop: 2 }}>acertos − erros (CEBRASPE)</div>
          </div>

          {/* Total de questões */}
          <div style={{ ...card, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Target size={15} color={BLUE} />
              <span style={{ fontSize: 10, color: MTXT, fontWeight: 600 }}>Total de questões</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: BLUE }}>{totalAnswered}</div>
            <div style={{ fontSize: 10, color: MTXT, marginTop: 2 }}>respondidas no total</div>
          </div>

          {/* Horas estudadas hoje */}
          <div style={{ ...card, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Zap size={15} color={ORANGE} />
              <span style={{ fontSize: 10, color: MTXT, fontWeight: 600 }}>Foco hoje</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: minutosHoje > 0 ? ORANGE : MUTED }}>
              {horasHoje > 0 ? `${horasHoje}h` : ''}{minsResto > 0 ? `${minsResto}m` : minutosHoje === 0 ? '—' : ''}
            </div>
            <div style={{ fontSize: 10, color: MTXT, marginTop: 2 }}>
              {streak > 0 ? `${streak} dias seguidos` : 'inicie uma sessão'}
            </div>
          </div>
        </div>

        {/* DIAGNOSTICS */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: BLUE,
                display: 'inline-block',
                animation: 'pulse 1.5s infinite',
              }}
            />
            <span style={{ fontSize: 11, color: MTXT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Diagnósticos estratégicos ativos
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {diagnostics.map((d) => {
              const color = diagColor(d.rate);
              return (
                <div key={d.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: TXT }}>{d.name}</span>
                    <span style={{ fontSize: 12, color, fontWeight: 700 }}>{Math.round(d.rate)}%</span>
                  </div>
                  <div style={{ height: 6, background: DIAG_TRACK, borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.max(d.rate, 2)}%`, background: color }} />
                  </div>
                  <div style={{ fontSize: 11, color: MTXT, marginTop: 3 }}>{diagStatus(d.rate)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WEEKLY DISTRIBUTION */}
        {(() => {
          const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
          const SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
          const jsToIdx = [6, 0, 1, 2, 3, 4, 5]; // Dom=6, Seg=0...
          const todayIdx = jsToIdx[new Date().getDay()];
          const tomorrowIdx = (todayIdx + 1) % 7;

          const weekly = schedule?.weekly || [];
          const byDay: Record<string, { name: string; duration: number; activityType: string; topic: string }[]> = {};
          DAYS.forEach((d) => (byDay[d] = []));
          weekly.forEach((day) => {
            const key = DAYS.find((d) => d.toLowerCase() === (day.dayOfWeek || '').toLowerCase());
            if (key) byDay[key] = day.disciplines || [];
          });

          const totalsPerDay = DAYS.map((d) =>
            byDay[d].reduce((acc, it) => acc + (it.duration || 0), 0)
          );
          const maxTotal = Math.max(...totalsPerDay, 1);
          const hasAny = totalsPerDay.some((t) => t > 0);

          const actColor: Record<string, string> = {
            teoria: BLUE,
            questões: '#7C3AED',
            revisão: ORANGE,
            simulado: RED,
          };
          const actLabel: Record<string, string> = {
            teoria: 'Teoria',
            questões: 'Questões',
            revisão: 'Revisão',
            simulado: 'Simulado',
          };

          return (
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarDays size={16} color={BLUE} />
                  <span style={{ fontSize: 11, color: MTXT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Distribuição da semana
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('cronograma')}
                  style={{
                    background: 'transparent',
                    color: BLUE,
                    border: `1px solid ${BLUE_BORDER}`,
                    padding: '5px 10px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontFamily: 'inherit',
                  }}
                >
                  Ver cronograma <ArrowRight size={12} />
                </button>
              </div>

              {!hasAny ? (
                <div style={{ textAlign: 'center', padding: '24px 8px', color: MTXT, fontSize: 13 }}>
                  Cronograma ainda não gerado. Gere para visualizar a semana detalhada.
                </div>
              ) : (
                <>
                  {/* Legenda */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                    {Object.keys(actLabel).map((k) => (
                      <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: MTXT, fontWeight: 600 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: actColor[k] }} />
                        {actLabel[k]}
                      </div>
                    ))}
                  </div>

                  {/* Grid dos 7 dias */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                    {DAYS.map((d, i) => {
                      const items = byDay[d];
                      const total = totalsPerDay[i];
                      const isToday = i === todayIdx;
                      const isTomorrow = i === tomorrowIdx;
                      const heightPct = (total / maxTotal) * 100;
                      return (
                        <div
                          key={d}
                          style={{
                            border: isToday ? `2px solid ${BLUE}` : isTomorrow ? `1.5px dashed ${BLUE_BOR_D}` : `1px solid ${BORDER}`,
                            borderRadius: 10,
                            padding: 8,
                            background: isToday ? BLUE_SOFT_D : SURFACE,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6,
                            minHeight: 160,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: isToday ? BLUE : TXT, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              {SHORT[i]}
                            </span>
                            {isToday && (
                              <span style={{ fontSize: 8, color: BLUE, fontWeight: 800, textTransform: 'uppercase' }}>Hoje</span>
                            )}
                            {isTomorrow && (
                              <span style={{ fontSize: 8, color: MTXT, fontWeight: 700, textTransform: 'uppercase' }}>Amanhã</span>
                            )}
                          </div>

                          {/* Barra de volume */}
                          <div style={{ height: 3, background: TRACK, borderRadius: 999, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${heightPct}%`, background: isToday ? BLUE : BLUE_BORDER }} />
                          </div>

                          {/* Matérias do dia */}
                          {items.length === 0 ? (
                            <div style={{ fontSize: 10, color: MTXT, textAlign: 'center', marginTop: 8, fontStyle: 'italic' }}>
                              Descanso
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                              {items.slice(0, 4).map((it, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    background: ITEM_BG,
                                    borderLeft: `3px solid ${actColor[it.activityType] || BLUE}`,
                                    borderRadius: 4,
                                    padding: '4px 5px',
                                    fontSize: 9.5,
                                    lineHeight: 1.25,
                                  }}
                                  title={`${it.name} — ${it.topic} (${it.duration}min)`}
                                >
                                  <div style={{ fontWeight: 700, color: TXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {it.name}
                                  </div>
                                  <div style={{ color: MTXT, display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
                                    <Clock size={8} /> {it.duration}min
                                  </div>
                                </div>
                              ))}
                              {items.length > 4 && (
                                <div style={{ fontSize: 9, color: MTXT, textAlign: 'center', fontWeight: 600 }}>
                                  +{items.length - 4} mais
                                </div>
                              )}
                            </div>
                          )}

                          {/* Total */}
                          {total > 0 && (
                            <div style={{ fontSize: 10, color: isToday ? BLUE : MTXT, fontWeight: 700, textAlign: 'center', marginTop: 'auto', paddingTop: 4, borderTop: `1px dashed ${BORDER}` }}>
                              {(total / 60).toFixed(1)}h
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })()}



        {/* ATHENA */}
        <div
          style={{
            background: BLUE_SOFT_D,
            border: `1px solid ${BLUE_BOR_D}`,
            borderRadius: 14,
            padding: 16,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: BLUE_ICON_BG,
              border: `1px solid ${BLUE_ICON_BORDER}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Shield size={18} color={BLUE} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: BLUE, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Recomendação Athena IA
            </div>
            <p style={{ fontSize: 13, color: TXT, margin: '4px 0 0', lineHeight: 1.5 }}>{athenaText}</p>
          </div>
        </div>

        {/* CONTRAN */}
        <div style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
              <span
                style={{
                  background: isDark ? '#2A1010' : '#FDECEC',
                  color: RED,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 999,
                }}
              >
                Foco PRF
              </span>
              <span
                style={{
                  background: isDark ? '#2A1E0A' : '#FFF1D6',
                  color: ORANGE,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 999,
                }}
              >
                5 resoluções críticas
              </span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 2px', color: TXT }}>Radar do CONTRAN</h3>
            <p style={{ fontSize: 12, color: MTXT, margin: 0 }}>
              Res. 432, 960 e 789 — mais cobradas pelo CEBRASPE
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('treinar')}
            style={{
              background: BLUE,
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'inherit',
            }}
          >
            Estudar <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
