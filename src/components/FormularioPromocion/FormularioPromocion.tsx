import React, { useEffect, useState } from "react";
import styles from "./FormularioPromocion.module.css";
import type { Promocion, PromocionDetalle } from "../../models/promocion";
import {
  crearPromocion,
  editarPromocion,
} from "../../services/promocionService";
import DetallesFormularioPromocion from "./DetallesFormularioPromocion/DetallesFormularioPromocion";

export function FormularioPromocion({
  onClose,
  promocionAEditar,
}: {
  onClose: () => void;
  promocionAEditar?: Promocion | null;
}) {
  const [denominacion, setDenominacion] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [descuento, setDescuento] = useState<number | "">("");
  const [detalle, setDetalle] = useState<PromocionDetalle[]>([]);

  const [formularioValidado, setFormularioValidado] = useState(false);

  useEffect(() => {
    if (promocionAEditar) {
      setDenominacion(promocionAEditar.denominacion);
      setFechaDesde(promocionAEditar.fechaDesde);
      setFechaHasta(promocionAEditar.fechaHasta);
      setDescuento(promocionAEditar.descuento * 100);
      setDetalle(promocionAEditar.detalle || []);
    }
  }, [promocionAEditar]);

  //! MANEJO DEL ENVÍO DEL FORMULARIO
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormularioValidado(true);

    if (
      !denominacion.trim() ||
      !fechaDesde ||
      !fechaHasta ||
      descuento === "" ||
      detalle.length === 0
    ) {
      return;
    }

    const promocion: Promocion = {
      id: promocionAEditar?.id,
      denominacion,
      fechaDesde,
      fechaHasta,
      descuento: Number(descuento * 0.01),
      detalle,
    };

    try {
      if (promocionAEditar) {
        console.log("Editando promoción:", promocion);
        await editarPromocion(promocion);
        onClose();
        return;
      } else {
        console.log("Creando promoción:", promocion);
        await crearPromocion(promocion);
        onClose();
        return;
      }
    } catch (error) {
      console.error("Error al crear promoción:", error);
    }
  };

  return (
    <div className={styles.divContenedor}>
      <div className={styles.formulario}>
        <h2>Nueva Promoción</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formBody}>
            <div className={styles.leftColumn}>
              {/* Denominación */}
              <label>Denominación:</label>
              <input
                type="text"
                value={denominacion}
                onChange={(e) => setDenominacion(e.target.value)}
              />
              {formularioValidado && !denominacion.trim() && (
                <p className={styles.error}>Este campo es obligatorio</p>
              )}

              {/* Fecha Desde */}
              <label>Fecha desde:</label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
              {formularioValidado && !fechaDesde && (
                <p className={styles.error}>Este campo es obligatorio</p>
              )}

              {/* Fecha Hasta */}
              <label>Fecha hasta:</label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
              {formularioValidado && !fechaHasta && (
                <p className={styles.error}>Este campo es obligatorio</p>
              )}

              {/* Descuento */}
              <label>Descuento:</label>
              <input
                type="number"
                step="1"
                min="1"
                max="100"
                value={descuento}
                onChange={(e) => setDescuento(Number(e.target.value))}
                
              />
              {formularioValidado && descuento === "" && (
                <p className={styles.error}>Este campo es obligatorio</p>
              )}
            </div>
            <div className={styles.rightColumn}>
              {/* Detalles de promoción */}

              <DetallesFormularioPromocion
                detalle={detalle}
                setDetalle={setDetalle}
              />
              {formularioValidado && detalle.length === 0 && (
                <p className={styles.error}>
                  Debes agregar al menos un articulo
                </p>
              )}
            </div>
          </div>

          <div className={styles.botones}>
            <button
              type="button"
              className={`${styles.boton} ${styles.botonCancelar}`}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${styles.boton} ${styles.botonGuardar}`}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
