# 07 — Configuração de Segurança (Row Level Security - RLS)

**Data:** 2026-09-29  
**Fase:** Backend — Segurança da Base de Dados  
**Arquivo gerado:** `backend/src/database/rls.sql`

---

## Prompt Utilizado

> "Vamos configurar a segurança do nosso banco de dados (Row Level Security - RLS).
> Como teremos um backend próprio (Node.js) gerindo a autenticação (já que temos
> campos de senha nas tabelas), a estratégia será trancar o acesso público direto
> ao Supabase.
>
> Crie o arquivo `backend/src/database/rls.sql` habilitando o RLS em todas as
> tabelas e bloqueando acessos não autorizados, com políticas opcionais de leitura
> pública apenas para `categorias` e `subcategorias`."

---

## Estratégia de Segurança Adotada

### Modelo de Autenticação

O projeto ZELUS **não utiliza o Supabase Auth**. A autenticação é gerida
inteiramente pelo backend Node.js, que possui:

- Tabela própria `public.cidadaos` com campo `senha` (hash bcrypt)
- Tabela própria `public.funcionarios` com campo `senha` (hash bcrypt)
- O backend conecta-se ao Supabase usando a chave `service_role`

### Por que `service_role`?

A chave `service_role` **bypassa o RLS por design** no Supabase. Isso significa
que o backend tem acesso total e controlado, enquanto qualquer requisição direta
com a chave `anon` (pública) fica completamente bloqueada pelo RLS.

---

## Decisões de Segurança

| Decisão | Justificativa |
|---|---|
| RLS habilitado em **todas** as tabelas | Princípio de menor privilégio — fechar tudo por padrão |
| **Sem políticas** para `anon` nas tabelas sensíveis | Habilitar RLS sem política = acesso negado implicitamente ao `anon` |
| Backend usa `service_role` | Bypassa RLS e tem controlo total e seguro sobre os dados |
| Política de **leitura pública** em `categorias` | Dados não sensíveis; permite otimização futura do frontend |
| Política de **leitura pública** em `subcategorias` | Idem — útil para popular formulários sem passar pelo backend |
| Tabelas `cidadaos`, `funcionarios`, `solicitacoes`, `audit_logs` **totalmente fechadas** ao `anon` | Contêm dados pessoais (CPF, email, senha hash) — nunca devem ser expostas diretamente |

---

## Matriz de Acesso por Perfil

| Tabela | `anon` (público) | `service_role` (backend) |
|---|---|---|
| `cidadaos` | ❌ Bloqueado | ✅ Acesso total |
| `funcionarios` | ❌ Bloqueado | ✅ Acesso total |
| `categorias` | ✅ Apenas leitura | ✅ Acesso total |
| `subcategorias` | ✅ Apenas leitura | ✅ Acesso total |
| `solicitacoes` | ❌ Bloqueado | ✅ Acesso total |
| `audit_logs` | ❌ Bloqueado | ✅ Acesso total |

---

## Como Aplicar no Supabase

1. Aceder ao painel do Supabase → **SQL Editor**
2. Garantir que o `schema.sql` já foi executado antes deste script
3. Colar e executar o conteúdo de `rls.sql`
4. Verificar em **Authentication → Policies** que as políticas foram criadas

---

## Próximos Passos Sugeridos

- [ ] Executar `rls.sql` no SQL Editor do Supabase após o `schema.sql`
- [ ] Configurar a variável de ambiente `SUPABASE_SERVICE_ROLE_KEY` no backend
- [ ] Nunca expor a `service_role` key no frontend ou repositório público
- [ ] Considerar adicionar índices de performance (`07b-indexes.sql`)
- [ ] Seed inicial de categorias e subcategorias (`08-seed.sql`)
