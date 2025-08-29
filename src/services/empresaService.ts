import axiosInstance from "../api/axiosInstance.ts";
import { showAlert } from "../utils/alerts.ts";
import type { AxiosResponse } from "axios";
import type { Empresa } from "../models/empresa.ts";

const API_URL = import.meta.env.VITE_API_URL + "/empresa";

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

export async function getEmpresas(): Promise<Empresa[]> {
  try {
    const response = await axiosInstance.get<Empresa[]>(`${API_URL}`);

    if (handleInvalidResponse(response, "Error al obtener las empresas.")) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function crearEmpresa(empresa: Empresa): Promise<void> {
  try {
    await axiosInstance.post(API_URL, empresa);
    await showAlert("Éxito", "success", "Empresa creada correctamente.");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function deleteEmpresa(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
    await showAlert("Éxito", "success", "Empresa eliminada correctamente.");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function editarEmpresa(id: number, nuevaEmpresa: Empresa): Promise<void> {
  try {
    await axiosInstance.put(`${API_URL}/${id}`, nuevaEmpresa);
    await showAlert("Éxito", "success", "Empresa editada correctamente.");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}