# Guía de Ejecución Paso a Paso - Donaton

Este documento provee las instrucciones necesarias para compilar, testear y arrancar la plataforma **Donaton** desde cero en su máquina local.

---

## 1. Requisitos Previos
Asegúrese de contar con las siguientes herramientas instaladas en su sistema:
*   **Java Development Kit (JDK):** Versión 17 o superior.
*   **Node.js:** Versión 18 o superior (con gestor de paquetes `npm`).
*   **Maven:** (Opcional, ya que se incluye el wrapper `mvnw.cmd` en la raíz).

---

## 2. Compilar el Backend y Correr Tests
Desde una terminal ubicada en la raíz del proyecto (`./productos/productos`), ejecute el siguiente comando para limpiar, procesar las anotaciones de Lombok, compilar y ejecutar todas las pruebas unitarias:

```powershell
.\mvnw.cmd clean install
```
*Si todo está bien, aparecerá un listado de proyectos compitados con éxito en consola (`BUILD SUCCESS` en todos los módulos).*

---

## 3. Secuencia de Arranque de Microservicios
Es **mandatorio** arrancar los servicios en el siguiente orden para permitir un correcto registro en Eureka y evitar fallos de conexión:

1.  **EurekaServer (Puerto 8761):**
    *   Ubicación: `./EurekaServer`
    *   Comando: `..\mvnw.cmd spring-boot:run`
    *   *Nota: Espere a que abra http://localhost:8761 en el navegador.*
2.  **Usuarios (Puerto 8084):**
    *   Ubicación: `./Usuarios`
    *   Comando: `..\mvnw.cmd spring-boot:run`
3.  **Donaciones (Puerto 8081):**
    *   Ubicación: `./Donaciones`
    *   Comando: `..\mvnw.cmd spring-boot:run`
4.  **Logística (Puerto 8082):**
    *   Ubicación: `./Logistica`
    *   Comando: `..\mvnw.cmd spring-boot:run`
5.  **Necesidades (Puerto 8083):**
    *   Ubicación: `./Necesidades`
    *   Comando: `..\mvnw.cmd spring-boot:run`
6.  **Central (Puerto 8080 - API Gateway/BFF):**
    *   Ubicación: `./Central`
    *   Comando: `..\mvnw.cmd spring-boot:run`
    *   *Nota: Esperar a que se conecte con todos los microservicios en Eureka.*
7.  **Portal (Puerto 5173 - Frontend React):**
    *   Ubicación: `./Portal`
    *   Comando: `npm install` (primera vez) y luego `npm run dev`

---

## 4. Arranque Automático mediante Script (Recomendado)
Para simplificar la defensa académica del proyecto, se ha dejado un script batch en la raíz que automatiza la apertura de ventanas y arranque ordenado:

```powershell
.\start-all.bat
```
Este script levantará de forma secuencial cada módulo en una ventana independiente. Espere de 15 a 20 segundos y abra [http://localhost:5173](http://localhost:5173) en su navegador web.
