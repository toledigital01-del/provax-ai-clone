import React, { useState, useEffect, useRef } from 'react';
import { PRF_QUESTIONS } from '../data/mockData';
import { Question } from '../types';
import { AlarmClock, Award, HelpCircle, CheckCircle, AlertOctagon, Trophy, Percent, RefreshCw, Sparkles, Flame } from 'lucide-react';

interface SimuladosProps {
  onSimuladoFinished: (score: number, totalQuestions: number, corrects: number, incorrects: number) => void;
}

type SimType = 'completo' | 'mini' | 'cebraspe' | 'ia';

export default function Simulados({ onSimuladoFinished }: SimuladosProps) {
  const [activeTab, setActiveTab] = useState<SimType>('mini');
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [testFinished, setTestFinished] = useState<boolean>(false);
  
  // Real active exam statements
  const [currentExamQuestions, setCurrentExamQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [qId: string]: 'C' | 'E' | null }>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Scorecards
  const [examDurationSeconds, setExamDurationSeconds] = useState<number>(0);
  const [isGeneratingExam, setIsGeneratingExam] = useState<boolean>(false);

  // Build the exam questions based on selection
  const handleStartExam = async (type: SimType) => {
    setIsGeneratingExam(true);
    let selectedQuestions: Question[] = [];
    let minutesLimit = 25;

    if (type === 'mini') {
      // Get 5 questions for rapid testing, limit 10 minutes
      selectedQuestions = [...PRF_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
      minutesLimit = 10;
    } else if (type === 'completo') {
      // Duplicate PRF_QUESTIONS to look larger
      selectedQuestions = [...PRF_QUESTIONS, ...PRF_QUESTIONS].map((q, idx) => ({
        ...q,
        id: `clone-${idx}-${q.id}`
      })).slice(0, 15);
      minutesLimit = 30;
    } else if (type === 'cebraspe') {
      // Just 3 quick CTB questions
      selectedQuestions = PRF_QUESTIONS.filter(q => q.discipline.includes('Trânsito')).slice(0, 3);
      minutesLimit = 5;
    } else {
      // Custom AI Mocked exam from Athena
      try {
        const response = await fetch('/api/generate-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ discipline: 'Legislação de Trânsito', difficulty: 'Difícil' })
        });
        const customQ = await response.json();
        selectedQuestions = [customQ, ...PRF_QUESTIONS.slice(0, 3)];
      } catch (e) {
        selectedQuestions = PRF_QUESTIONS.slice(0, 4);
      }
      minutesLimit = 8;
    }

    setCurrentExamQuestions(selectedQuestions);
    const initialAnswers: any = {};
    selectedQuestions.forEach(q => { initialAnswers[q.id] = null; });
    setAnswers(initialAnswers);
    
    setTimeRemaining(minutesLimit * 60);
    setCurrentIdx(0);
    setTestFinished(false);
    setTestStarted(true);
    setIsGeneratingExam(false);
    startTimeRef.current = Date.now();

    // Start countdown timer
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
    
    const endedTime = Date.now();
    setExamDurationSeconds(Math.floor((endedTime - startTimeRef.current) / 1000));

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
      if (uAns === null || uAns === undefined) {
        leftBlank++;
      } else if (uAns === q.correctAnswer) {
        corrects++;
      } else {
        incorrects++;
      }
    });

    // CEBRASPE Score Calculation (Liquidated score: corrects - incorrects)
    const liquidatedPoints = corrects - incorrects;

    return {
      corrects,
      incorrects,
      leftBlank,
      liquidatedPoints
    };
  };

  const scores = getCalculatedScores();
  
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="simulador-view-wrapper">
      
      {/* Tab selecting mode */}
      {!testStarted && !testFinished && (
        <div className="space-y-6" id="simulado-setup-mode shadow-none">
          <div>
            <span className="text-xs text-yellow-500 font-mono tracking-widest font-semibold uppercase">CENTRAL DE PROVAS</span>
            <h2 className="text-xl font-extrabold text-white">Simulados Padrão CEBRASPE</h2>
            <p className="text-xs text-slate-400 mt-1">
              A regra da banca CEBRASPE é brutal: **uma resposta incorreta anula uma correta**. Desenvolva estratégia de pular quando não tiver convicção.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="simulado-modes-cards">
            {/* Mode card 1 */}
            <button 
              onClick={() => setActiveTab('mini')}
              className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px] ${
                activeTab === 'mini' 
                  ? 'bg-slate-950 border-emerald-500 text-white shadow-lg' 
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xl">⚡</span>
                <h4 className="font-bold text-sm text-white">Mini Simulado</h4>
                <p className="text-[11px] text-slate-400">5 questões selecionadas, prazo de 10 min. Ideal para revisões estratégicas de rotina.</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 mt-4 block">RÁPIDO</span>
            </button>

            {/* Mode card 2 */}
            <button 
              onClick={() => setActiveTab('completo')}
              className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px] ${
                activeTab === 'completo' 
                  ? 'bg-slate-950 border-emerald-500 text-white shadow-lg' 
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xl">🏆</span>
                <h4 className="font-bold text-sm text-white">Simulado Completo</h4>
                <p className="text-[11px] text-slate-400">15 questões representativas de todas as áreas. Simulador rígido de 30 min.</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 mt-4 block">PADRÃO PRF</span>
            </button>

            {/* Mode card 3 */}
            <button 
              onClick={() => setActiveTab('cebraspe')}
              className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px] ${
                activeTab === 'cebraspe' 
                  ? 'bg-slate-950 border-emerald-500 text-white shadow-lg' 
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xl">👮‍♂️</span>
                <h4 className="font-bold text-sm text-white">Trânsito Puro (C/E)</h4>
                <p className="text-[11px] text-slate-400">Questões exclusivas de trânsito. O foco líquido da aprovação da PRF.</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 mt-4 block">ESPECÍFICA</span>
            </button>

            {/* Mode card 4 */}
            <button 
              onClick={() => setActiveTab('ia')}
              className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px] ${
                activeTab === 'ia' 
                  ? 'bg-slate-950 border-emerald-500 text-white shadow-lg' 
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xl">🦉</span>
                <h4 className="font-bold text-sm text-white flex items-center gap-1">Athena IA <Sparkles className="w-3.5 h-3.5 text-yellow-500" /></h4>
                <p className="text-[11px] text-slate-400">A Athena monta um simulador adaptado às suas fraquezas identificadas.</p>
              </div>
              <span className="text-[10px] font-mono text-yellow-500 mt-4 block">ADAPTATIVO</span>
            </button>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => handleStartExam(activeTab)}
              disabled={isGeneratingExam}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-950/40 transition-transform hover:scale-[1.01]"
              id="btn-trigger-exam"
            >
              {isGeneratingExam ? 'Athena está preparando as provas...' : 'Iniciar Simulado Selecionado'}
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE TESTING ROOM */}
      {testStarted && !testFinished && (
        <div className="space-y-6" id="exam-classroom-view">
          {/* Top Exam Header with clock */}
          <div className="flex border-b border-slate-800 pb-4 justify-between items-center bg-slate-950 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-slate-900 rounded-lg text-yellow-500 font-bold border border-slate-800">C/E</span>
              <div>
                <h4 className="font-bold text-white text-sm">Simulador Estratégico</h4>
                <p className="text-xs text-slate-400">Questão {currentIdx + 1} de {currentExamQuestions.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-white text-sm bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-right">
              <AlarmClock className="w-4 h-4 text-red-500" />
              <span>Restam: {formatTime(timeRemaining)}</span>
            </div>
          </div>

          {/* Exam layout grids */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="exam-grids-container">
            
            {/* Left 3 cols: active question pane */}
            <div className="lg:col-span-3 space-y-4" id="active-question-pane">
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl relative">
                <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-800 mb-2 inline-block">
                  {currentExamQuestions[currentIdx]?.discipline}
                </span>
                <p className="text-slate-200 leading-relaxed text-sm font-sans my-4 min-h-[100px]">
                  {currentExamQuestions[currentIdx]?.statement}
                </p>
              </div>

              {/* Answering choices for CEBRASPE */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => selectAnswer('C')}
                  className={`p-4 rounded-xl border font-bold text-center transition-all ${
                    answers[currentExamQuestions[currentIdx]?.id] === 'C'
                      ? 'bg-green-950/40 border-green-500 text-green-400 ring-1 ring-green-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                  id="choice-cebraspe-certo"
                >
                  Certo
                </button>
                <button
                  onClick={() => selectAnswer('E')}
                  className={`p-4 rounded-xl border font-bold text-center transition-all ${
                    answers[currentExamQuestions[currentIdx]?.id] === 'E'
                      ? 'bg-red-950/20 border-red-500 text-red-300 ring-1 ring-red-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                  id="choice-cebraspe-errado"
                >
                  Errado
                </button>
              </div>

              {/* Bottom control row */}
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

            {/* Right col: Question grid matrix / dashboard navigation */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4" id="matrix-pane">
              <span className="text-xs uppercase font-mono text-slate-400 font-bold block">Folha de Respostas</span>
              <div className="grid grid-cols-5 gap-2" id="grid-matrix-navigation">
                {currentExamQuestions.map((q, idx) => {
                  const state = answers[q.id];
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-10 h-10 rounded-lg border font-mono text-xs font-bold transition-all ${
                        currentIdx === idx 
                          ? 'ring-2 ring-emerald-500/50 scale-[1.05] border-emerald-500 text-white' 
                          : state !== null 
                            ? 'bg-slate-800 border-slate-600 text-white' 
                            : 'bg-slate-900/60 border-slate-800 text-slate-500'
                      }`}
                      title={state ? `Respondida: ${state}` : 'Não respondida'}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-900 text-[10px] text-slate-500 space-y-1 font-mono">
                <div className="flex items-center gap-1.5"><b className="w-2.5 h-2.5 rounded bg-slate-800 inline-block" /> Respondidas</div>
                <div className="flex items-center gap-1.5"><b className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-800 inline-block" /> Pendente / Em Branco</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PERFORMANCE SCORECARD RESULT */}
      {testFinished && (
        <div className="space-y-6 animate-scale-up" id="finished-scorecard-pane">
          
          <div className="text-center space-y-2 py-4">
            <div className="p-4 bg-yellow-950/20 text-yellow-500 rounded-full w-16 h-16 mx-auto flex items-center justify-center border border-yellow-500/20">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-white">Simulado Concluído</h2>
            <p className="text-xs text-slate-400">Sua nota técnica líquida do simulador foi consolidada no seu histórico de desempenho.</p>
          </div>

          {/* scores matrix details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="calculator-dashboard-widgets">
            {/* Widget 1: CEBRASPE Liquid score */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">Nota Líquida CEBRASPE</span>
              <span className={`text-3xl font-black font-mono ${scores.liquidatedPoints >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {scores.liquidatedPoints > 0 ? `+${scores.liquidatedPoints}` : scores.liquidatedPoints}
              </span>
              <p className="text-[10px] text-slate-500 mt-2">(Acertos - Erros)</p>
            </div>

            {/* Widget 2: Accuracies */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">Acertos / Erros</span>
              <span className="text-2xl font-black text-white font-mono flex items-center justify-center gap-1">
                <span className="text-emerald-400">{scores.corrects}</span>
                <span className="text-slate-650">/</span>
                <span className="text-red-400">{scores.incorrects}</span>
              </span>
              <p className="text-[10px] text-slate-500 mt-2">({scores.leftBlank} em branco)</p>
            </div>

            {/* Widget 3: Percentage Accuracy */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">Taxa de Aproveitamento</span>
              <span className="text-3xl font-black font-mono text-white">
                {currentExamQuestions.length > 0 ? Math.round((scores.corrects / currentExamQuestions.length) * 100) : 0}%
              </span>
              <p className="text-[10px] text-slate-500 mt-2">({currentExamQuestions.length} questões totais)</p>
            </div>

            {/* Widget 4: Tempo médio */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">Tempo de Prova</span>
              <span className="text-3xl font-black text-yellow-500 font-mono">
                {Math.floor(examDurationSeconds / 60)}m {examDurationSeconds % 60}s
              </span>
              <p className="text-[10px] text-slate-500 mt-2">Médio: {currentExamQuestions.length > 0 ? Math.round(examDurationSeconds / currentExamQuestions.length) : 0}s /questão</p>
            </div>
          </div>

          {/* Tactical Feedback from Athena */}
          <div className="athena-box-style p-5" id="athena-feedback-scorecard">
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-0.5">🦉</span>
              <div className="space-y-1">
                <p className="text-xs uppercase font-mono text-athena-title font-bold tracking-wider">Apreciação Estratégica da Athena:</p>
                <p className="text-xs text-athena-body leading-relaxed font-sans italic">
                  {scores.liquidatedPoints > (currentExamQuestions.length * 0.6) ? (
                    `Excelente resultado, futuro aprovado! Sua nota líquida consolidada de **${scores.liquidatedPoints} pontos** em ${currentExamQuestions.length} assertivas coloca você no topo do percentil de aprovação. Sua estratégia de focar nas leis secas do CTB está pagando dividendos. Continue firme nos estudos!`
                  ) : (
                    `Atenção na preparação, candidato. A margem líquida CEBRASPE de **${scores.liquidatedPoints} pontos** ficou abaixo do teto de seguridade de 60%. Notei que responder com dúvida em vez de pular gerou ${scores.incorrects} anulações que descontaram sua pontuação principal. No próximo mini-simulado, se a dúvida persistir, deixe a assertiva em branco!`
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-3 pt-3">
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
