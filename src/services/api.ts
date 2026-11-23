/**
 * Camada de dados do app. As telas só usam estas funções.
 *
 * - Com Firebase configurado: lê as coleções `noticias` e `receitas` do Firestore
 *   (somente documentos com `publicada: true`). Conteúdo novo é lançado pelo
 *   Console do Firebase ou pelo painel do site — sem alterar o código do app.
 * - Sem Firebase: usa o conteúdo local de src/services/dadosLocais.ts.
 */
import { collection, doc, getDoc, getDocs, query, where, type DocumentData } from 'firebase/firestore';

import { NOTICIAS_LOCAIS, RECEITAS_LOCAIS } from '@/services/dadosLocais';
import { fb } from '@/services/firebase';
import type { CategoriaNoticia, Noticia, Receita, RestricaoAlimentar } from '@/types';

/* ------------------------------------------------------------ Firestore */

/** Converte Timestamp do Firestore (ou string) para ISO. */
function paraIso(valor: unknown): string {
  if (valor && typeof valor === 'object' && 'toDate' in valor && typeof valor.toDate === 'function') {
    return (valor.toDate() as Date).toISOString();
  }
  return typeof valor === 'string' ? valor : new Date(0).toISOString();
}

function paraNoticia(id: string, d: DocumentData): Noticia {
  return {
    id,
    titulo: d.titulo ?? '',
    resumo: d.resumo ?? '',
    conteudo: d.conteudo ?? '',
    fonte: d.fonte,
    ilustracao: d.ilustracao,
    imagemUrl: d.imagemUrl,
    dataPublicacao: paraIso(d.dataPublicacao),
    categoria: d.categoria,
    destaque: d.destaque === true,
    restricoes: d.restricoes ?? [],
  };
}

function paraReceita(id: string, d: DocumentData): Receita {
  return {
    id,
    titulo: d.titulo ?? '',
    descricao: d.descricao ?? '',
    ilustracao: d.ilustracao,
    imagemUrl: d.imagemUrl,
    tempoPreparoMin: d.tempoPreparoMin ?? 0,
    porcoes: d.porcoes ?? 1,
    dificuldade: d.dificuldade ?? 'Fácil',
    destaque: d.destaque === true,
    ingredientes: d.ingredientes ?? [],
    modoPreparo: d.modoPreparo ?? [],
    etiquetas: d.etiquetas,
    livreDe: d.livreDe ?? [],
  };
}

async function buscarPublicados<T>(colecao: string, converter: (id: string, d: DocumentData) => T): Promise<T[]> {
  if (!fb) throw new Error('Firebase não configurado.');
  // O filtro `publicada == true` é exigido pelas regras de segurança (firestore.rules).
  const snap = await getDocs(query(collection(fb.db, colecao), where('publicada', '==', true)));
  return snap.docs.map((s) => converter(s.id, s.data()));
}

async function buscarUm<T>(colecao: string, id: string, converter: (id: string, d: DocumentData) => T) {
  if (!fb) throw new Error('Firebase não configurado.');
  try {
    const snap = await getDoc(doc(fb.db, colecao, id));
    return snap.exists() && snap.data().publicada === true ? converter(snap.id, snap.data()) : undefined;
  } catch {
    // Documento não publicado é bloqueado pelas regras: trata como "não encontrado".
    return undefined;
  }
}

/* ------------------------------------------------------------- Notícias */

export interface FiltroNoticias {
  busca?: string;
  categoria?: CategoriaNoticia;
}

export async function listarNoticias(filtro: FiltroNoticias = {}): Promise<Noticia[]> {
  const todas = fb ? await buscarPublicados('noticias', paraNoticia) : NOTICIAS_LOCAIS;
  const busca = filtro.busca?.trim().toLowerCase();
  return todas
    .filter((n) => {
      if (filtro.categoria && n.categoria !== filtro.categoria) return false;
      if (busca && !`${n.titulo} ${n.resumo}`.toLowerCase().includes(busca)) return false;
      return true;
    })
    .sort((a, b) => b.dataPublicacao.localeCompare(a.dataPublicacao));
}

export async function obterNoticia(id: string): Promise<Noticia | undefined> {
  return fb ? buscarUm('noticias', id, paraNoticia) : NOTICIAS_LOCAIS.find((n) => n.id === id);
}

/* ------------------------------------------------------------- Receitas */

export interface FiltroReceitas {
  busca?: string;
  /** Retorna só receitas livres de TODAS estas restrições. */
  livreDe?: RestricaoAlimentar[];
}

export async function listarReceitas(filtro: FiltroReceitas = {}): Promise<Receita[]> {
  const todas = fb ? await buscarPublicados('receitas', paraReceita) : RECEITAS_LOCAIS;
  const busca = filtro.busca?.trim().toLowerCase();
  return todas.filter((r) => {
    if (busca && !r.titulo.toLowerCase().includes(busca)) return false;
    if (filtro.livreDe?.length && !filtro.livreDe.every((x) => r.livreDe.includes(x))) return false;
    return true;
  });
}

export async function obterReceita(id: string): Promise<Receita | undefined> {
  return fb ? buscarUm('receitas', id, paraReceita) : RECEITAS_LOCAIS.find((r) => r.id === id);
}
