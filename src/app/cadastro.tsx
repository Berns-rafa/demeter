import { router } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { estilosAuth as styles } from '@/components/estilosAuth';
import { LOGO, ONDAS } from '@/components/ilustracoes';
import { Botao, Campo, Ilustracao, useLarguraTela } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

export default function CadastroScreen() {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const largura = useLarguraTela();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleCadastrar() {
    setErro(null);
    if (senha !== confirmar) {
      setErro('As senhas não conferem.');
      return;
    }
    setEnviando(true);
    try {
      await cadastrar(nome, email, senha);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível cadastrar.');
    } finally {
      setEnviando(false);
    }
  }

  function voltarAoLogin() {
    if (router.canGoBack()) router.back();
    else router.replace('/login');
  }

  return (
    <SafeAreaView style={styles.tela}>
      <Image source={ONDAS} style={styles.ondas} resizeMode="cover" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <View accessible accessibilityLabel="Deméter" style={styles.logoPequena}>
            <Ilustracao fonte={LOGO} largura={largura * 0.32} proporcao={420 / 366} />
          </View>
          <Text style={styles.titulo} accessibilityRole="header">
            Criar conta
          </Text>

          <Campo icone="user" placeholder="Nome" value={nome} onChangeText={setNome} autoComplete="name" accessibilityLabel="Nome" />
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
          <Campo icone="lock" senha placeholder="Senha" value={senha} onChangeText={setSenha} autoComplete="new-password" accessibilityLabel="Senha" />
          <Campo
            icone="lock"
            senha
            placeholder="Confirmar senha"
            value={confirmar}
            onChangeText={setConfirmar}
            accessibilityLabel="Confirmar senha"
            onSubmitEditing={handleCadastrar}
          />

          {erro && <Text style={styles.erro}>{erro}</Text>}
          <Botao titulo="Criar conta" seta onPress={handleCadastrar} carregando={enviando} />

          <View style={styles.rodape}>
            <Text style={styles.rodapeTexto}>Já tem uma conta?</Text>
            <Botao titulo="Entrar" variante="secundario" onPress={voltarAoLogin} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
