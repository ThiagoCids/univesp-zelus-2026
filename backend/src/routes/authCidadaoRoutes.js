const express = require('express');
const router = express.Router();
const authCidadaoController = require('../controllers/authCidadaoController');

// Rota para registrar um novo cidadão (munícipe)
// POST /api/auth/cidadao/registro
router.post('/registro', authCidadaoController.registrarCidadao);

// Rota para login do cidadão
// POST /api/auth/cidadao/login
router.post('/login', authCidadaoController.loginCidadao);

module.exports = router;
