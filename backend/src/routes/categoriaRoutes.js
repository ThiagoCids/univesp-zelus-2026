const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Protege a rota com o middleware verificarToken
router.get('/', verificarToken, categoriaController.listarCategorias);

module.exports = router;
