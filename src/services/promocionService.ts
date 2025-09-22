import axios, {type AxiosResponse} from "axios";
import axiosInstance from "../api/axiosInstance.ts";
import type {Promocion} from "../models/promocion.ts";
import {mostrarAlerta} from "../utils/alerts.ts";
import {handleNetworkError} from "../utils/errorHandler.ts";

const API_URL = import.meta.env.VITE_API_URL + "/promociones";

function handleInvalidResponse(
    response: AxiosResponse,
    errorMessage: string
): boolean {
    if (!response || !response.data) {
        void mostrarAlerta("Error", "error", errorMessage);
        return true;
    }
    return false;
}

export async function getPromociones(): Promise<Promocion[]> {
    try {
        const response = await axiosInstance.get<Promocion[]>(`${API_URL}`);
        if (handleInvalidResponse(response, "Error al obtener las promociones.")) {
            return [];
        }
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function crearPromocion(promocion: Promocion): Promise<void> {
    try {
        await axiosInstance.post(`${API_URL}`, promocion);
        await mostrarAlerta("Éxito", "success", "Promoción creada correctamente.");
    } catch (error) {
        console.error("Error al crear la promoción:", error);
        if (await handleNetworkError(error)) return;

        await mostrarAlerta("Error", "error", "No se pudo crear la promoción.");
        throw error;
    }
}

export async function editarPromocion(promocion: Promocion): Promise<void> {
    try {
        await axiosInstance.put(`${API_URL}/${promocion.id}`, promocion);
        await mostrarAlerta("Éxito", "success", "Promoción actualizada correctamente.");
    } catch (error: any) {
        console.error("Error al editar la promoción:", error);

        if (await handleNetworkError(error)) return;

        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;

            if (status === 404) {
                await mostrarAlerta("No encontrada", "warning", "La promoción a editar no existe.");
            } else if (status === 304) {
                await mostrarAlerta("Sin cambios", "info", "No se detectaron cambios en la promoción.");
            } else {
                await mostrarAlerta("Error", "error", "No se pudo editar la promoción.");
            }
        } else {
            await mostrarAlerta("Error", "error", "Ocurrió un error inesperado.");
        }

        throw error;
    }
}

export async function eliminarPromocion(id: number): Promise<void> {
    try {
        await axiosInstance.delete(`${API_URL}/${id}`);
        await mostrarAlerta("Éxito", "success", "Promoción eliminada correctamente.");
    } catch (error: any) {
        console.error("Error al eliminar la promoción:", error);

        if (await handleNetworkError(error)) return;

        await mostrarAlerta("Error", "error", "No se pudo eliminar la promoción.");
        throw error;
    }
}
