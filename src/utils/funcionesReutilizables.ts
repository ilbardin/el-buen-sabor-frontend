import {showConfirm} from "./alerts.ts";
import type {NavigateFunction} from 'react-router-dom';
import {ROUTES} from "../constants/routes.ts";

export const existeCarrito = (): boolean => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cart_')) {
            return true;
        }
    }
    return false;
};

const alertaCarrito = async (): Promise<boolean> => {
    return await showConfirm(
        "Confirmación",
        "Si cerra sesión, perderá los productos guardados en el carrito."
    );
};

export const handleLogout = async (
    onLogout: () => void,
    navigate: NavigateFunction,
    onBeforeLogout: () => void = () => {}
) => {
    const performLogout = () => {
        onLogout();
        onBeforeLogout();
        navigate(ROUTES.HOME);
    };

    if (existeCarrito()) {
        const confirmacion = await alertaCarrito();
        if (!confirmacion) {
            return;
        }
    }

    performLogout();
};
