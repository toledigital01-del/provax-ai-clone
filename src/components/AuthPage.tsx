import React, { useState } from 'react';
import { auth, supabase, REDIRECT_URL } from '../lib/supabase';
import Logo from './Logo';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'reset';

interface AuthPageProps {
  onAuth: () => void;
  theme?: 'dark' | 'light';
  initialMode?: AuthMode;
}

export default function AuthPage({ onAuth, theme = 'dark', initialMode = 'login' }: AuthPageProps) {
  const d = theme === 'dark';

  const [mode, setMode] = useState<AuthMode>(initialMode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const pg    = d ? 'bg-[#080b14]' : 'bg-slate-50';
  const card  = d ? 'bg-[#0d1117] border border-white/[0.06]' : 'bg-white border border-slate-200 shadow-sm';
  const txt   = d ? 'text-white' : 'text-slate-900';
  const mut   = d ? 'text-slate-400' : 'text-slate-500';
  const inp   = d
    ? 'bg-[#131a27] border border-white/[0.08] focus:border-indigo-500/60 text-white placeholder-slate-600'
    : 'bg-slate-50 border border-slate-200 focus:border-indigo-400 text-slate-900 placeholder-slate-400';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await auth.signIn(email, password);
        if (error) throw error;
        onAuth();

      } else if (mode === 'register') {
        if (!name.trim()) { setError('Digite seu nome.'); setLoading(false); return; }
        if (password.length < 6) { setError('Senha deve ter pelo menos 6 caracteres.'); setLoading(false); return; }
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            data: { name },
            emailRedirectTo: REDIRECT_URL,
          },
        });
        if (error) throw error;
        setSuccess('Conta criada! Verifique seu e-mail para confirmar o cadastro.');

      } else if (mode === 'reset') {
        const { error } = await auth.resetPassword(email);
        if (error) throw error;
        setSuccess('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      }
    } catch (err: any) {
      const msg = err.message || 'Erro inesperado. Tente novamente.';
      if (msg.includes('Invalid login')) setError('E-mail ou senha incorretos.');
      else if (msg.includes('already registered')) setError('Este e-mail já está cadastrado.');
      else if (msg.includes('Email not confirmed')) setError('Confirme seu e-mail antes de entrar.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${pg} flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden`}>
      {/* Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo variant="compact" theme={theme} />
        </div>

        {/* Card */}
        <div className={`${card} rounded-3xl p-8 space-y-6`}>
          {/* Título */}
          <div className="text-center">
            <h1 className={`text-xl font-black tracking-tight ${txt}`}>
              {mode === 'login'    ? 'Entrar na sua conta'    :
               mode === 'register' ? 'Criar conta grátis'     :
               'Recuperar senha'}
            </h1>
            <p className={`text-sm mt-1 ${mut}`}>
              {mode === 'login'    ? 'Bem-vindo de volta, Recruta!'       :
               mode === 'register' ? 'Comece sua preparação para a PRF'   :
               'Enviaremos um link para seu e-mail'}
            </p>
          </div>

          {/* Erro */}
          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Sucesso */}
          {success && (
            <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-400">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome — só no cadastro */}
            {mode === 'register' && (
              <div>
                <label className={`block text-[11px] font-mono font-bold uppercase tracking-widest mb-1.5 ${mut}`}>
                  Nome completo
                </label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                  required
                  className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all ${inp}`}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className={`block text-[11px] font-mono font-bold uppercase tracking-widest mb-1.5 ${mut}`}>
                E-mail
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all ${inp}`}
              />
            </div>

            {/* Senha — não no reset */}
            {mode !== 'reset' && (
              <div>
                <label className={`block text-[11px] font-mono font-bold uppercase tracking-widest mb-1.5 ${mut}`}>
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                    required minLength={6}
                    className={`w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all ${inp}`}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${mut} hover:text-white transition-colors`}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'login' && (
                  <button type="button" onClick={() => { setMode('reset'); setError(''); setSuccess(''); }}
                    className={`text-[11px] mt-1.5 cursor-pointer hover:text-indigo-400 transition-colors ${mut}`}>
                    Esqueci minha senha
                  </button>
                )}
              </div>
            )}

            {/* Botão principal */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black rounded-xl text-sm transition-all hover:scale-[1.01] disabled:opacity-60 cursor-pointer shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Aguarde...</>
                : mode === 'login'    ? 'Entrar'
                : mode === 'register' ? 'Criar conta grátis'
                : 'Enviar link de recuperação'}
            </button>
          </form>

          {/* Separador */}
          <div className={`flex items-center gap-3 ${mut}`}>
            <div className={`flex-1 h-px ${d ? 'bg-white/[0.06]' : 'bg-slate-200'}`} />
            <span className="text-[11px] font-mono">ou</span>
            <div className={`flex-1 h-px ${d ? 'bg-white/[0.06]' : 'bg-slate-200'}`} />
          </div>

          {/* Troca de modo */}
          {mode === 'login' && (
            <p className={`text-center text-sm ${mut}`}>
              Não tem conta?{' '}
              <button onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                className="text-indigo-400 font-bold hover:text-indigo-300 cursor-pointer transition-colors">
                Criar conta grátis
              </button>
            </p>
          )}
          {mode === 'register' && (
            <p className={`text-center text-sm ${mut}`}>
              Já tem conta?{' '}
              <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className="text-indigo-400 font-bold hover:text-indigo-300 cursor-pointer transition-colors">
                Entrar
              </button>
            </p>
          )}
          {mode === 'reset' && (
            <p className={`text-center text-sm ${mut}`}>
              <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className="text-indigo-400 font-bold hover:text-indigo-300 cursor-pointer transition-colors">
                ← Voltar ao login
              </button>
            </p>
          )}
        </div>

        {/* Rodapé */}
        <p className={`text-center text-[11px] mt-6 ${mut}`}>
          Ao criar conta você concorda com os{' '}
          <span className="text-indigo-400 cursor-pointer hover:underline">Termos de Uso</span>
          {' '}e{' '}
          <span className="text-indigo-400 cursor-pointer hover:underline">Política de Privacidade</span>
        </p>
      </div>
    </div>
  );
}
