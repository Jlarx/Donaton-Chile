package com.donaton.logistica.controller;

import com.donaton.logistica.dto.CentroAcopioDTO;
import com.donaton.logistica.service.CentroAcopioService;
import com.donaton.logistica.strategy.DistribucionStrategy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logistica")
@RequiredArgsConstructor
public class LogisticaController {

    private final CentroAcopioService centroService;
    private final DistribucionStrategy distribucionStrategy;

    @PostMapping("/centros")
    public ResponseEntity<?> crearCentro(
            @RequestHeader(value = "role", required = false) String role,
            @jakarta.validation.Valid @RequestBody CentroAcopioDTO req) {
        
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Acceso denegado: Se requiere rol ADMIN"));
        }
        
        CentroAcopioDTO centro = centroService.crearCentro(req);
        return new ResponseEntity<>(centro, HttpStatus.CREATED);
    }

    @GetMapping("/centros")
    public ResponseEntity<List<CentroAcopioDTO>> obtenerCentros() {
        return ResponseEntity.ok(centroService.obtenerCentros());
    }

    @GetMapping("/centros/{id}")
    public ResponseEntity<CentroAcopioDTO> obtenerCentroPorId(@org.springframework.lang.NonNull @PathVariable Long id) {
        return ResponseEntity.ok(centroService.obtenerCentroPorId(id));
    }

    @DeleteMapping("/centros/{id}")
    public ResponseEntity<?> eliminarCentro(
            @RequestHeader(value = "role", required = false) String role,
            @PathVariable Long id) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Acceso denegado: Se requiere rol ADMIN"));
        }
        centroService.eliminarCentro(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/asignaciones")
    public ResponseEntity<?> asignarRecursos(
            @RequestHeader(value = "role", required = false) String role,
            @RequestParam Integer cantidad) {
            
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Acceso denegado: Se requiere rol ADMIN"));
        }
        
        List<CentroAcopioDTO> centros = centroService.obtenerCentros();
        distribucionStrategy.asignarRecursos(centros, cantidad);
        
        // Guardar los centros actualizados en la base de datos
        for (CentroAcopioDTO c : centros) {
            centroService.agregarInventario(c.getId(), c.getInventarioActual() - centroService.obtenerCentroPorId(c.getId()).getInventarioActual());
        }
        
        return ResponseEntity.ok(Map.of(
            "mensaje", "Recursos distribuidos según la estrategia y guardados exitosamente",
            "centrosActualizados", centros
        ));
    }

    @PutMapping("/centros/{id}/inventario")
    public ResponseEntity<?> agregarInventario(@PathVariable("id") Long id, @RequestParam("cantidad") Integer cantidad) {
        centroService.agregarInventario(id, cantidad);
        return ResponseEntity.ok().build();
    }
}
