import axiosInstance from "../api/axiosInstance.ts";
import type {ItemCarritoMp} from "../models/pedidoRequest.ts";

interface PreferenceIdResponse {
    id: string;
    initPoint: string;
}

interface PedidoMp {
    montoCarrito: number;
    items: ItemCarritoMp[];
    idPedido: string;
}

export const crearPeticionMP = (pedido: PedidoMp) =>
    axiosInstance.post<PreferenceIdResponse>('/mercadopago/checkout', pedido).then(res => res.data);
