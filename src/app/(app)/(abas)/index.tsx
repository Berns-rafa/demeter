import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ILUSTRACAO_HOME, LOGO } from '@/components/ilustracoes';
import { Botao, BotaoCircular, Cartao, Ilustracao, useLarguraTela } from '@/components/ui';
import { cores, espacamento, fontes } from '@/theme';

export default function InicioScreen() {
  const largura = useLarguraTela(espacamento.lg);
  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.topo}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" accessibilityLabel="Deméter" />
          <BotaoCircular icone="user" rotulo="Minha conta" tamanho={60} onPress={() => router.navigate('/conta')} />
        </View>

        <Ilustracao fonte={ILUSTRACAO_HOME} largura={largura} proporcao={715 / 560} estilo={styles.ilustracao} />

        <Text style={styles.chamada} accessibilityRole="header">
          Sua alimentação,{'\n'}do seu jeito.
        </Text>

        <View style={styles.acoes}>
          <Botao titulo="Explorar receitas" icone="silverware-fork-knife" seta onPress={() => router.navigate('/receitas')} />

          <Cartao onPress={() => router.navigate('/noticias')} estilo={styles.novidades}>
            <Ionicons name="newspaper-outline" size={30} color={cores.texto} />
            <Text style={styles.novidadesTexto}>Novidades</Text>
            <Feather name="chevron-right" size={24} color={cores.texto} />
          </Cartao>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flexGrow: 1, paddingHorizontal: espacamento.lg, paddingBottom: espacamento.lg },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: espacamento.sm },
  logo: { width: 84, height: 74 },
  ilustracao: { marginTop: espacamento.xs },
  chamada: {
    fontFamily: fontes.extra,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.6,
    color: cores.texto,
    textAlign: 'center',
    marginTop: espacamento.sm,
  },
  acoes: { gap: espacamento.lg, marginTop: espacamento.lg },
  novidades: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamento.md,
    paddingHorizontal: espacamento.lg,
    paddingVertical: 22,
  },
  novidadesTexto: { flex: 1, fontFamily: fontes.negrito, fontSize: 19, color: cores.texto },
});
