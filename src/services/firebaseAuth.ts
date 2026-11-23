// Web: o Firebase Auth já guarda a sessão no navegador (IndexedDB).
import type { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export function criarAuth(app: FirebaseApp, _jaIniciado: boolean) {
  return getAuth(app);
}
