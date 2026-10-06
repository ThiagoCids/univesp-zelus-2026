# 14 — Planejamento e Execução do Teste 02 (Cadastro de Cidadão)

**Data:** 2026-10-06  
**Fase:** Backend — Qualidade (QA)  
**Arquivo criado:** `docs/prompts-ia/14-teste-cadastro-cidadao.md`  
**Arquivos editados:** `docs/documentacao/registro-testes-backend.md`  

---

## Prompt Utilizado

> "A rota de cadastro foi implementada com sucesso. O próximo passo é testá-la na prática e manter nossa documentação de Qualidade (QA) atualizada.
> 
> Por favor, apresente um plano de ação detalhado que inclua:
> 
> Atualização do arquivo docs/documentacao/registro-testes-backend.md adicionando a seção 'Teste 02 — Rota POST /api/auth/cidadao/registro'.
> 
> Definição dos seguintes Casos de Teste (com status ⏳ Pendente):
> 
> CT-02.1: Envio sem campos obrigatórios (Esperado: 400 Bad Request e sucesso: false).
> CT-02.2: Cadastro com sucesso de um novo cidadão válido (Esperado: 201 Created, retornando os dados sem a senha).
> CT-02.3: Tentativa de cadastro com CPF ou Email duplicado usando os mesmos dados do CT-02.2 (Esperado: 409 Conflict).
> 
> Criação do arquivo docs/prompts-ia/14-teste-cadastro-cidadao.md contendo este prompt e o raciocínio dos testes.
> 
> Os comandos exatos de terminal para o Windows PowerShell (usando Invoke-RestMethod ou curl.exe com payload JSON no body) que serão usados para testar esses 3 cenários com o servidor ligado.
> 
> Apresente APENAS o plano de ação e a estrutura proposta dos documentos. NÃO crie nenhum arquivo, não altere documentos e não rode os testes antes da minha aprovação final."

---

## Raciocínio de Testes

1. **CT-02.1 (Validação de Entrada):** Verifica se a camada de validação inicial do Controller funciona, impedindo que requisições malformadas tentem acessar o banco de dados.
2. **CT-02.2 (Caminho Feliz):** O teste principal que consolida a funcionalidade. Confirma se o `supabaseAdmin` consegue ignorar o RLS e fazer a inserção, se a senha foi removida da resposta e se o status de retorno é 201.
3. **CT-02.3 (Restrições de Banco de Dados / Duplicidade):** Testa a resiliência a colisões de CPF/Email, garantindo que usuários diferentes não usem as mesmas credenciais, e que o frontend receba um código de status HTTP condizente (409 Conflict) em vez de um erro fatal (500).

---

## Resultados da Execução

Os comandos de `curl.exe` foram disparados via PowerShell e **os resultados foram perfeitos**:

- **CT-02.1:** 400 Bad Request, a API rejeitou com sucesso o payload com propriedades faltando.
- **CT-02.2:** 201 Created, a API usou o `supabaseAdmin` para superar o RLS de insert na tabela `cidadaos`, retornando um JSON com sucesso e omitindo propositalmente o campo senha gerado (hash de bcrypt).
- **CT-02.3:** 409 Conflict, a API identificou rapidamente que o CPF da requisição colidia com o recém-criado, lançando o HTTP 409 e prevenindo falha não-tratada do banco de dados (que também barraria a constraint UNIQUE).

O `docs/documentacao/registro-testes-backend.md` foi atualizado para **✅ Aprovado (3/3)** e todas as evidências preenchidas. O ciclo da funcionalidade "Cadastro de Munícipe" está completo.
