import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { imagemDe } from '@/components/ilustracoes';
import { SeloFonte } from '@/components/SeloFonte';
import {
  BotaoSeta,
  CabecalhoTela,
  Campo,
  Carregando,
  Cartao,
  Chip,
  Ilustracao,
  Selo,
  TituloSecao,
  Vazio,
  useLarguraTela,
} from '@/components/ui';
import { useCarregar } from '@/components/useCarregar';
import { listarNoticias } from '@/services/api';
import { cores, espacamento, fontes } from '@/theme';
import type { CategoriaNoticia, Noticia } from '@/types';

const CATEGORIAS: (CategoriaNoticia | undefined)[] = [undefined, 'Nutrição', 'Saúde', 'Alimentação'];

export default function NoticiasScreen() {
  const largura = useLarguraTela(espacamento.md);
  const [categoria, setCategoria] = useState<CategoriaNoticia>();
  const [buscando, setBuscando] = useState(false);
  const [busca, setBusca] = useState('');

  const { dados, carregando, erro, recarregar } = useCarregar(
    () => listarNoticias({ busca, categoria }),
    `${busca}|${categoria ?? ''}`,
  );

  const destaque = dados?.find((n) => n.destaque) ?? dados?.[0];
  const demais = dados?.filter((n) => n !== destaque) ?? [];
  const abrir = (n: Noticia) => router.push(`/noticia/${n.id}`);

  function alternarBusca() {
    if (buscando) setBusca('');
    setBuscando((b) => !b);
  }

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        refreshControl={<RefreshControl refreshing={carregando && !!dados} onRefresh={recarregar} tintColor={cores.primaria} />}
        keyboardShouldPersistTaps="handled"
      >
        <CabecalhoTela
          titulo="Notícias"
          acao={{ icone: buscando ? 'x' : 'search', rotulo: buscando ? 'Fechar busca' : 'Buscar', onPress: alternarBusca }}
        />

        {buscando && (
          <Campo icone="search" placeholder="Buscar notícia..." value={busca} onChangeText={setBusca} autoFocus returnKeyType="search" />
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipsArea}>
          {CATEGORIAS.map((c) => (
            <Chip key={c ?? 'todas'} texto={c ?? 'Todas'} ativo={categoria === c} onPress={() => setCategoria(c)} />
          ))}
        </ScrollView>

        {carregando && !dados ? (
          <Carregando />
        ) : erro ? (
          <Vazio texto={erro} />
        ) : !destaque ? (
          <Vazio texto="Nenhuma notícia encontrada." />
        ) : (
          <>
            <Cartao onPress={() => abrir(destaque)} estilo={styles.destaque}>
              {imagemDe(destaque) && (
                <Ilustracao fonte={imagemDe(destaque)!} largura={(largura - 16) * 0.46} proporcao={425 / 395} />
              )}
              <View style={styles.destaqueTexto}>
                <Selo texto={destaque.categoria} />
                <Text style={styles.destaqueTitulo}>{destaque.titulo}</Text>
                {destaque.fonte && <SeloFonte fonte={destaque.fonte} />}
                <View style={styles.destaqueSeta}>
                  <BotaoSeta onPress={() => abrir(destaque)} />
                </View>
              </View>
            </Cartao>

            {demais.length > 0 && <TituloSecao>Mais notícias</TituloSecao>}
            {demais.map((n) => (
              <ItemNoticia key={n.id} noticia={n} larguraImagem={largura * 0.38} onPress={() => abrir(n)} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ItemNoticia({ noticia, larguraImagem, onPress }: { noticia: Noticia; larguraImagem: number; onPress: () => void }) {
  return (
    <Cartao onPress={onPress} estilo={styles.item}>
      {imagemDe(noticia) && <Ilustracao fonte={imagemDe(noticia)!} largura={larguraImagem} proporcao={320 / 175} />}
      <View style={styles.itemTexto}>
        <Selo texto={noticia.categoria} />
        <Text style={styles.itemTitulo} numberOfLines={3}>
          {noticia.titulo}
        </Text>
        {noticia.fonte && <SeloFonte fonte={noticia.fonte} />}
      </View>
      <Pressable onPress={onPress} hitSlop={8} accessibilityLabel="Abrir notícia" style={styles.itemSeta}>
        <Feather name="chevron-right" size={24} color={cores.texto} />
      </Pressable>
    </Cartao>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flexGrow: 1, paddingHorizontal: espacamento.md, paddingBottom: espacamento.lg, gap: espacamento.md },
  chipsArea: { marginHorizontal: -espacamento.md, flexGrow: 0 },
  chips: { gap: espacamento.sm, paddingHorizontal: espacamento.md, paddingVertical: espacamento.sm },
  destaque: { flexDirection: 'row', alignItems: 'center', padding: espacamento.sm },
  destaqueTexto: { flex: 1, gap: espacamento.sm, paddingVertical: espacamento.sm, paddingRight: espacamento.sm },
  destaqueTitulo: { fontFamily: fontes.extra, fontSize: 20, lineHeight: 25, color: cores.texto, letterSpacing: -0.3 },
  destaqueSeta: { alignItems: 'flex-end' },
  item: { flexDirection: 'row', alignItems: 'center', minHeight: 100 },
  itemTexto: { flex: 1, gap: 6, paddingVertical: espacamento.md, paddingLeft: espacamento.sm },
  itemTitulo: { fontFamily: fontes.negrito, fontSize: 16, lineHeight: 21, color: cores.texto },
  itemSeta: { paddingHorizontal: espacamento.md },
});
