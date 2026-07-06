import React from 'react';
import { Box, Trash2, MapPin, AlertTriangle } from 'lucide-react';

const TIPO_ICONS = {
  ALIMENTO:  '🍎',
  SALUD:     '💊',
  ROPA:      '👕',
  LOGISTICA: '🔧',
};

/**
 * Vista pura (Presentational Component) del módulo de Necesidades.
 * No posee estado ni lógica de API — todo viene de props.
 */
export default function NecesidadesView({
  user, necesidades, formData, setFormData,
  error, registrarNecesidad, eliminarNecesidad,
  cambiarEstado, getBadgeClass
}) {
  const handleChange = (key) => (e) =>
    setFormData(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="fade-in">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div className="page-header-left">
          <h2 className="page-title">Necesidades en Terreno</h2>
          <p className="page-subtitle">
            {user?.role === 'ADMIN'
              ? `${necesidades.length} reportes de emergencia en el sistema`
              : 'Consulta las necesidades activas y su estado actual'}
          </p>
        </div>
        {necesidades.filter(n => n.estado === 'PENDIENTE').length > 0 && (
          <span className="badge badge-warning">
            <AlertTriangle size={12} />
            {necesidades.filter(n => n.estado === 'PENDIENTE').length} pendientes
          </span>
        )}
      </div>

      {/* ── Formulario Admin ─────────────────────────────── */}
      {user?.role === 'ADMIN' && (
        <div className="card mb-6">
          <h3 className="card-title mb-4">
            <Box size={16} style={{ display: 'inline', marginRight: '8px', color: '#fbbf24' }} />
            Declarar Nueva Necesidad
          </h3>

          {error && (
            <div className="error-message">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <form onSubmit={registrarNecesidad}>
            <div className="form-grid">

              <div className="form-group full-span">
                <label>Título / Asunto</label>
                <input
                  value={formData.titulo}
                  onChange={handleChange('titulo')}
                  required
                  placeholder="Ej. Urgencia alimentos sector sur"
                />
              </div>

              <div className="form-group">
                <label>Tipo de Recurso</label>
                <select
                  value={formData.tipoRecurso}
                  onChange={handleChange('tipoRecurso')}
                >
                  <option value="ALIMENTO">🍎 Alimento</option>
                  <option value="SALUD">💊 Salud y Primeros Auxilios</option>
                  <option value="ROPA">👕 Ropa e Higiene</option>
                  <option value="LOGISTICA">🔧 Logística (maquinaria/herramientas)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Cantidad Requerida</label>
                <input
                  type="number"
                  min="1"
                  value={formData.cantidadRequerida}
                  onChange={handleChange('cantidadRequerida')}
                  required
                />
              </div>

              <div className="form-group full-span">
                <label>Descripción Detallada</label>
                <input
                  value={formData.descripcion}
                  onChange={handleChange('descripcion')}
                  required
                  placeholder="Ej. Se necesitan colaciones para 50 familias afectadas..."
                />
              </div>

              <div className="form-group full-span">
                <label>
                  <MapPin size={13} /> Ubicación / Zona Afectada
                </label>
                <input
                  value={formData.ubicacion}
                  onChange={handleChange('ubicacion')}
                  required
                  placeholder="Ej. Comuna Centro, Calle Falsa 123"
                />
              </div>
            </div>

            <button type="submit" className="btn">
              <Box size={16} /> Guardar Necesidad
            </button>
          </form>
        </div>
      )}

      {/* Error para usuarios no admin */}
      {error && user?.role !== 'ADMIN' && (
        <div className="error-message mb-4">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* ── Tabla ─────────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3>Necesidades Activas e Históricas</h3>
          <span className="badge badge-purple">{necesidades.length} registros</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Título</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Ubicación</th>
                <th>Estado</th>
                {user?.role === 'ADMIN' && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {necesidades.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === 'ADMIN' ? 7 : 6}>
                    <div className="empty-state">
                      <Box size={36} className="empty-state-icon" />
                      <p className="empty-state-title">Sin necesidades reportadas</p>
                      <p className="empty-state-desc">
                        {user?.role === 'ADMIN'
                          ? 'Usa el formulario de arriba para declarar una necesidad en terreno.'
                          : 'Actualmente no hay necesidades activas en el sistema.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                necesidades.map(n => (
                  <tr key={n.id}>
                    <td style={{ color: 'var(--text-muted)' }}>#{n.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {n.titulo}
                    </td>
                    <td>
                      <span className="badge badge-info">
                        {TIPO_ICONS[n.tipoRecurso] || '📦'} {n.tipoRecurso}
                      </span>
                    </td>
                    <td><strong>{n.cantidadRequerida}</strong></td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <MapPin size={11} style={{ display: 'inline', marginRight: '4px' }} />
                      {n.ubicacion}
                    </td>
                    <td>
                      <span className={`badge ${getBadgeClass(n.estado)}`}>
                        {n.estado === 'PENDIENTE' ? '⏳' : '✅'} {n.estado}
                      </span>
                    </td>
                    {user?.role === 'ADMIN' && (
                      <td>
                        <div className="flex items-center gap-2">
                          <select
                            value={n.estado || 'PENDIENTE'}
                            onChange={(e) => cambiarEstado(n.id, e.target.value)}
                            style={{
                              padding: '5px 10px', borderRadius: '6px',
                              border: '1px solid var(--border)',
                              background: 'var(--surface)', color: 'var(--text)',
                              fontSize: '0.8rem', fontFamily: 'inherit'
                            }}
                          >
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="CUBIERTA">Cubierta</option>
                          </select>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarNecesidad(n.id)}
                            title="Eliminar necesidad"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
