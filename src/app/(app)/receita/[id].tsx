import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ILUSTRACOES_HERO, ILUSTRACOES_INGREDIENTES, imagemDe } from '@/components/ilustracoes';
import { BotaoCircular, CabecalhoVoltar, Carregando, Cartao, Etiqueta, Ilustracao, Vazio, useLarguraTela } from '@/components/ui';
import { useCarregar } from '@/components/useCarregar';
import { useAuth } from '@/contexts/AuthContext';
import { obterReceita } from '@/services/api';
import { ICONES_RESTRICAO, ROTULOS_RESTRICAO, RESTRICOES_EM_DESTAQUE } from '@/services/restricoes';
import { cores, espacamento, fontes } from '@/theme';

export default function ReceitaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuario, atualizarUsuario } = useAuth();
  const largura = useLarguraTela();
  const { dados: receita, carregando } = useCarregar(() => obterReceita(id), id);

  if (carregando) return <Carregando />;
  if (!receita) {
    return (
      <SafeAreaView style={styles.tela}>
        <View style={{ paddingHorizontal: espacamento.md }}>
          <CabecalhoVoltar />
        </View>
        <Vazio texto="Receita não encontrada." />
      </SafeAreaView>
    );
  }

  const favoritas = usuario?.favoritas ?? [];
  const favorita = favoritas.includes(receita.id);
  function alternarFavorita() {
    atualizarUsuario({ favoritas: favorita ? favoritas.filter((f) => f !== receita!.id) : [...favoritas, receita!.id] });
  }

  const hero = !receita.imagemUrl && receita.ilustracao && ILUSTRACOES_HERO[receita.ilustracao];
  const imagemIngredientes = !receita.imagemUrl && receita.ilustracao && ILUSTRACOES_INGREDIENTES[receita.ilustracao];
  // Como no layout: só as restrições principais (vegana, sem glúten, sem lactose).
  const restricoes = RESTRICOES_EM_DESTAQUE.filter((r) => receita.livreDe.includes(r));

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.hero}>
          {hero ? (
            <Ilustracao fonte={hero} largura={largura} proporcao={952 / 500} modo="cover" />
          ) : (
            imagemDe(receita) && (
              <View style={styles.heroAlternativo}>
                <Ilustracao fonte={imagemDe(receita)!} largura={largura * 0.55} proporcao={195 / 220} />
              </View>
            )
          )}
          <BotaoCircular icone="arrow-left" rotulo="Voltar" onPress={() => router.back()} estilo={styles.voltar} />
          <BotaoCircular
            icone="heart"
            rotulo={favorita ? 'Remover dos favoritos' : 'Favoritar'}
            corIcone={favorita ? cores.erro : cores.texto}
            onPress={alternarFavorita}
            estilo={styles.favoritar}
          />
        </View>

        <View style={styles.corpo}>
          <Text style={styles.titulo} accessibilityRole="header">
            {receita.titulo}
          </Text>

          <View style={styles.linhaEtiquetas}>
            {restricoes.map((r) => (
              <Etiqueta key={r} texto={ROTULOS_RESTRICAO[r]} icone={ICONES_RESTRICAO[r]} cor={r === 'vegano' ? 'verde' : 'pessego'} tamanho="m" />
            ))}
          </View>

          <View style={styles.linhaEtiquetas}>
            <Etiqueta texto={`${receita.tempoPreparoMin} min`} icone="clock-outline" cor="claro" tamanho="m" />
            <Etiqueta texto={`${receita.porcoes} porções`} icone="silverware-fork-knife" cor="claro" tamanho="m" />
            <Etiqueta texto={receita.dificuldade} icone="chef-hat" cor={receita.dificuldade === 'Fácil' ? 'verde' : 'pessego'} tamanho="m" />
          </View>

          <Cartao estilo={styles.bloco}>
            <View style={styles.ingredientes}>
              <View style={{ flex: 1, gap: espacamento.sm }}>
                <Text style={styles.blocoTitulo}>Ingredientes</Text>
                {receita.ingredientes.map((ing, i) => (
                  <View key={i} style={styles.ingrediente}>
                    <View style={styles.marcador} />
                    <Text style={styles.texto}>{ing}</Text>
                  </View>
                ))}
              </View>
              {imagemIngredientes && <Ilustracao fonte={imagemIngredientes} largura={(largura - 80) * 0.3} proporcao={280 / 295} />}
            </View>
          </Cartao>

          <Cartao estilo={styles.bloco}>
            <Text style={styles.blocoTitulo}>Modo de preparo</Text>
            {receita.modoPreparo.map((passo, i) => (
              <View key={i} style={styles.passo}>
                <View style={styles.passoLateral}>
                  <View style={styles.passoNumero}>
                    <Text style={styles.passoNumeroTexto}>{String(i + 1).padStart(2, '0')}</Text>
                  </View>
                  {i < receita.modoPreparo.length - 1 && <View style={styles.passoLinha} />}
                </View>
                <Text style={[styles.texto, styles.passoTexto]}>{passo}</Text>
              </View>
            ))}
          </Cartao>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { paddingBottom: espacamento.xl },
  hero: { width: '100%' },
  heroAlternativo: { alignItems: 'center', paddingTop: 70, paddingBottom: espacamento.sm },
  voltar: { position: 'absolute', top: espacamento.sm, left: espacamento.md },
  favoritar: { position: 'absolute', top: espacamento.sm, right: espacamento.md },
  corpo: { paddingHorizontal: espacamento.md, gap: espacamento.md },
  titulo: { fontFamily: fontes.extra, fontSize: 30, lineHeight: 36, color: cores.texto, letterSpacing: -0.6, marginTop: espacamento.sm },
  linhaEtiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: espacamento.sm },
  bloco: { padding: espacamento.lg, gap: espacamento.sm },
  blocoTitulo: { fontFamily: fontes.extra, fontSize: 22, color: cores.texto, letterSpacing: -0.3, marginBottom: espacamento.xs },
  ingredientes: { flexDirection: 'row', alignItems: 'center', gap: espacamento.sm },
  ingrediente: { flexDirection: 'row', alignItems: 'flex-start', gap: espacamento.sm },
  marcador: { width: 7, height: 7, borderRadius: 4, backgroundColor: cores.texto, marginTop: 8 },
  texto: { flex: 1, fontFamily: fontes.regular, fontSize: 15, lineHeight: 22, color: cores.texto },
  passo: { flexDirection: 'row', gap: espacamento.md },
  passoLateral: { alignItems: 'center', width: 44 },
  passoNumero: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.pessegoForte,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passoNumeroTexto: { fontFamily: fontes.extra, fontSize: 16, color: cores.texto },
  passoLinha: { width: 3, flex: 1, minHeight: 12, backgroundColor: cores.pessego, marginVertical: 2 },
  passoTexto: { paddingTop: 10, paddingBottom: espacamento.md },
});
