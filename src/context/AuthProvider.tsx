import React, {useEffect, useState} from 'react';
import {AuthContext} from './authContext.ts';
import type {UserData, Usuario} from '../types/usuario';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [jwt, setJwt] = useState<string | null>(null);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        const savedUser = localStorage.getItem('usuario');

        if (jwt) {
            setJwt(jwt);
        }

        if (savedUser) {
            setUsuario(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData: UserData) => {
        // TODO: mejorar robustez de esto
        if (!userData.usuario.rol) {
            console.error("Usuario sin rol asignado. No se puede iniciar sesión.");
            return;
        }

        localStorage.setItem('jwt', userData.token);
        localStorage.setItem('usuario', JSON.stringify(userData.usuario));
        setJwt(userData.token);
        setUsuario(userData.usuario);
    };

    const logout = () => {
        localStorage.removeItem('usuario');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{
            jwt,
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