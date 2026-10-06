const { supabaseClient } = require('../config/supabase');

const listarCategorias = async (req, res) => {
  try {
    // Busca categorias e faz join automático com subcategorias
    const { data, error } = await supabaseClient
      .from('categorias')
      .select('id, nome, subcategorias(id, nome)');

    if (error) {
      console.error('Erro Supabase ao buscar categorias:', error);
      return res.status(500).json({ 
        sucesso: false, 
        mensagem: 'Erro interno ao buscar as categorias no banco de dados.' 
      });
    }

    return res.status(200).json({ 
      sucesso: true, 
      dados: data 
    });
  } catch (err) {
    console.error('Erro inesperado em listarCategorias:', err);
    return res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro interno no servidor.' 
    });
  }
};

module.exports = {
  listarCategorias
};
