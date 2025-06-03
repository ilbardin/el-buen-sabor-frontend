import {createContext} from 'react';
import type {Usuario} from '../types/usuario.ts';

type AuthContextType = {
    usuario: Usuario | null;
    login: (user: Usuario) => void;
    logout: () => void;
    loading: boolean;
    isLoggingOut: boolean;
    setIsLoggingOut: (val: boolean) => void;
};

export const AuthContext = createContext<AuthContextType>({
    usuario: null,
    login: () => {},
    logout: () => {},
    loading: true,
    isLoggingOut: false,
    setIsLoggingOut: () => {},
});