import type { ImageSourcePropType } from 'react-native';

import type { ChaveIlustracao } from '@/types';

/** Ilustrações do kit Deméter (assets/demeter). */
export const ILUSTRACOES: Record<ChaveIlustracao, ImageSourcePropType> = {
  'noticia-lactose': require('../../assets/demeter/noticia-lactose.png'),
  'noticia-gluten': require('../../assets/demeter/noticia-gluten.png'),
  'noticia-saude': require('../../assets/demeter/noticia-saude.png'),
  'receita-panquecas': require('../../assets/demeter/receita-panquecas.png'),
  'receita-pao-de-queijo': require('../../assets/demeter/receita-pao-de-queijo.png'),
  'receita-brownie': require('../../assets/demeter/receita-brownie.png'),
  'receita-salada': require('../../assets/demeter/receita-salada.png'),
  'receita-bolo-banana': require('../../assets/demeter/receita-bolo-banana.png'),
};

/** Imagem grande do topo do detalhe da receita, quando existir. */
export const ILUSTRACOES_HERO: Partial<Record<ChaveIlustracao, ImageSourcePropType>> = {
  'receita-panquecas': require('../../assets/demeter/receita-panquecas-hero.png'),
};

/** Ilustração ao lado da lista de ingredientes, quando existir. */
export const ILUSTRACOES_INGREDIENTES: Partial<Record<ChaveIlustracao, ImageSourcePropType>> = {
  'receita-panquecas': require('../../assets/demeter/ingredientes-panquecas.png'),
};

export const LOGO = require('../../assets/demeter/logo.png') as ImageSourcePropType;
export const ILUSTRACAO_HOME = require('../../assets/demeter/home-ilustracao.png') as ImageSourcePropType;
export const ONDAS = require('../../assets/demeter/ondas.png') as ImageSourcePropType;

/** Imagem de uma notícia/receita: URL hospedada (Firebase Storage) ou ilustração local. */
export function imagemDe(item: { imagemUrl?: string; ilustracao?: ChaveIlustracao }): ImageSourcePropType | undefined {
  if (item.imagemUrl) return { uri: item.imagemUrl };
  return item.ilustracao ? ILUSTRACOES[item.ilustracao] : undefined;
}
