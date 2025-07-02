import {
  crearArticuloInsumo,
  getCategoriasArticuloInsumo,
  editarArticuloInsumo,
  getUnidadesDeMedida,
} from "../../services/ingredientesService.ts";
import React, { useEffect, useState } from "react";
import type { CategoriaArticulo } from "../../models/categoriaArticulo.ts";
import type { UnidadMedida } from "../../models/unidadMedida.ts";
import type { ArticuloInsumo } from "../../models/articuloInsumo.ts"
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
      setCategoriaSeleccionada(articuloParaEditar.categoriaArticulo.denominacion);
      setUnidadSeleccionada(articuloParaEditar.unidadMedida.denominacion);
    }
  }, [articuloParaEditar]);
  // 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        url: urlImagen,
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

  return (
    <div className={styles.divContenedor}>
      <div className={styles.formulario}>
        <h2>Nuevo Producto</h2>
        <form onSubmit={handleSubmit}>
          <label className={styles.formArticuloLabel}>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre del producto"
            value={denominacion}
            onChange={(e) => setDenominacion(e.target.value)}
          />

          <label className={styles.formArticuloLabel}>Precio de compra:</label>
          <input
            type="number"
            placeholder="Precio Compra"
            value={precioCompra}
            onChange={(e) => setPrecioCompra(parseFloat(e.target.value))}
          />

          <label className={styles.formArticuloLabel}>Precio de venta:</label>
          <input
            type="number"
            placeholder="Precio Venta"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(parseFloat(e.target.value))}
          />

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

          <label className={styles.formArticuloLabel}>Lista de unidades:</label>
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

          <label className={styles.formArticuloLabel}>Imagen:</label>

          <input
            type="text"
            placeholder="URL de la imagen"
            value={urlImagen}
            onChange={(e) => setUrlImagen(e.target.value)}
          />

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
