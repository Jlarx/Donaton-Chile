package com.donaton.logistica.strategy;

import com.donaton.logistica.dto.CentroAcopioDTO;
import java.util.List;

public interface DistribucionStrategy {
    void asignarRecursos(List<CentroAcopioDTO> centros, Integer cantidad);
}
