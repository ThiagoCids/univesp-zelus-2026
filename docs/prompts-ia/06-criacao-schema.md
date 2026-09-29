# 06 — Criação do Schema SQL (Supabase/PostgreSQL)

**Data:** 2026-09-29  
**Fase:** Backend — Definição da Base de Dados  
**Arquivo gerado:** `backend/src/database/schema.sql`

---

## Prompt Utilizado

> "O nosso diagrama de banco de dados (ERD) foi validado e já está no GitHub.
> Agora precisamos criar o script SQL real para o Supabase (PostgreSQL)
> refletindo a UX acordada (incluindo o campo opcional de ponto de referência).
>
> Por favor, crie o arquivo `backend/src/database/schema.sql` com o seguinte
> conteúdo estritamente (sem alterar chaves, tipos ou adicionar colunas extras):
> [SQL incluído no prompt]"

---

## Decisões Tomadas

| Decisão | Justificativa |
|---|---|
| Extensão `uuid-ossp` habilitada | Necessária para `uuid_generate_v4()` no Supabase/PostgreSQL |
| `ponto_referencia VARCHAR(255)` sem `NOT NULL` | Campo **opcional** conforme UX acordada — o cidadão pode ou não informar |
| `numero VARCHAR(20)` sem `NOT NULL` | Campo opcional — endereços nem sempre têm número |
| `latitude` e `longitude` como `DECIMAL` sem `NOT NULL` | Geolocalização é capturada quando disponível, não obrigatória |
| `foto_url VARCHAR(512)` sem `NOT NULL` | Foto é opcional no fluxo de abertura de solicitação |
| `funcionario_id` na `solicitacoes` com `ON DELETE SET NULL` | Solicitação não deve ser perdida se funcionário for removido |
| `ON DELETE RESTRICT` em `cidadao_id` e `subcategoria_id` | Impede exclusão acidental de dados vinculados a solicitações ativas |
| `ON DELETE CASCADE` em `subcategorias → categorias` | Subcategorias perdem sentido sem a categoria pai |
| `ON DELETE CASCADE` em `audit_logs → solicitacoes` | Logs são vinculados ao ciclo de vida da solicitação |
| `status DEFAULT 'Pendente'` | Estado inicial padrão para toda nova solicitação |
| Timestamps em `UTC` com `timezone('utc'::text, now())` | Padrão Supabase — consistência em ambientes multi-região |
| `updated_at` apenas em `solicitacoes` | Única tabela com ciclo de vida mutável (mudanças de status) |

---

## Tabelas Criadas

- `public.cidadaos` — Cidadãos registados na plataforma
- `public.funcionarios` — Funcionários da prefeitura
- `public.categorias` — Categorias de problemas urbanos (ex: Iluminação, Limpeza)
- `public.subcategorias` — Subcategorias vinculadas a uma categoria
- `public.solicitacoes` — Solicitações de serviço abertas pelos cidadãos
- `public.audit_logs` — Histórico de ações realizadas sobre as solicitações

---

## Próximos Passos Sugeridos

- [ ] Aplicar o schema no Supabase via SQL Editor ou Migration
- [ ] Configurar Row Level Security (RLS) para as tabelas sensíveis
- [ ] Criar índices de performance (ex: `cidadao_id`, `status`, `protocolo`)
- [ ] Seed inicial de categorias e subcategorias
