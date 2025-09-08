import axiosInstance from "../api/axiosInstance.ts";
import type {Localidad, Pais, Provincia} from "../models/ubicaciones.ts";
import {mostrarAlerta} from "../utils/alerts.ts";


const API_PAISES = import.meta.env.VITE_API_URL + "/paises";
const API_PROVINCIAS = import.meta.env.VITE_API_URL + "/provincias";
const API_LOCALIDADES = import.meta.env.VITE_API_URL + "/localidades";

export async function getPaises(): Promise<Pais[]> {
    try {
        const response = await axiosInstance.get(API_PAISES);

        if (!response || !response.data) {
            await mostrarAlerta("Error", "error", "Error al obtener paises.");
        }

        return await response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function getProvinciasPorPais(idPais: number): Promise<Provincia[]> {
    try {
        const response = await axiosInstance.get(`${API_PROVINCIAS}/${idPais}`);

        if (!response || !response.data) {
            await mostrarAlerta("Error", "error", "Error al obtener paises.");
        }

        return await response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function getLocalidadesPorProvincia(idProvincia: number): Promise<Localidad[]> {
    try {
        const response = await axiosInstance.get(`${API_LOCALIDADES}/${idProvincia}`);

        if (!response || !response.data) {
            await mostrarAlerta("Error", "error", "Error al obtener paises.");
        }

        return await response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
