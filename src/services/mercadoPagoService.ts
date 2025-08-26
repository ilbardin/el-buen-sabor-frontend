import axiosInstance from "../api/axiosInstance.ts";
import type {ItemCarritoMp} from "../models/pedidoRequest.ts";

interface PreferenceIdResponse {
    id: string;
    initPoint: string;
}

interface PedidoMp {
    items: ItemCarritoMp[];
    shipment: number | null;
    idPedido: string;
}

export const crearPeticionMP = (pedido: PedidoMp) =>
    axiosInstance.post<PreferenceIdResponse>('/mercadopago/checkout', pedido).then(res => res.data);
