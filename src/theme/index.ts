/**
 * Tokens visuais do Deméter — extraídos das telas aprovadas
 * (Demeter_Kit_Design/01_Telas_Aprovadas).
 */
export const cores = {
  /** Fundo creme das telas. */
  fundo: '#FCEDD8',
  /** Cartões, campos, chips inativos e barra de navegação. */
  superficie: '#FCF0E1',
  /** Marrom dos botões principais e item ativo da navegação. */
  primaria: '#6C4227',
  /** Pêssego de etiquetas, avatar e botões secundários. */
  pessego: '#FCDBB1',
  pessegoForte: '#FCD29F',
  /** Verde das etiquetas "Vegana" / "Fácil". */
  verde: '#E4E0A0',
  verdeTexto: '#4F5A1E',
  texto: '#4A2A12',
  textoSecundario: '#7A5A44',
  borda: '#F1DFC8',
  erro: '#B3261E',
  branco: '#FFFFFF',
};

export const fontes = {
  regular: 'Inter_400Regular',
  media: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  negrito: 'Inter_700Bold',
  extra: 'Inter_800ExtraBold',
};

export const espacamento = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const raio = { sm: 12, md: 20, lg: 28, pilula: 999 };

/** Sombra suave usada em cartões, campos e botões circulares. */
export const sombra = { boxShadow: '0px 4px 14px rgba(108, 66, 39, 0.10)' } as const;
