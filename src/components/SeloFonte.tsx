import { Feather } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '@/theme';
import type { FonteNoticia } from '@/types';

/**
 * Linha "✓ Fonte: …" exibida nos cards e no topo da notícia,
 * para o leitor saber de onde vem a informação antes mesmo de ler.
 * Com `link`, abre o documento original ao tocar.
 */
export function SeloFonte({ fonte, link = false }: { fonte: FonteNoticia; link?: boolean }) {
  const conteudo = (
    <>
      <Feather name="check-circle" size={14} color={cores.verdeTexto} />
      <Text style={styles.texto} numberOfLines={link ? undefined : 2}>
        <Text style={styles.rotulo}>Fonte: </Text>
        {fonte.autoria.split(' · ')[0]}
        {link && ` — ${fonte.titulo} (${fonte.ano})`}
      </Text>
      {link && <Feather name="external-link" size={14} color={cores.verdeTexto} />}
    </>
  );

  if (!link) return <View style={styles.linha}>{conteudo}</View>;

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Abrir fonte: ${fonte.titulo}`}
      onPress={() => Linking.openURL(fonte.url)}
      style={({ pressed }) => [styles.linha, styles.linhaLink, pressed && { opacity: 0.8 }]}
    >
      {conteudo}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  linhaLink: {
    alignSelf: 'flex-start',
    backgroundColor: cores.verde,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    maxWidth: '100%',
  },
  texto: { flexShrink: 1, fontFamily: fontes.media, fontSize: 12, lineHeight: 16, color: cores.verdeTexto },
  rotulo: { fontFamily: fontes.negrito },
});
