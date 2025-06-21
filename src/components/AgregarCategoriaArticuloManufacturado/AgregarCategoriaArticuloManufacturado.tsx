import { crearCategoriaArticuloManofacturado } from "../../services/articuloManufacturadoService.ts";
import * as React from "react";
import { useState } from "react";
import styles from "./AgregarCategoriaArticuloManufacturado.module.css";

export const AgregarCategoriaArticuloManufacturado = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const [nombre, setNombre] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await crearCategoriaArticuloManofacturado(nombre);
      onClose();
    } catch (error) {
      console.error("Error al guardar la Categoria:", error);
    }
  }

  return (
    <div className={styles.divUno}>
      <div className={styles.modalContainer}>
        <h2>Nueva Categoria</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              type="text"
              name="nombre"
              placeholder="Nombre de la categoria"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className={styles.botones}>
            <button
              className={`${styles.boton} ${styles.botonCancelar}`}
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button className={styles.boton} type="submit">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
