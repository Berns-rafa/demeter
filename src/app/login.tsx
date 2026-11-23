import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { estilosAuth as styles } from '@/components/estilosAuth';
import { LOGO, ONDAS } from '@/components/ilustracoes';
import { Botao, Campo, Ilustracao, useLarguraTela } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { entrar, recuperarSenha } = useAuth();
  const largura = useLarguraTela();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleEntrar() {
    setErro(null);
    setEnviando(true);
    try {
      await entrar(email, senha);
      // O redirecionamento para a Home é automático (Stack.Protected no _layout raiz).
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  }

  async function esqueceuSenha() {
    let msg: string;
    try {
      await recuperarSenha(email);
      msg = `Enviamos um link para redefinir sua senha para ${email.trim()}.`;
    } catch (e) {
      msg = e instanceof Error ? e.message : 'Não foi possível enviar o e-mail.';
    }
    if (Platform.OS === 'web') globalThis.alert?.(msg);
    else Alert.alert('Recuperar senha', msg);
  }

  return (
    <SafeAreaView style={styles.tela}>
      <Image source={ONDAS} style={styles.ondas} resizeMode="cover" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <View accessible accessibilityLabel="Deméter" style={styles.logo}>
            <Ilustracao fonte={LOGO} largura={largura * 0.55} proporcao={420 / 366} />
          </View>

          <Campo
            icone="mail"
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            accessibilityLabel="E-mail"
          />
          <Campo
            icone="lock"
            senha
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            autoComplete="password"
            accessibilityLabel="Senha"
            onSubmitEditing={handleEntrar}
          />
          <Text style={styles.esqueceu} onPress={esqueceuSenha} accessibilityRole="link">
            Esqueceu sua senha?
          </Text>

          {erro && <Text style={styles.erro}>{erro}</Text>}
          <Botao titulo="Entrar" seta onPress={handleEntrar} carregando={enviando} />

          <View style={styles.rodape}>
            <Text style={styles.rodapeTexto}>Ainda não tem uma conta?</Text>
            <Botao titulo="Criar conta" variante="secundario" onPress={() => router.push('/cadastro')} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
