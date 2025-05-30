import type {ArticuloManufacturado} from "../interfaces/articuloManufacturado.ts";

const API_URL = "http://localhost:8080/api/articulos-manufacturados";
const API_URL_CATEGORIA = "http://localhost:8080/api/categoria-articulos-manufacturados";

export async function obtenerArticulosManofacturados(): Promise<ArticuloManufacturado[]> {
    try {
        const response = await fetch(API_URL + "/listar");
        if (!response.ok) {
            throw new Error("Error al obtener los artículos manufacturados");
        }
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


export async function crearCategoriaArticuloManofacturado(denominacion: string): Promise<void> {
    try {
        const categoria = {
            denominacion,
            fechaAlta: new Date().toISOString(),
            fechaBaja: null,
            estaActivo: true,
        };

        const response = await fetch(API_URL_CATEGORIA, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(categoria),
        });

        if (!response.ok) {
            throw new Error("Error al crear la categoría de artículo manufacturado");
        }

        console.log("Categoría creada correctamente");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function obtenerCategorias(): Promise<any[]> {
    try {
        const response = await fetch(API_URL_CATEGORIA);
        if (!response.ok) {
            throw new Error("Error al obtener los artículos manufacturados");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


export async function crearArticuloManufacturado(articulo: any): Promise<void> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(articulo),
    });

    if (!response.ok) {
        throw new Error("Error al crear artículo manufacturado");
    }
}

export async function eliminarArticuloManofacturado(id: number) {
    const response = await fetch(`http://localhost:8080/articulo-manufacturado/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Error al eliminar el artículo manufacturado");
    }
}
