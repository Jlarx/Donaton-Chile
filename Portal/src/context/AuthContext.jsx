import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decodificar el payload del JWT (parte intermedia)
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    email: payload.sub,
                    role: payload.role
                });
            } catch (error) {
                console.error("Error al decodificar el token", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({
                email: payload.sub,
                role: payload.role
            });
        } catch (error) {
            console.error("Error al decodificar el token en el login", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
