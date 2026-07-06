import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Key, User, ShieldAlert, Eye, EyeOff, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.svg';

/**
 * Pantalla de Login / Registro con diseño premium glassmorphism.
 */
export default function Login() {
  const [isLogin, setIsLogin]       = useState(true);
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [nombre, setNombre]         = useState('');
  const [rol, setRol]               = useState('USER');
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState(null);
  const [cargando, setCargando]     = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });
        login(res.data.token);
      } else {
        await api.post('/auth/registro', { email, password, nombre, rol });
        const res = await api.post('/auth/login', { email, password });
        login(res.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Ocurrió un error inesperado.');
    } finally {
      setCargando(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setEmail('');
    setPassword('');
    setNombre('');
  };

  return (
    <div className="login-page">
      <div className="login-card fade-in">

        {/* Logo & Titulo */}
        <div className="login-logo-wrapper">
          <img src={logo} alt="Donaton" className="login-logo" />
          <h1 className="login-title">
            {isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
          </h1>
          <p className="login-subtitle">
            {isLogin
              ? 'Ingresa tus credenciales para acceder al portal'
              : 'Regístrate para participar en la red de ayuda'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="error-message">
            <ShieldAlert size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Nombre – solo en registro */}
          {!isLogin && (
            <div className="form-group mb-4 slide-in">
              <label htmlFor="nombre">
                <User size={14} /> Nombre Completo
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Ej. María González"
                autoComplete="name"
              />
            </div>
          )}

          {/* Email */}
          <div className="form-group mb-4">
            <label htmlFor="email">
              <Mail size={14} /> Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="correo@ejemplo.com"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="form-group mb-4">
            <label htmlFor="password">
              <Key size={14} /> Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                  padding: '4px', display: 'flex'
                }}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Rol – solo en registro */}
          {!isLogin && (
            <div className="form-group mb-4 slide-in">
              <label htmlFor="rol">Rol de Usuario</label>
              <select
                id="rol"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
              >
                <option value="USER">Voluntario / Donante</option>
                <option value="ADMIN">Coordinador Logístico (ADMIN)</option>
              </select>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn w-full mt-3"
            style={{ justifyContent: 'center' }}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                Verificando...
              </>
            ) : (
              <>
                {isLogin ? 'Ingresar al Portal' : 'Crear mi Cuenta'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Toggle login/registro */}
        <div style={{
          textAlign: 'center', marginTop: '28px',
          paddingTop: '20px', borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}>
          <span className="text-sm text-muted">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          </span>
          <button className="login-toggle-link" onClick={switchMode}>
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
          </button>
        </div>

        {/* Credenciales demo — con botones de autorrelleno */}
        {isLogin && (
          <div style={{
            marginTop: '20px', padding: '14px 16px',
            background: 'rgba(99, 102, 241, 0.07)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem', color: 'var(--text-muted)'
          }}>
            <strong style={{ color: '#818cf8', display: 'block', marginBottom: '10px' }}>
              👤 Acceso rápido de demo
            </strong>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => { setEmail('admin@donaton.cl'); setPassword('admin123'); }}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
                  background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99,102,241,0.3)',
                  color: '#818cf8', fontFamily: 'inherit', fontSize: '0.75rem', fontWeight: 600,
                  transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}
                onMouseOver={e => e.target.style.background = 'rgba(99,102,241,0.22)'}
                onMouseOut={e => e.target.style.background = 'rgba(99,102,241,0.12)'}
              >
                🛡️ Admin
              </button>
              <button
                type="button"
                onClick={() => { setEmail('user@donaton.cl'); setPassword('user123'); }}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
                  background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16,185,129,0.25)',
                  color: '#34d399', fontFamily: 'inherit', fontSize: '0.75rem', fontWeight: 600,
                  transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}
                onMouseOver={e => e.target.style.background = 'rgba(16,185,129,0.2)'}
                onMouseOut={e => e.target.style.background = 'rgba(16,185,129,0.1)'}
              >
                👤 Voluntario
              </button>
            </div>
            <p style={{ marginTop: '8px', opacity: 0.6, fontSize: '0.7rem' }}>
              Clic para rellenar automáticamente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
