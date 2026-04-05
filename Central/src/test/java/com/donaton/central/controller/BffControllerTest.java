package com.donaton.central.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

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
        
        // Mocking responses
        when(responseSpec.bodyToMono(Object.class))
            .thenReturn(Mono.just(List.of("Centro 1")))
            .thenReturn(Mono.just(List.of("Donacion 1")));

        webTestClient.get()
                .uri("/bff/dashboard-overview")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.centrosDisponibles[0]").isEqualTo("Centro 1")
                .jsonPath("$.donacionesTotales").exists();
    }
}
