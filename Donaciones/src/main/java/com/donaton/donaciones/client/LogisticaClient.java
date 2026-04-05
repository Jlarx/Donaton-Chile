package com.donaton.donaciones.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "logistica-service")
public interface LogisticaClient {
    @GetMapping("/api/logistica/centros/{id}")
    Object obtenerCentroPorId(@PathVariable("id") Long id);
}
