import { useEffect, useState } from "react";
import {
  eliminarArticuloInsumo,
  getArticulosInsumo,
} from "../../services/ingredientesService.ts";
import type { ArticuloInsumo } from "../../models/articuloInsumo.ts";
import { FormularioArticulosInsumo } from "../../components/FormularioArticuloInsumo/FormularioArticuloInsumo.tsx";
import { AgregarCategoriaArticulo } from "../../components/AgregarCategoriaArticulo/AgregarCategoriaArticulo.tsx";
import styles from "./IngredientesABM.module.css";
import { showConfirm } from "../../utils/alerts.ts";

export const IngredientesABM = () => {
  const [articulos, setArticulos] = useState<ArticuloInsumo[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [articuloParaEditar, setArticuloParaEditar] =
    useState<ArticuloInsumo | null>(null);

  const cargarArticulosInsumo = async () => {
    try {
      const articulos = await getArticulosInsumo();
      console.log("articulos:", articulos);
      setArticulos(articulos);
    } catch (error) {
      console.error("Error al cargar los artículos:", error);
    }
  };

  useEffect(() => {
    void cargarArticulosInsumo();
  }, []);

  async function handleEliminar(id: number) {
    try {
      const confirmacion = await showConfirm(
        "Confirmación",
        "¿Está seguro de que desea eliminar el producto?"
      );

      if (confirmacion) {
        await eliminarArticuloInsumo(id);
        setArticulos(articulos.filter((articulo) => articulo.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
    }
  }

  return (
    <div className={styles.container}>
      {mostrarModal && (
        <FormularioArticulosInsumo
          onClose={async () => {
            setMostrarModal(false);
            setArticuloParaEditar(null);
            await cargarArticulosInsumo();
          }}
          articuloParaEditar={articuloParaEditar}
        />
      )}
      {mostrarModalCategoria && (
        <AgregarCategoriaArticulo
          onClose={() => setMostrarModalCategoria(false)}
        />
      )}

      <h1 className={styles.titulo}>Insumos</h1>

      <div className={styles.botonesContainer}>
        <button
          className={styles.boton}
          onClick={() => {
            setMostrarModal(true);
            setArticuloParaEditar(null);
          }}
        >
          Añadir nuevo Insumo
        </button>
        <button
          className={`${styles.boton} ${styles.botonSecundario}`}
          onClick={() => setMostrarModalCategoria(true)}
        >
          Añadir nueva Categoría
        </button>
      </div>

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rubro</th>
            <th>Precio Compra</th>
            <th>Precio Venta</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((articulo) => (
            <tr key={articulo.id}>
              <td>{articulo.denominacion}</td>
              <td>{articulo.categoriaArticulo.denominacion}</td>
              <td>{articulo.precioCompra}</td>
              <td>{articulo.precioVenta}</td>
              <td>
                {articulo.imagenInsumo &&
                articulo.imagenInsumo.denominacion?.trim()?.length > 0 ? (
                  <img
                    src={`http://localhost:8080/uploads/images/${articulo.imagenInsumo.denominacion}`}
                    alt="Producto"
                    style={{ width: "80px", height: "auto", maxHeight: "80px" }}
                  />
                ) : (
                  "Sin imagen"
                )}
              </td>

              <td>
                <div className={styles.acciones}>
                  <button
                    className={`${styles.boton} ${styles.botonSecundario}`}
                    onClick={() => {
                      setArticuloParaEditar(articulo);
                      setMostrarModal(true);
                    }}
                  >
                    Modificar
                  </button>
                  <button
                    className={styles.boton}
                    onClick={async () => {
                      if (articulo.id !== undefined) {
                        await handleEliminar(articulo.id);
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
