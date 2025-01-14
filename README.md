# 🎮 Cursor Chase

Um jogo desafiador onde você precisa fugir do perseguidor usando seu cursor. Quanto mais tempo sobreviver, maior sua pontuação!

## 🎯 Como Jogar

1. Digite seu nickname na tela inicial
2. Use o mouse para fugir do círculo branco perseguidor
3. O perseguidor aumenta de velocidade com o tempo
4. Sua pontuação aumenta a cada segundo que você sobrevive
5. Quando for pego, seu score é salvo no ranking global

## 🚀 Tecnologias

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Jotai (Gerenciamento de Estado)

- **Backend:**
  - Supabase (Banco de dados e API)

## 🎮 Funcionalidades

- Sistema de pontuação em tempo real
- Dificuldade progressiva (referência em `src/App.tsx`, linhas 48-56)
- Leaderboard global com top 10 jogadores
- Design minimalista e responsivo
- Persistência do nome do jogador
- Sistema de ranking global

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js
- npm/pnpm
- Conta no Supabase

### Configuração

1. Clone o repositório
```bash
https://github.com/LuizHGodoy/cursor-chase.git
```
```bash
npm install
```

3. Configure as variáveis de ambiente

.env
```bash
VITE_SUPABASE_URL=sua_url
VITE_SUPABASE_ANON_KEY=sua_chave
```

4. Rode o projeto

```bash
npm run dev
```


## 📝 Estrutura do Projeto

- `src/components/`: Componentes React
- `src/store/`: Gerenciamento de estado com Jotai
- `src/services/`: Serviços de API
- `src/lib/`: Configurações e utilitários

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 📄 Licença

Este projeto está sob a licença MIT.
