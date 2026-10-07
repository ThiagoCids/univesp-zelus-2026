const { supabaseAdmin } = require('../config/supabase');
const { calcularDistancia } = require('../utils/haversine');

/**
 * Função para criar uma nova Solicitação (Ocorrência).
 * Aplica filtro espacial anti-duplicidade (10 metros) e gera protocolo de acompanhamento.
 */
const criarSolicitacao = async (req, res) => {
    try {
        const { 
            subcategoria_id, latitude, longitude, descricao, 
            rua, numero, ponto_referencia, bairro, cidade, foto_url 
        } = req.body;
        
        // O ID do cidadão é extraído do token JWT, injetado pelo middleware 'verificarToken'
        const cidadao_id = req.usuario.id;

        // Validação básica dos dados obrigatórios
        if (!subcategoria_id || !latitude || !longitude || !descricao || !rua || !bairro || !cidade) {
            return res.status(400).json({ sucesso: false, mensagem: 'Dados incompletos. Faltam parâmetros obrigatórios.' });
        }

        // ==========================================
        // Regra 1: Filtro Espacial (10 metros)
        // ==========================================
        
        // Procuramos por solicitações ativas do mesmo tipo (subcategoria) com status Pendente ou Em Andamento
        const { data: solicitacoesExistentes, error: erroBusca } = await supabaseAdmin
            .from('solicitacoes')
            .select('id, latitude, longitude')
            .eq('subcategoria_id', subcategoria_id)
            .in('status', ['Pendente', 'Em Andamento']);

        if (erroBusca) throw erroBusca;

        // Iterar e testar a distância
        if (solicitacoesExistentes && solicitacoesExistentes.length > 0) {
            for (const solicitacao of solicitacoesExistentes) {
                const distancia = calcularDistancia(latitude, longitude, solicitacao.latitude, solicitacao.longitude);
                
                // Se encontrar um problema igual a <= 10 metros, bloqueia
                if (distancia <= 10) {
                    return res.status(409).json({ 
                        sucesso: false, 
                        mensagem: 'Já existe um problema deste tipo registado a menos de 10 metros daqui.' 
                    });
                }
            }
        }

        // ==========================================
        // Regra 2: Geração de Protocolo
        // ==========================================
        
        // Formato: ZELUS-YYYYMMDD-XXXX (Ex: ZELUS-20261007-1A2B)
        const dataHoje = new Date();
        const ano = dataHoje.getFullYear();
        const mes = String(dataHoje.getMonth() + 1).padStart(2, '0');
        const dia = String(dataHoje.getDate()).padStart(2, '0');
        
        // Sufixo aleatório de 4 caracteres
        const sufixoAleatorio = Math.random().toString(36).substring(2, 6).toUpperCase();
        
        const protocolo = `ZELUS-${ano}${mes}${dia}-${sufixoAleatorio}`;

        // ==========================================
        // Regra 3: Inserção na Base de Dados
        // ==========================================
        
        const novaSolicitacao = {
            cidadao_id,
            subcategoria_id,
            descricao,
            rua,
            numero,
            ponto_referencia,
            bairro,
            cidade,
            latitude,
            longitude,
            foto_url,
            protocolo,
            status: 'Pendente' // Status inicial atualizado
        };

        const { data: solicitacaoInserida, error: erroInsert } = await supabaseAdmin
            .from('solicitacoes')
            .insert([novaSolicitacao])
            .select()
            .single();

        if (erroInsert) throw erroInsert;

        return res.status(201).json({ 
            sucesso: true, 
            mensagem: 'Solicitação criada com sucesso.',
            protocolo: protocolo,
            dados: solicitacaoInserida 
        });

    } catch (error) {
        console.error('Erro ao criar solicitação:', error);
        return res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor ao tentar criar a solicitação.' });
    }
};

module.exports = {
    criarSolicitacao
};
