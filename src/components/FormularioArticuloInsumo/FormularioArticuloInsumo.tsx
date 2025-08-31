import {
    crearArticuloInsumo,
    editarArticuloInsumo,
    getCategoriasArticuloInsumo,
    getUnidadesDeMedida,
    subirImagen,
} from "../../services/ingredientesService.ts";
import React, {useEffect, useState} from "react";
import type {CategoriaArticulo} from "../../models/categoriaArticulo.ts";
import type {UnidadMedida} from "../../models/unidadMedida.ts";
import type {ArticuloInsumo, ArticuloInsumoCreacion} from "../../models/articuloInsumo.ts";
import styles from "./FormularioArticuloInsumo.module.css";
import baseFormulario from "../../css/baseFormulario.module.css";

export const FormularioArticulosInsumo = ({
                                              onClose,
                                              articuloParaEditar,
                                              onCreateSuccess
                                          }: {
    onClose: () => void;
    articuloParaEditar?: ArticuloInsumo | null;
    onCreateSuccess: () => void;
}) => {
    const [denominacion, setDenominacion] = useState("");
    const [precioCompra, setPrecioCompra] = useState(0);
    const [precioVenta, setPrecioVenta] = useState(0);
    const [esParaElaborar, setEsParaElaborar] = useState(false);
    const [urlImagen, setUrlImagen] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [categorias, setCategorias] = useState<CategoriaArticulo[]>([]);
    const [unidadSeleccionada, setUnidadSeleccionada] = useState("");
    const [unidades, setUnidades] = useState<UnidadMedida[]>([]);
    const [imagenArticuloInsumo, setImagenArticuloInsumo] = useState("");
    const [formularioValidado, setFormularioValidado] = useState(false);

    useEffect(() => {
        async function cargarDatos() {
            try {
                const categoriasObtenidas = await getCategoriasArticuloInsumo();
                setCategorias(categoriasObtenidas);

                const unidadesObtenidas = await getUnidadesDeMedida();
                setUnidades(unidadesObtenidas);

                if (articuloParaEditar) {
                    setDenominacion(articuloParaEditar.denominacion);
                    setPrecioCompra(articuloParaEditar.precioCompra);
                    setPrecioVenta(articuloParaEditar.precioVenta);
                    setEsParaElaborar(articuloParaEditar.esParaElaborar);

                    if (articuloParaEditar.nombreImagen) {
                        const url = `http://localhost:8080/uploads/images/${articuloParaEditar.nombreImagen}`;
                        setUrlImagen(url);
                        setImagenArticuloInsumo(url);
                    }
                    if (articuloParaEditar.categorias.length > 0) {
                        setCategoriaSeleccionada(articuloParaEditar.categorias[0]);
                    }

                    setUnidadSeleccionada(articuloParaEditar.nombreUnidadMedida);
                }
            } catch (error) {
                console.error("Error al cargar los artículos o unidades:", error);
            }
        }

        void cargarDatos();
    }, [articuloParaEditar]);
    //

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setFormularioValidado(true);

        if (
            !denominacion.trim() ||
            !categoriaSeleccionada ||
            !imagenArticuloInsumo ||
            !precioCompra ||
            !precioVenta ||
            !unidadSeleccionada
        ) {
            return;
        }


        const nuevaCategoria = categorias.find(
            (categoria) => categoria.denominacion === categoriaSeleccionada
        );

        const nuevaUnidad = unidades.find(
            (unidad) => unidad.denominacion === unidadSeleccionada
        )

        if (!nuevaCategoria || !nuevaUnidad) {
            console.error("No se encontro la categoria o unidad seleccionada");
            return;
        }

        const nuevoArticulo: ArticuloInsumoCreacion = {
            id: articuloParaEditar?.id,
            denominacion,
            precioCompra,
            precioVenta,
            esParaElaborar,
            categoriaArticuloInsumo: {id: nuevaCategoria.id},
            unidadMedida: {id: nuevaUnidad.id},
            imagenInsumo: {
                denominacion: String(imagenArticuloInsumo.split("/").pop() ?? null),
            },
        };

        try {
            if (articuloParaEditar) {
                console.log(nuevoArticulo);
                await editarArticuloInsumo(nuevoArticulo);
            } else {
                await crearArticuloInsumo(nuevoArticulo);
            }

            console.log("aca 1")
            onCreateSuccess();
            console.log("aca 2")
            onClose();

        } catch (error) {
            console.error("Error al guardar el artículo:", error);
        }
    };

    const handleImagenUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const nombreArchivo = await subirImagen(file);
        if (nombreArchivo) {
            const urlCompleta = `http://localhost:8080/uploads/images/${nombreArchivo}`;
            setImagenArticuloInsumo(urlCompleta);
        }
    };

    return (
        <div className={baseFormulario.divContenedor}>
            <div className={baseFormulario.formulario}>
                <h2 className={baseFormulario.titulo}>Nuevo Articulo Insumo</h2>
                <form onSubmit={handleSubmit}>
                    <label className={baseFormulario.formArticuloLabel}>Nombre:</label>

                    {/* Muestra el mensaje de error si se apreto el boton de "Guardar" y si el campo esta vacio*/}
                    {formularioValidado && !denominacion.trim() && (
                        <p className={baseFormulario.error}>Este campo es obligatorio</p>
                    )}
                    <div className={baseFormulario.inputConIcono}>
                        <input
                            type="text"
                            placeholder="Nombre del producto"
                            value={denominacion}
                            onChange={(e) => setDenominacion(e.target.value)}
                        />
                        {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
                        {formularioValidado && !denominacion.trim() && (
                            <span className={baseFormulario.iconoInput}>❗</span>
                        )}
                    </div>

                    <label className={baseFormulario.formArticuloLabel}>Precio de compra:</label>

                    {/* Muestra el mensaje de error si se apreto el boton de "Guardar" y si el campo esta vacio*/}
                    {formularioValidado && !precioCompra && (
                        <p className={baseFormulario.error}>Este campo es obligatorio</p>
                    )}
                    <div className={baseFormulario.inputConIcono}>
                        <input
                            type="number"
                            placeholder="Precio Compra"
                            value={precioCompra}
                            onChange={(e) => setPrecioCompra(Number(e.target.value) || 0)}
                        />
                        {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
                        {formularioValidado && !precioCompra && (
                            <span className={baseFormulario.iconoInput}>❗</span>
                        )}
                    </div>

                    <label className={baseFormulario.formArticuloLabel}>Precio de venta:</label>

                    {/* Muestra el mensaje de error si se apreto el boton de "Guardar" y si el campo esta vacio*/}
                    {formularioValidado && !precioVenta && (
                        <p className={baseFormulario.error}>Este campo es obligatorio</p>
                    )}
                    <div className={baseFormulario.inputConIcono}>
                        <input
                            type="number"
                            placeholder="Precio Venta"
                            value={precioVenta}
                            onChange={(e) => setPrecioVenta(parseFloat(e.target.value))}
                        />
                        {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
                        {formularioValidado && !precioVenta && (
                            <span className={baseFormulario.iconoInput}>❗</span>
                        )}
                    </div>

                    <div className={styles.checkboxWrapper}>
                        <label>
                            <input
                                type="checkbox"
                                checked={esParaElaborar}
                                onChange={(e) => setEsParaElaborar(e.target.checked)}
                            />
                            ¿Es para elaborar?
                        </label>
                    </div>

                    <label className={baseFormulario.formArticuloLabel}>
                        Lista de categorias:
                    </label>

                    {/* Muestra el mensaje de error si se apreto el boton de "Guardar" y si el campo esta vacio*/}
                    {formularioValidado && !categoriaSeleccionada.trim() && (
                        <p className={baseFormulario.error}>Este campo es obligatorio</p>
                    )}
                    <div className={baseFormulario.inputConIcono}>
                        <input
                            list="lista-categorias"
                            value={categoriaSeleccionada}
                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                            placeholder="Selecciona una categoría"
                        />
                        <datalist id="lista-categorias">
                            {categorias.map((cat) => (
                                <option key={cat.id} value={cat.denominacion}/>
                            ))}
                        </datalist>

                        {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
                        {formularioValidado && !categoriaSeleccionada.trim() && (
                            <span className={baseFormulario.iconoInput}>❗</span>
                        )}
                    </div>

                    <label className={baseFormulario.formArticuloLabel}>Lista de unidades:</label>

                    {/* Muestra el mensaje de error si se apreto el boton de "Guardar" y si el campo esta vacio*/}
                    {formularioValidado && !unidadSeleccionada.trim() && (
                        <p className={baseFormulario.error}>Este campo es obligatorio</p>
                    )}
                    <div className={baseFormulario.inputConIcono}>
                        <input
                            list="lista-unidades"
                            value={unidadSeleccionada}
                            onChange={(e) => setUnidadSeleccionada(e.target.value)}
                            placeholder="Selecciona una unidad"
                        />
                        <datalist id="lista-unidades">
                            {unidades.map((uni) => (
                                <option key={uni.id} value={uni.denominacion}/>
                            ))}
                        </datalist>

                        {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
                        {formularioValidado && !unidadSeleccionada.trim() && (
                            <span className={baseFormulario.iconoInput}>❗</span>
                        )}
                    </div>

                    <label className={baseFormulario.formArticuloLabel}>
                        {/* Muestra el mensaje de error si se apretó "Guardar" y no hay imagen */}
                        {formularioValidado && !imagenArticuloInsumo.trim() && (
                            <p className={baseFormulario.error}>Este campo es obligatorio</p>
                        )}
                        <div className={baseFormulario.inputConIcono}>
                            <label
                                htmlFor="imagenUpload"
                                className={`${baseFormulario.botonGuardar} ${baseFormulario.boton}`}
                            >
                                Subir Imagen
                            </label>

                            {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
                            {formularioValidado && !imagenArticuloInsumo.trim() && (
                                <span className={baseFormulario.iconoInput}>❗</span>
                            )}
                        </div>
                        <input
                            type="file"
                            id="imagenUpload"
                            accept="image/*"
                            onChange={handleImagenUpload}
                            style={{display: "none"}}
                        />
                    </label>

                    {imagenArticuloInsumo && (
                        <img
                            src={imagenArticuloInsumo}
                            alt="Vista previa"
                            style={{
                                maxWidth: "200px",
                                marginTop: "0px",
                                maxHeight: "150px",
                            }}
                        />
                    )}

                    <div className={baseFormulario.botones}>
                        <button
                            className={`${baseFormulario.boton} ${baseFormulario.botonCancelar}`}
                            type="button"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className={`${baseFormulario.boton} ${baseFormulario.botonGuardar}`}
                            type="submit"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
