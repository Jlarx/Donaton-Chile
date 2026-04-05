import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Box } from 'lucide-react';

export default function Necesidades() {
    const [necesidades, setNecesidades] = useState([]);
    const [formData, setFormData] = useState({ titulo: '', descripcion: '', tipoRecurso: 'ALIMENTO', cantidadRequerida: 1, ubicacion: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarNecesidades();
    }, []);

    const cargarNecesidades = () => {
        api.get('/necesidades')
           .then(res => setNecesidades(res.data))
           .catch(err => setError(err.response?.data?.message || err.message));
    };

    const registrarNecesidad = (e) => {
        e.preventDefault();
        setError(null);
        api.post('/necesidades', formData)
           .then(() => {
               setFormData({ titulo: '', descripcion: '', tipoRecurso: 'ALIMENTO', cantidadRequerida: 1, ubicacion: '' });
               cargarNecesidades();
           })
           .catch(err => setError('Error al registrar: ' + (err.response?.data?.message || err.message)));
    };

    const getBadgeClass = (estado) => {
        if(estado === 'CUBIERTA') return 'badge-success';
        if(estado === 'PENDIENTE') return 'badge-warning';
        return 'badge-info';
    }

    return (
        <div>
            <div className="page-header">
               <h2 className="page-title">Reporte de Necesidades en Terreno</h2>
            </div>
            
            <div className="card" style={{marginBottom: "24px"}}>
                <h3 style={{marginBottom: "16px"}}>Declarar Nueva Necesidad</h3>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={registrarNecesidad}>
                    <div className="form-grid">
                         <div className="form-group" style={{gridColumn: '1 / -1'}}>
                            <label>Título / Asunto</label>
                            <input value={formData.titulo} onChange={e=>setFormData({...formData, titulo: e.target.value})} required placeholder="Ej. Urgencia alimentos sector sur" />
                        </div>
                        <div className="form-group">
                            <label>Tipo de Recurso</label>
                            <select value={formData.tipoRecurso} onChange={e=>setFormData({...formData, tipoRecurso: e.target.value})}>
                                <option value="ALIMENTO">Alimento</option>
                                <option value="SALUD">Salud y Primeros Auxilios</option>
                                <option value="ROPA">Ropa e Higiene</option>
                                <option value="LOGISTICA">Logística (maquinaria/herramientas)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Cantidad Requerida</label>
                            <input type="number" min="1" value={formData.cantidadRequerida} onChange={e=>setFormData({...formData, cantidadRequerida: e.target.value})} required />
                        </div>
                        <div className="form-group" style={{gridColumn: '1 / -1'}}>
                            <label>Descripción detallada</label>
                            <input value={formData.descripcion} onChange={e=>setFormData({...formData, descripcion: e.target.value})} required placeholder="Se necesitan colaciones para 50 familias..." />
                        </div>
                        <div className="form-group" style={{gridColumn: '1 / -1'}}>
                            <label>Ubicación / Zona afectada</label>
                            <input value={formData.ubicacion} onChange={e=>setFormData({...formData, ubicacion: e.target.value})} required placeholder="Ej. Comuna Centro, Calle Falsa 123" />
                        </div>
                    </div>
                    <button type="submit" className="btn"><Box size={18}/> Guardar Necesidad</button>
                </form>
            </div>
            
            <div className="card table-container">
                <h3>Necesidades Activas e Históricas</h3>
                <table>
                    <thead>
                        <tr><th>ID</th><th>Título</th><th>Tipo</th><th>Cantidad</th><th>Ubicación</th><th>Estado</th></tr>
                    </thead>
                    <tbody>
                        {necesidades.map(n => (
                            <tr key={n.id}>
                                <td>{n.id}</td>
                                <td>{n.titulo}</td>
                                <td>{n.tipoRecurso}</td>
                                <td>{n.cantidadRequerida}</td>
                                <td>{n.ubicacion}</td>
                                <td><span className={`badge ${getBadgeClass(n.estado)}`}>{n.estado}</span></td>
                            </tr>
                        ))}
                        {necesidades.length === 0 && <tr><td colSpan="6" style={{textAlign:'center'}}>No hay necesidades reportadas</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
