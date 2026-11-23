import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { Fragment, type ReactNode } from 'react';
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ONDAS } from '@/components/ilustracoes';
import { CabecalhoTela, Cartao } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { cores, espacamento, fontes, raio } from '@/theme';

export default function ContaScreen() {
  const { usuario, sair } = useAuth();
  if (!usuario) return null;

  function confirmarSaida() {
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.('Deseja sair da sua conta?')) sair();
      return;
    }
    Alert.alert('Sair da conta', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);
  }

  const itens: { titulo: string; subtitulo?: string; icone: ReactNode; href?: Href; onPress?: () => void }[] = [
    { titulo: 'Meus dados', subtitulo: 'Informações pessoais e cadastro', icone: <Feather name="user" size={30} color={cores.texto} />, href: '/perfil/dados' },
    {
      titulo: 'Restrições alimentares',
      subtitulo:
        usuario.restricoes.length > 0
          ? `${usuario.restricoes.length} ${usuario.restricoes.length === 1 ? 'restrição ativa' : 'restrições ativas'}`
          : 'Gerencie suas restrições',
      icone: <MaterialCommunityIcons name="leaf" size={30} color={cores.texto} />,
      href: '/perfil/restricoes',
    },
    { titulo: 'Notificações', subtitulo: 'Preferências de notificações', icone: <Feather name="bell" size={28} color={cores.texto} />, href: '/perfil/notificacoes' },
    {
      titulo: 'Privacidade e segurança',
      subtitulo: 'Senha e segurança da conta',
      icone: <MaterialCommunityIcons name="shield-check-outline" size={30} color={cores.texto} />,
      href: '/perfil/privacidade',
    },
    { titulo: 'Sair da conta', icone: <Feather name="log-out" size={28} color={cores.texto} />, onPress: confirmarSaida },
  ];

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <Image source={ONDAS} style={styles.ondas} resizeMode="cover" />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <CabecalhoTela titulo="Conta" />

        <Cartao estilo={styles.perfil}>
          <View style={styles.avatar}>
            <Feather name="user" size={36} color={cores.texto} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nome} numberOfLines={1}>
              {usuario.nome}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {usuario.email}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/perfil/dados')}
            style={({ pressed }) => [styles.editar, pressed && { opacity: 0.8 }]}
          >
            <Feather name="edit-2" size={15} color={cores.texto} />
            <Text style={styles.editarTexto}>Editar perfil</Text>
          </Pressable>
        </Cartao>

        <Cartao estilo={styles.menu}>
          {itens.map((item, i) => (
            <Fragment key={item.titulo}>
              {i > 0 && <View style={styles.divisor} />}
              <Pressable
                accessibilityRole="button"
                onPress={item.onPress ?? (() => item.href && router.push(item.href))}
                style={({ pressed }) => [styles.linha, pressed && { opacity: 0.7 }]}
              >
                <View style={styles.linhaIcone}>{item.icone}</View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.linhaTitulo}>{item.titulo}</Text>
                  {item.subtitulo && <Text style={styles.linhaSub}>{item.subtitulo}</Text>}
                </View>
                <Feather name="chevron-right" size={24} color={cores.texto} />
              </Pressable>
            </Fragment>
          ))}
        </Cartao>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  ondas: { position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: 110 },
  conteudo: { flexGrow: 1, paddingHorizontal: espacamento.md, paddingBottom: espacamento.xl, gap: espacamento.md },
  perfil: { flexDirection: 'row', alignItems: 'center', gap: espacamento.md, padding: espacamento.md, paddingVertical: espacamento.lg },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: cores.pessego,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nome: { fontFamily: fontes.negrito, fontSize: 18, color: cores.texto },
  email: { fontFamily: fontes.regular, fontSize: 14, color: cores.textoSecundario, marginTop: 2 },
  editar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: cores.pessego,
    borderRadius: raio.pilula,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editarTexto: { fontFamily: fontes.semi, fontSize: 13, color: cores.texto },
  menu: { paddingHorizontal: espacamento.md },
  divisor: { height: 1, backgroundColor: cores.borda, marginHorizontal: espacamento.xs },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacamento.md, paddingVertical: 18 },
  linhaIcone: { width: 36, alignItems: 'center' },
  linhaTitulo: { fontFamily: fontes.negrito, fontSize: 17, color: cores.texto },
  linhaSub: { fontFamily: fontes.regular, fontSize: 14, color: cores.textoSecundario, marginTop: 2 },
});
