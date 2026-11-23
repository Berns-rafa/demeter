import { Stack } from 'expo-router';

import { cores } from '@/theme';

export default function AppLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.fundo } }} />;
}
