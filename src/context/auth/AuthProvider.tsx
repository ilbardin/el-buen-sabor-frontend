import {type ReactNode, useEffect, useState} from 'react';
import {AuthContext} from './authContext.ts';
import type {UserData, Usuario} from '../../models/usuario/usuario.ts';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [tokenJwt, setJwt] = useState<string | null>(null);
    const [jwtExpirationDate, setExpirationDate] = useState<Date | null>(null);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        const jwtExpirationDate = localStorage.getItem('jwtExpirationDate');
        const savedUser = localStorage.getItem('usuario');

        if (jwt) {
            setJwt(jwt);
        }

        if (jwtExpirationDate) {
            setExpirationDate(new Date(jwtExpirationDate));
        }

        if (savedUser) {
            setUsuario(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData: UserData) => {
        // mejorar robustez de esto
        if (!userData.user.rol) {
            console.error("Usuario sin rol asignado. No se puede iniciar sesión.");
            return;
        }

        localStorage.setItem('jwt', userData.jwt.token);

        const expirationDate = new Date(userData.jwt.expirationDate);
        localStorage.setItem('jwtExpirationDate', expirationDate.toISOString());

        localStorage.setItem('usuario', JSON.stringify(userData.user));

        setJwt(userData.jwt.token);
        setExpirationDate(userData.jwt.expirationDate);
        setUsuario(userData.user);
    };

    const logout = () => {
        localStorage.clear();
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{
            tokenJwt,
            jwtExpirationDate,
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