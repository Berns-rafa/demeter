import { useCallback, useEffect, useRef, useState } from 'react';

interface Resultado<T> {
  chave: string;
  dados?: T;
  erro: string | null;
}

/**
 * Carrega dados assíncronos com estados de loading/erro e função de recarregar.
 * Os dados são buscados de novo sempre que `chave` mudar (ex.: id, termo de busca).
 */
export function useCarregar<T>(buscar: () => Promise<T>, chave = '') {
  const [resultado, setResultado] = useState<Resultado<T> | null>(null);
  const [atualizando, setAtualizando] = useState(false);

  const buscarRef = useRef(buscar);
  const requisicaoAtual = useRef(0);

  useEffect(() => {
    buscarRef.current = buscar;
  });

  const executar = useCallback(async (c: string) => {
    const id = ++requisicaoAtual.current;
    try {
      const dados = await buscarRef.current();
      // Ignora respostas antigas (ex.: usuário digitou de novo na busca).
      if (id === requisicaoAtual.current) setResultado({ chave: c, dados, erro: null });
    } catch (e) {
      if (id === requisicaoAtual.current) {
        setResultado({ chave: c, erro: e instanceof Error ? e.message : 'Erro ao carregar.' });
      }
    }
  }, []);

  useEffect(() => {
    executar(chave);
  }, [chave, executar]);

  /** Para "puxar para atualizar". */
  const recarregar = useCallback(async () => {
    setAtualizando(true);
    await executar(chave);
    setAtualizando(false);
  }, [chave, executar]);

  return {
    dados: resultado?.dados,
    erro: resultado?.erro ?? null,
    carregando: atualizando || resultado?.chave !== chave,
    recarregar,
  };
}
