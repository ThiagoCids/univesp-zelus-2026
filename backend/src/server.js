// ==============================================================
// Arquivo: server.js  —  Ponto de entrada do Backend ZELUS
// ==============================================================
// Este é o primeiro arquivo executado quando o servidor inicia.
// Ele configura o Express, os middlewares globais e as rotas,
// e por fim coloca o servidor para "escutar" requisições.
// ==============================================================

// -- 1. Carregamento das variáveis de ambiente --
// DEVE ser a primeira instrução. Lê o arquivo .env e injeta
// todas as variáveis em process.env antes de qualquer outro import.
require('dotenv').config();

// -- 2. Importação das dependências --
const express = require('express');
const cors    = require('cors');

// -- 3. Criação da instância do servidor --
// "app" é o nosso servidor Express. Todas as rotas e
// configurações serão registradas neste objeto.
const app = express();

// -- 4. Porta do servidor --
// Lê PORT do arquivo .env; usa 3001 como fallback para desenvolvimento.
const PORT = process.env.PORT || 3001;

// ==============================================================
// MIDDLEWARES GLOBAIS
// Middlewares são funções executadas em TODA requisição antes
// de ela chegar na rota final — como porteiros do servidor.
// ==============================================================

// Habilita CORS: permite que o frontend (ex: localhost:3000)
// faça requisições a este servidor (localhost:3001).
app.use(cors());

// Habilita o parsing de JSON no corpo (body) das requisições.
// Sem isso, req.body chegaria como undefined em POSTs com JSON.
app.use(express.json());

// ==============================================================
// ROTAS
// ==============================================================

// -- Rota de Saúde (Health Check) --
// Endpoint de teste para confirmar que o servidor está no ar.
// Acesse: GET http://localhost:3001/api/status
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status:    'ok',
    projeto:   'ZELUS',
    versao:    '1.0.0',
    ambiente:  process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// -- Rota raiz (opcional) --
// Redireciona a raiz para o endpoint de status.
app.get('/', (req, res) => {
  res.redirect('/api/status');
});

// ==============================================================
// INICIALIZAÇÃO DO SERVIDOR
// ==============================================================

// app.listen() coloca o servidor para "escutar" requisições na PORT.
// A função de callback é executada UMA VEZ assim que o servidor sobe.
app.listen(PORT, () => {
  console.log('======================================================');
  console.log(`  Servidor ZELUS rodando em: http://localhost:${PORT}`);
  console.log(`  Endpoint de status:        http://localhost:${PORT}/api/status`);
  console.log('======================================================');
});
