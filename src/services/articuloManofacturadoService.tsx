import axiosInstance from "../api/axiosInstance.ts";
import type {ArticuloManufacturado, ArticuloManufacturadoCreacion} from "../models/articuloManufacturado.ts";
import {showAlert} from "../utils/alerts.ts";
import type {CategoriaArticuloManufacturado} from "../models/categoriaArticuloManufacturado.ts";
import type {AxiosResponse} from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/articulos-manufacturados";
const API_URL_CATEGORIA = import.meta.env.VITE_API_URL + "/categoria-articulos-manufacturados";

function handleInvalidResponse(response: AxiosResponse, errorMessage: string): boolean {
    if (!response || !response.data) {
        void showAlert("Error", "error", errorMessage);
        return true;
    }
    return false;
}

export async function obtenerArticulosManofacturados(): Promise<ArticuloManufacturado[]> {
    try {
        const response = await axiosInstance.get<ArticuloManufacturado[]>(`${API_URL}/listar`);

        if (handleInvalidResponse(response, "Error al obtener los artículos manufacturados.")) {
            return [];
        }

        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function crearCategoriaArticuloManofacturado(denominacion: string): Promise<void> {
    try {
        const categoria = {denominacion, estaActivo: true};
        const response = await axiosInstance.post(API_URL_CATEGORIA, categoria);

        if (handleInvalidResponse(response, "Error al crear la categoría de artículo manufacturado.")) {
            return;
        }

        await showAlert("Éxito", "success", "Categoría creada correctamente.");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function obtenerCategorias(): Promise<CategoriaArticuloManufacturado[]> {
    try {
        const response = await axiosInstance.get(API_URL_CATEGORIA);

        if (handleInvalidResponse(response, "Error al obtener las categorías.")) {
            return [];
        }

        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


export async function crearArticuloManufacturado(articulo: ArticuloManufacturadoCreacion): Promise<void> {
    try {
        const response = await axiosInstance.post(API_URL, articulo);

        if (handleInvalidResponse(response, "Error al crear artículo manufacturado.")) {
            return;
        }

        await showAlert("Éxito", "success", "Artículo manufacturado creado correctamente.");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function eliminarArticuloManofacturado(id: number): Promise<void> {
    if (id === undefined) {
        console.error("El ID no puede ser undefined.");
        await showAlert("Error", "error", "El ID del artículo es inválido.");
        return;
    }

    try {
        const response = await axiosInstance.delete(`${API_URL}/${id}`);

        if (handleInvalidResponse(response, "Error al eliminar el artículo manufacturado.")) {
            return;
        }

        await showAlert("Éxito", "success", "Artículo manufacturado eliminado correctamente.");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}