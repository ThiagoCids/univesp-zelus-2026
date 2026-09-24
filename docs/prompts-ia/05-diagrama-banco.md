# 05 — Diagrama de Banco de Dados (ERD)

## Prompt Utilizado

> "O aplicativo possui um sistema de cadastro e login próprio para duas
> entidades distintas (Munícipes e Funcionários), além de uma UX baseada em
> botões e gamificação. O código Mermaid do ERD DEVE conter EXATAMENTE estas
> tabelas e colunas, sem adicionar nem remover nada."

## O que foi feito

- Criado `docs/documentacao/diagrama-banco.md` com:
  - Descrição do fluxo UX (dois sistemas de login + botões + gamificação)
  - Diagrama ERD em Mermaid com as 6 tabelas definidas pelo time
- Criado este ficheiro de registo histórico em `docs/prompts-ia/`

## Tabelas documentadas

| Tabela | Papel no sistema |
|---|---|
| `CIDADAOS` | Cadastro e login do munícipe; acumula pontos |
| `FUNCIONARIOS` | Cadastro e login da prefeitura |
| `CATEGORIAS` | Base dos botões de seleção (com ícone) |
| `SUBCATEGORIAS` | Segundo nível de seleção, ligado à categoria |
| `SOLICITACOES` | Tabela central; gera protocolo único e armazena evidência |
| `AUDIT_LOGS` | Rastreabilidade de cada mudança de status |

## Data

2026-09-24
