package com.donaton.necesidades.service;

import com.donaton.necesidades.dto.NecesidadDTO;
import com.donaton.necesidades.entity.Necesidad;
import com.donaton.necesidades.repository.NecesidadRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SuppressWarnings("all")
public class NecesidadServiceTest {

    @Mock
    private NecesidadRepository repository;

    @InjectMocks
    private NecesidadService service;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRegistrarNecesidad() {
        NecesidadDTO dto = new NecesidadDTO();
        dto.setTitulo("Ayuda");
        dto.setDescripcion("Necesaria");
        dto.setTipoRecurso("Agua");
        dto.setCantidadRequerida(50);
        dto.setUbicacion("Zona Norte");

        Necesidad nec = new Necesidad();
        nec.setId(1L);
        nec.setTitulo("Ayuda");
        nec.setDescripcion("Necesaria");
        nec.setTipoRecurso("Agua");
        nec.setCantidadRequerida(50);
        nec.setUbicacion("Zona Norte");
        nec.setEstado("PENDIENTE");

        when(repository.save(any(Necesidad.class))).thenReturn(nec);

        NecesidadDTO result = service.registrarNecesidad(dto);

        assertNotNull(result);
        assertEquals("PENDIENTE", result.getEstado());
        verify(repository, times(1)).save(any(Necesidad.class));
    }

    @Test
    public void testObtenerPorEstado() {
        Necesidad n1 = new Necesidad();
        n1.setId(1L);
        n1.setEstado("RESUELTO");

        when(repository.findByEstado("RESUELTO")).thenReturn(List.of(n1));

        List<NecesidadDTO> list = service.obtenerPorEstado("RESUELTO");

        assertEquals(1, list.size());
        assertEquals("RESUELTO", list.get(0).getEstado());
        verify(repository, times(1)).findByEstado("RESUELTO");
    }

    @Test
    public void testObtenerTodas() {
        Necesidad n1 = new Necesidad();
        n1.setId(1L);
        n1.setEstado("PENDIENTE");

        when(repository.findAll()).thenReturn(List.of(n1));

        List<NecesidadDTO> list = service.obtenerTodas();

        assertEquals(1, list.size());
        verify(repository, times(1)).findAll();
    }
}
