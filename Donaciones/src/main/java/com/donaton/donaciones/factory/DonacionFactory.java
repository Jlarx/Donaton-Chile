package com.donaton.donaciones.factory;

import org.springframework.stereotype.Component;
import com.donaton.donaciones.entity.Donacion;

// Interfaz Base del Factory Method
public interface DonacionFactory {
    Donacion crearDonacion(String recurso, Integer cantidad, String origen, Long centroAcopioId);
}

@Component("ALIMENTOS")
class AlimentoDonacionFactory implements DonacionFactory {
    @Override
    public Donacion crearDonacion(String recurso, Integer cantidad, String origen, Long centroAcopioId) {
        Donacion d = new Donacion();
        d.setTipo("ALIMENTOS");
        d.setRecurso(recurso);
        d.setCantidad(cantidad);
        d.setOrigen(origen);
        d.setCentroAcopioId(centroAcopioId);
        return d;
    }
}

@Component("SALUD")
class SaludDonacionFactory implements DonacionFactory {
    @Override
    public Donacion crearDonacion(String recurso, Integer cantidad, String origen, Long centroAcopioId) {
        Donacion d = new Donacion();
        d.setTipo("SALUD");
        d.setRecurso(recurso);
        d.setCantidad(cantidad);
        d.setOrigen(origen);
        d.setCentroAcopioId(centroAcopioId);
        return d;
    }
}

@Component("ROPA")
class RopaDonacionFactory implements DonacionFactory {
    @Override
    public Donacion crearDonacion(String recurso, Integer cantidad, String origen, Long centroAcopioId) {
        Donacion d = new Donacion();
        d.setTipo("ROPA");
        d.setRecurso(recurso);
        d.setCantidad(cantidad);
        d.setOrigen(origen);
        d.setCentroAcopioId(centroAcopioId);
        return d;
    }
}
