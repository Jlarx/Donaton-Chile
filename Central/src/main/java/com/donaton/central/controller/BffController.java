package com.donaton.central.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

/**
 * BFF (Backend For Frontend) Endpoint.
 * Orquesta información de múltiples microservicios en una sola llamada para el Frontend.
 */
@RestController
@RequestMapping("/bff")
public class BffController {

    private final WebClient webClient;

    public BffController(WebClient.Builder webClientBuilder) {
        // Con LoadBalanced Builder, podemos usar el nombre del servicio Eureka ("lb://")
        this.webClient = webClientBuilder.build();
    }

    @GetMapping("/dashboard-overview")
    public Mono<Map<String, Object>> getDashboardOverview() {
        
        Mono<Object> centrosReq = webClient.get()
                .uri("lb://logistica-service/api/logistica/centros")
                .retrieve()
                .bodyToMono(Object.class)
                .onErrorReturn(new Object[0]);

        Mono<Object> donacionesReq = webClient.get()
                .uri("lb://donaciones-service/api/donaciones")
                .retrieve()
                .bodyToMono(Object.class)
                .onErrorReturn(new Object[0]);

        // Combinamos ambas promesas reactivas en un solo JSON para el Frontend (BFF Pattern)
        return Mono.zip(centrosReq, donacionesReq).map(tuple -> {
            Map<String, Object> response = new HashMap<>();
            response.put("centrosDisponibles", tuple.getT1());
            response.put("donacionesTotales", tuple.getT2());
            return response;
        });
    }
}
