import React, {useEffect, useState} from "react";
import {crearArticuloManufacturado, obtenerCategorias,} from "../../services/articuloManufacturadoService.ts";
import type {ArticuloManufacturadoCreacion} from "../../models/articuloManufacturado.ts";
import {obtenerArticulos} from "../../services/ingredientesService.tsx";
import styles from './FormularioArticulosManufacturados.module.css';
import type {CategoriaArticuloManufacturado} from "../../models/categoriaArticuloManufacturado.ts";
import type {ArticuloInsumo} from "../../models/articuloInsumo.ts";

export default function FormularioArticulosManufacturados({onClose, onCreateSuccess}: {
    onClose: () => void;
    onCreateSuccess: () => void;
}) {
    const [denominacion, setDenominacion] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precioVenta, setPrecioVenta] = useState(0);
    const [tiempoEstimado, setTiempoEstimado] = useState(0);
    const [imagenInsumo, setImagenInsumo] = useState("");

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [categorias, setCategorias] = useState<CategoriaArticuloManufacturado[]>([]);

    const [insumoSeleccionado, setInsumoSeleccionado] = useState("");
    const [cantidadInsumo, setCantidadInsumo] = useState(0);
    const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
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

        void cargarDatos();
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
        <div className={styles.formArticuloModal}>
            <div className={styles.formArticuloContainer}>
                <h2>Nuevo Artículo Manufacturado</h2>
                <form onSubmit={handleSubmit} className={styles.formArticulo}>
                    <div className={styles.formArticuloColumnas}>
                        <div className={styles.formArticuloColumnaIzquierda}>
                            <label className={styles.formArticuloLabel}>
                                Nombre:
                                <input
                                    className={styles.formArticuloInput}
                                    type="text"
                                    value={denominacion}
                                    onChange={(e) => setDenominacion(e.target.value)}
                                />
                            </label>

                            <label className={styles.formArticuloLabel}>
                                Descripción:
                                <input
                                    className={styles.formArticuloInput}
                                    type="text"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                            </label>

                            <label className={styles.formArticuloLabel}>
                                Precio Venta:
                                <input
                                    className={styles.formArticuloInput}
                                    type="number"
                                    value={precioVenta}
                                    onChange={(e) => setPrecioVenta(parseFloat(e.target.value))}
                                />
                            </label>

                            <label className={styles.formArticuloLabel}>
                                Tiempo estimado (min):
                                <input
                                    className={styles.formArticuloInput}
                                    type="number"
                                    value={tiempoEstimado}
                                    onChange={(e) => setTiempoEstimado(parseInt(e.target.value))}
                                />
                            </label>

                            <label className={styles.formArticuloLabel}>
                                Imagen:
                                <input
                                    className={styles.formArticuloInput}
                                    type="text"
                                    value={imagenInsumo}
                                    onChange={(e) => setImagenInsumo(e.target.value)}
                                />
                            </label>

                            <label className={styles.formArticuloLabel}>
                                Categoría:
                                <input
                                    className={styles.formArticuloInput}
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

                        <div className={styles.formArticuloColumnaDerecha}>
                            <label className={styles.formArticuloLabel}>
                                Insumo:
                                <input
                                    className={styles.formArticuloInput}
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

                            <label className={styles.formArticuloLabel}>
                                Cantidad de insumo:
                                <input
                                    className={styles.formArticuloInput}
                                    type="number"
                                    value={cantidadInsumo}
                                    onChange={(e) => setCantidadInsumo(parseInt(e.target.value))}
                                />
                            </label>

                            <button
                                type="button"
                                onClick={agregarInsumo}
                                className={styles.formArticuloButton}
                            >
                                Añadir Insumo
                            </button>

                            <div className={styles.formArticuloInsumos}>
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

                    <div className={styles.formArticuloAcciones}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={`${styles.formArticuloButton} ${styles.formArticuloCancelar}`}
                        >
                            Cancelar
                        </button>

                        <button type="submit" className={styles.formArticuloButton}>
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}