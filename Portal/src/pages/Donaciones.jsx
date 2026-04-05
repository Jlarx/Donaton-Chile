import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Heart } from 'lucide-react';

export default function Donaciones() {
    const [donaciones, setDonaciones] = useState([]);
    const [centros, setCentros] = useState([]);
    const [formData, setFormData] = useState({ tipo: 'ALIMENTOS', recurso: '', cantidad: 1, origen: '', centroAcopioId: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarDonaciones();
        cargarCentros();
    }, []);

    const cargarDonaciones = () => {
        api.get('/donaciones')
           .then(res => setDonaciones(res.data))
           .catch(err => console.error("Error cargando donaciones", err));
    };

    const cargarCentros = () => {
         api.get('/logistica/centros')
           .then(res => setCentros(res.data))
           .catch(err => console.error("Error cargando centros", err));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        api.post('/donaciones', formData)
           .then(() => {
               setFormData({ tipo: 'ALIMENTOS', recurso: '', cantidad: 1, origen: '', centroAcopioId: '' });
               cargarDonaciones();
           })
           .catch(err => {
               const msg = err.response?.data?.message || err.message;
               setError('No se pudo registrar la donación. ' + msg);
           });
    };

    return (
        <div>
            <div className="page-header">
               <h2 className="page-title">Gestión de Donaciones</h2>
            </div>
            
            <div className="card" style={{marginBottom: "24px"}}>
                <h3 style={{marginBottom: "16px"}}>Ingresar Donación</h3>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tipo de Recurso</label>
                            <select value={formData.tipo} onChange={e=>setFormData({...formData, tipo: e.target.value})}>
                                <option value="ALIMENTOS">Alimentos</option>
                                <option value="SALUD">Salud / Medicamento</option>
                                <option value="ROPA">Ropa / Vestimenta</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Recurso (Descripción)</label>
                            <input value={formData.recurso} onChange={e=>setFormData({...formData, recurso: e.target.value})} required placeholder="Ej. Agua Mineral 2L, Frazadas" />
                        </div>
                        <div className="form-group">
                            <label>Cantidad</label>
                            <input type="number" min="1" value={formData.cantidad} onChange={e=>setFormData({...formData, cantidad: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label>Origen (Donante)</label>
                            <input value={formData.origen} onChange={e=>setFormData({...formData, origen: e.target.value})} required placeholder="Empresa S.A / Juan Pérez" />
                        </div>
                        <div className="form-group" style={{gridColumn: '1 / -1'}}>
                            <label>Centro de Acopio Destino</label>
                            <select value={formData.centroAcopioId} onChange={e=>setFormData({...formData, centroAcopioId: e.target.value})} required>
                                <option value="" disabled>-- Seleccione un Centro --</option>
                                {centros.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.ubicacion})</option>)}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn"><Heart size={18}/> Guardar Donación</button>
                    {!centros.length && <p style={{marginTop:'12px', fontSize:'0.85rem', color:'#eab308'}}>Advertencia: Debe crear un centro de acopio en Logística primero para asignar donaciones.</p>}
                </form>
            </div>
            
            <div className="card table-container">
                <h3>Historial de Donaciones</h3>
                <table>
                    <thead>
                        <tr><th>ID</th><th>Tipo</th><th>Recurso</th><th>Cantidad</th><th>Origen</th><th>ID Centro Acopio</th></tr>
                    </thead>
                    <tbody>
                        {donaciones.map(d => (
                            <tr key={d.id}>
                                <td>{d.id}</td>
                                <td><span className="badge badge-info">{d.tipo}</span></td>
                                <td>{d.recurso}</td>
                                <td>{d.cantidad}</td>
                                <td>{d.origen}</td>
                                <td>{d.centroAcopioId}</td>
                            </tr>
                        ))}
                        {donaciones.length === 0 && <tr><td colSpan="6" style={{textAlign:'center'}}>No hay donaciones registradas</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
