package com.donaton.logistica.service;

import com.donaton.logistica.entity.CentroAcopio;
import com.donaton.logistica.repository.CentroAcopioRepository;
import com.donaton.logistica.dto.CentroAcopioDTO;
import com.donaton.logistica.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CentroAcopioService {

    private final CentroAcopioRepository repository;

    public CentroAcopioDTO crearCentro(CentroAcopioDTO dto) {
        CentroAcopio entidad = new CentroAcopio();
        entidad.setNombre(dto.getNombre());
        entidad.setUbicacion(dto.getUbicacion());
        entidad.setCapacidadMaxima(dto.getCapacidadMaxima());
        entidad.setInventarioActual(dto.getInventarioActual() != null ? dto.getInventarioActual() : 0);
        
        CentroAcopio guardado = repository.save(entidad);
        return convertToDTO(guardado);
    }

    public List<CentroAcopioDTO> obtenerCentros() {
        return repository.findAll().stream()
                .map(this::convertToDTO)
                .toList();
    }

    public CentroAcopioDTO obtenerCentroPorId(@NonNull Long id) {
        CentroAcopio entidad = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Centro de Acopio no encontrado con ID: " + id));
        return convertToDTO(entidad);
    }

    public void eliminarCentro(@NonNull Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Centro de Acopio no encontrado con ID: " + id);
        }
        repository.deleteById(id);
    }

    public void agregarInventario(@NonNull Long id, Integer cantidad) {
        if (cantidad == null || cantidad <= 0) return;
        CentroAcopio entidad = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Centro de Acopio no encontrado con ID: " + id));
        
        Integer actual = entidad.getInventarioActual();
        if (actual == null) actual = 0;
        
        entidad.setInventarioActual(actual + cantidad);
        repository.save(entidad);
    }

    private CentroAcopioDTO convertToDTO(CentroAcopio entidad) {
        CentroAcopioDTO dto = new CentroAcopioDTO();
        dto.setId(entidad.getId());
        dto.setNombre(entidad.getNombre());
        dto.setUbicacion(entidad.getUbicacion());
        dto.setCapacidadMaxima(entidad.getCapacidadMaxima());
        dto.setInventarioActual(entidad.getInventarioActual());
        return dto;
    }
}
