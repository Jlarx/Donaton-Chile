package com.donaton.necesidades.service;

import com.donaton.necesidades.dto.NecesidadDTO;
import com.donaton.necesidades.entity.Necesidad;
import com.donaton.necesidades.repository.NecesidadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NecesidadService {

    private final NecesidadRepository necesidadRepository;

    // Registra una nueva necesidad en el sistema
    public NecesidadDTO registrarNecesidad(NecesidadDTO dto) {
        Necesidad necesidad = new Necesidad();
        necesidad.setTitulo(dto.getTitulo());
        necesidad.setDescripcion(dto.getDescripcion());
        necesidad.setTipoRecurso(dto.getTipoRecurso());
        necesidad.setCantidadRequerida(dto.getCantidadRequerida());
        necesidad.setUbicacion(dto.getUbicacion());
        // Toda necesidad nueva inicia como PENDIENTE
        necesidad.setEstado("PENDIENTE");

        Necesidad guardada = necesidadRepository.save(necesidad);
        return convertToDTO(guardada);
    }

    // Obtiene todas las necesidades reportadas
    public List<NecesidadDTO> obtenerTodas() {
        return necesidadRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Obtiene solo las necesidades filtrando por estado
    public List<NecesidadDTO> obtenerPorEstado(String estado) {
        return necesidadRepository.findByEstado(estado).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Elimina una necesidad
    public void eliminarNecesidad(Long id) {
        if (!necesidadRepository.existsById(id)) {
            throw new RuntimeException("Necesidad no encontrada con ID: " + id);
        }
        necesidadRepository.deleteById(id);
    }

    // Método auxiliar para convertir Entidad JPA hacia DTO
    private NecesidadDTO convertToDTO(Necesidad n) {
        NecesidadDTO dto = new NecesidadDTO();
        dto.setId(n.getId());
        dto.setTitulo(n.getTitulo());
        dto.setDescripcion(n.getDescripcion());
        dto.setTipoRecurso(n.getTipoRecurso());
        dto.setCantidadRequerida(n.getCantidadRequerida());
        dto.setUbicacion(n.getUbicacion());
        dto.setEstado(n.getEstado());
        dto.setFechaReporte(n.getFechaReporte());
        return dto;
    }
}
