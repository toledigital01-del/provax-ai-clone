import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Processar token de confirmação de email na URL
    // Quando usuário clica no link do email, Supabase redireciona com #access_token=...
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token') || hash.includes('type=signup') || hash.includes('type=recovery'))) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setUser(data.session.user);
          // Limpar hash da URL sem recarregar a página
          window.history.replaceState(null, '', window.location.pathname);
        }
        setLoading(false);
        setInitialized(true);
      });
    } else {
      // Verificar sessão atual normalmente
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user ?? null);
        setLoading(false);
        setInitialized(true);
      });
    }

    // Escutar mudanças de auth em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Auto-login após confirmação de email
      if (event === 'SIGNED_IN' && window.location.hash.includes('access_token')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, initialized };
}
