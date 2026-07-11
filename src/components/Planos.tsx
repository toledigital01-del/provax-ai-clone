import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { CreditCard, ShieldCheck, Sparkles, AlertCircle, CheckCircle, X, Loader2, Gift, Zap } from 'lucide-react';

interface PlanosProps {
  currentPlanId: 'free' | 'essencial' | 'premium';
  onPlanUpgraded: (planId: 'free' | 'essencial' | 'premium') => void;
  theme?: 'dark' | 'light';
}

export default function Planos({ currentPlanId, onPlanUpgraded, theme = 'dark' }: PlanosProps) {
  const d = theme === 'dark';
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBuy = (plan: any) => {
    setSelectedPlan(plan);
    setShowModal(true);
    setSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onPlanUpgraded(selectedPlan.id);
        setShowModal(false);
        setSelectedPlan(null);
      }, 1500);
    }, 2000);
  };

  // Tokens de tema
  const txt  = d ? 'text-white'     : 'text-slate-900';
  const mut  = d ? 'text-slate-400' : 'text-slate-500';
  const fnt  = d ? 'text-slate-500' : 'text-slate-400';
  const bdr  = d ? 'border-white/[0.06]' : 'border-slate-200';
  const cardBg = d ? 'bg-[#0d1117]' : 'bg-white';
  const modalBg = d ? 'bg-[#0d1117] border border-white/[0.08]' : 'bg-white border border-slate-200 shadow-xl';
  const inp  = d
    ? 'bg-[#131a27] border border-white/[0.08] focus:border-indigo-500/60 text-white placeholder-slate-600'
    : 'bg-slate-50 border border-slate-200 focus:border-indigo-400 text-slate-900 placeholder-slate-400';

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

        {/* Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {SUBSCRIPTION_PLANS.map(plan => {
            const meta = planMeta[plan.id] || planMeta.free;
            const isCurrent = plan.id === currentPlanId;

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

                {/* Barra superior dourada no premium */}
                {isPremium && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-t-2xl" />
                )}

                {meta.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-[9px] font-mono font-black px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-lg shadow-amber-500/30 flex items-center gap-1">
                    🏆 {meta.badge}
                  </div>
                )}

                <div className="space-y-4 flex-1">
                  {/* Nome e preço */}
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

                  {/* Features */}
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, i) => (
                      <li key={i} className={`flex items-start gap-2 text-xs leading-relaxed ${isPremium ? 'text-slate-200' : d ? 'text-slate-300' : 'text-slate-600'}`}>
                        <span className={`mt-0.5 shrink-0 font-bold ${isPremium ? 'text-amber-400' : 'text-emerald-400'}`}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className={`mt-6 pt-5 border-t ${isPremium ? 'border-amber-500/15' : bdr}`}>
                  {isCurrent ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Plano Ativo
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBuy(plan)}
                      className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${meta.btnClass}`}
                    >
                      {plan.price === 0 ? 'Começar Grátis' : 'Assinar Agora'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé de segurança */}
        <p className="text-center text-[11px] text-slate-600 font-mono">
          🔒 SSL · Processamento Stripe · Cancelamento autônomo a qualquer momento
        </p>

      </div>

      {/* Modal de Pagamento */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${modalBg} max-w-md w-full rounded-2xl p-6 shadow-2xl shadow-black/40`}>

            {/* Header modal */}
            <div className={`flex items-center justify-between pb-4 border-b ${bdr} mb-5`}>
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 bg-indigo-600 rounded text-white text-xs font-black">stripe</div>
                <span className="text-xs font-mono font-bold text-slate-400">Checkout Seguro</span>
              </div>
              <button onClick={() => setShowModal(false)} className={`transition-colors cursor-pointer ${d ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h4 className={`text-lg font-black ${txt}`}>Assinatura Ativada!</h4>
                  <p className="text-xs text-emerald-400 font-mono mt-1">Bem-vindo ao ProvaX AI Premium!</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-2">
                  <p className="text-xs text-slate-500">Assinando</p>
                  <h4 className={`text-base font-black mt-0.5 ${txt}`}>
                    {selectedPlan.name} — R$ {selectedPlan.price.toFixed(2)}/mês
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1.5">Número do Cartão</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text" required value={cardNumber}
                        onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        placeholder="4000 1234 5678 9010"
                        className={`w-full rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none transition-all ${inp}`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Validade', value: cardExpiry, set: setCardExpiry, ph: 'MM/AA', max: 5, type: 'text' },
                      { label: 'CVC', value: cardCvc, set: (v: string) => setCardCvc(v.replace(/\D/g,'').slice(0,3)), ph: '123', max: 3, type: 'password' },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1.5">{f.label}</label>
                        <input
                          type={f.type} required value={f.value}
                          onChange={e => f.set(e.target.value.slice(0, f.max))}
                          placeholder={f.ph}
                          className={`w-full rounded-xl py-2.5 px-3 text-sm outline-none transition-all ${inp}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1.5">Nome no Cartão</label>
                    <input
                      type="text" required value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      placeholder="TITULAR DO CARTÃO"
                      className={`w-full rounded-xl py-2.5 px-3 text-sm outline-none transition-all uppercase ${inp}`}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/15 rounded-xl p-3">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Ambiente simulado. Não insira dados reais. Use cartões fictícios (ex: 4000 1234 5678 9010).
                  </p>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-indigo-500/20"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processando...</> : <>Pagar R$ {selectedPlan.price.toFixed(2)}</>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
