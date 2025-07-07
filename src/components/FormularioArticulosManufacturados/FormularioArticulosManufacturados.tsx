import React, { useEffect, useState } from "react";
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
  const [imagenArticuloManofacturado, setImagenArticuloManofacturado] =
    useState("");

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

  useEffect(() => {
    async function cargarDatos() {
      const categorias = await obtenerCategorias();
      const insumos = await getArticulosInsumo();
      setCategorias(categorias);
      setInsumos(insumos);
    }

    void cargarDatos();
  }, []);

  useEffect(() => {
    if (articuloParaEditar) {
      setDenominacion(articuloParaEditar.denominacion);
      setDescripcion(articuloParaEditar.descripcion);
      setPrecioVenta(articuloParaEditar.precioVenta);
      setTiempoEstimado(articuloParaEditar.tiempoEstimado);
      setImagenArticuloManofacturado(
        articuloParaEditar.imagenArticuloManofacturado || ""
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

  const agregarInsumo = () => {
    const insumoObj = insumos.find(
      (ins) => ins.denominacion === insumoSeleccionado
    );

    if (!insumoObj) {
      alert("Insumo no encontrado");
      return;
    }

    setDetalles([...detalles, { insumo: insumoObj, cantidad: cantidadInsumo }]);

    setInsumoSeleccionado("");
    setCantidadInsumo(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormularioValidado(true);

    // * no envia el formulario si falta algo obligatorio
    if (
      !denominacion.trim() ||
      !descripcion.trim() ||
      !categoriaSeleccionada.trim() ||
      !imagenArticuloManofacturado.trim()
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
      imagenes: [
        {
          denominacion: imagenArticuloManofacturado.split("/").pop() ?? "",
        },
      ],
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

  const eliminarInsumo = (index: number) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles.splice(index, 1);
    setDetalles(nuevosDetalles);
  };

  const handleImagenUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const nombreArchivo = await subirImagen(file);
    if (nombreArchivo) {
      const urlCompleta = `http://localhost:8080/uploads/images/${nombreArchivo}`;
      setImagenArticuloManofacturado(urlCompleta);
    }
  };

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

              <label className={styles.formArticuloLabel}>
                Categoría:
                {/* Muestra el mensaje de error si se apreto el boton de "Guardar" y si el campo esta vacio*/}
                {formularioValidado && !categoriaSeleccionada.trim() && (
                  <p className={styles.error}>Este campo es obligatorio</p>
                )}
                <div className={styles.inputConIcono}>
                  <input
                    className={styles.formArticuloInput}
                    list="categorias"
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  />
                  <datalist id="categorias">
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.denominacion} />
                    ))}
                  </datalist>
                  {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
                  {formularioValidado && !descripcion.trim() && (
                    <span className={styles.iconoInput}>❗</span>
                  )}
                </div>
              </label>

              <label className={styles.formArticuloLabel}>
                {/* Muestra el mensaje de error si se apretó "Guardar" y no hay imagen */}
                {formularioValidado && !imagenArticuloManofacturado.trim() && (
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
                    !imagenArticuloManofacturado.trim() && (
                      <span className={styles.iconoInput}>❗</span>
                    )}
                </div>
                <input
                  type="file"
                  id="imagenUpload"
                  accept="image/*"
                  onChange={handleImagenUpload}
                  style={{ display: "none" }}
                />
              </label>

              {imagenArticuloManofacturado && (
                <img
                  src={imagenArticuloManofacturado}
                  alt="Vista previa"
                  style={{ maxWidth: "200px", marginTop: "10px" }}
                />
              )}
            </div>

            <div className={styles.formArticuloColumnaDerecha}>
              <label className={styles.formArticuloLabel}>
                Insumo:
                <input
                  className={styles.formArticuloInput}
                  list="insumos"
                  value={insumoSeleccionado}
                  onChange={(e) => {
                    const seleccion = e.target.value;
                    setInsumoSeleccionado(seleccion);
                    const insumo = insumos.find(
                      (ins) => ins.denominacion === seleccion
                    );
                    if (insumo) {
                      setUnidadMedida(insumo.unidadMedida.denominacion);
                    } else {
                      setUnidadMedida("");
                    }
                  }}
                />
                <datalist id="insumos">
                  {insumos.map((ins) => (
                    <option key={ins.id} value={ins.denominacion} />
                  ))}
                </datalist>
              </label>
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
