const { supabaseAdmin } = require('../config/supabase');
const bcrypt = require('bcryptjs');

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
