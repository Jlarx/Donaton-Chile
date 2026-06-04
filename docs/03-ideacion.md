# Proceso de Ideación del Proyecto - Donaton

Este documento detalla el origen de la idea del proyecto **Donaton**, las decisiones de diseño del producto, las historias de usuario priorizadas y las funcionalidades que fueron descartadas o postergadas.

---

## 1. Ideación y Necesidad Detectada
Durante catástrofes naturales (como terremotos, inundaciones o incendios forestales) en Chile, la gestión de donaciones suele centralizarse de forma caótica. Nos encontramos con tres problemas clave:
1.  **Falta de trazabilidad:** Los donantes no saben si sus insumos llegaron a destino o si siguen en traslado.
2.  **Desbalance de centros de acopio:** Algunos centros quedan colapsados con ropa o agua, mientras que otros están completamente vacíos.
3.  **Desconexión con el terreno:** Los voluntarios no tienen un canal oficial para notificar necesidades reales y críticas (ej: "se necesitan frazadas en sector norte"), lo que genera donaciones inútiles.

**Propuesta de Valor (Donaton):** Una plataforma de microservicios distribuida que conecte a administradores logísticos (que configuran centros y distribuyen insumos), donantes/voluntarios (que registran donaciones y reportan necesidades en terreno) en una sola UI integrada mediante un BFF.

---

## 2. Historias de Usuario (MVP)
*   **Como Administrador (Coordinador General):**
    *   *Quiero* registrar y visualizar la capacidad de los centros de acopio de ayuda.
    *   *Quiero* hacer reparticiones masivas de insumos mediante una estrategia automática.
    *   *Quiero* actualizar el estado de las donaciones (REGISTRADA -> ASIGNADA -> EN_TRASLADO -> RECIBIDA) para controlar el flujo de transporte.
    *   *Quiero* eliminar necesidades duplicadas o mal ingresadas.
*   **Como Voluntario de Terreno / Donante:**
    *   *Quiero* autenticarme con mi correo y ver solo mis aportes realizados.
    *   *Quiero* reportar necesidades urgentes detallando el tipo de recurso y la ubicación.
    *   *Quiero* ingresar nuevas donaciones asociándolas directamente a un centro de acopio destino.

---

## 3. Lluvia de Ideas y Priorización (Matriz de Decisiones)
Durante las reuniones de ideación del grupo de estudiantes, debatimos los siguientes puntos:

| Funcionalidad Propuesta | Prioridad | Decisión | Razón de la Decisión |
| :--- | :---: | :---: | :--- |
| **Autenticación con JWT** | Alta | **Implementada** | Requerido para la seguridad de microservicios y para diferenciar pantallas de ADMIN y USER. |
| **BFF Dashboard unificado** | Alta | **Implementada** | Evita múltiples llamadas API concurrentes desde el navegador del cliente. |
| **Circuit Breaker y Tolerancia** | Media-Alta | **Implementada** | Clave para cumplir con la arquitectura robusta exigida en el curso de Fullstack III. |
| **Geolocalización en Tiempo Real** | Alta | *Descartada* | Complejidad de APIs de Google Maps e integración móvil excedía el tiempo del semestre. |
| **Sistema de Notificaciones Push** | Media | *Descartada* | Requería servidores WebSocket u Firebase. Se postergó como mejora futura. |
| **Subida de fotos de necesidades** | Media | *Descartada* | Guardar imágenes binarias requiere configurar S3 o AWS Bucket. Se prefirió usar descripciones de texto simples. |
| **Dockerización Completa** | Media | **Preparada** | Facilita la distribución y ejecución para la evaluación del profesor. |
