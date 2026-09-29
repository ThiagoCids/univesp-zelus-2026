-- ==========================================
-- Configuração de Segurança (RLS) - ZELUS
-- ==========================================

-- 1. Ativar RLS em todas as tabelas
ALTER TABLE public.cidadaos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. Garantir que o acesso público (anon) não consiga ver nem alterar dados sensíveis.
-- Como o backend usará a chave `service_role` (que ignora RLS por padrão), 
-- não precisamos criar políticas complexas de permissão aqui, apenas fechar as portas públicas.
-- O simples ato de habilitar o RLS sem criar políticas `FOR SELECT/INSERT` para o 'anon' 
-- já bloqueia o acesso público direto.

-- (Opcional) Podemos permitir que as categorias sejam lidas publicamente 
-- caso o frontend queira puxar isso direto do Supabase no futuro para ser mais rápido:
CREATE POLICY "Permitir leitura pública de categorias" ON public.categorias FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de subcategorias" ON public.subcategorias FOR SELECT USING (true);
