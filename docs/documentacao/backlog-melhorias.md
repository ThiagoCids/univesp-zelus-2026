# Backlog de Melhorias e Evolução (Roadmap ZELUS)

Este documento centraliza as ideias arquiteturais e funcionalidades estratégicas idealizadas durante o desenvolvimento. Estas melhorias estão mapeadas para fases futuras, garantindo que o escopo atual (Fase 1 - MVP) se mantenha focado e realista.

## 📌 Fase 2: Polimento e Experiência do Utilizador (UX)

### Item 1: Envio de E-mail com Protocolo de Abertura
**Problema Atual:** O Cidadão recebe o número de protocolo apenas no ecrã da aplicação após a abertura da solicitação. Se fechar a janela, pode perder o código de rastreamento.
**Solução Proposta:** 
Integrar um serviço transacional de e-mails (como **Resend**, **SendGrid** ou **Nodemailer** via SMTP).
* **Arquitetura:** Injetar na função `criarSolicitacao` uma rotina assíncrona que, logo após o sucesso no Supabase, dispare um e-mail HTML dinâmico para a conta do cidadão.
* **Benefício:** Reduz a ansiedade do munícipe e centraliza as provas de atendimento na caixa de entrada do utilizador.

---

## 📌 Fase 3: Evolução e Inteligência Coletiva

### Item 2: Sistema de Apoiadores (Upvote) para Ocorrências
**Problema Atual:** O filtro matemático de Haversine bloqueia aberturas duplicadas (raio de 10 metros). Isto impede spam, mas gera frustração caso o utilizador apenas queira reforçar que o problema continua e afeta muita gente.
**Solução Proposta:**
Criar a funcionalidade "Eu Também Sofro com Isto" (Apoiar Ocorrência).
* **Arquitetura:** 
  1. Quando a rota de criação disparar o erro `409 Conflict`, o backend deve retornar, juntamente com o erro, o `ID` da solicitação original existente no raio de 10 metros.
  2. O frontend apresentará a mensagem: *"Já existe um buraco reportado aqui! Deseja juntar a sua voz a esta reclamação?"*.
  3. Ao clicar em "Apoiar", o frontend chama uma nova rota `POST /api/solicitacoes/:id/apoiar`.
  4. Nova tabela necessária: `solicitacoes_apoios` (com `solicitacao_id` e `cidadao_id`), para evitar que a mesma pessoa apoie o mesmo buraco duas vezes.
* **Benefício:** A Prefeitura passa a ter um "Heatmap Social". Ocorrências com dezenas de "upvotes" devem ser promovidas a prioridade máxima no Painel Administrativo.
