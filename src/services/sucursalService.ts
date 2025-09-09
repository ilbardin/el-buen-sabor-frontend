import type {AxiosResponse} from "axios";
import axiosInstance from "../api/axiosInstance.ts";
import {mostrarAlerta} from "../utils/alerts";
import type {Sucursal} from "../models/sucursal.ts";

const API_URL = import.meta.env.VITE_API_URL + "/sucursal";


function handleInvalidResponse(response: AxiosResponse, errorMessage: string): boolean {
    if (!response || !response.data) {
        void mostrarAlerta("Error", "error", errorMessage);
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


export async function crearSucursal(sucursal: Sucursal): Promise<void> {
    try {
        await axiosInstance.post(API_URL, sucursal);
        await mostrarAlerta("Éxito", "success", "Sucursal creada correctamente.");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function deleteSucursal(id: number): Promise<void> {
    try {
        await axiosInstance.delete(API_URL + "/" + id);
        await mostrarAlerta("Éxito", "success", "Sucursal creada correctamente.");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function editarSucursal(sucursal: Sucursal): Promise<void> {
    try {
        await axiosInstance.put(API_URL, sucursal);
        await mostrarAlerta("Éxito", "success", "Sucursal editada correctamente.");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
