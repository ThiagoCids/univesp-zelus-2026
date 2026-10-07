const express = require('express');
const router = express.Router();
const solicitacaoController = require('../controllers/solicitacaoController');

// Ajuste o caminho do middleware conforme a arquitetura exata do seu projeto
const { verificarToken, verificarFuncionario } = require('../middlewares/authMiddleware'); 

// ==========================================
// Rotas Públicas Autorizadas (Cidadão)
// ==========================================
router.post('/', verificarToken, solicitacaoController.criarSolicitacao);

// ==========================================
// Rotas Administrativas (Painel Prefeitura)
// ==========================================
router.get('/admin', verificarToken, verificarFuncionario, solicitacaoController.listarSolicitacoesAdmin);
router.patch('/:id/status', verificarToken, verificarFuncionario, solicitacaoController.atualizarStatus);

module.exports = router;
