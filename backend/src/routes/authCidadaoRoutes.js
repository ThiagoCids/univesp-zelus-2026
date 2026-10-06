const express = require('express');
const router = express.Router();
const authCidadaoController = require('../controllers/authCidadaoController');

// Rota para registrar um novo cidadão (munícipe)
// POST /api/auth/cidadao/registro
router.post('/registro', authCidadaoController.registrarCidadao);

module.exports = router;
