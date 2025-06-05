import "../css/formularioArticulosManofacturados.css";
import React, {useEffect, useState} from "react";
import {obtenerArticulos} from "../services/ingredientesService";
import {crearArticuloManufacturado, obtenerCategorias,} from "../services/articuloManofacturadoService";
import type {ArticuloManufacturadoCreacion} from "../interfaces/articuloManufacturado.ts";

export default function FormularioArticulosManofacturados({onClose, onCreateSuccess}: {
    onClose: () => void;
    onCreateSuccess: () => void;
}) {
    const [denominacion, setDenominacion] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precioVenta, setPrecioVenta] = useState(0);
    const [tiempoEstimado, setTiempoEstimado] = useState(0);
    const [imagenInsumo, setImagenInsumo] = useState("");

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [categorias, setCategorias] = useState<any[]>([]);

    const [insumoSeleccionado, setInsumoSeleccionado] = useState("");
    const [cantidadInsumo, setCantidadInsumo] = useState(0);
    const [insumos, setInsumos] = useState<any[]>([]);
    const [detalles, setDetalles] = useState<{ insumo: any; cantidad: number }[]>(
        []
    );

    useEffect(() => {
        async function cargarDatos() {
            const categorias = await obtenerCategorias();
            const insumos = await obtenerArticulos();
            setCategorias(categorias);
            setInsumos(insumos);
        }

        cargarDatos();
    }, []);

    const agregarInsumo = () => {
        const insumoObj = insumos.find(
            (ins) => ins.denominacion === insumoSeleccionado
        );

        if (!insumoObj) {
            alert("Insumo no encontrado");
            return;
        }

        setDetalles([...detalles, {insumo: insumoObj, cantidad: cantidadInsumo}]);

        setInsumoSeleccionado("");
        setCantidadInsumo(0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const categoriaObj = categorias.find(
            (cat) => cat.denominacion === categoriaSeleccionada
        );

        if (!categoriaObj) {
            alert("Categoría no encontrada");
            return;
        }

        const articulo: ArticuloManufacturadoCreacion = {
            denominacion,
            descripcion,
            precioVenta,
            tiempoEstimado,
            categoria: {
                id: categoriaObj.id,
            },
            detalles: detalles.map((d) => ({
                cantidad: d.cantidad,
                insumo: {
                    id: d.insumo.id,
                },
            })),
            imagenInsumo,
        };

        try {
            await crearArticuloManufacturado(articulo);
            onCreateSuccess();
            onClose();
        } catch (error) {
            console.error("Error al crear artículo:", error);
        }
    };

    return (
        <div className="form-articulo-modal">
            <div className="form-articulo-container">
                <h2>Nuevo Artículo Manufacturado</h2>
                <form onSubmit={handleSubmit} className="form-articulo">
                    <div className="form-articulo-columnas">
                        <div className="form-articulo-columna izquierda">
                            <label className="form-articulo-label">
                                Nombre:
                                <input
                                    className="form-articulo-input"
                                    type="text"
                                    value={denominacion}
                                    onChange={(e) => setDenominacion(e.target.value)}
                                />
                            </label>

                            <label className="form-articulo-label">
                                Descripción:
                                <input
                                    className="form-articulo-input"
                                    type="text"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                            </label>

                            <label className="form-articulo-label">
                                Precio Venta:
                                <input
                                    className="form-articulo-input"
                                    type="number"
                                    value={precioVenta}
                                    onChange={(e) => setPrecioVenta(parseFloat(e.target.value))}
                                />
                            </label>

                            <label className="form-articulo-label">
                                Tiempo estimado (min):
                                <input
                                    className="form-articulo-input"
                                    type="number"
                                    value={tiempoEstimado}
                                    onChange={(e) => setTiempoEstimado(parseInt(e.target.value))}
                                />
                            </label>

                            <label className="form-articulo-label">
                                Imagen:
                                <input
                                    className="form-articulo-input"
                                    type="text"
                                    value={imagenInsumo}
                                    onChange={(e) => setImagenInsumo(e.target.value)}
                                />
                            </label>

                            <label className="form-articulo-label">
                                Categoría:
                                <input
                                    className="form-articulo-input"
                                    list="categorias"
                                    value={categoriaSeleccionada}
                                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                                />
                                <datalist id="categorias">
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.denominacion}/>
                                    ))}
                                </datalist>
                            </label>
                        </div>

                        <div className="form-articulo-columna derecha">
                            <label className="form-articulo-label">
                                Insumo:
                                <input
                                    className="form-articulo-input"
                                    list="insumos"
                                    value={insumoSeleccionado}
                                    onChange={(e) => setInsumoSeleccionado(e.target.value)}
                                />
                                <datalist id="insumos">
                                    {insumos.map((ins) => (
                                        <option key={ins.id} value={ins.denominacion}/>
                                    ))}
                                </datalist>
                            </label>

                            <label className="form-articulo-label">
                                Cantidad de insumo:
                                <input
                                    className="form-articulo-input"
                                    type="number"
                                    value={cantidadInsumo}
                                    onChange={(e) => setCantidadInsumo(parseInt(e.target.value))}
                                />
                            </label>

                            <button
                                type="button"
                                onClick={agregarInsumo}
                                className="form-articulo-button"
                            >
                                Añadir Insumo
                            </button>

                            <div className="form-articulo-insumos">
                                <h4>Insumos añadidos:</h4>
                                <ul>
                                    {detalles.map((d, index) => (
                                        <li key={index}>
                                            {d.insumo.denominacion} - {d.cantidad}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="form-articulo-acciones">
                        <button
                            type="button"
                            onClick={onClose}
                            className="form-articulo-button form-articulo-cancelar"
                        >
                            Cancelar
                        </button>

                        <button type="submit" className="form-articulo-button">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
