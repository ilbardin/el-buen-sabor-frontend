import {useEffect, useState} from "react";
import {obtenerArticulos} from "../services/ingredientesService";
import type {ArticuloInsumo} from "../interfaces/articuloInsumo";
import FormularioArticulosInsumo from "../components/formularioArticuloInsumo";
import AgregarCategoriaArticuloManufacturado from "../components/AgregarCategoriaArticuloManufacturado.tsx";

export default function ArticuloInsumoABM() {
    const [articulos, setArticulos] = useState<ArticuloInsumo[]>([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);

    useEffect(() => {
        async function cargarArticulosInsumo() {
            try {
                const articulos = await obtenerArticulos();
                console.log('articulos:', articulos);
                setArticulos(articulos);
            } catch (error) {
                console.error("Error al cargar los artículos:", error);
            }
        }

        cargarArticulosInsumo();
    }, []);

    return (
        <div>
            {mostrarModal && (
                <FormularioArticulosInsumo onClose={() => setMostrarModal(false)}/>
            )}
            {mostrarModalCategoria && (
                <AgregarCategoriaArticuloManufacturado
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
