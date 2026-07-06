-- ============================================================
-- Stored Procedure para resetear inventario de un Centro de Acopio
-- Equivalente PostgreSQL del ALIAS H2 original
-- ============================================================

CREATE OR REPLACE FUNCTION sp_resetear_inventario(p_id_centro BIGINT)
RETURNS INTEGER AS $$
DECLARE
    filas_afectadas INTEGER;
BEGIN
    UPDATE centros_acopio SET inventario_actual = 0 WHERE id = p_id_centro;
    GET DIAGNOSTICS filas_afectadas = ROW_COUNT;
    RETURN filas_afectadas;
END;
$$ LANGUAGE plpgsql;

-- Uso: SELECT sp_resetear_inventario(1);
