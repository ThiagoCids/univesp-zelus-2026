const { supabaseAdmin } = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrarCidadao = async (req, res) => {
  try {
    const { nome_completo, cpf, email, whatsapp, senha } = req.body;

    // 1. Validação básica de campos obrigatórios
    if (!nome_completo || !cpf || !email || !whatsapp || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Todos os campos são obrigatórios (nome_completo, cpf, email, whatsapp, senha).'
      });
    }

    // 2. Verificar se CPF ou Email já estão cadastrados
    // Usamos supabaseAdmin porque as políticas RLS poderiam impedir 
    // um visitante não autenticado de ler a tabela cidadaos.
    const { data: cidadaoExistente, error: errorBusca } = await supabaseAdmin
      .from('cidadaos')
      .select('cpf, email')
      .or(`cpf.eq.${cpf},email.eq.${email}`)
      .maybeSingle();

    if (errorBusca) {
      console.error('[authCidadaoController] Erro ao buscar duplicidade:', errorBusca);
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno ao validar dados.'
      });
    }

    if (cidadaoExistente) {
      if (cidadaoExistente.cpf === cpf) {
        return res.status(409).json({ sucesso: false, mensagem: 'CPF já cadastrado.' });
      }
      if (cidadaoExistente.email === email) {
        return res.status(409).json({ sucesso: false, mensagem: 'E-mail já cadastrado.' });
      }
    }

    // 3. Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // 4. Inserir no banco (usando supabaseAdmin para bypass RLS)
    const { data: novoCidadao, error: errorInsert } = await supabaseAdmin
      .from('cidadaos')
      .insert([
        {
          nome_completo,
          cpf,
          email,
          whatsapp,
          senha: senhaHash
          // pontos e created_at são gerados pelo banco (DEFAULT)
        }
      ])
      .select('id, nome_completo, cpf, email, whatsapp, pontos, created_at')
      .single(); // Selecionamos os campos, omitindo a senha

    if (errorInsert) {
      console.error('[authCidadaoController] Erro ao inserir cidadão:', errorInsert);
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno ao cadastrar cidadão.'
      });
    }

    // 5. Retornar sucesso
    return res.status(201).json({
      sucesso: true,
      mensagem: 'Cidadão cadastrado com sucesso.',
      dados: novoCidadao
    });

  } catch (erro) {
    console.error('[authCidadaoController] Erro inesperado no registro:', erro);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor.'
    });
  }
};

exports.loginCidadao = async (req, res) => {
  try {
    const { cpf, senha } = req.body;

    // 1. Validação básica
    if (!cpf || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'CPF e senha são obrigatórios.'
      });
    }

    // 2. Buscar o cidadão pelo CPF (usando supabaseAdmin)
    const { data: cidadao, error } = await supabaseAdmin
      .from('cidadaos')
      .select('id, nome_completo, cpf, email, whatsapp, senha, pontos, created_at')
      .eq('cpf', cpf)
      .maybeSingle();

    if (error) {
      console.error('[authCidadaoController] Erro ao buscar usuário no login:', error);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao processar login.' });
    }

    // 3. Verificar se o cidadão existe
    if (!cidadao) {
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas.' });
    }

    // 4. Comparar as senhas
    const senhaValida = await bcrypt.compare(senha, cidadao.senha);
    if (!senhaValida) {
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas.' });
    }

    // 5. Gerar o token JWT (expiração de 7 dias)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[authCidadaoController] ATENÇÃO: JWT_SECRET não configurado no .env');
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno de configuração do servidor.' });
    }

    const token = jwt.sign(
      { id: cidadao.id, tipo: 'cidadao' },
      secret,
      { expiresIn: '7d' }
    );

    // 6. Remover a senha do retorno por segurança
    delete cidadao.senha;

    // 7. Retornar os dados e o token
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso.',
      token,
      dados: cidadao
    });

  } catch (erro) {
    console.error('[authCidadaoController] Erro inesperado no login:', erro);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor.'
    });
  }
};
