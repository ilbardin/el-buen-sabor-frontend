import type { AxiosResponse } from "axios";
import axiosInstance from "../api/axiosInstance.ts";
import type { Promocion } from "../models/promocion.ts";
import { showAlert } from "../utils/alerts.ts";

const API_URL = import.meta.env.VITE_API_URL + "/promociones";

function handleInvalidResponse(
  response: AxiosResponse,
  errorMessage: string
): boolean {
  if (!response || !response.data) {
    void showAlert("Error", "error", errorMessage);
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
    await showAlert("Éxito", "success", "Promoción creada correctamente.");
  } catch (error) {
    console.error("Error al crear la promoción:", error);
    await showAlert("Error", "error", "No se pudo crear la promoción.");
    throw error;
  }
}

export async function editarPromocion(promocion: Promocion): Promise<void> {
  try {
    await axiosInstance.put(`${API_URL}/${promocion.id}`, promocion);
    await showAlert("Éxito", "success", "Promoción actualizada correctamente.");
  } catch (error) {
    console.error("Error al editar la promoción:", error);
    await showAlert("Error", "error", "No se pudo editar la promoción.");
    throw error;
  }
}

export async function eliminarPromocion(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
    await showAlert("Éxito", "success", "Promoción eliminada correctamente.");
  } catch (error) {
    console.error("Error al eliminar la promoción:", error);
    await showAlert("Error", "error", "No se pudo eliminar la promoción.");
    throw error;
  }
}
