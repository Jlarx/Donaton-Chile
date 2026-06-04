package com.donaton.central.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@SuppressWarnings("all")
public class BffControllerTest {

    private WebTestClient webTestClient;

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    private BffController bffController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        when(webClientBuilder.build()).thenReturn(webClient);
        
        bffController = new BffController(webClientBuilder);
        webTestClient = WebTestClient.bindToController(bffController).build();
    }

    @Test
    public void getDashboardOverview_Success() {
        // Simple mock of WebClient chain
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        
        // Mocking responses for the three microservices (Logistica, Donaciones, Necesidades)
        when(responseSpec.bodyToMono(Object.class))
            .thenReturn(Mono.just(List.of(Map.of("id", 1L, "nombre", "Centro 1", "inventarioActual", 10, "capacidadMaxima", 100))))
            .thenReturn(Mono.just(List.of(Map.of("id", 1L, "cantidad", 50, "estado", "REGISTRADA"))))
            .thenReturn(Mono.just(List.of(Map.of("id", 1L, "estado", "PENDIENTE"))));

        webTestClient.get()
                .uri("/bff/dashboard-overview")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.centrosDisponibles[0].nombre").isEqualTo("Centro 1")
                .jsonPath("$.donacionesTotales").exists()
                .jsonPath("$.necesidadesTotales").exists()
                .jsonPath("$.resumen.totalCentros").isEqualTo(1)
                .jsonPath("$.resumen.totalDonaciones").isEqualTo(1)
                .jsonPath("$.resumen.totalNecesidades").isEqualTo(1);
    }
}
