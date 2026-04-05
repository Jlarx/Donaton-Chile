package com.donaton.logistica.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Data
public class CentroAcopioDTO {
    private Long id;

    @NotBlank(message = "El nombre del centro de acopio es obligatorio")
    private String nombre;

    @NotBlank(message = "La ubicación del centro es obligatoria")
    private String ubicacion;

    @NotNull(message = "La capacidad máxima es obligatoria")
    @Min(value = 1, message = "La capacidad debe ser de al menos 1")
    private Integer capacidadMaxima;

    private Integer inventarioActual;
}
