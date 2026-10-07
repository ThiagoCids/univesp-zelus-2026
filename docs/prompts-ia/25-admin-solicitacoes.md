# Painel Administrativo de Solicitações (Read & Update)

## Prompt Original
O nosso sistema de abertura está a salvo. Vamos iniciar a arquitetura do Painel Administrativo implementando as rotas de Read (Listar) e Update (Atualizar Status) para as Solicitações.

Lembre-se que estas rotas devem ser exclusivas para funcionários. Devemos utilizar o middleware verificarFuncionario (RBAC) e a tabela audit_logs para rastreabilidade.

Por favor, apresente um plano de ação detalhado que inclua:

Edição do ficheiro backend/src/controllers/solicitacaoController.js adicionando duas novas funções:

listarSolicitacoesAdmin(req, res): Fazer um SELECT na tabela solicitacoes, trazendo em conjunto os dados relacionais de cidadaos(nome_completo) e subcategorias(nome). Ordenar da mais recente para a mais antiga (created_at em ordem decrescente). Retornar 200 OK com os dados.

atualizarStatus(req, res): Receber o id da solicitação via parâmetro de URL (req.params.id) e o novo status via req.body. Atualizar o status na tabela solicitacoes. Após a atualização, inserir um registo na tabela audit_logs contendo o solicitacao_id, o funcionario_id (extraído do token via req.usuario.id) e a acao (ex: 'Status alterado para Concluída'). Retornar 200 OK com sucesso.

Edição do ficheiro backend/src/routes/solicitacaoRoutes.js:

Importar o middleware verificarFuncionario de ../middlewares/authMiddleware.

Adicionar a rota GET /admin protegida pelos middlewares verificarToken E verificarFuncionario apontando para listarSolicitacoesAdmin.

Adicionar a rota PATCH /:id/status protegida por verificarToken E verificarFuncionario apontando para atualizarStatus.

Criação do ficheiro docs/prompts-ia/25-admin-solicitacoes.md contendo este prompt e a explicação do uso de relacionamentos no Supabase e da rastreabilidade com a tabela de auditoria.

Apresente APENAS o plano de ação e os códigos propostos para a minha validação. NÃO edite nem crie nenhum ficheiro antes da minha aprovação final.

## Raciocínio Arquitetural

### Extração Relacional Simplificada (O poder do PostgREST)
A arquitetura do ZELUS apoia-se no Supabase (construído sobre PostgreSQL e PostgREST). Em rotas administrativas (Painel da Prefeitura) que agregam grandes volumes de dados de análise, escrever subqueries SQL longas e pesadas torna-se um gargalo de manutenção.

A função `listarSolicitacoesAdmin` tira partido das **Foreign Keys** previamente desenhadas na base de dados (`cidadao_id` ligado a `cidadaos`, `subcategoria_id` ligado a `subcategorias`). Ao solicitarmos `select('*, cidadaos(nome_completo)')`, o backend deforma elegantemente os registos estruturais num objeto JSON onde as entidades relacionadas já vêm aninhadas. Isto alivia o frontend (React) de ter de efetuar chamadas em cascata ou montar manualmente dados dispersos.

### Rastreabilidade e Auditoria (Accountability)
Num painel de gestão pública, a alteração de status de uma "Denúncia de Buraco" para "Concluída" não pode ser uma ação sem rosto.

A rota `atualizarStatus` não só obedece ao padrão REST alterando o documento visado usando o verbo `PATCH`, mas assegura um padrão vital de compliance e transparência governamental: a **auditoria atómica**. 

Sempre que a função muda o estado da tabela `solicitacoes`, extrai passivamente o `ID do Funcionário` que emitiu o JWT no momento do clique, inserindo um rastro permanente na tabela `audit_logs` anexando o que fez (ação), a que horas o fez, em qual documento o fez e quem o fez. Desta forma o ZELUS mantém um tracking rigoroso (responsabilização) de toda a atividade interna sem depender de logs de consola efémeros.
