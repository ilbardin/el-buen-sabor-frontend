import {useEffect, useState} from "react";
import {getArticulosInsumo} from "../../services/ingredientesService.ts";
import type {ArticuloInsumo} from "../../models/articuloInsumo.ts";
import {FormularioArticulosInsumo} from "../../components/FormularioArticuloInsumo/FormularioArticuloInsumo.tsx";
import {AgregarCategoriaArticulo} from "../../components/AgregarCategoriaArticulo/AgregarCategoriaArticulo.tsx";

export const IngredientesABM = () => {
    const [articulos, setArticulos] = useState<ArticuloInsumo[]>([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);

    useEffect(() => {
        async function cargarArticulosInsumo() {
            try {
                const articulos = await getArticulosInsumo();
                console.log('articulos:', articulos);
                setArticulos(articulos);
            } catch (error) {
                console.error("Error al cargar los artículos:", error);
            }
        }

        void cargarArticulosInsumo();
    }, []);

    return (
        <div>
            {mostrarModal && (
                <FormularioArticulosInsumo onClose={() => setMostrarModal(false)}/>
            )}
            {mostrarModalCategoria && (
                <AgregarCategoriaArticulo
                    onClose={() => setMostrarModalCategoria(false)}
                />
            )}
            <h1>INSUMOS</h1>
            <button onClick={() => setMostrarModal(true)}>
                Añadir nuevo Insumo
            </button>
            <button onClick={() => setMostrarModalCategoria(true)}>
                Añadir nueva Categoría
            </button>
            <table>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Rubro</th>
                    <th>Precio Compra</th>
                    <th>Precio Venta</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {articulos.map((articulo) => (
                    <tr key={articulo.id}>
                        <td>{articulo.denominacion}</td>
                        <td>{articulo.categoriaArticulo.denominacion}</td>
                        <td>{articulo.precioCompra}</td>
                        <td>{articulo.precioVenta}</td>
                        <td>{articulo.estaActivo ? "Esta activo" : "Dado de baja"}</td>
                        <td>
                            <button>Modificar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
