import type { AxiosResponse } from "axios";
import axiosInstance from "../api/axiosInstance.ts";
import type { StockInsumo } from "../models/stockInsumo";
import { showAlert } from "../utils/alerts";

const API_URL = import.meta.env.VITE_API_URL + "/sucursal/2/stock";


function handleInvalidResponse(response: AxiosResponse, errorMessage: string): boolean {
    if (!response || !response.data) {
        void showAlert("Error", "error", errorMessage);
        return true;
    }
    return false;
}



export async function getStockInsumos(): Promise<StockInsumo[]> {
    try {
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
        await axiosInstance.put(API_URL, stock);


        await showAlert("Éxito", "success", "Stock de insumos actualizado correctamente.");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}