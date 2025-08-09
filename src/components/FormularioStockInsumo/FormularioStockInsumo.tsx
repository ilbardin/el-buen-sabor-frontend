import React, { useEffect, useState } from "react";
import styles from "./FormularioStockInsumo.module.css"; // Asegúrate de que sea el path correcto
import type { StockInsumo } from "../../models/stockInsumo"; // Ajusta al path real
import { getArticulosInsumo } from "../../services/ingredientesService";
import { editarStockInsumo } from "../../services/stockInsumoService";
import type { ArticuloInsumo } from "../../models/articuloInsumo";

export function FormularioStockInsumo({ onClose }: { onClose: () => void }) {
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<string>("");
  const [cantidadMinima, setCantidadMinima] = useState<number | "">("");
  const [cantidadMaxima, setCantidadMaxima] = useState<number | "">("");
  const [cantidadActual, setCantidadActual] = useState<number | "">("");
  const [formularioValidado, setFormularioValidado] = useState(false);
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);

  async function cargarInsumos() {
    try {
      const articulos = await getArticulosInsumo();
      setInsumos(articulos);
    } catch (error) {
      console.error("Error al cargar los insumos:", error);
    }
  }

  useEffect(() => {
    void cargarInsumos();
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormularioValidado(true);

    const insumo = insumos.find(
      (i) => i.denominacion.toLowerCase() === insumoSeleccionado.toLowerCase()
    );

    if (
      !insumo ||
      cantidadMinima === "" ||
      cantidadMaxima === "" ||
      cantidadActual === ""
    ) {
      return;
    }

    console.log("Insumo seleccionado:", insumo.id);
    console.log("Insumo seleccionado:", insumo);
    const stockInsumo = {
      idInsumo: insumo.id,
      cantidadMinima: Number(cantidadMinima),
      cantidadMaxima: Number(cantidadMaxima),
      cantidadActual: Number(cantidadActual),
    };

    editarStockInsumo(stockInsumo);
    cargarInsumos();
  }

  return (
    <div>
      <div className={styles.divContenedor}>
        <div className={styles.formulario}>
          <h2 style={{ marginTop: "0px" }}>Nuevo Stock de Insumo</h2>
          <form onSubmit={handleSubmit}>
            <label className={styles.formArticuloLabel}>Buscar insumo:</label>
            {formularioValidado && !insumoSeleccionado?.trim() && (
              <p className={styles.error}>Este campo es obligatorio</p>
            )}
            <div className={styles.inputConIcono}>
              <input
                list="lista-insumos"
                placeholder="Selecciona un insumo"
                value={insumoSeleccionado}
                onChange={(e) => setInsumoSeleccionado(e.target.value)}
              />
              <datalist id="lista-insumos">
                {insumos.map((insumo) => (
                  <option key={insumo.id} value={insumo.denominacion} />
                ))}
              </datalist>

            </div>

            {/* Cantidad mínima */}
            <label className={styles.formArticuloLabel}>Cantidad mínima:</label>
            {formularioValidado && cantidadMinima === "" && (
              <p className={styles.error}>Este campo es obligatorio</p>
            )}
            <div className={styles.inputConIcono}>
              <input
                type="number"
                placeholder="Cantidad mínima"
                value={cantidadMinima}
                onChange={(e) => setCantidadMinima(Number(e.target.value))}
              />
              {formularioValidado && cantidadMinima === "" && (
                <span className={styles.iconoInput}>❗</span>
              )}
            </div>

            {/* Cantidad máxima */}
            <label className={styles.formArticuloLabel}>Cantidad máxima:</label>
            {formularioValidado && cantidadMaxima === "" && (
              <p className={styles.error}>Este campo es obligatorio</p>
            )}
            <div className={styles.inputConIcono}>
              <input
                type="number"
                placeholder="Cantidad máxima"
                value={cantidadMaxima}
                onChange={(e) => setCantidadMaxima(Number(e.target.value))}
              />
              {formularioValidado && cantidadMaxima === "" && (
                <span className={styles.iconoInput}>❗</span>
              )}
            </div>

            {/* Cantidad actual */}
            <label className={styles.formArticuloLabel}>Cantidad actual:</label>
            {formularioValidado && cantidadActual === "" && (
              <p className={styles.error}>Este campo es obligatorio</p>
            )}
            <div className={styles.inputConIcono}>
              <input
                type="number"
                placeholder="Cantidad actual"
                value={cantidadActual}
                onChange={(e) => setCantidadActual(Number(e.target.value))}
              />
              {formularioValidado && cantidadActual === "" && (
                <span className={styles.iconoInput}>❗</span>
              )}
            </div>

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
    </div>
  );
}
