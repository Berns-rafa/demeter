import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { TelaInterna } from '@/components/TelaInterna';
import { Cartao } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { cores, espacamento, fontes } from '@/theme';

const ITENS_LOCAL = [
  {
    icone: 'cellphone-lock' as const,
    titulo: 'Seus dados ficam no aparelho',
    texto: 'Por enquanto, nome, e-mail e restrições são guardados apenas neste dispositivo.',
  },
  {
    icone: 'lock-reset' as const,
    titulo: 'Alterar senha',
    texto: 'A troca de senha estará disponível quando a conta for conectada ao servidor.',
  },
];

const ITENS_ONLINE = [
  {
    icone: 'shield-lock-outline' as const,
    titulo: 'Seus dados protegidos',
    texto: 'Seu login é feito pelo Firebase Authentication e seu perfil só pode ser lido e alterado por você.',
  },
  {
    icone: 'lock-reset' as const,
    titulo: 'Alterar senha',
    texto: 'Saia da conta e toque em "Esqueceu sua senha?" na tela de login para receber um link por e-mail.',
  },
];

export default function PrivacidadeScreen() {
  const { online } = useAuth();
  const ITENS = online ? ITENS_ONLINE : ITENS_LOCAL;
  return (
    <TelaInterna titulo="Privacidade">
      {ITENS.map((item) => (
        <Cartao key={item.titulo} estilo={styles.cartao}>
          <MaterialCommunityIcons name={item.icone} size={28} color={cores.texto} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.texto}>{item.texto}</Text>
          </View>
        </Cartao>
      ))}
    </TelaInterna>
  );
}

const styles = StyleSheet.create({
  cartao: { flexDirection: 'row', gap: espacamento.md, padding: espacamento.lg },
  titulo: { fontFamily: fontes.negrito, fontSize: 17, color: cores.texto },
  texto: { fontFamily: fontes.regular, fontSize: 14, lineHeight: 20, color: cores.textoSecundario },
});
