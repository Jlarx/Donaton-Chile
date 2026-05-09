import axios from 'axios';

// Instancia global de Axios apuntando al API Gateway Central (Puerto 8080)
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

api.interceptors.response.use(
    response => response,
    error => {
        let mensaje = "Ocurrió un error inesperado al conectar con el servidor.";

        if (error.message === "Network Error") {
            mensaje = "Error de red: No se pudo conectar con el servidor. Verifique que los microservicios estén en ejecución.";
        } else if (error.code === 'ECONNABORTED') {
            mensaje = "Tiempo de espera agotado al conectar con el servidor.";
        } else if (error.response) {
            const status = error.response.status;
            if (status === 404) mensaje = "Recurso no encontrado (404).";
            else if (status === 500) mensaje = "Error interno del servidor (500).";
            else if (status === 403) mensaje = "Acceso denegado (403).";
            else if (status === 401) mensaje = "No autorizado (401).";
            else if (status === 400) mensaje = "Petición incorrecta o datos inválidos (400).";
            else if (error.response.data && error.response.data.message) {
                // Si el backend envía su propio mensaje, podríamos intentar traducirlo si está en inglés, 
                // o simplemente usarlo asumiendo que el backend envía español.
                mensaje = error.response.data.message;
            } else {
                mensaje = `Error en el servidor: HTTP ${status}`;
            }
        }

        // Sobrescribir el mensaje de error
        error.message = mensaje;
        if (!error.response) {
            error.response = { data: { message: mensaje } };
        } else if (!error.response.data) {
            error.response.data = { message: mensaje };
        } else {
            error.response.data.message = mensaje;
        }

        return Promise.reject(error);
    }
);

// Podemos usar interceptores aquí en el futuro para enviar un Bearer Token
api.interceptors.request.use(config => {
    // Uso de JWT:
    const token = localStorage.getItem('token');
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
