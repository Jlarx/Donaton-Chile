package com.donaton.necesidades.dto;

import lombok.Data;
import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Data
public class NecesidadDTO {
    private Long id;

    @NotBlank(message = "El título de la necesidad es obligatorio")
    private String titulo;

    @NotBlank(message = "La descripción de la necesidad es obligatoria")
    private String descripcion;

    @NotBlank(message = "El tipo de recurso es obligatorio")
    private String tipoRecurso;

    @NotNull(message = "La cantidad requerida es obligatoria")
    @Min(value = 1, message = "La cantidad requerida debe ser al menos 1")
    private Integer cantidadRequerida;

    @NotBlank(message = "La ubicación es obligatoria")
    private String ubicacion;

    private String estado;
    private LocalDateTime fechaReporte;
}
