import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { imagemDe } from '@/components/ilustracoes';
import { SeloFonte } from '@/components/SeloFonte';
import { CabecalhoVoltar, Carregando, Cartao, Etiqueta, Ilustracao, Selo, Vazio, useLarguraTela } from '@/components/ui';
import { useCarregar } from '@/components/useCarregar';
import { obterNoticia } from '@/services/api';
import { formatarData } from '@/services/formatar';
import { ICONES_RESTRICAO, ROTULOS_RESTRICAO } from '@/services/restricoes';
import { cores, espacamento, fontes, raio } from '@/theme';

export default function NoticiaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados: noticia, carregando } = useCarregar(() => obterNoticia(id), id);
  const largura = useLarguraTela(espacamento.md);

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <View style={styles.topo}>
        <CabecalhoVoltar titulo="Notícia" />
      </View>
      {carregando ? (
        <Carregando />
      ) : !noticia ? (
        <Vazio texto="Notícia não encontrada." />
      ) : (
        <ScrollView contentContainerStyle={styles.conteudo}>
          {imagemDe(noticia) && (
            <Cartao estilo={styles.imagemCartao}>
              <Ilustracao fonte={imagemDe(noticia)!} largura={largura * 0.7} proporcao={425 / 395} />
            </Cartao>
          )}
          <Selo texto={noticia.categoria} />
          <Text style={styles.titulo} accessibilityRole="header">
            {noticia.titulo}
          </Text>
          <Text style={styles.data}>{formatarData(noticia.dataPublicacao)}</Text>
          {noticia.fonte && <SeloFonte fonte={noticia.fonte} link />}
          {noticia.restricoes.length > 0 && (
            <View style={styles.etiquetas}>
              {noticia.restricoes.map((r) => (
                <Etiqueta key={r} texto={ROTULOS_RESTRICAO[r]} icone={ICONES_RESTRICAO[r]} tamanho="m" />
              ))}
            </View>
          )}
          <Text style={styles.resumo}>{noticia.resumo}</Text>

          {noticia.conteudo.split(/\n{2,}/).map((bloco, i) =>
            bloco.startsWith('## ') ? (
              <Text key={i} style={styles.subtitulo} accessibilityRole="header">
                {bloco.slice(3)}
              </Text>
            ) : (
              <Text key={i} style={styles.corpo}>
                {bloco}
              </Text>
            ),
          )}

          {noticia.fonte && (
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`Abrir fonte: ${noticia.fonte.titulo}`}
              onPress={() => Linking.openURL(noticia.fonte!.url)}
              style={({ pressed }) => [styles.fonte, pressed && { opacity: 0.8 }]}
            >
              <View style={styles.fonteIcone}>
                <Feather name="check-circle" size={22} color={cores.texto} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.fonteRotulo}>FONTE VERIFICADA</Text>
                <Text style={styles.fonteTitulo}>{noticia.fonte.titulo}</Text>
                <Text style={styles.fonteAutoria}>
                  {noticia.fonte.autoria} · {noticia.fonte.ano}
                </Text>
              </View>
              <Feather name="external-link" size={20} color={cores.texto} />
            </Pressable>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  topo: { paddingHorizontal: espacamento.md },
  conteudo: { padding: espacamento.md, gap: espacamento.md, paddingBottom: espacamento.xl },
  imagemCartao: { alignItems: 'center', paddingVertical: espacamento.sm },
  titulo: { fontFamily: fontes.extra, fontSize: 28, lineHeight: 34, color: cores.texto, letterSpacing: -0.5 },
  data: { fontFamily: fontes.media, fontSize: 13, color: cores.textoSecundario, marginTop: -espacamento.sm },
  etiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: espacamento.sm },
  resumo: { fontFamily: fontes.semi, fontSize: 17, lineHeight: 25, color: cores.texto },
  subtitulo: { fontFamily: fontes.extra, fontSize: 20, color: cores.texto, marginTop: espacamento.sm, letterSpacing: -0.3 },
  corpo: { fontFamily: fontes.regular, fontSize: 16, lineHeight: 25, color: cores.texto },
  fonte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamento.md,
    padding: espacamento.md,
    marginTop: espacamento.sm,
    borderRadius: raio.md,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.pessego,
  },
  fonteIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.verde,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fonteRotulo: { fontFamily: fontes.semi, fontSize: 11, letterSpacing: 0.4, color: cores.verdeTexto },
  fonteTitulo: { fontFamily: fontes.negrito, fontSize: 15, color: cores.texto },
  fonteAutoria: { fontFamily: fontes.regular, fontSize: 13, color: cores.textoSecundario },
});
