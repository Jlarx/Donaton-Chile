package com.donaton.logistica.controller;

import com.donaton.logistica.dto.CentroAcopioDTO;
import com.donaton.logistica.service.CentroAcopioService;
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

@WebMvcTest(LogisticaController.class)
@SuppressWarnings("all")
public class LogisticaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CentroAcopioService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void crearCentro_ValidData_ReturnsCreated() throws Exception {
        CentroAcopioDTO input = new CentroAcopioDTO();
        input.setNombre("Valido");
        input.setUbicacion("Lugar");
        input.setCapacidadMaxima(10);
        
        CentroAcopioDTO output = new CentroAcopioDTO();
        output.setId(1L);
        output.setNombre("Valido");

        when(service.crearCentro(any(CentroAcopioDTO.class))).thenReturn(output);

        mockMvc.perform(post("/api/logistica/centros")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nombre").value("Valido"));
    }

    @Test
    public void crearCentro_InvalidData_ReturnsBadRequest() throws Exception {
        CentroAcopioDTO input = new CentroAcopioDTO();

        mockMvc.perform(post("/api/logistica/centros")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void listarCentros_ReturnsOk() throws Exception {
        CentroAcopioDTO c1 = new CentroAcopioDTO(); c1.setNombre("C1");
        CentroAcopioDTO c2 = new CentroAcopioDTO(); c2.setNombre("C2");

        when(service.obtenerCentros()).thenReturn(java.util.List.of(c1, c2));

        mockMvc.perform(get("/api/logistica/centros"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }
}
