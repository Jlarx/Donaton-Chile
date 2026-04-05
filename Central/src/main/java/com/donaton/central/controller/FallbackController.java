package com.donaton.central.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    private Mono<ResponseEntity<Map<String, Object>>> createFallbackResponse(String message) {
        Map<String, Object> body = new java.util.HashMap<>();
        body.put("error", "ServiceUnavailable");
        body.put("message", message);
        body.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body));
    }

    @RequestMapping("/donaciones")
    public Mono<ResponseEntity<Map<String, Object>>> donacionesFallback() {
        return createFallbackResponse("El servicio de donaciones no está disponible actualmente. Mostrando datos cacheados o intente más tarde.");
    }

    @RequestMapping("/logistica")
    public Mono<ResponseEntity<Map<String, Object>>> logisticaFallback() {
        return createFallbackResponse("El servicio de logística está experimentando problemas. Por favor, intente en unos minutos.");
    }

    @RequestMapping("/necesidades")
    public Mono<ResponseEntity<Map<String, Object>>> necesidadesFallback() {
        return createFallbackResponse("El servicio de necesidades no está disponible actualmente. Mostrando datos cacheados o intente más tarde.");
    }
}
