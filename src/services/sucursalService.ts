import type { AxiosResponse } from "axios";
import axiosInstance from "../api/axiosInstance.ts";
import { showAlert } from "../utils/alerts";
import type { Sucursal } from "../models/sucursal.ts";

const API_URL = import.meta.env.VITE_API_URL + "/sucursal";


function handleInvalidResponse(response: AxiosResponse, errorMessage: string): boolean {
    if (!response || !response.data) {
        void showAlert("Error", "error", errorMessage);
        return true;
    }
    return false;
}



export async function getSucursal(): Promise<Sucursal[]> {
    try {
        
        const response = await axiosInstance.get<Sucursal[]>(`${API_URL}`);

        if (handleInvalidResponse(response, "Error al obtener las Sucursales.")) {
            return [];
        }

        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


export async function crearSucursal(stock: Sucursal): Promise<void> {
    try {
        await axiosInstance.put(API_URL, stock);
        await showAlert("Éxito", "success", "Sucursal creada correctamente.");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}