export type RestricaoAlimentar =
  | 'gluten'
  | 'lactose'
  | 'amendoim'
  | 'frutos_do_mar'
  | 'ovo'
  | 'soja'
  | 'vegano'
  | 'vegetariano'
  | 'diabetes';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  restricoes: RestricaoAlimentar[];
  notificacoes: boolean;
  /** Ids das receitas favoritadas. */
  favoritas?: string[];
}

export type CategoriaNoticia = 'Nutrição' | 'Saúde' | 'Alimentação';

/** Chave de uma ilustração local (ver src/components/ilustracoes.ts). */
export type ChaveIlustracao =
  | 'noticia-lactose'
  | 'noticia-gluten'
  | 'noticia-saude'
  | 'receita-panquecas'
  | 'receita-pao-de-queijo'
  | 'receita-brownie'
  | 'receita-salada'
  | 'receita-bolo-banana';

/** Documento de referência que embasa uma notícia (para o leitor verificar). */
export interface FonteNoticia {
  titulo: string;
  autoria: string;
  ano: number;
  url: string;
}

export interface Noticia {
  id: string;
  titulo: string;
  resumo: string;
  /** Parágrafos separados por linha em branco; "## " no início vira subtítulo. */
  conteudo: string;
  fonte?: FonteNoticia;
  ilustracao?: ChaveIlustracao;
  /** Imagem hospedada (ex.: Firebase Storage). Tem prioridade sobre `ilustracao`. */
  imagemUrl?: string;
  dataPublicacao: string; // ISO
  categoria: CategoriaNoticia;
  destaque?: boolean;
  restricoes: RestricaoAlimentar[];
}

export type Dificuldade = 'Fácil' | 'Média' | 'Difícil';

export interface Receita {
  id: string;
  titulo: string;
  descricao: string;
  ilustracao?: ChaveIlustracao;
  /** Imagem hospedada (ex.: Firebase Storage). Tem prioridade sobre `ilustracao`. */
  imagemUrl?: string;
  tempoPreparoMin: number;
  porcoes: number;
  dificuldade: Dificuldade;
  destaque?: boolean;
  ingredientes: string[];
  modoPreparo: string[];
  /** Etiquetas exibidas nos cards (padrão: calculado a partir de livreDe). */
  etiquetas?: RestricaoAlimentar[];
  /** Restrições que a receita atende (ex.: 'gluten' = sem glúten). */
  livreDe: RestricaoAlimentar[];
}
