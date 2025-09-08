import {type ReactNode, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {AuthContext} from './authContext.ts';
import type {UserData, Usuario} from '../../models/usuario/usuario.ts';
import {mostrarAlerta, mostrarCargando} from "../../utils/alerts.ts";
import {ROUTES} from "../../constants/routes.ts";
import {CartContext} from "../carrito/cartContext.ts";
import {alertaCarrito} from "../../utils/funcionesReutilizables.ts";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [tokenJwt, setJwt] = useState<string | null>(null);
    const [jwtExpirationEpochMs, setExpirationEpochMs] = useState<number | null>(null);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const logoutTimerRef = useRef<number | null>(null);

    const {cart} = useContext(CartContext);
    const existeCarrito = cart.length > 0;

    const clearLogoutTimer = useCallback(() => {
        if (logoutTimerRef.current !== null) {
            window.clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    }, []);

    const logout = useCallback(async () => {
        if (existeCarrito) {
            const confirmacion = await alertaCarrito();

            if (!confirmacion) {
                return;
            }
        }

        mostrarCargando("Cerrando sesión...");

        setIsLoggingOut(true);
        clearLogoutTimer();
        localStorage.clear();
        setJwt(null);
        setExpirationEpochMs(null);
        setUsuario(null);
        setTimeout(() => {
            window.location.replace(ROUTES.HOME);
            setIsLoggingOut(false);
        }, 500);
    }, [clearLogoutTimer, existeCarrito]);

    const scheduleLogoutAt = useCallback((expirationEpochMs: number) => {
        clearLogoutTimer();

        const nowMs = Date.now();
        const remainingMs = Math.max(0, expirationEpochMs - nowMs);

        logoutTimerRef.current = window.setTimeout(async () => {
            await mostrarAlerta(
                "Sesión expirada",
                "error",
                "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
                false
            );
            await logout();
        }, remainingMs);
    }, [clearLogoutTimer, logout]);

    const login = (userData: UserData) => {
        if (!userData.user.rol) {
            console.error("Usuario sin rol asignado. No se puede iniciar sesión.");
            return;
        }

        localStorage.setItem('jwt', userData.jwt.token);

        const expMs = new Date(userData.jwt.expirationDate).getTime();
        localStorage.setItem('jwtExpirationEpochMs', String(expMs));

        localStorage.setItem('usuario', JSON.stringify(userData.user));

        setJwt(userData.jwt.token);
        setExpirationEpochMs(expMs);
        setUsuario(userData.user);

        scheduleLogoutAt(expMs);
    };

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        const expMsStr = localStorage.getItem("jwtExpirationEpochMs");
        const savedUser = localStorage.getItem("usuario");

        if (jwt) {
            setJwt(jwt);
        }

        if (expMsStr) {
            const expMs = parseInt(expMsStr, 10);
            if (Number.isFinite(expMs)) {
                setExpirationEpochMs(expMs);
                scheduleLogoutAt(expMs);
            } else {
                logout();
                setLoading(false);
                return;
            }
        }

        if (savedUser) {
            try {
                setUsuario(JSON.parse(savedUser));
            } catch {
                void mostrarAlerta('Error', 'error', 'Error al deserializar el usuario.');
            }
        }

        setLoading(false);
    }, [logout, scheduleLogoutAt]);

    useEffect(() => {
        if (tokenJwt && jwtExpirationEpochMs) {
            scheduleLogoutAt(jwtExpirationEpochMs);
        } else {
            clearLogoutTimer();
        }

        return () => clearLogoutTimer();
    }, [tokenJwt, jwtExpirationEpochMs, scheduleLogoutAt, clearLogoutTimer]);

    return (
        <AuthContext.Provider value={{
            tokenJwt,
            jwtExpirationDate: jwtExpirationEpochMs ? new Date(jwtExpirationEpochMs) : null,
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
