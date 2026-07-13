import React, { useState, useEffect, useRef } from 'react';
import { Message, UserOnboarding, ProgressData } from '../types';
import { Send, RefreshCw, Loader2, Sparkles } from 'lucide-react';

interface AthenaProps {
  onboarding: UserOnboarding | null;
  progress: ProgressData;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  onClearHistory: () => void;
  theme?: 'dark' | 'light';
}

export default function Athena({ onboarding, progress, messages, onSendMessage, onClearHistory, theme = 'dark' }: AthenaProps) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const d = theme === 'dark';

  const suggestedPrompts = [
    'Me explica o Art. 165-A do CTB',
    'Pegadinhas do Art. 144 da CF',
    'Como cai Português no CEBRASPE?',
    'Fórmulas de Física da colisão',
    'Bizú rápido para o simulado',
    'Diferença entre dolo eventual e culpa consciente',
  ];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    setInputText('');
    setLastFailedText(null);
    setLoading(true);
    try { await onSendMessage(textToSend); }
    catch (e) { console.error(e); setLastFailedText(textToSend); }
    finally { setLoading(false); }
  };

  const initials = onboarding?.name?.slice(0, 1).toUpperCase() || 'R';

  // Tokens de tema
  const bg      = d ? 'bg-[#0d1117]'  : 'bg-white';
  const border  = d ? 'border-white/[0.06]' : 'border-slate-200';
  const hdrBg   = d ? 'bg-[#080b14]/80' : 'bg-slate-50/80';
  const bodyBg  = d ? 'bg-[#080b14]/50' : 'bg-slate-50';
  const footBg  = d ? 'bg-[#080b14]'  : 'bg-white';
  const chipsBg = d ? 'bg-[#080b14]/80' : 'bg-slate-50/80';
  const txt     = d ? 'text-white'     : 'text-slate-900';
  const mut     = d ? 'text-slate-400' : 'text-slate-500';
  const fnt     = d ? 'text-slate-500' : 'text-slate-400';
  const raised  = d ? 'bg-[#131a27]'  : 'bg-slate-100';
  const inp     = d
    ? 'bg-[#131a27] border border-white/[0.08] focus:border-indigo-500/60 text-white placeholder-slate-500'
    : 'bg-slate-100 border border-slate-200 focus:border-indigo-400 text-slate-900 placeholder-slate-400';
  const chipCls = d
    ? 'text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.12]'
    : 'text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300';
  const athenaMsgCls = d
    ? 'bg-[#131a27] border border-white/[0.06] text-slate-200 rounded-tl-sm'
    : 'bg-slate-100 border border-slate-200 text-slate-700 rounded-tl-sm';
  const clearBtnCls = d
    ? 'text-slate-500 hover:text-slate-300 border border-white/[0.06] hover:bg-white/[0.04]'
    : 'text-slate-400 hover:text-slate-700 border border-slate-200 hover:bg-slate-100';
  const statCardCls = d
    ? 'bg-white/[0.03] border border-white/[0.06]'
    : 'bg-white border border-slate-200 shadow-sm';

  return (
    <div className={`flex flex-col h-[calc(100vh-140px)] min-h-[500px] max-h-[800px] ${bg} border ${border} rounded-2xl overflow-hidden shadow-2xl shadow-black/20`}>

      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-4 border-b ${border} ${hdrBg} backdrop-blur-sm shrink-0`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-lg shadow-lg">
              🦉
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#080b14] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-black tracking-tight ${txt}`}>Athena AI</h3>
              <span className="text-[9px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-md uppercase">Elite</span>
            </div>
            <p className={`text-[10px] font-mono mt-0.5 flex items-center gap-1 text-emerald-500`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Online · PRF/CEBRASPE
            </p>
          </div>
        </div>
        <button onClick={onClearHistory} className={`flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all cursor-pointer ${clearBtnCls}`}>
          <RefreshCw className="w-3 h-3" /> Limpar
        </button>
      </div>

      {/* Mensagens */}
      <div ref={scrollRef} className={`flex-1 overflow-y-auto px-4 py-5 space-y-5 ${bodyBg} select-text scroll-smooth`}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 space-y-5 select-none">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-700/20 border border-emerald-500/20 flex items-center justify-center text-4xl">🦉</div>
            <div className="space-y-2 max-w-xs">
              <h4 className={`text-base font-black ${txt}`}>Sua Mentora Estratégica</h4>
              <p className={`text-xs leading-relaxed ${mut}`}>
                Conheço seu edital, seus erros e o peso das matérias da CEBRASPE. Pergunte sobre estratégia, artigos ou dúvidas de prova.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
              {[
                { label: 'Acerto', value: `${Math.round(progress?.overallAccuracyRate ?? 0)}%` },
                { label: 'Questões', value: `${progress?.totalQuestionsAnswered ?? 0}` },
                { label: 'Streak', value: `${progress?.daysConsecutive ?? 0}d` },
              ].map(s => (
                <div key={s.label} className={`${statCardCls} rounded-xl p-2.5 text-center`}>
                  <div className="text-sm font-black text-indigo-500">{s.value}</div>
                  <div className={`text-[9px] font-mono mt-0.5 ${fnt}`}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => {
          const isAthena = msg.sender === 'athena';
          return (
            <div key={msg.id} className={`flex gap-3 ${isAthena ? 'mr-auto max-w-[88%]' : 'ml-auto max-w-[80%] flex-row-reverse'}`}>
              {isAthena ? (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-sm shrink-0 mt-0.5">🦉</div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5">{initials}</div>
              )}
              <div className="space-y-1">
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  isAthena ? athenaMsgCls : 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-sm shadow-lg shadow-indigo-500/20'
                }`}>
                  {msg.content.split('\n').map((line, i) => <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{line}</p>)}
                </div>
                <span className={`text-[9px] font-mono block ${fnt} ${isAthena ? 'text-left' : 'text-right'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-sm shrink-0">🦉</div>
            <div className={`px-4 py-3 ${athenaMsgCls} rounded-2xl flex items-center gap-2`}>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
              <span className={`text-xs font-mono ${mut}`}>Consultando o CTB...</span>
            </div>
          </div>
        )}

        {lastFailedText && !loading && (
          <div className="flex gap-3 mr-auto max-w-[88%]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-sm shrink-0 mt-0.5">🦉</div>
            <div className="space-y-2">
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${athenaMsgCls}`}>
                <p className="text-red-400">Tive um problema de conexão. Tente novamente.</p>
              </div>
              <button
                onClick={() => handleSend(lastFailedText)}
                className={`text-xs font-semibold flex items-center gap-1.5 transition-colors text-indigo-400 hover:text-indigo-300`}
              >
                <RefreshCw className="w-3 h-3" /> Tentar novamente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chips */}
      <div className={`px-4 py-2.5 border-t ${border} ${chipsBg} flex gap-2 overflow-x-auto scrollbar-none shrink-0`}>
        {suggestedPrompts.map(p => (
          <button key={p} onClick={() => handleSend(p)} disabled={loading}
            className={`flex-none text-[10px] font-mono font-medium px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer disabled:opacity-40 ${chipCls}`}>
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className={`px-4 py-3 ${footBg} border-t ${border} shrink-0`}>
        <form onSubmit={e => { e.preventDefault(); handleSend(inputText); }} className="flex gap-2">
          <input
            type="text" value={inputText} onChange={e => setInputText(e.target.value)}
            disabled={loading} placeholder="Pergunte sobre CTB, CF, estratégia CEBRASPE..."
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${inp}`}
          />
          <button type="submit" disabled={!inputText.trim() || loading}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
              inputText.trim() && !loading
                ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-lg hover:scale-[1.05] cursor-pointer'
                : d ? 'bg-white/[0.04] text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
