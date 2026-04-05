-- H2 no tiene Stored Procedures nativos de SQL puro, permite crear ALIAS que apuntan a métodos Java.
-- Como simulacro de la rúbrica, creamos el ALIAS que servirá como SP para resetear inventario.

CREATE ALIAS IF NOT EXISTS SP_RESETEAR_INVENTARIO AS '
import java.sql.Connection;
import java.sql.PreparedStatement;
@org.h2.api.Mapper
public static int resetearInventario(Connection conn, int idCentro) throws Exception {
    PreparedStatement ps = conn.prepareStatement("UPDATE centros_acopio SET INVENTARIO_ACTUAL = 0 WHERE ID = ?");
    ps.setInt(1, idCentro);
    return ps.executeUpdate();
}
';

-- Ahora puedes llamarlo con CALL SP_RESETEAR_INVENTARIO(1);
