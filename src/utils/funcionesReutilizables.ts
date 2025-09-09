import {mostrarConfirmacion} from "./alerts.ts";
import type {ItemCarritoMp} from "../models/pedido/pedidoRequest.ts";
import type {ItemCarrito} from "../components/Carrito/Carrito.tsx";

export const alertaCarrito = async (): Promise<boolean> => {
    return await mostrarConfirmacion(
        "Confirmación",
        "Si cierra sesión, perderá los productos guardados en el carrito."
    );
};

export const mapCartItemsToMpItems = (cartItems: ItemCarrito[]): ItemCarritoMp[] => {
    return cartItems.map((item) => ({
        id: String(item.id ?? ""),
        title: item.denominacion,
        description: item.descripcion,
        pictureUrl: item.imagenes && item.imagenes.length > 0 ? item.imagenes[0].denominacion : undefined,
        categoryId: item.categoria,
        quantity: item.cantidad,
        currencyId: "ARS",
        unitPrice: item.precioVenta.toString()
    }));
};

export function soloNumeros(event: any): void {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/\D/g, '');
}

export function formatHora(fecha?: string | Date): string {
    if (!fecha) return "-";

    const dateObj = typeof fecha === "string" ? new Date(fecha) : fecha;

    return dateObj.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}



