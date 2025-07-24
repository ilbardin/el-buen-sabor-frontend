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

export async function crearEmpresa(empresa: Empresa): Promise<void> {
  try {
    const response = await axiosInstance.post(API_URL, empresa);

    if (!response || !response.data) {
      await showAlert("Error", "error", "Error al crear la Empresa");
      return;
    }

    await showAlert(
      "Éxito",
      "success",
      "Empresa creada correctamente."
    );
    return await response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
