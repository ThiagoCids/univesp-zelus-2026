// ==============================================================
// Arquivo: supabase.js  —  Configuração do Cliente Supabase
// ==============================================================
// Este módulo cria e exporta as instâncias de conexão com o
// banco de dados Supabase (PostgreSQL gerenciado).
//
// Exporta dois clientes com níveis de acesso diferentes:
//   - supabaseAdmin  → acesso total (service_role key)
//   - supabaseClient → acesso restrito pelas políticas RLS (anon key)
//
// IMPORTANTE: Este arquivo deve ser importado APENAS no backend.
// As chaves aqui usadas NUNCA devem ser expostas ao frontend.
// ==============================================================

const { createClient } = require('@supabase/supabase-js');

// -- Leitura das variáveis de ambiente --
// O dotenv já foi carregado em server.js antes deste módulo
// ser importado, então process.env está populado aqui.
const SUPABASE_URL         = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SUPABASE_ANON_KEY    = process.env.SUPABASE_ANON_KEY;

// ==============================================================
// VALIDAÇÃO FAIL-FAST
// Se as variáveis obrigatórias estiverem ausentes, o servidor
// para imediatamente com uma mensagem clara — em vez de subir
// e travar silenciosamente na primeira query ao banco.
// ==============================================================
if (!SUPABASE_URL || SUPABASE_URL.includes('SEU_PROJETO')) {
  throw new Error(
    '[Supabase] SUPABASE_URL não configurada.\n' +
    'Preencha a variável SUPABASE_URL no arquivo backend/.env\n' +
    'Encontre o valor em: Supabase Dashboard > Settings > API > Project URL'
  );
}

if (!SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY.includes('sua_chave')) {
  throw new Error(
    '[Supabase] SUPABASE_SERVICE_KEY não configurada.\n' +
    'Preencha a variável SUPABASE_SERVICE_KEY no arquivo backend/.env\n' +
    'Encontre o valor em: Supabase Dashboard > Settings > API > service_role'
  );
}

// ==============================================================
// CLIENTE ADMINISTRATIVO — supabaseAdmin
// ==============================================================
// Usa a service_role key: acesso TOTAL ao banco de dados.
// Bypassa (ignora) todas as políticas de Row Level Security (RLS).
//
// ✅ USE para: inserir dados de qualquer usuário, operações de
//             sistema, relatórios administrativos.
// ❌ NÃO USE para: operações iniciadas diretamente pelo usuário
//                  final (use supabaseClient nesses casos).
// ==============================================================
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    // Desativa a persistência de sessão no servidor (sem cookies/localStorage)
    // O backend não precisa gerenciar sessões — ele usa a chave de serviço.
    persistSession: false,
    autoRefreshToken: false,
  },
});

// ==============================================================
// CLIENTE PADRÃO — supabaseClient
// ==============================================================
// Usa a anon key: acesso RESTRITO pelas políticas RLS do Supabase.
// As políticas RLS definem quem pode ver/editar quais dados.
//
// ✅ USE para: operações públicas, consultas que respeitam as
//             permissões do usuário autenticado.
// ==============================================================
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// -- Exportação dos clientes --
// Outros módulos importam assim:
//   const { supabaseAdmin } = require('../config/supabase');
//   const { supabaseClient } = require('../config/supabase');
module.exports = { supabaseAdmin, supabaseClient };
