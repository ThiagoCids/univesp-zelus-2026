# 11 — Teste da API de Categorias e Criação do Registo Oficial de Testes

**Data de criação:** 2026-10-05  
**Etapa do projecto:** Validação da primeira rota de domínio + instituição da documentação de testes  
**Ficheiros criados:** `docs/documentacao/registro-testes-backend.md`, `docs/prompts-ia/11-teste-api-categorias.md`  
**Ficheiros editados:** nenhum ficheiro de código  
**Autor do prompt:** Thiago Cid (via Antigravity IDE)

---

## Prompt Original

> "Retomamos o desenvolvimento e o nosso próximo passo é testar a recém-criada rota GET /api/categorias. Tivemos uma decisão arquitetural importante: vamos criar uma documentação oficial e contínua de testes.
>
> Por favor, apresente um plano de ação detalhado que inclua:
>
> A criação do ficheiro docs/documentacao/registro-testes-backend.md. Este deve ser um documento vivo ('living document'), com um título profissional e uma introdução explicando a metodologia de testes. Deve conter a estrutura para o nosso 'Teste 01: Rota GET /api/categorias' (explicando o que se testa, como se testa e o resultado esperado).
>
> A criação do ficheiro docs/prompts-ia/11-teste-api-categorias.md contendo este prompt e o raciocínio por trás da criação do registo oficial de testes.
>
> Os comandos exatos de terminal que eu deverei rodar para executar este teste na prática.
>
> Apresente APENAS o plano e a estrutura proposta dos ficheiros para a minha validação. NÃO crie nenhum ficheiro nem execute comandos antes da minha aprovação final."

### Decisões de validação do plano (resposta do autor)

| Questão | Decisão |
|---|---|
| Incluir o CT-01.6 (erro 500 simulado)? | **Sim** — testar a resiliência do tratamento de erros |
| Quem executa os comandos? | **O agente da IDE**, passo a passo, recolhendo as saídas reais para as Evidências |
| Fallback da anon key em `supabase.js` | **Apenas registar como ressalva**; ajuste numa etapa futura de refactoração |

---

## Contexto

Na etapa 10 foi criada a rota `GET /api/categorias`. O documento `10-api-categorias.md` incluía uma secção "Como Testar", mas apenas como sugestão — sem execução registada, sem critérios objectivos de aprovação e sem evidências. Esta etapa fecha essa lacuna e, mais importante, define **como** o projecto passa a testar todas as rotas futuras.

---

## Decisão Arquitectural: Registo Oficial de Testes

### 1. Porquê um documento vivo (*living document*)

| Motivo | Benefício |
|---|---|
| **Rastreabilidade** | Fica explícito o que foi testado, quando, por quem e com que resultado — essencial para a avaliação do Projecto Integrador |
| **Evidência real** | Substitui o "funcionou na minha máquina" por saídas reais de terminal, reprodutíveis |
| **Roteiro de regressão** | Após qualquer alteração (ex.: refactoração do `supabase.js`), basta reexecutar os comandos documentados |
| **Base para automação** | Cada `CT-NN.X` tem entrada, comando e critério objectivo — conversão directa para Jest + Supertest no futuro |
| **Cumulativo** | Um único ficheiro cresce com o projecto; o histórico nunca é apagado |

### 2. Separação de responsabilidades entre pastas

| Pasta | Natureza | Pergunta a que responde |
|---|---|---|
| `docs/prompts-ia/` | Diário de bordo cronológico | *Como e porquê* se decidiu cada passo |
| `docs/documentacao/` | Documentação oficial do produto | *O que* está construído e validado |

O registo de testes é um artefacto oficial (estado actual da qualidade do backend), por isso vive em `documentacao/`. Este ficheiro (`11-...`) regista apenas a decisão de o criar.

### 3. Porquê testes manuais agora (e não Jest/Supertest)

- Existe apenas **uma** rota de domínio — o custo de configurar uma framework de testes ainda não compensa.
- Evita acrescentar dependências ao `package.json` sem uma decisão explícita da equipa.
- A metodologia foi desenhada para que a migração futura para testes automatizados seja mecânica.

---

## Riscos Identificados na Preparação do Teste

### 1. `curl` no PowerShell não é o curl real

No Windows PowerShell, `curl` é um *alias* de `Invoke-WebRequest`, com sintaxe e saída diferentes. O comando `curl` sugerido no documento 10 não se comporta como esperado neste ambiente. **Mitigação:** usar `curl.exe` (binário real, incluído no Windows 10+) e `Invoke-RestMethod` para inspecção estruturada do JSON.

### 2. Fallback silencioso da anon key

Em `backend/src/config/supabase.js`:

```js
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY, { ... });
```

Se `SUPABASE_ANON_KEY` estiver ausente, o cliente "público" usa a `service_role` key e **ignora o RLS**. O teste da rota passaria, mas pela razão errada. **Mitigação nesta etapa:** caso de teste `CT-01.0`, que verifica a presença da anon key sem nunca imprimir o seu valor. **Decisão:** registado como ressalva no documento oficial; correcção adiada para refactoração futura.

### 3. Como simular um erro 500 sem alterar o `.env`

O `dotenv` não sobrescreve variáveis já presentes no ambiente do processo. Definindo `$env:SUPABASE_URL` com uma URL inválida na sessão do terminal antes de arrancar o servidor, a falha é induzida de forma não destrutiva e reversível (`Remove-Item Env:SUPABASE_URL`). A URL inválida passa a validação *fail-fast* de `supabase.js`, pelo que o erro ocorre apenas na query — testando efectivamente o `catch` do controller.

---

## Comandos de Execução

**Terminal 1 — servidor:**

```powershell
cd backend
npm run dev
```

**Terminal 2 — testes (raiz do repositório):**

```powershell
Select-String -Path backend\.env -Pattern '^SUPABASE_ANON_KEY=.+' -Quiet   # CT-01.0
Invoke-RestMethod http://localhost:3001/api/status                          # CT-01.1
curl.exe -i http://localhost:3001/api/categorias                            # CT-01.2

$r = Invoke-RestMethod http://localhost:3001/api/categorias                 # CT-01.3
$r | ConvertTo-Json -Depth 5
$r.sucesso
$r.dados.Count
@($r.dados.subcategorias).Count

$r.dados.nome                                                               # CT-01.4
$r.dados[0].PSObject.Properties.Name
$r.dados[1].subcategorias.nome

$r.dados | ForEach-Object { $c = $_; $c.subcategorias | Where-Object { $_.categoria_id -ne $c.id } }   # CT-01.5
```

**CT-01.6 — erro 500 simulado:**

```powershell
# Terminal 1
$env:SUPABASE_URL = "https://projeto-inexistente.supabase.co"
npm run dev
# Terminal 2
curl.exe -i http://localhost:3001/api/categorias
# Terminal 1 — reposição
Remove-Item Env:SUPABASE_URL
npm run dev
```

Os resultados obtidos e as evidências são registados em [`registro-testes-backend.md`](../documentacao/registro-testes-backend.md).

---

## Resultado da Execução #1 (2026-10-05)

| CT | Estado |
|---|---|
| CT-01.0 — anon key definida | ✅ Aprovado |
| CT-01.1 — servidor no ar | ✅ Aprovado |
| CT-01.2 — status 200 | ❌ Reprovado (HTTP 500) |
| CT-01.3 a CT-01.5 — conteúdo da resposta | 🚫 Bloqueado |
| CT-01.6 — tratamento de erro | ⚠️ Aprovado com ressalvas |

**Causa da reprovação:** o host do Supabase configurado no `.env` não tem registo DNS (*NXDOMAIN*), embora a internet e o DNS geral funcionem. O problema é de infra-estrutura (o mais provável é o projecto Supabase estar pausado), não do código da rota. O teste mostrou, na prática, o valor do registo oficial: um teste "de confirmação" encontrou um bloqueio real antes da integração com o frontend.

**Próximo passo:** restabelecer o acesso ao Supabase e reexecutar o Teste 01 completo (Execução #2). → **Concluído em 2026-10-06:** ✅ Teste 01 aprovado (7/7) — ver [`12-execucao-2-teste-categorias.md`](12-execucao-2-teste-categorias.md).

---

## Ficheiros Alterados Nesta Etapa

| Ficheiro | Operação |
|---|---|
| `docs/documentacao/registro-testes-backend.md` | Criado (documento vivo) |
| `docs/prompts-ia/11-teste-api-categorias.md` | Criado (este ficheiro) |

---

## Próxima Etapa

Com o Teste 01 registado, segue-se a implementação das rotas de **autenticação**, cada uma acompanhada da respectiva secção `Teste NN` no registo oficial:

- `POST /api/auth/cidadao/registro`
- `POST /api/auth/cidadao/login`
- `POST /api/auth/funcionario/login`
