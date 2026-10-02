# 08 — Seed de Dados: Categorias e Subcategorias

**Data de criação:** 2026-10-02  
**Etapa do projeto:** Pós-schema e pós-RLS  
**Arquivo gerado:** `backend/src/database/seed.sql`  
**Autor do prompt:** Thiago Cid (via Antigravity IDE)

---

## Prompt Original

> "O nosso commit da fundação (schema e RLS) foi realizado com sucesso e o banco está seguro. O próximo passo lógico é o Seed de Dados. Precisamos preencher as tabelas categorias e subcategorias com as opções reais para a interface do aplicativo.
>
> Apresente um plano de ação para criar o arquivo backend/src/database/seed.sql contendo os comandos INSERT em SQL (lembrando de ligar corretamente os UUIDs das chaves estrangeiras) para popular as seguintes opções exatas da nossa regra de negócio:
>
> Categoria: 'Asfalto' (adicione um nome de ícone coerente)
> Subcategoria: 'Buraco'
>
> Categoria: 'Bueiro / Boca de lobo' (adicione um nome de ícone coerente)
> Subcategoria: 'Entupido'
> Subcategoria: 'Tampa quebrada / sem tampa'
>
> O plano deve incluir, obrigatoriamente, a criação do arquivo de documentação docs/prompts-ia/08-seed-categorias.md, contendo este prompt e a explicação detalhada desta etapa de semeadura."

---

## O que é Semeadura (Seed) de Banco de Dados?

Semeadura é o processo de **popular o banco de dados com dados de domínio estáticos** — ou seja, dados que definem as opções e regras de negócio da aplicação, e que não são gerados pelos usuários finais.

Diferente dos dados transacionais (solicitações criadas por cidadãos), os dados de seed são **pré-definidos pela equipe de desenvolvimento** e precisam existir no banco antes que qualquer usuário possa interagir com a aplicação.

### Por que é uma etapa separada do Schema?

| Etapa        | O que faz                                         | Quando rodar          |
|--------------|---------------------------------------------------|-----------------------|
| `schema.sql` | Cria a estrutura: tabelas, colunas, tipos, FKs    | Uma vez, no início    |
| `rls.sql`    | Define as regras de segurança (quem pode o quê)   | Logo após o schema    |
| `seed.sql`   | Preenche as tabelas com dados de domínio reais    | Após schema + RLS     |

Separar o seed do schema mantém cada arquivo com **uma única responsabilidade**, facilita a manutenção e permite re-executar o seed sem recriar a estrutura.

---

## Dados Inseridos

### Categorias

| UUID Fixo                                | Nome                   | Ícone       |
|------------------------------------------|------------------------|-------------|
| `a1b2c3d4-0001-4000-8000-000000000001`  | Asfalto                | `road-damage` |
| `a1b2c3d4-0002-4000-8000-000000000002`  | Bueiro / Boca de lobo  | `drain`       |

### Subcategorias

| UUID Fixo                                | Nome                        | Categoria Pai          |
|------------------------------------------|-----------------------------|------------------------|
| `b1b2c3d4-0001-4000-8000-000000000001`  | Buraco                      | Asfalto                |
| `b1b2c3d4-0002-4000-8000-000000000002`  | Entupido                    | Bueiro / Boca de lobo  |
| `b1b2c3d4-0003-4000-8000-000000000003`  | Tampa quebrada / sem tampa  | Bueiro / Boca de lobo  |

---

## Decisões de Design

### 1. UUIDs Fixos vs. UUIDs Gerados Dinamicamente

**Problema:** A tabela `subcategorias` possui uma FK (`categoria_id`) que referencia `categorias(id)`. Se os UUIDs das categorias fossem gerados dinamicamente com `uuid_generate_v4()` no momento do INSERT, seria impossível referenciá-los nos INSERTs das subcategorias dentro do mesmo script, sem fazer uma sub-query extra.

**Solução adotada:** Declarar UUIDs fixos e literais como variáveis PL/pgSQL no início do bloco `DO $$`. Isso permite:
- Usar `v_cat_asfalto` tanto no INSERT de `categorias` quanto no INSERT de `subcategorias`.
- Garantir que o mesmo UUID seja usado em todos os ambientes (dev, staging, produção).
- Tornar o arquivo auditável: qualquer desenvolvedor pode consultar a tabela e saber exatamente qual UUID corresponde a qual categoria.

### 2. Estratégia de Idempotência

O arquivo começa com um bloco de `DELETE` que remove **apenas os registros gerenciados por este seed** (usando os UUIDs fixos como chave). Isso garante que:
- O arquivo pode ser re-executado quantas vezes for necessário sem gerar duplicatas.
- Dados inseridos por usuários reais (com UUIDs diferentes) não são afetados.
- A ordem do DELETE respeita a dependência de FK: subcategorias são apagadas antes das categorias.

### 3. Justificativa dos Ícones

Os nomes de ícones seguem o padrão da biblioteca **MaterialCommunityIcons**, que é a biblioteca de ícones padrão usada com Expo e React Native no projeto ZELUS.

| Ícone         | Justificativa                                                                 |
|---------------|-------------------------------------------------------------------------------|
| `road-damage` | Representa visualmente uma via com dano ou irregularidade na superfície       |
| `drain`       | Representa uma boca de lobo / bueiro / grelha de captação de água pluvial     |

### 4. Bloco PL/pgSQL `DO $$`

O bloco `DO $$` (bloco anônimo de PL/pgSQL) foi escolhido por permitir declaração de variáveis com `DECLARE` e lógica procedural, sem precisar criar uma função persistente no banco. É a forma mais limpa e portável de executar um seed parametrizado no PostgreSQL/Supabase.

---

## Como Executar

### Via Supabase SQL Editor (recomendado)

1. Acesse o painel do projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** no menu lateral
3. Cole o conteúdo de `backend/src/database/seed.sql`
4. Clique em **Run**
5. Verifique o aviso de sucesso: `Seed concluido com sucesso: 2 categorias e 3 subcategorias inseridas.`

### Via psql (linha de comando)

```bash
psql -h <host> -U postgres -d postgres -f backend/src/database/seed.sql
```

---

## Verificação Pós-Seed

Após executar, rode as queries de verificação para confirmar os dados:

```sql
-- Verificar categorias
SELECT id, nome, icone FROM public.categorias ORDER BY nome;

-- Verificar subcategorias com join na categoria pai
SELECT
    s.nome AS subcategoria,
    c.nome AS categoria,
    c.icone
FROM public.subcategorias s
JOIN public.categorias c ON c.id = s.categoria_id
ORDER BY c.nome, s.nome;
```

**Resultado esperado:**

| subcategoria                | categoria              | icone       |
|-----------------------------|------------------------|-------------|
| Buraco                      | Asfalto                | road-damage |
| Entupido                    | Bueiro / Boca de lobo  | drain       |
| Tampa quebrada / sem tampa  | Bueiro / Boca de lobo  | drain       |

---

## Próximas Etapas

Com as tabelas de domínio populadas, a próxima etapa lógica é o desenvolvimento das **rotas de API** que expõem estas categorias e subcategorias para o aplicativo mobile consumir no momento do cadastro de uma nova solicitação.
