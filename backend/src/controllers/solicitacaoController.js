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

/**
 * Rota do Cidadão (Read): Lista exclusivamente as solicitações abertas pelo utilizador autenticado.
 * Garante o isolamento de dados (Data Privacy).
 */
const listarMinhasSolicitacoes = async (req, res) => {
    try {
        // O ID é extraído de forma segura e inquestionável do JWT
        const cidadao_id = req.usuario.id;

        // SELECT com filtro estrito para impedir vazamento de dados de outros cidadãos
        const { data: minhasSolicitacoes, error } = await supabaseAdmin
            .from('solicitacoes')
            .select(`
                *,
                subcategorias (nome)
            `)
            .eq('cidadao_id', cidadao_id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Histórico de solicitações carregado com sucesso.',
            dados: minhasSolicitacoes
        });

    } catch (error) {
        console.error('Erro ao listar histórico do cidadão:', error);
        return res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao tentar carregar o histórico.' });
    }
};

/**
 * Rota Administrativa (Read): Lista todas as solicitações para o Painel da Prefeitura.
 * Traz os relacionamentos com cidadão e subcategoria, ordenadas pelas mais recentes.
 */
const listarSolicitacoesAdmin = async (req, res) => {
    try {
        // SELECT relacional (Joins nativos da API do Supabase baseados em Foreign Keys)
        const { data: solicitacoes, error } = await supabaseAdmin
            .from('solicitacoes')
            .select(`
                *,
                cidadaos (nome_completo),
                subcategorias (nome)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Solicitações listadas com sucesso.',
            dados: solicitacoes
        });

    } catch (error) {
        console.error('Erro ao listar solicitações (Admin):', error);
        return res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao tentar listar as solicitações.' });
    }
};

/**
 * Rota Administrativa (Update): Atualiza o status de uma solicitação e regista a ação (Auditoria).
 */
const atualizarStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, justificativa_status } = req.body;
        
        // O ID do funcionário vem do token JWT, extraído pelo middleware
        const funcionario_id = req.usuario.id;

        if (!status) {
            return res.status(400).json({ sucesso: false, mensagem: 'O novo status é obrigatório.' });
        }

        // Nova Regra de Negócio: Exigência de justificativa para descarte
        if (status === 'Descartada' && (!justificativa_status || justificativa_status.trim() === '')) {
            return res.status(400).json({ 
                sucesso: false, 
                mensagem: 'A justificativa é obrigatória ao descartar uma solicitação.' 
            });
        }

        // 1. Preparar o payload de atualização
        const payloadUpdate = { 
            status, 
            updated_at: new Date() 
        };
        // Se a justificativa foi enviada, adicionamos ao payload
        if (justificativa_status !== undefined) {
            payloadUpdate.justificativa_status = justificativa_status;
        }

        // 2. Atualizar na tabela solicitacoes
        const { data: solicitacaoAtualizada, error: erroUpdate } = await supabaseAdmin
            .from('solicitacoes')
            .update(payloadUpdate)
            .eq('id', id)
            .select()
            .single();

        if (erroUpdate) throw erroUpdate;

        // 3. Montar a string descritiva da auditoria
        let acaoAuditoria = `Status alterado para '${status}'`;
        if (justificativa_status && justificativa_status.trim() !== '') {
            acaoAuditoria += ` - Justificativa: ${justificativa_status}`;
        }

        // 4. Registar a rastreabilidade na tabela de auditoria (audit_logs)
        const { error: erroAudit } = await supabaseAdmin
            .from('audit_logs')
            .insert([{
                solicitacao_id: id,
                funcionario_id: funcionario_id,
                acao: acaoAuditoria
            }]);

        if (erroAudit) {
            console.warn('Alerta: O status foi alterado, mas houve um erro ao gravar o log de auditoria:', erroAudit);
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: `Status atualizado para '${status}' com sucesso.`,
            dados: solicitacaoAtualizada
        });

    } catch (error) {
        console.error('Erro ao atualizar status da solicitação:', error);
        return res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao tentar atualizar o status.' });
    }
};

module.exports = {
    criarSolicitacao,
    listarMinhasSolicitacoes,
    listarSolicitacoesAdmin,
    atualizarStatus
};
