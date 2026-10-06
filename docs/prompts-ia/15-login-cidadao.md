# 15 — Implementação da Rota de Login de Cidadão

**Data:** 2026-10-06  
**Fase:** Backend — Autenticação (Login)  
**Arquivo criado:** `docs/prompts-ia/15-login-cidadao.md`  
**Arquivos editados:** `backend/.env.example`, `backend/src/controllers/authCidadaoController.js`, `backend/src/routes/authCidadaoRoutes.js`  

---

## Prompt Utilizado

> "O cadastro do Cidadão está finalizado e a salvo no GitHub. O próximo passo lógico é permitir que esse cidadão faça Login no aplicativo. Vamos trabalhar em passos estritos.
> 
> Por favor, apresente um plano de ação detalhado para criar a rota de Login. O plano deve incluir:
> 
> A instalação da biblioteca jsonwebtoken (para gerarmos o token de sessão da API).
> 
> A edição do arquivo backend/.env.example para incluir a variável JWT_SECRET. (Adicione uma nota no plano me lembrando de colocar um segredo qualquer no meu arquivo .env local).
> 
> A edição aditiva do arquivo backend/src/controllers/authCidadaoController.js: Adição da função loginCidadao. Esta função recebe (cpf, senha) via req.body. Deve buscar o usuário na tabela cidadaos usando o supabaseAdmin (para bypassar o RLS). Deve comparar as senhas usando bcrypt.compare. Se sucesso, deve gerar um token JWT com expiração de 7 dias e retornar o token junto com os dados do cidadão (omitindo a senha).
> 
> A edição aditiva do arquivo backend/src/routes/authCidadaoRoutes.js: Definindo o endpoint POST /login apontando para a nova função.
> 
> A criação do arquivo de documentação docs/prompts-ia/15-login-cidadao.md contendo este prompt e o plano estruturado.
> 
> Apresente APENAS o plano de ação e os códigos propostos para minha validação. NÃO crie, não edite nenhum arquivo e não execute instalações antes da minha aprovação final."

---

## Plano de Ação Estruturado e Decisões

1. **Gestão de Sessão (`jsonwebtoken`)**: O JWT foi eleito para gestão do estado (*stateless* auth).
2. **Configuração (`JWT_SECRET`)**: Registado o campo para variável de ambiente necessária à assinatura das chaves (a responsabilidade pelo segredo local recai sobre o operador).
3. **Controller de Login (`loginCidadao`)**:
   - Resgata os dados pelo `cpf` via `supabaseAdmin` para superar limitações do RLS sobre leitura de credenciais.
   - Compara o hash via `bcrypt.compare`.
   - Gera payload (`{ id, tipo: 'cidadao' }`) válido por 7 dias.
   - Remove expressamente a hash da senha antes de expedir a resposta HTTP 200.
4. **Roteamento**: Disponibilizou a URL de endpoint `/api/auth/cidadao/login`.
