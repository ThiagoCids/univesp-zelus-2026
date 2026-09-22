# 02 — Instalação de Dependências do Projeto ZELUS

**Data:** 2026-09-22
**Fase:** Inicialização de Pacotes
**Responsável:** IA (Antigravity) + Equipe ZELUS

---

## 📌 Instrução Enviada pelo Usuário

> A estrutura de pastas foi validada. Agora, inicialize os pacotes. Por favor, crie o plano para instalar as dependências base do React dentro da pasta /frontend e as dependências essenciais do Node.js (express, cors, dotenv) na pasta /backend. Apresente-me o plano de instalação e os comandos antes de executar.

---

## ✅ Plano de Instalação Aprovado pelo Usuário

O plano abaixo foi apresentado pela IA, revisado e aprovado pelo usuário em 2026-09-22.

> As dependências foram instaladas **em sequência** (backend → frontend), pois o frontend (`react-scripts`) tem um volume de download significativamente maior.

---

## Pacotes Instalados

### Backend — `/backend`

| Pacote | Tipo | Para que serve |
|---|---|---|
| `express` `^4.18.2` | `dependency` | Framework web que cria o servidor HTTP e gerencia as rotas da API |
| `cors` `^2.8.5` | `dependency` | Permite que o frontend (porta 3000) acesse o backend (porta 3001) sem erro de segurança |
| `dotenv` `^16.3.1` | `dependency` | Lê o arquivo `.env` e disponibiliza as variáveis secretas no código |
| `@supabase/supabase-js` `^2.38.0` | `dependency` | SDK oficial do Supabase para consultar o banco de dados |
| `nodemon` `^3.0.1` | `devDependency` | Reinicia o servidor automaticamente ao salvar arquivos (apenas em desenvolvimento) |

**Comando executado:**
```bash
cd backend && npm install
```

---

### Frontend — `/frontend`

| Pacote | Tipo | Para que serve |
|---|---|---|
| `react` `^18.2.0` | `dependency` | A biblioteca principal para construir interfaces com componentes |
| `react-dom` `^18.2.0` | `dependency` | Conecta o React ao DOM do navegador (renderiza na tela) |
| `react-router-dom` `^6.18.0` | `dependency` | Sistema de navegação entre páginas sem recarregar o browser |
| `react-scripts` `5.0.1` | `dependency` | Conjunto de ferramentas do Create React App (servidor de dev, bundler, etc.) |
| `sass` `^1.69.3` | `dependency` | Compilador SCSS → CSS, necessário para os arquivos `.scss` do projeto |
| `@supabase/supabase-js` `^2.38.0` | `dependency` | SDK do Supabase para chamadas diretas ao banco pelo frontend |

**Comando executado:**
```bash
cd frontend && npm install
```

---

## Artefatos Gerados pela Instalação

```
backend/
├── node_modules/        ← ~200 pacotes instalados (ignorado pelo .gitignore)
└── package-lock.json    ← versões exatas fixadas (deve ser commitado no Git)

frontend/
├── node_modules/        ← ~1.500 pacotes instalados (ignorado pelo .gitignore)
└── package-lock.json    ← versões exatas fixadas (deve ser commitado no Git)
```

> **Nota sobre `package-lock.json`:** Este arquivo é gerado automaticamente pelo npm e fixa as versões exatas de cada pacote instalado. Ele **deve ser commitado** no repositório Git para garantir que todos os membros da equipe utilizem exatamente as mesmas versões, evitando o clássico problema de "funciona na minha máquina".

---

## Observações Técnicas

- O `react-scripts` é intencionalmente grande (inclui Webpack, Babel, ESLint). Isso é normal no Create React App — escolha didática e estável para projetos universitários.
- Futuramente, se a equipe desejar maior performance no ambiente de desenvolvimento, é possível migrar para **Vite** (build muito mais rápido), mas exigiria ajustes na configuração.

---

## Próximos Passos

- [ ] Configurar `.env` local no backend e frontend (baseado nos `.env.example`)
- [ ] Ativar e implementar o `backend/src/server.js`
- [ ] Criar o cliente Supabase em `backend/src/config/supabase.js`
- [ ] Implementar a primeira rota da API
- [ ] Criar a primeira página React (`HomePage`)
