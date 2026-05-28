import React, { useState } from 'react';
import { Compass, BookOpen, Clock, AlertTriangle, ShieldCheck, CheckCircle2, Award, Sparkles, ChevronRight, Play, Info, Check, X } from 'lucide-react';
import { playSuccessSound, playClickSound, playCorrectSound } from '../utils/audioEffects';

interface Resolution {
  id: string;
  num: string;
  title: string;
  relevance: 'Máxima' | 'Alta' | 'Média';
  status: 'Dominado' | 'Em Revisão' | 'Não Iniciado';
  progress: number;
  tacticalSummary: string;
  baitClauses: string[];
  testQuestion: {
    statement: string;
    answer: 'C' | 'E';
    explanation: string;
  };
}

export default function RadarContran() {
  const [selectedResId, setSelectedResId] = useState<string>('res-432');
  const [activeTab, setActiveTab] = useState<'summary' | 'questions'>('summary');
  const [answered, setAnswered] = useState<boolean>(false);
  const [userChoice, setUserChoice] = useState<'C' | 'E' | null>(null);
  const [radarPulseCount, setRadarPulseCount] = useState<number>(1);

  // High interest CONTRAN resolutions for PRF
  const [resolutions, setResolutions] = useState<Resolution[]>([
    {
      id: 'res-432',
      num: 'Resolução 432',
      title: 'Fiscalização de Álcool e Substâncias Psicoativas (Lei Seca)',
      relevance: 'Máxima',
      status: 'Dominado',
      progress: 92,
      tacticalSummary: 'Regulamenta minuciosamente os procedimentos de uso do bafômetro (etilômetro) e testes clínicos. Define crime de trânsito (Art. 306 do CTB) e infração administrativa (Art. 165 do CTB). Recomenda folga de cálculo para margens de erro previstas na tabela técnica.',
      baitClauses: [
        'A recusa do condutor ao bafômetro configura infração autônoma gravíssima, independentemente de sinais de embriaguez.',
        'O crime ocorre com concentração igual ou superior a 0,34 miligramas de álcool por litro de ar alveolar expirado OU acima de 6 decigramas de álcool por litro de sangue.',
        'A margem de erro admitida do equipamento etilômetro é de 0,04 mg/L. Portanto, o valor considerado começa em 0,05 mg/L para infração administrativa.'
      ],
      testQuestion: {
        statement: 'De acordo com a Resolução 432 do CONTRAN, para fins de caracterização do crime de trânsito capitulado no Art. 306 do CTB por meio de exame etilômetro, a concentração de álcool deve ser igual ou superior a 0,30 mg/L de ar alveolar expirado, já descontada a margem de erro aplicada.',
        answer: 'E',
        explanation: 'FALSO! O valor medido no aparelho para configurar crime deve ser de 0,34 mg/L. O valor legal previsto é de 0,30 mg/L, mas após descontar a margem de erro regulamentada pela tabela técnica, o visor do etilômetro precisa atingir ou superar 0,34 mg/L.'
      }
    },
    {
      id: 'res-960',
      num: 'Resolução 960',
      title: 'Requisitos de Segurança de Vidros, Vidros Blindados e Películas',
      relevance: 'Máxima',
      status: 'Em Revisão',
      progress: 68,
      tacticalSummary: 'Regula a transmitância luminosa de para-brisas e películas (Insulfilm). Atualizou regras simplificando a fiscalização, tornando proibido bolhas no para-brisa frontal e determinando limites unificados para visibilidade.',
      baitClauses: [
        'A transmitância luminosa mínima do para-brisa incolor e dos vidros indispensáveis à dirigibilidade não pode ser inferior a 70% (regra unificada recentemente).',
        'Vidros que não interferem na visibilidade indispensável (traseiro e laterais traseiras) têm limite mínimo de transmitância reduzido para 28%.',
        'É expressamente proibido o uso de películas refletivas (espelhadas) em qualquer vidro do veículo, sob pena de infração grave e retenção do veículo.'
      ],
      testQuestion: {
        statement: 'As películas refletivas que possibilitem visibilidade interna superior a 28% nos vidros laterais traseiros são autorizadas para circulação em rodovias federais pela nova regulamentação do CONTRAN.',
        answer: 'E',
        explanation: 'FALSO! Películas refletivas (espelhadas) são totalmente proibidas pelo CONTRAN em qualquer área envidraçada do veículo, independente do percentual de transmitância ou visibilidade.'
      }
    },
    {
      id: 'res-789',
      num: 'Resolução 789',
      title: 'Formação de Condutores, Exames e Credenciamentos de CFC',
      relevance: 'Alta',
      status: 'Em Revisão',
      progress: 74,
      tacticalSummary: 'Regulamenta o processo de habilitação de condutores (LADV, exames teóricos e práticos), carga horária de aulas obrigatórias e validade de exames médicos.',
      baitClauses: [
        'A LADV (Licença de Aprendizagem de Direção Veicular) será suspensa pelo prazo de 6 meses caso o candidato seja pego dirigindo desacompanhado de instrutor credenciado.',
        'O candidato aprovado recebe inicialmente a PPD (Permissão para Dirigir) válida por 1 ano, cuja substituição pela CNH definitiva só é homologada se não cometer infração grave, gravíssima ou reincidir em infrações médias.'
      ],
      testQuestion: {
        statement: 'Se o candidato à obtenção da CNH for flagrado conduzindo veículo de aprendizagem sem a companhia de instrutor autorizado, sua LADV será cassada definitivamente de forma sumária.',
        answer: 'E',
        explanation: 'FALSO! Pelo Artigo 26 da Resolução 789, caso flagrado sem instrutor, a LADV sofrerá suspensão pelo período de 6 (seis) meses, e não cassação definitiva.'
      }
    },
    {
      id: 'res-989',
      num: 'Resolução 798 / 989',
      title: 'Critérios Técnicos para Medidores de Velocidade (Radares)',
      relevance: 'Máxima',
      status: 'Não Iniciado',
      progress: 15,
      tacticalSummary: 'Aprova novos critérios de fiscalização de radares fixos e portáteis. Exige divulgação pública das localizações e proíbe instalação em aclives ou locais ocultos.',
      baitClauses: [
        'Radares do tipo portátil só podem operar em trechos de rodovias onde a velocidade máxima permita manobra segura de interdição.',
        'É obrigatória a existência de placas de sinalização vertical de regulamentação de velocidade de 1.000m a 2.000m antes do ponto de medição em vias rápidas.'
      ],
      testQuestion: {
        statement: 'A legislação do CONTRAN proíbe expressamente a instalação ou operação de radares de velocidade ocultos ou escondidos sob copas de árvores ou barreiras físicas nas rodovias federais.',
        answer: 'C',
        explanation: 'CORRETO! A Resolução exige visibilidade total dos radares (inclusive portáteis) para garantir o caráter educativo e de fiscalização transparente nas rodovias, coibindo pegadinhas.'
      }
    },
    {
      id: 'res-955',
      num: 'Resolução 955',
      title: 'Transporte de Cargas e Bicicletas em Veículos de Passageiros',
      relevance: 'Média',
      status: 'Dominado',
      progress: 100,
      tacticalSummary: 'Regulamenta o transporte de bagagens, bicicletas e cargas excedentes sobre o teto ou presas à traseira do veículo, observando os limites de sinalização noturna e balanço traseiro.',
      baitClauses: [
        'A carga não pode obstruir as luzes traseiras de sinalização e frenagem, tampouco ocultar a placa de identificação.',
        'O limite máximo de balanço traseiro para cargas não pode exceder 60% da distância entre os dois eixos do automóvel.'
      ],
      testQuestion: {
        statement: 'Ao transportar uma bicicleta presa à traseira de um automóvel, caso as luzes de freio fiquem parcialmente cobertas, é obrigatório ligar o pisca-alerta do veículo durante todo o trajeto em rodovias federais.',
        answer: 'E',
        explanation: 'FALSO! Na verdade, caso a carga oculte as luzes traseiras ou a placa, é obrigatório instalar uma régua de sinalização extra de lanternas e uma segunda placa de identificação lacrada.'
      }
    }
  ]);

  const activeRes = resolutions.find(r => r.id === selectedResId) || resolutions[0];

  const handleSelectRes = (id: string) => {
    playClickSound();
    setSelectedResId(id);
    setAnswered(false);
    setUserChoice(null);
  };

  const handleAnswerQuestion = (choice: 'C' | 'E') => {
    if (answered) return;
    setUserChoice(choice);
    setAnswered(true);

    if (choice === activeRes.testQuestion.answer) {
      playCorrectSound();
      // Increase corresponding Resolution's progress
      setResolutions(prev => prev.map(res => {
        if (res.id === activeRes.id) {
          const updatedProgress = Math.min(100, res.progress + 15);
          return {
            ...res,
            progress: updatedProgress,
            status: updatedProgress === 100 ? 'Dominado' : 'Em Revisão'
          };
        }
        return res;
      }));
    } else {
      playClickSound();
    }
  };

  const triggerRadarPulse = () => {
    playClickSound();
    setRadarPulseCount(prev => prev + 1);
  };

  return (
    <div className="space-y-6" id="radar-contran-container">
      {/* HEADER ROW WITH GLOWING RADAR EFFECTS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs px-2.5 py-1 rounded-full uppercase font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Exclusividade ProvaX AI
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white select-text">
            Radar de Resoluções do <span className="text-blue-400">CONTRAN</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-sans select-text">
            Mapeamos o comportamento histórico das bancas (CEBRASPE) em relação às Resoluções do CONTRAN mais cobradas no edital da PRF. Analise as pegadinhas e treine instantaneamente.
          </p>
        </div>

        {/* RADAR INTERACTIVE GLOWING VISUALIZER */}
        <div className="relative w-36 h-36 border border-blue-500/15 rounded-full flex items-center justify-center bg-slate-950/80 shrink-0 shadow-lg cursor-pointer" onClick={triggerRadarPulse}>
          {/* Radial grids */}
          <div className="absolute w-28 h-28 border border-blue-500/10 rounded-full" />
          <div className="absolute w-16 h-16 border border-blue-500/10 rounded-full" />
          
          {/* Sweep Line */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-blue-500/10 animate-[spin_4s_linear_infinite]" />
          
          {/* Active target nodes */}
          <div className="absolute top-7 left-10 w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping" />
          <div className="absolute top-7 left-10 w-2 h-2 bg-blue-400 rounded-full" />

          <div className="absolute bottom-10 right-8 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <div className="absolute top-16 right-5 w-1.5 h-1.5 bg-yellow-500 rounded-full opacity-60" />

          {/* Crosshair grids */}
          <div className="absolute w-full h-px bg-blue-500/10" />
          <div className="absolute h-full w-px bg-blue-500/10" />

          {/* Core content */}
          <div className="z-10 text-center flex flex-col items-center">
            <span className="text-[9px] font-mono text-slate-500 font-bold tracking-widest leading-none">ATENDIMENTO</span>
            <span className="text-sm font-mono font-black text-blue-400 leading-none mt-1">SCAN-SCAN</span>
            <span className="text-[8px] text-emerald-400 font-bold block mt-1 uppercase tracking-tighter">● SINAL PRF OK</span>
          </div>

          {/* Pulse Ripple Effect */}
          <span key={radarPulseCount} className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-ping opacity-0" style={{ animationDuration: '1.2s' }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="radar-subgrid-layout">
        
        {/* LEFT COLUMN: RESOLUTION SELECTOR PANEL (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3" id="panel-resolutions-list">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">Catálogo de Cobrança PRF</h3>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[460px] pr-1" id="resolutions-list-items">
            {resolutions.map((res) => {
              const isActive = res.id === selectedResId;
              
              // Relevance badge styles
              const relClass = res.relevance === 'Máxima' 
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : res.relevance === 'Alta'
                ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                : 'bg-slate-850 border-slate-800 text-slate-400';

              // Status dot style
              const dotClass = res.status === 'Dominado'
                ? 'bg-emerald-400'
                : res.status === 'Em Revisão'
                ? 'bg-yellow-400 animate-pulse'
                : 'bg-slate-600';

              return (
                <button
                  key={res.id}
                  onClick={() => handleSelectRes(res.id)}
                  className={`w-full text-left p-3.5 border rounded-xl transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden select-none ${
                    isActive 
                      ? 'bg-slate-950 border-blue-500/60 shadow-md translate-x-1.5' 
                      : 'bg-slate-900/40 border-slate-850 text-slate-400 hover:border-slate-800 hover:bg-slate-950/20'
                  }`}
                  id={`btn-contran-tab-${res.id}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-mono font-bold text-xs uppercase ${isActive ? 'text-blue-400' : 'text-slate-300'}`}>
                      {res.num}
                    </span>
                    <span className={`text-[8.5px] font-mono font-bold uppercase border px-1.5 py-0.5 rounded ${relClass}`}>
                      {res.relevance}
                    </span>
                  </div>

                  <p className={`text-xs font-sans line-clamp-1 h-4 leading-normal font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {res.title}
                  </p>

                  <div className="flex items-center justify-between gap-1.5 pt-1 text-[10px] font-mono text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                      <span>{res.status}</span>
                    </div>
                    <span>{res.progress}% absorb.</span>
                  </div>

                  {/* Tiny active slide highlight */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Tactital Details Summary & Mini Trials (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6" id="panel-contran-details">
          
          {/* Active Title bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-blue-500 font-extrabold uppercase bg-blue-500/10 border border-blue-500/15 px-2.5 py-0.5 rounded">
                  Foco Edital PRF • {activeRes.num}
                </span>
                <h2 className="text-lg font-black text-white">{activeRes.title}</h2>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400 bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-lg shrink-0">
                <Clock className="w-4 h-4 text-slate-500" /> Nível de Domínio: <b className="text-white ml-0.5">{activeRes.progress}%</b>
              </div>
            </div>

            {/* TAB SELECTOR SHEET */}
            <div className="flex border-b border-slate-850">
              <button
                onClick={() => { playClickSound(); setActiveTab('summary'); }}
                className={`flex-1 py-2.5 text-center font-bold font-mono text-xs transition-colors flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === 'summary'
                    ? 'border-blue-400 text-blue-400 bg-slate-950/20'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Resumo Estratégico & Pegadinhas
              </button>
              <button
                onClick={() => { playClickSound(); setActiveTab('questions'); }}
                className={`flex-1 py-2.5 text-center font-bold font-mono text-xs transition-colors flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === 'questions'
                    ? 'border-blue-400 text-blue-400 bg-slate-950/20'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <Award className="w-4 h-4" /> Desafio de Fixação (CEBRASPE)
              </button>
            </div>

            {/* PANEL INNER BODY */}
            <div className="pt-3 min-h-[300px]" id="contran-tab-content-render">
              
              {/* SUMMARY VIEWPORT */}
              {activeTab === 'summary' && (
                <div className="space-y-5 animate-fade-in" id="contran-summary-content">
                  <div className="space-y-1.5">
                    <h4 className="text-xs uppercase font-mono text-[#1B4FD8] font-extrabold tracking-wider flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-blue-500" /> Orientação de Estudo da Mentora Athena:
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-300 font-sans select-text">
                      {activeRes.tacticalSummary}
                    </p>
                  </div>

                  {/* PEGADINHAS DE PROVA */}
                  <div className="bg-slate-950 border border-blue-950/30 rounded-xl p-4 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-red-500/5 rotate-45 transform translate-x-4 -translate-y-4 pointer-events-none" />
                    
                    <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" /> Atenção Candidate: Como o CEBRASPE tenta te derrubar
                    </h4>

                    <ul className="space-y-3 pl-1 text-[11px] sm:text-xs">
                      {activeRes.baitClauses.map((clause, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300 font-sans select-text">
                          <span className="inline-flex items-center justify-center w-5 h-5 bg-red-950/40 text-red-400 border border-red-900/40 rounded font-mono text-[9px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-normal">{clause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => { playClickSound(); setActiveTab('questions'); }}
                      className="px-4 py-2 bg-[#1B4FD8] hover:bg-[#1339A8] text-white font-black rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Medir Conhecimento no Desafio
                    </button>
                  </div>
                </div>
              )}

              {/* QUESTIONS VIEWPORT */}
              {activeTab === 'questions' && (
                <div className="space-y-5 animate-fade-in text-left" id="contran-question-content">
                  <div className="bg-slate-950 border border-slate-850 p-4.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pb-2 border-b border-slate-900">
                      <span>Gabarito Inteligente Adaptativo</span>
                      <span className="text-blue-400 font-bold uppercase tracking-wide">CEBRASPE Simulação</span>
                    </div>
                    <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-sans select-text" id="contran-statement-text">
                      {activeRes.testQuestion.statement}
                    </p>
                  </div>

                  {/* Interactive Choices Button Block */}
                  {!answered ? (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleAnswerQuestion('C')}
                        className="py-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 font-extrabold text-xs sm:text-sm text-center transition-all cursor-pointer select-none active:scale-[0.98]"
                      >
                        <span className="block text-base tracking-widest font-mono uppercase mb-0.5">Certo</span>
                        <span className="text-[9px] text-slate-500 font-normal block font-sans">(Assertiva Correta)</span>
                      </button>
                      <button
                        onClick={() => handleAnswerQuestion('E')}
                        className="py-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 font-extrabold text-xs sm:text-sm text-center transition-all cursor-pointer select-none active:scale-[0.98]"
                      >
                        <span className="block text-base tracking-widest font-mono uppercase mb-0.5">Errado</span>
                        <span className="text-[9px] text-slate-500 font-normal block font-sans">(Assertiva Incorreta)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fade-in">
                      {/* Answer Feedback Header */}
                      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                        userChoice === activeRes.testQuestion.answer
                          ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-500 font-extrabold'
                          : 'bg-red-950/25 border-red-500/30 text-red-500'
                      }`}>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                          userChoice === activeRes.testQuestion.answer ? 'bg-emerald-950 text-emerald-500' : 'bg-red-950 text-red-500'
                        }`}>
                          {userChoice === activeRes.testQuestion.answer ? <Check className="w-5 h-5 stroke-[3]" /> : <X className="w-5 h-5 stroke-[3]" />}
                        </span>
                        <div>
                          <h4 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                            {userChoice === activeRes.testQuestion.answer ? 'Muito bem! Você acertou!' : 'Ooops! Pegadinha identificada...'}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 block uppercase pt-0.5">
                            Seu Gabarito: {userChoice === 'C' ? 'Certo' : 'Errado'} • Gabarito Oficial: {activeRes.testQuestion.answer === 'C' ? 'Certo' : 'Errado'}
                          </span>
                        </div>
                      </div>

                      {/* Mentora Athena Justification comment box */}
                      <div className="athena-box-style p-4 rounded-xl border flex gap-3">
                        <span className="text-2xl shrink-0 mt-0.5">🦉</span>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-500 block leading-none">Explicação Estratégica da Mentora:</span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans select-text">
                            {activeRes.testQuestion.explanation}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => { playClickSound(); setAnswered(false); setUserChoice(null); }}
                          className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-mono font-bold transition-colors select-none cursor-pointer"
                        >
                          Tentar Novamente
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
