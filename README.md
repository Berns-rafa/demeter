# Deméter

Aplicativo para pessoas com **restrições alimentares** (doença celíaca, intolerância à lactose, veganismo e outras). Reúne receitas adequadas a cada perfil e um canal de notícias com **conhecimento verificado**, em que toda notícia mostra a fonte original para o leitor conferir.

🌐 **Versão web:** https://demeter-app-sigma.vercel.app

## Funcionalidades

- **Início:** acesso rápido a receitas e novidades.
- **Notícias:** filtros por categoria (Nutrição, Saúde, Alimentação) e busca. Cada notícia exibe a **fonte** (instituição, documento, ano e link).
- **Receitas:** filtros (Sem glúten, Sem lactose, Veganas) e busca. A lista respeita as restrições cadastradas no perfil.
- **Detalhe da receita:** tempo, porções, dificuldade, ingredientes, modo de preparo e **favoritar**.
- **Conta:** login e cadastro com e-mail e senha, recuperação de senha, dados pessoais, restrições alimentares, notificações e privacidade.

## Tecnologias

- [Expo](https://expo.dev) (SDK 58) + React Native + TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) para a navegação (rotas em `src/app/`)
- [Firebase](https://firebase.google.com): Authentication (login) e Cloud Firestore (perfis, notícias e receitas)
- [Vercel](https://vercel.com) para a versão web

## Como rodar na sua máquina

Pré-requisitos: [Node.js](https://nodejs.org) (versão LTS) e, para testar no celular, o app **Expo Go** ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)).

```bash
npm install
npx expo start
```

Depois:

- **No celular:** abra o Expo Go e escaneie o QR code (no iPhone, pela câmera). O celular precisa estar no mesmo Wi-Fi do computador.
- **No navegador:** aperte `w` no terminal.
- **No emulador Android:** aperte `a` (precisa do Android Studio).

### Conectar ao Firebase (opcional)

Sem configuração, o app roda em **modo local**: usa conteúdo de exemplo e guarda o login só no aparelho. Para usar o Firebase:

1. Copie `.env.example` para `.env.local`.
2. Preencha com os dados do app Web do seu projeto Firebase (Console do Firebase → Configurações do projeto → Seus apps).
3. Reinicie o `npx expo start`.

O `.env.local` não vai para o repositório.

## Comandos úteis

```bash
npx expo start      # inicia o app em modo de desenvolvimento
npx expo lint       # verifica o código (lint)
npx tsc --noEmit    # verifica os tipos (TypeScript)
npx vercel --prod   # publica a versão web na Vercel
```

## Estrutura do projeto

```
src/
├── app/            # telas e navegação (Expo Router)
│   ├── (app)/      # área logada: abas (Início, Notícias, Receitas, Conta) e telas internas
│   ├── login.tsx
│   └── cadastro.tsx
├── components/     # componentes visuais do Deméter (botões, cards, etiquetas…)
├── contexts/       # autenticação e perfil do usuário
├── services/       # Firebase, acesso a dados e conteúdo local
├── theme/          # cores, fontes e espaçamentos do design
└── types/          # tipos TypeScript
assets/demeter/     # logo e ilustrações do design aprovado
```

## Observações

- A publicação de notícias e receitas é feita por uma ferramenta administrativa separada, que não faz parte deste repositório.
- As notícias usam apenas informações das fontes citadas e não substituem a orientação de profissionais de saúde.
- A primeira versão do projeto, um protótipo feito em Vite, continua disponível no histórico do repositório.
