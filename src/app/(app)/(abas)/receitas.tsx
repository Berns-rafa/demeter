import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { imagemDe } from '@/components/ilustracoes';
import {
  BotaoSeta,
  CabecalhoTela,
  Campo,
  Carregando,
  Cartao,
  Chip,
  Etiqueta,
  Ilustracao,
  Selo,
  TituloSecao,
  Vazio,
  useLarguraTela,
} from '@/components/ui';
import { useCarregar } from '@/components/useCarregar';
import { useAuth } from '@/contexts/AuthContext';
import { listarReceitas } from '@/services/api';
import { ICONES_RESTRICAO, ROTULOS_RESTRICAO, etiquetasDaReceita } from '@/services/restricoes';
import { cores, espacamento, fontes } from '@/theme';
import type { Receita, RestricaoAlimentar } from '@/types';

const FILTROS: { rotulo: string; valor?: RestricaoAlimentar }[] = [
  { rotulo: 'Todas' },
  { rotulo: 'Sem glúten', valor: 'gluten' },
  { rotulo: 'Sem lactose', valor: 'lactose' },
  { rotulo: 'Veganas', valor: 'vegano' },
];

export default function ReceitasScreen() {
  const { usuario } = useAuth();
  const largura = useLarguraTela(espacamento.md);
  const perfil = usuario?.restricoes ?? [];
  const [filtro, setFiltro] = useState<RestricaoAlimentar>();
  const [buscando, setBuscando] = useState(false);
  const [busca, setBusca] = useState('');

  // Sempre respeita as restrições do perfil; o chip refina a lista.
  const livreDe = filtro && !perfil.includes(filtro) ? [...perfil, filtro] : perfil;
  const { dados, carregando, erro, recarregar } = useCarregar(
    () => listarReceitas({ busca, livreDe }),
    `${busca}|${livreDe.join(',')}`,
  );

  const destaque = dados?.find((r) => r.destaque) ?? dados?.[0];
  const demais = dados?.filter((r) => r !== destaque) ?? [];
  const abrir = (r: Receita) => router.push(`/receita/${r.id}`);

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
          titulo="Receitas"
          acao={{ icone: buscando ? 'x' : 'search', rotulo: buscando ? 'Fechar busca' : 'Buscar', onPress: alternarBusca }}
        />

        {buscando && (
          <Campo icone="search" placeholder="Buscar receita..." value={busca} onChangeText={setBusca} autoFocus returnKeyType="search" />
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipsArea}>
          {FILTROS.map((f) => (
            <Chip key={f.rotulo} texto={f.rotulo} ativo={filtro === f.valor} onPress={() => setFiltro(f.valor)} />
          ))}
        </ScrollView>

        {perfil.length > 0 && (
          <Text style={styles.aviso}>Mostrando receitas adequadas ao seu perfil: {perfil.map((r) => ROTULOS_RESTRICAO[r]).join(', ')}.</Text>
        )}

        {carregando && !dados ? (
          <Carregando />
        ) : erro ? (
          <Vazio texto={erro} />
        ) : !destaque ? (
          <Vazio texto="Nenhuma receita encontrada com esses filtros." />
        ) : (
          <>
            <Cartao onPress={() => abrir(destaque)} estilo={styles.destaque}>
              {imagemDe(destaque) && (
                <Ilustracao fonte={imagemDe(destaque)!} largura={(largura - 16) * 0.44} proporcao={415 / 385} />
              )}
              <View style={styles.destaqueTexto}>
                <Selo texto="Receita em destaque" />
                <Text style={styles.destaqueTitulo}>{destaque.titulo}</Text>
                <View style={styles.destaqueRodape}>
                  <View style={styles.etiquetas}>
                    {etiquetasDaReceita(destaque).map((r) => (
                      <Etiqueta key={r} texto={ROTULOS_RESTRICAO[r]} icone={ICONES_RESTRICAO[r]} cor={r === 'vegano' ? 'verde' : 'pessego'} tamanho="m" />
                    ))}
                  </View>
                  <BotaoSeta onPress={() => abrir(destaque)} />
                </View>
              </View>
            </Cartao>

            {demais.length > 0 && <TituloSecao>Para você</TituloSecao>}
            <View style={styles.grade}>
              {demais.map((r) => (
                <CardReceita key={r.id} receita={r} larguraImagem={largura * 0.485 * 0.36} onPress={() => abrir(r)} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function CardReceita({ receita, larguraImagem, onPress }: { receita: Receita; larguraImagem: number; onPress: () => void }) {
  const etiqueta = etiquetasDaReceita(receita)[0];
  return (
    <Cartao onPress={onPress} estilo={styles.card}>
      {imagemDe(receita) && (
        <Ilustracao fonte={imagemDe(receita)!} largura={larguraImagem} proporcao={195 / 220} estilo={styles.cardImagem} />
      )}
      <View style={styles.cardTexto}>
        <Text style={styles.cardTitulo} numberOfLines={3}>
          {receita.titulo}
        </Text>
        {etiqueta && (
          <Etiqueta texto={ROTULOS_RESTRICAO[etiqueta]} icone={ICONES_RESTRICAO[etiqueta]} cor={etiqueta === 'vegano' ? 'verde' : 'pessego'} />
        )}
        <View style={styles.cardRodape}>
          <Feather name="clock" size={14} color={cores.texto} />
          <Text style={styles.cardTempo}>{receita.tempoPreparoMin} min</Text>
          <Feather name="chevron-right" size={18} color={cores.texto} style={{ marginLeft: 'auto' }} />
        </View>
      </View>
    </Cartao>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flexGrow: 1, paddingHorizontal: espacamento.md, paddingBottom: espacamento.lg, gap: espacamento.md },
  chipsArea: { marginHorizontal: -espacamento.md, flexGrow: 0 },
  chips: { gap: espacamento.sm, paddingHorizontal: espacamento.md, paddingVertical: espacamento.sm },
  aviso: { fontFamily: fontes.regular, fontSize: 13, color: cores.textoSecundario, marginTop: -espacamento.sm },
  destaque: { flexDirection: 'row', alignItems: 'center', padding: espacamento.sm },
  destaqueTexto: { flex: 1, gap: espacamento.sm, paddingVertical: espacamento.sm, paddingRight: espacamento.xs },
  destaqueTitulo: { fontFamily: fontes.extra, fontSize: 24, lineHeight: 28, color: cores.texto, letterSpacing: -0.4 },
  destaqueRodape: { flexDirection: 'row', alignItems: 'flex-end', gap: espacamento.xs },
  etiquetas: { flex: 1, gap: 6 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: espacamento.md },
  card: { width: '48.5%', flexDirection: 'row', minHeight: 130 },
  cardImagem: { alignSelf: 'center' },
  cardTexto: { flex: 1, gap: 6, paddingVertical: 12, paddingLeft: 6, paddingRight: 8 },
  cardTitulo: { fontFamily: fontes.negrito, fontSize: 14, lineHeight: 18, color: cores.texto },
  cardRodape: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 'auto' },
  cardTempo: { fontFamily: fontes.media, fontSize: 12, color: cores.texto },
});
