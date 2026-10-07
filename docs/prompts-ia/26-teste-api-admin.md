# Teste de API: Rotas Administrativas (QA Test 07)

## Prompt Original
A injeção do código administrativo foi um sucesso! Seguindo a nossa metodologia rigorosa, vamos homologar estas rotas com o QA Test 07.

Por favor, apresente um plano de ação detalhado que inclua:

Atualização do ficheiro docs/documentacao/registro-testes-backend.md adicionando a secção 'Teste 07 — Rotas Administrativas de Solicitações (Read e Update)' com 3 Casos de Teste (status ⏳ Pendente):

CT-07.1: Bloqueio de acesso cidadão. Tentar acessar GET /api/solicitacoes/admin com token de Cidadão (Esperado: 403 Forbidden).

CT-07.2: Listagem com sucesso. Acessar GET /api/solicitacoes/admin com token de Funcionário (Esperado: 200 OK e array com dados relacionais).

CT-07.3: Atualização de status. Acessar PATCH /api/solicitacoes/:id/status com token de Funcionário, passando { "status": "Em Andamento" } (Esperado: 200 OK).

Criação do ficheiro docs/prompts-ia/26-teste-api-admin.md detalhando este teste E2E.

Criação de um script Node.js (temp-teste-admin.js) que automatize este fluxo:

Faça login como Cidadão (CPF '12345678901' / Senha 'senhaSecreta123') para obter tokenCidadao.

Faça login como Funcionário (CPF '99988877766' / Senha 'senhaPrefeitura123') para obter tokenFuncionario.

Dispare o CT-07.1 usando o tokenCidadao na rota GET admin.

Dispare o CT-07.2 usando o tokenFuncionario na rota GET admin. Capture o id da primeira solicitação retornada no array de dados.

Dispare o CT-07.3 enviando um PATCH para a rota /:id/status (usando o ID capturado) com o corpo { "status": "Em Andamento" }, utilizando o tokenFuncionario.

Apresente APENAS o plano de ação, a estrutura da documentação e o código do script temporário. NÃO altere documentos e não crie ficheiros antes da minha aprovação final.

## Detalhamento do Teste E2E (End-to-End)
Este teste tem um duplo foco crítico para a integridade do sistema: a **validação da blindagem de papéis (RBAC)** e a **robustez da extração de dados compostos**.

A simulação decorre em três atos sequenciais:

1. **A Prova de Fogo do RBAC (CT-07.1):** Simula uma tentativa de acesso não autorizado. Um utilizador comum com token de segurança válido tenta consumir a listagem geral da Prefeitura. O sistema valida o JWT (reconhecendo o indivíduo), mas o segundo middleware (`verificarFuncionario`) analisa o payload e trava a requisição, retornando `403 Forbidden`. O painel administrativo permanece inexpugnável.

2. **A Lista Inteligente (CT-07.2):** O Funcionário autentica-se devidamente. Ao listar, em vez de receber apenas "IDs secos", o teste comprova que o backend explora nativamente os Joins do PostgREST. A API devolve de forma integrada o nome completo do Cidadão e a taxonomia da subcategoria, poupando a aplicação Frontend de disparar dezenas de pedidos secundários para montar a UI do painel.

3. **O Rastro Permanente e Auditoria (CT-07.3):** Como ato final, o script extrai proativamente um UUID de uma ocorrência recém-listada e injeta um `PATCH` para evoluir o status para "Em Andamento". O resultado 200 OK atesta dois triunfos mecânicos: a mutação física do dado na tabela principal e o não-bloqueio do fluxo aquando do registo paralelo da prova forense na tabela `audit_logs`.
