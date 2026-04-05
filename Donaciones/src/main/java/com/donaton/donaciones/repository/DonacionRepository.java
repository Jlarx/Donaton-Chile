package com.donaton.donaciones.repository;

import com.donaton.donaciones.entity.Donacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DonacionRepository extends JpaRepository<Donacion, Long> {
    List<Donacion> findByCentroAcopioId(Long centroAcopioId);
}
