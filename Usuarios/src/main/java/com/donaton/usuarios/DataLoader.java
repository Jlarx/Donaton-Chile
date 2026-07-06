package com.donaton.usuarios;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Bean;
import com.donaton.usuarios.entity.Usuario;
import com.donaton.usuarios.repository.UsuarioRepository;

/**
 * Carga/actualiza los usuarios de prueba al iniciar la aplicación.
 * Usa upsert por email para que funcione aunque la BD ya tenga datos viejos.
 */
@Component
public class DataLoader {

    @Bean
    public CommandLineRunner loadData(UsuarioRepository repository) {
        return args -> {
            upsertUsuario(repository, "admin@donaton.cl", "admin123", "Coordinador Logístico", "ADMIN");
            upsertUsuario(repository, "user@donaton.cl",  "user123",  "Juan Voluntario",       "USER");

            System.out.println("=================================================");
            System.out.println("  Usuarios de demo disponibles:");
            System.out.println("  ADMIN  -> admin@donaton.cl  / admin123");
            System.out.println("  USER   -> user@donaton.cl   / user123");
            System.out.println("=================================================");
        };
    }

    /**
     * Inserta el usuario si no existe; actualiza contraseña y rol si ya existe.
     * Esto garantiza que aunque la BD tenga datos viejos, las credenciales
     * de demo siempre sean correctas.
     */
    private void upsertUsuario(UsuarioRepository repo, String email, String password, String nombre, String rol) {
        Usuario u = repo.findByEmail(email).orElse(new Usuario());
        u.setEmail(email);
        u.setPassword(password);
        u.setNombre(nombre);
        u.setRol(rol);
        repo.save(u);
    }
}
