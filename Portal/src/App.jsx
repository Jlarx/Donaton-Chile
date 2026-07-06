import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Heart, Box, PackageOpen, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Donaciones from './pages/Donaciones';
import Logistica from './pages/Logistica';
import Necesidades from './pages/Necesidades';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import logo from './assets/logo.svg';

/**
 * Componente NavLink individual - muestra activo, hover y transición.
 */
function NavLink({ to, children, icon: Icon, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`nav-link ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {Icon && <Icon size={18} className="nav-icon" />}
      <span>{children}</span>
      {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
    </Link>
  );
}

/**
 * Componente principal de la app, con sidebar responsivo y topbar mejorado.
 */
function MainApp() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Login />;
  }

  // Iniciales del usuario para el avatar
  const initials = user.email
    ? user.email.substring(0, 2).toUpperCase()
    : '??';

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-container">

      {/* ── Overlay móvil ── */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
      />

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>

        {/* Logo + Brand */}
        <div className="sidebar-header">
          <img src={logo} alt="Donaton logo" className="sidebar-logo" />
          <div className="sidebar-brand">
            <span className="sidebar-brand-name">Donaton</span>
            <span className="sidebar-brand-tagline">Sistema de ayuda</span>
          </div>
        </div>

        {/* Navegación */}
        <nav className="nav-menu">
          <span className="nav-section-label">Menú principal</span>

          <NavLink to="/" icon={LayoutDashboard} onClick={closeSidebar}>
            Dashboard
          </NavLink>
          <NavLink to="/donaciones" icon={Heart} onClick={closeSidebar}>
            Donaciones
          </NavLink>
          <NavLink to="/necesidades" icon={Box} onClick={closeSidebar}>
            Necesidades
          </NavLink>
          <NavLink to="/logistica" icon={PackageOpen} onClick={closeSidebar}>
            Centros de Acopio
          </NavLink>
        </nav>

        {/* Footer del sidebar */}
        <div className="sidebar-footer">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', opacity: 0.6 }}>
            v2.0 · Donaton Portal
          </div>
        </div>
      </aside>

      {/* ── Contenido principal ── */}
      <main className="main-content">

        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            {/* Hamburger – solo visible en móvil */}
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Abrir menú"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="topbar-title">Centro de Control Logístico</span>
          </div>

          <div className="topbar-right">
            {/* Pill de usuario */}
            <div className="user-pill">
              <div className="user-pill-avatar">{initials}</div>
              <span className="user-pill-email">{user.email}</span>
              <span className="user-role-badge">{user.role}</span>
            </div>

            {/* Botón salir */}
            <button
              onClick={logout}
              className="btn btn-ghost btn-sm"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
              <span style={{ display: 'none' }} className="hide-mobile">Salir</span>
            </button>
          </div>
        </header>

        {/* Contenido de páginas */}
        <div className="content-wrapper">
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/donaciones" element={<Donaciones />} />
            <Route path="/logistica"  element={<Logistica />} />
            <Route path="/necesidades" element={<Necesidades />} />
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
