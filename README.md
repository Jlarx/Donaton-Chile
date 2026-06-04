# Donaton - Plataforma de Gestión de Ayuda Humanitaria

Donaton es una plataforma descentralizada basada en una **Arquitectura de Microservicios** diseñada para coordinar y optimizar la entrega de ayuda en situaciones de emergencia en Chile. Este proyecto fue desarrollado para la unidad 3 del curso **Desarrollo Fullstack III**.

El sistema integra múltiples microservicios autónomos, un API Gateway con patrón BFF (Backend For Frontend), bases de datos embebidas (H2), resiliencia con Circuit Breakers (Resilience4j), comunicación inter-servicio síncrona mediante OpenFeign y un Portal administrativo interactivo desarrollado en React.

---

## 🛠️ Estructura y Puertos del Sistema

| Módulo | Directorio | Puerto | Descripción |
| :--- | :--- | :---: | :--- |
| **Eureka Server** | `EurekaServer` | `8761` | Servidor de Registro y Descubrimiento de servicios |
| **Central** | `Central` | `8080` | API Gateway + Orquestador BFF + Circuit Breakers |
| **Usuarios** | `Usuarios` | `8084` | Autenticación de usuarios y generación de JWT |
| **Donaciones** | `Donaciones` | `8081` | Registro y control de trazabilidad de aportes |
| **Logística** | `Logistica` | `8082` | Gestión de Centros de Acopio y Asignaciones Masivas |
| **Necesidades** | `Necesidades` | `8083` | Reporte y control de urgencias críticas en terreno |
| **Portal** | `Portal` | `5173` | Cliente Web SPA (React / Vite) |

---

## 🚀 Guía de Ejecución Rápida (Local)

### Paso 1: Compilar todos los microservicios
Abra una terminal en la raíz del proyecto y corra el siguiente comando para compilar el código Java y las pruebas unitarias:
```bash
.\mvnw.cmd clean install
```

### Paso 2: Levantar la plataforma completa
Puede iniciar todos los microservicios en ventanas separadas utilizando el script de automatización suministrado:
```bash
.\start-all.bat
```
*(Espere 15-20 segundos a que todos los servicios arranquen y se registren en Eureka Server)*

### Paso 3: Acceder en el navegador
Una vez que las consolas se estabilicen:
*   **Consola Eureka:** Abra [http://localhost:8761](http://localhost:8761) para ver que todos los nombres de servicio (`donaciones-service`, `logistica-service`, `necesidades-service`, `usuarios-service`) aparezcan en estado `UP`.
*   **Portal Donaton:** Acceda a [http://localhost:5173](http://localhost:5173) para interactuar con la plataforma.

---

## 🔑 Cuentas de Prueba por Defecto

*   **Administrador (ADMIN):**
    *   **Email:** `coordinador@donaton.com`
    *   **Password:** `123`
*   **Voluntario / Donante (USER):**
    *   **Email:** `juan@voluntario.com`
    *   **Password:** `123`

---

## 📖 Endpoints Principales del Sistema (Puertos Gateway 8080)

*   **Autenticación:**
    *   `POST /api/auth/registro` -> Registrar nuevos usuarios.
    *   `POST /api/auth/login` -> Iniciar sesión y recibir Token JWT.
*   **BFF Dashboard:**
    *   `GET /bff/dashboard-overview` -> Orquestador de métricas combinadas (Donaciones + Centros + Necesidades + Salud de Servicios).
*   **Donaciones:**
    *   `GET /api/donaciones` -> Historial de aportaciones.
    *   `POST /api/donaciones` -> Crear donación.
    *   `PUT /api/donaciones/{id}/estado?estado=RECIBIDA` -> Actualizar flujo logístico.
*   **Logística:**
    *   `GET /api/logistica/centros` -> Listar centros físicos.
    *   `POST /api/logistica/asignaciones?cantidad=100` -> Distribuir masivamente.
*   **Necesidades:**
    *   `GET /api/necesidades` -> Listar solicitudes en terreno.

---

## 📷 Guía de Capturas Requeridas para la Entrega Académica

Para el informe final de la unidad 3, se sugiere tomar capturas de las siguientes pantallas y flujos:

1.  **Dashboard del Eureka Server (`http://localhost:8761`):** Capturar la sección "Instances currently registered with Eureka" mostrando los 4 microservicios en verde (UP).
2.  **Dashboard del Portal (`http://localhost:5173`):** Conectado como `coordinador@donaton.com` para mostrar las tarjetas resumen de Donaciones, Centros de Acopio, Necesidades y los estados "ACTIVO (UP)" de los servicios.
3.  **Registro de una Donación:** Formulario de donación completo asociándolo a un centro físico y verificar cómo el inventario global de ese centro aumenta en la tabla correspondiente de Centros de Acopio.
4.  **Cambio de Estado de una Donación:** Una captura mostrando el dropdown en la fila de Donaciones con el cambio a `EN_TRASLADO` o `RECIBIDA` y su actualización de color (badge verde).
5.  **Tolerancia a fallos (Circuit Breaker):**
    *   Apague el microservicio de Necesidades en su consola (`CTRL+C`).
    *   Actualice el Dashboard del Portal. Capturar la vista donde el microservicio de Necesidades aparece como **CAÍDO (DOWN)**, pero el Dashboard sigue cargando las donaciones y centros con total normalidad.