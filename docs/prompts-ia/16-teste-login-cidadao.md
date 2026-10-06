# 16 — Planejamento e Execução do Teste 03 (Login de Cidadão)

**Data:** 2026-10-06  
**Fase:** Backend — Qualidade (QA)  
**Arquivo criado:** `docs/prompts-ia/16-teste-login-cidadao.md`  
**Arquivos editados:** `docs/documentacao/registro-testes-backend.md`  

---

## Prompt Utilizado

> "A rota de login foi implementada com sucesso. O próximo passo é testá-la na prática e manter a nossa documentação de Qualidade (QA) rigorosamente atualizada.
> 
> Por favor, apresente um plano de ação detalhado que inclua:
> 
> Atualização do arquivo docs/documentacao/registro-testes-backend.md adicionando a seção 'Teste 03 — Rota POST /api/auth/cidadao/login'.
> 
> Definição dos seguintes Casos de Teste (com status ⏳ Pendente):
> 
> CT-03.1: Envio sem campos obrigatórios (Esperado: 400 Bad Request e sucesso: false).
> CT-03.2: Login com CPF inexistente (Esperado: 401 Unauthorized e mensagem genérica 'Credenciais inválidas').
> CT-03.3: Login com CPF existente (do Teste 02) mas senha errada (Esperado: 401 Unauthorized e mensagem genérica 'Credenciais inválidas').
> CT-03.4: Login com sucesso usando os dados válidos do Teste 02 (Esperado: 200 OK, retornando o token JWT e os dados sem a senha).
> 
> Criação do arquivo docs/prompts-ia/16-teste-login-cidadao.md contendo este prompt e o raciocínio dos testes.
> 
> Os comandos exatos de terminal para o Windows PowerShell (usando curl.exe com payload JSON no body e escapando as aspas) que serão usados para testar esses 4 cenários com o servidor ligado.
> 
> Apresente APENAS o plano de ação e a estrutura proposta dos documentos. NÃO crie nenhum arquivo, não altere documentos e não rode os testes antes da minha aprovação final."

---

## Raciocínio de Testes

1. **CT-03.1 (Validação de Entrada):** Assegura que o backend não avança sem a totalidade das chaves necessárias, abortando cedo (400 Bad Request) e poupando chamadas desnecessárias à base de dados.
2. **CT-03.2 e CT-03.3 (Vetor de Segurança / Enumeração):** Uma falha em que um invasor tente testar emails/CPFs poderia ser utilizada para descobrir utilizadores registados se as mensagens fossem ("CPF não encontrado" vs "Senha incorreta"). Ao retornar o mesmo erro genérico 401, evitamos o vazamento de metadados.
3. **CT-03.4 (Caminho Feliz - Happy Path):** Verifica o fluxo essencial da funcionalidade. Requer validação do hash (bcrypt), contorno do RLS (supabaseAdmin), geração da *string* do JWT com o segredo correto, e sanitização do JSON de resposta removendo o campo `senha`.

---

## Resultados da Execução

Os comandos de `curl.exe` foram disparados em sequência e o backend respondeu exactamente conforme a documentação estipulava:

- **CT-03.1:** 400 Bad Request interceptou a falta da "senha".
- **CT-03.2 e CT-03.3:** Ambos falharam intencionalmente com 401 Unauthorized e a exata mesma mensagem ("Credenciais inválidas."), comprovando a resiliência contra ataques de enumeração.
- **CT-03.4:** Caminho feliz obteve o 200 OK. A API comparou correctamente o hash, assinou e retornou o JSON Web Token (JWT) e suprimiu o hash da resposta.

O arquivo `docs/documentacao/registro-testes-backend.md` foi consolidado para **✅ Aprovado (4/4)**, as evidências foram registadas e o ciclo de Login de Cidadão concluído.
