# 18 - Teste da Rota de Login do Funcionário

## Prompt Original
> A rota de login do funcionário foi implementada com perfeição e os retornos estão padronizados. Agora, seguindo a nossa metodologia, precisamos de planear a bateria de testes de QA (Teste 04).
> 
> Por favor, apresente um plano de ação detalhado que inclua:
> 
> Leitura rápida (interna) do ficheiro backend/src/database/seed.sql para identificar as credenciais exatas (CPF e a senha que corresponde à hash) do funcionário de teste que inserimos na base de dados.
> 
> Atualização do ficheiro docs/documentacao/registro-testes-backend.md adicionando a secção 'Teste 04 — Rota POST /api/auth/funcionario/login' e atualizando o sumário.
> 
> Definição dos seguintes Casos de Teste (com status ⏳ Pendente):
> 
> CT-04.1: Envio sem campos obrigatórios (Esperado: 400 Bad Request e sucesso: false).
> CT-04.2: Login com CPF inexistente (Esperado: 401 Unauthorized e mensagem genérica 'Credenciais inválidas.').
> CT-04.3: Login com CPF correto (do seed) mas senha errada (Esperado: 401 Unauthorized e mensagem genérica idêntica).
> CT-04.4: Login com sucesso usando as credenciais do seed.sql (Esperado: 200 OK, retornando o token JWT e os dados omitindo a senha).
> 
> Criação do ficheiro docs/prompts-ia/18-teste-login-funcionario.md contendo este prompt e o raciocínio de segurança destes testes.
> 
> Os comandos exatos de terminal para o Windows PowerShell (usando curl.exe com payload JSON no body e escapando as aspas) que serão usados para testar os 4 cenários (assuma localhost:3001).

## Raciocínio de Segurança
A bateria de testes do Login do Funcionário (Teste 04) foca na prevenção contra ataques de enumeração de utilizadores. É crucial que o sistema responda exatamente da mesma forma (Status 401 e mesma mensagem "Credenciais inválidas.") independentemente de o erro ser um CPF (matrícula) inexistente (CT-04.2) ou uma senha incorreta para um utilizador válido (CT-04.3). O CT-04.1 testa o preenchimento obrigatório e o CT-04.4 comprova a omissão segura da senha na devolução dos dados do funcionário, mantendo o payload leve e seguro, além de confirmar a correta geração do token JWT.
