import React, { useState, useEffect, useRef } from 'react';
import { PRF_QUESTIONS } from '../data/mockData';
import { Question } from '../types';
import { AlarmClock, Trophy, RefreshCw, Sparkles, Check, X, BarChart2, ChevronLeft } from 'lucide-react';

interface SimuladosProps {
  onSimuladoFinished: (score: number, totalQuestions: number, corrects: number, incorrects: number) => void;
}

type SimType = 'completo' | 'mini' | 'cebraspe' | 'ia';
type ReviewFilter = 'all' | 'errors' | 'correct' | 'blank';

export default function Simulados({ onSimuladoFinished }: SimuladosProps) {
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
      selectedQuestions = [...PRF_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
      minutesLimit = 10;
    } else if (type === 'completo') {
      selectedQuestions = [...PRF_QUESTIONS, ...PRF_QUESTIONS]
        .map((q, idx) => ({ ...q, id: `clone-${idx}-${q.id}` }))
        .slice(0, 15);
      minutesLimit = 30;
    } else if (type === 'cebraspe') {
      selectedQuestions = PRF_QUESTIONS.filter(q => q.discipline.includes('Trânsito')).slice(0, 3);
      minutesLimit = 5;
    } else {
      try {
        const response = await fetch('/api/generate-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ discipline: 'Legislação de Trânsito', difficulty: 'Difícil' }),
        });
        const customQ = await response.json();
        selectedQuestions = [customQ, ...PRF_QUESTIONS.slice(0, 3)];
      } catch (e) {
        selectedQuestions = PRF_QUESTIONS.slice(0, 4);
      }
      minutesLimit = 8;
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

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="simulador-view-wrapper">

      {/* ---- SETUP MODE ---- */}
      {!testStarted && !testFinished && (
        <div className="space-y-6" id="simulado-setup-mode">
          <div>
            <span className="text-xs text-yellow-500 font-mono tracking-widest font-semibold uppercase">CENTRAL DE PROVAS</span>
            <h2 className="text-xl font-extrabold text-white">Simulados Padrão CEBRASPE</h2>
            <p className="text-xs text-slate-400 mt-1">
              A regra da banca CEBRASPE é brutal: uma resposta incorreta anula uma correta. Desenvolva a estratégia de pular quando não tiver convicção.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="simulado-modes-cards">
            <button
              onClick={() => setActiveTab('mini')}
              className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[160px] ${
                activeTab === 'mini' ? 'bg-slate-950 border-emerald-500 text-white shadow-lg' : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xl">⚡</span>
                <h4 className="font-bold text-sm text-white">Mini Simulado</h4>
                <p className="text-[11px] text-slate-400">5 questões selecionadas, prazo de 10 min. Ideal para revisões estratégicas de rotina.</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 mt-4 block">RÁPIDO</span>
            </button>

            <button
              onClick={() => setActiveTab('completo')}
              className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[160px] ${
                activeTab === 'completo' ? 'bg-slate-950 border-emerald-500 text-white shadow-lg' : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xl">🏆</span>
                <h4 className="font-bold text-sm text-white">Simulado Completo</h4>
                <p className="text-[11px] text-slate-400">15 questões representativas de todas as áreas. Simulador rígido de 30 min.</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 mt-4 block">PADRÃO PRF</span>
            </button>

            <button
              onClick={() => setActiveTab('cebraspe')}
              className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[160px] ${
                activeTab === 'cebraspe' ? 'bg-slate-950 border-emerald-500 text-white shadow-lg' : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xl">👮‍♂️</span>
                <h4 className="font-bold text-sm text-white">Trânsito Puro (C/E)</h4>
                <p className="text-[11px] text-slate-400">Questões exclusivas de trânsito. O foco líquido da aprovação da PRF.</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 mt-4 block">ESPECÍFICA</span>
            </button>

            <button
              onClick={() => setActiveTab('ia')}
              className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[160px] ${
                activeTab === 'ia' ? 'bg-slate-950 border-emerald-500 text-white shadow-lg' : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xl">🦉</span>
                <h4 className="font-bold text-sm text-white flex items-center gap-1">Athena IA <Sparkles className="w-3.5 h-3.5 text-yellow-500" /></h4>
                <p className="text-[11px] text-slate-400">A Athena monta um simulado adaptado às suas fraquezas identificadas.</p>
              </div>
              <span className="text-[10px] font-mono text-yellow-500 mt-4 block">ADAPTATIVO</span>
            </button>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => handleStartExam(activeTab)}
              disabled={isGeneratingExam}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm shadow-lg transition-transform hover:scale-[1.01] disabled:opacity-60"
              id="btn-trigger-exam"
            >
              {isGeneratingExam ? 'Athena está preparando as provas...' : 'Iniciar Simulado Selecionado'}
            </button>
          </div>
        </div>
      )}

      {/* ---- ACTIVE EXAM ---- */}
      {testStarted && !testFinished && (
        <div className="space-y-6" id="exam-classroom-view">
          {/* Exam header */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-slate-900 rounded-lg text-yellow-500 font-bold border border-slate-800 text-xs font-mono">C/E</span>
                <div>
                  <h4 className="font-bold text-white text-sm">Simulador Estratégico</h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Questão <span className="text-white font-bold">{currentIdx + 1}</span> de <span className="text-slate-300">{currentExamQuestions.length}</span>
                    <span className="ml-3 text-slate-500">·</span>
                    <span className="ml-3 text-emerald-400 font-semibold">{answeredCount} respondidas</span>
                    {answeredCount < currentExamQuestions.length && (
                      <span className="ml-1.5 text-slate-500">({currentExamQuestions.length - answeredCount} em branco)</span>
                    )}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-2 font-mono text-sm px-4 py-2 rounded-lg border ${
                timeRemaining <= 60 ? 'bg-red-950/30 border-red-800 text-red-400 animate-pulse' : 'bg-slate-900 border-slate-800 text-white'
              }`}>
                <AlarmClock className="w-4 h-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                style={{ width: `${currentExamQuestions.length > 0 ? ((currentIdx + 1) / currentExamQuestions.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="exam-grids-container">

            {/* Left: active question */}
            <div className="lg:col-span-3 space-y-4" id="active-question-pane">
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                    {currentExamQuestions[currentIdx]?.discipline}
                  </span>
                  {(currentExamQuestions[currentIdx] as any)?.difficulty && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      (currentExamQuestions[currentIdx] as any).difficulty === 'Fácil' ? 'bg-emerald-950 text-emerald-400' :
                      (currentExamQuestions[currentIdx] as any).difficulty === 'Média' ? 'bg-yellow-950 text-yellow-500' :
                      'bg-red-950 text-red-400'
                    }`}>
                      {(currentExamQuestions[currentIdx] as any).difficulty}
                    </span>
                  )}
                </div>
                <p className="text-slate-200 leading-relaxed text-sm font-sans min-h-[100px]">
                  {currentExamQuestions[currentIdx]?.statement}
                </p>
              </div>

              {/* Answer buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => selectAnswer('C')}
                  className={`p-4 rounded-xl border font-bold text-center transition-all focus:outline-none ${
                    answers[currentExamQuestions[currentIdx]?.id] === 'C'
                      ? 'bg-emerald-600 border-emerald-500 text-white ring-2 ring-emerald-400/30 shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-emerald-700/50 hover:text-emerald-400'
                  }`}
                  id="choice-cebraspe-certo"
                >
                  <span className="block text-lg">Certo</span>
                  <span className="text-[10px] font-mono opacity-60">(Assertiva Verdadeira)</span>
                </button>
                <button
                  onClick={() => selectAnswer('E')}
                  className={`p-4 rounded-xl border font-bold text-center transition-all focus:outline-none ${
                    answers[currentExamQuestions[currentIdx]?.id] === 'E'
                      ? 'bg-red-600 border-red-500 text-white ring-2 ring-red-400/30 shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-red-700/50 hover:text-red-400'
                  }`}
                  id="choice-cebraspe-errado"
                >
                  <span className="block text-lg">Errado</span>
                  <span className="text-[10px] font-mono opacity-60">(Assertiva Falsa)</span>
                </button>
              </div>

              {/* Keyboard hints */}
              <div className="flex justify-center gap-6 text-[9px] font-mono text-slate-700 select-none -mt-1">
                <span>← Errado</span>
                <span>Certo →</span>
                <span>Enter Avançar</span>
                <span>Del Limpar</span>
              </div>

              {/* Navigation row */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={clearAnswer}
                  className="px-4 py-2 hover:bg-slate-800 border border-transparent rounded-lg text-xs font-semibold text-slate-400 font-mono transition-colors"
                >
                  Deixar em Branco
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                    disabled={currentIdx === 0}
                    className="px-4 py-2 border border-slate-800 bg-slate-950 hover:bg-slate-800 rounded-lg text-xs text-slate-300 disabled:opacity-40"
                  >
                    Anterior
                  </button>
                  {currentIdx === currentExamQuestions.length - 1 ? (
                    <button
                      onClick={() => handleFinishExam(false)}
                      className="px-5 py-2 bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold rounded-lg text-xs"
                      id="btn-finish-simulado"
                    >
                      Finalizar Prova
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentIdx(prev => Math.min(currentExamQuestions.length - 1, prev + 1))}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
                    >
                      Avançar
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right: answer matrix */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4" id="matrix-pane">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono text-slate-400 font-bold">Folha de Respostas</span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">{answeredCount}/{currentExamQuestions.length}</span>
              </div>

              {/* Answered progress bar */}
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${currentExamQuestions.length > 0 ? (answeredCount / currentExamQuestions.length) * 100 : 0}%` }}
                />
              </div>

              <div className="grid grid-cols-5 gap-2" id="grid-matrix-navigation">
                {currentExamQuestions.map((q, idx) => {
                  const state = answers[q.id];
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-10 h-10 rounded-lg border font-mono text-xs font-bold transition-all ${
                        currentIdx === idx
                          ? 'ring-2 ring-emerald-500/50 scale-[1.05] border-emerald-500 text-white bg-emerald-950/30'
                          : state === 'C'
                            ? 'bg-emerald-950/30 border-emerald-900 text-emerald-400'
                            : state === 'E'
                              ? 'bg-rose-950/30 border-rose-900 text-rose-400'
                              : 'bg-slate-900/60 border-slate-800 text-slate-500'
                      }`}
                      title={state ? `${idx + 1}: ${state === 'C' ? 'Certo' : 'Errado'}` : `${idx + 1}: Em branco`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-900 text-[10px] text-slate-500 space-y-1 font-mono">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-950/40 border border-emerald-900 inline-block" /> Certo</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-950/40 border border-rose-900 inline-block" /> Errado</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-800 inline-block" /> Em branco</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- POST-EXAM REVIEW ---- */}
      {testFinished && showReview && (
        <div className="space-y-5" id="review-mode-view">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowReview(false)}
              className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Voltar ao Gabarito
            </button>
            <span className="text-xs font-mono text-slate-500">{reviewQuestions.length} questões</span>
          </div>

          {/* Filter bar */}
          <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl gap-1 overflow-x-auto">
            {([
              { id: 'all', label: `Todas (${currentExamQuestions.length})` },
              { id: 'errors', label: `Erros (${scores.incorrects})` },
              { id: 'correct', label: `Acertos (${scores.corrects})` },
              { id: 'blank', label: `Em Branco (${scores.leftBlank})` },
            ] as { id: ReviewFilter; label: string }[]).map(f => (
              <button
                key={f.id}
                onClick={() => setReviewFilter(f.id)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
                  reviewFilter === f.id
                    ? 'bg-emerald-950/40 border border-emerald-500 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Question cards */}
          <div className="space-y-4">
            {reviewQuestions.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                <p className="text-xs">Nenhuma questão sob este filtro.</p>
              </div>
            )}
            {reviewQuestions.map((q, i) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              const isBlank = !userAns;

              return (
                <div
                  key={q.id}
                  className={`bg-slate-950 border rounded-xl p-5 space-y-3 ${
                    isBlank ? 'border-slate-800' : isCorrect ? 'border-emerald-900/40' : 'border-red-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase tracking-wider">
                        {q.discipline}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">Q{currentExamQuestions.indexOf(q) + 1}</span>
                    </div>
                    <span className={`shrink-0 flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg ${
                      isBlank
                        ? 'bg-slate-800 text-slate-400'
                        : isCorrect
                          ? 'bg-emerald-950/40 text-emerald-400'
                          : 'bg-red-950/40 text-red-400'
                    }`}>
                      {isBlank ? '— Em Branco' : isCorrect ? <><Check className="w-3 h-3" /> Certo</> : <><X className="w-3 h-3" /> Errado</>}
                    </span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed font-sans">{q.statement}</p>

                  <div className="flex items-center gap-4 text-[11px] font-mono">
                    <span className="text-slate-500">
                      Sua resposta: <b className={userAns ? (isCorrect ? 'text-emerald-400' : 'text-red-400') : 'text-slate-500'}>
                        {userAns ? (userAns === 'C' ? 'Certo' : 'Errado') : '—'}
                      </b>
                    </span>
                    <span className="text-slate-500">
                      Gabarito: <b className="text-yellow-400">{q.correctAnswer === 'C' ? 'Certo' : 'Errado'}</b>
                    </span>
                  </div>

                  {(q as any).explanation && (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex items-start gap-2.5">
                      <span className="text-base shrink-0">🦉</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{(q as any).explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- SCORECARD ---- */}
      {testFinished && !showReview && (
        <div className="space-y-6 animate-scale-up" id="finished-scorecard-pane">

          <div className="text-center space-y-2 py-4">
            <div className="p-4 bg-yellow-950/20 text-yellow-500 rounded-full w-16 h-16 mx-auto flex items-center justify-center border border-yellow-500/20">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-white">Simulado Concluído</h2>
            <p className="text-xs text-slate-400">Nota técnica consolidada no seu histórico de desempenho.</p>
          </div>

          {/* Score widgets */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="calculator-dashboard-widgets">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">Nota Líquida CEBRASPE</span>
              <span className={`text-3xl font-black font-mono ${scores.liquidatedPoints >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {scores.liquidatedPoints > 0 ? `+${scores.liquidatedPoints}` : scores.liquidatedPoints}
              </span>
              <p className="text-[10px] text-slate-500 mt-2">(Acertos − Erros)</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">Acertos / Erros</span>
              <span className="text-2xl font-black text-white font-mono flex items-center justify-center gap-1">
                <span className="text-emerald-400">{scores.corrects}</span>
                <span className="text-slate-600">/</span>
                <span className="text-red-400">{scores.incorrects}</span>
              </span>
              <p className="text-[10px] text-slate-500 mt-2">({scores.leftBlank} em branco)</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">Taxa de Aproveitamento</span>
              <span className={`text-3xl font-black font-mono ${currentExamQuestions.length > 0 && scores.corrects / currentExamQuestions.length >= 0.6 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {currentExamQuestions.length > 0 ? Math.round((scores.corrects / currentExamQuestions.length) * 100) : 0}%
              </span>
              <p className="text-[10px] text-slate-500 mt-2">({currentExamQuestions.length} questões)</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">Tempo de Prova</span>
              <span className="text-3xl font-black text-yellow-500 font-mono">
                {Math.floor(examDurationSeconds / 60)}m {examDurationSeconds % 60}s
              </span>
              <p className="text-[10px] text-slate-500 mt-2">
                ~{currentExamQuestions.length > 0 ? Math.round(examDurationSeconds / currentExamQuestions.length) : 0}s por questão
              </p>
            </div>
          </div>

          {/* Discipline breakdown */}
          {Object.keys(disciplineStats).length > 1 && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3" id="discipline-breakdown">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Desempenho por Disciplina</span>
              </div>
              <div className="space-y-2">
                {Object.entries(disciplineStats).map(([disc, stat]) => {
                  const total = stat.correct + stat.incorrect + stat.blank;
                  const pct = total > 0 ? Math.round((stat.correct / total) * 100) : 0;
                  return (
                    <div key={disc} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400 truncate max-w-[60%]">{disc}</span>
                        <span className={`font-bold ${pct >= 60 ? 'text-emerald-400' : pct >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                          {stat.correct}/{total} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct >= 60 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Athena feedback */}
          <div className="athena-box-style p-5" id="athena-feedback-scorecard">
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-0.5">🦉</span>
              <div className="space-y-1">
                <p className="text-xs uppercase font-mono text-athena-title font-bold tracking-wider">Apreciação Estratégica da Athena:</p>
                <p className="text-xs text-athena-body leading-relaxed font-sans">
                  {scores.liquidatedPoints > (currentExamQuestions.length * 0.6)
                    ? `Excelente resultado! Sua nota líquida de ${scores.liquidatedPoints} pontos em ${currentExamQuestions.length} assertivas coloca você no topo do percentil de aprovação. Continue firme nos estudos!`
                    : `Atenção. A margem líquida CEBRASPE de ${scores.liquidatedPoints} pontos ficou abaixo do teto de segurança de 60%. Responder com dúvida em vez de pular gerou ${scores.incorrects} anulações. No próximo simulado, se a dúvida persistir, deixe em branco!`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Action footer */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3">
            {scores.incorrects > 0 && (
              <button
                onClick={() => { setShowReview(true); setReviewFilter('errors'); }}
                className="px-5 py-2.5 bg-red-950/30 border border-red-900/40 hover:bg-red-950/50 text-red-300 font-bold rounded-lg text-xs flex items-center gap-1.5 justify-center"
                id="btn-review-errors"
              >
                <X className="w-3.5 h-3.5" /> Revisar {scores.incorrects} {scores.incorrects === 1 ? 'Erro' : 'Erros'}
              </button>
            )}
            <button
              onClick={() => { setShowReview(true); setReviewFilter('all'); }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 justify-center"
              id="btn-review-all"
            >
              <BarChart2 className="w-3.5 h-3.5" /> Ver Gabarito Completo
            </button>
            <button
              onClick={() => setTestFinished(false)}
              className="px-5 py-2.5 border border-slate-800 hover:bg-slate-850 rounded-lg text-xs font-mono font-bold text-slate-400 hover:text-white"
            >
              Menu de Provas
            </button>
            <button
              onClick={() => handleStartExam(activeTab)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              Refazer Simulado <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
