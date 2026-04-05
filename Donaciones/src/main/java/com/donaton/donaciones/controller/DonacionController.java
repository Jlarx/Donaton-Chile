package com.donaton.donaciones.controller;

import com.donaton.donaciones.dto.DonacionDTO;
import com.donaton.donaciones.service.DonacionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/donaciones")
@RequiredArgsConstructor
public class DonacionController {

    private final DonacionService donacionService;

    @PostMapping
    public ResponseEntity<DonacionDTO> registrarDonacion(@jakarta.validation.Valid @RequestBody DonacionDTO req) {
        DonacionDTO nueva = donacionService.registrarDonacion(req);
        return new ResponseEntity<>(nueva, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DonacionDTO>> obtenerTodas() {
        return ResponseEntity.ok(donacionService.obtenerTodas());
    }

    @GetMapping("/centro/{centroId}")
    public ResponseEntity<List<DonacionDTO>> obtenerPorCentro(@org.springframework.lang.NonNull @PathVariable Long centroId) {
        return ResponseEntity.ok(donacionService.obtenerPorCentro(centroId));
    }
}
