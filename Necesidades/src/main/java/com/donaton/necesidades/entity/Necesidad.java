package com.donaton.necesidades.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.LocalDateTime;

//Entidad que representa la tabla 'necesidades' en la base de datos.
@Entity
@Table(name = "necesidades")
@Data // Lombok genera Getters, Setters y toString
public class Necesidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Identificador único autoincremental
    private String titulo; // Título o descripción breve (Ej: "Falta agua en población X")
    private String descripcion; // Detalle completo de la situación
    private String tipoRecurso; // ALIMENTO, SALUD, ROPA, etc.
    private Integer cantidadRequerida; // Cantidad necesaria del recurso
    private String ubicacion; // Zona o dirección
    private String estado; // PENDIENTE, EN_PROCESO, CUBIERTA
    private LocalDateTime fechaReporte = LocalDateTime.now(); // Fecha y hora de registro automática
}
