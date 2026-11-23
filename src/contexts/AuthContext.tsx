/**
 * Autenticação e perfil do usuário.
 *
 * - Com Firebase configurado: Firebase Auth (e-mail/senha) + perfil no Firestore
 *   em `usuarios/{uid}` (nome, restrições, notificações, favoritas).
 * - Sem Firebase: modo local, guarda o usuário só no aparelho (AsyncStorage).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { fb } from '@/services/firebase';
import type { Usuario } from '@/types';

type DadosPerfil = Partial<Omit<Usuario, 'id' | 'email'>>;

interface AuthContextValue {
  usuario: Usuario | null;
  carregando: boolean;
  /** true quando login/perfil estão no Firebase; false no modo local. */
  online: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
  atualizarUsuario: (dados: DadosPerfil) => Promise<void>;
  /** Envia e-mail de redefinição de senha (só com Firebase). */
  recuperarSenha: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function validarCredenciais(email: string, senha: string) {
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) throw new Error('Informe um e-mail válido.');
  if (senha.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres.');
}

/** Traduz os erros mais comuns do Firebase Auth. */
function mensagemDeErro(e: unknown): Error {
  const codigo = typeof e === 'object' && e && 'code' in e ? String(e.code) : '';
  const mensagens: Record<string, string> = {
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/wrong-password': 'E-mail ou senha incorretos.',
    'auth/user-not-found': 'E-mail ou senha incorretos.',
    'auth/email-already-in-use': 'Já existe uma conta com este e-mail.',
    'auth/invalid-email': 'Informe um e-mail válido.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente de novo.',
    'auth/network-request-failed': 'Sem conexão com a internet.',
    'auth/configuration-not-found': 'Login ainda não ativado no Firebase (Authentication > E-mail/senha).',
    'auth/operation-not-allowed': 'Login ainda não ativado no Firebase (Authentication > E-mail/senha).',
  };
  return new Error(mensagens[codigo] ?? (e instanceof Error ? e.message : 'Algo deu errado. Tente novamente.'));
}

function perfilPadrao(email: string, dados: DadosPerfil = {}): Omit<Usuario, 'id' | 'email'> {
  return {
    nome: dados.nome || email.split('@')[0],
    restricoes: dados.restricoes ?? [],
    notificacoes: dados.notificacoes ?? true,
    favoritas: dados.favoritas ?? [],
  };
}

/* ------------------------------------------------------------- Firebase */

function useAuthFirebase(): AuthContextValue {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  // Nome digitado no cadastro, usado se o listener disparar antes do perfil ser gravado.
  const nomePendente = useRef<string | null>(null);

  useEffect(() => {
    const { auth, db } = fb!;
    return onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUsuario(null);
        setCarregando(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'usuarios', u.uid));
        const dados = (snap.data() ?? {}) as DadosPerfil;
        if (!dados.nome && nomePendente.current) dados.nome = nomePendente.current;
        setUsuario({ id: u.uid, email: u.email ?? '', ...perfilPadrao(u.email ?? '', dados) });
      } catch {
        setUsuario({ id: u.uid, email: u.email ?? '', ...perfilPadrao(u.email ?? '') });
      } finally {
        setCarregando(false);
      }
    });
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    validarCredenciais(email, senha);
    try {
      await signInWithEmailAndPassword(fb!.auth, email.trim(), senha);
    } catch (e) {
      throw mensagemDeErro(e);
    }
  }, []);

  const cadastrar = useCallback(async (nome: string, email: string, senha: string) => {
    if (!nome.trim()) throw new Error('Informe seu nome.');
    validarCredenciais(email, senha);
    nomePendente.current = nome.trim();
    try {
      const { user } = await createUserWithEmailAndPassword(fb!.auth, email.trim(), senha);
      const perfil = perfilPadrao(email, { nome: nome.trim() });
      await setDoc(doc(fb!.db, 'usuarios', user.uid), perfil);
      setUsuario({ id: user.uid, email: user.email ?? email.trim(), ...perfil });
    } catch (e) {
      throw mensagemDeErro(e);
    } finally {
      nomePendente.current = null;
    }
  }, []);

  const sair = useCallback(() => signOut(fb!.auth), []);

  const atualizarUsuario = useCallback(
    async (dados: DadosPerfil) => {
      if (!usuario) return;
      setUsuario({ ...usuario, ...dados }); // atualiza a tela na hora
      await setDoc(doc(fb!.db, 'usuarios', usuario.id), dados, { merge: true });
    },
    [usuario],
  );

  const recuperarSenha = useCallback(async (email: string) => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) throw new Error('Digite seu e-mail no campo acima.');
    try {
      await sendPasswordResetEmail(fb!.auth, email.trim());
    } catch (e) {
      throw mensagemDeErro(e);
    }
  }, []);

  return { usuario, carregando, online: true, entrar, cadastrar, sair, atualizarUsuario, recuperarSenha };
}

/* ---------------------------------------------------------------- Local */

const CHAVE = '@aplicativo/usuario';

function useAuthLocal(): AuthContextValue {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE)
      .then((json) => json && setUsuario(JSON.parse(json) as Usuario))
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  const salvar = useCallback(async (u: Usuario | null) => {
    setUsuario(u);
    if (u) await AsyncStorage.setItem(CHAVE, JSON.stringify(u));
    else await AsyncStorage.removeItem(CHAVE);
  }, []);

  const entrar = useCallback(
    async (email: string, senha: string) => {
      validarCredenciais(email, senha);
      await salvar({ id: Date.now().toString(), email: email.trim(), ...perfilPadrao(email.trim()) });
    },
    [salvar],
  );

  const cadastrar = useCallback(
    async (nome: string, email: string, senha: string) => {
      if (!nome.trim()) throw new Error('Informe seu nome.');
      validarCredenciais(email, senha);
      await salvar({ id: Date.now().toString(), email: email.trim(), ...perfilPadrao(email.trim(), { nome: nome.trim() }) });
    },
    [salvar],
  );

  const sair = useCallback(() => salvar(null), [salvar]);

  const atualizarUsuario = useCallback(
    async (dados: DadosPerfil) => {
      if (usuario) await salvar({ ...usuario, ...dados });
    },
    [usuario, salvar],
  );

  const recuperarSenha = useCallback(async () => {
    throw new Error('A recuperação de senha estará disponível quando a conta for conectada ao servidor.');
  }, []);

  return { usuario, carregando, online: false, entrar, cadastrar, sair, atualizarUsuario, recuperarSenha };
}

/* ------------------------------------------------------------- Provider */

// `fb` é fixo durante a execução, então a escolha do hook nunca muda entre renders.
const useAuthImpl = fb ? useAuthFirebase : useAuthLocal;

export function AuthProvider({ children }: { children: ReactNode }) {
  const valor = useAuthImpl();
  const value = useMemo(
    () => valor,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valor.usuario, valor.carregando, valor.entrar, valor.cadastrar, valor.sair, valor.atualizarUsuario, valor.recuperarSenha],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
}
