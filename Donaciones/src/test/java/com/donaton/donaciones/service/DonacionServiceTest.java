package com.donaton.donaciones.service;

import com.donaton.donaciones.client.LogisticaClient;
import com.donaton.donaciones.dto.DonacionDTO;
import com.donaton.donaciones.entity.Donacion;
import com.donaton.donaciones.entity.DonacionFactory;
import com.donaton.donaciones.exception.ResourceNotFoundException;
import com.donaton.donaciones.repository.DonacionRepository;
import feign.FeignException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("all")
public class DonacionServiceTest {

    @Mock
    private DonacionRepository donacionRepository;

    @Mock
    private LogisticaClient logisticaClient;

    @Mock
    private DonacionFactory factoryMock;

    @InjectMocks
    private DonacionService donacionService;

    private DonacionDTO donacionDTO;
    private Donacion donacionMock;

    @BeforeEach
    public void setUp() {
        // Inject factories via reflection due to Spring's dynamic injection
        Map<String, DonacionFactory> factories = new HashMap<>();
        factories.put("ALIMENTOS", factoryMock);
        try {
            java.lang.reflect.Field field = DonacionService.class.getDeclaredField("donacionFactories");
            field.setAccessible(true);
            field.set(donacionService, factories);
        } catch (Exception e) {
            e.printStackTrace();
        }

        donacionDTO = new DonacionDTO();
        donacionDTO.setId(1L);
        donacionDTO.setTipo("ALIMENTOS");
        donacionDTO.setRecurso("Arroz");
        donacionDTO.setCantidad(100);
        donacionDTO.setOrigen("Juan Perez");
        donacionDTO.setCentroAcopioId(10L);

        donacionMock = new Donacion();
        donacionMock.setId(1L);
        donacionMock.setTipo("ALIMENTOS");
        donacionMock.setRecurso("Arroz");
        donacionMock.setCantidad(100);
        donacionMock.setOrigen("Juan Perez");
        donacionMock.setCentroAcopioId(10L);
    }

    @Test
    public void registrarDonacion_Success() {
        when(logisticaClient.obtenerCentroPorId(10L)).thenReturn(new Object());
        when(factoryMock.crearDonacion(any(), any(), any(), any())).thenReturn(donacionMock);
        when(donacionRepository.save(any(Donacion.class))).thenReturn(donacionMock);

        DonacionDTO result = donacionService.registrarDonacion(donacionDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(logisticaClient, times(1)).obtenerCentroPorId(10L);
        verify(donacionRepository, times(1)).save(any(Donacion.class));
    }

    @Test
    public void registrarDonacion_InvalidCentro_ThrowsResourceNotFound() {
        FeignException.NotFound notFound = mock(FeignException.NotFound.class);
        when(logisticaClient.obtenerCentroPorId(10L)).thenThrow(notFound);

        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class, 
            () -> donacionService.registrarDonacion(donacionDTO));
        assertTrue(ex.getMessage().contains("no existe en logística"));
    }

    @Test
    public void registrarDonacion_LogisticaError_ThrowsRuntime() {
        FeignException feignException = mock(FeignException.class);
        when(logisticaClient.obtenerCentroPorId(10L)).thenThrow(feignException);

        RuntimeException ex = assertThrows(RuntimeException.class, 
            () -> donacionService.registrarDonacion(donacionDTO));
        assertTrue(ex.getMessage().contains("Error comunicando"));
    }

    @Test
    public void registrarDonacion_InvalidTipo_ThrowsIllegalArgument() {
        donacionDTO.setTipo("INVALID_TYPE");

        when(logisticaClient.obtenerCentroPorId(10L)).thenReturn(new Object());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, 
            () -> donacionService.registrarDonacion(donacionDTO));
        assertTrue(ex.getMessage().contains("No existe una fábrica"));
    }

    @Test
    public void obtenerTodas_Success() {
        when(donacionRepository.findAll()).thenReturn(List.of(donacionMock));

        List<DonacionDTO> result = donacionService.obtenerTodas();

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("ALIMENTOS", result.get(0).getTipo());
    }

    @Test
    public void obtenerPorCentro_Success() {
        when(donacionRepository.findByCentroAcopioId(10L)).thenReturn(List.of(donacionMock));

        List<DonacionDTO> result = donacionService.obtenerPorCentro(10L);

        assertFalse(result.isEmpty());
        assertEquals(10L, result.get(0).getCentroAcopioId());
    }

    @Test
    public void obtenerPorCentro_Empty_ThrowsNotFound() {
        when(donacionRepository.findByCentroAcopioId(10L)).thenReturn(Collections.emptyList());

        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class, 
            () -> donacionService.obtenerPorCentro(10L));
        assertTrue(ex.getMessage().contains("No se encontraron donaciones"));
    }
}
