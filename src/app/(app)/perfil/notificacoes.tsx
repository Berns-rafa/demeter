import { Feather } from '@expo/vector-icons';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { TelaInterna } from '@/components/TelaInterna';
import { Cartao } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { cores, espacamento, fontes } from '@/theme';

export default function NotificacoesScreen() {
  const { usuario, atualizarUsuario } = useAuth();
  if (!usuario) return null;

  return (
    <TelaInterna titulo="Notificações">
      <Cartao estilo={styles.linha}>
        <Feather name="bell" size={26} color={cores.texto} />
        <View style={{ flex: 1 }}>
          <Text style={styles.titulo}>Receber notificações</Text>
          <Text style={styles.sub}>Novas receitas e notícias para o seu perfil</Text>
        </View>
        <Switch
          value={usuario.notificacoes}
          onValueChange={(v) => atualizarUsuario({ notificacoes: v })}
          trackColor={{ true: cores.primaria, false: cores.pessego }}
          thumbColor={cores.branco}
          accessibilityLabel="Receber notificações"
        />
      </Cartao>
    </TelaInterna>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacamento.md, padding: espacamento.lg },
  titulo: { fontFamily: fontes.negrito, fontSize: 17, color: cores.texto },
  sub: { fontFamily: fontes.regular, fontSize: 14, color: cores.textoSecundario, marginTop: 2 },
});
