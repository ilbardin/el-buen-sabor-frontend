import React, {useCallback, useEffect, useState} from "react";
import {getArticulosManufacturados,} from "../../services/articuloManufacturadoService.ts";
import type {ArticuloManufacturado} from "../../models/articuloManufacturado.ts";
import FormularioArticulosManufacturados
    from "../../components/FormularioArticulosManufacturados/FormularioArticulosManufacturados.tsx";
import {
    AgregarCategoriaArticuloManufacturado
} from "../../components/AgregarCategoriaArticuloManufacturado/AgregarCategoriaArticuloManufacturado.tsx";
import baseABM from "../../css/baseABM.module.css";
import ModuloArticuloManofacturado from "../../components/ModuloArticuloManofacturado/ModuloArticuloManofacturado.tsx";
import {mostrarAlerta} from "../../utils/alerts.ts";

export const ProductosABM = () => {
    const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
    const [articuloParaEditar, setArticuloParaEditar] =
        useState<ArticuloManufacturado | null>(null);

    const [busqueda, setBusqueda] = useState("");

    const cargarArticulosManufacturados = useCallback(async () => {
        try {
            const articulos = await getArticulosManufacturados();
            setArticulos(articulos);
        } catch (error) {
            await mostrarAlerta('Error', 'error', 'Error al cargar los artículos manufacturados.');
            console.error("Error al cargar los artículos manufacturados:", error);
        }
    }, []);

    useEffect(() => {
        void cargarArticulosManufacturados();
    }, [cargarArticulosManufacturados]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value.toLowerCase());
    };

    const articulosFiltrados = articulos.filter((articulo) =>
        articulo.denominacion.toLowerCase().includes(busqueda)
    );

    return (
        <div>
            {mostrarModal && (
                <FormularioArticulosManufacturados
                    onClose={() => {
                        setMostrarModal(false);
                        setArticuloParaEditar(null);
                    }}
                    onCreateSuccess={cargarArticulosManufacturados}
                    articuloParaEditar={articuloParaEditar}
                />
            )}
            {mostrarModalCategoria && (
                <AgregarCategoriaArticuloManufacturado
                    onClose={() => setMostrarModalCategoria(false)}
                />
            )}

            <div className={baseABM.container}>
                <h1 className={baseABM.titulo}>Productos Manufacturados</h1>

                <div className={baseABM.botonesContainer}>
                    <button
                        className={baseABM.boton}
                        onClick={() => setMostrarModal(true)}
                    >
                        Añadir nuevo Producto
                    </button>

                    <button
                        className={`${baseABM.boton} ${baseABM.botonSecundario}`}
                        onClick={() => setMostrarModalCategoria(true)}
                    >
                        Añadir nueva Categoria
                    </button>
                </div>

                <div className={baseABM.filtrosContainer}>
                    <input
                        type="text"
                        placeholder="Buscar"
                        onChange={handleChange}
                        className={baseABM.filtroInput}
                        value={busqueda}
                    />
                </div>

                <table className={baseABM.tabla}>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>descripcion</th>
                        <th>Tiempo estimadio</th>
                        <th>Precio Costo</th>
                        <th>Estado</th>
                        <th>Imagen</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {articulosFiltrados.map((articulo) => (
                        <ModuloArticuloManofacturado
                            key={articulo.id}
                            articulo={articulo}
                            onModificar={(articulo) => {
                                setArticuloParaEditar(articulo);
                                setMostrarModal(true);
                            }}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
