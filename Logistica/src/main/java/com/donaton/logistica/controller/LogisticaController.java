package com.donaton.logistica.controller;

import com.donaton.logistica.dto.CentroAcopioDTO;
import com.donaton.logistica.service.CentroAcopioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/logistica/centros")
@RequiredArgsConstructor
public class LogisticaController {

    private final CentroAcopioService centroService;

    @PostMapping
    public ResponseEntity<CentroAcopioDTO> crearCentro(@jakarta.validation.Valid @RequestBody CentroAcopioDTO req) {
        CentroAcopioDTO centro = centroService.crearCentro(req);
        return new ResponseEntity<>(centro, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CentroAcopioDTO>> obtenerCentros() {
        return ResponseEntity.ok(centroService.obtenerCentros());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CentroAcopioDTO> obtenerCentroPorId(@org.springframework.lang.NonNull @PathVariable Long id) {
        return ResponseEntity.ok(centroService.obtenerCentroPorId(id));
    }
}
