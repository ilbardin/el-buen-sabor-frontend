import type {AxiosResponse} from "axios";
import type {ReportesResponse} from "../models/reportesResponse.ts";
import {useSucursalStore} from "../components/Sucursal/SucursalStore.tsx";
import axiosInstance from "../api/axiosInstance.ts";
import {mostrarAlerta} from "../utils/alerts.ts";

function handleInvalidResponse(response: AxiosResponse, errorMessage: string): boolean {
    if (!response || !response.data) {
        void mostrarAlerta("Error", "error", errorMessage);
        return true;
    }
    return false;
}

export async function getReportes( fechaDesde: string, fechaHasta: string, tipoReporte : string): Promise<ReportesResponse> {
    try {
        let idSucursal = useSucursalStore.getState().idSucursal;

    if (!idSucursal) {
        idSucursal = 1;
    }

    const API_URL = `${import.meta.env.VITE_API_URL}/reportes/${idSucursal}?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}&tipoReporte=${tipoReporte}`;


    const response = await axiosInstance.get<ReportesResponse>(`${API_URL}`);

    if (handleInvalidResponse(response, "Error al obtener el reporte.")) {
        return {
            sucursal: "",
            tipoReporte: "",
            descripcion: "",
            fechaDesde: "",
            fechaHasta: "",
            detalles: []
        };
    }

        return response.data;
    } catch (error) {
        console.error("Error:", error);
        void mostrarAlerta("Error", "error", "No se pudo obtener el reporte.");
        return {
            sucursal: "",
            tipoReporte: "",
            descripcion: "",
            fechaDesde: "",
            fechaHasta: "",
            detalles: []
        }
    }
}

export async function descargarExcel(
    fechaDesde: string,
    fechaHasta: string,
    tipoReporte: string
): Promise<void> {
    try {
        let idSucursal = useSucursalStore.getState().idSucursal;

        if (!idSucursal) {
            idSucursal = 1;
        }

        const API_URL = `${import.meta.env.VITE_API_URL}/reportes/${idSucursal}/excel?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}&tipoReporte=${tipoReporte}`;

        const response = await axiosInstance.get(API_URL, {
            responseType: "blob", // 👈 importante para recibir binario
        });

        if (!response || !response.data) {
            void mostrarAlerta("Error", "error", "Error al descargar el Excel.");
            return;
        }

        // Crear enlace temporal para descarga
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `reporte-${tipoReporte}.xlsx`); // 👈 nombre del archivo
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error al descargar Excel:", error);
        void mostrarAlerta("Error", "error", "No se pudo descargar el reporte en Excel.");
    }
}