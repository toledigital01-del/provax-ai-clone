import React from 'react';
import { ProgressData } from '../types';
import { Award, CheckCircle2, AlertTriangle, ShieldCheck, Flame, Layers, HelpCircle, TrendingUp, Clock } from 'lucide-react';

interface ProgressoProps {
  progress: ProgressData;
  theme?: 'light' | 'dark';
}

export default function Progresso({ progress, theme = 'dark' }: ProgressoProps) {
  const isLight = theme === 'light';

  // Mocking an evolution line chart of approval probability over study days
  const evolutionHistory = [
    { day: 'Dia 1', prob: 35.0 },
    { day: 'Dia 2', prob: 38.4 },
    { day: 'Dia 3', prob: 42.1 },
    { day: 'Dia 4', prob: 44.0 },
    { day: 'Dia 5', prob: 48.5 },
  ];

  const maxProb = 100;
  
  // Custom SVG calculation parameters for the line graph
  const width = 500;
  const height = 180;
  const padding = 30;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  // Map evolution list into SVG coordinates
  const points = evolutionHistory.map((item, index) => {
    const x = padding + (index / (evolutionHistory.length - 1)) * graphWidth;
    const y = height - padding - (item.prob / maxProb) * graphHeight;
    return { x, y, prob: item.prob, label: item.day };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  // Specific CEBRASPE diagnostics
  const getCebraspeDiagnosis = () => {
    const incorrectCount = progress.totalIncorrect;
    const netCEBRASPE = progress.totalCorrect - incorrectCount;
    return {
      netScore: netCEBRASPE,
      liquidEfficiency: progress.totalQuestionsAnswered > 0 ? Math.round((netCEBRASPE / progress.totalQuestionsAnswered) * 100) : 0,
      riskRatio: progress.totalQuestionsAnswered > 0 ? Math.round((incorrectCount / progress.totalQuestionsAnswered) * 100) : 0
    };
  };

  const cebraspeStats = getCebraspeDiagnosis();

  return (
    <div className="space-y-6" id="progress-view-wrapper">
      
      {/* ====================================================================
          MARCOS DE EVOLUÇÃO E PERFORMANCE - MIGRATED FROM DASHBOARD
          ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="performance-evolucoes-camada">
        
        {/* Card 2.1: Aprovação Preditiva */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
          isLight 
            ? 'bg-white border-slate-200 shadow-sm' 
            : 'bg-slate-900 border-slate-800 text-slate-100'
        } flex flex-col justify-between`} id="approv-preditive-widget">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-extrabold block">
                Aprovação Preditiva
              </span>
              <span className="text-[9px] font-mono py-0.5 px-2 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider">
                Métrica Real
              </span>
            </div>
            
            <div className="flex items-center gap-4 py-3 mt-1.5">
              <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-slate-950/60 border border-slate-850 shrink-0">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    className="stroke-[#1b263e]"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    className="stroke-emerald-500 transition-all duration-700 ease-out"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress.currentApprovalProbability / 100)}`}
                    fill="transparent"
                  />
                </svg>
                <span className="text-sm font-mono font-black text-white">
                  {progress.currentApprovalProbability.toFixed(1)}%
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs text-slate-400 block leading-normal">Status acumulado contra nota de corte.</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +1.2% nos últimos dias
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-500 pt-3 border-t border-slate-800/60 mt-2">
            Mediana histórica de corte PRF líquida é ~82%.
          </p>
        </div>

        {/* Card 2.2: Ofensiva / Streak Study */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
          isLight 
            ? 'bg-white border-slate-200 shadow-sm' 
            : 'bg-slate-900 border-slate-800 text-slate-100'
        } flex flex-col justify-between`} id="streak-ofensiva-widget">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-extrabold block">
                Ofensiva de Estudos
              </span>
              <div className="flex items-center gap-1 text-orange-500">
                <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
                <span className="text-[10px] font-mono font-bold">{progress.daysConsecutive}D</span>
              </div>
            </div>

            <div className="py-2.5 mt-1">
              <div className="text-2xl font-black font-mono text-white leading-tight">
                {progress.daysConsecutive} Dias Seguidos
              </div>
              <p className="text-[10px] text-slate-400 leading-normal mt-1">
                Sua constância semanal impede declínio rápido na curva de aprendizado ativa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mt-2 text-center pt-2 border-t border-slate-800/60">
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, idx) => {
              const active = idx < progress.daysConsecutive;
              return (
                <div key={idx} className="space-y-1">
                  <div className={`w-full h-1.5 rounded-full ${
                    active ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-slate-950'
                  }`} />
                  <span className="text-[8px] text-slate-500 font-mono block font-bold">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2.3: Estatísticas de Evolução */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
          isLight 
            ? 'bg-white border-slate-200 shadow-sm' 
            : 'bg-slate-900 border-slate-800 text-slate-100'
        } flex flex-col justify-between`} id="quick-combat-stats-widget">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-extrabold block">
              Métricas de Retenção
            </span>

            <div className="space-y-2.5 py-3 mt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Taxa de Acerto:</span>
                <span className="font-mono font-bold text-white text-right">{progress.overallAccuracyRate}%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium font-sans">Questões:</span>
                <span className="font-mono font-bold text-slate-300 text-right">
                  {progress.totalQuestionsAnswered} <span className="text-[10px] font-normal"><span className="text-emerald-400">{progress.totalCorrect}C</span> <span className="text-red-400">{progress.totalIncorrect}E</span></span>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Cobertura:</span>
                <span className="font-mono font-bold text-amber-500 text-right">{progress.syllabusCoverage}% do edital</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/60 flex justify-between">
            <span>Pontos teóricos</span>
            <span>Estável</span>
          </div>
        </div>

        {/* Card 2.4: Semáforo de Foco */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
          isLight 
            ? 'bg-white border-slate-200 shadow-sm' 
            : 'bg-slate-900 border-slate-800 text-slate-100'
        } flex flex-col justify-between`} id="semaforo-restructured-widget">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-extrabold block mb-2">
              🚦 Semáforo de Prontidão
            </span>

            <div className="space-y-2" id="semaforo-items-sidebar">
              {Object.entries(progress.disciplinePerformance).slice(0, 4).map(([subject, data]) => {
                const shortSubject = subject.replace('Direito ', 'D. ');
                return (
                  <div key={subject} className="flex items-center justify-between text-xs">
                     <span className="text-slate-400 truncate max-w-[125px]" title={subject}>
                      {shortSubject}
                    </span>
                    <div className="flex items-center gap-1.5">
                       <span className="font-mono font-bold text-slate-300">{data.efficiency}%</span>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        data.status === 'safe' ? 'bg-emerald-500' :
                        data.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500 animate-pulse'
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60 text-right mt-1.5">
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
              Nota Líquida: {cebraspeStats.netScore} pts
            </span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="progress-deep-panels">
        
        {/* Left col span 2: Line Graph of Evolution */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between" id="evolution-graph-panel">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" /> Curva de Evolução da Aprovação
              </h3>
              <span className="text-xs text-emerald-400 font-mono font-bold font-mono">Últimos 5 Ciclos</span>
            </div>
            
            <p className="text-xs text-slate-400 mb-4 leading-normal">
              Esta curva projeta sua aprovação baseado em tempo de foco acumulado e acerto líquido no CEBRASPE. A nota alvo para estar nos classificados é <b>~72%</b>.
            </p>
          </div>

          {/* SVG line chart workspace */}
          <div className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-850 flex items-center justify-center overflow-x-auto">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full max-w-lg overflow-visible"
              id="svg-line-graph"
            >
              {/* Grid guide systems */}
              <line x1={0 + padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1" strokeDasharray="2" />
              <line x1={0 + padding} y1={height - padding - (50 / maxProb) * graphHeight} x2={width - padding} y2={height - padding - (50 / maxProb) * graphHeight} stroke="#1e293b" strokeWidth="1" strokeDasharray="4" />
              <line x1={0 + padding} y1={height - padding - (75 / maxProb) * graphHeight} x2={width - padding} y2={height - padding - (75 / maxProb) * graphHeight} stroke="#047857" strokeWidth="1" strokeDasharray="3" />

              {/* Grid labels */}
              <text x={padding - 5} y={height - padding - (75 / maxProb) * graphHeight + 4} fill="#059669" fontSize="9" fontFamily="monospace" textAnchor="end">75% (Aprovado)</text>
              <text x={padding - 5} y={height - padding - (50 / maxProb) * graphHeight + 4} fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="end">50%</text>

              {/* Main vector line path */}
              <path d={pathD} fill="none" stroke="url(#gradient)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Node highlights */}
              {points.map((point, index) => (
                <g key={index}>
                  <circle cx={point.x} cy={point.y} r="5" fill="#10b981" stroke="#090d16" strokeWidth="2" />
                  <text x={point.x} y={point.y - 12} fill="#ef4444" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    {point.prob}%
                  </text>
                  <text x={point.x} y={height - padding + 15} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    {point.label}
                  </text>
                </g>
              ))}

              {/* Color Gradient definitions */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-4 pt-2 border-t border-slate-900 leading-normal">
            <span>Início: 35.0%</span>
            <span className="text-emerald-400 font-semibold">Tendência: Estável Crescente (+13.5%)</span>
          </div>
        </div>

        {/* Right col: CEBRASPE exclusive index and warning metrics */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between" id="cebraspe-diagnosis-panel">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 animate-fade-in">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-yellow-500 animate-pulse" /> Diagnóstico CEBRASPE
              </h3>
            </div>
            
            <p className="text-xs text-slate-400 mb-4 leading-normal">
              O CEBRASPE penaliza severamente os chutes por meio do formato "Uma Errada Anula uma Certa". Veja seu índice de risco.
            </p>

            <div className="space-y-4" id="index-factors">
              {/* Factor 1 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Líquido de Assertividade</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Seu aproveitamento real líquido de pontos</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-yellow-500 font-mono">{progress.totalQuestionsAnswered > 0 ? (cebraspeStats.netScore) : 0} pts</span>
                  <span className="text-[9px] text-emerald-400 block font-mono">Eficiência: {cebraspeStats.liquidEfficiency}%</span>
                </div>
              </div>

              {/* Factor 2 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Taxa de Risco de Chute</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Porcentagem de questões zeradas por erro</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-red-500 font-mono">{cebraspeStats.riskRatio}%</span>
                  <span className="text-[9px] text-slate-400 block font-mono">Máximo ideal: &lt;20%</span>
                </div>
              </div>

              {/* Factor 3 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Conselho de Penalização</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Estratégia recomendada por aprovados</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase bg-emerald-950/40 p-1.5 rounded">CONSERVADOR</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 font-serif italic text-[11px] text-slate-400 text-center leading-relaxed">
            "Deixar em branco vale 0; errar vale -1. Na dúvida extrema, nunca marque!"
          </div>
        </div>

      </div>

      {/* Accuracy checklist details categorized by discipline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg" id="discipline-matrix-progresso">
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" /> Detalhamento Analítico por Matéria
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs text-slate-400 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-mono uppercase text-[10px]">
                <th className="py-2.5">Matéria</th>
                <th className="py-2.5 text-center">Respondidas</th>
                <th className="py-2.5 text-center">Acertos</th>
                <th className="py-2.5 text-center">Eficiência</th>
                <th className="py-2.5 text-right">Status do Semáforo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {Object.entries(progress.disciplinePerformance).map(([subject, data]) => {
                return (
                  <tr key={subject} className="hover:bg-slate-950/20 transition-colors">
                    <td className="py-3 font-semibold text-white">{subject}</td>
                    <td className="py-3 text-center font-mono text-slate-300">{data.total}</td>
                    <td className="py-3 text-center font-mono text-emerald-400">{data.correct}</td>
                    <td className="py-3 text-center font-mono">
                      <span className={`font-bold ${
                        data.status === 'safe' ? 'text-emerald-400' :
                        data.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {data.efficiency}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase inline-flex items-center gap-1.5 ${
                        data.status === 'safe' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40' :
                        data.status === 'warning' ? 'bg-yellow-950/50 text-yellow-500 border border-yellow-900/10' :
                        'bg-red-950/50 text-red-500 border border-red-900/40 animate-pulse'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          data.status === 'safe' ? 'bg-emerald-500' :
                          data.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        {data.status === 'safe' ? 'Seguro' :
                         data.status === 'warning' ? 'Atenção' : 'Crítico'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
