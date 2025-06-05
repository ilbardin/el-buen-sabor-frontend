import type {ArticuloInsumo, ArticuloInsumoCreacion} from "../interfaces/articuloInsumo.ts";
import axiosInstance from "../api/axiosInstance.ts";
import {showAlert} from "../utils/alerts.ts";
import type {CategoriaArticulo} from "../interfaces/categoriaArticulo.ts";
import type {UnidadMedida} from "../interfaces/unidadMedida.ts";

const API_URL = import.meta.env.VITE_API_URL + "/articulos-insumo";
const API_URL_CATEGORIA = import.meta.env.VITE_API_URL + "/categorias-articulo";
const API_URL_UNIDADES_MEDIDA = import.meta.env.VITE_API_URL + "/unidades-medida";

export async function obtenerArticulos(): Promise<ArticuloInsumo[]> {
    try {
        const response = await axiosInstance.get(API_URL);

        if (!response || !response.data) {
            await showAlert("Error", "error", "Error al obtener los artículos insumo.");
        }

        return await response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function crearArticuloInsumo(articulo: ArticuloInsumoCreacion): Promise<void> {
    try {
        const response = await axiosInstance.post(API_URL, articulo);

        if (!response || !response.data) {
            await showAlert("Error", "error", "Error al crear el Artículo Insumo");
            return;
        }

        await showAlert("Éxito", "success", "Artículo Insumo creado correctamente.");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function obtenerCategorias(): Promise<CategoriaArticulo[]> {
    try {
        const response = await axiosInstance.get(API_URL_CATEGORIA);

        if (!response || !response.data) {
            await showAlert("Error", "error", "Error al obtener categorías.");
            return [];
        }

        return await response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function crearCategoriaArticulo(denominacion: string, categoriaPadreId: number | null): Promise<void> {
    try {
        const categoria = {
            denominacion,
            estaActivo: true,
            categoriaPadre: categoriaPadreId !== null ? {id: categoriaPadreId} : null
        };

        const response = await axiosInstance.post(API_URL_CATEGORIA, categoria);

        if (!response || !response.data) {
            await showAlert("Error", "error", "Error al crear la categoría de artículo manufacturado.");
        }

        await showAlert("Categoría creada correctamente", "success");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function obtenerUnidadesMedida(): Promise<UnidadMedida[]> {
    try {
        const response = await axiosInstance.get(API_URL_UNIDADES_MEDIDA);

        if (!response || !response.data) {
            await showAlert("Error", "error", "Error al obtener las unidades de medida.");
        }

        return await response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}