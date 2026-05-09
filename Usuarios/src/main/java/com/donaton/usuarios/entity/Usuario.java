package com.donaton.usuarios.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // En un entorno real se almacena un hash

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String rol; // ej. ADMIN, USER
}
