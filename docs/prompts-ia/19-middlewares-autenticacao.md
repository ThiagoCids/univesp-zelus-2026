# 19 - Middlewares de Autenticação

## Objetivo
Construir a camada de segurança do projeto ZELUS protegendo rotas através de middlewares de autenticação (validação do JWT) e autorização (validação de privilégios).

## Prompt do Usuário
O nosso código está salvo e versionado. O próximo passo do projeto ZELUS é construir a camada de segurança para proteger as nossas rotas: os Middlewares de Autenticação.

Por favor, apresente um plano de ação detalhado que inclua:

A criação do ficheiro backend/src/middlewares/authMiddleware.js.

A implementação da função verificarToken:
- Extrair o token do header Authorization (formato Bearer).
- Se não houver token, retornar 401 Unauthorized com { sucesso: false, mensagem: 'Acesso negado. Token não fornecido.' }.
- Utilizar jwt.verify com process.env.JWT_SECRET. Se falhar, retornar 401 Unauthorized com { sucesso: false, mensagem: 'Token inválido ou expirado.' }.
- Se sucesso, adicionar os dados decodificados (id, tipo) ao objeto da requisição (req.usuario = decoded) e chamar next().

A implementação da função verificarFuncionario:
- Deve ser usada após o verificarToken.
- Verifica se req.usuario.tipo === 'funcionario'. Se não for, retorna 403 Forbidden com { sucesso: false, mensagem: 'Acesso restrito. Requer privilégios de funcionário.' }. Se for, chama next().

A criação do ficheiro docs/prompts-ia/19-middlewares-autenticacao.md com o histórico e o raciocínio deste prompt.

Apresente APENAS o plano de ação e o código proposto para a minha validação. NÃO crie nenhum ficheiro, não altere documentos e não rode comandos antes da minha aprovação final.

## Raciocínio e Implementação
- **authMiddleware.js**: Criado na pasta `backend/src/middlewares/` utilizando a biblioteca `jsonwebtoken`.
- **verificarToken**: Middleware que lê o cabeçalho `Authorization`. Em caso de ausência ou formato diferente de `Bearer <token>`, bloqueia a requisição com o código de status HTTP `401`. Valida o token gerado com o `process.env.JWT_SECRET` e, caso passe, injeta os dados decodificados no objeto `req.usuario` (nomeadamente o ID e o tipo) para repasse à rota alvo ou middleware seguinte.
- **verificarFuncionario**: Middleware de autorização para controlo de acesso baseado no papel (RBAC). Acessa a informação pré-processada pela validação de token e verifica se a propriedade `tipo` do utilizador corresponde a `funcionario`. Caso não seja, retorna um erro de permissão com código HTTP `403`.
