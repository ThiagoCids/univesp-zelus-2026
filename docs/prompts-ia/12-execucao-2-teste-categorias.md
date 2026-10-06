# 12 — Execução #2 do Teste 01 (`GET /api/categorias`) e Correcção da URL do Supabase

**Data de criação:** 2026-10-06  
**Etapa do projecto:** Reexecução do Teste 01 depois de corrigida a configuração do Supabase  
**Ficheiros criados:** `docs/prompts-ia/12-execucao-2-teste-categorias.md`  
**Ficheiros editados:** `docs/documentacao/registro-testes-backend.md` (v1.1.0 → v1.2.0), `docs/prompts-ia/11-teste-api-categorias.md` (só a linha "Próximo passo")  
**Ficheiros de código editados:** nenhum  
**Autor do prompt:** Thiago Cid (via Antigravity IDE)

---

## Prompt Original

> "O erro de DNS (ENOTFOUND) e a falha de fetch do servidor foram completamente resolvidos. O problema era um erro de digitação na variável SUPABASE_URL do arquivo backend/.env (tinha uma letra 'v' onde deveria ser um 'w').
>
> Com a URL e as chaves anon e service_role atualizadas e corretas, a rota GET /api/categorias já foi testada manualmente e retornou status 200 com sucesso.
>
> Por favor, apresente um plano de ação para:
>
> Rodar a Execução #2 completa do Teste 01 (todos os Casos de Teste do CT-01.0 ao CT-01.6) via terminal no IDE para confirmar que a API está comunicando corretamente com o Supabase.
>
> Atualizar o documento docs/documentacao/registro-testes-backend.md alterando o status dos testes de 'Reprovado' ou 'Bloqueado' para '✅ Aprovado', e registrando a solução do erro da URL na seção de observações.
>
> Atualizar/criar o registro de IA em docs/prompts-ia/11-teste-api-categorias.md (ou criar o 12, se preferir) com este prompt e os resultados da Execução #2.
>
> Apresente apenas o plano para eu validar antes de você executar os testes e atualizar a documentação."

### Decisões de validação do plano (resposta do autor)

| Questão | Decisão |
|---|---|
| Imutabilidade do histórico | A tabela 5.3 mostra o estado actual (Execução #2); as evidências e observações da Execução #1 **ficam no documento**, com as observações marcadas como *"→ Resolvido"* |
| CT-01.6 | Executar com contraste **200 → 500 → 200** para resolver a ressalva ⚠️ da Execução #1 |
| Onde registar este prompt | Criar o ficheiro **12** (diário cronológico: um ficheiro por prompt); no 11 muda só a linha "Próximo passo" |
| Servidor manual | Encerrado pelo autor antes da execução; porta `3001` livre |

---

## Contexto

Na [etapa 11](11-teste-api-categorias.md), a Execução #1 do Teste 01 foi **reprovada**: a rota devolvia HTTP 500 porque o host do Supabase configurado no `.env` devolvia *NXDOMAIN*. O diagnóstico registou três hipóteses: projecto pausado, projecto eliminado ou **erro de digitação no *project ref***. O código de tratamento de erro (CT-01.6) já tinha sido aprovado com ressalvas.

---

## Causa Raiz e Correcção

| | Host em `SUPABASE_URL` | DNS |
|---|---|---|
| Antes (Execução #1) | `zehdfbbceiojmwe`**`v`**`zwbo.supabase.co` | ❌ *NXDOMAIN* |
| Depois (Execução #2) | `zehdfbbceiojmwe`**`w`**`zwbo.supabase.co` | ✅ `172.64.149.246`, `104.18.38.10` |

- Confirmou-se a **hipótese 3** da Execução #1: erro de digitação, um `v` no lugar de um `w`.
- O autor corrigiu a URL e actualizou `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_KEY`.
- **Nenhum ficheiro de código foi alterado.** O defeito era só de configuração.

> **Segurança:** em nenhum momento foram impressos ou registados os valores das chaves. Os comandos leram do `.env` apenas o host público da URL e a *presença* da anon key (`True`/`False`). O `.env` não foi alterado pelo agente.

---

## Resultado da Execução #2 (2026-10-06, ≈ 10:09–10:12 BRT)

| CT | O que se testa | Resultado obtido | Estado |
|---|---|---|---|
| CT-01.0 | Anon key definida | `True` | ✅ Aprovado |
| CT-01.1 | Servidor no ar | `status = ok`, `projeto = ZELUS` | ✅ Aprovado |
| CT-01.2 | Status HTTP e Content-Type | `HTTP/1.1 200 OK`, `application/json; charset=utf-8` | ✅ Aprovado |
| CT-01.3 | Envelope e contagens | `sucesso = True`, 2 categorias, 3 subcategorias | ✅ Aprovado |
| CT-01.4 | Ordenação e colunas | `Asfalto` → `Bueiro / Boca de lobo`; só `id, nome, icone, subcategorias` | ✅ Aprovado |
| CT-01.5 | Integridade da FK | Nenhuma inconsistência | ✅ Aprovado |
| CT-01.6 | Tratamento de erro | 500 com o corpo esperado → ambiente reposto → 200; `.env` intacto | ✅ Aprovado |

**Resultado global: ✅ Teste 01 Aprovado (7/7).** O corpo devolvido pela rota é idêntico ao *Resultado Esperado* definido na etapa 11.

As evidências completas (saídas reais do terminal) estão em [`registro-testes-backend.md` › 5.6 › Execução #2](../documentacao/registro-testes-backend.md).

### Evolução entre execuções

| CT | Execução #1 (2026-10-05) | Execução #2 (2026-10-06) |
|---|---|---|
| CT-01.0 | ✅ | ✅ |
| CT-01.1 | ✅ | ✅ |
| CT-01.2 | ❌ HTTP 500 | ✅ HTTP 200 |
| CT-01.3 – 01.5 | 🚫 Bloqueado | ✅ |
| CT-01.6 | ⚠️ sem contraste | ✅ contraste 200 → 500 → 200 |

---

## Lições Aprendidas

1. **O diagnóstico por camadas compensou.** Na Execução #1, testar DNS → HTTPS → Node fetch (com `supabase.com` como controlo) isolou o problema no host configurado e afastou rede local e código. A hipótese certa já estava na lista.
2. **Os *project refs* do Supabase são frágeis à digitação.** São cadeias aleatórias de 20 caracteres, onde `v`/`w` se confundem facilmente. **Boa prática:** copiar sempre o *Project URL* directamente de *Settings › API* no Supabase Dashboard.
3. **O registo oficial valeu na prática.** O teste "de confirmação" encontrou um bloqueio real antes da integração com o frontend, e a reexecução mostra de forma objectiva que a correcção resolveu o problema sem efeitos colaterais.

### Ressalvas que continuam em aberto (não afectam o Teste 01)

- *Fallback* silencioso da anon key para a service_role key em `backend/src/config/supabase.js`.
- O log do controller regista só `erro.message` e esconde `erro.cause` (a causa real, ex.: `ENOTFOUND`).

Ambas ficam para uma etapa futura de refactoração.

---

## Ficheiros Alterados Nesta Etapa

| Ficheiro | Operação |
|---|---|
| `docs/documentacao/registro-testes-backend.md` | Editado: v1.2.0, Execução #2 registada (sumário, tabela 5.3, evidências 5.6, observações 5.7, histórico 5.8, revisões 7); passo de contraste acrescentado ao procedimento do CT-01.6 (5.4) |
| `docs/prompts-ia/11-teste-api-categorias.md` | Editado: só a linha "Próximo passo", agora a apontar para este ficheiro |
| `docs/prompts-ia/12-execucao-2-teste-categorias.md` | Criado (este ficheiro) |

---

## Próxima Etapa

Com a primeira rota de domínio validada contra o Supabase real, segue-se a implementação das rotas de **autenticação**, cada uma com a respectiva secção `Teste NN` no registo oficial:

- `POST /api/auth/cidadao/registro`
- `POST /api/auth/cidadao/login`
- `POST /api/auth/funcionario/login`
