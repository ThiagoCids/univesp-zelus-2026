-- =============================================================================
-- ZELUS - Seed de Dados: Categorias e Subcategorias
-- Arquivo  : backend/src/database/seed.sql
-- Proposito: Popula as tabelas de dominio com os dados reais da regra de negocio.
-- Estrategia: UUIDs fixos e explicitos para garantir idempotencia.
--             O arquivo pode ser re-executado a qualquer momento sem gerar duplicatas.
-- Execucao : Rodar manualmente via Supabase SQL Editor ou psql apos o schema e RLS.
-- =============================================================================

DO $$
DECLARE
    -- -------------------------------------------------------------------------
    -- Declaracao dos UUIDs fixos das Categorias
    -- Estes valores sao fixos e devem permanecer imutaveis entre ambientes.
    -- -------------------------------------------------------------------------
    v_cat_asfalto   UUID := 'a1b2c3d4-0001-4000-8000-000000000001';
    v_cat_bueiro    UUID := 'a1b2c3d4-0002-4000-8000-000000000002';

    -- -------------------------------------------------------------------------
    -- Declaracao dos UUIDs fixos das Subcategorias
    -- -------------------------------------------------------------------------
    v_sub_buraco    UUID := 'b1b2c3d4-0001-4000-8000-000000000001';
    v_sub_entupido  UUID := 'b1b2c3d4-0002-4000-8000-000000000002';
    v_sub_tampa     UUID := 'b1b2c3d4-0003-4000-8000-000000000003';

BEGIN

    -- =========================================================================
    -- BLOCO 1: Limpeza Idempotente (ordem inversa de dependencia de FK)
    -- Remove apenas os registros gerenciados por este seed, preservando
    -- quaisquer dados inseridos por usuarios reais.
    -- =========================================================================

    DELETE FROM public.subcategorias
    WHERE id IN (v_sub_buraco, v_sub_entupido, v_sub_tampa);

    DELETE FROM public.categorias
    WHERE id IN (v_cat_asfalto, v_cat_bueiro);

    -- =========================================================================
    -- BLOCO 2: Insert de Categorias
    -- =========================================================================

    -- Categoria 1: Asfalto
    -- Icone 'road-damage': representa pavimento danificado.
    -- Disponivel em MaterialCommunityIcons (usado pelo Expo/React Native).
    INSERT INTO public.categorias (id, nome, icone)
    VALUES (
        v_cat_asfalto,
        'Asfalto',
        'road-damage'
    );

    -- Categoria 2: Bueiro / Boca de lobo
    -- Icone 'drain': representa sarjeta/bueiro de galeria pluvial.
    -- Disponivel em MaterialCommunityIcons (usado pelo Expo/React Native).
    INSERT INTO public.categorias (id, nome, icone)
    VALUES (
        v_cat_bueiro,
        'Bueiro / Boca de lobo',
        'drain'
    );

    -- =========================================================================
    -- BLOCO 3: Insert de Subcategorias
    -- Cada registro e vinculado a sua categoria pai pelo UUID fixo declarado
    -- nas variaveis acima, garantindo a integridade referencial.
    -- =========================================================================

    -- Subcategoria 1.1: Buraco -> pertence a 'Asfalto'
    INSERT INTO public.subcategorias (id, categoria_id, nome)
    VALUES (
        v_sub_buraco,
        v_cat_asfalto,
        'Buraco'
    );

    -- Subcategoria 2.1: Entupido -> pertence a 'Bueiro / Boca de lobo'
    INSERT INTO public.subcategorias (id, categoria_id, nome)
    VALUES (
        v_sub_entupido,
        v_cat_bueiro,
        'Entupido'
    );

    -- Subcategoria 2.2: Tampa quebrada / sem tampa -> pertence a 'Bueiro / Boca de lobo'
    INSERT INTO public.subcategorias (id, categoria_id, nome)
    VALUES (
        v_sub_tampa,
        v_cat_bueiro,
        'Tampa quebrada / sem tampa'
    );

    RAISE NOTICE 'Seed concluido com sucesso: 2 categorias e 3 subcategorias inseridas.';

END $$;
