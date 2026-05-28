import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { CreditCard, ShieldCheck, Sparkles, AlertCircle, CheckCircle, Flame, Gift } from 'lucide-react';

interface PlanosProps {
  currentPlanId: 'free' | 'essencial' | 'premium';
  onPlanUpgraded: (planId: 'free' | 'essencial' | 'premium') => void;
}

export default function Planos({ currentPlanId, onPlanUpgraded }: PlanosProps) {
  const [selectedPlanToBuy, setSelectedPlanToBuy] = useState<any | null>(null);
  const [showStripeModal, setShowStripeModal] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const handleOpenStripeCheckout = (plan: any) => {
    setSelectedPlanToBuy(plan);
    setShowStripeModal(true);
    setPaymentSuccess(false);
  };

  const handleStripePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentLoading(true);

    // Simulate safe webhook routing
    setTimeout(() => {
      setPaymentLoading(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        onPlanUpgraded(selectedPlanToBuy.id);
        setShowStripeModal(false);
        setSelectedPlanToBuy(null);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="space-y-6" id="planos-tab-view">
      
      {/* Page Title */}
      <div className="text-center space-y-2 select-none">
        <span className="text-xs text-yellow-500 font-mono tracking-widest font-bold uppercase">PREMIUM ACCELERATOR</span>
        <h2 className="text-3xl font-black text-white">Adquira seu Painel de Especialista</h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Turbine suas chances de aprovação liberando nosso simulador adaptativo por IA e mentoria ilimitada Athena.
        </p>
      </div>

      {/* Trial Countdown Highlight */}
      {currentPlanId === 'free' && (
        <div className="bg-gradient-to-r from-emerald-950/40 to-yellow-950/20 border border-yellow-700/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎁</span>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">7 Dias de Teste Grátis no Plano Premium AI</h4>
              <p className="text-[11px] text-slate-400 font-sans">Experimente sem compromisso. Cancele com um clique se não desejar continuar.</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2.5 py-1 rounded">PRONTIDÃO</span>
        </div>
      )}

      {/* Plans pricing grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto" id="plans-pricing-display">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isGold = plan.id === 'premium';

          return (
            <div 
              key={plan.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all relative ${
                isGold 
                  ? 'bg-gradient-to-b from-slate-900 to-emerald-950/25 border-yellow-500 shadow-xl shadow-emerald-950/30 scale-[1.02]' 
                  : 'bg-slate-950 border-slate-850 shadow'
              }`}
            >
              {isGold && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-950 font-black font-mono text-[9px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  A Mais Ofertada 🛡️
                </span>
              )}

              <div className="space-y-4">
                {/* Title and price */}
                <div className="space-y-1.5 border-b border-slate-900 pb-4">
                  <h3 className="font-extrabold text-lg text-white font-mono">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-color-slate-350 text-slate-350">R$</span>
                    <span className="text-4xl font-extrabold text-white font-mono tracking-tight">{plan.price.toFixed(2).split('.')[0]}</span>
                    <span className="text-xs font-semibold text-slate-400">,{plan.price.toFixed(2).split('.')[1]}/mês</span>
                  </div>
                </div>

                {/* Features checklist */}
                <ul className="space-y-2.5 pt-2 select-text">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="text-xs text-slate-200 flex items-start gap-2 leading-relaxed">
                      <span className={`text-sm shrink-0 ${isGold ? 'text-yellow-500' : 'text-emerald-400'}`}>✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Purchase CTA buttons */}
              <div className="pt-6 border-t border-slate-900 mt-6">
                {isCurrent ? (
                  <div className="btn-plan-active py-2.5 text-xs uppercase tracking-wider font-semibold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Plano Ativo</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenStripeCheckout(plan)}
                    className={`py-2.5 text-xs tracking-wide transition-all ${
                      isGold ? 'btn-plan-cta-premium' : 'btn-plan-cta-standard'
                    }`}
                  >
                    {plan.price === 0 ? 'Iniciar Teste' : 'Assinar via Stripe'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* STRIPE SECURE CREDIT CARD IFRAME OVERLAY MODAL */}
      {showStripeModal && selectedPlanToBuy && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl p-6 shadow-2xl relative animate-scale-up" id="stripe-checkout-modal">
            
            {/* Stripe branded header mock */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4 select-none">
              <div className="flex items-center gap-1.5 font-mono text-xs font-black tracking-widest text-slate-400">
                <span className="bg-indigo-600 text-white px-2 py-0.5 rounded font-black font-sans-serif">stripe</span>
                <b>Checkout Seguro</b>
              </div>
              <button 
                onClick={() => setShowStripeModal(false)}
                className="text-xs text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="text-center py-8 space-y-3" id="stripe-success-pane">
                <div className="bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 p-4 rounded-full w-14 h-14 mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-white text-lg">Assinatura Ativada!</h4>
                <p className="text-xs text-emerald-400 font-mono">Boas-vindas ao ProvaX AI Premium Athena Gold!</p>
              </div>
            ) : (
              <form onSubmit={handleStripePaymentSubmit} className="space-y-4" id="stripe-credit-card-form">
                
                <div className="text-center pb-2">
                  <p className="text-xs text-slate-400">Adquirindo</p>
                  <h4 className="font-bold text-white text-base">{selectedPlanToBuy.name} — R$ {selectedPlanToBuy.price.toFixed(2)}/mês</h4>
                </div>

                {/* Card input field */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase text-slate-400 font-semibold">Número do Cartão</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Expiries and CVC details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase text-slate-400 font-semibold">Validade</label>
                    <input 
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                      placeholder="MM/AA"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase text-slate-400 font-semibold">CVC / Código</label>
                    <input 
                      type="password"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="123"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase text-slate-400 font-semibold">Nome no Cartão</label>
                  <input 
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="TITULAR DO CARTÃO"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500 uppercase"
                  />
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-[10px] text-slate-400 leading-normal flex items-start gap-1.5 select-none">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Este é um ambiente simulado para demonstração do ecossistema Lovable + Stripe. Não insira dados de cartões reais. Use cartões fictícios (ex: 4000 1234...).</span>
                </div>

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-505 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/10"
                >
                  {paymentLoading ? (
                    <>Processando Transação...</>
                  ) : (
                    <>Pagar R$ {selectedPlanToBuy.price.toFixed(2)}</>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
