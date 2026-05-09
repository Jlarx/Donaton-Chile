import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Heart, User, Key, Mail, ShieldAlert } from 'lucide-react';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [rol, setRol] = useState('USER');
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);
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
                // Después de registrar exitosamente, hacemos login automático
                const res = await api.post('/auth/login', { email, password });
                login(res.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Ocurrió un error");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Heart color="#ef4444" size={48} style={{ margin: '0 auto' }} />
                    <h2 style={{ marginTop: '16px', color: '#1e293b' }}>
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h2>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>
                        Portal Logístico Donaton
                    </p>
                </div>

                {error && (
                    <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldAlert size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label><User size={16} /> Nombre Completo</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                placeholder="Ej. Juan Pérez"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label><Mail size={16} /> Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div className="form-group">
                        <label><Key size={16} /> Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="********"
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Rol de Usuario</label>
                            <select value={rol} onChange={(e) => setRol(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                <option value="USER">Voluntario / Donante (USER)</option>
                                <option value="ADMIN">Coordinador Logístico (ADMIN)</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn" style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }} disabled={cargando}>
                        {cargando ? 'Cargando...' : (isLogin ? 'Ingresar al Portal' : 'Registrarse')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>
                        {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                    </p>
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
                    >
                        {isLogin ? 'Regístrate aquí' : 'Inicia Sesión aquí'}
                    </button>
                </div>
            </div>
        </div>
    );
}
