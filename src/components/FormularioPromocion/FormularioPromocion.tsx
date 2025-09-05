import React, { useEffect, useState } from "react";
import { FaPercent } from "react-icons/fa";
import styles from "./FormularioPromocion.module.css";
import type { Promocion, PromocionDetalle } from "../../models/promocion";
import {
  crearPromocion,
  editarPromocion,
} from "../../services/promocionService";
import DetallesFormularioPromocion from "./DetallesFormularioPromocion/DetallesFormularioPromocion";
import { showAlert, showLoading } from "../../utils/alerts.ts";
import baseFormulario from "../../css/baseFormulario.module.css";

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

  const areDetallesEqual = (
    a: PromocionDetalle[] = [],
    b: PromocionDetalle[] = []
  ) => {
    const normalize = (arr: PromocionDetalle[]) =>
      [...arr]
        .map((x) => JSON.parse(JSON.stringify(x)))
        .sort((x, y) => (x?.id ?? 0) - (y?.id ?? 0));
    return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
  };

  const noSeRealizaronCambios = (): boolean => {
    if (!promocionAEditar) return false;

    const sinCambiosBasicos =
      promocionAEditar.denominacion === denominacion &&
      promocionAEditar.fechaDesde === fechaDesde &&
      promocionAEditar.fechaHasta === fechaHasta &&
      Math.round(promocionAEditar.descuento * 100) === Number(descuento);

    const sinCambiosDetalle = areDetallesEqual(
      promocionAEditar.detalle || [],
      detalle || []
    );
    return sinCambiosBasicos && sinCambiosDetalle;
  };

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

    if (promocionAEditar && noSeRealizaronCambios()) {
      await showAlert(
        "Sin cambios",
        "info",
        "No se detectaron cambios en la promoción."
      );
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
        showLoading();
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
    <div className={baseFormulario.divContenedor}>
      <div
        className={baseFormulario.formulario}
        style={{ flexDirection: "column", width: "70%", maxHeight: "90%" }}
      >
        <h2 className={baseFormulario.title}>Nueva Promoción</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formBody}>
            <div className={styles.leftColumn}>
              <label>Denominación:</label>
              <input
                type="text"
                value={denominacion}
                maxLength={100}
                onChange={(e) => setDenominacion(e.target.value)}
              />
              {formularioValidado && !denominacion.trim() && (
                <p className={baseFormulario.error}>
                  Este campo es obligatorio
                </p>
              )}

              {/* Fecha Desde */}
              <label>Fecha desde:</label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
              {formularioValidado && !fechaDesde && (
                <p className={baseFormulario.error}>
                  Este campo es obligatorio
                </p>
              )}

              {/* Fecha Hasta */}
              <label>Fecha hasta:</label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
              {formularioValidado && !fechaHasta && (
                <p className={baseFormulario.error}>
                  Este campo es obligatorio
                </p>
              )}

              <label>Descuento:</label>
              <div className={styles.inputWithIcon}>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="99"
                  value={descuento}
                  onChange={(e) => setDescuento(Number(e.target.value))}
                />
                <FaPercent className={styles.icono} />
              </div>
              {formularioValidado && descuento === "" && (
                <p className={baseFormulario.error}>
                  Este campo es obligatorio
                </p>
              )}
            </div>
            <div className={styles.rightColumn}>
              {/* Detalles de promoción */}

              <DetallesFormularioPromocion
                detalle={detalle}
                setDetalle={setDetalle}
              />
              {formularioValidado && detalle.length === 0 && (
                <p className={baseFormulario.error}>
                  Debes agregar al menos un articulo
                </p>
              )}
            </div>
          </div>

          <div className={baseFormulario.botones}>
            <button
              type="button"
              className={`${baseFormulario.boton} ${baseFormulario.botonCancelar}`}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${baseFormulario.boton} ${baseFormulario.botonGuardar}`}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
