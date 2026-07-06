package com.donaton.central.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

/**
 * BFF (Backend For Frontend) Endpoint.
 * Orquesta información de múltiples microservicios en una sola llamada para el Frontend.
 */
@CrossOrigin(origins = "http://localhost:5173")
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

        Mono<Object> necesidadesReq = webClient.get()
                .uri("lb://necesidades-service/api/necesidades")
                .retrieve()
                .bodyToMono(Object.class)
                .onErrorReturn(new Object[0]);

        // Combinamos las tres promesas reactivas en un solo JSON para el Frontend (BFF Pattern)
        return Mono.zip(centrosReq, donacionesReq, necesidadesReq).map(tuple -> {
            Map<String, Object> response = new HashMap<>();
            
            Object centrosObj = tuple.getT1();
            Object donacionesObj = tuple.getT2();
            Object necesidadesObj = tuple.getT3();
            
            // Calculamos métricas básicas
            int totalCentros = 0;
            int totalInventario = 0;
            int totalCapacidad = 0;
            if (centrosObj instanceof List) {
                List<?> list = (List<?>) centrosObj;
                totalCentros = list.size();
                for (Object item : list) {
                    if (item instanceof Map) {
                        Map<?, ?> map = (Map<?, ?>) item;
                        Number inv = (Number) map.get("inventarioActual");
                        Number cap = (Number) map.get("capacidadMaxima");
                        if (inv != null) totalInventario += inv.intValue();
                        if (cap != null) totalCapacidad += cap.intValue();
                    }
                }
            }
            
            int totalDonaciones = 0;
            int totalItemsDonados = 0;
            int donacionesRegistradas = 0;
            int donacionesRecibidas = 0;
            if (donacionesObj instanceof List) {
                List<?> list = (List<?>) donacionesObj;
                totalDonaciones = list.size();
                for (Object item : list) {
                    if (item instanceof Map) {
                        Map<?, ?> map = (Map<?, ?>) item;
                        Number cant = (Number) map.get("cantidad");
                        if (cant != null) totalItemsDonados += cant.intValue();
                        String estado = (String) map.get("estado");
                        if ("REGISTRADA".equalsIgnoreCase(estado)) donacionesRegistradas++;
                        else if ("RECIBIDA".equalsIgnoreCase(estado)) donacionesRecibidas++;
                    }
                }
            }
            
            int totalNecesidades = 0;
            int necesidadesPendientes = 0;
            if (necesidadesObj instanceof List) {
                List<?> list = (List<?>) necesidadesObj;
                totalNecesidades = list.size();
                for (Object item : list) {
                    if (item instanceof Map) {
                        Map<?, ?> map = (Map<?, ?>) item;
                        String estado = (String) map.get("estado");
                        if ("PENDIENTE".equalsIgnoreCase(estado)) necesidadesPendientes++;
                    }
                }
            }
            
            response.put("centrosDisponibles", centrosObj);
            response.put("donacionesTotales", donacionesObj);
            response.put("necesidadesTotales", necesidadesObj);
            
            // Resumen consolidado para las tarjetas del Dashboard
            Map<String, Object> resumen = new HashMap<>();
            resumen.put("totalCentros", totalCentros);
            resumen.put("totalInventario", totalInventario);
            resumen.put("totalCapacidad", totalCapacidad);
            resumen.put("totalDonaciones", totalDonaciones);
            resumen.put("totalItemsDonados", totalItemsDonados);
            resumen.put("donacionesRegistradas", donacionesRegistradas);
            resumen.put("donacionesRecibidas", donacionesRecibidas);
            resumen.put("totalNecesidades", totalNecesidades);
            resumen.put("necesidadesPendientes", necesidadesPendientes);
            
            // Estado de los servicios (UP si devolvieron lista, DOWN si devolvieron array vacío de fallback)
            Map<String, String> statusMap = new HashMap<>();
            statusMap.put("logistica", (centrosObj.getClass().isArray() && ((Object[]) centrosObj).length == 0) ? "DOWN" : "UP");
            statusMap.put("donaciones", (donacionesObj.getClass().isArray() && ((Object[]) donacionesObj).length == 0) ? "DOWN" : "UP");
            statusMap.put("necesidades", (necesidadesObj.getClass().isArray() && ((Object[]) necesidadesObj).length == 0) ? "DOWN" : "UP");
            
            response.put("resumen", resumen);
            response.put("estadoServicios", statusMap);
            
            return response;
        });
    }
}
