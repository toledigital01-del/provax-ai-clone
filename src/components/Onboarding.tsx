import React, { useState } from 'react';
import { UserOnboarding } from '../types';
import Logo from './Logo';
import { Calendar, Clock, User, ArrowRight, ArrowLeft, Loader2, Sparkles, Check, RefreshCw } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: UserOnboarding, generatedSchedule: any) => void;
  theme?: 'dark' | 'light';
}

const TOTAL_STEPS = 5;

const SUBJECTS = [
  'Língua Portuguesa', 'Raciocínio Lógico-Matemático', 'Informática', 'Física',
  'Ética e Cidadania', 'Geopolítica', 'Língua Estrangeira', 'Legislação de Trânsito',
  'Direito Administrativo', 'Direito Constitucional', 'Direito Penal',
  'Direito Processual Penal', 'Legislação Especial', 'Direitos Humanos',
];

const ATHENA_TIPS: Record<number, string> = {
  2: 'O cargo de Policial Rodoviário Federal exige domínio absoluto da Legislação de Trânsito, além de Física e do bloco de Direitos.',
  3: 'Organizar sua carga líquida diária é crucial. Lembre-se de descansar pelo menos um dia para fixar o conhecimento de longo prazo.',
  4: 'Identificar deficiências nos ajuda a alocar sessões estratégicas extras para neutralizar a penalização da CEBRASPE.',
  5: 'Se você já fez provas dessa banca, conhece a pressão de "uma errada anula uma certa". Se é iniciante, vamos de preparação total!',
};

export default function Onboarding({ onComplete, theme = 'dark' }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [testDate, setTestDate] = useState('2026-12-15');
  const [selectedLanguage, setSelectedLanguage] = useState<'Inglês' | 'Espanhol'>('Inglês');
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [hasDoneExam, setHasDoneExam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState(false);

  const toggle = (sub: string) =>
    setDifficulties(prev => prev.includes(sub) ? prev.filter(d => d !== sub) : [...prev, sub]);

  const next = () => { if (step === 1 && !name.trim()) return; setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setScheduleError(false);
    const data: UserOnboarding = { name, role: 'PRF', hoursPerDay, testDate, difficulties, hasDoneExam, selectedLanguage };
    try {
      const res = await fetch('/api/generate-schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ onboarding: data }) });
      onComplete(data, await res.json());
    } catch {
      setScheduleError(true);
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-[#080b14] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative">

        {/* Card */}
        <div className="bg-[#0d1117] border border-white/[0.08] rounded-2xl p-7 shadow-2xl shadow-black/60">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Logo variant="compact" theme="dark" />
            <span className="text-xs text-slate-500 font-mono">
              {step}/{TOTAL_STEPS}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-white/[0.06] rounded-full mb-7 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-400"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Athena tip */}
          {step > 1 && ATHENA_TIPS[step] && (
            <div className="flex items-start gap-3 bg-indigo-950/30 border border-indigo-500/15 rounded-xl p-3.5 mb-5">
              <span className="text-base shrink-0">🦉</span>
              <p className="text-xs text-slate-300 leading-relaxed italic">{ATHENA_TIPS[step]}</p>
            </div>
          )}

          {/* Steps */}
          <div className="min-h-[260px] flex flex-col">

            {/* Step 1: Nome */}
            {step === 1 && (
              <div className="space-y-5 flex-1">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Qual é o seu nome?</h2>
                  <p className="text-sm text-slate-400 mt-1">Vamos personalizar sua experiência de estudos.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nome / Apelido</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Ex: Carlos Silva"
                      onKeyDown={e => e.key === 'Enter' && name.trim() && next()}
                      className="w-full bg-[#131a27] border border-white/[0.08] focus:border-indigo-500/60 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Cargo + Idioma */}
            {step === 2 && (
              <div className="space-y-5 flex-1">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Foco Total na PRF</h2>
                  <p className="text-sm text-slate-400 mt-1">Tudo configurado exclusivamente para o cargo de Policial Rodoviário Federal.</p>
                </div>
                <div className="flex items-center gap-4 bg-[#131a27] border border-indigo-500/20 rounded-2xl p-4">
                  <span className="text-3xl">👮‍♂️</span>
                  <div>
                    <p className="text-sm font-black text-white">Policial Rodoviário Federal</p>
                    <p className="text-xs text-slate-400 mt-0.5">CTB · Legislação Penal · Física · Direito Administrativo</p>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Língua Estrangeira da Prova</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['Inglês', 'Espanhol'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`py-2.5 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                          selectedLanguage === lang
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                            : 'bg-[#131a27] border-white/[0.08] text-slate-400 hover:border-white/[0.15]'
                        }`}
                      >{lang}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Horas + Data */}
            {step === 3 && (
              <div className="space-y-5 flex-1">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Carga Horária & Meta</h2>
                  <p className="text-sm text-slate-400 mt-1">Quantas horas por dia e quando é a prova?</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-white">Horas de estudo por dia</span>
                    <span className="font-mono font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg text-sm">
                      {hoursPerDay}h
                    </span>
                  </div>
                  <input
                    type="range" min="1" max="10" step="1" value={hoursPerDay}
                    onChange={e => setHoursPerDay(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                    <span>1h mínimo</span><span>4h ideal</span><span>10h máximo</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Data Prevista do Edital
                  </label>
                  <input
                    type="date" value={testDate} onChange={e => setTestDate(e.target.value)}
                    className="w-full bg-[#131a27] border border-white/[0.08] focus:border-indigo-500/60 rounded-xl px-4 py-3 text-white outline-none transition-all text-sm"
                  />
                  <p className="text-[10px] text-slate-600 mt-1.5">Previsão: final de 2026 / início de 2027.</p>
                </div>
              </div>
            )}

            {/* Step 4: Dificuldades */}
            {step === 4 && (
              <div className="space-y-4 flex-1">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Maiores dificuldades?</h2>
                  <p className="text-sm text-slate-400 mt-1">Athena vai priorizar essas matérias no seu cronograma.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {SUBJECTS.map(sub => {
                    const sel = difficulties.includes(sub);
                    return (
                      <button
                        key={sub}
                        onClick={() => toggle(sub)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                          sel
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-[#131a27] border-white/[0.06] text-slate-400 hover:border-white/[0.12]'
                        }`}
                      >
                        <span>{sub}</span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 transition-all ${
                          sel ? 'bg-amber-500 border-amber-500' : 'border-slate-600'
                        }`}>
                          {sel && <Check className="w-2.5 h-2.5 text-slate-950" strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: Experiência */}
            {step === 5 && (
              <div className="space-y-5 flex-1">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Sua Carreira</h2>
                  <p className="text-sm text-slate-400 mt-1">Já prestou concursos do CEBRASPE anteriormente?</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: true,  icon: '👮‍♂️', label: 'Sim, já prestei',  sub: 'Sei a dinâmica da banca' },
                    { val: false, icon: '📚',  label: 'Não, sou novato',  sub: 'Quero aprender do zero' },
                  ].map(o => (
                    <button
                      key={String(o.val)}
                      onClick={() => setHasDoneExam(o.val)}
                      className={`p-5 rounded-2xl border text-center transition-all cursor-pointer ${
                        hasDoneExam === o.val
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                          : 'bg-[#131a27] border-white/[0.06] text-slate-400 hover:border-white/[0.12]'
                      }`}
                    >
                      <span className="text-3xl block mb-2">{o.icon}</span>
                      <p className="font-bold text-sm">{o.label}</p>
                      <p className={`text-[10px] mt-1 ${hasDoneExam === o.val ? 'text-slate-300' : 'text-slate-600'}`}>{o.sub}</p>
                    </button>
                  ))}
                </div>
                <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-xl p-3.5 text-center">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ao finalizar, a Athena calibrará sua probabilidade inicial de aprovação e criará seu cronograma adaptativo semanal.
                  </p>
                </div>
              </div>
            )}

            {/* Erro de geração de cronograma */}
            {scheduleError && (
              <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3.5 mt-4">
                <p className="text-xs text-red-400 leading-relaxed text-center mb-2">
                  Não consegui gerar seu cronograma. Verifique sua conexão e tente novamente.
                </p>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors mx-auto"
                >
                  <RefreshCw className="w-3 h-3" /> Tentar novamente
                </button>
              </div>
            )}

            {/* Navegação */}
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.06]">
              {step > 1 ? (
                <button
                  onClick={back} disabled={loading}
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
              ) : <div />}

              {step < TOTAL_STEPS ? (
                <button
                  onClick={next}
                  disabled={step === 1 && !name.trim()}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    step === 1 && !name.trim()
                      ? 'bg-white/[0.04] text-slate-600 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02]'
                  }`}
                >
                  Avançar <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit} disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-sm transition-all hover:scale-[1.02] disabled:opacity-60 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Athena calculando...</>
                    : <><Sparkles className="w-4 h-4" /> Ativar Mentoria Athena!</>
                  }
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
