import { useEffect, useState } from "react";
import {
  obtenerArticulosManofacturados,
  eliminarArticuloManofacturado,
} from "../services/articuloManofacturadoService";
import type { ArticuloManofacturado } from "../interfaces/articuloManofacturado";
import FormularioArticulosManofacturados from "../components/formularioArticulosManofacturados";
import AñadirCategoriaArticulosManofacturados from "../components/añadirCategoriaArticuloManofacturado";
export default function ProductosABM() {
  const [articulos, setArticulos] = useState<ArticuloManofacturado[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);

  const cargarArticulosManofacturados = async () => {
    try {
      const articulos = await obtenerArticulosManofacturados();
      setArticulos(articulos);
    } catch (error) {
      console.error("Error al cargar los artículos manufacturados:", error);
    }
  };

  useEffect(() => {
    cargarArticulosManofacturados();
  }, []);

  async function handleEliminar(id: number) {
    try {
      await eliminarArticuloManofacturado(id);
      setArticulos(articulos.filter((articulo) => articulo.id !== id));
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
    }
  }

  return (
    <div>
      {mostrarModal && (
        <FormularioArticulosManofacturados
          onClose={() => setMostrarModal(false)}
          onCreateSuccess={cargarArticulosManofacturados}
        />
      )}
      {mostrarModalCategoria && (
        <AñadirCategoriaArticulosManofacturados
          onClose={() => setMostrarModalCategoria(false)}
        />
      )}

      <h1>Productos</h1>

      <button onClick={() => setMostrarModal(true)}>
        Añadir nuevo Producto
      </button>

      <button onClick={() => setMostrarModalCategoria(true)}>
        Añadir nueva Categoria
      </button>

      <table>
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
              <td>{articulo.estaActivo ? "Esta activo" : "Dado de baja"}</td>
              <td>
                <button>Modificar</button>{" "}
                <button onClick={() => handleEliminar(articulo.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
