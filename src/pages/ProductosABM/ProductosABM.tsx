import {useEffect, useState} from "react";
import {eliminarArticuloManufacturado, getArticulosManufacturados,} from "../../services/articuloManufacturadoService.ts";
import type {ArticuloManufacturado} from "../../models/articuloManufacturado.ts";
import FormularioArticulosManufacturados from "../../components/FormularioArticulosManufacturados/FormularioArticulosManufacturados.tsx";
import {showConfirm} from "../../utils/alerts.ts";
import {
    AgregarCategoriaArticuloManufacturado
} from "../../components/AgregarCategoriaArticuloManufacturado/AgregarCategoriaArticuloManufacturado.tsx";
import styles from './ProductosABM.module.css';

export const ProductosABM = () => {
    const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);

    const cargarArticulosManofacturados = async () => {
        try {
            const articulos = await getArticulosManufacturados();
            setArticulos(articulos);
        } catch (error) {
            console.error("Error al cargar los artículos manufacturados:", error);
        }
    };

    useEffect(() => {
        void cargarArticulosManofacturados();
    }, []);

    async function handleEliminar(id: number) {
        try {
            const confirmacion = await showConfirm(
                "Confirmación",
                "¿Está seguro de que desea eliminar el producto?"
            );

            if (confirmacion) {
                await eliminarArticuloManufacturado(id);
                setArticulos(articulos.filter((articulo) => articulo.id !== id));
            }

        } catch (error) {
            console.error("Error al eliminar el artículo:", error);
        }
    }

    return (
        <div>
            {mostrarModal && (
                <FormularioArticulosManufacturados
                    onClose={() => setMostrarModal(false)}
                    onCreateSuccess={cargarArticulosManofacturados}
                />
            )}
            {mostrarModalCategoria && (
                <AgregarCategoriaArticuloManufacturado
                    onClose={() => setMostrarModalCategoria(false)}
                />
            )}

            <h1 className={styles.h1}>Productos Manufacturados</h1>

            <button onClick={() => setMostrarModal(true)}>
                Añadir nuevo Producto
            </button>

            <button onClick={() => setMostrarModalCategoria(true)}>
                Añadir nueva Categoria
            </button>

            <table>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>descripcion</th>
                    <th>Tiempo estimadio</th>
                    <th>Precio Costo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {articulos.map((articulo) => (
                    <tr key={articulo.id}>
                        <td>{articulo.denominacion}</td>
                        <td>{articulo.descripcion}</td>
                        <td>{articulo.tiempoEstimado}</td>
                        <td>{articulo.precioCosto}</td>
                        <td>{articulo.estaActivo ? "Esta activo" : "Dado de baja"}</td>
                        <td>
                            <button>Modificar</button>
                            {" "}
                            <button
                                onClick={async () => {
                                    if (articulo.id !== undefined) {
                                        await handleEliminar(articulo.id);
                                    } else {
                                        console.warn("No se puede eliminar: el artículo no tiene ID.");
                                    }
                                }}
                            >
                                Eliminar
                            </button>

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
