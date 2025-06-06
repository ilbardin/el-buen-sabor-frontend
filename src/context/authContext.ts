import {createContext} from 'react';
import type {UserData, Usuario} from '../types/usuario.ts';

type AuthContextType = {
    tokenJwt: string | null;
    jwtExpirationDate: Date | null;
    usuario: Usuario | null;
    login: (user: UserData) => void;
    logout: () => void;
    loading: boolean;
    isLoggingOut: boolean;
    setIsLoggingOut: (val: boolean) => void;
};

export const AuthContext = createContext<AuthContextType>({
    tokenJwt: null,
    jwtExpirationDate: null,
    usuario: null,
    login: () => {
    },
    logout: () => {
    },
    loading: true,
    isLoggingOut: false,
    setIsLoggingOut: () => {
    },
});