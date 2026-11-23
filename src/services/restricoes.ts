import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RestricaoAlimentar } from '@/types';

export const ROTULOS_RESTRICAO: Record<RestricaoAlimentar, string> = {
  gluten: 'Sem glúten',
  lactose: 'Sem lactose',
  amendoim: 'Sem amendoim',
  frutos_do_mar: 'Sem frutos do mar',
  ovo: 'Sem ovo',
  soja: 'Sem soja',
  vegano: 'Vegana',
  vegetariano: 'Vegetariana',
  diabetes: 'Sem açúcar',
};

export const ICONES_RESTRICAO: Record<RestricaoAlimentar, ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  gluten: 'barley-off',
  lactose: 'cup-off',
  amendoim: 'peanut-off-outline',
  frutos_do_mar: 'fish-off',
  ovo: 'egg-off-outline',
  soja: 'soy-sauce-off',
  vegano: 'leaf',
  vegetariano: 'sprout-outline',
  diabetes: 'candy-off-outline',
};

export const TODAS_RESTRICOES = Object.keys(ROTULOS_RESTRICAO) as RestricaoAlimentar[];

/** Restrições exibidas como etiqueta nos cards (as demais ficam implícitas). */
export const RESTRICOES_EM_DESTAQUE: RestricaoAlimentar[] = ['vegano', 'gluten', 'lactose'];

export function etiquetasDaReceita(receita: { livreDe: RestricaoAlimentar[]; etiquetas?: RestricaoAlimentar[] }) {
  if (receita.etiquetas?.length) return receita.etiquetas;
  // Vegana já implica sem lactose; mostra no máximo 2 etiquetas como no layout.
  const lista = RESTRICOES_EM_DESTAQUE.filter((r) => receita.livreDe.includes(r));
  return (lista.includes('vegano') ? ['vegano' as const] : lista).slice(0, 2);
}
