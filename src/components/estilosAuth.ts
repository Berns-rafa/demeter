import { StyleSheet } from 'react-native';

import { cores, espacamento, fontes } from '@/theme';

export const estilosAuth = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  ondas: { position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: 110 },
  conteudo: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: espacamento.lg, paddingVertical: espacamento.xl, gap: espacamento.md },
  logo: { alignSelf: 'center', marginBottom: espacamento.xl },
  logoPequena: { alignSelf: 'center' },
  titulo: { fontFamily: fontes.extra, fontSize: 30, color: cores.texto, textAlign: 'center', marginBottom: espacamento.sm },
  esqueceu: { fontFamily: fontes.regular, fontSize: 16, color: cores.texto, alignSelf: 'flex-end', marginRight: espacamento.sm },
  erro: { fontFamily: fontes.media, color: cores.erro, textAlign: 'center' },
  rodape: { alignItems: 'center', gap: espacamento.md, marginTop: espacamento.lg, marginBottom: 80 },
  rodapeTexto: { fontFamily: fontes.regular, fontSize: 16, color: cores.texto },
});
