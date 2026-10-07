# Teste de API: Homologação Final do CRUD (QA Test 08)

## Prompt Original
A rota de Histórico do Cidadão foi injetada com sucesso! Vamos coroar o núcleo da nossa API com o épico QA Test 08, validando simultaneamente o isolamento de dados do Cidadão e a nova regra de negócio de Descarte da Prefeitura.

Por favor, apresente um plano de ação detalhado que inclua:

Atualização do ficheiro docs/documentacao/registro-testes-backend.md adicionando a secção 'Teste 08 — Histórico Privado e Validação de Descarte' com 3 Casos de Teste (status ⏳ Pendente):

CT-08.1: Histórico Privado. Acessar GET /api/solicitacoes/minhas com token de Cidadão (Esperado: 200 OK e a listagem exclusiva das suas solicitações).

CT-08.2: Descarte Inválido. Acessar PATCH /api/solicitacoes/:id/status com token de Funcionário, passando { "status": "Descartada" } sem justificativa (Esperado: 400 Bad Request).

CT-08.3: Descarte Válido. Acessar a mesma rota PATCH com token de Funcionário, passando o status 'Descartada' E uma string válida em justificativa_status (Esperado: 200 OK).

Criação do ficheiro docs/prompts-ia/28-teste-api-final.md detalhando este teste E2E como a homologação final do CRUD.

Criação de um script Node.js (temp-teste-final.js) que automatize este fluxo:

Faça login como Cidadão (CPF '12345678901' / Senha 'senhaSecreta123') para obter tokenCidadao.

Faça login como Funcionário (CPF '99988877766' / Senha 'senhaPrefeitura123') para obter tokenFuncionario.

CT-08.1: Dispare um GET para /minhas usando o tokenCidadao.

Preparação: Dispare um GET para /admin usando o tokenFuncionario e extraia o ID do primeiro chamado listado (o nosso buraco de testes).

CT-08.2: Dispare um PATCH para o ID extraído usando o tokenFuncionario, tentando mudar para "Descartada" sem enviar o campo justificativa_status.

CT-08.3: Dispare um novo PATCH para o mesmo ID com o status "Descartada" e a justificativa "A rua consta como propriedade privada no plano diretor.".

Apresente APENAS o plano de ação, a estrutura da documentação e o código do script temporário. NÃO altere documentos e não crie ficheiros antes da minha aprovação final.

## Detalhamento do Teste E2E (End-to-End)
Este teste marca a homologação completa do ciclo de vida de uma Ocorrência no ZELUS, atestando simultaneamente o isolamento vertical dos dados (Cidadão) e as defesas algorítmicas finais contra manipulações horizontais (Funcionários).

1. **Blindagem de Privacidade (CT-08.1):** O Cidadão solicita o seu próprio histórico. O teste garante que o motor do `PostgREST` (via backend NodeJS) filtrou perfeitamente a base baseando-se unicamente no payload criptográfico do Token. Um Cidadão não vê denúncias de terceiros.
2. **Defesa Operacional (CT-08.2):** Focamo-nos num Teste Limite (*Boundary Test*). Simulamos uma falha humana (ou ato de negligência): um funcionário que tenta encerrar um chamado cega e muda. O estalo do `400 Bad Request` prova o valor da *Guard Clause* implementada no controlador, exigindo accountability.
3. **Resolução Plena e Auditada (CT-08.3):** A submissão com justificativa desata o nó. A ocorrência sofre mutação no banco para "Descartada", o texto é embebedado na coluna, e os "olhos passivos" da tabela `audit_logs` fixam o rasto para sempre, cumprindo os pergaminhos da administração pública moderna.
