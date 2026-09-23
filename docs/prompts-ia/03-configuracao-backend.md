# Prompt 03 — Configuração Inicial do Servidor Backend

**Data:** 2026-09-22  
**Etapa do projeto:** Ativação do servidor Express

---

## Prompt enviado

> Estamos de volta para continuar o projeto ZELUS. O nosso ambiente base de monorepo já está configurado. O objetivo agora é ligar o nosso servidor backend. Por favor, crie a lógica inicial no arquivo `backend/src/server.js` usando Express, configure as variáveis de ambiente base no `.env` do backend (como a PORTA), e crie um endpoint de teste simples (ex: `/api/status`). Antes de executar, mostre-me o plano. Além disso, inclua no plano a criação do arquivo `docs/prompts-ia/03-configuracao-backend.md` com este prompt e o seu plano.

---

## Contexto encontrado

Ao analisar o repositório, a IA identificou:

- O `backend/src/server.js` existia, mas **toda a lógica estava comentada** — era um esqueleto educativo documentado, esperando esta etapa de ativação.
- O `backend/.env.example` já definia as variáveis esperadas: `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_ANON_KEY`.
- As dependências (`express`, `dotenv`, `cors`) já estavam instaladas em `node_modules` (instaladas na etapa anterior).
- O `backend/.gitignore` já garantia que o `.env` real **não seria rastreado** pelo Git.

---

## Plano gerado e aprovado

### Arquivos modificados / criados

| Ação | Arquivo | Descrição |
|------|---------|-----------|
| MODIFY | `backend/src/server.js` | Código Express funcional ativado |
| NEW | `backend/.env` | Variáveis de ambiente locais (não rastreado) |
| NEW | `docs/prompts-ia/03-configuracao-backend.md` | Este arquivo de registro |

---

## Decisões técnicas

### 1. `require('dotenv').config()` — primeira linha
O carregamento do `dotenv` é feito **antes de qualquer outro `require`**. Isso garante que `process.env.PORT` (e futuras variáveis do Supabase) já estejam disponíveis no momento em que outros módulos forem importados. Se colocado depois, módulos que lerem `process.env` durante sua inicialização receberiam `undefined`.

### 2. `process.env.PORT || 3001` — valor de fallback
A porta lida do `.env` tem precedência. O fallback `3001` garante que o servidor sobe mesmo que o `.env` esteja ausente ou incompleto — útil em ambientes de CI/CD ou durante primeiros testes.

### 3. Endpoint `GET /api/status` como health check
Um endpoint de saúde padronizado em `/api/status` é uma prática comum em APIs REST. Ele permite:
- Verificar rapidamente se o servidor está no ar
- Confirmar variáveis de ambiente (ex: `ambiente: 'development'`)
- Servir como base para monitoramento futuro (ex: uptime checkers)

### 4. Chaves do Supabase como placeholder no `.env`
As variáveis `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` e `SUPABASE_ANON_KEY` foram criadas com valores placeholder (idênticos ao `.env.example`). O servidor funciona normalmente para rotas que não dependem do banco. A integração real com o Supabase será feita em etapa dedicada.

### 5. Middleware `cors()` ativado globalmente
O CORS é configurado de forma permissiva para desenvolvimento (`cors()` sem opções restringe apenas origens não-CORS). Em produção, será necessário restringir a `origin` para o domínio do frontend.

---

## Estrutura final do `server.js`

```
1. require('dotenv').config()          ← carrega .env
2. require('express') + require('cors') ← importa libs
3. const app = express()               ← cria instância
4. const PORT = process.env.PORT||3001 ← define porta
5. app.use(cors())                     ← middleware CORS
6. app.use(express.json())             ← middleware JSON
7. app.get('/api/status', ...)         ← endpoint health check
8. app.get('/', ...)                   ← redireciona raiz
9. app.listen(PORT, ...)               ← inicia servidor
```

---

## Validação realizada

```bash
# Comando executado em backend/
npm run dev

# Saída no terminal:
# ======================================================
#   Servidor ZELUS rodando em: http://localhost:3001
#   Endpoint de status:        http://localhost:3001/api/status
# ======================================================
```

**Resposta do endpoint `GET /api/status`:**
```json
{
  "status": "ok",
  "projeto": "ZELUS",
  "versao": "1.0.0",
  "ambiente": "development",
  "timestamp": "2026-09-22T..."
}
```

---

## Próximos passos sugeridos

1. **Configurar o Supabase** — preencher as chaves reais no `.env` e criar o cliente de banco de dados em `src/config/supabase.js`
2. **Criar as primeiras rotas de negócio** — ex: `/api/ocorrencias` para gerenciar ocorrências de alunos
3. **Adicionar tratamento de erros global** — middleware de erro centralizado para capturar exceções não tratadas
4. **Configurar variável `NODE_ENV`** — distinguir comportamentos entre `development` e `production`
