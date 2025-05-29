import { crearCategoriaArticuloManofacturado } from "../services/articuloManofacturadoService";
import { useState } from "react";
import "../css/css.css"

export default function AñadirCategoriaArticulosManofacturados({
  onClose,
}: {
  onClose: () => void;
}) {
  const [nombre, setNombre] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // evita que se recargue la página
    try {
      await crearCategoriaArticuloManofacturado(nombre); // llamás al fetch
      onClose(); // cerrás el formulario
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
