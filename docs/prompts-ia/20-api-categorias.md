# 20 - API de Categorias (Menu de Problemas)

## Objetivo
Implementar as rotas e o controlador responsáveis pela listagem do "Menu de Problemas", retornando as categorias e as suas respetivas subcategorias a partir da base de dados.

## Prompt do Usuário
Os middlewares de segurança foram criados com sucesso. O nosso próximo passo é implementar o Menu de Problemas, ou seja, as Rotas de Categorias.

Por favor, apresente um plano de ação detalhado que inclua:

A criação do ficheiro backend/src/controllers/categoriaController.js:
- Função listarCategorias(req, res).
- Utilizar o supabaseClient para buscar todas as categorias e suas respectivas subcategorias. (Dica de Supabase: usar .select('id, nome, subcategorias(id, nome)')).
- Seguir rigorosamente o padrão de resposta JSON: { sucesso: true, dados: data } para status 200, e { sucesso: false, mensagem: 'Erro interno...' } no catch (status 500).

A criação do ficheiro backend/src/routes/categoriaRoutes.js:
- Importar o middleware verificarToken de ../middlewares/authMiddleware.
- Definir o endpoint GET / apontando para a função listarCategorias, passando pelo middleware verificarToken.

A edição aditiva do ficheiro backend/src/server.js:
- Importar categoriaRoutes.
- Registar a rota usando app.use('/api/categorias', categoriaRoutes).

A criação do ficheiro docs/prompts-ia/20-api-categorias.md com este prompt e o raciocínio estruturado.

Apresente APENAS o plano de ação e os códigos propostos para a minha validação. NÃO crie nenhum ficheiro e não altere o server.js antes da minha aprovação final.

## Raciocínio e Implementação
- **categoriaController.js**: Centraliza a lógica de busca de dados no Supabase. Utilizou-se a funcionalidade relacional da API do Supabase (`.select('id, nome, subcategorias(id, nome)')`) para buscar categorias e as suas subcategorias numa única requisição otimizada. Implementaram-se blocos `try/catch` para garantir retornos consistentes no formato estipulado para a API. A importação foi corrigida para usar `const { supabaseClient } = require('../config/supabase');` de acordo com a arquitetura do projeto.
- **categoriaRoutes.js**: Define o endpoint GET para a raiz das categorias, garantindo a injeção do middleware `verificarToken` para restringir o acesso apenas a utilizadores autenticados.
- **server.js**: Atualizado de forma aditiva para montar a rota das categorias sob o prefixo `/api/categorias`.
