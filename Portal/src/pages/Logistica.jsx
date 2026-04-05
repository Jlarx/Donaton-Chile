import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PackageOpen } from 'lucide-react';

export default function Logistica() {
    const [centros, setCentros] = useState([]);
    const [nombre, setNombre] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarCentros();
    }, []);

    const cargarCentros = () => {
        api.get('/logistica/centros')
           .then(res => setCentros(res.data))
           .catch(err => setError(err.response?.data?.message || err.message));
    };

    const registrarCentro = (e) => {
        e.preventDefault();
        setError(null);
        api.post('/logistica/centros', { nombre, ubicacion })
           .then(() => {
               setNombre('');
               setUbicacion('');
               cargarCentros();
           })
           .catch(err => setError('Error: ' + (err.response?.data?.message || err.message)));
    };

    return (
        <div>
            <div className="page-header">
               <h2 className="page-title">Gestión de Centros de Acopio</h2>
            </div>
            
            <div className="card" style={{marginBottom: "24px"}}>
                <h3 style={{marginBottom: "16px"}}>Registrar Nuevo Centro</h3>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={registrarCentro}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nombre del Centro</label>
                            <input value={nombre} onChange={e=>setNombre(e.target.value)} required placeholder="Ej. Gimnasio Municipal" />
                        </div>
                        <div className="form-group">
                            <label>Ubicación</label>
                            <input value={ubicacion} onChange={e=>setUbicacion(e.target.value)} required placeholder="Ej. Av Siempreviva 123" />
                        </div>
                    </div>
                    <button type="submit" className="btn"><PackageOpen size={18}/> Registrar Centro</button>
                </form>
            </div>
            
            <div className="card table-container">
                <h3>Centros Registrados</h3>
                <table>
                    <thead>
                        <tr><th>ID</th><th>Nombre</th><th>Ubicación</th></tr>
                    </thead>
                    <tbody>
                        {centros.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.nombre}</td>
                                <td>{c.ubicacion}</td>
                            </tr>
                        ))}
                        {centros.length === 0 && <tr><td colSpan="3" style={{textAlign:'center'}}>No hay centros registrados</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
