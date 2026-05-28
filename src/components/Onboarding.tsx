import React, { useState } from 'react';
import { UserOnboarding } from '../types';
import Logo from './Logo';
import { ShieldCheck, Calendar, Clock, BookOpen, User, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: UserOnboarding, generatedSchedule: any) => void;
  theme?: 'dark' | 'light';
}

export default function Onboarding({ onComplete, theme = 'dark' }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const role = 'PRF';
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [testDate, setTestDate] = useState('2026-12-15');
  const [selectedLanguage, setSelectedLanguage] = useState<'Inglês' | 'Espanhol'>('Inglês');
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [hasDoneExam, setHasDoneExam] = useState<boolean>(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  const subjects = [
    'Língua Portuguesa',
    'Raciocínio Lógico-Matemático',
    'Informática',
    'Física',
    'Ética e Cidadania',
    'Geopolítica',
    'Língua Estrangeira',
    'Legislação de Trânsito',
    'Direito Administrativo',
    'Direito Constitucional',
    'Direito Penal',
    'Direito Processual Penal',
    'Legislação Especial',
    'Direitos Humanos'
  ];

  const getLangBtnClass = (lang: 'Inglês' | 'Espanhol') => {
    const isSelected = selectedLanguage === lang;
    if (theme === 'light') {
      return isSelected
        ? 'py-3 px-5 rounded-xl font-bold font-mono text-sm border bg-[#1a365d] border-[#eab308] text-white-force shadow-md transition-all scale-[1.02] ring-2 ring-yellow-400/35 cursor-pointer'
        : 'py-3 px-5 rounded-xl font-semibold font-mono text-sm border bg-[#ffffff] border-slate-200 text-slate-500 hover:border-slate-350 hover:text-slate-700 hover:bg-slate-50 transition-all cursor-pointer';
    } else {
      return isSelected
        ? 'py-3 px-5 rounded-xl font-bold font-mono text-sm border bg-emerald-950/55 border-emerald-500 text-emerald-400 shadow-xl shadow-emerald-900/10 transition-all scale-[1.02] ring-1 ring-emerald-500/30 cursor-pointer'
        : 'py-3 px-5 rounded-xl font-semibold font-mono text-sm border bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 transition-all cursor-pointer';
    }
  };

  const getDifficultyBtnClass = (sub: string) => {
    const isSelected = difficulties.includes(sub);
    if (theme === 'light') {
      return `text-left p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all select-none cursor-pointer ${
        isSelected
          ? 'bg-amber-100 border-amber-600 text-amber-900 font-bold scale-[1.01] shadow-sm'
          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
      }`;
    } else {
      return `text-left p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all select-none cursor-pointer ${
        isSelected
          ? 'bg-yellow-950/30 border-yellow-500 text-yellow-400 font-bold scale-[1.01]'
          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
      }`;
    }
  };

  const getHasDoneExamBtnClass = (value: boolean) => {
    const isSelected = hasDoneExam === value;
    if (theme === 'light') {
      return `p-6 rounded-2xl border text-center font-bold transition-all sm:text-sm text-xs cursor-pointer ${
        isSelected
          ? 'bg-[#1a365d] border-[#eab308] text-white-force shadow-md scale-[1.02] ring-2 ring-yellow-400/35'
          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-350 hover:bg-slate-50'
      }`;
    } else {
      return `p-6 rounded-2xl border text-center font-bold transition-all sm:text-sm text-xs cursor-pointer ${
        isSelected
          ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md scale-[1.02] ring-1 ring-emerald-500/30'
          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
      }`;
    }
  };

  const toggleDifficulty = (sub: string) => {
    if (difficulties.includes(sub)) {
      setDifficulties(difficulties.filter(d => d !== sub));
    } else {
      setDifficulties([...difficulties, sub]);
    }
  };

  const nextStep = () => {
    if (step === 1 && !name.trim()) return;
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoadingSchedule(true);
    const onboardingData: UserOnboarding = {
      name,
      role,
      hoursPerDay,
      testDate,
      difficulties,
      hasDoneExam,
      selectedLanguage
    };

    try {
      const response = await fetch('/api/generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboarding: onboardingData }),
      });
      
      const generatedSchedule = await response.json();
      onComplete(onboardingData, generatedSchedule);
    } catch (error) {
      console.error('Error generating strategy schedule:', error);
      // Fallback
      onComplete(onboardingData, null);
    } finally {
      setLoadingSchedule(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden" id="onboarding-view">
      {/* Visual background details */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-950/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-950/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-xl bg-slate-900 border border-emerald-900/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative" id="onboarding-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <Logo variant="compact" theme={theme} />
          <div className="text-right">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#F59E0B] block">Diagnóstico</span>
            <span className="text-xs font-mono text-slate-400 font-bold block">Fase Inicial</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-1.5 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Athena's Onboarding Advice Corner */}
        {step > 1 && (
          <div className="athena-box-style p-4 mb-6 text-sm flex items-start gap-3">
            <span className="text-xl">🦉</span>
            <div>
              <p className="font-semibold text-athena-title font-mono text-xs uppercase tracking-wider mb-1">Athena orienta:</p>
              <p className="italic text-athena-body">
                {step === 2 && "O cargo de Policial Rodoviário Federal exige domínio absoluto da Legislação de Trânsito, além de Física e do bloco de Direitos."}
                {step === 3 && "Organizar sua carga líquida diária é crucial. Lembre-se de descansar pelo menos um dia para fixar o conhecimento de longo prazo."}
                {step === 4 && "Identificar deficiências nos ajuda a alocar sessões estratégicas extras neste conteúdo para neutralizar a penalização da CEBRASPE."}
                {step === 5 && `Se você já fez provas dessa banca, conhece a pressão de "uma errada anula uma certa". Se é iniciante, vamos de preparação total!`}
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Steps */}
        <div className="min-h-[250px] flex flex-col justify-between">
          <div>
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-white mb-2">Qual o seu nome para o plano?</h2>
                  <p className="text-slate-400 text-sm">Digite seu nome ou apelido para personalizarmos os seus relatórios e tarefas guiados pela IA.</p>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono font-semibold text-slate-400 mb-2">Seu Nome / Apelido</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input 
                      id="input-onboarding-name"
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Carlos Silva" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-white mb-1">Foco Total na PRF</h2>
                  <p className="text-slate-400 text-sm">O aplicativo e o cronograma estão configurados de forma exclusiva para o seu cargo de destino na PRF.</p>
                </div>
                <div className="bg-slate-950 border border-emerald-900/30 rounded-xl p-4 flex gap-4 items-center relative overflow-hidden">
                  <div className="text-3xl">👮‍♂️</div>
                  <div>
                    <div className="font-bold text-base text-white mb-0.5">Policial Rodoviário Federal (PRF)</div>
                    <div className="text-xs text-slate-400">Fiscalização de trânsito técnica (CTB), legislação penal especial e foco técnico nas diretrizes das rodovias federais.</div>
                  </div>
                  <div className="absolute top-2 right-2 bg-emerald-500 w-2.5 h-2.5 rounded-full" />
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800">
                  <label className="block text-xs uppercase tracking-wider font-mono font-semibold text-slate-400 mb-2">Idioma da Prova (Estrangeira)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedLanguage('Inglês')}
                      className={getLangBtnClass('Inglês')}
                    >
                      Inglês
                    </button>
                    <button
                      onClick={() => setSelectedLanguage('Espanhol')}
                      className={getLangBtnClass('Espanhol')}
                    >
                      Espanhol
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white mb-1">Carga Horária & Linha de Chegada</h2>
                  <p className="text-slate-400 text-sm">Quantas horas reais de estudo por dia? E qual a meta de edital?</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium">Tempo de Estudos Diário</span>
                    <span className="font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-md text-sm border border-emerald-900/30 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {hoursPerDay} Horas Líquidas
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 font-mono">
                    <span>1h (Manutenção)</span>
                    <span>4h (Padrão)</span>
                    <span>10h (Imersão Extrema)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-mono font-semibold text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-500" /> Data Prevista para o Edital
                  </label>
                  <input 
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-xs text-slate-500">Normalmente projeta-se o edital para o final de 2026 / início de 2027.</p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <h2 className="text-xl font-bold text-white mb-1">Qual a sua maior dificuldade?</h2>
                  <p className="text-slate-400 text-sm">Selecione as matérias que você considera suas maiores dificuldades. A Athena montará uma imersão nestas disciplinas.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 select-none">
                  {subjects.map((sub) => {
                    const isSelected = difficulties.includes(sub);
                    return (
                      <button
                        key={sub}
                        onClick={() => toggleDifficulty(sub)}
                        className={getDifficultyBtnClass(sub)}
                      >
                        <span>{sub}</span>
                        <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all flex items-center justify-center ${
                          isSelected 
                            ? theme === 'light' 
                              ? 'bg-amber-600 border-amber-600' 
                              : 'bg-yellow-500 border-yellow-500' 
                            : 'border-slate-400 bg-transparent'
                        }`}>
                          {isSelected && <span className="text-[10px] text-white-force font-extrabold">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-white mb-1">Sua Carreira de Concursos</h2>
                  <p className="text-slate-400 text-sm">Você já prestou concursos federais ou policiais do CEBRASPE anteriormente?</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setHasDoneExam(true)}
                    className={getHasDoneExamBtnClass(true)}
                  >
                    <span className="block text-3xl mb-2">👮‍♂️</span>
                    <span className="font-bold">Sim, já prestei</span>
                  </button>
                  <button
                    onClick={() => setHasDoneExam(false)}
                    className={getHasDoneExamBtnClass(false)}
                  >
                    <span className="block text-3xl mb-2">📚</span>
                    <span className="font-bold">Não, sou novato</span>
                  </button>
                </div>

                <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-xl text-center text-xs text-slate-400 mt-4">
                  Ao pressionar finalizar, a Athena calibrará seu nível de probabilidade inicial de aprovação e desenhará um cronograma inteligente adaptativo semanal.
                </div>
              </div>
            )}
          </div>

          {/* Controls Footer */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-800">
            {step > 1 ? (
              <button 
                onClick={prevStep}
                disabled={loadingSchedule}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white font-mono hover:bg-slate-800/40 rounded-lg transition-colors border border-transparent hover:border-slate-800"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button 
                onClick={nextStep}
                disabled={step === 1 && !name.trim()}
                className={`flex items-center gap-2 px-5 py-2.5 bg-emerald-600 rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/40 transition-all ${
                  step === 1 && !name.trim() 
                    ? 'opacity-40 cursor-not-allowed' 
                    : 'hover:bg-emerald-500 hover:scale-[1.02] text-white'
                }`}
              >
                Avançar <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={loadingSchedule}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-xl shadow-amber-950/50 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {loadingSchedule ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Athena está calculando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Ativar Mentoria Athena!
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
