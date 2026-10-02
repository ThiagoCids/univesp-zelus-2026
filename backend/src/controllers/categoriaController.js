// ==============================================================
// Arquivo: categoriaController.js
// Caminho: backend/src/controllers/categoriaController.js
// Descricao: Logica de negocio para o recurso Categorias.
// ==============================================================
// Responsabilidade unica: buscar as categorias e subcategorias
// no Supabase, aninhar os dados e devolver uma resposta JSON
// padronizada.
//
// Usa supabaseClient (anon key) porque:
//   - A leitura de categorias e publica pelo RLS
//     ("Permitir leitura publica de categorias" / subcategorias)
//   - E semanticamente incorreto usar supabaseAdmin para dados
//     que o RLS ja libera publicamente.
// ==============================================================

const { supabaseClient } = require('../config/supabase');

// --------------------------------------------------------------
// getCategorias
// Rota: GET /api/categorias
// Retorna todas as categorias com as subcategorias aninhadas.
// --------------------------------------------------------------
const getCategorias = async (req, res) => {
  try {
    // -- Query 1: Todas as categorias, ordenadas alfabeticamente --
    const { data: categorias, error: erroCat } = await supabaseClient
      .from('categorias')
      .select('id, nome, icone')
      .order('nome', { ascending: true });

    if (erroCat) throw erroCat;

    // -- Query 2: Todas as subcategorias, ordenadas alfabeticamente --
    const { data: subcategorias, error: erroSub } = await supabaseClient
      .from('subcategorias')
      .select('id, categoria_id, nome')
      .order('nome', { ascending: true });

    if (erroSub) throw erroSub;

    // -- Aninhamento em JS: cada categoria recebe as suas subcategorias --
    // Filtramos por categoria_id para garantir a ligacao correta via FK.
    const resposta = categorias.map((cat) => ({
      id:            cat.id,
      nome:          cat.nome,
      icone:         cat.icone,
      subcategorias: subcategorias.filter((sub) => sub.categoria_id === cat.id),
    }));

    return res.status(200).json({
      sucesso: true,
      dados:   resposta,
    });

  } catch (erro) {
    console.error('[categoriaController] Erro ao buscar categorias:', erro.message);
    return res.status(500).json({
      sucesso:  false,
      mensagem: 'Erro interno ao buscar categorias.',
    });
  }
};

module.exports = { getCategorias };
