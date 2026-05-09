package com.donaton.logistica.strategy;

import com.donaton.logistica.dto.CentroAcopioDTO;
import org.springframework.stereotype.Component;
import java.util.List;

@Component("EQUITATIVA")
public class DistribucionEquitativaStrategy implements DistribucionStrategy {

    @Override
    public void asignarRecursos(List<CentroAcopioDTO> centros, Integer cantidad) {
        if (centros == null || centros.isEmpty() || cantidad <= 0) return;
        
        int cantidadPorCentro = cantidad / centros.size();
        for (CentroAcopioDTO centro : centros) {
            centro.setInventarioActual(centro.getInventarioActual() + cantidadPorCentro);
        }
    }
}
