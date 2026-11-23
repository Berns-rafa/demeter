import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Carregando } from '@/components/ui';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { cores } from '@/theme';

function Rotas() {
  const { usuario, carregando } = useAuth();

  if (carregando) return <Carregando />;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.fundo } }}>
      {/* Área logada: abas (Início, Notícias, Receitas, Conta) e telas internas */}
      <Stack.Protected guard={!!usuario}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      {/* Área pública: login e cadastro */}
      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="login" />
        <Stack.Screen name="cadastro" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontesProntas, erroFontes] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      {fontesProntas || erroFontes ? <Rotas /> : <Carregando />}
    </AuthProvider>
  );
}
