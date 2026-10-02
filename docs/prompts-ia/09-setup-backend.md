# 09 — Setup do Backend Node.js

**Data de criação:** 2026-10-02  
**Etapa do projecto:** Pós-seed de dados  
**Ficheiros auditados:** `package.json`, `.env.example`, `src/config/supabase.js`, `src/server.js`  
**Autor do prompt:** Thiago Cid (via Antigravity IDE)

---

## Prompt Original

> "A fundação do banco de dados (schema, RLS e seed) está 100% concluída. O nosso próximo passo é inicializar o Backend em Node.js.
>
> Por favor, apresente um plano de ação detalhado para estruturar a nossa API. O plano deve incluir:
>
> Inicialização do projeto Node.js (arquivo backend/package.json com as dependências essenciais: express, cors, dotenv e @supabase/supabase-js).
>
> Criação do arquivo de configuração de ambiente (backend/.env.example).
>
> Criação da configuração de conexão com o banco usando a 'service_role' (backend/src/config/supabase.js).
>
> Criação do servidor básico (backend/src/server.js).
>
> Criação do arquivo de documentação obrigatório docs/prompts-ia/09-setup-backend.md contendo este prompt e as decisões arquiteturais."

---

## Resultado da Auditoria

Ao receber este prompt, foi realizada uma auditoria completa da estrutura existente em `backend/`.
A auditoria revelou que **todos os ficheiros de código solicitados já existiam e estavam implementados**
com qualidade superior à baseline pedida, fruto de uma etapa de configuração anterior do projecto.

| Ficheiro solicitado | Estado | Observação |
|---|---|---|
| `backend/package.json` | ✅ Existia | Todas as 4 deps + `nodemon` como devDependency |
| `backend/.env.example` | ✅ Existia | Modelo com 3 variáveis + instruções de localização |
| `backend/src/config/supabase.js` | ✅ Existia | Dois clientes + validação fail-fast |
| `backend/src/server.js` | ✅ Existia | Express completo + health check `/api/status` |
| `docs/prompts-ia/09-setup-backend.md` | ❌ Em falta | **Criado nesta etapa** |

**Decisão tomada:** Nenhum ficheiro de código foi criado ou modificado. Criar duplicatas ou
sobrescrever código funcional seria regressão. Esta etapa limitou-se à criação deste registo.

---

## Inventário e Decisões Arquitecturais

### `backend/package.json`

```json
{
  "name": "zelus-backend",
  "version": "1.0.0",
  "description": "Backend do sistema ZELUS - API REST com Node.js e Express",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.3.1",
    "@supabase/supabase-js": "^2.38.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**Decisões:**
- `express` → framework HTTP minimalista e maduro, sem overhead desnecessário para uma API REST
- `cors` → middleware para controlo de Cross-Origin Resource Sharing, necessário para o frontend mobile
- `dotenv` → carregamento de variáveis de ambiente do ficheiro `.env` para `process.env`
- `@supabase/supabase-js` → SDK oficial do Supabase, abstrai as chamadas REST e RealTime ao banco
- `nodemon` → reinicia o servidor automaticamente a cada alteração de ficheiro (apenas em dev)
- `"main": "src/server.js"` → ponto de entrada único e explícito

---

### `backend/.env.example`

Modelo público das variáveis de ambiente. Versionado no Git para servir de guia a novos
membros da equipa. O ficheiro `.env` real (com valores secretos) está no `.gitignore`.

```
PORT=3001
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_SERVICE_KEY=sua_chave_secreta_aqui
SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

| Variável | Onde encontrar | Nível de acesso |
|---|---|---|
| `PORT` | Definida livremente pela equipa | — |
| `SUPABASE_URL` | Dashboard → Settings → API → Project URL | Público (mas mantido no backend) |
| `SUPABASE_SERVICE_KEY` | Dashboard → Settings → API → service_role | **Secreto — nunca no frontend** |
| `SUPABASE_ANON_KEY` | Dashboard → Settings → API → anon/public | Público (sujeito ao RLS) |

---

### `backend/src/config/supabase.js`

#### Decisão Arquitectural Principal: Dois Clientes Distintos

O módulo exporta dois clientes Supabase com privilégios diferentes:

```javascript
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

module.exports = { supabaseAdmin, supabaseClient };
```

| Cliente | Chave usada | Bypassa RLS? | Quando usar |
|---|---|---|---|
| `supabaseAdmin` | `service_role` | **Sim** | Operações de sistema, seeds, relatórios admin, inserções que precisam de acesso total |
| `supabaseClient` | `anon key` | **Não** | Consultas públicas, operações que respeitam as políticas de segurança do utilizador |

**Por que `persistSession: false`?** O backend é um servidor stateless — não mantém sessões
de utilizador entre requisições. A autenticação é gerida pelo token JWT em cada requisição.
Activar sessões no servidor geraria vazamentos de memória e comportamento inesperado.

#### Validação Fail-Fast

Antes de criar qualquer cliente, o módulo valida as variáveis obrigatórias:

```javascript
if (!SUPABASE_URL || SUPABASE_URL.includes('SEU_PROJETO')) {
  throw new Error('[Supabase] SUPABASE_URL não configurada...');
}
if (!SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY.includes('sua_chave')) {
  throw new Error('[Supabase] SUPABASE_SERVICE_KEY não configurada...');
}
```

**Por que fail-fast?** Um servidor que sobe sem as variáveis configuradas falharia
silenciosamente na primeira query ao banco, gerando erros difíceis de diagnosticar.
Com fail-fast, o servidor para imediatamente ao arrancar com uma mensagem clara e accionável.

---

### `backend/src/server.js`

```javascript
require('dotenv').config();          // 1. Variáveis de ambiente (PRIMEIRA instrução)
const express = require('express');  // 2. Framework HTTP
const cors    = require('cors');     // 3. Cross-Origin

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());           // Permite requisições do frontend
app.use(express.json());   // Parsing de JSON no body das requisições

// Health check — confirma que o servidor está vivo
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status:    'ok',
    projecto:  'ZELUS',
    versao:    '1.0.0',
    ambiente:  process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => res.redirect('/api/status'));

app.listen(PORT, () => {
  console.log(`Servidor ZELUS rodando em: http://localhost:${PORT}`);
});
```

**Decisões:**
- `require('dotenv').config()` na **primeira linha absoluta** — garante que `process.env` está
  populado antes de qualquer outro `require`, incluindo o `supabase.js` que depende das variáveis
- `app.use(express.json())` — sem este middleware, `req.body` seria `undefined` em todos os POSTs
- `/api/status` como health check — padrão de observabilidade para confirmar que a API responde

---

## Estrutura de Directórios do Backend

```
backend/
├── .env                        # Variáveis reais (no .gitignore)
├── .env.example                # Modelo público (versionado)
├── .gitignore
├── package.json
├── package-lock.json
├── node_modules/               # Dependências instaladas (no .gitignore)
└── src/
    ├── server.js               # Ponto de entrada da API
    ├── config/
    │   └── supabase.js         # Clientes de conexão ao banco
    ├── controllers/            # Lógica de negócio por recurso (a preencher)
    ├── routes/                 # Definição de rotas por recurso (a preencher)
    ├── services/               # Serviços auxiliares (a preencher)
    ├── middlewares/            # Middlewares customizados (a preencher)
    └── database/
        ├── schema.sql
        ├── rls.sql
        └── seed.sql
```

---

## Como Verificar o Servidor

### Iniciar em modo desenvolvimento

```bash
cd backend
npm run dev
```

**Saída esperada:**
```
======================================================
  Servidor ZELUS rodando em: http://localhost:3001
  Endpoint de status:        http://localhost:3001/api/status
======================================================
```

### Testar o health check

```bash
curl http://localhost:3001/api/status
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "projecto": "ZELUS",
  "versao": "1.0.0",
  "ambiente": "development",
  "timestamp": "2026-10-02T04:13:00.000Z"
}
```

---

## Próxima Etapa

Com o backend estruturado e funcional, a próxima etapa é a criação das **rotas de domínio**:

1. `GET /api/categorias` — retorna todas as categorias com as subcategorias aninhadas
2. Rotas de autenticação (cidadão e funcionário)
3. Rotas de solicitações (CRUD)
