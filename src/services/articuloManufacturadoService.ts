import axiosInstance from "../api/axiosInstance.ts";
import type {ArticuloManufacturado, ArticuloManufacturadoCreacion} from "../models/articuloManufacturado.ts";
import {showAlert} from "../utils/alerts.ts";
import type {CategoriaArticuloManufacturado} from "../models/categoriaArticuloManufacturado.ts";
import type {AxiosResponse} from "axios";
import type { PedidoRequest } from "../models/pedido/pedidoRequest.ts";

const API_URL_PEDIDOS = import.meta.env.VITE_API_URL + "/pedidos";
const API_URL = import.meta.env.VITE_API_URL + "/articulos-manufacturados";
const API_URL_CATEGORIA = import.meta.env.VITE_API_URL + "/categoria-articulos-manufacturados";

function handleInvalidResponse(response: AxiosResponse, errorMessage: string): boolean {
    if (!response || !response.data) {
        void showAlert("Error", "error", errorMessage);
        return true;
    }
    return false;
}

export async function getArticulosManufacturados(): Promise<ArticuloManufacturado[]> {
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

export async function getDetallesArticuloManufacturado(id: string): Promise<ArticuloManufacturado | undefined> {
    try {
        const response = await axiosInstance.get<ArticuloManufacturado>(`${API_URL}/${id}`);

        if (handleInvalidResponse(response, "Error al obtener los artículos manufacturados.")) {
            return;
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

export async function editarArticuloManufacturado(articulo: ArticuloManufacturadoCreacion): Promise<void> {
    try {
        const response = await axiosInstance.post(API_URL, articulo);

        if (handleInvalidResponse(response, "Error al editar artículo manufacturado.")) {
            return;
        }

        await showAlert("Éxito", "success", "Artículo manufacturado creado correctamente.");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function eliminarArticuloManufacturado(id: number): Promise<void> {
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

        await showAlert("Éxito", "success", response.data);
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


export async function savePedido(pedido: PedidoRequest) {
    try {
        const response = await axiosInstance.post(`${API_URL_PEDIDOS}`, pedido);

        if (handleInvalidResponse(response, "Error al guardar el pedido.")) {
            return;
        }

        return response;
    } catch (error) {
        console.error("Error al guardar el pedido:", error);
        throw error;
    }
}


export async function subirImagen(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("imagen", file);

    try {
        const response = await axiosInstance.post(
            "http://localhost:8080/uploads/images",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (handleInvalidResponse(response, "Error al subir la imagen.")) {
            return null;
        }

        const fileName = response.data.denominacion;
        console.log("Imagen subida exitosamente:", fileName);
        return fileName;
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        return null;
    }
}
