import React, {useEffect, useState} from 'react';
import {AuthContext} from './authContext.ts';
import type {Usuario} from '../types/usuario';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('usuario');

        if (savedUser) {
            setUsuario(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (user: Usuario) => {
        // Validar rol al inicio de sesión (ya asignado durante el login).
        if (!user.rol) {
            console.error("Usuario sin rol asignado. No se puede iniciar sesión.");
            return;
        }

        localStorage.setItem('usuario', JSON.stringify(user));
        setUsuario(user);
    };

    const logout = () => {
        localStorage.removeItem('usuario');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{
            usuario,
            login,
            logout,
            loading,
            isLoggingOut,
            setIsLoggingOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};