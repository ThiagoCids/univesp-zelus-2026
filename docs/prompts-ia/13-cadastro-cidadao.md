# 13 — Implementação da Rota de Cadastro de Cidadão

**Data:** 2026-10-06  
**Fase:** Backend — Autenticação (Registro)  
**Arquivo criado:** `docs/prompts-ia/13-cadastro-cidadao.md`, `backend/src/controllers/authCidadaoController.js`, `backend/src/routes/authCidadaoRoutes.js`  
**Arquivo editado:** `backend/src/server.js`  

---

## Prompt Utilizado

> "Retomamos o projeto ZELUS. O nosso próximo passo é implementar a rota de Cadastro do Munícipe (Cidadão). Como o modelo de IA atual é diferente, vamos trabalhar em passos bem pequenos e estritos.
> 
> Por favor, apresente um plano de ação detalhado para criar a rota de registro. O plano deve incluir:
> 
> A instalação da biblioteca bcryptjs (para criptografia de senhas no backend).
> 
> Criação do arquivo backend/src/controllers/authCidadaoController.js: Deve conter a função registrarCidadao. Esta função recebe (nome_completo, cpf, email, whatsapp, senha) via req.body. Deve verificar se o CPF ou Email já existem usando o supabaseAdmin. Deve criptografar a senha com bcryptjs. Deve inserir o novo registro na tabela cidadaos usando o supabaseAdmin (pois o RLS bloqueia inserções públicas).
> 
> Criação do arquivo backend/src/routes/authCidadaoRoutes.js: Definindo o endpoint POST /registro.
> 
> Edição aditiva do backend/src/server.js: Registrando a rota em /api/auth/cidadao.
> 
> Criação do arquivo de documentação docs/prompts-ia/13-cadastro-cidadao.md contendo este prompt e o plano estruturado.
> 
> Apresente APENAS o plano de ação e os códigos propostos para minha validação. NÃO crie nenhum arquivo nem execute instalações antes da minha aprovação final."

---

## Plano de Ação Estruturado e Decisões

1. **Instalação do `bcryptjs`**: 
   - Escolhido o `bcryptjs` por ser uma implementação puramente em JavaScript (dispensando compilações do `node-gyp`), facilitando a compatibilidade cross-platform (Windows/Linux/Mac).
2. **Controller (`authCidadaoController.js`)**:
   - Desenvolvida a função `registrarCidadao` que recebe e valida campos essenciais.
   - Utilizado `supabaseAdmin` (chave *service_role*) para realizar a consulta de unicidade de `cpf` e `email`.
   - Utilizado `supabaseAdmin` para inserir os dados no banco, garantindo que o bloqueio do RLS a inserções públicas seja contornado de forma intencional e controlada pelo backend.
   - Omitida a devolução da senha no retorno para garantir a segurança.
3. **Roteamento (`authCidadaoRoutes.js` e `server.js`)**:
   - Rota `POST /registro` apontando para a função controladora.
   - Registrada no `server.js` na base `/api/auth/cidadao`.
