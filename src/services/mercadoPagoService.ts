import axiosInstance from "../api/axiosInstance.ts";
import type {PedidoRequest} from "../models/pedidoRequest.ts";

interface PreferenceMP {
    id: string;
    init_point: string;
}

export const crearPeticionMP = (pedido: PedidoRequest) =>
    axiosInstance.post<PreferenceMP>('/checkout', pedido).then(res => res.data);