import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, espacamento, fontes, raio, sombra } from '@/theme';

const ITENS: Record<string, { rotulo: string; icone: (cor: string) => ReactNode }> = {
  index: { rotulo: 'Início', icone: (cor) => <Feather name="home" size={26} color={cor} /> },
  noticias: { rotulo: 'Notícias', icone: (cor) => <Ionicons name="newspaper-outline" size={26} color={cor} /> },
  receitas: { rotulo: 'Receitas', icone: (cor) => <MaterialCommunityIcons name="silverware-fork-knife" size={26} color={cor} /> },
  conta: { rotulo: 'Conta', icone: (cor) => <Feather name="user" size={26} color={cor} /> },
};

/** Barra inferior flutuante do Deméter (Início, Notícias, Receitas, Conta). */
export function BarraNavegacao({ state, emitter, navigateToTab, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.area, { paddingBottom: Math.max(insets.bottom, espacamento.sm) }]}>
      <View style={styles.barra} role="tablist">
        {state.routes.map((route, index) => {
          const item = ITENS[route.name];
          if (!item) return null;
          const ativo = index === state.index;
          const cor = ativo ? cores.branco : cores.texto;

          function aoPressionar() {
            const evento = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!ativo && !evento.defaultPrevented) navigateToTab(route.key);
          }

          return (
            <Pressable
              key={route.key}
              role="tab"
              accessibilityState={{ selected: ativo }}
              accessibilityLabel={item.rotulo}
              onPress={aoPressionar}
              style={[styles.item, ativo && styles.itemAtivo]}
            >
              {item.icone(cor)}
              <Text style={[styles.rotulo, { color: cor }]} numberOfLines={1}>
                {item.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  area: { backgroundColor: cores.fundo, paddingHorizontal: 12, paddingTop: espacamento.xs },
  barra: {
    flexDirection: 'row',
    backgroundColor: cores.superficie,
    borderRadius: 40,
    padding: 8,
    ...sombra,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 10,
    borderRadius: raio.pilula,
  },
  itemAtivo: { backgroundColor: cores.primaria },
  rotulo: { fontFamily: fontes.semi, fontSize: 13 },
});
