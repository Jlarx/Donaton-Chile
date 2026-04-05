package com.donaton.logistica;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Bean;
import com.donaton.logistica.entity.CentroAcopio;
import com.donaton.logistica.repository.CentroAcopioRepository;

@Component
public class DataLoader {

    @Bean
    public CommandLineRunner loadData(CentroAcopioRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                CentroAcopio c1 = new CentroAcopio();
                c1.setNombre("Sede Estadio Nacional");
                c1.setUbicacion("Av. Grecia 2001, Ñuñoa, Santiago");
                c1.setCapacidadMaxima(10000);
                c1.setInventarioActual(0);
                
                CentroAcopio c2 = new CentroAcopio();
                c2.setNombre("Sede Parque O'Higgins");
                c2.setUbicacion("Av. Tupper, Santiago Centro");
                c2.setCapacidadMaxima(8000);
                c2.setInventarioActual(0);

                CentroAcopio c3 = new CentroAcopio();
                c3.setNombre("Movistar Arena");
                c3.setUbicacion("Interior Parque O'Higgins, Santiago");
                c3.setCapacidadMaxima(15000);
                c3.setInventarioActual(0);

                CentroAcopio c4 = new CentroAcopio();
                c4.setNombre("Gimnasio Municipal de Maipú");
                c4.setUbicacion("Fernando Riesco, Maipú, Santiago");
                c4.setCapacidadMaxima(5000);
                c4.setInventarioActual(0);

                CentroAcopio c5 = new CentroAcopio();
                c5.setNombre("Centro Cultural Estación Mapocho");
                c5.setUbicacion("Plaza de la Cultura, Santiago Centro");
                c5.setCapacidadMaxima(12000);
                c5.setInventarioActual(0);

                repository.save(c1);
                repository.save(c2);
                repository.save(c3);
                repository.save(c4);
                repository.save(c5);
                
                System.out.println("=== Bases de Chile Pre-cargadas en BD ===");
            }
        };
    }
}
