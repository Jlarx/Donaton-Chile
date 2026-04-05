import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Box, Home, Heart, PackageOpen, LayoutDashboard } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Donaciones from './pages/Donaciones';
import Logistica from './pages/Logistica';
import Necesidades from './pages/Necesidades';

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
}

function App() {
  return (
    <Router>
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
             <NavLink to="/logistica"><PackageOpen size={20} /> Centros de Acopio</NavLink>
          </nav>
        </aside>
        
        <main className="main-content">
          <header className="topbar">
             <h1>Centro de Control Logístico y Ayuda</h1>
          </header>
          <div className="content-wrapper">
             <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/donaciones" element={<Donaciones />} />
                <Route path="/logistica" element={<Logistica />} />
                <Route path="/necesidades" element={<Necesidades />} />
             </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
