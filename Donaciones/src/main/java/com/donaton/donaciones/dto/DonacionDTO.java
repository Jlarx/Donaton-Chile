package com.donaton.donaciones.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Data
public class DonacionDTO {
    private Long id;

    @NotBlank(message = "El tipo de donación es obligatorio")
    private String tipo;

    @NotBlank(message = "El recurso donado es obligatorio")
    private String recurso;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;

    @NotBlank(message = "El origen o donante es obligatorio")
    private String origen;

    @NotNull(message = "El ID del Centro de Acopio destino es obligatorio")
    private Long centroAcopioId;
}
