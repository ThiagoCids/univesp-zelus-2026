# 01 — Setup Inicial do Projeto ZELUS

**Data:** 2026-09-22
**Fase:** Inicialização / Scaffolding
**Responsável:** IA (Antigravity) + Equipe ZELUS

---

## 📌 Prompt Mestre Enviado pelo Usuário

> Contexto: Você é um Engenheiro de Software Sênior configurando a base de um novo projeto universitário chamado ZELUS (um sistema de zeladoria urbana para cidades inteligentes).
>
> **Diretrizes Rigorosas do Projeto:**
>
> - **Stack:** React, Node.js, JavaScript puro (sem TypeScript) e SCSS. Banco de dados será Supabase.
>
> - **Comentários Obrigatórios:** Absolutamente todo arquivo de código gerado deve conter comentários linha a linha ou bloco a bloco explicando a lógica em português simples, voltado para estudantes iniciantes de programação.
>
> - **Documentação:** Crie uma pasta /docs na raiz. Dentro dela, crie um arquivo LEIA-ME-ARQUITETURA.md explicando a estrutura de pastas e crie uma pasta /docs/prompts-ia/ vazia para histórico de geração.
>
> - **Arquitetura:** Crie dois diretórios base na raiz: /frontend e /backend. Dentro de /frontend, inicialize a estrutura de pastas modular (pages, components, services, styles).
>
> **Sua Tarefa Agora:**
> NÃO escreva códigos funcionais (lógica) ainda. Apenas inicialize o projeto (ex: package.json, pastas base, arquivos vazios iniciais e a documentação). Antes de executar a criação dos arquivos, me apresente o plano de estrutura de pastas exato que você vai gerar, passo a passo, e aguarde minha autorização para prosseguir.

---

## ✅ Plano Estrutural Aprovado pelo Usuário

O plano abaixo foi apresentado pela IA, revisado e aprovado pelo usuário em 2026-09-22.

### Stack Definida

| Camada   | Tecnologia                          |
|----------|-------------------------------------|
| Frontend | React + SCSS (JS puro, sem TS)      |
| Backend  | Node.js + Express (JS puro, sem TS) |
| Banco    | Supabase (PostgreSQL gerenciado)    |
| Docs     | Markdown                            |

---

### Árvore de Pastas Gerada

```
univesp-zelus-2026/
│
├── package.json                        ← raiz (workspace scripts)
│
├── docs/
│   ├── LEIA-ME-ARQUITETURA.md         ← documentação da estrutura
│   └── prompts-ia/
│       ├── .gitkeep
│       └── 01-setup-inicial.md        ← este arquivo
│
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── src/
│       ├── server.js
│       ├── config/          (.gitkeep)
│       ├── routes/          (.gitkeep)
│       ├── controllers/     (.gitkeep)
│       ├── services/        (.gitkeep)
│       └── middlewares/     (.gitkeep)
│
└── frontend/
    ├── package.json
    ├── .env.example
    ├── .gitignore
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.js
        ├── pages/           (.gitkeep)
        ├── components/      (.gitkeep)
        ├── services/        (.gitkeep)
        └── styles/
            ├── global.scss
            └── _variables.scss
```

---

### Descrição de cada artefato criado

| Arquivo / Pasta | Finalidade |
|---|---|
| `package.json` (raiz) | Scripts globais para rodar frontend e backend juntos |
| `docs/LEIA-ME-ARQUITETURA.md` | Documentação principal da estrutura, em português didático |
| `docs/prompts-ia/` | Histórico de todos os prompts usados na geração via IA |
| `backend/package.json` | Configuração do projeto Node.js/Express |
| `backend/.env.example` | Modelo de variáveis de ambiente do servidor |
| `backend/.gitignore` | Arquivos ignorados pelo Git no backend |
| `backend/src/server.js` | Ponto de entrada do servidor (esqueleto comentado) |
| `backend/src/config/` | Configuração do cliente Supabase e globals |
| `backend/src/routes/` | Rotas da API REST |
| `backend/src/controllers/` | Funções que tratam as requisições HTTP |
| `backend/src/services/` | Lógica de negócios e chamadas ao banco |
| `backend/src/middlewares/` | Autenticação, tratamento de erros, etc. |
| `frontend/package.json` | Configuração do projeto React |
| `frontend/.env.example` | Modelo de variáveis de ambiente do frontend |
| `frontend/.gitignore` | Arquivos ignorados pelo Git no frontend |
| `frontend/public/index.html` | HTML base com `<div id="root">` |
| `frontend/src/index.js` | Ponto de entrada do React |
| `frontend/src/App.js` | Componente raiz da aplicação |
| `frontend/src/pages/` | Páginas da aplicação (HomePage, OcorrenciasPage, etc.) |
| `frontend/src/components/` | Componentes reutilizáveis (Botao, Mapa, etc.) |
| `frontend/src/services/` | Comunicação com API e Supabase |
| `frontend/src/styles/global.scss` | Reset CSS e estilos globais |
| `frontend/src/styles/_variables.scss` | Variáveis de design (cores, fontes, espaçamentos) |

---

## 📎 Observações de Execução

- Nenhum código funcional (lógica) foi gerado nesta etapa.
- Todos os arquivos `.js` e `.scss` contêm apenas comentários explicativos em português.
- Pastas vazias foram preservadas com arquivos `.gitkeep` para rastreamento pelo Git.
- O próximo passo será a instalação de dependências e a criação dos primeiros componentes funcionais.
