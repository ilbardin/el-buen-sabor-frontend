import axiosInstance from "../api/axiosInstance.ts";
import type {PedidoMercadoPago} from "../models/pedidoRequest.ts";

interface PreferenceMP {
    id: string;
    init_point: string;
}

export const crearPeticionMP = (pedido: PedidoMercadoPago) =>
    axiosInstance.post<PreferenceMP>('/checkout', pedido).then(res => res.data);