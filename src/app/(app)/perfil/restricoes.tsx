import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TelaInterna } from '@/components/TelaInterna';
import { Botao, Cartao } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { ICONES_RESTRICAO, ROTULOS_RESTRICAO, TODAS_RESTRICOES } from '@/services/restricoes';
import { cores, espacamento, fontes } from '@/theme';
import type { RestricaoAlimentar } from '@/types';

export default function RestricoesScreen() {
  const { usuario, atualizarUsuario } = useAuth();
  const [restricoes, setRestricoes] = useState<RestricaoAlimentar[]>(usuario?.restricoes ?? []);
  const [salvando, setSalvando] = useState(false);

  if (!usuario) return null;

  const alterado = restricoes.slice().sort().join() !== usuario.restricoes.slice().sort().join();

  function alternar(r: RestricaoAlimentar) {
    setRestricoes((atual) => (atual.includes(r) ? atual.filter((x) => x !== r) : [...atual, r]));
  }

  async function salvar() {
    setSalvando(true);
    try {
      await atualizarUsuario({ restricoes });
      router.back();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <TelaInterna titulo="Restrições">
      <Text style={styles.ajuda}>Usamos suas restrições para filtrar as receitas e destacar o que é seguro para você.</Text>

      <Cartao estilo={styles.lista}>
        {TODAS_RESTRICOES.map((r, i) => {
          const ativo = restricoes.includes(r);
          return (
            <View key={r}>
              {i > 0 && <View style={styles.divisor} />}
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: ativo }}
                onPress={() => alternar(r)}
                style={({ pressed }) => [styles.linha, pressed && { opacity: 0.7 }]}
              >
                <View style={[styles.icone, ativo && { backgroundColor: cores.pessego }]}>
                  <MaterialCommunityIcons name={ICONES_RESTRICAO[r]} size={22} color={cores.texto} />
                </View>
                <Text style={styles.rotulo}>{ROTULOS_RESTRICAO[r]}</Text>
                <View style={[styles.caixa, ativo && styles.caixaAtiva]}>
                  {ativo && <Feather name="check" size={16} color={cores.branco} />}
                </View>
              </Pressable>
            </View>
          );
        })}
      </Cartao>

      <Botao titulo="Salvar restrições" onPress={salvar} carregando={salvando} desabilitado={!alterado} />
    </TelaInterna>
  );
}

const styles = StyleSheet.create({
  ajuda: { fontFamily: fontes.regular, fontSize: 15, lineHeight: 22, color: cores.textoSecundario, textAlign: 'center' },
  lista: { paddingHorizontal: espacamento.md },
  divisor: { height: 1, backgroundColor: cores.borda },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacamento.md, paddingVertical: 12 },
  icone: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rotulo: { flex: 1, fontFamily: fontes.semi, fontSize: 16, color: cores.texto },
  caixa: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caixaAtiva: { backgroundColor: cores.primaria },
});
