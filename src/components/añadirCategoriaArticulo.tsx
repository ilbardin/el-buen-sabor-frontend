import {
  crearCategoriaArticulo,
  obtenerCategorias,
} from "../services/ingredientesService";
import { useState, useEffect } from "react";

export default function AñadirCategoriaArticulo({
  onClose,
}: {
  onClose: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    async function cargarCategorias() {
      try {
        const categoriasObtenidas = await obtenerCategorias(); // Asegúrate de que sea array de strings
        setCategorias(categoriasObtenidas);
      } catch (error) {
        console.error("Error al cargar los artículos:", error);
      }
    }
    cargarCategorias();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const categoriaObj = categorias.find(
        (cat) => cat.denominacion === categoriaSeleccionada
      );
      if (!categoriaObj) {
        console.error("Categoría no encontrada");
        return;
      }

      await crearCategoriaArticulo(nombre, categoriaObj.id);
      onClose();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "400px",
        }}
      >
        <h2>Nuevo Producto</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              list="lista-categorias"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              placeholder="Selecciona una categoría"
            />
            <datalist id="lista-categorias">
              {categorias.map((cat, index) => (
                <option key={index} value={cat.denominacion} />
              ))}
            </datalist>

            <input
              type="text"
              name="nombre"
              placeholder="Nombre del producto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
