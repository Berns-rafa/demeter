import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CabecalhoVoltar } from '@/components/ui';
import { cores, espacamento } from '@/theme';

/** Estrutura das telas internas (voltar + título + conteúdo rolável). */
export function TelaInterna({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <SafeAreaView style={styles.tela}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <CabecalhoVoltar titulo={titulo} />
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flexGrow: 1, paddingHorizontal: espacamento.md, paddingBottom: espacamento.xl, gap: espacamento.lg },
});
