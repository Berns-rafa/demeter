// iOS/Android: guarda a sessão no AsyncStorage para o usuário continuar logado.
// Ver https://docs.expo.dev/guides/using-firebase/ (seção de persistência do Auth).
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import type { Persistence } from 'firebase/auth';

// `getReactNativePersistence` existe no build React Native do Firebase,
// mas não aparece nos tipos públicos do pacote — por isso o cast.
const { getReactNativePersistence } = firebaseAuth as unknown as {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
};

export function criarAuth(app: FirebaseApp, jaIniciado: boolean) {
  // Com recarregamento rápido o app já pode estar iniciado: reaproveita a instância.
  if (jaIniciado) return firebaseAuth.getAuth(app);
  return firebaseAuth.initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
}
