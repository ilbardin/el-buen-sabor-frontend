import {
  crearArticuloInsumo,
  getCategoriasArticuloInsumo,
  editarArticuloInsumo,
  getUnidadesDeMedida,
  subirImagen,
} from "../../services/ingredientesService.ts";
import React, { useEffect, useState } from "react";
import type { CategoriaArticulo } from "../../models/categoriaArticulo.ts";
import type { UnidadMedida } from "../../models/unidadMedida.ts";
import type { ArticuloInsumo } from "../../models/articuloInsumo.ts";
import styles from "./FormularioArticuloInsumo.module.css";

export const FormularioArticulosInsumo = ({
  onClose,
  articuloParaEditar,
}: {
  onClose: () => void;
  articuloParaEditar?: ArticuloInsumo;
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
      } catch (error) {
        console.error("Error al cargar los artículos o unidades:", error);
      }
    }

    void cargarDatos();
  }, []);

  // Si se pasa un artículo a editar, se cargan sus datos en el formulario
  useEffect(() => {
    if (articuloParaEditar) {
      setDenominacion(articuloParaEditar.denominacion);
      setPrecioCompra(articuloParaEditar.precioCompra);
      setPrecioVenta(articuloParaEditar.precioVenta);
      setEsParaElaborar(articuloParaEditar.esParaElaborar);
      setUrlImagen(articuloParaEditar.imagenInsumo?.url ?? "");
      setCategoriaSeleccionada(
        articuloParaEditar.categoria
      );
      setUnidadSeleccionada(articuloParaEditar.unidadMedida.denominacion);
    }
  }, [articuloParaEditar]);
  //

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormularioValidado(true);

    // * no envia el formulario si falta algo obligatorio
    if (
      !denominacion.trim() ||
      !categoriaSeleccionada.trim() ||
      !imagenArticuloInsumo.trim() ||
      !precioCompra ||
      !precioVenta ||
      !unidadSeleccionada.trim()
    ) {
      //.trim() para evitar espacios en blanco
      return;
    }

    const categoriaObj = categorias.find(
      (cat) => cat.denominacion === categoriaSeleccionada
    );

    const unidadObj = unidades.find(
      (uni) => uni.denominacion === unidadSeleccionada
    );

    //Eliminar
    if (!categoriaObj || !unidadObj) {
      alert("Categoría o unidad no encontrada");
      return;
    }
    //

    const articuloInsumo = {
      estaActivo: true,
      fechaAlta: null,
      fechaBaja: null,
      denominacion,
      precioCompra,
      precioVenta,
      esParaElaborar,
      categoriaArticulo: {
        id: categoriaObj.id,
      },
      unidadMedida: {
        id: unidadObj.id,
      },
      imagenInsumo: {
        denominacion: imagenArticuloInsumo.split("/").pop() ?? "",
      },
    };

    try {
      if (articuloParaEditar) {
        const articuloActualizado = {
          ...articuloParaEditar,
          denominacion,
          precioCompra,
          precioVenta,
          esParaElaborar,
          categoriaArticulo: {
            id: categoriaObj.id,
          },
          unidadMedida: {
            id: unidadObj.id,
          },
          imagenInsumo: {
            url: urlImagen,
          },
        };
        await editarArticuloInsumo(articuloActualizado);
      } else {
        await crearArticuloInsumo(articuloInsumo);
      }
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
    <div className={styles.divContenedor}>
      <div className={styles.formulario}>
        <h2 style={{ marginTop: "0px" }}>Nuevo Articulo Insumo</h2>
        <form onSubmit={handleSubmit}>
          <label className={styles.formArticuloLabel}>Nombre:</label>

          {/* Muestra el mensaje de error si se apreto el boton de "Guardar" y si el campo esta vacio*/}
          {formularioValidado && !denominacion.trim() && (
            <p className={styles.error}>Este campo es obligatorio</p>
          )}
          <div className={styles.inputConIcono}>
            <input
              type="text"
              placeholder="Nombre del producto"
              value={denominacion}
              onChange={(e) => setDenominacion(e.target.value)}
            />
            {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
            {formularioValidado && !denominacion.trim() && (
              <span className={styles.iconoInput}>❗</span>
            )}
          </div>

          <label className={styles.formArticuloLabel}>Precio de compra:</label>

          {/* Muestra el mensaje de error si se apreto el boton de "Guardar" y si el campo esta vacio*/}
          {formularioValidado && !precioCompra && (
            <p className={styles.error}>Este campo es obligatorio</p>
          )}
          <div className={styles.inputConIcono}>
            <input
              type="number"
              placeholder="Precio Compra"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(parseFloat(e.target.value))}
            />
            {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
            {formularioValidado && !precioCompra && (
              <span className={styles.iconoInput}>❗</span>
            )}
          </div>

          <label className={styles.formArticuloLabel}>Precio de venta:</label>

          {/* Muestra el mensaje de error si se apreto el boton de "Guardar" y si el campo esta vacio*/}
          {formularioValidado && !precioVenta && (
            <p className={styles.error}>Este campo es obligatorio</p>
          )}
          <div className={styles.inputConIcono}>
            <input
              type="number"
              placeholder="Precio Venta"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(parseFloat(e.target.value))}
            />
            {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
            {formularioValidado && !precioVenta && (
              <span className={styles.iconoInput}>❗</span>
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

          <label className={styles.formArticuloLabel}>
            Lista de categorias:
          </label>

          {/* Muestra el mensaje de error si se apreto el boton de "Guardar" y si el campo esta vacio*/}
          {formularioValidado && !categoriaSeleccionada.trim() && (
            <p className={styles.error}>Este campo es obligatorio</p>
          )}
          <div className={styles.inputConIcono}>
            <input
              list="lista-categorias"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              placeholder="Selecciona una categoría"
            />
            <datalist id="lista-categorias">
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.denominacion} />
              ))}
            </datalist>

            {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
            {formularioValidado && !categoriaSeleccionada.trim() && (
              <span className={styles.iconoInput}>❗</span>
            )}
          </div>

          <label className={styles.formArticuloLabel}>Lista de unidades:</label>

          {/* Muestra el mensaje de error si se apreto el boton de "Guardar" y si el campo esta vacio*/}
          {formularioValidado && !unidadSeleccionada.trim() && (
            <p className={styles.error}>Este campo es obligatorio</p>
          )}
          <div className={styles.inputConIcono}>
            <input
              list="lista-unidades"
              value={unidadSeleccionada}
              onChange={(e) => setUnidadSeleccionada(e.target.value)}
              placeholder="Selecciona una unidad"
            />
            <datalist id="lista-unidades">
              {unidades.map((uni) => (
                <option key={uni.id} value={uni.denominacion} />
              ))}
            </datalist>

            {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
            {formularioValidado && !unidadSeleccionada.trim() && (
              <span className={styles.iconoInput}>❗</span>
            )}
          </div>

          <label className={styles.formArticuloLabel}>
            {/* Muestra el mensaje de error si se apretó "Guardar" y no hay imagen */}
            {formularioValidado && !imagenArticuloInsumo.trim() && (
              <p className={styles.error}>Este campo es obligatorio</p>
            )}
            <div className={styles.inputConIcono}>
              <label
                htmlFor="imagenUpload"
                className={`${styles.botonGuardar} ${styles.boton} ${styles.botonConMargenInferior}`}
              >
                Subir Imagen
              </label>

              {/* Muestra el icono de advertencia si no se apreto el boton de "Guardar" y el Campo esta vacio */}
              {formularioValidado && !imagenArticuloInsumo.trim() && (
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

          <div className={styles.botones}>
            <button
              className={`${styles.boton} ${styles.botonCancelar}`}
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className={`${styles.boton} ${styles.botonGuardar}`}
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
