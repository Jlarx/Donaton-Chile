package com.donaton.donaciones.controller;

import com.donaton.donaciones.dto.DonacionDTO;
import com.donaton.donaciones.service.DonacionService;
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

@WebMvcTest(DonacionController.class)
@SuppressWarnings("all")
public class DonacionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DonacionService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void crearDonacion_Valido() throws Exception {
        DonacionDTO input = new DonacionDTO();
        input.setTipo("ALIMENTOS");
        input.setRecurso("Arroz");
        input.setCantidad(50);
        input.setOrigen("Donante VIP");
        input.setCentroAcopioId(1L);

        DonacionDTO output = new DonacionDTO();
        output.setId(5L);
        output.setRecurso("Arroz");

        when(service.registrarDonacion(any(DonacionDTO.class))).thenReturn(output);

        mockMvc.perform(post("/api/donaciones")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(5L))
                .andExpect(jsonPath("$.recurso").value("Arroz"));
    }

    @Test
    public void obtnerTodas() throws Exception {
        DonacionDTO d1 = new DonacionDTO(); d1.setId(1L);
        when(service.obtenerTodas()).thenReturn(java.util.List.of(d1));

        mockMvc.perform(get("/api/donaciones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }
}
