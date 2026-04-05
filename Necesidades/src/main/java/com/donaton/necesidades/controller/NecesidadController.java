package com.donaton.necesidades.controller;

import com.donaton.necesidades.dto.NecesidadDTO;
import com.donaton.necesidades.service.NecesidadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// Controlador REST para manejar peticiones de clientes relacionados con Necesidades.
@RestController
@RequestMapping("/api/necesidades")
@RequiredArgsConstructor
public class NecesidadController {

    private final NecesidadService necesidadService;

    // POST /api/necesidades
    @PostMapping
    public ResponseEntity<NecesidadDTO> registrar(@jakarta.validation.Valid @RequestBody NecesidadDTO dto) {
        // Enlaza la petición al servicio lógico
        NecesidadDTO creada = necesidadService.registrarNecesidad(dto);
        return new ResponseEntity<>(creada, HttpStatus.CREATED);
    }

    // GET /api/necesidades
    @GetMapping
    public ResponseEntity<List<NecesidadDTO>> obtenerTodas() {
        return ResponseEntity.ok(necesidadService.obtenerTodas());
    }

    // GET /api/necesidades/estado/{estado}
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<NecesidadDTO>> obtenerPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(necesidadService.obtenerPorEstado(estado));
    }
}
