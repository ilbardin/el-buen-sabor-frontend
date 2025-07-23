import {showConfirm} from "./alerts.ts";

export const existeCarrito = (): boolean => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cart_')) {
            return true;
        }
    }
    return false;
};

export const alertaCarrito = async (): Promise<boolean> => {
    return await showConfirm(
        "Confirmación",
        "Si cerra sesión, perderá los productos guardados en el carrito."
    );
};

