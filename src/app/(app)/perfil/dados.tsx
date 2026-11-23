import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { TelaInterna } from '@/components/TelaInterna';
import { Botao, Campo } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { cores, fontes } from '@/theme';

export default function MeusDadosScreen() {
  const { usuario, atualizarUsuario } = useAuth();
  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  if (!usuario) return null;

  async function salvar() {
    if (!nome.trim()) {
      setErro('O nome não pode ficar vazio.');
      return;
    }
    setErro(null);
    setSalvando(true);
    try {
      await atualizarUsuario({ nome: nome.trim() });
      router.back();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <TelaInterna titulo="Meus dados">
      <Campo rotulo="Nome" icone="user" value={nome} onChangeText={setNome} autoComplete="name" placeholder="Seu nome" />
      <Campo rotulo="E-mail" icone="mail" value={usuario.email} editable={false} />
      {erro && <Text style={styles.erro}>{erro}</Text>}
      <Botao titulo="Salvar alterações" onPress={salvar} carregando={salvando} desabilitado={nome.trim() === usuario.nome} />
    </TelaInterna>
  );
}

const styles = StyleSheet.create({
  erro: { fontFamily: fontes.media, color: cores.erro, textAlign: 'center' },
});
