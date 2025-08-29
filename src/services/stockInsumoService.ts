import type {AxiosResponse} from "axios";
import axiosInstance from "../api/axiosInstance.ts";
import type {StockInsumo} from "../models/stockInsumo";
import {showAlert} from "../utils/alerts";
import {useSucursalStore} from "../components/Sucursal/SucursalStore.tsx";


function handleInvalidResponse(response: AxiosResponse, errorMessage: string): boolean {
    if (!response || !response.data) {
        void showAlert("Error", "error", errorMessage);
        return true;
    }
    return false;
}

export async function getStockInsumos(): Promise<StockInsumo[]> {
    try {
        const idSucursal = useSucursalStore.getState().idSucursal;

        if (!idSucursal) {
            throw new Error("No hay sucursal seleccionada.");
        }

        const API_URL = `${import.meta.env.VITE_API_URL}/sucursal/${idSucursal}/stock`;
        console.log("ID SUCURSAL EN SERVICIO:", idSucursal);
        console.log("API URL EN SERVICIO:", API_URL);
        const response = await axiosInstance.get<StockInsumo[]>(`${API_URL}`);

        if (handleInvalidResponse(response, "Error al obtener el stock de insumos.")) {
            return [];
        }

        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


export async function editarStockInsumo(stock: StockInsumo): Promise<void> {
    try {
        const idSucursal = useSucursalStore.getState().idSucursal;

        if (!idSucursal) {
            throw new Error("No hay sucursal seleccionada.");
        }

        const API_URL = `${import.meta.env.VITE_API_URL}/sucursal/${idSucursal}/stock`;
        await axiosInstance.put(API_URL, stock);
        await showAlert("Éxito", "success", "Stock de insumos actualizado correctamente.");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
