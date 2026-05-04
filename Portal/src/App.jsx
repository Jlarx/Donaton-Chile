import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Box, Home, Heart, PackageOpen, LayoutDashboard, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Donaciones from './pages/Donaciones';
import Logistica from './pages/Logistica';
import Necesidades from './pages/Necesidades';
import Productos from './pages/Productos';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
}

function MainApp() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Heart color="#ef4444" size={28} />
          <h2>Donaton</h2>
        </div>
        <nav className="nav-menu">
           <NavLink to="/"><LayoutDashboard size={20} /> Dashboard</NavLink>
           <NavLink to="/donaciones"><Heart size={20} /> Donaciones</NavLink>
           <NavLink to="/necesidades"><Box size={20} /> Necesidades</NavLink>
           <NavLink to="/productos"><PackageOpen size={20} /> Productos</NavLink>
           <NavLink to="/logistica"><PackageOpen size={20} /> Centros de Acopio</NavLink>
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h1>Centro de Control Logístico y Ayuda</h1>
           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontWeight: 'bold', color: '#1e293b' }}>
                Hola, {user.email} <span style={{ fontSize: '12px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>{user.role}</span>
              </span>
              <button onClick={logout} className="btn" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>
                <LogOut size={18} /> Salir
              </button>
           </div>
        </header>
        <div className="content-wrapper">
           <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/donaciones" element={<Donaciones />} />
              <Route path="/logistica" element={<Logistica />} />
              <Route path="/necesidades" element={<Necesidades />} />
              <Route path="/productos" element={<Productos />} />
           </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
}

export default App;
