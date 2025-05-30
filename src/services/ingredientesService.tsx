import type {ArticuloManufacturado} from "../interfaces/articuloManufacturado.ts";

const API_URL = "http://localhost:8080/api/articulos-insumo";
const API_URL_CATEGORIA = "http://localhost:8080/api/categorias-articulo";
const API_URL_UNIDADES_MEDIDA = "http://localhost:8080/api/unidades-medida";

export async function obtenerArticulos(): Promise<ArticuloManufacturado[]> {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Error al obtener los artículos manufacturados");
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function crearArticuloInsumo(articulo: any): Promise<void> {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(articulo),
        });

        if (!response.ok) {
            throw new Error("Error al crear el Artículo Insumo");
        }

        console.log("Artículo Insumo creado correctamente");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


/*---CATEGORIA---*/

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

export async function crearCategoriaArticulo(denominacion: string, categoriaPadreId: number | null): Promise<void> {
    try {
        const categoria = {
            denominacion,
            fechaAlta: new Date().toISOString(),
            fechaBaja: null,
            estaActivo: true,
            categoriaPadre: categoriaPadreId !== null ? {id: categoriaPadreId} : null
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

//---UNIDADES DE MEDIDA---//

export async function obtenerUnidadesMedida(): Promise<any[]> {
    try {
        const response = await fetch(API_URL_UNIDADES_MEDIDA);
        if (!response.ok) {
            throw new Error("Error al obtener las unidades de medida");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}