/**
 * Componentes visuais do Deméter, baseados nas telas aprovadas
 * (Demeter_Kit_Design). Use estes blocos em vez de estilizar do zero.
 */
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, type ComponentProps, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { cores, espacamento, fontes, raio, sombra } from '@/theme';

export type IconeFeather = ComponentProps<typeof Feather>['name'];
export type IconeMCI = ComponentProps<typeof MaterialCommunityIcons>['name'];

/* ---------------------------------------------------------- Ilustrações */

/** Largura útil da tela (descontando o padding lateral de cada lado). */
export function useLarguraTela(paddingLateral = 0) {
  return useWindowDimensions().width - paddingLateral * 2;
}

/**
 * Imagem com tamanho explícito (largura × largura/proporção).
 * Evita depender de `aspectRatio`, que se comporta diferente entre web e nativo.
 */
export function Ilustracao({
  fonte,
  largura,
  proporcao,
  modo = 'contain',
  estilo,
}: {
  fonte: ImageSourcePropType;
  largura: number;
  /** largura / altura do arquivo original. */
  proporcao: number;
  modo?: 'contain' | 'cover';
  estilo?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={fonte}
      style={[{ width: largura, height: largura / proporcao }, estilo]}
      resizeMode={modo}
      accessibilityIgnoresInvertColors
    />
  );
}

/* ---------------------------------------------------------------- Botões */

export function Botao({
  titulo,
  onPress,
  variante = 'primario',
  icone,
  seta = false,
  carregando = false,
  desabilitado = false,
  estilo,
}: {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'perigo';
  /** Ícone à esquerda do texto (ex.: talheres em "Explorar receitas"). */
  icone?: IconeMCI;
  /** Seta → à direita do texto. */
  seta?: boolean;
  carregando?: boolean;
  desabilitado?: boolean;
  estilo?: StyleProp<ViewStyle>;
}) {
  const primario = variante === 'primario';
  const corTexto = primario ? cores.branco : variante === 'perigo' ? cores.erro : cores.texto;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      onPress={onPress}
      disabled={carregando || desabilitado}
      style={({ pressed }) => [
        styles.botao,
        primario ? styles.botaoPrimario : styles.botaoSecundario,
        (pressed || desabilitado) && { opacity: 0.75 },
        estilo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <>
          {icone && <MaterialCommunityIcons name={icone} size={30} color={corTexto} style={styles.botaoIcone} />}
          <Text style={[styles.botaoTexto, { color: corTexto }, !primario && styles.botaoTextoSecundario]}>{titulo}</Text>
          {seta && <Feather name="arrow-right" size={24} color={corTexto} style={icone ? styles.botaoSetaFim : styles.botaoSeta} />}
        </>
      )}
    </Pressable>
  );
}

/** Botão redondo claro com sombra (busca, perfil, voltar, favoritar). */
export function BotaoCircular({
  icone,
  onPress,
  rotulo,
  tamanho = 52,
  corIcone = cores.texto,
  estilo,
}: {
  icone: IconeFeather;
  onPress: () => void;
  rotulo: string;
  tamanho?: number;
  corIcone?: string;
  estilo?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.circular,
        { width: tamanho, height: tamanho, borderRadius: tamanho / 2 },
        pressed && { opacity: 0.8 },
        estilo,
      ]}
    >
      <Feather name={icone} size={tamanho * 0.46} color={corIcone} />
    </Pressable>
  );
}

/** Círculo marrom com seta → (cards em destaque). */
export function BotaoSeta({ onPress, tamanho = 46 }: { onPress?: () => void; tamanho?: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Abrir"
      onPress={onPress}
      disabled={!onPress}
      style={[styles.seta, { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }]}
    >
      <Feather name="arrow-right" size={tamanho * 0.5} color={cores.branco} />
    </Pressable>
  );
}

/* ---------------------------------------------------------------- Campos */

export function Campo({
  icone,
  senha = false,
  rotulo,
  ...props
}: TextInputProps & { icone?: IconeFeather; senha?: boolean; rotulo?: string }) {
  const [visivel, setVisivel] = useState(false);
  return (
    <View style={{ gap: espacamento.xs }}>
      {rotulo && <Text style={styles.rotulo}>{rotulo}</Text>}
      <View style={[styles.campo, props.editable === false && { opacity: 0.6 }]}>
        {icone && <Feather name={icone} size={24} color={cores.texto} />}
        <TextInput
          placeholderTextColor={cores.textoSecundario}
          style={styles.campoInput}
          secureTextEntry={senha && !visivel}
          {...props}
        />
        {senha && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visivel ? 'Ocultar senha' : 'Exibir senha'}
            onPress={() => setVisivel((v) => !v)}
            hitSlop={10}
          >
            <Feather name={visivel ? 'eye-off' : 'eye'} size={22} color={cores.texto} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

/* ---------------------------------------------------- Chips e etiquetas */

/** Filtro em pílula (Todas / Nutrição / Sem glúten...). */
export function Chip({ texto, ativo, onPress }: { texto: string; ativo?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: ativo }}
      style={[styles.chip, ativo && styles.chipAtivo]}
    >
      <Text style={[styles.chipTexto, ativo && { color: cores.branco }]}>{texto}</Text>
    </Pressable>
  );
}

const CORES_ETIQUETA = {
  pessego: { fundo: cores.pessego, texto: cores.texto },
  verde: { fundo: cores.verde, texto: cores.verdeTexto },
  claro: { fundo: cores.superficie, texto: cores.texto },
  marrom: { fundo: cores.primaria, texto: cores.branco },
};

/** Etiqueta com ícone ("Sem glúten", "30 min", "Fácil"...). */
export function Etiqueta({
  texto,
  icone,
  cor = 'pessego',
  tamanho = 'p',
  onPress,
}: {
  texto: string;
  icone?: IconeMCI;
  cor?: keyof typeof CORES_ETIQUETA;
  tamanho?: 'p' | 'm' | 'g';
  onPress?: () => void;
}) {
  const c = CORES_ETIQUETA[cor];
  const t = TAMANHOS_ETIQUETA[tamanho];
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={[styles.etiqueta, { backgroundColor: c.fundo, paddingVertical: t.pv, paddingHorizontal: t.ph }, cor === 'claro' && sombra]}
    >
      {icone && <MaterialCommunityIcons name={icone} size={t.icone} color={c.texto} />}
      <Text style={[styles.etiquetaTexto, { color: c.texto, fontSize: t.fonte }]} numberOfLines={1}>
        {texto}
      </Text>
    </Pressable>
  );
}

const TAMANHOS_ETIQUETA = {
  p: { pv: 4, ph: 10, icone: 15, fonte: 12 },
  m: { pv: 7, ph: 14, icone: 20, fonte: 15 },
  g: { pv: 10, ph: 16, icone: 24, fonte: 17 },
};

/** Selo de categoria em caixa alta ("ALIMENTAÇÃO", "RECEITA EM DESTAQUE"). */
export function Selo({ texto }: { texto: string }) {
  return (
    <View style={styles.selo}>
      <Text style={styles.seloTexto}>{texto.toUpperCase()}</Text>
    </View>
  );
}

/* --------------------------------------------------------- Estruturas */

export function Cartao({
  children,
  onPress,
  estilo,
}: {
  children: ReactNode;
  onPress?: () => void;
  estilo?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.cartao, pressed && { opacity: 0.85 }, estilo]}
    >
      {children}
    </Pressable>
  );
}

/** Título grande centralizado com botão circular opcional à direita (Notícias, Receitas, Conta). */
export function CabecalhoTela({
  titulo,
  acao,
}: {
  titulo: string;
  acao?: { icone: IconeFeather; rotulo: string; onPress: () => void };
}) {
  return (
    <View style={styles.cabecalho}>
      <Text style={styles.cabecalhoTitulo} accessibilityRole="header">
        {titulo}
      </Text>
      {acao && <BotaoCircular icone={acao.icone} rotulo={acao.rotulo} onPress={acao.onPress} estilo={styles.cabecalhoAcao} />}
    </View>
  );
}

/** Cabeçalho das telas internas: voltar + título. */
export function CabecalhoVoltar({ titulo, direita }: { titulo?: string; direita?: ReactNode }) {
  return (
    <View style={styles.voltar}>
      <BotaoCircular icone="arrow-left" rotulo="Voltar" onPress={() => router.back()} />
      {titulo ? (
        <Text style={styles.voltarTitulo} numberOfLines={1} accessibilityRole="header">
          {titulo}
        </Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}
      {direita ?? <View style={{ width: 52 }} />}
    </View>
  );
}

export function TituloSecao({ children }: { children: string }) {
  return <Text style={styles.tituloSecao}>{children}</Text>;
}

export function Carregando() {
  return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color={cores.primaria} />
    </View>
  );
}

export function Vazio({ texto }: { texto: string }) {
  return (
    <View style={styles.centro}>
      <Text style={styles.vazio}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  botao: {
    minHeight: 64,
    borderRadius: raio.pilula,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: espacamento.lg,
  },
  botaoPrimario: { backgroundColor: cores.primaria },
  botaoSecundario: { backgroundColor: cores.pessego, minHeight: 48, alignSelf: 'center', paddingHorizontal: espacamento.xl },
  botaoTexto: { fontFamily: fontes.negrito, fontSize: 20 },
  botaoTextoSecundario: { fontSize: 18 },
  botaoIcone: { position: 'absolute', left: 28 },
  botaoSeta: { marginLeft: 14 },
  botaoSetaFim: { position: 'absolute', right: 28 },
  circular: { backgroundColor: cores.superficie, alignItems: 'center', justifyContent: 'center', ...sombra },
  seta: { backgroundColor: cores.primaria, alignItems: 'center', justifyContent: 'center' },
  rotulo: { fontFamily: fontes.semi, fontSize: 14, color: cores.texto, marginLeft: espacamento.md },
  campo: {
    minHeight: 60,
    borderRadius: raio.pilula,
    backgroundColor: cores.superficie,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamento.md,
    paddingHorizontal: espacamento.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    ...sombra,
  },
  campoInput: { flex: 1, minWidth: 0, fontFamily: fontes.regular, fontSize: 17, color: cores.texto, paddingVertical: 14 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: raio.pilula,
    backgroundColor: cores.superficie,
    ...sombra,
  },
  chipAtivo: { backgroundColor: cores.primaria },
  chipTexto: { fontFamily: fontes.media, fontSize: 15, color: cores.texto },
  etiqueta: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: raio.pilula, alignSelf: 'flex-start', maxWidth: '100%' },
  etiquetaTexto: { fontFamily: fontes.media, flexShrink: 1 },
  selo: {
    backgroundColor: cores.pessego,
    borderRadius: raio.pilula,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  seloTexto: { fontFamily: fontes.semi, fontSize: 11, letterSpacing: 0.3, color: cores.texto },
  cartao: { backgroundColor: cores.superficie, borderRadius: raio.lg, overflow: 'hidden', ...sombra },
  cabecalho: { alignItems: 'center', justifyContent: 'center', minHeight: 64, marginTop: espacamento.sm },
  cabecalhoTitulo: { fontFamily: fontes.extra, fontSize: 38, color: cores.texto, letterSpacing: -0.5 },
  cabecalhoAcao: { position: 'absolute', right: 0 },
  voltar: { flexDirection: 'row', alignItems: 'center', gap: espacamento.md, marginTop: espacamento.sm },
  voltarTitulo: { flex: 1, textAlign: 'center', fontFamily: fontes.extra, fontSize: 24, color: cores.texto },
  tituloSecao: { fontFamily: fontes.extra, fontSize: 24, color: cores.texto, letterSpacing: -0.3 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: espacamento.lg, backgroundColor: cores.fundo },
  vazio: { fontFamily: fontes.media, color: cores.textoSecundario, textAlign: 'center', fontSize: 15 },
});
