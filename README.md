# 🥋 BJJ Performance Logger & Ecossistema de Performance

Este é um ecossistema avançado de monitoramento tático, análise de performance e registros de sparring para praticantes de **Jiu-Jitsu brasileiro (BJJ)**. 

Desenvolvido para oferecer um controle completo na ponta dos dedos, o aplicativo conta com análises de maestria de combate, acompanhamento de janelas de execução, registro de rascunhos de Game Plan (Arsenal, Matriz Condicional, Escapadas Críticas) e suporte a sincronização offline completa por padrão.

---

## 🚀 Como gerar e baixar o seu APK pelo GitHub

Para facilitar o processo de instalação e testes, o repositório já está configurado com um pipeline automatizado que compila e gera um **aplicativo Android (.APK)** limpo e pronto para o seu celular.

Siga os passos rápidos abaixo para baixar o app:

1. **Publique para seu repositório no GitHub** usando a opção de Exportar na interface do Google AI Studio.
2. No seu repositório no GitHub, clique na aba **`Actions`** (no menu superior, ao lado de Pull Requests).
3. Na barra lateral esquerda de fluxos, selecione o workflow **`Build Android APK`**.
4. Se quiser forçar uma compilação manual imediatamente, clique no botão cinza **`Run workflow`** à direita da tela.
5. Assim que a build terminar (cerca de 2 a 3 minutos), clique nos detalhes da execução finalizada.
6. Na seção **`Artifacts`** (no fim da página da build), você verá o link para download de **`bjj-performance-logger-apk`**.
7. Baixe o arquivo ZIP, descompacte-o e instale o arquivo **`app-debug.apk`** diretamente no seu dispositivo Android!

---

## 📱 Recursos Mobile & Suporte PWA (Progressive Web App)

O ecossistema foi projetado de forma híbrida:
- **Suporte Offline Blindado**: Funciona offline através de caching inteligente de rotas com Service Workers (`/sw.js`). Suas táticas permanecem salvas localmente no localStorage.
- **Suplementação nativa (Capacitor)**: Embalado com CapacitorJS, o aplicativo é redimensionado perfeitamente para celular Android, escondendo barras de navegação externas do browser e otimizando o toque físico.

---

## 🛠️ Como rodar o projeto localmente no seu computador

Se preferir rodar em modo desenvolvedor localmente ou continuar editando em sua máquina:

### Pré-requisitos
- Node.js (v18+)
- npm instalado

### Passos para execução
1. Clone o repositório em seu terminal:
   ```bash
   git clone <link-do-seu-repositorio>
   cd <nome-do-repositorio>
   ```

2. Instale todas as dependências nativas e de desenvolvimento:
   ```bash
   npm install
   ```

3. Suba o servidor de desenvolvimento local com hot-reload automático:
   ```bash
   npm run dev
   ```

4. Para criar uma versão estática otimizada de produção:
   ```bash
   npm run build
   ```

5. Para sincronizar as alterações e testar os arquivos compilados com o emulador Android (requer Android Studio instalado localmente):
   ```bash
   npm run build:android
   npx cap open android
   ```

---

*Ecossistema desenvolvido e otimizado com foco em alta performance competitiva. Guarde seus backups e lute sempre sob regras táticas de excelência.*
nada
