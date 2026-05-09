package com.donaton.usuarios.service;

import com.donaton.usuarios.config.JwtUtil;
import com.donaton.usuarios.dto.AuthRequest;
import com.donaton.usuarios.dto.AuthResponse;
import com.donaton.usuarios.entity.Usuario;
import com.donaton.usuarios.exception.ResourceNotFoundException;
import com.donaton.usuarios.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    public AuthResponse login(AuthRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.getEmail());
        
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Validacion de password muy simple para el demo
            if (usuario.getPassword().equals(request.getPassword())) {
                String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol());
                return new AuthResponse(token);
            }
        }
        throw new RuntimeException("Credenciales invalidas");
    }

    public Usuario registrarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
}
