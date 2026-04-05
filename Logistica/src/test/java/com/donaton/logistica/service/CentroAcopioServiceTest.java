package com.donaton.logistica.service;

import com.donaton.logistica.dto.CentroAcopioDTO;
import com.donaton.logistica.entity.CentroAcopio;
import com.donaton.logistica.exception.ResourceNotFoundException;
import com.donaton.logistica.repository.CentroAcopioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("all")
public class CentroAcopioServiceTest {

    @Mock
    private CentroAcopioRepository repository;

    @InjectMocks
    private CentroAcopioService service;

    @Test
    public void testCrearCentro() {
        CentroAcopioDTO dto = new CentroAcopioDTO();
        dto.setNombre("Centro Test");
        dto.setUbicacion("Ubicacion Test");
        dto.setCapacidadMaxima(100);

        CentroAcopio centro = new CentroAcopio();
        centro.setId(1L);
        centro.setNombre("Centro Test");
        centro.setUbicacion("Ubicacion Test");
        centro.setCapacidadMaxima(100);
        centro.setInventarioActual(0);

        when(repository.save(any(CentroAcopio.class))).thenReturn(centro);

        CentroAcopioDTO result = service.crearCentro(dto);

        assertNotNull(result);
        assertEquals("Centro Test", result.getNombre());
        assertEquals(0, result.getInventarioActual());
        verify(repository, times(1)).save(any(CentroAcopio.class));
    }

    @Test
    public void testObtenerCentros() {
        CentroAcopio centro1 = new CentroAcopio();
        centro1.setId(1L);
        centro1.setNombre("Centro 1");

        CentroAcopio centro2 = new CentroAcopio();
        centro2.setId(2L);
        centro2.setNombre("Centro 2");

        when(repository.findAll()).thenReturn(List.of(centro1, centro2));

        List<CentroAcopioDTO> result = service.obtenerCentros();

        assertEquals(2, result.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    public void testObtenerPorId() {
        CentroAcopio centro = new CentroAcopio();
        centro.setId(1L);
        centro.setNombre("Centro Test");

        when(repository.findById(1L)).thenReturn(Optional.of(centro));

        CentroAcopioDTO result = service.obtenerCentroPorId(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Centro Test", result.getNombre());
    }

    @Test
    public void testObtenerPorId_NotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            service.obtenerCentroPorId(99L);
        });
    }
}
