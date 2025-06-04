import {createContext} from 'react';
import type {UserData, Usuario} from '../types/usuario.ts';

type AuthContextType = {
    jwt: string | null;
    usuario: Usuario | null;
    login: (user: UserData) => void;
    logout: () => void;
    loading: boolean;
    isLoggingOut: boolean;
    setIsLoggingOut: (val: boolean) => void;
};

export const AuthContext = createContext<AuthContextType>({
    jwt: null,
    usuario: null,
    login: () => {},
    logout: () => {},
    loading: true,
    isLoggingOut: false,
    setIsLoggingOut: () => {},
});