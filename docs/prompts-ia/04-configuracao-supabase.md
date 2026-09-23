# Prompt 04 — Configuração do Cliente Supabase

**Data:** 2026-09-22  
**Etapa do projeto:** Integração com banco de dados

---

## Prompt enviado

> Excelente, o servidor e o nodemon estão operacionais. Agora, vamos para o próximo passo da arquitetura: configurar o banco de dados. Crie a configuração inicial do cliente do Supabase no arquivo `backend/src/config/supabase.js`, utilizando as chaves que já preparamos no nosso `.env`. Mostre-me o seu plano de ação e inclua a criação do arquivo `docs/prompts-ia/04-configuracao-supabase.md` para registrar a documentação deste passo.

---

## Contexto encontrado

Ao analisar o repositório, a IA identificou:

- `@supabase/supabase-js` já instalado no `package.json` (desde a etapa 02)
- As três variáveis necessárias já declaradas no `backend/.env`: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_ANON_KEY`
- O `server.js` já carrega o `dotenv` como primeira instrução, garantindo que `process.env` estará populado ao importar este módulo
- A pasta `backend/src/config/` existia com apenas um `.gitkeep` — aguardando este arquivo
- A arquitetura documentada em `LEIA-ME-ARQUITETURA.md` prevê explicitamente: _"config/ → Configurações globais (conexão com Supabase, etc.)"_

---

## Plano gerado e aprovado

### Arquivos criados

| Ação | Arquivo | Descrição |
|------|---------|-----------|
| NEW | `backend/src/config/supabase.js` | Módulo de conexão com Supabase |
| NEW | `docs/prompts-ia/04-configuracao-supabase.md` | Este arquivo de registro |

---

## Decisões técnicas

### 1. Dois clientes exportados: `supabaseAdmin` e `supabaseClient`

A separação entre os dois clientes é uma prática de segurança fundamental:

| Export | Chave usada | Row Level Security (RLS) | Uso adequado |
|--------|------------|--------------------------|--------------|
| `supabaseAdmin` | `SUPABASE_SERVICE_KEY` | **Ignorada** (bypass total) | Operações de sistema, inserções administrativas |
| `supabaseClient` | `SUPABASE_ANON_KEY` | **Respeitada** | Consultas públicas, operações por usuário |

Usar `supabaseAdmin` para tudo seria um risco de segurança: qualquer bug na lógica de autorização do backend poderia expor ou modificar dados de qualquer usuário.

### 2. Validação fail-fast com checagem de placeholder

O módulo verifica não apenas se as variáveis estão definidas, mas também se ainda contêm os valores placeholder (`SEU_PROJETO`, `sua_chave`). Isso evita um bug silencioso comum: o servidor sobe normalmente, mas falha apenas quando uma rota tenta acessar o banco — difícil de diagnosticar.

Com fail-fast, o erro aparece **imediatamente no log do nodemon** ao subir o servidor.

### 3. `persistSession: false` em ambos os clientes

O backend não é um browser — não existe `localStorage` nem cookies de sessão. Desabilitar `persistSession` e `autoRefreshToken` é a configuração correta para uso em servidor Node.js, evitando warnings e comportamentos inesperados do SDK.

### 4. Módulo não importado ainda no `server.js`

O `supabase.js` é criado mas **não importado** nesta etapa. Isso é intencional:
- As chaves ainda são placeholder → a validação fail-fast lançaria erro ao importar
- A importação será feita pelos `services/` quando as rotas de negócio forem criadas
- O servidor continua funcionando normalmente (nodemon reiniciou sem erros)

---

## Estrutura final do `supabase.js`

```
1. require('@supabase/supabase-js')       ← importa createClient
2. Lê SUPABASE_URL, SERVICE_KEY, ANON_KEY de process.env
3. Validação fail-fast:
   ├── SUPABASE_URL ausente ou placeholder → throw Error
   └── SUPABASE_SERVICE_KEY ausente ou placeholder → throw Error
4. Cria supabaseAdmin  (SERVICE_KEY, persistSession: false)
5. Cria supabaseClient (ANON_KEY,    persistSession: false)
6. module.exports = { supabaseAdmin, supabaseClient }
```

---

## Como usar em outros módulos (próximas etapas)

```javascript
// Em um service (ex: src/services/ocorrenciasService.js):
const { supabaseAdmin } = require('../config/supabase');

async function listarOcorrencias() {
  const { data, error } = await supabaseAdmin
    .from('ocorrencias')
    .select('*');

  if (error) throw error;
  return data;
}
```

---

## Validação realizada

O nodemon detectou a criação do arquivo e reiniciou automaticamente.  
Como o `supabase.js` não é importado pelo `server.js`, o servidor subiu sem erros.  
O endpoint `GET /api/status` continuou respondendo normalmente.

---

## Próximos passos sugeridos

1. **Preencher as chaves reais no `.env`** — acessar o Supabase Dashboard e copiar `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` e `SUPABASE_ANON_KEY`
2. **Criar o schema do banco** — definir as tabelas do ZELUS no Supabase (ocorrências, usuários, categorias)
3. **Criar o primeiro service** — `src/services/ocorrenciasService.js` importando `supabaseAdmin`
4. **Criar a primeira rota** — `src/routes/ocorrencias.routes.js` conectando ao service
