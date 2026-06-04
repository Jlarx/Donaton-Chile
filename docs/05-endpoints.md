# Catálogo de Endpoints - Donaton

Todas las peticiones públicas y externas deben dirigirse al API Gateway Central (`http://localhost:8080`). Aquellos endpoints protegidos requieren enviar la cabecera `Authorization: Bearer <token_jwt>`.

---

## 1. Microservicio de Usuarios (Autenticación)
*   **Base URL Interna:** `http://localhost:8084`
*   **Gateway Prefix:** `/api/auth`

### 1.1 Registrar Usuario
*   **Método:** `POST`
*   **Ruta:** `/api/auth/registro`
*   **Payload:**
    ```json
    {
      "email": "coordinador@donaton.com",
      "password": "123",
      "nombre": "Admin General",
      "rol": "ADMIN"
    }
    ```
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "email": "coordinador@donaton.com",
      "nombre": "Admin General",
      "rol": "ADMIN"
    }
    ```

### 1.2 Iniciar Sesión (Login)
*   **Método:** `POST`
*   **Ruta:** `/api/auth/login`
*   **Payload:**
    ```json
    {
      "email": "coordinador@donaton.com",
      "password": "123"
    }
    ```
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiJ9..."
    }
    ```

---

## 2. Microservicio de Logística (Centros de Acopio)
*   **Base URL Interna:** `http://localhost:8082`
*   **Gateway Prefix:** `/api/logistica` (Protegido por JWT)

### 2.1 Listar Centros
*   **Método:** `GET`
*   **Ruta:** `/api/logistica/centros`
*   **Respuesta Exitosa (200 OK):**
    ```json
    [
      {
        "id": 1,
        "nombre": "Centro Base Santiago",
        "ubicacion": "Av. Libertador 123",
        "capacidadMaxima": 500,
        "inventarioActual": 50
      }
    ]
    ```

### 2.2 Crear Centro de Acopio (Solo ADMIN)
*   **Método:** `POST`
*   **Ruta:** `/api/logistica/centros`
*   **Payload:**
    ```json
    {
      "nombre": "Centro Norte Antofagasta",
      "ubicacion": "Calle Prat 456",
      "capacidadMaxima": 1000
    }
    ```

### 2.3 Distribución Masiva (Strategy - Solo ADMIN)
*   **Método:** `POST`
*   **Ruta:** `/api/logistica/asignaciones?cantidad=300`
*   **Respuesta:** Reparte la cantidad de forma equitativa entre todos los centros incrementando su `inventarioActual`.

---

## 3. Microservicio de Donaciones
*   **Base URL Interna:** `http://localhost:8081`
*   **Gateway Prefix:** `/api/donaciones` (Protegido por JWT)

### 3.1 Registrar Donación
*   **Método:** `POST`
*   **Ruta:** `/api/donaciones`
*   **Payload:**
    ```json
    {
      "tipo": "ALIMENTOS",
      "recurso": "Caja de Conservas de Atún x24",
      "cantidad": 10,
      "origen": "Supermercado Mayorista",
      "centroAcopioId": 1
    }
    ```
*   **Respuesta (201 Created):** Retorna la donación creada con `id` y `estado` por defecto `"REGISTRADA"`.

### 3.2 Listar Donaciones
*   **Método:** `GET`
*   **Ruta:** `/api/donaciones`

### 3.3 Actualizar Estado (Solo ADMIN)
*   **Método:** `PUT`
*   **Ruta:** `/api/donaciones/{id}/estado?estado=RECIBIDA`
*   **Estados Permitidos:** `REGISTRADA`, `ASIGNADA`, `EN_TRASLADO`, `RECIBIDA`, `DISTRIBUIDA`, `CANCELADA`.

---

## 4. Microservicio de Necesidades
*   **Base URL Interna:** `http://localhost:8083`
*   **Gateway Prefix:** `/api/necesidades` (Protegido por JWT)

### 4.1 Registrar Necesidad (Solo ADMIN en UI, API libre con token)
*   **Método:** `POST`
*   **Ruta:** `/api/necesidades`
*   **Payload:**
    ```json
    {
      "titulo": "Falta Agua",
      "descripcion": "Agua embotellada para 30 familias aisladas",
      "tipoRecurso": "ALIMENTO",
      "cantidadRequerida": 120,
      "ubicacion": "Sector Rural El Colorado"
    }
    ```

### 4.2 Filtrar por Estado
*   **Método:** `GET`
*   **Ruta:** `/api/necesidades/estado/{estado}` (ej: `PENDIENTE`, `CUBIERTA`)

---

## 5. Gateway BFF (Central)
*   **Ruta:** `/bff/dashboard-overview`
*   **Método:** `GET`
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "centrosDisponibles": [...],
      "donacionesTotales": [...],
      "necesidadesTotales": [...],
      "resumen": {
        "totalCentros": 2,
        "totalInventario": 60,
        "totalCapacidad": 1500,
        "totalDonaciones": 3,
        "totalItemsDonados": 110,
        "donacionesRegistradas": 2,
        "donacionesRecibidas": 1,
        "totalNecesidades": 1,
        "necesidadesPendientes": 1
      },
      "estadoServicios": {
        "logistica": "UP",
        "donaciones": "UP",
        "necesidades": "UP"
      }
    }
    ```
