import React, { useState, useEffect } from 'react';
import { Heart, PackageOpen, Box, Activity, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import api from '../services/api';

/**
 * Vista del Dashboard.
 * Consume el BFF (/bff/dashboard-overview) para un resumen en un solo llamado.
 * Implementa polling cada 15s para actualización dinámica.
 */
export default function Dashboard() {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        cargarResumen();
        const interval = setInterval(cargarResumen, 15000);
        return () => clearInterval(interval);
    }, []);

    const cargarResumen = () => {
        api.get('http://localhost:8080/bff/dashboard-overview')
           .then(res => {
               setData(res.data);
               setError(null);
               setLoading(false);
               setLastUpdate(new Date());
           })
           .catch(err => {
               setError(err.response?.data?.message || err.message || 'Error al conectar con el Gateway.');
               setLoading(false);
           });
    };

    // ── Estado de carga ──────────────────────────────────────────────
    if (loading && !data) {
        return (
            <div className="loading-wrapper fade-in">
                <div className="spinner" />
                <p className="loading-text">Conectando con el BFF Central...</p>
            </div>
        );
    }

    // ── Estado de error ──────────────────────────────────────────────
    if (error && !data) {
        return (
            <div className="card fade-in" style={{ borderLeft: '3px solid #f87171', maxWidth: '600px' }}>
                <div className="flex items-center gap-3 mb-4" style={{ color: '#f87171' }}>
                    <AlertCircle size={22} />
                    <h3 style={{ color: '#f87171' }}>Error de conexión con el Backend</h3>
                </div>
                <p className="text-sm text-muted" style={{ lineHeight: '1.6', marginBottom: '12px' }}>
                    No pudimos cargar la vista unificada. Asegúrese de que el <strong>EurekaServer</strong>,
                    la <strong>Central (Gateway)</strong> y los microservicios estén levantados.
                </p>
                <div style={{ fontSize: '0.8rem', color: '#f87171', fontFamily: 'monospace',
                              background: 'rgba(239,68,68,0.07)', padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                    {error}
                </div>
                <button className="btn btn-sm" onClick={() => { setLoading(true); cargarResumen(); }}>
                    <RefreshCw size={14} /> Reintentar
                </button>
            </div>
        );
    }

    // ── Datos del BFF ────────────────────────────────────────────────
    const resumen = data?.resumen || {
        totalCentros: 0, totalInventario: 0, totalCapacidad: 0,
        totalDonaciones: 0, totalItemsDonados: 0,
        donacionesRegistradas: 0, donacionesRecibidas: 0,
        totalNecesidades: 0, necesidadesPendientes: 0
    };

    const estadoServicios = data?.estadoServicios || {
        logistica: 'DOWN', donaciones: 'DOWN', necesidades: 'DOWN'
    };

    const porcentajeCarga = resumen.totalCapacidad > 0
        ? Math.round((resumen.totalInventario / resumen.totalCapacidad) * 100)
        : 0;

    const servicios = [
        { nombre: 'Logística',   puerto: '8082', eureka: 'logistica-service',   estado: estadoServicios.logistica },
        { nombre: 'Donaciones',  puerto: '8081', eureka: 'donaciones-service',  estado: estadoServicios.donaciones },
        { nombre: 'Necesidades', puerto: '8083', eureka: 'necesidades-service', estado: estadoServicios.necesidades },
    ];

    const allUp = servicios.every(s => s.estado === 'UP');

    return (
        <div className="fade-in">

            {/* ── Page Header ─────────────────────────────────── */}
            <div className="page-header">
                <div className="page-header-left">
                    <h2 className="page-title">Centro de Control de Donaciones</h2>
                    <p className="page-subtitle">
                        Vista unificada del sistema · Actualización automática cada 15s
                    </p>
                </div>
                <div className="flex items-center gap-3" style={{ flexShrink: 0 }}>
                    {lastUpdate && (
                        <span className="text-xs text-muted">
                            Última actualización: {lastUpdate.toLocaleTimeString()}
                        </span>
                    )}
                    <span className={`badge ${allUp ? 'badge-success' : 'badge-warning'}`}>
                        <Activity size={12} />
                        {allUp ? 'Todos los sistemas activos' : 'Degradado'}
                    </span>
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => { setLoading(true); cargarResumen(); }}
                        title="Actualizar datos"
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>

            {/* ── KPI Grid ─────────────────────────────────────── */}
            <div className="kpi-grid">

                {/* KPI 1: Donaciones */}
                <div className="card fade-in">
                    <div className="card-accent" style={{ color: '#ec4899' }}>
                        <Heart size={80} />
                    </div>
                    <div className="flex items-center gap-2 mb-2" style={{ color: '#f472b6' }}>
                        <Heart size={16} />
                        <span className="text-sm" style={{ fontWeight: 600 }}>Donaciones</span>
                    </div>
                    <div className="card-value">{resumen.totalDonaciones}</div>
                    <div className="card-label">
                        {resumen.totalItemsDonados} unidades en total
                    </div>
                    <div className="flex gap-2 mt-3">
                        <span className="badge badge-info">{resumen.donacionesRegistradas} registradas</span>
                        <span className="badge badge-success">{resumen.donacionesRecibidas} recibidas</span>
                    </div>
                </div>

                {/* KPI 2: Centros de acopio */}
                <div className="card fade-in">
                    <div className="card-accent" style={{ color: '#60a5fa' }}>
                        <PackageOpen size={80} />
                    </div>
                    <div className="flex items-center gap-2 mb-2" style={{ color: '#60a5fa' }}>
                        <PackageOpen size={16} />
                        <span className="text-sm" style={{ fontWeight: 600 }}>Centros de Acopio</span>
                    </div>
                    <div className="card-value">{resumen.totalCentros}</div>
                    <div className="card-label">
                        {resumen.totalInventario} / {resumen.totalCapacidad} uds. utilizadas
                    </div>
                    {/* Progress bar */}
                    <div className="progress-bar-track mt-3">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${Math.min(porcentajeCarga, 100)}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted mt-1">
                        <span>Ocupación global</span>
                        <strong style={{ color: porcentajeCarga > 80 ? '#f87171' : '#60a5fa' }}>
                            {porcentajeCarga}%
                        </strong>
                    </div>
                </div>

                {/* KPI 3: Necesidades */}
                <div className="card fade-in">
                    <div className="card-accent" style={{ color: '#fbbf24' }}>
                        <Box size={80} />
                    </div>
                    <div className="flex items-center gap-2 mb-2" style={{ color: '#fbbf24' }}>
                        <Box size={16} />
                        <span className="text-sm" style={{ fontWeight: 600 }}>Necesidades en Terreno</span>
                    </div>
                    <div className="card-value">{resumen.totalNecesidades}</div>
                    <div className="card-label">
                        Reportes de emergencia registrados
                    </div>
                    <div className="flex gap-2 mt-3">
                        <span className="badge badge-warning">{resumen.necesidadesPendientes} pendientes</span>
                        <span className="badge badge-success">
                            {resumen.totalNecesidades - resumen.necesidadesPendientes} cubiertas
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Detail Row ──────────────────────────────────── */}
            <div className="detail-grid">

                {/* Panel: Estado de microservicios */}
                <div className="card" style={{ borderLeft: '3px solid var(--primary)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3>Monitoreo de Infraestructura</h3>
                        <span className={`badge ${allUp ? 'badge-success' : 'badge-error'}`}>
                            {allUp ? <Wifi size={11} /> : <WifiOff size={11} />}
                            {allUp ? 'Todos activos' : 'Degradado'}
                        </span>
                    </div>
                    <p className="text-sm text-muted mb-4" style={{ lineHeight: '1.6' }}>
                        El <strong>Gateway BFF</strong> unifica respuestas. Si un servicio falla,
                        el <strong>Circuit Breaker</strong> previene la denegación total del sistema.
                    </p>

                    <div className="flex flex-col gap-2">
                        {servicios.map(s => (
                            <div key={s.nombre} className="service-item">
                                <div className="flex items-center gap-3">
                                    <div className={`status-dot ${s.estado === 'UP' ? 'up' : 'down'}`} />
                                    <div>
                                        <div className="service-item-name">{s.nombre}</div>
                                        <div className="service-item-port">
                                            Puerto: {s.puerto} · Eureka: {s.eureka}
                                        </div>
                                    </div>
                                </div>
                                <span className={`badge ${s.estado === 'UP' ? 'badge-success' : 'badge-error'}`}>
                                    {s.estado === 'UP' ? 'ACTIVO' : 'CAÍDO'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Panel: Info del BFF */}
                <div className="card" style={{ borderLeft: '3px solid #10b981' }}>
                    <h3 className="mb-4">Bitácora del BFF</h3>
                    <p className="text-sm text-muted" style={{ lineHeight: '1.65', marginBottom: '0px' }}>
                        Este panel consume el endpoint <code>/bff/dashboard-overview</code> expuesto
                        en la <strong>Central</strong>. El controlador realiza peticiones reactivas
                        paralelas vía <code>WebClient</code> hacia los tres microservicios y consolida
                        los KPIs en un único DTO.
                    </p>
                </div>

            </div>
        </div>
    );
}
