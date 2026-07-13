import React, { useState, useEffect, useRef } from 'react';
import { PRF_QUESTIONS_BANK as PRF_QUESTIONS, getQuestionsByDiscipline, getRandomQuestions } from '../data/questionsBank';

/** Extrai referência de artigo da explicação (ex: "Art. 306 do CTB", "Art. 144, § 2º da CF") */
function extractArticle(text: string): string | null {
  const match = text.match(/Art\.?\s*\d+[\w,°º§\s\-]*(CTB|CF|CP|CPP|CTN|CONTRAN|Lei|nº|n\.º)[^\.\,]*/i);
  return match ? match[0].trim().replace(/\s+/g, ' ') : null;
}

/** Gera dica CEBRASPE baseada no subtópico */
function getCebraspeTip(subtopic: string): string {
  const s = subtopic.toLowerCase();
  if (s.includes('embriaguez') || s.includes('álcool')) return 'CEBRASPE cobra a distinção entre infração administrativa (0,05 mg/L) e crime (0,34 mg/L).';
  if (s.includes('velocidade')) return 'Atenção aos valores exatos por tipo de via e veículo — pegadinha clássica de troca de números.';
  if (s.includes('prescrição')) return 'CEBRASPE distingue PPP (pena máxima) vs PPE (pena concreta) — confusão frequente em provas.';
  if (s.includes('flagrante')) return 'Modalidades de flagrante (próprio, impróprio, presumido) são trocadas propositalmente pela banca.';
  if (s.includes('segurança pública') || s.includes('art. 144')) return 'PRF é mantida pela União — não pelos estados. Item de pegadinha recorrente no CEBRASPE.';
  if (s.includes('dolo') || s.includes('culpa')) return 'CEBRASPE explora a linha tênue entre dolo eventual e culpa consciente — ambos preveem o resultado.';
  if (s.includes('tempo') || s.includes('lugar')) return 'Teoria da atividade (tempo) vs ubiquidade (lugar) — banca inverte os critérios frequentemente.';
  if (s.includes('concordância') || s.includes('regência')) return 'Banca usa frases de contexto policial para disfarçar o erro gramatical — leia devagar.';
  if (s.includes('energia cinética') || s.includes('frenagem')) return 'Ec = mv²/2: dobrar a velocidade quadruplica a energia — relação quadrática é essencial.';
  if (s.includes('poder de polícia') || s.includes('autoexecutoriedade')) return 'Autoexecutoriedade NÃO é atributo de todos os atos — exceção clássica é a cobrança de multa.';
  return 'Leia cada palavra da assertiva — o CEBRASPE altera detalhes sutis para inverter o gabarito.';
}
import { Question } from '../types';
import { AlarmClock, Trophy, RefreshCw, Sparkles, Check, X, BarChart2, ChevronLeft, BookOpen } from 'lucide-react';

interface SimuladosProps {
  onSimuladoFinished: (score: number, totalQuestions: number, corrects: number, incorrects: number) => void;
  onNavigate?: (tab: string) => void;
  theme?: 'dark' | 'light';
}

type SimType = 'completo' | 'mini' | 'cebraspe' | 'ia';
type ReviewFilter = 'all' | 'errors' | 'correct' | 'blank';

export default function Simulados({ onSimuladoFinished, onNavigate, theme = 'dark' }: SimuladosProps) {
  const d = theme === 'dark';
  const [activeTab, setActiveTab] = useState<SimType>('mini');
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [testFinished, setTestFinished] = useState<boolean>(false);
  const [showReview, setShowReview] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');

  const [currentExamQuestions, setCurrentExamQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [qId: string]: 'C' | 'E' | null }>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const [examDurationSeconds, setExamDurationSeconds] = useState<number>(0);
  const [isGeneratingExam, setIsGeneratingExam] = useState<boolean>(false);

  const handleStartExam = async (type: SimType) => {
    setIsGeneratingExam(true);
    let selectedQuestions: Question[] = [];
    let minutesLimit = 25;

    if (type === 'mini') {
      // 10 questões aleatórias do banco completo
      selectedQuestions = getRandomQuestions(10);
      minutesLimit = 15;
    } else if (type === 'completo') {
      // 30 questões balanceadas por disciplina
      selectedQuestions = getRandomQuestions(30);
      minutesLimit = 60;
    } else if (type === 'cebraspe') {
      // Foco em Legislação de Trânsito — disciplina mais cobrada
      selectedQuestions = getRandomQuestions(15, 'Legislação de Trânsito');
      minutesLimit = 25;
    } else {
      // Simulado IA: misto de difíceis de várias disciplinas
      const dificeis = PRF_QUESTIONS.filter(q => q.difficulty === 'Difícil');
      selectedQuestions = [...dificeis].sort(() => 0.5 - Math.random()).slice(0, 10);
      minutesLimit = 20;
    }

    const initialAnswers: { [qId: string]: 'C' | 'E' | null } = {};
    selectedQuestions.forEach(q => { initialAnswers[q.id] = null; });

    setCurrentExamQuestions(selectedQuestions);
    setAnswers(initialAnswers);
    setTimeRemaining(minutesLimit * 60);
    setCurrentIdx(0);
    setTestFinished(false);
    setShowReview(false);
    setReviewFilter('all');
    setTestStarted(true);
    setIsGeneratingExam(false);
    startTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleFinishExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleFinishExam = (forcedByTime = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTestFinished(true);
    setTestStarted(false);
    setExamDurationSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    const { liquidatedPoints, corrects, incorrects } = getCalculatedScores();
    onSimuladoFinished(liquidatedPoints, currentExamQuestions.length, corrects, incorrects);
  };

  const selectAnswer = (ans: 'C' | 'E') => {
    const qId = currentExamQuestions[currentIdx]?.id;
    if (!qId) return;
    setAnswers(prev => ({ ...prev, [qId]: ans }));
  };

  const clearAnswer = () => {
    const qId = currentExamQuestions[currentIdx]?.id;
    if (!qId) return;
    setAnswers(prev => ({ ...prev, [qId]: null }));
  };

  const getCalculatedScores = () => {
    let corrects = 0;
    let incorrects = 0;
    let leftBlank = 0;
    currentExamQuestions.forEach(q => {
      const uAns = answers[q.id];
      if (!uAns) leftBlank++;
      else if (uAns === q.correctAnswer) corrects++;
      else incorrects++;
    });
    return { corrects, incorrects, leftBlank, liquidatedPoints: corrects - incorrects };
  };

  const scores = getCalculatedScores();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.values(answers).filter(a => a !== null).length;

  // Keyboard navigation during exam
  useEffect(() => {
    if (!testStarted || testFinished) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); selectAnswer('E'); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); selectAnswer('C'); }
      else if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); clearAnswer(); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentIdx === currentExamQuestions.length - 1) handleFinishExam(false);
        else setCurrentIdx(prev => prev + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testStarted, testFinished, currentIdx, currentExamQuestions]);

  // Discipline breakdown for scorecard
  const disciplineStats = currentExamQuestions.reduce<Record<string, { correct: number; incorrect: number; blank: number }>>((acc, q) => {
    const d = q.discipline;
    if (!acc[d]) acc[d] = { correct: 0, incorrect: 0, blank: 0 };
    const ans = answers[q.id];
    if (!ans) acc[d].blank++;
    else if (ans === q.correctAnswer) acc[d].correct++;
    else acc[d].incorrect++;
    return acc;
  }, {});

  const reviewQuestions = currentExamQuestions.filter(q => {
    const ans = answers[q.id];
    if (reviewFilter === 'errors') return ans !== null && ans !== q.correctAnswer;
    if (reviewFilter === 'correct') return ans === q.correctAnswer;
    if (reviewFilter === 'blank') return !ans;
    return true;
  });

  // ── Tokens de tema ──────────────────────────────────────
  const pg    = d ? 'bg-[#080b14]'  : 'bg-slate-50';
  const card  = d ? 'bg-[#0d1117] border border-white/[0.06]' : 'bg-white border border-slate-200 shadow-sm';
  const raised= d ? 'bg-[#131a27]' : 'bg-slate-100';
  const txt   = d ? 'text-white'   : 'text-slate-900';
  const mut   = d ? 'text-slate-400': 'text-slate-500';
  const fnt   = d ? 'text-slate-500': 'text-slate-400';
  const bdr   = d ? 'border-white/[0.06]' : 'border-slate-200';
  const trk   = d ? 'bg-white/[0.06]' : 'bg-slate-200';

  const modeCardCls = (id: SimType) => {
    const sel = activeTab === id;
    if (d) return `p-5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[150px] cursor-pointer ${sel ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-[#0d1117] border-white/[0.06] hover:border-white/[0.12] hover:bg-[#131a27]'}`;
    return `p-5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[150px] cursor-pointer ${sel ? 'bg-indigo-50 border-indigo-400 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`;
  };

  return (
    <div className={`min-h-full ${pg} font-sans`} id="simulador-view-wrapper">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ── SETUP ─────────────────────────────────────────── */}
        {!testStarted && !testFinished && (
          <>
            {/* Header */}
            <div>
              <h1 className={`text-2xl font-black tracking-tight ${txt}`}>Simulados Padrão CEBRASPE</h1>
              <p className={`text-sm mt-1 ${mut}`}>
                Uma resposta incorreta anula uma correta. Desenvolva a estratégia de deixar em branco quando não tiver convicção.
              </p>
            </div>

            {/* Alerta CEBRASPE */}
            <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${d ? 'bg-amber-500/5 border-amber-500/15' : 'bg-amber-50 border-amber-200'}`}>
              <span className="text-base shrink-0">⚠️</span>
              <p className={`text-xs leading-relaxed ${d ? 'text-amber-300/80' : 'text-amber-700'}`}>
                <b>Regra CEBRASPE:</b> Acerto = +1 · Errado = −1 · Em branco = 0. Só marque quando tiver &gt;60% de certeza.
              </p>
            </div>

            {/* Cards de modo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {([
                { id: 'mini' as SimType,     icon: '⚡', title: 'Mini Simulado',      desc: '10 questões aleatórias, 15 min. Ideal para revisões diárias.', badge: 'RÁPIDO',    badgeCls: 'text-emerald-500' },
                { id: 'completo' as SimType, icon: '🏆', title: 'Completo',          desc: '30 questões de todas as disciplinas. 60 minutos.', badge: 'PADRÃO PRF', badgeCls: 'text-indigo-400' },
                { id: 'cebraspe' as SimType, icon: '👮', title: 'Trânsito Puro',     desc: '15 questões de CTB e CONTRAN. Foco máximo em legislação.', badge: 'ESPECÍFICO', badgeCls: 'text-amber-400' },
                { id: 'ia' as SimType,       icon: '🦉', title: 'Athena IA',         desc: '10 questões difíceis adaptadas às suas fraquezas.', badge: 'ADAPTATIVO', badgeCls: 'text-violet-400' },
              ]).map(m => (
                <button key={m.id} onClick={() => setActiveTab(m.id)} className={modeCardCls(m.id)}>
                  <div className="space-y-2">
                    <span className="text-2xl block">{m.icon}</span>
                    <h4 className={`font-black text-sm ${txt}`}>{m.title}</h4>
                    <p className={`text-[11px] leading-relaxed ${mut}`}>{m.desc}</p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold mt-3 block ${m.badgeCls}`}>{m.badge}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-center pt-2">
              <button onClick={() => handleStartExam(activeTab)} disabled={isGeneratingExam}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-2xl text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] disabled:opacity-60 cursor-pointer">
                {isGeneratingExam ? '🦉 Athena preparando as questões...' : 'Iniciar Simulado Selecionado →'}
              </button>
            </div>
          </>
        )}

        {/* ── PROVA ATIVA ───────────────────────────────────── */}
        {testStarted && !testFinished && (
          <>
            {/* Barra de progresso + timer */}
            <div className={`${card} rounded-2xl p-4 space-y-3`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black ${d ? 'bg-indigo-500/15 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>C/E</span>
                  <div>
                    <p className={`text-sm font-bold ${txt}`}>Simulador Estratégico</p>
                    <p className={`text-xs font-mono ${mut}`}>
                      Q <span className="font-bold text-indigo-400">{currentIdx + 1}</span>/{currentExamQuestions.length}
                      <span className="mx-2">·</span>
                      <span className="text-emerald-500">{answeredCount} respondidas</span>
                      {answeredCount < currentExamQuestions.length && <span className={`ml-1 ${fnt}`}>({currentExamQuestions.length - answeredCount} em branco)</span>}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 font-mono font-black text-sm px-4 py-2 rounded-xl border ${
                  timeRemaining <= 60
                    ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse'
                    : d ? 'bg-[#131a27] border-white/[0.06] text-white' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                  <AlarmClock className="w-4 h-4" />
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <div className={`h-1.5 ${trk} rounded-full overflow-hidden`}>
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-500"
                  style={{ width: `${currentExamQuestions.length > 0 ? ((currentIdx + 1) / currentExamQuestions.length) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Questão */}
              <div className="lg:col-span-3 space-y-4">
                <div className={`${card} rounded-2xl p-5`}>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border ${d ? 'bg-white/[0.04] border-white/[0.06] text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                      {currentExamQuestions[currentIdx]?.discipline}
                    </span>
                    {(currentExamQuestions[currentIdx] as any)?.difficulty && (
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg ${
                        (currentExamQuestions[currentIdx] as any).difficulty === 'Fácil' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' :
                        (currentExamQuestions[currentIdx] as any).difficulty === 'Média' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' :
                        'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                        {(currentExamQuestions[currentIdx] as any).difficulty}
                      </span>
                    )}
                  </div>
                  <p className={`leading-relaxed text-sm min-h-[100px] ${d ? 'text-slate-200' : 'text-slate-700'}`}>
                    {currentExamQuestions[currentIdx]?.statement}
                  </p>
                </div>

                {/* Botões C/E */}
                <div className="grid grid-cols-2 gap-3">
                  {(['C', 'E'] as const).map(ans => {
                    const selected = answers[currentExamQuestions[currentIdx]?.id] === ans;
                    return (
                      <button key={ans} onClick={() => selectAnswer(ans)}
                        className={`py-5 rounded-2xl border font-black text-center transition-all cursor-pointer ${
                          selected
                            ? ans === 'C'
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                              : 'bg-red-500/15 border-red-500 text-red-400 shadow-lg shadow-red-500/10 scale-[1.02]'
                            : d ? 'bg-[#0d1117] border-white/[0.06] hover:border-white/[0.15] text-slate-300 hover:text-white' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900'
                        }`}>
                        <span className="block text-xl">{ans === 'C' ? 'Certo' : 'Errado'}</span>
                        <span className={`text-[10px] font-mono font-normal ${fnt}`}>{ans === 'C' ? 'Assertiva verdadeira' : 'Assertiva falsa'}</span>
                      </button>
                    );
                  })}
                </div>

                <p className={`text-center text-[10px] font-mono ${fnt} select-none`}>← Errado &nbsp;·&nbsp; Certo → &nbsp;·&nbsp; Enter Avançar &nbsp;·&nbsp; Del Limpar</p>

                <div className="flex items-center justify-between">
                  <button onClick={clearAnswer} className={`text-xs font-mono px-3 py-2 rounded-lg transition-all cursor-pointer ${d ? 'text-slate-500 hover:text-white hover:bg-white/[0.04]' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}>
                    Deixar em Branco
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentIdx(p => Math.max(0, p - 1))} disabled={currentIdx === 0}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-40 cursor-pointer ${d ? 'border-white/[0.06] text-slate-400 hover:bg-white/[0.04]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                      Anterior
                    </button>
                    {currentIdx === currentExamQuestions.length - 1 ? (
                      <button onClick={() => handleFinishExam(false)}
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/20">
                        Finalizar Prova
                      </button>
                    ) : (
                      <button onClick={() => setCurrentIdx(p => Math.min(currentExamQuestions.length - 1, p + 1))}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-indigo-500/20">
                        Avançar →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Folha de respostas */}
              <div className={`${card} rounded-2xl p-4 space-y-4 h-fit`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${fnt}`}>Respostas</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-500">{answeredCount}/{currentExamQuestions.length}</span>
                </div>
                <div className={`h-1 ${trk} rounded-full overflow-hidden`}>
                  <div className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${currentExamQuestions.length > 0 ? (answeredCount / currentExamQuestions.length) * 100 : 0}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {currentExamQuestions.map((q, idx) => {
                    const st = answers[q.id];
                    return (
                      <button key={q.id} onClick={() => setCurrentIdx(idx)}
                        className={`w-full aspect-square rounded-lg border text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          currentIdx === idx ? 'ring-2 ring-indigo-500 border-indigo-500 text-indigo-400 scale-110' :
                          st === 'C' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                          st === 'E' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                          d ? 'bg-white/[0.02] border-white/[0.06] text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
                <div className={`pt-3 border-t ${bdr} space-y-1.5`}>
                  {[{ cls: 'bg-emerald-500/10 border-emerald-500/30', label: 'Certo' }, { cls: 'bg-red-500/10 border-red-500/30', label: 'Errado' }, { cls: d ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50 border-slate-200', label: 'Em branco' }].map(l => (
                    <div key={l.label} className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded border ${l.cls} inline-block`} />
                      <span className={`text-[10px] font-mono ${fnt}`}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── GABARITO ──────────────────────────────────────── */}
        {testFinished && showReview && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <button onClick={() => setShowReview(false)}
                className={`flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer ${d ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                <ChevronLeft className="w-4 h-4" /> Voltar ao Resultado
              </button>
              <span className={`text-xs font-mono ${fnt}`}>{reviewQuestions.length} questões</span>
            </div>

            {/* Erros por disciplina */}
            {reviewFilter === 'errors' && scores.incorrects > 0 && (() => {
              const byDisc = currentExamQuestions
                .filter(q => answers[q.id] && answers[q.id] !== q.correctAnswer)
                .reduce<Record<string, number>>((acc, q) => { acc[q.discipline] = (acc[q.discipline] || 0) + 1; return acc; }, {});
              return (
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 space-y-3">
                  <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-wider flex items-center gap-1.5">
                    <X className="w-3 h-3" /> Priorize o estudo nestas disciplinas:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(byDisc).sort((a,b) => b[1]-a[1]).map(([disc, count]) => (
                      <div key={disc} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${d ? 'bg-[#0d1117] border-red-500/20' : 'bg-white border-red-200'}`}>
                        <span className="text-[10px] font-bold text-red-500">{count}✕</span>
                        <span className={`text-[10px] font-mono ${mut}`}>{disc}</span>
                        {onNavigate && <button onClick={() => onNavigate('treinar')} className="text-[9px] text-amber-500 font-bold ml-1 underline cursor-pointer">Estudar</button>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Filtros */}
            <div className={`flex p-1 rounded-xl gap-1 overflow-x-auto ${d ? 'bg-[#0d1117] border border-white/[0.06]' : 'bg-white border border-slate-200 shadow-sm'}`}>
              {([
                { id: 'all', label: `Todas (${currentExamQuestions.length})` },
                { id: 'errors', label: `Erros (${scores.incorrects})` },
                { id: 'correct', label: `Acertos (${scores.corrects})` },
                { id: 'blank', label: `Em Branco (${scores.leftBlank})` },
              ] as { id: ReviewFilter; label: string }[]).map(f => (
                <button key={f.id} onClick={() => setReviewFilter(f.id)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                    reviewFilter === f.id
                      ? d ? 'bg-indigo-600/20 border border-indigo-500 text-indigo-400' : 'bg-indigo-50 border border-indigo-300 text-indigo-600'
                      : `${mut} hover:${txt} ${d ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-50'}`}`}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Questões do gabarito */}
            <div className="space-y-4">
              {reviewQuestions.length === 0 && (
                <div className={`text-center py-10 text-sm ${mut}`}>Nenhuma questão neste filtro.</div>
              )}
              {reviewQuestions.map(q => {
                const userAns = answers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                const isBlank = !userAns;
                const article = (q as any).explanation ? extractArticle((q as any).explanation) : null;
                const tip = (q as any).subtopic ? getCebraspeTip((q as any).subtopic) : null;
                return (
                  <div key={q.id} className={`rounded-2xl p-5 space-y-3 border ${
                    isBlank ? d ? 'bg-[#0d1117] border-white/[0.06]' : 'bg-white border-slate-200' :
                    isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>

                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg border ${d ? 'bg-white/[0.04] border-white/[0.06] text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>{q.discipline}</span>
                        {(q as any).subtopic && <span className={`text-[9px] font-mono ${fnt} max-w-[200px] truncate`}>{(q as any).subtopic}</span>}
                        <span className={`text-[9px] font-mono ${fnt}`}>Q{currentExamQuestions.indexOf(q) + 1}</span>
                      </div>
                      <span className={`shrink-0 flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border ${
                        isBlank ? d ? 'bg-white/[0.04] border-white/[0.06] text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500' :
                        isCorrect ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                        {isBlank ? '— Em Branco' : isCorrect ? <><Check className="w-3 h-3" /> Certo</> : <><X className="w-3 h-3" /> Errado</>}
                      </span>
                    </div>

                    {article && !isCorrect && (
                      <span className="inline-flex text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2.5 py-1 rounded-lg">📖 {article}</span>
                    )}

                    <p className={`text-sm leading-relaxed ${d ? 'text-slate-200' : 'text-slate-700'}`}>{q.statement}</p>

                    <div className={`flex items-center gap-4 text-[11px] font-mono ${fnt}`}>
                      <span>Sua resposta: <b className={userAns ? (isCorrect ? 'text-emerald-500' : 'text-red-500') : fnt}>{userAns ? (userAns === 'C' ? 'Certo' : 'Errado') : '—'}</b></span>
                      <span>Gabarito: <b className="text-amber-500">{q.correctAnswer === 'C' ? 'Certo' : 'Errado'}</b></span>
                    </div>

                    {(q as any).explanation && (
                      <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${d ? 'bg-[#131a27] border-white/[0.06]' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-base shrink-0">🦉</span>
                        <p className={`text-xs leading-relaxed ${d ? 'text-slate-300' : 'text-slate-600'}`}>{(q as any).explanation}</p>
                      </div>
                    )}

                    {!isCorrect && !isBlank && tip && (
                      <div className="flex items-start justify-between gap-3 flex-wrap pt-1">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <span className="text-amber-500 shrink-0 text-xs mt-0.5">⚡</span>
                          <p className={`text-[11px] leading-relaxed italic ${d ? 'text-amber-300/80' : 'text-amber-700'}`}>{tip}</p>
                        </div>
                        {onNavigate && (
                          <button onClick={() => onNavigate('treinar')}
                            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-bold transition-colors cursor-pointer">
                            <BookOpen className="w-3 h-3" /> Estudar tópico
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── RESULTADO FINAL ───────────────────────────────── */}
        {testFinished && !showReview && (
          <div className="space-y-5">
            {/* Header resultado */}
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
              <h2 className={`text-2xl font-black tracking-tight ${txt}`}>Simulado Concluído!</h2>
              <p className={`text-sm ${mut}`}>Resultado consolidado no seu histórico de desempenho.</p>
            </div>

            {/* Widgets de score */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Nota Líquida', value: scores.liquidatedPoints > 0 ? `+${scores.liquidatedPoints}` : `${scores.liquidatedPoints}`, sub: 'acertos − erros', color: scores.liquidatedPoints >= 0 ? 'text-emerald-500' : 'text-red-500' },
                { label: 'Acertos / Erros', value: `${scores.corrects}/${scores.incorrects}`, sub: `${scores.leftBlank} em branco`, color: 'text-white' },
                { label: 'Aproveitamento', value: `${currentExamQuestions.length > 0 ? Math.round((scores.corrects / currentExamQuestions.length) * 100) : 0}%`, sub: `${currentExamQuestions.length} questões`, color: scores.corrects / currentExamQuestions.length >= 0.6 ? 'text-emerald-500' : 'text-amber-400' },
                { label: 'Tempo Total', value: `${Math.floor(examDurationSeconds / 60)}m${examDurationSeconds % 60}s`, sub: `~${currentExamQuestions.length > 0 ? Math.round(examDurationSeconds / currentExamQuestions.length) : 0}s/questão`, color: 'text-amber-400' },
              ].map(s => (
                <div key={s.label} className={`${card} rounded-2xl p-4 text-center`}>
                  <p className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-2 ${fnt}`}>{s.label}</p>
                  <p className={`text-2xl font-black font-mono ${s.color}`}>{s.value}</p>
                  <p className={`text-[10px] mt-1 ${fnt}`}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Breakdown por disciplina */}
            {Object.keys(disciplineStats).length > 1 && (
              <div className={`${card} rounded-2xl p-5 space-y-4`}>
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-400" />
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${fnt}`}>Desempenho por Disciplina</span>
                </div>
                <div className="space-y-3">
                  {Object.entries(disciplineStats).map(([disc, stat]) => {
                    const total = stat.correct + stat.incorrect + stat.blank;
                    const pct = total > 0 ? Math.round((stat.correct / total) * 100) : 0;
                    return (
                      <div key={disc} className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className={`${mut} truncate max-w-[60%]`}>{disc}</span>
                          <span className={`font-bold ${pct >= 60 ? 'text-emerald-500' : pct >= 40 ? 'text-amber-400' : 'text-red-500'}`}>{stat.correct}/{total} ({pct}%)</span>
                        </div>
                        <div className={`h-1.5 ${trk} rounded-full overflow-hidden`}>
                          <div className={`h-full rounded-full transition-all ${pct >= 60 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feedback Athena */}
            <div className={`flex items-start gap-3 p-4 rounded-2xl border ${d ? 'bg-indigo-950/20 border-indigo-500/15' : 'bg-indigo-50 border-indigo-200'}`}>
              <span className="text-2xl shrink-0">🦉</span>
              <div>
                <p className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider mb-1">Apreciação Athena</p>
                <p className={`text-xs leading-relaxed ${d ? 'text-slate-300' : 'text-slate-600'}`}>
                  {scores.liquidatedPoints > currentExamQuestions.length * 0.6
                    ? `Excelente! Nota líquida de ${scores.liquidatedPoints} pts — você está no percentil de aprovação. Continue firme!`
                    : `Atenção: margem líquida de ${scores.liquidatedPoints} pts ficou abaixo de 60%. ${scores.incorrects} anulações geraram perda de pontos. Na próxima, deixe em branco quando estiver em dúvida.`}
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-wrap justify-end gap-3">
              {scores.incorrects > 0 && (
                <button onClick={() => { setShowReview(true); setReviewFilter('errors'); }}
                  className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                  <X className="w-3.5 h-3.5" /> Revisar {scores.incorrects} {scores.incorrects === 1 ? 'erro' : 'erros'}
                </button>
              )}
              <button onClick={() => { setShowReview(true); setReviewFilter('all'); }}
                className={`px-4 py-2.5 border font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer ${d ? 'border-white/[0.08] hover:bg-white/[0.04] text-slate-300' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
                <BarChart2 className="w-3.5 h-3.5" /> Ver Gabarito
              </button>
              <button onClick={() => setTestFinished(false)}
                className={`px-4 py-2.5 border font-bold rounded-xl text-xs transition-all cursor-pointer ${d ? 'border-white/[0.08] hover:bg-white/[0.04] text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-500'}`}>
                Menu de Provas
              </button>
              <button onClick={() => handleStartExam(activeTab)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-indigo-500/20">
                Refazer Simulado <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
