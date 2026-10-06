const express = require('express');
const router = express.Router();
const { loginFuncionario } = require('../controllers/authFuncionarioController');

// POST /api/auth/funcionario/login
router.post('/login', loginFuncionario);

module.exports = router;
