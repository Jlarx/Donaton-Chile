# Patrones de Diseño y Buenas Prácticas - Donaton

Este documento describe detalladamente los patrones de diseño arquitectónico y de software que se han implementado en el sistema **Donaton**, justificando su uso en el contexto académico.

---

## 1. Patrón Backend For Frontend (BFF)
*   **Ubicación:** Central (`BffController.java`)
*   **Problema resuelto:** Para mostrar un panel de control interactivo en la UI, el Portal necesitaría realizar múltiples peticiones HTTP consecutivas (hacia Donaciones, Logística y Necesidades). Esto genera "overfetching", consumo excesivo de red en el cliente, y latencia visible.
*   **Implementación:** Se define un controlador exclusivo (`BffController`) en el Gateway (Central) que consume reactivamente los endpoints de los tres servicios, consolida los datos agregando métricas acumuladas e indicadores de salud de cada servicio, y retorna un único DTO limpio.

---

## 2. Patrón Factory Method (Fábrica)
*   **Ubicación:** Donaciones (`DonacionFactory.java`, `AlimentoDonacionFactory`, etc.)
*   **Problema resuelto:** El registro de donaciones debe instanciar objetos del tipo `Donacion` que difieren en su clasificación lógica e inicialización (`ALIMENTOS`, `SALUD`, `ROPA`). Hardcodear esta inicialización directamente en el controlador o servicio rompe el principio Open/Closed.
*   **Implementación:** 
    *   Se define la interfaz `DonacionFactory` con el método `crearDonacion()`.
    *   Se crean implementaciones especializadas anotadas como componentes de Spring (ej: `@Component("ALIMENTOS")`).
    *   En `DonacionService`, Spring inyecta un mapa dinámico `Map<String, DonacionFactory> donacionFactories` y el servicio despacha la creación al factory correspondiente según el string recibido en el DTO, eliminando bloques condicionales extensos (`if-else`).

---

## 3. Patrón Strategy (Estrategia)
*   **Ubicación:** Logística (`DistribucionStrategy.java`, `DistribucionEquitativaStrategy.java`)
*   **Problema resuelto:** Ante una emergencia, el administrador necesita realizar una asignación masiva de recursos a los centros de acopio activos. El algoritmo de reparto puede cambiar en el futuro (ej: por cercanía, por prioridad de criticidad, o de forma equitativa).
*   **Implementación:**
    *   Se define la interfaz `DistribucionStrategy` con la firma `asignarRecursos(List<CentroAcopioDTO> centros, Integer cantidad)`.
    *   Se implementa la clase concreta `DistribucionEquitativaStrategy` para dividir de manera igualitaria las unidades.
    *   En `LogisticaController`, se inyecta la interfaz `DistribucionStrategy`. Cambiar la estrategia en producción es tan simple como cambiar la declaración del bean inyectado o parametrizarlo dinámicamente, cumpliendo con la flexibilidad requerida.

---

## 4. Patrón Repository (Repositorio)
*   **Ubicación:** Todos los microservicios (`DonacionRepository.java`, `CentroAcopioRepository.java`, etc.)
*   **Justificación:** Aísla el dominio de negocio (entidades JPA) de los detalles de infraestructura de persistencia (SQL/JDBC).
*   **Implementación:** Al extender `JpaRepository<T, ID>`, Spring Data genera en tiempo de ejecución las implementaciones necesarias para la base de datos H2, abstrayendo las consultas básicas de creación, eliminación y búsquedas personalizadas (como `findByEstado` o `findByCentroAcopioId`).

---

## 5. Capa de Servicios (Service Layer)
*   **Justificación:** Los controladores REST solo deben ser responsables de recibir las peticiones HTTP, validar los DTOs y retornar la respuesta correspondiente. La lógica de negocio pesada (orquestar clientes Feign, invocar fábricas, calcular inventarios) se encapsula en clases `@Service`.
*   **Implementación:** Clases como `DonacionService` y `CentroAcopioService` contienen el comportamiento semántico de la aplicación, facilitando la realización de pruebas unitarias mocking con JUnit y Mockito independientes del contexto web.
