# 17 - Login do Funcionário da Prefeitura

## Prompts Originais

**Primeiro Prompt:**
> Retomamos o projeto ZELUS com a memória limpa e otimizada. O nosso próximo passo é implementar a rota de Login do Funcionário da Prefeitura. Vamos manter a nossa abordagem de passos curtos e estritos.
>
> Por favor, apresente um plano de ação detalhado para criar a rota de Login do Funcionário. O plano deve incluir:
>
> A criação do ficheiro backend/src/controllers/authFuncionarioController.js: Adição da função loginFuncionario. Esta função recebe (cpf, senha) via req.body. Deve procurar o utilizador na tabela funcionarios usando o supabaseAdmin (para bypass ao RLS). Deve comparar as senhas usando bcrypt.compare. Em caso de sucesso, deve gerar um token JWT (usando o process.env.JWT_SECRET) com expiração de 12 horas (o payload deve conter { id, tipo: 'funcionario', cargo }) e retornar o token junto com os dados do funcionário (omitindo a senha).
>
> A criação do ficheiro backend/src/routes/authFuncionarioRoutes.js: Definindo o endpoint POST /login apontando para a nova função.
>
> A edição aditiva do ficheiro backend/src/server.js: Registando a rota em /api/auth/funcionario.
>
> A criação do ficheiro de documentação docs/prompts-ia/17-login-funcionario.md contendo este prompt e o plano estruturado.
>
> Apresente APENAS o plano de ação e os códigos propostos para a minha validação. NÃO crie, não edite nenhum ficheiro e não execute comandos antes da minha aprovação final

**Segundo Prompt (Validação e Padronização):**
> O plano está aprovado estruturalmente, mas precisamos padronizar as respostas da API para manter a coerência com a rota do cidadão antes de você escrever os ficheiros.
>
> No ficheiro backend/src/controllers/authFuncionarioController.js, as respostas res.status().json() devem seguir rigorosamente este padrão:
> 
> Para erros (400, 401, 403, 500): return res.status(xxx).json({ sucesso: false, mensagem: 'Mensagem de erro aqui.' });
> 
> Para sucesso (200): return res.status(200).json({ sucesso: true, mensagem: 'Login realizado com sucesso.', token, dados: dadosFuncionario });
> (Nota: Troque a chave "error" por "mensagem" nos retornos falsos. Troque "message" por "mensagem" e "funcionario" por "dados" no retorno de sucesso).
> 
> Com esta única correção de padronização nas respostas do controller, você tem a minha aprovação final.
> Pode prosseguir e executar a criação dos ficheiros e a edição do server.js.

## Plano de Ação (Aprovado e Executado)

1. **Criar `backend/src/controllers/authFuncionarioController.js`**: Implementa a função `loginFuncionario`. Valida CPF e senha, consulta a tabela `funcionarios` via `supabaseAdmin` (bypass ao RLS), compara as senhas com `bcrypt` e gera um token JWT de 12 horas. As respostas JSON são padronizadas com as propriedades `sucesso`, `mensagem`, `token` e `dados`.
2. **Criar `backend/src/routes/authFuncionarioRoutes.js`**: Define o endpoint `POST /login` associado à função `loginFuncionario`.
3. **Editar `backend/src/server.js`**: Adiciona e regista a rota sob o caminho `/api/auth/funcionario`.
