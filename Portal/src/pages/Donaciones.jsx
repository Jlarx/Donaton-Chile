import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Heart, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ESTADO_CONFIG = {
  REGISTRADA:  { badge: 'badge-info',    label: 'Registrada' },
  ASIGNADA:    { badge: 'badge-warning', label: 'Asignada' },
  EN_TRASLADO: { badge: 'badge-warning', label: 'En Traslado' },
  RECIBIDA:    { badge: 'badge-success', label: 'Recibida' },
  DISTRIBUIDA: { badge: 'badge-success', label: 'Distribuida' },
  CANCELADA:   { badge: 'badge-error',   label: 'Cancelada' },
};

const TIPO_ICONS = {
  ALIMENTOS: '🍎',
  SALUD:     '💊',
  ROPA:      '👕',
};

export default function Donaciones() {
  const { user } = useAuth();
  const [donaciones, setDonaciones]   = useState([]);
  const [centros, setCentros]         = useState([]);
  const [formData, setFormData]       = useState({
    tipo: 'ALIMENTOS', recurso: '', cantidad: 1, origen: '', centroAcopioId: ''
  });
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([cargarDonaciones(), cargarCentros()]).finally(() => setLoading(false));
  }, []);

  // Pre-fill origen para usuarios normales
  useEffect(() => {
    if (user?.role === 'USER') {
      setFormData(prev => ({ ...prev, origen: user.email }));
    }
  }, [user]);

  const cargarDonaciones = () =>
    api.get('/donaciones')
       .then(res => setDonaciones(res.data))
       .catch(err => console.error('Error cargando donaciones', err));

  const cargarCentros = () =>
    api.get('/logistica/centros')
       .then(res => setCentros(res.data))
       .catch(err => console.error('Error cargando centros', err));

  const handleChange = (key) => (e) =>
    setFormData(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    api.post('/donaciones', formData)
       .then(() => {
         setFormData({
           tipo: 'ALIMENTOS', recurso: '', cantidad: 1,
           origen: user?.role === 'USER' ? user.email : '',
           centroAcopioId: ''
         });
         cargarDonaciones();
       })
       .catch(err => {
         setError('No se pudo registrar la donación: ' + (err.response?.data?.message || err.message));
       });
  };

  const cambiarEstado = (id, nuevoEstado) => {
    api.put(`/donaciones/${id}/estado?estado=${nuevoEstado}`)
       .then(cargarDonaciones)
       .catch(err => alert('No se pudo cambiar el estado: ' + (err.response?.data?.message || err.message)));
  };

  const eliminarDonacion = (id) => {
    if (!window.confirm('¿Eliminar esta donación permanentemente?')) return;
    api.delete(`/donaciones/${id}`)
       .then(cargarDonaciones)
       .catch(err => alert(err.response?.data?.error || 'Error al eliminar'));
  };

  const donacionesVisibles = user?.role === 'ADMIN'
    ? donaciones
    : donaciones.filter(d => d.origen === user?.email);

  return (
    <div className="fade-in">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div className="page-header-left">
          <h2 className="page-title">Gestión de Donaciones</h2>
          <p className="page-subtitle">
            {user?.role === 'ADMIN'
              ? `${donaciones.length} donaciones en el sistema`
              : 'Registra y monitorea tus donaciones'}
          </p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={cargarDonaciones}>
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      {/* ── Formulario ──────────────────────────────────── */}
      <div className="card mb-6">
        <h3 className="card-title mb-4">
          <Heart size={16} style={{ display: 'inline', marginRight: '8px', color: '#f472b6' }} />
          Registrar Nueva Donación
        </h3>

        {error && (
          <div className="error-message">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            <div className="form-group">
              <label>Tipo de Recurso</label>
              <select value={formData.tipo} onChange={handleChange('tipo')}>
                <option value="ALIMENTOS">🍎 Alimentos</option>
                <option value="SALUD">💊 Salud / Medicamentos</option>
                <option value="ROPA">👕 Ropa / Vestimenta</option>
              </select>
            </div>

            <div className="form-group">
              <label>Descripción del Recurso</label>
              <input
                type="text"
                value={formData.recurso}
                onChange={handleChange('recurso')}
                required
                placeholder="Ej. Agua Mineral 2L, Frazadas"
              />
            </div>

            <div className="form-group">
              <label>Cantidad</label>
              <input
                type="number"
                min="1"
                value={formData.cantidad}
                onChange={handleChange('cantidad')}
                required
              />
            </div>

            <div className="form-group">
              <label>Origen / Donante</label>
              <input
                type="text"
                value={formData.origen}
                onChange={handleChange('origen')}
                required
                disabled={user?.role === 'USER'}
                placeholder="Empresa S.A / Juan Pérez"
              />
            </div>

            <div className="form-group full-span">
              <label>Centro de Acopio Destino</label>
              <select
                value={formData.centroAcopioId}
                onChange={handleChange('centroAcopioId')}
                required
              >
                <option value="" disabled>-- Seleccione un Centro --</option>
                {centros.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} — {c.ubicacion}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!centros.length && (
            <div className="error-message" style={{ marginBottom: '16px' }}>
              <AlertTriangle size={16} />
              Debes crear al menos un Centro de Acopio en la sección de Logística.
            </div>
          )}

          <button type="submit" className="btn" disabled={!centros.length}>
            <Heart size={16} /> Guardar Donación
          </button>
        </form>
      </div>

      {/* ── Tabla ───────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3>Historial de Donaciones</h3>
          <span className="badge badge-purple">{donacionesVisibles.length} registros</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tipo</th>
                <th>Recurso</th>
                <th>Cantidad</th>
                <th>Origen</th>
                <th>Centro</th>
                <th>Estado</th>
                {user?.role === 'ADMIN' && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={user?.role === 'ADMIN' ? 8 : 7} style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="spinner" style={{ margin: '0 auto', width: '32px', height: '32px' }} />
                  </td>
                </tr>
              ) : donacionesVisibles.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === 'ADMIN' ? 8 : 7}>
                    <div className="empty-state">
                      <Heart size={36} className="empty-state-icon" />
                      <p className="empty-state-title">Sin donaciones aún</p>
                      <p className="empty-state-desc">
                        {user?.role === 'ADMIN'
                          ? 'No hay donaciones en el sistema.'
                          : 'Usa el formulario de arriba para registrar tu primera donación.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                donacionesVisibles.map(d => {
                  const cfg = ESTADO_CONFIG[d.estado] || ESTADO_CONFIG.REGISTRADA;
                  return (
                    <tr key={d.id}>
                      <td style={{ color: 'var(--text-muted)' }}>#{d.id}</td>
                      <td>
                        <span className="badge badge-info">
                          {TIPO_ICONS[d.tipo]} {d.tipo}
                        </span>
                      </td>
                      <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {d.recurso}
                      </td>
                      <td><strong>{d.cantidad}</strong></td>
                      <td style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {d.origen}
                      </td>
                      <td>{d.centroAcopioId}</td>
                      <td>
                        <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                      </td>
                      {user?.role === 'ADMIN' && (
                        <td>
                          <div className="flex items-center gap-2">
                            <select
                              value={d.estado || 'REGISTRADA'}
                              onChange={(e) => cambiarEstado(d.id, e.target.value)}
                              style={{
                                padding: '5px 10px', borderRadius: '6px',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)', color: 'var(--text)',
                                fontSize: '0.8rem', fontFamily: 'inherit'
                              }}
                            >
                              {Object.entries(ESTADO_CONFIG).map(([k, v]) => (
                                <option key={k} value={k}>{v.label}</option>
                              ))}
                            </select>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => eliminarDonacion(d.id)}
                              title="Eliminar donación"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
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
