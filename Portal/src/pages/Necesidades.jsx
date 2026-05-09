import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import NecesidadesView from './NecesidadesView';

export default function Necesidades() {
    const { user } = useAuth();
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

    const eliminarNecesidad = (id) => {
        if(window.confirm('¿Eliminar esta necesidad?')) {
            api.delete(`/necesidades/${id}`)
               .then(cargarNecesidades)
               .catch(err => alert(err.response?.data?.error || 'Error al eliminar'));
        }
    };

    const getBadgeClass = (estado) => {
        if(estado === 'CUBIERTA') return 'badge-success';
        if(estado === 'PENDIENTE') return 'badge-warning';
        return 'badge-info';
    }

    return (
        <NecesidadesView 
            user={user}
            necesidades={necesidades}
            formData={formData}
            setFormData={setFormData}
            error={error}
            registrarNecesidad={registrarNecesidad}
            eliminarNecesidad={eliminarNecesidad}
            getBadgeClass={getBadgeClass}
        />
    );
}
