import React, { useEffect, useState, useRef } from "react";
import {
  crearArticuloManufacturado,
  obtenerCategorias,
  editarArticuloManufacturado,
  subirImagen,
} from "../../services/articuloManufacturadoService.ts";
import type {
  ArticuloManufacturadoCreacion,
  ArticuloManufacturado,
} from "../../models/articuloManufacturado.ts";
import { getArticulosInsumo } from "../../services/ingredientesService.ts";
import styles from "./FormularioArticulosManufacturados.module.css";
import type { CategoriaArticuloManufacturado } from "../../models/categoriaArticuloManufacturado.ts";
import type { ArticuloInsumo } from "../../models/articuloInsumo.ts";

export default function FormularioArticulosManufacturados({
  onClose,
  onCreateSuccess,
  articuloParaEditar,
}: {
  onClose: () => void;
  onCreateSuccess: () => void;
  articuloParaEditar?: ArticuloManufacturado | null;
}) {

  const [denominacion, setDenominacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioVenta, setPrecioVenta] = useState(0);
  const [tiempoEstimado, setTiempoEstimado] = useState(0);
  const [imagenesArticuloManofacturado, setImagenesArticuloManofacturado] =
    useState<string[]>([]);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [categorias, setCategorias] = useState<
    CategoriaArticuloManufacturado[]
  >([]);

  const [insumoSeleccionado, setInsumoSeleccionado] = useState("");
  const [cantidadInsumo, setCantidadInsumo] = useState(0);
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [detalles, setDetalles] = useState<{ insumo: any; cantidad: number }[]>(
    []
  );
  const [unidadMedida, setUnidadMedida] = useState("");
  const [formularioValidado, setFormularioValidado] = useState(false);

  // !Carga inicial de categorías e insumos 
  useEffect(() => {
    async function cargarDatos() {
      const categorias = await obtenerCategorias();
      const insumos = await getArticulosInsumo();
      setCategorias(categorias);
      setInsumos(insumos);
    }

    void cargarDatos();
  }, []);


  // !Carga de datos del artículo a editar
  useEffect(() => {
    if (articuloParaEditar) {
      setDenominacion(articuloParaEditar.denominacion);
      setDescripcion(articuloParaEditar.descripcion);
      setPrecioVenta(articuloParaEditar.precioVenta);
      setTiempoEstimado(articuloParaEditar.tiempoEstimado);
      setImagenesArticuloManofacturado(
        articuloParaEditar.imagenesArticuloManofacturado || ""
      );
      setCategoriaSeleccionada(articuloParaEditar.categoria.denominacion);
      setDetalles(
        articuloParaEditar.detalles.map((d) => ({
          insumo: d.insumo,
          cantidad: d.cantidad,
        }))
      );
    }
  }, [articuloParaEditar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormularioValidado(true);

    // * no envia el formulario si falta algo obligatorio
    if (
      !denominacion.trim() ||
      !descripcion.trim() ||
      !categoriaSeleccionada.trim() ||
      imagenesArticuloManofacturado.length === 0
    ) {
      //.trim() para evitar espacios en blanco
      return;
    }

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
      imagenes: imagenesArticuloManofacturado.map((url) => ({
        denominacion: url.split("/").pop() ?? "",
      })),
    };

    try {
      if (articuloParaEditar) {
        await editarArticuloManufacturado({
          ...articulo,
          id: articuloParaEditar.id,
        });
      } else {
        await crearArticuloManufacturado(articulo);
      }

      onCreateSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar artículo:", error);
    }
  };

  //! MANEJO DE INSUMOS
  /* #region*/
  const eliminarInsumo = (index: number) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles.splice(index, 1);
    setDetalles(nuevosDetalles);
  };

  const agregarInsumo = () => {
    const insumo = insumos.find(
      (ins) => ins.denominacion === insumoSeleccionado
    );

    if (!insumo) {
      alert("Insumo no encontrado");
      return;
    }

    setDetalles([...detalles, { insumo: insumo, cantidad: cantidadInsumo }]);

    setInsumoSeleccionado(""); //Regresa el campo Insumo a Buscar insumo
    setCantidadInsumo(0);
  };
  /* #endregion */

  //! MANEJO DE IMAGENES
  /* #region*/

  const handleImagenUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (files.length === 0) return;

    const urls: string[] = [];

    for (const file of files) {
      const nombreArchivo = await subirImagen(file);
      if (nombreArchivo) {
        urls.push(`http://localhost:8080/uploads/images/${nombreArchivo}`);
      }
    }
    setImagenesArticuloManofacturado((prev) => [...prev, ...urls]);
  };

  const eliminarImagen = (index: number) => {
    const nuevasImagenes = [...imagenesArticuloManofacturado];
    nuevasImagenes.splice(index, 1);
    setImagenesArticuloManofacturado(nuevasImagenes);
  };

  /* #endregion */

  //! MANEJO DE LISTAS DESPLEGABLES
  /*#region*/

  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [mostrarSugerenciasCategorias, setMostrarSugerenciasCategorias] =
    useState(false);

  // Referencias para detectar clicks fuera de los inputs
  const refCategoria = useRef<HTMLDivElement>(null);
  const refInsumo = useRef<HTMLDivElement>(null);

  // Cierra las sugerencias al hacer click fuera del input
  useEffect(() => {
    const manejarClickFuera = (e: MouseEvent) => {
      if (
        refCategoria.current &&
        !refCategoria.current.contains(e.target as Node)
      ) {
        setMostrarSugerenciasCategorias(false);
      }

      if (refInsumo.current && !refInsumo.current.contains(e.target as Node)) {
        setMostrarSugerencias(false);
      }
    };

    // Agrega el evento de click al documento para detectar clicks fuera del input
    document.addEventListener("mousedown", manejarClickFuera);
    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
    };
  }, []);

  /*#endregion*/

  return (
    <div className={styles.formArticuloModal}>
      <div className={styles.formArticuloContainer}>
        <h2>
          {articuloParaEditar ? "Modificar" : "Nuevo"} Artículo Manufacturado
        </h2>
        <form onSubmit={handleSubmit} className={styles.formArticulo}>
          <div className={styles.formArticuloColumnas}>
            <div className={styles.formArticuloColumnaIzquierda}>
              <label className={styles.formArticuloLabel}>
                Nombre:
                {/* Muestra el mensaje de error si se apreto el boton de "Guardar" y si el campo esta vacio*/}
                {formularioValidado && !denominacion.trim() && (
                  <p className={styles.error}>Este campo es obligatorio</p>
                )}
                <div className={styles.inputConIcono}>
                  <input
                    className={styles.formArticuloInput}
                    type="text"
                    value={denominacion}
                    onChange={(e) => setDenominacion(e.target.value)}
                  />

                  {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
                  {formularioValidado && !denominacion.trim() && (
                    <span className={styles.iconoInput}>❗</span>
                  )}
                </div>
              </label>

              <label className={styles.formArticuloLabel}>
                Descripción:
                {/* Muestra el mensaje de error si se apreto el boton de "Guardar" y si el campo esta vacio*/}
                {formularioValidado && !descripcion.trim() && (
                  <p className={styles.error}>Este campo es obligatorio</p>
                )}
                <div className={styles.inputConIcono}>
                  <input
                    className={styles.formArticuloInput}
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                  {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
                  {formularioValidado && !descripcion.trim() && (
                    <span className={styles.iconoInput}>❗</span>
                  )}
                </div>
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

              <div className={styles.formArticuloLabel}>
                Categoría:
                {/* Muestra el mensaje de error si se apreto el boton de "Guardar" y si el campo esta vacio*/}
                {formularioValidado && !categoriaSeleccionada.trim() && (
                  <p className={styles.error}>Este campo es obligatorio</p>
                )}
                <div className={styles.inputConIcono}>
                  <div
                    className={styles.autocompleteWrapper}
                    ref={refCategoria}
                  >
                    <input
                      className={styles.formArticuloInput}
                      type="text"
                      placeholder="Buscar categoria"
                      value={categoriaSeleccionada}
                      onChange={(e) => {
                        const valor = e.target.value;
                        setCategoriaSeleccionada(valor);
                        setMostrarSugerenciasCategorias(true);
                      }}
                      onFocus={() => setMostrarSugerenciasCategorias(true)}
                    />

                    {mostrarSugerenciasCategorias && (
                      <ul className={styles.sugerenciasLista}>
                        {categorias
                          .filter((cat) =>
                            cat.denominacion
                              .toLowerCase()
                              .includes(categoriaSeleccionada.toLowerCase())
                          )
                          .slice(0, 5)
                          .map((cat) => (
                            <li
                              key={cat.id}
                              className={styles.sugerenciaItem}
                              onClick={() => {
                                setCategoriaSeleccionada(cat.denominacion);
                                setMostrarSugerenciasCategorias(false);
                              }}
                            >
                              {cat.denominacion}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                  {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
                  {formularioValidado && !categoriaSeleccionada.trim() && (
                    <span className={styles.iconoInput}>❗</span>
                  )}
                </div>
              </div>

              <label className={styles.formArticuloLabel}>
                {/* Muestra el mensaje de error si se apretó "Guardar" y no hay imagen */}
                {formularioValidado &&
                  imagenesArticuloManofacturado.length === 0 && (
                    <p className={styles.error}>Este campo es obligatorio</p>
                  )}
                <div className={styles.inputConIcono}>
                  <label
                    htmlFor="imagenUpload"
                    className={`${styles.formArticuloButton} ${styles.botonConMargenInferior}`}
                  >
                    Subir Imagen
                  </label>

                  {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
                  {formularioValidado &&
                    imagenesArticuloManofacturado.length === 0 && (
                      <span className={styles.iconoInput}>❗</span>
                    )}
                </div>
                <input
                  type="file"
                  id="imagenUpload"
                  accept="image/*"
                  multiple
                  onChange={handleImagenUpload}
                  style={{ display: "none" }}
                />
              </label>

              {imagenesArticuloManofacturado.length > 0 && (
                <div className={styles.divImagenesArticulo}>
                  {imagenesArticuloManofacturado.map((url, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      <img
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        className={styles.imagenArticulo}
                      />
                      <button
                        type="button"
                        onClick={() => eliminarImagen(index)}
                        className={styles.botonEliminarImagen}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.formArticuloColumnaDerecha}>
              <div className={styles.formArticuloLabel}>
                Insumo:
                <div className={styles.autocompleteWrapper} ref={refInsumo}>
                  <input
                    className={styles.formArticuloInput}
                    type="text"
                    placeholder="Buscar insumo..."
                    value={insumoSeleccionado}
                    onChange={(e) => {
                      const valor = e.target.value;
                      setInsumoSeleccionado(valor);
                      setMostrarSugerencias(true);
                    }}
                    onFocus={() => setMostrarSugerencias(true)}
                  />

                  {mostrarSugerencias && (
                    <ul className={styles.sugerenciasLista}>
                      {insumos
                        .filter((ins) =>
                          ins.denominacion
                            .toLowerCase()
                            .includes(insumoSeleccionado.toLowerCase())
                        )
                        .slice(0, 5)
                        .map((ins) => (
                          <li
                            key={ins.id}
                            className={styles.sugerenciaItem}
                            onClick={() => {
                              setInsumoSeleccionado(ins.denominacion);
                              setUnidadMedida(ins.unidadMedida.denominacion);
                              setMostrarSugerencias(false);
                            }}
                          >
                            {ins.denominacion}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className={styles.formArticuloCantidadContainer}>
                <label className={styles.formArticuloLabel}>
                  Cantidad de insumo:
                </label>
                <div className={styles.formArticuloCantidadInputGroup}>
                  <input
                    className={styles.formArticuloInput}
                    type="number"
                    value={cantidadInsumo}
                    onChange={(e) =>
                      setCantidadInsumo(parseInt(e.target.value))
                    }
                  />
                  {unidadMedida && (
                    <span className={styles.unidadMedidaLabel}>
                      {unidadMedida}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={agregarInsumo}
                className={styles.formArticuloButton}
              >
                Añadir Insumo
              </button>

              <div className={styles.formArticuloInsumos}>
                <h4>Insumos añadidos:</h4>
                <div className={styles.insumoLista}>
                  {detalles.map((d, index) => (
                    <div key={index} className={styles.insumoItem}>
                      <span className={styles.insumoNombre}>
                        {d.insumo.denominacion}
                      </span>
                      <span className={styles.insumoCantidad}>
                        {d.cantidad} {d.insumo.unidadMedida.denominacion}
                      </span>
                      <button
                        type="button"
                        onClick={() => eliminarInsumo(index)}
                        className={`${styles.formArticuloButton} ${styles.formArticuloCancelarInsumo}`}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
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
