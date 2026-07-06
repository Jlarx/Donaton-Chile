import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PackageOpen, Share2, Trash2, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Logistica() {
    const { user } = useAuth();
    const [centros, setCentros]                   = useState([]);
    const [donaciones, setDonaciones]             = useState([]);
    const [nombre, setNombre]                     = useState('');
    const [ubicacion, setUbicacion]               = useState('');
    const [capacidadMaxima, setCapacidadMaxima]   = useState('');
    const [cantidadStrategy, setCantidadStrategy] = useState('');
    const [error, setError]                       = useState(null);
    const [mensajeExito, setMensajeExito]         = useState(null);
    const [loading, setLoading]                   = useState(true);

    useEffect(() => {
        Promise.all([
            cargarCentros(),
            user?.role === 'USER' ? cargarDonaciones() : Promise.resolve()
        ]).finally(() => setLoading(false));
    }, [user]);

    const cargarCentros = () =>
        api.get('/logistica/centros')
           .then(res => setCentros(res.data))
           .catch(err => setError(err.response?.data?.message || err.message));

    const cargarDonaciones = () =>
        api.get('/donaciones')
           .then(res => setDonaciones(res.data))
           .catch(err => console.error('Error cargando donaciones', err));

    const registrarCentro = (e) => {
        e.preventDefault();
        setError(null); setMensajeExito(null);
        api.post('/logistica/centros', {
            nombre, ubicacion, capacidadMaxima: parseInt(capacidadMaxima)
        })
        .then(() => {
            setNombre(''); setUbicacion(''); setCapacidadMaxima('');
            setMensajeExito('Centro registrado exitosamente.');
            cargarCentros();
        })
        .catch(err => setError('Error al registrar: ' + (err.response?.data?.message || err.message)));
    };

    const asignarRecursos = (e) => {
        e.preventDefault();
        setError(null); setMensajeExito(null);
        api.post(`/logistica/asignaciones?cantidad=${cantidadStrategy}`)
           .then(res => {
               setCantidadStrategy('');
               setMensajeExito(res.data.mensaje || 'Recursos distribuidos correctamente.');
               setCentros(res.data.centrosActualizados || []);
           })
           .catch(err => setError('Error de asignación: ' + (err.response?.data?.message || err.message)));
    };

    const eliminarCentro = (id) => {
        if (!window.confirm('¿Eliminar este centro de acopio?')) return;
        api.delete(`/logistica/centros/${id}`)
           .then(cargarCentros)
           .catch(err => alert(err.response?.data?.error || 'Error al eliminar'));
    };

    // Aportes del usuario actual agrupados por centro
    const misDonaciones = donaciones.filter(d => d.origen === user?.email);
    const misAportesPorCentro = misDonaciones.reduce((acc, d) => {
        acc[d.centroAcopioId] = (acc[d.centroAcopioId] || 0) + d.cantidad;
        return acc;
    }, {});

    return (
        <div className="fade-in">

            {/* ── Page Header ─────────────────────────────────── */}
            <div className="page-header">
                <div className="page-header-left">
                    <h2 className="page-title">Centros de Acopio</h2>
                    <p className="page-subtitle">
                        {user?.role === 'ADMIN'
                            ? `${centros.length} centros activos en el sistema`
                            : 'Consulta los centros de acopio disponibles y tus aportes'}
                    </p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => { setLoading(true); cargarCentros().finally(() => setLoading(false)); }}>
                    <RefreshCw size={14} /> Actualizar
                </button>
            </div>

            {/* ── Mensajes de feedback ─────────────────────────── */}
            {error && (
                <div className="error-message mb-4">
                    <AlertTriangle size={16} /> {error}
                </div>
            )}
            {mensajeExito && (
                <div className="success-message mb-4">
                    <CheckCircle size={16} /> {mensajeExito}
                </div>
            )}

            {/* ── Formularios Admin ───────────────────────────── */}
            {user?.role === 'ADMIN' && (
                <div className="detail-grid mb-6">

                    {/* Registrar nuevo centro */}
                    <div className="card">
                        <h3 className="card-title mb-4">
                            <PackageOpen size={16} style={{ display: 'inline', marginRight: '8px', color: '#60a5fa' }} />
                            Registrar Nuevo Centro
                        </h3>
                        <form onSubmit={registrarCentro}>
                            <div className="form-group mb-4">
                                <label>Nombre del Centro</label>
                                <input
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    required
                                    placeholder="Ej. Gimnasio Municipal Norte"
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label>Ubicación</label>
                                <input
                                    value={ubicacion}
                                    onChange={e => setUbicacion(e.target.value)}
                                    required
                                    placeholder="Ej. Av. Siempreviva 742"
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label>Capacidad Máxima (unidades)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={capacidadMaxima}
                                    onChange={e => setCapacidadMaxima(e.target.value)}
                                    required
                                    placeholder="Ej. 5000"
                                />
                            </div>
                            <button type="submit" className="btn w-full" style={{ justifyContent: 'center' }}>
                                <PackageOpen size={16} /> Registrar Centro
                            </button>
                        </form>
                    </div>

                    {/* Distribución masiva */}
                    <div className="card">
                        <h3 className="card-title mb-4">
                            <Share2 size={16} style={{ display: 'inline', marginRight: '8px', color: '#a78bfa' }} />
                            Distribución Masiva de Recursos
                        </h3>
                        <p className="text-sm text-muted mb-4" style={{ lineHeight: '1.65' }}>
                            Asigna un lote de recursos dividiéndolo automáticamente
                            a partes iguales entre <strong>todos los centros activos</strong>.
                            Implementa el patrón Strategy de distribución equitativa.
                        </p>
                        <form onSubmit={asignarRecursos}>
                            <div className="form-group mb-4">
                                <label>Cantidad Total a Distribuir</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={cantidadStrategy}
                                    onChange={e => setCantidadStrategy(e.target.value)}
                                    required
                                    placeholder="Ej. 1000"
                                />
                            </div>
                            {!centros.length && (
                                <div className="error-message mb-4">
                                    <AlertTriangle size={14} />
                                    No hay centros activos para distribuir recursos.
                                </div>
                            )}
                            <button
                                type="submit"
                                className="btn w-full"
                                style={{ justifyContent: 'center', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                                disabled={!centros.length}
                            >
                                <Share2 size={16} /> Distribuir Recursos
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Tabla de centros ─────────────────────────────── */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3>Centros Registrados</h3>
                    <span className="badge badge-info">{centros.length} centros</span>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Ubicación</th>
                                <th>{user?.role === 'ADMIN' ? 'Inventario / Capacidad' : 'Mi Aporte'}</th>
                                {user?.role === 'ADMIN' && <th>Ocupación</th>}
                                {user?.role === 'ADMIN' && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                                        <div className="spinner" style={{ margin: '0 auto', width: '32px', height: '32px' }} />
                                    </td>
                                </tr>
                            ) : centros.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state">
                                            <PackageOpen size={36} className="empty-state-icon" />
                                            <p className="empty-state-title">Sin centros registrados</p>
                                            <p className="empty-state-desc">
                                                {user?.role === 'ADMIN'
                                                    ? 'Usa el formulario de arriba para crear el primer centro de acopio.'
                                                    : 'El administrador aún no ha registrado centros de acopio.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                centros.map(c => {
                                    const inventario = c.inventarioActual || 0;
                                    const capacidad  = c.capacidadMaxima  || 0;
                                    const pct        = capacidad > 0 ? Math.round((inventario / capacidad) * 100) : 0;
                                    const pctColor   = pct >= 90 ? '#f87171' : pct >= 70 ? '#fbbf24' : '#34d399';

                                    return (
                                        <tr key={c.id}>
                                            <td style={{ color: 'var(--text-muted)' }}>#{c.id}</td>
                                            <td style={{ fontWeight: 600, color: 'var(--text)' }}>{c.nombre}</td>
                                            <td>{c.ubicacion}</td>
                                            <td>
                                                {user?.role === 'ADMIN' ? (
                                                    <span>
                                                        <strong>{inventario}</strong>
                                                        <span className="text-muted"> / {capacidad} uds.</span>
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#34d399', fontWeight: 600 }}>
                                                        {misAportesPorCentro[c.id] || 0} uds.
                                                    </span>
                                                )}
                                            </td>
                                            {user?.role === 'ADMIN' && (
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
                                                        <div className="progress-bar-track" style={{ flex: 1, height: '5px' }}>
                                                            <div
                                                                className="progress-bar-fill"
                                                                style={{
                                                                    width: `${Math.min(pct, 100)}%`,
                                                                    background: pctColor
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-xs" style={{ color: pctColor, fontWeight: 600, minWidth: '32px' }}>
                                                            {pct}%
                                                        </span>
                                                    </div>
                                                </td>
                                            )}
                                            {user?.role === 'ADMIN' && (
                                                <td>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => eliminarCentro(c.id)}
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
