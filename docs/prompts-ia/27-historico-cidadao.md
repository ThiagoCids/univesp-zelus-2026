# Histórico do Cidadão e Isolamento de Dados

## Prompt Original
A injeção foi perfeita! Para otimizarmos o nosso fluxo, vamos construir a Rota de Leitura do Cidadão (Histórico) primeiro. Depois, no QA Test 08, faremos a validação conjunta desta nova rota e da nova regra de descarte.

Por favor, apresente um plano de ação detalhado que inclua:

Edição do ficheiro backend/src/controllers/solicitacaoController.js:

Criar e exportar a função listarMinhasSolicitacoes(req, res).

Extrair o ID do cidadão através de req.usuario.id (injetado pelo middleware).

Fazer um SELECT na tabela solicitacoes filtrando estritamente os registos deste cidadão (.eq('cidadao_id', cidadao_id)).

Fazer o Join com subcategorias(nome) para que o frontend saiba qual é o problema reportado, sem precisar de enviar os dados do próprio cidadão novamente.

Ordenar por created_at de forma decrescente (mais recentes primeiro).

Retornar 200 OK com os dados.

Edição do ficheiro backend/src/routes/solicitacaoRoutes.js:

Adicionar a rota GET /minhas protegida apenas pelo middleware verificarToken.

Nota de roteamento: Assegure-se de que a rota /minhas fique posicionada antes de qualquer rota que use parâmetros dinâmicos (/:id) para evitar colisões no Express.

Criação do ficheiro docs/prompts-ia/27-historico-cidadao.md:

Documentar este prompt e a lógica de isolamento de dados (Data Privacy), enfatizando como o filtro obrigatório no backend impede o vazamento de dados entre munícipes.

Apresente APENAS o plano de ação e os códigos propostos para a minha validação. NÃO edite nem crie nenhum ficheiro antes da minha aprovação final.

## Raciocínio Arquitetural

### Isolamento de Dados (Data Privacy By Design)
A Rota de Histórico (`GET /minhas`) é uma demonstração primária do conceito de *Privacy By Design*. Diferente de aplicações mais permissivas ou amadoras onde o frontend pode solicitar dados passando parâmetros injetáveis na URL (exemplo: `GET /solicitacoes?user_id=123`), o ZELUS delega a responsabilidade de "saber quem está a pedir" integralmente à criptografia do backend.

1. **Extração Blindada:** O ID do Cidadão não provém de parâmetros passíveis de manipulação por interceptores proxy (como *Burp Suite* ou *Postman*). É extraído do miolo do Token JWT (através de `req.usuario.id`) após passagem pela camada de segurança (Middleware).
2. **Filtro Inquebrável:** Ao encadearmos a instrução de base de dados `.eq('cidadao_id', cidadao_id)`, estabelecemos uma barreira instransponível ao nível de I/O. É logicamente impossível que um cidadão consiga varrer a base de dados em busca de reclamações de terceiros.
3. **Otimização Relacional (Payload Economy):** Se o cidadão requisita o próprio histórico, o frontend já possui os metadados pessoais no state global/cookie de login. Por isso, a rotina de *Join* (`.select`) ignora propositadamente o cruzamento pesado com a tabela `cidadaos`, focando-se apenas em cruzar dados úteis e não detidos localmente, como a taxonomia da denúncia (`subcategorias(nome)`).
