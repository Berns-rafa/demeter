import { Tabs } from 'expo-router/js-tabs';

import { BarraNavegacao } from '@/components/BarraNavegacao';
import { cores } from '@/theme';

export default function AbasLayout() {
  return (
    <Tabs
      tabBar={(props) => <BarraNavegacao {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: cores.fundo } }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="noticias" options={{ title: 'Notícias' }} />
      <Tabs.Screen name="receitas" options={{ title: 'Receitas' }} />
      <Tabs.Screen name="conta" options={{ title: 'Conta' }} />
    </Tabs>
  );
}
