package com.donaton.logistica.filter;

import jakarta.servlet.FilterChain;
import org.springframework.lang.NonNull;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@Slf4j
public class LoggingFilter extends OncePerRequestFilter {

    protected void doFilterInternal(
            @NonNull HttpServletRequest request, 
            @NonNull HttpServletResponse response, 
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        
        log.info("=== [Logistica] Request: {} {} ===", request.getMethod(), request.getRequestURI());
        
        long startTime = System.currentTimeMillis();
        filterChain.doFilter(request, response);
        long timeTaken = System.currentTimeMillis() - startTime;
        
        log.info("=== [Logistica] Status: {} ({} ms) ===", response.getStatus(), timeTaken);
    }
}
