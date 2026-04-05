package com.donaton.necesidades.controller;

import com.donaton.necesidades.dto.NecesidadDTO;
import com.donaton.necesidades.service.NecesidadService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NecesidadController.class)
@SuppressWarnings("all")
public class NecesidadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NecesidadService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void listar_ReturnAll() throws Exception {
        NecesidadDTO n1 = new NecesidadDTO(); n1.setId(1L);
        when(service.obtenerTodas()).thenReturn(java.util.List.of(n1));

        mockMvc.perform(get("/api/necesidades"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    public void listarPorEstado_ReturnFiltered() throws Exception {
        NecesidadDTO n1 = new NecesidadDTO(); n1.setId(1L); n1.setEstado("RESUELTO");
        when(service.obtenerPorEstado("RESUELTO")).thenReturn(java.util.List.of(n1));

        mockMvc.perform(get("/api/necesidades/estado/RESUELTO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    public void registrar_ReturnsCreated() throws Exception {
        NecesidadDTO input = new NecesidadDTO();
        input.setTitulo("Test");
        input.setDescripcion("Desc");
        input.setTipoRecurso("Mantas");
        input.setCantidadRequerida(10);
        input.setUbicacion("Zona Norte");

        NecesidadDTO res = new NecesidadDTO(); res.setId(1L); res.setEstado("PENDIENTE");
        when(service.registrarNecesidad(any(NecesidadDTO.class))).thenReturn(res);

        mockMvc.perform(post("/api/necesidades")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.estado").value("PENDIENTE"));
    }
}
