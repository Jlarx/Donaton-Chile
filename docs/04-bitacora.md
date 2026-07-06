# Bitácora de Desarrollo - Donaton

Este documento recopila las fases de desarrollo del proyecto **Donaton**, detallando el trabajo realizado por el equipo de estudiantes, los hitos clave y la resolución de inconvenientes técnicos.

---

## Semana 1: Configuración de Base e Infraestructura
*   **Hitos logrados:**
    *   Diseño del diagrama lógico de la arquitectura en microservicios.
    *   Creación del proyecto Maven multi-módulo.
    *   Configuración del **EurekaServer** (puerto 8761) y registro inicial de los servicios de Usuarios (puerto 8084) y Gateway Central (puerto 8080).
*   **Desafío técnico:** Spring Boot 3.5.3 no autodetectaba el procesador de anotaciones de Lombok en la compilación por consola, resultando en errores de getters y setters ausentes.
*   **Resolución:** Se configuró explícitamente el plugin `maven-compiler-plugin` en el `pom.xml` padre declarando la ruta del procesador `lombok`, logrando compilar con éxito mediante `./mvnw.cmd`.

---

## Semana 2: Lógica de Dominio y Seguridad JWT
*   **Hitos logrados:**
    *   Implementación de los microservicios core: **Donaciones** (8081) y **Logística** (8082).
    *   Integración del patrón *Factory Method* para la creación de tipos de donación (Alimentos, Ropa, Salud).
    *   Implementación del patrón *Strategy* para la distribución equitativa de recursos.
    *   Desarrollo del filtro `JwtAuthenticationFilter` en la Central para proteger las rutas de donaciones y logística, exigiendo token Bearer.
*   **Desafío técnico:** Las donaciones debían validarse contra los centros existentes en logística, pero estaban en bases de datos e instancias de Spring separadas.
*   **Resolución:** Se implementó `FeignClient` en Donaciones para realizar llamadas internas síncronas a Logística (`/api/logistica/centros/{id}`), capturando excepciones `FeignException.NotFound` para lanzar un error amigable al cliente.

---

## Semana 3: Microservicio Necesidades y Maquetación Frontend
*   **Hitos logrados:**
    *   Creación del microservicio **Necesidades** (8083) y su persistencia PostgreSQL independiente.
    *   Desarrollo de las vistas principales en React utilizando componentes de UI interactiva (`Donaciones.jsx`, `Logistica.jsx` y `Necesidades.jsx`).
    *   Implementación del patrón de componentes *Container/Presentational* para desacoplar la lógica de API de la renderización visual en `Necesidades.jsx` y `NecesidadesView.jsx`.
*   **Desafío técnico:** El paso del token de autenticación a través de Axios requería repetirse en cada petición.
*   **Resolución:** Se configuró un interceptor de solicitudes global en `api.js` que recupera el token del `localStorage` e inyecta la cabecera `Authorization: Bearer <token>` automáticamente.

---

## Semana 4: BFF Dashboard, Estados de Donación y Cierre
*   **Hitos logrados:**
    *   Añadido el atributo `estado` a las donaciones (REGISTRADA, ASIGNADA, etc.) y creado el endpoint `PUT /api/donaciones/{id}/estado` para permitir a los administradores actualizar la logística del traslado.
    *   Creación del endpoint orquestador `/bff/dashboard-overview` en el BFF, el cual paraleliza las peticiones de los tres microservicios principales usando Project Reactor (`Mono.zip`).
    *   Diseño visual interactivo en la página `Dashboard.jsx` para mostrar los KPIs generales, barra de progreso de capacidad global e indicadores de salud de la infraestructura.
    *   Creación de la suite de pruebas unitarias mocking para el controlador del BFF y verificación de cobertura de pruebas generales.
    *   Creación de las guías de despliegue y preparación de la dockerización de todos los microservicios.
