# 10 — API de Categorias: `GET /api/categorias`

**Data de criação:** 2026-10-02  
**Etapa do projecto:** Primeira rota de domínio da API  
**Ficheiros criados:** `categoriaController.js`, `categoriaRoutes.js`  
**Ficheiros editados:** `server.js` (2 linhas aditivas)  
**Autor do prompt:** Thiago Cid (via Antigravity IDE)

---

## Prompt Original

> "O setup do backend foi validado e documentado. O próximo passo é criar a API que vai fornecer as categorias e subcategorias para o frontend.
>
> Por favor, apresente um plano de ação detalhado para criar a rota de categorias. O plano deve incluir a criação/edição dos seguintes ficheiros:
>
> backend/src/controllers/categoriaController.js: Lógica para buscar as categorias e suas subcategorias no Supabase (usando o supabaseClient já que a leitura é pública pelo RLS) e formatar a resposta JSON.
>
> backend/src/routes/categoriaRoutes.js: Definição do endpoint GET /api/categorias.
>
> backend/src/server.js: Integração das novas rotas no servidor existente.
>
> docs/prompts-ia/10-api-categorias.md: Documentação de registo contendo este prompt e as decisões arquiteturais."

---

## Fluxo de Dados

```
Cliente HTTP (frontend / curl)
        │
        │  GET /api/categorias
        ▼
  server.js
  app.use('/api/categorias', categoriaRoutes)
        │
        ▼
  categoriaRoutes.js
  router.get('/', getCategorias)
        │
        ▼
  categoriaController.js
  ┌─────────────────────────────────────────────┐
  │  Query 1: SELECT id, nome, icone            │
  │           FROM categorias ORDER BY nome      │
  │                                             │
  │  Query 2: SELECT id, categoria_id, nome     │
  │           FROM subcategorias ORDER BY nome   │
  │                                             │
  │  Aninhamento: categorias.map() +            │
  │               subcategorias.filter()         │
  └─────────────────────────────────────────────┘
        │
        ▼
  supabase.js → supabaseClient (anon key)
        │
        ▼
  Supabase PostgreSQL
```

---

## Decisões Arquitecturais

### 1. `supabaseClient` em vez de `supabaseAdmin`

O RLS (`rls.sql`) define explicitamente:

```sql
CREATE POLICY "Permitir leitura pública de categorias"
  ON public.categorias FOR SELECT USING (true);

CREATE POLICY "Permitir leitura pública de subcategorias"
  ON public.subcategorias FOR SELECT USING (true);
```

Usar `supabaseAdmin` (service_role) para dados que o RLS já libera publicamente seria:
- **Semanticamente errado**: usar privilégio máximo onde não é necessário
- **Mais arriscado**: se o código do controller fosse reaproveitado com mutações, o admin bypassaria o RLS
- **Contra o princípio do menor privilégio** (PoLP)

**Regra estabelecida para o projecto:**
> Usar `supabaseClient` para leituras públicas.  
> Usar `supabaseAdmin` para operações de sistema (inserções, actualizações, relatórios).

---

### 2. Duas Queries Separadas + Aninhamento em JavaScript

**Alternativa considerada:** `supabaseClient.from('categorias').select('*, subcategorias(*)')`

**Por que foi rejeitada:**
- O operador `*` em selects aninhados do Supabase carrega todas as colunas, incluindo `created_at` desnecessário
- Em tabelas com muitas colunas futuras, o controlo explícito das colunas é obrigatório para performance
- O aninhamento em JS com `filter()` é O(n×m) mas para o volume de dados deste domínio (< 50 registos) é negligenciável e mais legível

**Vantagens da abordagem adoptada:**
- Controlo explícito das colunas retornadas (`id, nome, icone` / `id, categoria_id, nome`)
- Cada query é testável de forma independente
- O aninhamento é transparente e auditável no código

---

### 3. Envelope de Resposta `{ sucesso, dados }`

Todas as respostas da API ZELUS seguem o padrão:

```json
{ "sucesso": true,  "dados": [...] }      // Sucesso
{ "sucesso": false, "mensagem": "..." }   // Erro
```

**Benefícios:**
- O frontend testa `if (response.dados.sucesso)` de forma uniforme em todos os endpoints
- Distingue erros de negócio (400) de erros de sistema (500) sem depender apenas do HTTP status code
- Facilita o logging e o debugging no frontend

---

### 4. Edição Aditiva do `server.js`

Apenas duas linhas foram inseridas no bloco de rotas, sem alterar nenhuma linha existente:

```diff
  // ROTAS
  // ==============================================================

+ // -- Rotas de Categorias --
+ const categoriaRoutes = require('./routes/categoriaRoutes');
+ app.use('/api/categorias', categoriaRoutes);

  // -- Rota de Saúde (Health Check) --
```

**Por que o import fica no server.js e não no topo do ficheiro?**  
Convenção do projecto: os `require()` de rotas ficam agrupados no bloco de rotas, próximos ao `app.use()`, facilitando a leitura da árvore de rotas disponíveis num único bloco.

---

## Contrato da API

### Endpoint

```
GET http://localhost:3001/api/categorias
```

### Resposta de Sucesso (200)

```json
{
  "sucesso": true,
  "dados": [
    {
      "id": "a1b2c3d4-0001-4000-8000-000000000001",
      "nome": "Asfalto",
      "icone": "road-damage",
      "subcategorias": [
        {
          "id": "b1b2c3d4-0001-4000-8000-000000000001",
          "categoria_id": "a1b2c3d4-0001-4000-8000-000000000001",
          "nome": "Buraco"
        }
      ]
    },
    {
      "id": "a1b2c3d4-0002-4000-8000-000000000002",
      "nome": "Bueiro / Boca de lobo",
      "icone": "drain",
      "subcategorias": [
        {
          "id": "b1b2c3d4-0002-4000-8000-000000000002",
          "categoria_id": "a1b2c3d4-0002-4000-8000-000000000002",
          "nome": "Entupido"
        },
        {
          "id": "b1b2c3d4-0003-4000-8000-000000000003",
          "categoria_id": "a1b2c3d4-0002-4000-8000-000000000002",
          "nome": "Tampa quebrada / sem tampa"
        }
      ]
    }
  ]
}
```

### Resposta de Erro (500)

```json
{
  "sucesso": false,
  "mensagem": "Erro interno ao buscar categorias."
}
```

---

## Como Testar

### 1. Iniciar o servidor

```bash
cd backend
npm run dev
```

### 2. Testar com curl

```bash
curl http://localhost:3001/api/categorias
```

### 3. Testar com o browser

Aceder directamente a `http://localhost:3001/api/categorias` — o browser renderiza o JSON.

---

## Ficheiros Alterados Nesta Etapa

| Ficheiro | Operação | Linhas |
|---|---|---|
| `backend/src/controllers/categoriaController.js` | Criado | 62 |
| `backend/src/routes/categoriaRoutes.js` | Criado | 20 |
| `backend/src/server.js` | Editado (+2 linhas) | 80 total |
| `docs/prompts-ia/10-api-categorias.md` | Criado | Este ficheiro |

---

## Próxima Etapa

Com a rota de categorias funcional, a próxima etapa lógica é a implementação das rotas de **autenticação**:

- `POST /api/auth/cidadao/registro` — registo de novo cidadão
- `POST /api/auth/cidadao/login` — login com CPF + senha
- `POST /api/auth/funcionario/login` — login de funcionário com matrícula
