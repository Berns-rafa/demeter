/**
 * Inicialização do Firebase (JS SDK — funciona no Expo Go).
 *
 * As chaves vêm do arquivo `.env.local` (veja `.env.example`). Sem elas,
 * `fb` fica `null` e o app usa os dados locais (src/services/dadosLocais.ts).
 */
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { criarAuth } from './firebaseAuth';

// As variáveis EXPO_PUBLIC_* precisam ser lidas assim, uma a uma (são embutidas no build).
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigurado = Boolean(config.apiKey && config.projectId && config.appId);

function iniciar() {
  const jaIniciado = getApps().length > 0;
  const app = jaIniciado ? getApp() : initializeApp(config);
  return { app, auth: criarAuth(app, jaIniciado), db: getFirestore(app) };
}

/** Instâncias do Firebase, ou `null` quando o projeto ainda não foi configurado. */
export const fb = firebaseConfigurado ? iniciar() : null;
