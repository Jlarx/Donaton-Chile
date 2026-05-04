import React from 'react';
import { Package } from 'lucide-react';

const Productos = () => {
  const productos = [
    { id: 1, nombre: 'Arroz', categoria: 'Alimentos', stock: 500 },
    { id: 2, nombre: 'Agua Mineral', categoria: 'Bebidas', stock: 1200 },
    { id: 3, nombre: 'Mantas', categoria: 'Refugio', stock: 150 },
    { id: 4, nombre: 'Kits de Higiene', categoria: 'Salud', stock: 300 },
  ];

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Package size={32} color="#3b82f6" />
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Listado de Productos</h2>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>ID</th>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Nombre</th>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Categoría</th>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px', color: '#1e293b' }}>#{prod.id}</td>
                <td style={{ padding: '16px', color: '#1e293b', fontWeight: '500' }}>{prod.nombre}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' }}>
                    {prod.categoria}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#1e293b' }}>
                  <span style={{ fontWeight: 'bold' }}>{prod.stock}</span> unidades
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;
