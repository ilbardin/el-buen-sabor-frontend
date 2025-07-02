import { useEffect, useState } from "react";
import {
  eliminarArticuloManufacturado,
  getArticulosManufacturados,
} from "../../services/articuloManufacturadoService.ts";
import type { ArticuloManufacturado } from "../../models/articuloManufacturado.ts";
import FormularioArticulosManufacturados from "../../components/FormularioArticulosManufacturados/FormularioArticulosManufacturados.tsx";
import { showConfirm } from "../../utils/alerts.ts";
import { AgregarCategoriaArticuloManufacturado } from "../../components/AgregarCategoriaArticuloManufacturado/AgregarCategoriaArticuloManufacturado.tsx";
import styles from "./ProductosABM.module.css";

export const ProductosABM = () => {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [articuloParaEditar, setArticuloParaEditar] = useState<ArticuloManufacturado | null>(null);

  const cargarArticulosManofacturados = async () => {
    try {
      const articulos = await getArticulosManufacturados();
      setArticulos(articulos);
    } catch (error) {
      console.error("Error al cargar los artículos manufacturados:", error);
    }
  };

  useEffect(() => {
    void cargarArticulosManofacturados();
  }, []);

  async function handleEliminar(id: number) {
    try {
      const confirmacion = await showConfirm(
        "Confirmación",
        "¿Está seguro de que desea eliminar el producto?"
      );

      if (confirmacion) {
        await eliminarArticuloManufacturado(id);
        setArticulos(articulos.filter((articulo) => articulo.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
    }
  }

  return (
    <div>
      {mostrarModal && (
        <FormularioArticulosManufacturados
          onClose={() => {
            setMostrarModal(false);
            setArticuloParaEditar(null);
          }}
          onCreateSuccess={cargarArticulosManofacturados}
          articuloParaEditar={articuloParaEditar}
        />
      )}
      {mostrarModalCategoria && (
        <AgregarCategoriaArticuloManufacturado
          onClose={() => setMostrarModalCategoria(false)}
        />
      )}

      <div className={styles.container}>
        <h1 className={styles.h1}>Productos Manufacturados</h1>

        <div className={styles.botonesContainer}>
          <button
            className={styles.boton}
            onClick={() => setMostrarModal(true)}
          >
            Añadir nuevo Producto
          </button>

          <button
            className={`${styles.boton} ${styles.botonSecundario}`}
            onClick={() => setMostrarModalCategoria(true)}
          >
            Añadir nueva Categoria
          </button>
        </div>

        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>descripcion</th>
              <th>Tiempo estimadio</th>
              <th>Precio Costo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((articulo) => (
              <tr key={articulo.id}>
                <td>{articulo.denominacion}</td>
                <td>{articulo.descripcion}</td>
                <td>{articulo.tiempoEstimado}</td>
                <td>{articulo.precioCosto}</td>
                <td>{articulo.estaActivo ? "Activo" : "Inactivo"}</td>
                <td>
                  <div className={styles.accionesBotones}>
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
    </div>
  );
};
