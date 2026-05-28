import React, { useState, useMemo } from 'react';
import { EditalTopic } from '../types';
import {
  Play, Check, ArrowUpRight, Search,
  ChevronDown, ChevronUp, AlertCircle,
  BookOpen, FileText, RefreshCw, Target, Crosshair, Sparkles
} from 'lucide-react';

interface EditalVerticalizadoProps {
  topics: EditalTopic[];
  onToggleTopic: (topicId: string, field: 'studied' | 'summary' | 'reviewed' | 'simulated') => void;
  onSetAllTopicsOfSubject: (subjectName: string, state: boolean) => void;
  onNavigateToTrain: (discipline: string) => void;
  theme: 'dark' | 'light';
}

const PHASES = [
  { key: 'studied'   as const, label: 'Estudo',  short: 'E', color: '#3B82F6', bg: '#1D4ED8', icon: BookOpen   },
  { key: 'summary'   as const, label: 'Resumo',  short: 'R', color: '#F59E0B', bg: '#D97706', icon: FileText   },
  { key: 'reviewed'  as const, label: 'Revisão', short: 'V', color: '#A855F7', bg: '#7C3AED', icon: RefreshCw  },
  { key: 'simulated' as const, label: 'Simulado',short: 'S', color: '#10B981', bg: '#059669', icon: Target     },
];

export default function EditalVerticalizado({
  topics,
  onToggleTopic,
  onSetAllTopicsOfSubject,
  onNavigateToTrain,
  theme,
}: EditalVerticalizadoProps) {
  const isDark = theme === 'dark';

  const [selectedBloco, setSelectedBloco] = useState<number | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSubjects, setCollapsedSubjects] = useState<Record<string, boolean>>({});
  const [quickQuizTopic, setQuickQuizTopic] = useState<EditalTopic | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);

  const subjectList = useMemo(() => {
    const list = new Set<string>();
    topics.forEach(t => {
      if (selectedBloco === 'all' || t.bloco === selectedBloco) list.add(t.subject);
    });
    return Array.from(list);
  }, [topics, selectedBloco]);

  const stats = useMemo(() => {
    const total = topics.length;
    if (total === 0) return { estudioPercent: 0, resumoPercent: 0, revisaoPercent: 0, simuladoPercent: 0, overallPercent: 0, checkedMetas: 0, totalMetas: 0 };
    const c = (f: keyof EditalTopic) => topics.filter(t => t[f]).length;
    const ce = c('studied'), cr = c('summary'), cv = c('reviewed'), cs = c('simulated');
    const totalMetas = total * 4;
    const checkedMetas = ce + cr + cv + cs;
    return {
      estudioPercent:  Math.round((ce / total) * 100),
      resumoPercent:   Math.round((cr / total) * 100),
      revisaoPercent:  Math.round((cv / total) * 100),
      simuladoPercent: Math.round((cs / total) * 100),
      overallPercent:  parseFloat(((checkedMetas / totalMetas) * 100).toFixed(1)),
      checkedMetas,
      totalMetas,
    };
  }, [topics]);

  const filteredTopics = useMemo(() => topics.filter(t => {
    const q = searchQuery.toLowerCase();
    return (
      (t.description.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)) &&
      (selectedBloco === 'all' || t.bloco === selectedBloco) &&
      (selectedSubject === 'all' || t.subject === selectedSubject)
    );
  }), [topics, searchQuery, selectedBloco, selectedSubject]);

  const groupedBySubject = useMemo(() => {
    const g: Record<string, EditalTopic[]> = {};
    filteredTopics.forEach(t => { (g[t.subject] = g[t.subject] || []).push(t); });
    return g;
  }, [filteredTopics]);

  const toggleCollapse = (s: string) =>
    setCollapsedSubjects(p => ({ ...p, [s]: !p[s] }));

  const handlePracticeTopic = (topic: EditalTopic) => {
    setQuickQuizTopic(topic);
    setQuizAnswer(null);
    setQuizChecked(false);
  };

  const handleAnswerSubmit = (opt: 'C' | 'E') => {
    if (quizChecked) return;
    setQuizAnswer(opt);
    setQuizChecked(true);
    if (quickQuizTopic && !quickQuizTopic.simulated)
      onToggleTopic(quickQuizTopic.id, 'simulated');
  };

  // ─── tokens ───────────────────────────────────────────────────────────────
  const bg      = isDark ? '#0B1120' : '#F5F7FA';
  const surface = isDark ? '#111827' : '#FFFFFF';
  const border  = isDark ? '#1F2D45' : '#E2E8F0';
  const text    = isDark ? '#F1F5F9' : '#0F172A';
  const muted   = isDark ? '#64748B' : '#94A3B8';
  const accent  = '#1B4FD8';

  return (
    <div style={{ background: bg, minHeight: '100%', padding: '20px 16px', fontFamily: '"DM Sans", system-ui, sans-serif', color: text }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div style={{
          background: isDark
            ? 'linear-gradient(135deg, #0F1F3D 0%, #0B1629 60%, #0D1F35 100%)'
            : 'linear-gradient(135deg, #1B3A6B 0%, #1B4FD8 100%)',
          border: `1px solid ${isDark ? '#1E3A5F' : '#1B4FD8'}`,
          borderRadius: 18,
          padding: '22px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* decorative grid lines */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, background: 'radial-gradient(circle, rgba(27,79,216,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Crosshair size={13} color="#60A5FA" />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace' }}>
                Rastreamento Tático · PRF
              </span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Edital Verticalizado
            </h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: 480, lineHeight: 1.6 }}>
              Mapa completo do edital PRF com rastreamento por fase. Marque manualmente ou deixe a Athena atualizar automaticamente.
            </p>
          </div>

          {/* coverage ring */}
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            position: 'relative',
          }}>
            <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
              <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.1)" strokeWidth="5" fill="none" />
                <circle
                  cx="32" cy="32" r="26"
                  stroke="#F59E0B"
                  strokeWidth="5" fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 * (1 - Math.max(0.01, stats.overallPercent / 100))}
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#F59E0B', fontFamily: 'monospace' }}>
                {stats.overallPercent}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', marginBottom: 2 }}>Cobertura</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace' }}>
                {stats.checkedMetas}<span style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>/{stats.totalMetas}</span>
              </div>
              <div style={{ fontSize: 10, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Sparkles size={10} /> IA monitorando
              </div>
            </div>
          </div>
        </div>

        {/* ── PHASE INDICATORS ────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {PHASES.map(p => {
            const pct = p.key === 'studied' ? stats.estudioPercent
              : p.key === 'summary' ? stats.resumoPercent
              : p.key === 'reviewed' ? stats.revisaoPercent
              : stats.simuladoPercent;
            const Icon = p.icon;
            return (
              <div key={p.key} style={{
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: 12,
                padding: '10px 14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Icon size={13} color={p.color} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 800, color: p.color, fontFamily: 'monospace' }}>{pct}%</span>
                </div>
                <div style={{ height: 4, background: isDark ? '#1F2D45' : '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: p.color, borderRadius: 999, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── FILTERS ─────────────────────────────────────────────────────── */}
        <div style={{
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: 14,
          padding: '12px 16px',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          {/* bloco pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['all', 1, 2, 3] as const).map(b => (
              <button
                key={b}
                onClick={() => { setSelectedBloco(b); setSelectedSubject('all'); }}
                style={{
                  padding: '5px 12px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.15s',
                  background: selectedBloco === b ? accent : isDark ? '#1F2D45' : '#EEF2FF',
                  color: selectedBloco === b ? '#fff' : muted,
                  fontFamily: 'monospace',
                }}
              >
                {b === 'all' ? 'Todos' : `Bloco ${b}`}
              </button>
            ))}
          </div>

          {/* divider */}
          <div style={{ width: 1, height: 24, background: border, flexShrink: 0 }} />

          {/* subject select */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              style={{
                background: isDark ? '#1F2D45' : '#F8FAFC',
                color: text,
                border: `1px solid ${border}`,
                borderRadius: 8,
                fontSize: 11,
                padding: '6px 28px 6px 10px',
                appearance: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                outline: 'none',
                minWidth: 160,
              }}
            >
              <option value="all">Todas as matérias</option>
              {subjectList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} color={muted} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>

          {/* search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <Search size={13} color={muted} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar tópico ou resolução..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: isDark ? '#1F2D45' : '#F8FAFC',
                color: text,
                border: `1px solid ${border}`,
                borderRadius: 8,
                fontSize: 11,
                padding: '6px 12px 6px 30px',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* ── ACCORDION LIST ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.keys(groupedBySubject).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px', background: surface, border: `1px solid ${border}`, borderRadius: 14 }}>
              <AlertCircle size={32} color={muted} style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 4 }}>Nenhum tópico encontrado</div>
              <div style={{ fontSize: 12, color: muted }}>Tente buscar por outro termo ou mude os filtros.</div>
            </div>
          ) : (
            (Object.entries(groupedBySubject) as [string, EditalTopic[]][]).map(([subjectName, subjTopics]) => {
              const isCollapsed = !!collapsedSubjects[subjectName];
              const totalSub = subjTopics.length;
              const checkedSub = subjTopics.reduce((a, t) =>
                a + (t.studied ? 1 : 0) + (t.summary ? 1 : 0) + (t.reviewed ? 1 : 0) + (t.simulated ? 1 : 0), 0);
              const pctSub = Math.round((checkedSub / (totalSub * 4)) * 100);
              const blockNumber = subjTopics[0]?.bloco ?? 1;
              const allDone = subjTopics.every(t => t.studied && t.summary && t.reviewed && t.simulated);

              return (
                <div key={subjectName} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 14, overflow: 'hidden' }}>

                  {/* accordion header */}
                  <div
                    onClick={() => toggleCollapse(subjectName)}
                    style={{
                      padding: '13px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      cursor: 'pointer',
                      background: isDark
                        ? 'linear-gradient(90deg, #0F1F3D 0%, #111827 100%)'
                        : 'linear-gradient(90deg, #EEF3FF 0%, #F8FAFF 100%)',
                      borderBottom: isCollapsed ? 'none' : `1px solid ${border}`,
                      userSelect: 'none',
                    }}
                  >
                    {/* collapse toggle */}
                    <div style={{ color: muted, flexShrink: 0 }}>
                      {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </div>

                    {/* bloco badge */}
                    <span style={{
                      fontSize: 9, fontWeight: 800, color: accent,
                      background: isDark ? 'rgba(27,79,216,0.15)' : '#EEF3FF',
                      border: `1px solid ${isDark ? 'rgba(27,79,216,0.3)' : '#BFDBFE'}`,
                      padding: '2px 7px', borderRadius: 999,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      fontFamily: 'monospace', flexShrink: 0,
                    }}>
                      Bloco {blockNumber}
                    </span>

                    {/* subject name */}
                    <span style={{ fontSize: 14, fontWeight: 700, color: text, flex: 1 }}>{subjectName}</span>

                    {/* topic count */}
                    <span style={{ fontSize: 11, color: muted, fontFamily: 'monospace', flexShrink: 0 }}>{totalSub} tópicos</span>

                    {/* coverage bar + % */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, minWidth: 100 }}>
                      <div style={{ flex: 1, height: 4, background: isDark ? '#1F2D45' : '#E2E8F0', borderRadius: 999, overflow: 'hidden', minWidth: 56 }}>
                        <div style={{ height: '100%', width: `${pctSub}%`, background: allDone ? '#10B981' : accent, borderRadius: 999, transition: 'width 0.4s' }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: allDone ? '#10B981' : accent, fontFamily: 'monospace', width: 34, textAlign: 'right' }}>{pctSub}%</span>
                    </div>

                    {/* mark all button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        const someUnchecked = subjTopics.some(t => !t.studied || !t.summary || !t.reviewed || !t.simulated);
                        onSetAllTopicsOfSubject(subjectName, someUnchecked);
                      }}
                      style={{
                        fontSize: 10, fontWeight: 700, color: allDone ? '#10B981' : muted,
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        padding: '4px 8px', borderRadius: 6, flexShrink: 0,
                        fontFamily: 'inherit',
                        transition: 'color 0.15s',
                      }}
                    >
                      {allDone ? '✓ Concluído' : 'Concluir →'}
                    </button>
                  </div>

                  {/* topics table */}
                  {!isCollapsed && (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
                        <thead>
                          <tr style={{ background: isDark ? '#0F1829' : '#F8FAFC', borderBottom: `1px solid ${border}` }}>
                            <th style={{ padding: '8px 14px', fontSize: 10, fontWeight: 700, color: muted, textAlign: 'center', fontFamily: 'monospace', width: 56, textTransform: 'uppercase', letterSpacing: '0.08em' }}>#</th>
                            <th style={{ padding: '8px 14px', fontSize: 10, fontWeight: 700, color: muted, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subtópico</th>
                            {PHASES.map(p => (
                              <th key={p.key} style={{ padding: '8px 12px', fontSize: 10, fontWeight: 700, color: p.color, textAlign: 'center', width: 78, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                {p.label}
                              </th>
                            ))}
                            <th style={{ padding: '8px 14px', fontSize: 10, fontWeight: 700, color: muted, textAlign: 'center', width: 90, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjTopics.map((topic, idx) => {
                            const isComplete = topic.studied && topic.summary && topic.reviewed && topic.simulated;
                            const completedCount = (topic.studied ? 1 : 0) + (topic.summary ? 1 : 0) + (topic.reviewed ? 1 : 0) + (topic.simulated ? 1 : 0);
                            return (
                              <tr
                                key={topic.id}
                                style={{
                                  borderBottom: `1px solid ${border}`,
                                  opacity: isComplete ? 0.55 : 1,
                                  transition: 'background 0.12s',
                                  background: isComplete
                                    ? (isDark ? 'rgba(16,185,129,0.04)' : 'rgba(16,185,129,0.03)')
                                    : 'transparent',
                                }}
                                onMouseEnter={e => { if (!isComplete) (e.currentTarget as HTMLTableRowElement).style.background = isDark ? 'rgba(27,79,216,0.06)' : 'rgba(27,79,216,0.04)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = isComplete ? (isDark ? 'rgba(16,185,129,0.04)' : 'rgba(16,185,129,0.03)') : 'transparent'; }}
                              >
                                {/* code */}
                                <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: muted, fontWeight: 600 }}>{topic.code}</span>
                                </td>

                                {/* description */}
                                <td style={{ padding: '11px 14px' }}>
                                  <div style={{ fontSize: 12, color: text, fontWeight: 500, lineHeight: 1.5 }}>
                                    {topic.description}
                                  </div>
                                  {/* progress dots */}
                                  <div style={{ display: 'flex', gap: 3, marginTop: 5 }}>
                                    {PHASES.map(p => (
                                      <div key={p.key} style={{
                                        width: 6, height: 6, borderRadius: '50%',
                                        background: topic[p.key] ? p.color : (isDark ? '#1F2D45' : '#E2E8F0'),
                                        transition: 'background 0.2s',
                                      }} title={p.label} />
                                    ))}
                                    {isComplete && (
                                      <span style={{ fontSize: 9, color: '#10B981', fontWeight: 700, marginLeft: 4, lineHeight: '6px' }}>✓ ok</span>
                                    )}
                                  </div>
                                </td>

                                {/* phase checkboxes */}
                                {PHASES.map(p => {
                                  const Icon = p.icon;
                                  const checked = topic[p.key];
                                  return (
                                    <td key={p.key} style={{ padding: '11px 12px', textAlign: 'center' }}>
                                      <button
                                        onClick={() => onToggleTopic(topic.id, p.key)}
                                        title={checked ? `${p.label} feito` : `Marcar ${p.label}`}
                                        style={{
                                          width: 30, height: 30,
                                          borderRadius: 8,
                                          border: `1.5px solid ${checked ? p.color : (isDark ? '#2D3F5C' : '#CBD5E1')}`,
                                          background: checked ? p.color : 'transparent',
                                          cursor: 'pointer',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          transition: 'all 0.15s',
                                          flexShrink: 0,
                                        }}
                                      >
                                        {checked
                                          ? <Check size={14} color="#fff" strokeWidth={3} />
                                          : <Icon size={12} color={isDark ? '#3D5070' : '#94A3B8'} />
                                        }
                                      </button>
                                    </td>
                                  );
                                })}

                                {/* practice button */}
                                <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                                  <button
                                    onClick={() => handlePracticeTopic(topic)}
                                    style={{
                                      fontSize: 10, fontWeight: 700,
                                      color: accent,
                                      background: isDark ? 'rgba(27,79,216,0.1)' : '#EEF3FF',
                                      border: `1px solid ${isDark ? 'rgba(27,79,216,0.25)' : '#BFDBFE'}`,
                                      borderRadius: 7,
                                      padding: '5px 10px',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4,
                                      fontFamily: 'inherit',
                                      transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = accent; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(27,79,216,0.1)' : '#EEF3FF'; (e.currentTarget as HTMLButtonElement).style.color = accent; }}
                                  >
                                    <Play size={9} fill="currentColor" />
                                    Praticar
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── QUICK QUIZ MODAL ────────────────────────────────────────────────── */}
      {quickQuizTopic && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          padding: 16,
        }}>
          <div style={{
            background: isDark ? '#0F1829' : '#FFFFFF',
            border: `1px solid ${isDark ? '#1E3A5F' : '#E2E8F0'}`,
            borderRadius: 18,
            width: '100%', maxWidth: 520,
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}>
            {/* modal header */}
            <div style={{
              padding: '14px 20px',
              borderBottom: `1px solid ${isDark ? '#1E3A5F' : '#E2E8F0'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: isDark ? '#0B1629' : '#F8FAFF',
            }}>
              <div>
                <div style={{ fontSize: 9, color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace', marginBottom: 2 }}>
                  Mini Simulado · Athena IA
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: text }}>{quickQuizTopic.subject}</div>
              </div>
              <button
                onClick={() => setQuickQuizTopic(null)}
                style={{ fontSize: 11, color: muted, background: isDark ? '#1F2D45' : '#EEF2FF', border: 'none', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}
              >
                Fechar
              </button>
            </div>

            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* topic reference */}
              <div style={{ fontSize: 11, color: muted, background: isDark ? '#0B1629' : '#F8FAFF', border: `1px solid ${isDark ? '#1E3A5F' : '#E2E8F0'}`, borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', marginBottom: 4, color: muted }}>
                  Subtópico de referência
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: text }}>{quickQuizTopic.description}</div>
              </div>

              {/* cebraspe badge */}
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '3px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
                  Certo / Errado · CEBRASPE
                </span>
              </div>

              {/* question */}
              <p style={{ fontSize: 13, color: text, lineHeight: 1.7, fontWeight: 500, margin: 0 }}>
                {quickQuizTopic.subject === 'Legislação de Trânsito'
                  ? 'No que concerne à fiscalização de alcoolemia, configura crime de trânsito a condução de veículo com teor alcoólico aferido por etilômetro igual ou superior a 0,34 mg de álcool por litro de ar expirado.'
                  : quickQuizTopic.subject === 'Direito Constitucional'
                  ? 'A inviolabilidade domiciliar só admite penetração sem consentimento do morador à noite em flagrante delito ou desastre, e durante o dia, mediante mandado judicial.'
                  : quickQuizTopic.subject === 'Língua Portuguesa'
                  ? 'O emprego do sinal indicativo de crase é obrigatório antes de pronomes possessivos femininos quando precedidos de preposição.'
                  : `Julgue o item referente a ${quickQuizTopic.subject} conforme o edital da PRF e padrão CEBRASPE.`}
              </p>

              {/* answer buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {(['C', 'E'] as const).map(opt => {
                  const isSelected = quizAnswer === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswerSubmit(opt)}
                      style={{
                        padding: '14px',
                        borderRadius: 12,
                        border: `1.5px solid ${isSelected ? (opt === 'C' ? '#10B981' : '#EF4444') : (isDark ? '#1F2D45' : '#E2E8F0')}`,
                        background: isSelected ? (opt === 'C' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)') : (isDark ? '#0B1629' : '#F8FAFC'),
                        color: isSelected ? (opt === 'C' ? '#10B981' : '#EF4444') : text,
                        fontSize: 14, fontWeight: 800, cursor: 'pointer',
                        fontFamily: 'monospace',
                        transition: 'all 0.15s',
                      }}
                    >
                      {opt === 'C' ? 'CERTO' : 'ERRADO'}
                    </button>
                  );
                })}
              </div>

              {/* feedback */}
              {quizChecked && (
                <div style={{
                  padding: '12px 14px',
                  background: isDark ? '#0B1629' : '#F0FDF4',
                  border: `1px solid ${isDark ? '#064E3B' : '#A7F3D0'}`,
                  borderRadius: 10,
                  fontSize: 11, color: '#10B981', lineHeight: 1.6,
                }}>
                  <div style={{ fontWeight: 800, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 9, fontFamily: 'monospace' }}>
                    Gabarito Comentado
                  </div>
                  <div style={{ color: isDark ? '#D1FAE5' : '#065F46' }}>
                    {quickQuizTopic.subject === 'Legislação de Trânsito'
                      ? 'Correto — CERTO. O limite penal do Art. 306 CTB é ≥ 0,34 mg/L. Checkpoint "Simulado" atualizado automaticamente!'
                      : quickQuizTopic.subject === 'Direito Constitucional'
                      ? 'ERRADO — à noite o mandado judicial NÃO autoriza entrada. Somente flagrante, desastre ou socorro. Checkpoint atualizado!'
                      : 'Simulação computada! A prática de assertivas C/E é o método mais eficiente para o padrão CEBRASPE.'}
                  </div>
                </div>
              )}
            </div>

            {/* modal footer */}
            <div style={{
              padding: '12px 20px',
              borderTop: `1px solid ${isDark ? '#1E3A5F' : '#E2E8F0'}`,
              display: 'flex', justifyContent: 'flex-end', gap: 8,
            }}>
              <button
                onClick={() => { setQuickQuizTopic(null); onNavigateToTrain(quickQuizTopic.subject); }}
                style={{
                  padding: '8px 16px',
                  background: '#F59E0B', color: '#000',
                  border: 'none', borderRadius: 9,
                  fontSize: 11, fontWeight: 800, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: 'inherit',
                }}
              >
                Mais questões na Central <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
