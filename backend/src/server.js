// ==============================================================
// Arquivo: server.js  —  Ponto de entrada do Backend ZELUS
// ==============================================================
// Este é o primeiro arquivo executado quando o servidor inicia.
// Ele configura o Express e "escuta" requisições na porta definida.
//
// ATENÇÃO: Este arquivo ainda não contém lógica funcional.
// Ele serve como esqueleto documentado para a próxima etapa.
// ==============================================================

// -- Importação do framework Express --
// O Express é uma biblioteca que facilita a criação de servidores HTTP em Node.js.
// "require" é a forma do Node.js de importar módulos externos.
// const express = require('express');

// -- Importação do dotenv --
// O dotenv lê o arquivo .env e disponibiliza as variáveis no código
// através de "process.env.NOME_DA_VARIAVEL".
// require('dotenv').config();

// -- Importação do CORS --
// CORS (Cross-Origin Resource Sharing) permite que o frontend
// (rodando em localhost:3000) faça requisições ao backend (localhost:3001).
// const cors = require('cors');

// -- Criação da instância do servidor Express --
// "app" é o nosso servidor. Todas as rotas e configurações serão
// adicionadas a este objeto.
// const app = express();

// -- Definição da porta do servidor --
// Lê a porta do arquivo .env, ou usa 3001 como valor padrão.
// const PORT = process.env.PORT || 3001;

// ==============================================================
// MIDDLEWARES GLOBAIS
// Middlewares são funções que "interceptam" cada requisição antes
// de ela chegar na rota final. São como porteiros do servidor.
// ==============================================================

// Habilita o CORS para aceitar requisições do frontend
// app.use(cors());

// Habilita o servidor a entender JSON no corpo das requisições
// app.use(express.json());

// ==============================================================
// ROTAS
// As rotas serão importadas de arquivos separados em /src/routes/
// Exemplo: app.use('/api/ocorrencias', ocorrenciasRouter);
// ==============================================================

// -- Rota de teste para confirmar que o servidor está no ar --
// app.get('/', (req, res) => {
//   res.json({ mensagem: 'Servidor ZELUS funcionando!' });
// });

// ==============================================================
// INICIALIZAÇÃO DO SERVIDOR
// ==============================================================

// Inicia o servidor na porta definida e exibe uma mensagem no terminal
// app.listen(PORT, () => {
//   console.log(`Servidor ZELUS rodando em http://localhost:${PORT}`);
// });
