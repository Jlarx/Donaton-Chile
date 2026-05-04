package com.donaton.donaciones.service;

import com.donaton.donaciones.entity.Donacion;
import com.donaton.donaciones.factory.DonacionFactory;
import com.donaton.donaciones.repository.DonacionRepository;
import com.donaton.donaciones.dto.DonacionDTO;
import com.donaton.donaciones.exception.ResourceNotFoundException;
import com.donaton.donaciones.client.LogisticaClient;
import feign.FeignException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonacionService {

    private final DonacionRepository donacionRepository;

    // Patrón Factory Method + Strategy inyectado dinámicamente por Spring
    private final java.util.Map<String, DonacionFactory> donacionFactories;

    private final LogisticaClient logisticaClient;

    @SuppressWarnings("null")
    public DonacionDTO registrarDonacion(DonacionDTO dto) {
        // 1. Validar existencia del Centro de Acopio conectando al Servicio de Logística
        try {
            logisticaClient.obtenerCentroPorId(dto.getCentroAcopioId());
        } catch (FeignException.NotFound e) {
            // Logística regresó un 404, el centro no existe.
            throw new ResourceNotFoundException("El Centro de Acopio ID " + dto.getCentroAcopioId() + " no existe en logística.");
        } catch (FeignException e) {
            // El servicio de Logística está fallando (500) o inaccesible
            throw new RuntimeException("Error comunicando con servicio de Logística para validar centro. Posible caída.", e);
        }

        // 2. Continúa la creación usando el Factory dinámico según el tipo
        String tipo = dto.getTipo() != null ? dto.getTipo().toUpperCase() : "";
        DonacionFactory factory = donacionFactories.get(tipo);
        if (factory == null) {
            throw new IllegalArgumentException("No existe una fábrica de donaciones para el tipo: " + tipo + ". Opciones válidas: ALIMENTOS, SALUD, ROPA.");
        }
        
        Donacion nuevaDonacion = factory.crearDonacion(
            dto.getRecurso(), 
            dto.getCantidad(), 
            dto.getOrigen(), 
            dto.getCentroAcopioId()
        );
        Donacion guardada = donacionRepository.save(nuevaDonacion);
        
        // Sincronizar el inventario en el microservicio de Logística
        try {
            logisticaClient.agregarInventario(dto.getCentroAcopioId(), dto.getCantidad());
        } catch (Exception e) {
            // Logear error de sincronización de inventario, pero no fallar la donación
            System.err.println("Advertencia: No se pudo actualizar el inventario en Logística para el centro " + dto.getCentroAcopioId());
        }
        
        return convertToDTO(guardada);
    }

    public List<DonacionDTO> obtenerTodas() {
        return donacionRepository.findAll().stream()
                .map(this::convertToDTO)
                .toList();
    }

    public void eliminarDonacion(Long id) {
        if (!donacionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Donación no encontrada con ID: " + id);
        }
        donacionRepository.deleteById(id);
    }

    public List<DonacionDTO> obtenerPorCentro(@org.springframework.lang.NonNull Long centroId) {
        List<Donacion> donaciones = donacionRepository.findByCentroAcopioId(centroId);
        if (donaciones.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron donaciones para el centro con ID: " + centroId);
        }
        return donaciones.stream().map(this::convertToDTO).toList();
    }

    private DonacionDTO convertToDTO(Donacion donacion) {
        DonacionDTO dto = new DonacionDTO();
        dto.setId(donacion.getId());
        dto.setTipo(donacion.getTipo());
        dto.setRecurso(donacion.getRecurso());
        dto.setCantidad(donacion.getCantidad());
        dto.setOrigen(donacion.getOrigen());
        dto.setCentroAcopioId(donacion.getCentroAcopioId());
        return dto;
    }
}
