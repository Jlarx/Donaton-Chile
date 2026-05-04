package com.donaton.usuarios.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
