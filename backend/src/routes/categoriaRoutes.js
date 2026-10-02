// ==============================================================
// Arquivo: categoriaRoutes.js
// Caminho: backend/src/routes/categoriaRoutes.js
// Descricao: Definicao das rotas do recurso Categorias.
// ==============================================================
// O prefixo base "/api/categorias" e registado no server.js.
// Este ficheiro define apenas os sub-caminhos relativos ao
// recurso, mantendo cada ficheiro focado numa unica entidade.
// ==============================================================

const express           = require('express');
const router            = express.Router();
const { getCategorias } = require('../controllers/categoriaController');

// GET /api/categorias
// Lista todas as categorias com as subcategorias aninhadas.
router.get('/', getCategorias);

module.exports = router;
