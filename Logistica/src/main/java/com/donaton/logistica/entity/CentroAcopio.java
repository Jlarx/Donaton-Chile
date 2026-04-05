package com.donaton.logistica.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "centros_acopio")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CentroAcopio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String ubicacion;

    private Integer capacidadMaxima;
    
    private Integer inventarioActual;
}
