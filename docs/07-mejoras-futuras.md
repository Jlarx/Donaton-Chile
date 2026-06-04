# Roadmap y Mejoras Futuras - Donaton

Este documento recopila las tareas técnicas y de producto que han sido postergadas por tiempo en este semestre, sirviendo como guía de escalabilidad futura para el sistema **Donaton**.

---

## 1. Seguridad Avanzada y SSO (Single Sign-On)
*   **Estado actual:** La Central implementa un filtro JWT simple y un secreto hardcodeado en `application.yml`.
*   **Mejora propuesta:** 
    *   Migrar la autenticación de usuarios a un servidor dedicado de identidad como **Keycloak** u **Okta** compatible con **OAuth2 / OIDC**.
    *   Habilitar HTTPS mediante certificados SSL/TLS (ej: Let's Encrypt) en el API Gateway para cifrar el tráfico.

---

## 2. Comunicación Real-Time (WebSockets / SSE)
*   **Estado actual:** El Dashboard de React realiza polling cada 15 segundos mediante peticiones HTTP repetitivas.
*   **Mejora propuesta:** 
    *   Configurar un canal de WebSockets o Server-Sent Events (SSE) desde el BFF.
    *   Cuando un voluntario registre una Necesidad en el terreno o una donación cambie a estado `EN_TRASLADO`, el servidor enviará un push a la pantalla del administrador sin recargar.

---

## 3. Control de Migraciones de Base de Datos
*   **Estado actual:** H2 utiliza `spring.jpa.hibernate.ddl-auto=update` para crear tablas automáticamente. Esto no es seguro ni rastreable en producción.
*   **Mejora propuesta:** Integrar **Flyway** o **Liquibase** en cada microservicio para manejar scripts SQL de migración versionados, permitiendo rollbacks controlados del esquema.

---

## 4. Despliegue de Infraestructura y Orquestación (Kubernetes)
*   **Estado actual:** Los servicios se ejecutan de manera local o mediante Docker Compose.
*   **Mejora propuesta:** 
    *   Subir imágenes Docker a un registro privado (ej: Docker Hub o AWS ECR).
    *   Crear manifiestos de Kubernetes (YAMLs) para desplegar pods, configurando réplicas con HPA (Horizontal Pod Autoscaler) e ingress controllers para balancear el tráfico externo de manera elástica en la nube (AWS EKS / Google GKE).

---

## 5. Pruebas de Integración E2E Automatizadas
*   **Estado actual:** Se tienen tests unitarios e integrados mockeando capas con Mockito.
*   **Mejora propuesta:** Configurar pruebas End-to-End automáticas con herramientas como **Playwright** o **Cypress** para simular clics, logins, llenado de formularios de donación y transiciones de estado en la UI directamente contra las bases de datos de test.
