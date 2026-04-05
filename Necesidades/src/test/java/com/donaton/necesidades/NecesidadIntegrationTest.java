package com.donaton.necesidades;

import com.donaton.necesidades.dto.NecesidadDTO;
import com.donaton.necesidades.repository.NecesidadRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test") // Usa configuración de testing si la hay, sino usa la por defecto
@SuppressWarnings("all")
public class NecesidadIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private NecesidadRepository necesidadRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        // Limpiamos la base de datos de H2 en archivo antes de cada test para aislar el contexto
        necesidadRepository.deleteAll();
    }

    @Test
    public void debeRegistrarNecesidadYConsultarlaExitosamente() throws Exception {
        // 1. Preparar la Necesidad que enviaremos
        NecesidadDTO peticionDto = new NecesidadDTO();
        peticionDto.setTitulo("Ayuda Mantas");
        peticionDto.setDescripcion("Necesitamos mantas urgentes");
        peticionDto.setTipoRecurso("Mantas para invierno");
        peticionDto.setCantidadRequerida(200);
        peticionDto.setUbicacion("Centro Comunitario Sur");

        // 2. Realizar POST (Crear Necesidad)
        mockMvc.perform(post("/api/necesidades")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(peticionDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.tipoRecurso", is("Mantas para invierno")))
                .andExpect(jsonPath("$.estado", is("PENDIENTE")));

        // 3. Realizar GET (Verificar que se guardó correctamente)
        mockMvc.perform(get("/api/necesidades/estado/PENDIENTE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(1)))
                .andExpect(jsonPath("$[0].tipoRecurso", is("Mantas para invierno")));
    }
}
