import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PackageOpen, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Logistica() {
    const { user } = useAuth();
    const [centros, setCentros] = useState([]);
    const [donaciones, setDonaciones] = useState([]);
    const [nombre, setNombre] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [cantidadStrategy, setCantidadStrategy] = useState('');
    const [error, setError] = useState(null);
    const [mensajeExito, setMensajeExito] = useState(null);

    useEffect(() => {
        cargarCentros();
        if (user?.role === 'USER') {
            cargarDonaciones();
        }
    }, [user]);

    const cargarCentros = () => {
        api.get('/logistica/centros')
           .then(res => setCentros(res.data))
           .catch(err => setError(err.response?.data?.message || err.message));
    };

    const cargarDonaciones = () => {
        api.get('/donaciones')
           .then(res => setDonaciones(res.data))
           .catch(err => console.error("Error cargando donaciones", err));
    };

    const registrarCentro = (e) => {
        e.preventDefault();
        setError(null);
        setMensajeExito(null);
        api.post('/logistica/centros', { nombre, ubicacion })
           .then(() => {
               setNombre('');
               setUbicacion('');
               setMensajeExito("Centro registrado exitosamente");
               cargarCentros();
           })
           .catch(err => setError('Error al registrar: ' + (err.response?.data?.message || err.message)));
    };

    const asignarRecursos = (e) => {
        e.preventDefault();
        setError(null);
        setMensajeExito(null);
        api.post(`/logistica/asignaciones?cantidad=${cantidadStrategy}`)
           .then(res => {
               setCantidadStrategy('');
               setMensajeExito(res.data.mensaje);
               setCentros(res.data.centrosActualizados || []);
           })
           .catch(err => setError('Error de asignación: ' + (err.response?.data?.message || err.message)));
    };

    const misDonaciones = donaciones.filter(d => d.origen === user?.email);
    const misAportesPorCentro = misDonaciones.reduce((acc, d) => {
        acc[d.centroAcopioId] = (acc[d.centroAcopioId] || 0) + d.cantidad;
        return acc;
    }, {});

    return (
        <div>
            <div className="page-header">
               <h2 className="page-title">Gestión de Centros de Acopio</h2>
            </div>
            
            {error && <div className="error-message" style={{marginBottom: "16px"}}>{error}</div>}
            {mensajeExito && <div style={{backgroundColor: '#dcfce3', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '16px', border: '1px solid #bbf7d0'}}>{mensajeExito}</div>}

            {user?.role === 'ADMIN' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    <div className="card">
                        <h3 style={{marginBottom: "16px"}}>Registrar Nuevo Centro</h3>
                        <form onSubmit={registrarCentro}>
                            <div className="form-group">
                                <label>Nombre del Centro</label>
                                <input value={nombre} onChange={e=>setNombre(e.target.value)} required placeholder="Ej. Gimnasio Municipal" />
                            </div>
                            <div className="form-group">
                                <label>Ubicación</label>
                                <input value={ubicacion} onChange={e=>setUbicacion(e.target.value)} required placeholder="Ej. Av Siempreviva 123" />
                            </div>
                            <button type="submit" className="btn" style={{width: '100%', justifyContent: 'center'}}><PackageOpen size={18}/> Registrar Centro</button>
                        </form>
                    </div>

                    <div className="card">
                        <h3 style={{marginBottom: "16px"}}>Distribución Masiva de Recursos</h3>
                        <p style={{color: '#64748b', marginBottom: '16px', fontSize: '14px'}}>
                            Asigna un lote grande de donaciones entrantes dividiéndolo automáticamente a partes iguales entre todos los centros activos.
                        </p>
                        <form onSubmit={asignarRecursos}>
                            <div className="form-group">
                                <label>Cantidad Total a Distribuir</label>
                                <input type="number" min="1" value={cantidadStrategy} onChange={e=>setCantidadStrategy(e.target.value)} required placeholder="Ej. 1000" />
                            </div>
                            <button type="submit" className="btn" style={{width: '100%', justifyContent: 'center', backgroundColor: '#3b82f6'}}><Share2 size={18}/> Distribuir Recursos</button>
                        </form>
                    </div>
                </div>
            )}
            
            <div className="card table-container">
                <h3>Centros Registrados</h3>
                <table>
                    <thead>
                        <tr><th>ID</th><th>Nombre</th><th>Ubicación</th><th>{user?.role === 'ADMIN' ? 'Inventario Global' : 'Mi Aporte Total'}</th>{user?.role === 'ADMIN' && <th>Acciones</th>}</tr>
                    </thead>
                    <tbody>
                        {centros.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.nombre}</td>
                                <td>{c.ubicacion}</td>
                                <td>
                                    <span style={{fontWeight: 'bold', color: user?.role === 'ADMIN' ? '#0f172a' : '#059669'}}>
                                        {user?.role === 'ADMIN' ? (c.inventarioActual || 0) : (misAportesPorCentro[c.id] || 0)}
                                    </span> unidades
                                </td>
                                {user?.role === 'ADMIN' && (
                                    <td>
                                        <button 
                                            onClick={() => {
                                                if(window.confirm('¿Eliminar este centro de acopio?')) {
                                                    api.delete(`/logistica/centros/${c.id}`).then(cargarCentros).catch(err => alert(err.response?.data?.error || 'Error al eliminar'));
                                                }
                                            }}
                                            style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer'}}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {centros.length === 0 && <tr><td colSpan={user?.role === 'ADMIN' ? 5 : 4} style={{textAlign:'center'}}>No hay centros registrados</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
