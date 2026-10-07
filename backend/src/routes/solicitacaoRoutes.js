const express = require('express');
const router = express.Router();
const solicitacaoController = require('../controllers/solicitacaoController');

// Ajuste o caminho do middleware conforme a arquitetura exata do seu projeto
const { verificarToken } = require('../middlewares/authMiddleware'); 

// Rota para Abertura de Solicitação (protegida pelo middleware de autenticação)
router.post('/', verificarToken, solicitacaoController.criarSolicitacao);

module.exports = router;
