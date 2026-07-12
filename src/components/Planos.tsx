import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { ShieldCheck, Sparkles, Gift, Loader2 } from 'lucide-react';

interface PlanosProps {
  currentPlanId: 'free' | 'essencial' | 'premium';
  onPlanUpgraded: (planId: 'free' | 'essencial' | 'premium') => void;
  theme?: 'dark' | 'light';
  userId?: string;
  userEmail?: string;
}

export default function Planos({ currentPlanId, onPlanUpgraded, theme = 'dark', userId, userEmail }: PlanosProps) {
  const d = theme === 'dark';
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async (plan: any) => {
    setError(null);

    if (plan.price === 0) {
      onPlanUpgraded(plan.id);
      return;
    }

    if (!userId || !userEmail) {
      setError('Você precisa estar logado para assinar um plano.');
      return;
    }

    setLoadingPlanId(plan.id);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, userId, userEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || 'Falha ao iniciar checkout.');
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err?.message || 'Erro inesperado ao processar pagamento.');
      setLoadingPlanId(null);
    }
  };

  // Tokens de tema
  const txt  = d ? 'text-white'     : 'text-slate-900';
  const bdr  = d ? 'border-white/[0.06]' : 'border-slate-200';
  const cardBg = d ? 'bg-[#0d1117]' : 'bg-white';

  const planMeta: Record<string, { badge?: string; highlight: boolean; accentClass: string; btnClass: string }> = {
    free:      { highlight: false, accentClass: d ? 'border-white/[0.06]' : 'border-slate-200', btnClass: d ? 'border border-white/[0.1] hover:bg-white/[0.04] text-slate-300' : 'border border-slate-200 hover:bg-slate-50 text-slate-600' },
    essencial: { highlight: false, accentClass: 'border-indigo-500/30', btnClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' },
    premium:   { badge: 'Mais Popular 🏆', highlight: true, accentClass: 'border-amber-500/60', btnClass: 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg shadow-amber-500/25' },
  };

  return (
    <div className={`min-h-full prf-theme ${d ? '' : 'light-theme'} ${d ? 'bg-[#080b14]' : 'bg-slate-50'} font-sans`}>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest">Premium Accelerator</span>
          </div>
          <h1 className={`text-3xl font-black tracking-tight ${txt}`}>
            Acelere sua rota até a nomeação
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Desbloqueie simulados adaptativos, mentoria ilimitada da Athena e diagnóstico preditivo de nota de corte.
          </p>
        </div>

        {/* Trial banner */}
        {currentPlanId === 'free' && (
          <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-950/40 to-indigo-950/40 border border-emerald-500/20 rounded-2xl p-4 max-w-2xl mx-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-bold ${txt}`}>7 Dias de Teste Grátis</p>
              <p className="text-xs text-slate-400 mt-0.5">Experimente sem compromisso. Cancele com um clique se não desejar continuar.</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg whitespace-nowrap">
              Sem cartão
            </span>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 text-center">
            {error}
          </div>
        )}

        {/* Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {SUBSCRIPTION_PLANS.map(plan => {
            const meta = planMeta[plan.id] || planMeta.free;
            const isCurrent = plan.id === currentPlanId;
            const isLoading = loadingPlanId === plan.id;

            const isPremium = meta.highlight;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 ${meta.badge ? 'pt-9 mt-4' : ''} flex flex-col transition-all
                  ${isPremium
                    ? 'bg-gradient-to-b from-[#1a1000] via-[#120d00] to-[#0d1117] shadow-2xl shadow-amber-500/15 scale-[1.02]'
                    : cardBg}
                  ${meta.accentClass}`}
              >
                {isPremium && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-t-2xl" />
                )}

                {meta.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-[9px] font-mono font-black px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-lg shadow-amber-500/30 flex items-center gap-1">
                    🏆 {meta.badge}
                  </div>
                )}

                <div className="space-y-4 flex-1">
                  <div className={`pb-4 border-b ${isPremium ? 'border-amber-500/20' : bdr}`}>
                    <h3 className={`text-base font-black ${isPremium ? 'text-amber-400' : txt}`}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className={`text-sm font-mono ${isPremium ? 'text-amber-500/70' : 'text-slate-500'}`}>R$</span>
                      <span className={`text-4xl font-black font-mono tracking-tight ${isPremium ? 'text-white' : txt}`}>
                        {plan.price.toFixed(2).split('.')[0]}
                      </span>
                      <span className={`text-xs ${isPremium ? 'text-amber-500/70' : 'text-slate-500'}`}>
                        ,{plan.price.toFixed(2).split('.')[1]}/mês
                      </span>
                    </div>
                    {plan.isTrial && (
                      <p className="text-[10px] text-emerald-400 font-mono mt-1.5 flex items-center gap-1">
                        <span className="text-emerald-400">✓</span> 7 dias grátis — sem cobrança imediata
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2.5">
                    {plan.features.map((feat, i) => (
                      <li key={i} className={`flex items-start gap-2 text-xs leading-relaxed ${isPremium ? 'text-slate-200' : d ? 'text-slate-300' : 'text-slate-600'}`}>
                        <span className={`mt-0.5 shrink-0 font-bold ${isPremium ? 'text-amber-400' : 'text-emerald-400'}`}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`mt-6 pt-5 border-t ${isPremium ? 'border-amber-500/15' : bdr}`}>
                  {isCurrent ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Plano Ativo
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBuy(plan)}
                      disabled={isLoading}
                      className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${meta.btnClass}`}
                    >
                      {isLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Redirecionando...</>
                      ) : (
                        plan.price === 0 ? 'Começar Grátis' : 'Assinar Agora'
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-slate-600 font-mono">
          🔒 SSL · Processamento Stripe · Cancelamento autônomo a qualquer momento
        </p>
      </div>
    </div>
  );
}
