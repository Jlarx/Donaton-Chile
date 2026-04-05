package com.donaton.necesidades.repository;

import com.donaton.necesidades.entity.Necesidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NecesidadRepository extends JpaRepository<Necesidad, Long> {
    // Método autogenerado por Spring Data para buscar necesidades por estado (Ej:
    // PENDIENTE)
    List<Necesidad> findByEstado(String estado);
}
