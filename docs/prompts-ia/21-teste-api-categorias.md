# 21 - Teste API Categorias (Menu de Problemas)

## Objetivo
Criar e automatizar o plano de testes (QA Test 05) para garantir a segurança e o correto funcionamento da rota protegida `/api/categorias`.

## Prompt do Usuário
A rota do Menu de Problemas (Categorias) foi perfeitamente implementada e protegida! Seguindo a nossa metodologia rigorosa, precisamos validar esta entrega com o QA Test 05 antes de prosseguir.

Por favor, apresente um plano de ação detalhado que inclua:
Atualização do ficheiro docs/documentacao/registro-testes-backend.md adicionando a secção 'Teste 05 — Rota GET /api/categorias (Protegida)' e atualizando o sumário.
Definição dos seguintes Casos de Teste (com status ⏳ Pendente):
CT-05.1: Acesso à rota sem token no header Authorization (Esperado: 401 Unauthorized e sucesso: false).
CT-05.2: Acesso com token inválido ou forjado (Esperado: 401 Unauthorized e sucesso: false).
CT-05.3: Acesso com token válido (Esperado: 200 OK, retornando sucesso: true e os dados: array de categorias com as suas subcategorias aninhadas).
Criação do ficheiro docs/prompts-ia/21-teste-api-categorias.md contendo este prompt e o raciocínio destes testes.
Criação de um script temporário em Node.js (temp-teste-categorias.js) que automatize este teste. O script deve:
Fazer um POST para http://localhost:3001/api/auth/funcionario/login usando o CPF '99988877766' e a senha 'senhaPrefeitura123' para obter um token JWT real.
Disparar um GET para http://localhost:3001/api/categorias simulando o CT-05.1 (sem token).
Disparar o GET simulando o CT-05.2 (com um token inventado).
Disparar o GET simulando o CT-05.3 (passando o token real no header Authorization: Bearer <token>) e imprimir a árvore de categorias no console.

Apresente APENAS o plano de ação, a estrutura da documentação e o código do script temporário. NÃO altere documentos, não crie ficheiros e não rode o script antes da minha aprovação final.

## Raciocínio e Implementação
1. **Documentação de Testes (`registro-testes-backend.md`)**: A matriz de testes foi ampliada com o Bloco 05, cobrindo cenários com tokens ausentes, corrompidos e válidos para garantir a consistência das rotas protegidas.
2. **Script de Teste (`temp-teste-categorias.js`)**: Optou-se por utilizar a API nativa `fetch` para criar um fluxo automatizado que, primeiro, obtém um JWT legítimo por meio de credenciais válidas do funcionário de teste, e depois simula sucessivamente os três testes estipulados na matriz de QA.
