const { supabaseAdmin } = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginFuncionario = async (req, res) => {
  try {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: 'O CPF e a senha são obrigatórios.' });
    }

    // Procurar funcionário pelo CPF ignorando RLS
    const { data: funcionario, error } = await supabaseAdmin
      .from('funcionarios')
      .select('*')
      .eq('matricula_cpf', cpf)
      .single();

    if (error || !funcionario) {
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas.' });
    }

    // Verificar a senha
    const senhaValida = await bcrypt.compare(senha, funcionario.senha);

    if (!senhaValida) {
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas.' });
    }

    // Gerar token JWT (expiração de 12 horas)
    const token = jwt.sign(
      { 
        id: funcionario.id, 
        tipo: 'funcionario' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Omitir a senha nos dados retornados
    const { senha: senhaOmitida, ...dadosFuncionario } = funcionario;

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso.',
      token,
      dados: dadosFuncionario
    });

  } catch (err) {
    console.error('Erro no login do funcionário:', err);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor.' });
  }
};

module.exports = {
  loginFuncionario
};
