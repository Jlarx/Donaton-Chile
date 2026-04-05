package com.donaton.logistica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class LogisticaApplication {
    public static void main(String[] args) {
        SpringApplication.run(LogisticaApplication.class, args);
    }
}
