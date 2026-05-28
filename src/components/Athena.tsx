import React, { useState, useEffect, useRef } from 'react';
import { Message, UserOnboarding, ProgressData } from '../types';
import { Send, Sparkles, Shield, RefreshCw, MessageSquare, Flame, Award, Loader2 } from 'lucide-react';

interface AthenaProps {
  onboarding: UserOnboarding | null;
  progress: ProgressData;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  onClearHistory: () => void;
}

export default function Athena({ onboarding, progress, messages, onSendMessage, onClearHistory }: AthenaProps) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Suggested prompt chips matching PRF exam context
  const suggestedPrompts = [
    'Me explica o Artigo 165-A do CTB e recusa?',
    'Quais as pegadinhas do Artigo 144 da CF?',
    'Como caem as reescritas de Português no CEBRASPE?',
    'Como lidar com as fórmulas de Física da colisão?',
    'Me passe um bizú rápido para o simulado'
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    setInputText('');
    setLoading(true);
    try {
      await onSendMessage(textToSend);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[580px]" id="athena-chat-panel">
      
      {/* Chat header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-950/50 rounded-xl border border-emerald-500/20 text-emerald-400 text-lg relative">
            🦉
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950 shadow animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-white text-sm">Athena AI</h3>
              <span className="text-[9px] font-mono font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded uppercase">Mentora de Elite</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Status: Patrulhando seu edital</p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="text-xs text-slate-500 hover:text-slate-300 font-mono flex items-center gap-1 transition-colors border border-slate-850 px-2 py-1 rounded hover:bg-slate-950"
        >
          <RefreshCw className="w-3 h-3" />
          Limpar Histórico
        </button>
      </div>

      {/* Chat body containing messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40 select-text" id="chat-messages-scroll" ref={scrollRef}>
        
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-sm mx-auto select-none" id="chat-empty-state">
            <span className="text-4xl">🦉</span>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">Central da Mentora Athena</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Eu conheço seu edital, seus erros recentes de trânsito e o peso das matérias da CEBRASPE. Faça qualquer pergunta de estudo ou estratégia!
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isAthena = msg.sender === 'athena';
          return (
            <div 
              key={msg.id} 
              className={`flex gap-3 max-w-[85%] ${isAthena ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {isAthena ? (
                <span className="text-xl shrink-0 mt-0.5">🦉</span>
              ) : (
                <span className="p-1 w-7 h-7 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                  {onboarding?.name?.slice(0, 2).toUpperCase() || 'RE'}
                </span>
              )}

              <div className="space-y-1">
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-sans leading-relaxed ${
                  isAthena 
                    ? 'bg-slate-950 border border-slate-850 text-slate-200 rounded-tl-none font-medium' 
                    : 'bg-emerald-600 text-white rounded-tr-none font-bold'
                }`}>
                  {/* Simplistic formatting: split lines by bullet points */}
                  {msg.content.split('\n').map((line, lIdx) => (
                    <p key={lIdx} className="mb-1.5 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>
                <span className={`text-[9px] font-mono text-slate-500 block ${isAthena ? 'text-left' : 'text-right'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <span className="text-xl animate-bounce">🦉</span>
            <div className="bg-slate-950 border border-slate-850 text-slate-400 p-3.5 rounded-2xl rounded-tl-none text-xs flex items-center gap-2 font-mono">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
              Athena está consultando o Código de Trânsito...
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts chips bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-850 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none shrink-0" id="chat-prompt-chips">
        {suggestedPrompts.map((pText) => (
          <button
            key={pText}
            onClick={() => handleSend(pText)}
            disabled={loading}
            className="inline-block py-1 px-3 bg-slate-900 border border-slate-800 hover:border-emerald-600 rounded-lg text-[10px] font-mono font-medium text-slate-300 hover:text-white transition-colors"
          >
            {pText}
          </button>
        ))}
      </div>

      {/* Chat input box */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 rounded-b-2xl">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
          className="flex gap-2"
        >
          <input
            id="chat-user-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            placeholder="Pergunte sobre crimes, recursos, CTB ou bizus da banca..."
            className="flex-1 bg-slate-900 border border-slate-850 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all shrink-0 ${
              inputText.trim() && !loading 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-[1.02]' 
                : 'bg-slate-850 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
