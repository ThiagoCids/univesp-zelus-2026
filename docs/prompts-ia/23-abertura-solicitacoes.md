# Abertura de Solicitações (CRUD - Create) e Filtro Espacial

## Ajuste de Schema e Regras de Negócio
Após uma auditoria ao schema da base de dados, a funcionalidade foi atualizada para adotar uma abordagem híbrida de engenharia de dados. Os endereços são submetidos desfragmentados (`rua`, `numero`, `ponto_referencia`, `bairro`, `cidade`), o campo `descricao` foi adicionado, e o estado inicial padrão na tabela `solicitacoes` é verificado contra `'Pendente'` em vez de `'Aberta'`.

## Raciocínio Arquitetural

### O Fluxo de Abertura (Create)
A abertura de uma solicitação no sistema Zelus não é um simples `INSERT` na base de dados. Consiste num processo de negócios que envolve validação espacial em tempo real e a geração de identificadores de acompanhamento.

O controlador está desenhado de forma sequencial e defensiva:
1. **Validação de Entrada:** Garante que as coordenadas geográficas, descrição e classificações de problema existem, assim como os dados estruturados de endereço.
2. **Validação de Negócio (Filtro Anti-Duplicidade):** Interroga o Supabase sobre problemas *idênticos* que se encontram `Pendente` ou `Em Andamento`.
3. **Fórmula de Haversine:** A matemática atua na memória do servidor para filtrar ocorrências a <= 10 metros.
4. **Geração de Protocolo:** Cria a "chave humana" (ex: ZELUS-20261007-1A2B).
5. **Persistência:** Inserção definitiva dos dados estruturados.

### A Escolha do Raio de 10 Metros
A limitação exata a 10 metros foi decidida para otimizar:
- **Precisão Realista dos Smartphones:** O GPS comum tem uma margem de imprecisão típica de 3 a 5 metros ao ar livre.
- **Eficiência Operacional:** Impede ativamente a acumulação massiva e o "spam acidental" no momento de crises pontuais.
- **Isolamento de Tipologia:** O bloqueio só atua sobre ocorrências *do mesmo tipo* (mesmo `subcategoria_id`), sendo viável reportar infraestruturas diferentes no mesmo raio de GPS.
