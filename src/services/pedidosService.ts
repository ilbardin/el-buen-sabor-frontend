import axiosInstance from "../api/axiosInstance.ts";
import type {ArticuloManufacturado} from "../models/articuloManufacturado.ts";
import {showAlert} from "../utils/alerts.ts";
import type {AxiosResponse} from "axios";
import type {PedidoRequest} from "../models/pedido/pedidoRequest.ts";
import type {DatosEstadoPedido} from "../models/pedido/datosEstadoPedido.ts";

const API_URL_PEDIDOS = import.meta.env.VITE_API_URL + "/pedidos";
const API_URL = import.meta.env.VITE_API_URL + "/articulos-manufacturados";

function handleInvalidResponse(response: AxiosResponse, errorMessage: string): boolean {
    if (!response || !response.data) {
        void showAlert("Error", "error", errorMessage);
        return true;
    }
    return false;
}

export async function getPedidos(): Promise<PedidoRequest[]> {
    try {
        const response = await axiosInstance.get<PedidoRequest[]>(`${API_URL_PEDIDOS}`);

        if (handleInvalidResponse(response, "Error al obtener los pedidos")) {
            return [];
        }
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function getEstadoPedido(id: number): Promise<DatosEstadoPedido | undefined> {
    try {
        const response = await axiosInstance.get<DatosEstadoPedido>(`${API_URL_PEDIDOS}/${id}/resumen`);

        if (handleInvalidResponse(response, "Error al obtener los pedidos")) {
            return;
        }

        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function getDetallesArticuloManufacturado(id: string): Promise<ArticuloManufacturado | undefined> {
    try {
        const response = await axiosInstance.get<ArticuloManufacturado>(`${API_URL}/${id}`);

        if (handleInvalidResponse(response, "Error al obtener los artículos manufacturados.")) {
            return;
        }

        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


export async function eliminarPedido(id: number): Promise<void> {
    if (id === undefined) {
        console.error("El ID no puede ser undefined.");
        await showAlert("Error", "error", "El ID del pedido es inválido.");
        return;
    }

    try {
        const response = await axiosInstance.delete(`${API_URL_PEDIDOS}/${id}`);

        if (handleInvalidResponse(response, "Error al eliminar el pedido.")) {
            return;
        }

        await showAlert("Éxito", "success", response.data);
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


export async function savePedido(pedido: PedidoRequest) {
    try {
        const response = await axiosInstance.post(`${API_URL_PEDIDOS}`, pedido);

        if (handleInvalidResponse(response, "Error al guardar el pedido.")) {
            return;
        }

        return response;
    } catch (error) {
        console.error("Error al guardar el pedido:", error);
        throw error;
    }
}
