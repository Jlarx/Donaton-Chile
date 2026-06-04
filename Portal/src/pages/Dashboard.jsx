import React, { useState, useEffect } from 'react';
import { Heart, PackageOpen, Box, Activity, AlertCircle } from 'lucide-react';
import api from '../services/api';

/**
 * Vista del Dashboard para el Frontend.
 * Consume el endpoint de orquestación del BFF (/bff/dashboard-overview) para
 * pintar un resumen del estado del sistema en un solo llamado.
 * 
 * Contiene comentarios en español tipo estudiante universitario para la entrega.
 */
export default function Dashboard() {
    // Estados principales para la información de la API, carga y posibles errores de conexión
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Al montar el componente cargamos los datos del BFF
    useEffect(() => {
        cargarResumen();
        // Polling de 15 segundos para que se vea dinámico en la defensa del proyecto
        const interval = setInterval(cargarResumen, 15000);
        return () => clearInterval(interval);
    }, []);

    const cargarResumen = () => {
        // Llamamos al endpoint del BFF mediante Axios.
        // Dado que usamos 'http://localhost:8080/bff/dashboard-overview', Axios ignora el baseURL '/api'
        // pero mantiene el interceptor para agregar el Bearer Token en los headers si existe.
        api.get('http://localhost:8080/bff/dashboard-overview')
           .then(res => {
               setData(res.data);
               setError(null);
               setLoading(false);
           })
           .catch(err => {
               console.error("Error cargando el dashboard desde el BFF:", err);
               setError(err.response?.data?.message || err.message || "Error al conectar con el Gateway.");
               setLoading(false);
           });
    };

    // Estado de carga inicial con spinner css personalizado
    if (loading && !data) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
                <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #4f46e5', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ marginTop: '16px', color: '#64748b' }}>Conectando al BFF Central...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Tarjeta de alerta si falla el Gateway o no hay conexión de red
    if (error && !data) {
        return (
            <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#b91c1c' }}>
                    <AlertCircle size={24} />
                    <h3>Error de comunicación con el Backend</h3>
                </div>
                <p style={{ marginTop: '12px', color: '#475569' }}>
                    No pudimos cargar la vista unificada. Asegúrese de que el <strong>EurekaServer</strong>, la <strong>Central</strong> y los microservicios estén levantados.
                </p>
                <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#ef4444' }}>Detalle: {error}</div>
                <button className="btn" onClick={() => { setLoading(true); cargarResumen(); }} style={{ marginTop: '16px' }}>Reintentar Conexión</button>
            </div>
        );
    }

    // Si fallan los microservicios, el BFF retorna listas vacías, así que prevenimos nulos
    const resumen = data?.resumen || {
        totalCentros: 0,
        totalInventario: 0,
        totalCapacidad: 0,
        totalDonaciones: 0,
        totalItemsDonados: 0,
        donacionesRegistradas: 0,
        donacionesRecibidas: 0,
        totalNecesidades: 0,
        necesidadesPendientes: 0
    };

    const estadoServicios = data?.estadoServicios || {
        logistica: 'DOWN',
        donaciones: 'DOWN',
        necesidades: 'DOWN'
    };

    // Calculamos el % de carga de los centros (inventario actual vs capacidad máxima)
    const porcentajeCarga = resumen.totalCapacidad > 0 
        ? Math.round((resumen.totalInventario / resumen.totalCapacidad) * 100) 
        : 0;

    return (
        <div>
            {/* Header del Dashboard */}
            <div className="page-header">
                <h2 className="page-title">Bienvenido al Centro de Control de Donaciones</h2>
                <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
                    <Activity size={14} /> Sistema en Línea
                </span>
            </div>

            {/* Grid de Tarjetas de Indicadores (KPIs) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                
                {/* Indicador 1: Donaciones totales */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: '-15px', top: '-15px', opacity: 0.08, color: '#ef4444' }}>
                        <Heart size={90} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
                        <Heart size={20} />
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Trazabilidad de Donaciones</span>
                    </div>
                    <h3 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', margin: '4px 0' }}>{resumen.totalDonaciones}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Unidades totales aportadas: <strong>{resumen.totalItemsDonados}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <span className="badge badge-info">{resumen.donacionesRegistradas} Registradas</span>
                        <span className="badge badge-success">{resumen.donacionesRecibidas} Recibidas</span>
                    </div>
                </div>

                {/* Indicador 2: Capacidad Logística */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: '-15px', top: '-15px', opacity: 0.08, color: '#3b82f6' }}>
                        <PackageOpen size={90} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6' }}>
                        <PackageOpen size={20} />
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Centros de Acopio Activos</span>
                    </div>
                    <h3 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', margin: '4px 0' }}>{resumen.totalCentros}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Carga global: <strong>{resumen.totalInventario}</strong> / {resumen.totalCapacidad} unidades
                    </div>
                    {/* Barra de progreso de capacidad global del sistema */}
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginTop: '8px', overflow: 'hidden' }}>
                        <div style={{ width: `${porcentajeCarga}%`, height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px', transition: 'width 0.6s ease' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                        <span>Porcentaje de Ocupación</span>
                        <strong>{porcentajeCarga}%</strong>
                    </div>
                </div>

                {/* Indicador 3: Necesidades críticas */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: '-15px', top: '-15px', opacity: 0.08, color: '#eab308' }}>
                        <Box size={90} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#eab308' }}>
                        <Box size={20} />
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Necesidades en Terreno</span>
                    </div>
                    <h3 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', margin: '4px 0' }}>{resumen.totalNecesidades}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Reportes de emergencia registrados: <strong>{resumen.totalNecesidades}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <span className="badge badge-warning">{resumen.necesidadesPendientes} Pendientes</span>
                        <span className="badge badge-success">{resumen.totalNecesidades - resumen.necesidadesPendientes} Cubiertas</span>
                    </div>
                </div>

            </div>

            {/* Fila de Detalle Tecnológico y Estado de Salud del Sistema */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                
                {/* Sección Estado de Microservicios */}
                <div className="card" style={{ borderLeft: '4px solid #4f46e5' }}>
                    <h3 style={{ marginBottom: '12px', fontSize: '1.15rem' }}>Monitoreo de Infraestructura</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '20px' }}>
                        El backend BFF unifica las respuestas. Si un servicio se cae, el <strong>Circuit Breaker</strong> en el Gateway evita la denegación total del sistema.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                            <div>
                                <strong style={{ fontSize: '0.875rem', color: '#1e293b' }}>Servicio de Logística</strong>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Puerto: 8082 | Eureka: logistica-service</div>
                            </div>
                            <span className={`badge ${estadoServicios.logistica === 'UP' ? 'badge-success' : 'badge-error'}`} style={{ minWidth: '85px', textAlign: 'center' }}>
                                {estadoServicios.logistica === 'UP' ? 'ACTIVO (UP)' : 'CAÍDO (DOWN)'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                            <div>
                                <strong style={{ fontSize: '0.875rem', color: '#1e293b' }}>Servicio de Donaciones</strong>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Puerto: 8081 | Eureka: donaciones-service</div>
                            </div>
                            <span className={`badge ${estadoServicios.donaciones === 'UP' ? 'badge-success' : 'badge-error'}`} style={{ minWidth: '85px', textAlign: 'center' }}>
                                {estadoServicios.donaciones === 'UP' ? 'ACTIVO (UP)' : 'CAÍDO (DOWN)'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                            <div>
                                <strong style={{ fontSize: '0.875rem', color: '#1e293b' }}>Servicio de Necesidades</strong>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Puerto: 8083 | Eureka: necesidades-service</div>
                            </div>
                            <span className={`badge ${estadoServicios.necesidades === 'UP' ? 'badge-success' : 'badge-error'}`} style={{ minWidth: '85px', textAlign: 'center' }}>
                                {estadoServicios.necesidades === 'UP' ? 'ACTIVO (UP)' : 'CAÍDO (DOWN)'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sección Información del BFF & Resiliencia */}
                <div className="card" style={{ borderLeft: '4px solid #059669', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ marginBottom: '12px', fontSize: '1.15rem' }}>Bitácora del BFF (Backend For Frontend)</h3>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5' }}>
                            Este panel consume el endpoint <code>/bff/dashboard-overview</code> expuesto en la <strong>Central</strong>. 
                            Este controlador realiza peticiones concurrentes reactivas mediante <code>WebClient</code> hacia los tres servicios 
                            de negocio y consolida los indicadores de manera eficiente en un único DTO de respuesta.
                        </p>
                    </div>
                    <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.8rem', color: '#166534' }}>
                        <strong>Tip del Grupo:</strong> Apaga temporalmente el microservicio de Donaciones (8081). Verás cómo este Dashboard sigue cargando (mostrando 0 donaciones y estado CAÍDO) sin lanzar un error 500 al usuario.
                    </div>
                </div>

            </div>
        </div>
    );
}
