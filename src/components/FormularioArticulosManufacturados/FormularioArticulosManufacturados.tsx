import React, { useEffect, useState, useRef } from "react";
import { MdAttachMoney } from "react-icons/md";
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
import baseFormulario from "../../css/baseFormulario.module.css";
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
  const [precioSugerido, setPreciSugerido] = useState<number>(0);
  const [usarPrecioSugerido, setUsarPrecioSugerido] = useState(false);

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
  const eliminarInsumo = (index: number, id: number, cantidad: number) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles.splice(index, 1);
    setDetalles(nuevosDetalles);
    const insumo = insumos.find((ins) => ins.id === id);
    if (insumo?.precioCompra) {
      const precio = precioSugerido - insumo?.precioCompra * cantidad * 4;
      setPreciSugerido(precio);
    }
  };

  const agregarInsumo = () => {
    const insumo = insumos.find(
      (ins) => ins.denominacion === insumoSeleccionado
    );

    if (insumo?.precioCompra) {
      const precio = precioSugerido + insumo?.precioCompra * cantidadInsumo * 4;
      setPreciSugerido(precio);
      console.log(precio);
    }

    if (!insumo) {
      alert("Insumo no encontrado");
      return;
    }

    setDetalles([...detalles, { insumo: insumo, cantidad: cantidadInsumo }]);

    setInsumoSeleccionado("");
    setCantidadInsumo(0);
  };
  /* #endregion */

  //! MANEJO DE IMAGENES
  /* #region*/

  const handleImagenUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const urls: string[] = [];

    for (const file of files) {
      const nombreArchivo = await subirImagen(file);
      if (nombreArchivo) {
        urls.push(`http://localhost:8080/uploads/images/${nombreArchivo}`);
      }
    }
    setImagenesArticuloManofacturado((prev) => [...prev, ...urls]);
    e.target.value = "";
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
    <div className={baseFormulario.divContenedor}>
      <div className={baseFormulario.formulario} style={{ width: "900px" }}>
        <h2 className={baseFormulario.tituloFormulario}>
          {articuloParaEditar ? "Modificar" : "Nuevo"} Artículo Manufacturado
        </h2>
        <form onSubmit={handleSubmit} className={styles.formArticulo}>
          <div className={styles.formArticuloColumnas}>
            <div className={styles.formArticuloColumnaIzquierda}>
              <label className={baseFormulario.formLabel}>
                Nombre:
                {formularioValidado && !denominacion.trim() && (
                  <p className={baseFormulario.error}>
                    Este campo es obligatorio
                  </p>
                )}
                <div className={baseFormulario.inputConIcono}>
                  <input
                    className={baseFormulario.formInput}
                    type="text"
                    value={denominacion}
                    onChange={(e) => setDenominacion(e.target.value)}
                  />

                  {formularioValidado && !denominacion.trim() && (
                    <span className={baseFormulario.iconoInput}>❗</span>
                  )}
                </div>
              </label>

              <label className={baseFormulario.formLabel}>
                Descripción:
                {formularioValidado && !descripcion.trim() && (
                  <p className={baseFormulario.error}>
                    Este campo es obligatorio
                  </p>
                )}
                <div className={baseFormulario.inputConIcono}>
                  <input
                    className={baseFormulario.formInput}
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                  {formularioValidado && !descripcion.trim() && (
                    <span className={baseFormulario.iconoInput}>❗</span>
                  )}
                </div>
              </label>

              <div>
                <label className={baseFormulario.formLabel}>
                  Precio Venta:
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <MdAttachMoney style={{ height: "40px", width: "40px" }} />
                    <input
                    
                      className={baseFormulario.formInput}
                      type="number"
                      value={usarPrecioSugerido ? precioSugerido : precioVenta}
                      onChange={(e) =>
                        setPrecioVenta(parseFloat(e.target.value))
                      }
                      disabled={usarPrecioSugerido} 
                    />
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={usarPrecioSugerido}
                        onChange={(e) => {
                          setUsarPrecioSugerido(e.target.checked);
                          if (e.target.checked) {
                            setPrecioVenta(precioSugerido); 
                          }
                        }}
                      />
                      Usar precio sugerido
                    </label>
                  </div>
                </label>
              </div>

              <label className={baseFormulario.formLabel}>
                Tiempo estimado (min):
                <input
                  className={baseFormulario.formInput}
                  type="number"
                  value={tiempoEstimado}
                  onChange={(e) => setTiempoEstimado(parseInt(e.target.value))}
                />
              </label>

              <div className={baseFormulario.formLabel}>
                Categoría:
                {formularioValidado && !categoriaSeleccionada.trim() && (
                  <p className={baseFormulario.error}>
                    Este campo es obligatorio
                  </p>
                )}
                <div className={baseFormulario.inputConIcono}>
                  <div
                    className={baseFormulario.autocompleteWrapper}
                    ref={refCategoria}
                  >
                    <input
                      className={baseFormulario.formInput}
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
                      <ul className={baseFormulario.sugerenciasLista}>
                        {categorias
                          .filter((cat) =>
                            cat.denominacion
                              .toLowerCase()
                              .includes(categoriaSeleccionada?.toLowerCase())
                          )
                          .slice(0, 5)
                          .map((cat) => (
                            <li
                              key={cat.id}
                              className={baseFormulario.sugerenciaItem}
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
                  {formularioValidado && !categoriaSeleccionada.trim() && (
                    <span className={baseFormulario.iconoInput}>❗</span>
                  )}
                </div>
              </div>

              <label className={baseFormulario.formLabel}>
                {formularioValidado &&
                  imagenesArticuloManofacturado.length === 0 && (
                    <p className={baseFormulario.error}>
                      Este campo es obligatorio
                    </p>
                  )}
                <div className={baseFormulario.inputConIcono}>
                  <label
                    htmlFor="imagenUpload"
                    className={`${baseFormulario.botonGuardar} ${baseFormulario.boton}`}
                  >
                    Subir Imagen
                  </label>

                  {formularioValidado &&
                    imagenesArticuloManofacturado.length === 0 && (
                      <span className={baseFormulario.iconoInput}>❗</span>
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
                <div className={baseFormulario.divImagenes}>
                  {imagenesArticuloManofacturado.map((url, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      <img
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        className={baseFormulario.imagen}
                      />
                      <button
                        type="button"
                        onClick={() => eliminarImagen(index)}
                        className={baseFormulario.botonEliminarImagen}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.formArticuloColumnaDerecha}>
              <div className={baseFormulario.formLabel}>
                Insumo:
                <div
                  className={baseFormulario.autocompleteWrapper}
                  ref={refInsumo}
                >
                  <input
                    className={baseFormulario.formInput}
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
                    <ul className={baseFormulario.sugerenciasLista}>
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
                            className={baseFormulario.sugerenciaItem}
                            onClick={() => {
                              setInsumoSeleccionado(ins.denominacion);
                              setUnidadMedida(ins.nombreUnidadMedida);
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
                <label className={baseFormulario.formLabel}>
                  Cantidad de insumo:
                </label>
                <div className={styles.formArticuloCantidadInputGroup}>
                  <input
                    className={baseFormulario.formInput}
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
                className={`${baseFormulario.botonGuardar} ${baseFormulario.boton}`}
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
                        {d.cantidad} {d.insumo.nombreUnidadMedida}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          eliminarInsumo(index, d.insumo.id, d.cantidad)
                        }
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
              className={`${baseFormulario.botonCancelar} ${baseFormulario.boton}`}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={`${baseFormulario.botonGuardar} ${baseFormulario.boton}`}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
