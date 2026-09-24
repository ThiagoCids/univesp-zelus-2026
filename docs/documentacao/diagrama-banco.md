# Diagrama de Entidade-Relacionamento — Banco de Dados ZELUS

## Sobre o Fluxo

O ZELUS possui dois sistemas de acesso independentes: um para **Munícipes** e
outro para **Funcionários da Prefeitura**. A experiência do munícipe é baseada
em **botões de categoria com ícones**, tornando o reporte intuitivo e sem
formulários complexos.

O fluxo central é:

1. **Munícipe cadastra-se e faz login** com e-mail e senha.
2. Seleciona a ocorrência através de **botões de Categoria → Subcategoria**,
   anexa uma foto como evidência e confirma o endereço.
3. O sistema **gera um protocolo único** — o munícipe acumula **pontos** a
   cada solicitação (gamificação).
4. O **Funcionário** recebe a solicitação (inicialmente sem dono), atribui-a e
   atualiza o status. Cada mudança é gravada automaticamente no **Audit Log**.

---

## Diagrama ERD

```mermaid
erDiagram
    CIDADAOS {
        uuid        id              PK
        varchar     nome_completo
        varchar     cpf             UK
        varchar     email           UK
        varchar     whatsapp
        varchar     senha
        int         pontos
        timestamp   created_at
    }

    FUNCIONARIOS {
        uuid        id              PK
        varchar     nome_completo
        varchar     matricula_cpf   UK
        varchar     email           UK
        varchar     senha
        timestamp   created_at
    }

    CATEGORIAS {
        uuid        id              PK
        varchar     nome
        varchar     icone
        timestamp   created_at
    }

    SUBCATEGORIAS {
        uuid        id              PK
        uuid        categoria_id    FK
        varchar     nome
        timestamp   created_at
    }

    SOLICITACOES {
        uuid        id              PK
        varchar     protocolo       UK
        uuid        cidadao_id      FK
        uuid        subcategoria_id FK
        uuid        funcionario_id  FK
        varchar     rua
        varchar     numero
        varchar     bairro
        varchar     cidade
        decimal     latitude
        decimal     longitude
        varchar     foto_url
        varchar     status
        timestamp   created_at
        timestamp   updated_at
    }

    AUDIT_LOGS {
        uuid        id              PK
        uuid        solicitacao_id  FK
        uuid        funcionario_id  FK
        varchar     acao
        jsonb       dados_anteriores
        jsonb       dados_novos
        timestamp   created_at
    }

    CIDADAOS      ||--o{ SOLICITACOES  : "abre"
    CATEGORIAS    ||--|{ SUBCATEGORIAS : "possui"
    SUBCATEGORIAS ||--o{ SOLICITACOES  : "classifica"
    FUNCIONARIOS  ||--o{ SOLICITACOES  : "atende"
    SOLICITACOES  ||--o{ AUDIT_LOGS    : "registra"
    FUNCIONARIOS  ||--o{ AUDIT_LOGS    : "executa"
```
