import {showConfirm} from "./alerts.ts";
import type {ItemCarritoMp} from "../models/pedidoRequest.ts";
import type {ItemCarrito} from "../components/Carrito/Carrito.tsx";

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

export const mapCartItemsToMpItems = (cartItems: ItemCarrito[]): ItemCarritoMp[] => {
    return cartItems.map((item) => ({
        id: String(item.id ?? ""),
        title: item.denominacion,
        description: item.descripcion,
        pictureUrl: item.imagenes && item.imagenes.length > 0 ? item.imagenes[0].denominacion : undefined,
        categoryId: item.categoriaArticulo,
        quantity: item.cantidad,
        currencyId: "ARS",
        unitPrice: item.precioVenta.toString()
    }));
};

