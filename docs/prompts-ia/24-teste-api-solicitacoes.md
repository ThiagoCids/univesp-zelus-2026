# Teste de API: Abertura de Solicitações (QA Test 06)

## Prompt Original
O banco de dados foi atualizado com a coluna descricao e está alinhado com o nosso Controller. Seguindo a nossa metodologia rigorosa, precisamos validar esta entrega com o QA Test 06.

Por favor, apresente um plano de ação detalhado que inclua:

Atualização do ficheiro docs/documentacao/registro-testes-backend.md adicionando a secção 'Teste 06 — Rota POST /api/solicitacoes (Abertura e Filtro 10m)' e atualizando o sumário.

Definição de 3 Casos de Teste (com status ⏳ Pendente):

CT-06.1: Criação de solicitação com sucesso (Esperado: 201 Created e o retorno do protocolo).

CT-06.2: Bloqueio do filtro anti-duplicidade (Esperado: 409 Conflict ao enviar as mesmas coordenadas).

CT-06.3: Criação de solicitação próxima, mas fora do raio de 10m (Esperado: 201 Created ao alterar levemente a latitude).

Criação do ficheiro docs/prompts-ia/24-teste-api-solicitacoes.md detalhando este teste E2E.

Criação de um script em Node.js (temp-teste-solicitacoes.js) que automatize este fluxo:

Faça login na rota /api/auth/cidadao/login (usando o CPF '12345678901' e a senha 'senha123' da nossa seed) para obter um Token de cidadão.

Dispare o CT-06.1 (POST) para /api/solicitacoes usando o subcategoria_id real de Buraco ('b1b2c3d4-0001-4000-8000-000000000000'). Coordenadas: latitude: -21.2345, longitude: -48.1234. Preencha a descricao e os campos de endereço (rua, numero, ponto_referencia, bairro, cidade) com dados fictícios de Pradópolis.

Dispare o CT-06.2 com a exata mesma requisição.

Dispare o CT-06.3 alterando apenas a latitude para -21.2350 (fora do raio de 10m).

Apresente APENAS o plano de ação, a estrutura da documentação e o código do script temporário. NÃO altere documentos e não crie ficheiros antes da minha aprovação final.

## Detalhamento do Teste E2E (End-to-End)
Este teste simula um cenário realístico na cidade de Pradópolis, validando não apenas a autorização do Cidadão, mas a precisão do algoritmo matemático do servidor.

A simulação é dividida em três atos críticos para a infraestrutura do sistema:

1. **A Descoberta Original (CT-06.1):** O cidadão autentica-se, adquire o seu `token` JWT de segurança e efetua uma denúncia de um buraco. O backend valida a subcategoria, processa as variáveis estruturadas de morada, verifica que o ponto geográfico é único (inexistência de registos pendentes até 10 metros) e efetua a gravação, devolvendo um protocolo.

2. **A Duplicação Bloqueada (CT-06.2):** Minutos depois, simula-se que outro cidadão no mesmo local tenta reportar o mesmo buraco. O teste dispara o exato mesmo payload. O servidor usa a função Haversine, descobre que há um reportado a 0 metros (0m < 10m) da mesma subcategoria, devolvendo proativamente um erro `409 Conflict`. A base de dados mantém-se limpa.

3. **O Segundo Problema (CT-06.3):** O cidadão reporta um novo buraco mais ao final da rua. A latitude é alterada de `-21.2345` para `-21.2350` — em coordenadas globais, esta diferença de `0.0005` graus representa uma distância física de aproximadamente 55 metros. Sendo 55m superior ao bloqueio de 10m, o servidor permite a inserção, gerando um novo `201 Created`.
