# ZELUS — Sistema de Zeladoria Urbana para Cidades Inteligentes
# Documentação da Arquitetura do Projeto
# =========================================
# Este documento explica, em linguagem simples e didática,
# como o projeto está organizado em pastas e arquivos.
# Destinado a estudantes iniciantes de programação.

# LEIA-ME — Arquitetura do Projeto ZELUS

## O que é o ZELUS?

O **ZELUS** é um sistema web desenvolvido como projeto universitário pela UNIVESP.
Seu objetivo é ajudar cidades a gerenciar ocorrências de zeladoria urbana
(buracos em ruas, iluminação pública com defeito, entulho irregular, etc.)
de forma colaborativa e inteligente.

---

## Stack Tecnológica

| Camada     | Tecnologia                         | Por quê?                                      |
|------------|------------------------------------|-----------------------------------------------|
| Frontend   | React + SCSS (JavaScript puro)     | Interface moderna, reativa e componentizada   |
| Backend    | Node.js + Express (JavaScript)     | API REST leve, mesma linguagem no servidor    |
| Banco      | Supabase (PostgreSQL)              | Banco gerenciado com autenticação embutida    |

> ⚠️ **Sem TypeScript:** O projeto usa JavaScript puro intencionalmente para ser mais acessível a estudantes iniciantes.

---

## Estrutura de Pastas

```
univesp-zelus-2026/         ← Raiz do projeto (este repositório)
│
├── package.json            ← Scripts globais para rodar o projeto completo
│
├── docs/                   ← Toda a documentação do projeto
│   ├── LEIA-ME-ARQUITETURA.md   ← Este arquivo
│   └── prompts-ia/         ← Histórico de prompts usados com IA para gerar código
│       └── 01-setup-inicial.md
│
├── backend/                ← Servidor Node.js (a "cozinha" da aplicação)
│   ├── package.json        ← Dependências e scripts do servidor
│   ├── .env.example        ← Modelo das variáveis de ambiente (configure o .env local)
│   ├── .gitignore          ← Arquivos que o Git deve ignorar
│   └── src/                ← Código-fonte do backend
│       ├── server.js       ← Ponto de entrada: inicializa o servidor Express
│       ├── config/         ← Configurações globais (conexão com Supabase, etc.)
│       ├── routes/         ← Define os endereços (URLs) da API
│       ├── controllers/    ← Funções que respondem às requisições HTTP
│       ├── services/       ← Regras de negócio e acesso ao banco de dados
│       └── middlewares/    ← Funções intermediárias (autenticação, logs, erros)
│
└── frontend/               ← Aplicação React (o que o usuário vê no navegador)
    ├── package.json        ← Dependências e scripts do frontend
    ├── .env.example        ← Variáveis públicas do frontend (URL do Supabase, etc.)
    ├── .gitignore          ← Arquivos que o Git deve ignorar
    ├── public/             ← Arquivos estáticos públicos
    │   └── index.html      ← HTML base; o React é injetado dentro dele
    └── src/                ← Código-fonte do frontend
        ├── index.js        ← Ponto de entrada: conecta o React ao HTML
        ├── App.js          ← Componente raiz que organiza as rotas e o layout geral
        ├── pages/          ← Páginas completas (ex: HomePage, OcorrenciasPage)
        ├── components/     ← Peças reutilizáveis da interface (ex: Botao, Mapa)
        ├── services/       ← Funções de comunicação com o backend e Supabase
        └── styles/         ← Arquivos SCSS de estilo visual
            ├── global.scss      ← Estilos globais aplicados em toda a aplicação
            └── _variables.scss  ← Variáveis de design (cores, fontes, tamanhos)
```

---

## Como as partes se comunicam?

```
[Usuário no Navegador]
        │
        ▼
[Frontend — React]  ←── faz chamadas HTTP (fetch/axios) ──►  [Backend — Node.js/Express]
                                                                      │
                                                                      ▼
                                                              [Supabase — PostgreSQL]
```

1. O **usuário** interage com a interface feita em React.
2. O **frontend** envia requisições HTTP para a API do backend.
3. O **backend** valida, processa e consulta o **Supabase** (banco de dados).
4. O Supabase retorna os dados; o backend responde ao frontend; o frontend exibe ao usuário.

---

## Convenções de Nomenclatura

| Tipo             | Convenção         | Exemplo                    |
|------------------|-------------------|----------------------------|
| Componentes React| PascalCase        | `MapaOcorrencias.js`       |
| Páginas          | PascalCase + Page | `HomePage.js`              |
| Serviços         | camelCase         | `ocorrenciasService.js`    |
| Rotas (backend)  | kebab-case        | `ocorrencias.routes.js`    |
| Estilos SCSS     | kebab-case        | `_mapa-ocorrencias.scss`   |
| Variáveis JS     | camelCase         | `listaDeOcorrencias`       |
| Constantes JS    | UPPER_SNAKE_CASE  | `URL_API_BASE`             |

---

## Próximos Passos (Roadmap Inicial)

- [ ] Instalar dependências do backend (`express`, `dotenv`, `@supabase/supabase-js`)
- [ ] Instalar dependências do frontend (`react`, `react-dom`, `sass`, `react-router-dom`)
- [ ] Configurar cliente Supabase no backend (`src/config/supabase.js`)
- [ ] Criar a primeira rota da API (`/api/ocorrencias`)
- [ ] Criar a primeira página do frontend (`HomePage`)
- [ ] Configurar variáveis de ambiente locais (`.env` baseado no `.env.example`)

---

*Documentação mantida pela equipe ZELUS — UNIVESP 2026*
