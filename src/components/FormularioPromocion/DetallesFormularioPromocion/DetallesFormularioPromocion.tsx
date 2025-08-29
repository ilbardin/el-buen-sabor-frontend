import { useEffect, useState } from "react";
import type { ArticuloInsumo } from "../../../models/articuloInsumo";
import type { ArticuloManufacturado } from "../../../models/articuloManufacturado";
import { getArticulosInsumo } from "../../../services/ingredientesService";
import { getArticulosManufacturados } from "../../../services/articuloManufacturadoService";
import type { PromocionDetalle } from "../../../models/promocion";
import styles from "./DetallesFormularioPromocion.module.css";

interface Props {
  detalle: PromocionDetalle[];
  setDetalle: React.Dispatch<React.SetStateAction<PromocionDetalle[]>>;
}

export default function DetallesFormularioPromocion({
  detalle,
  setDetalle,
}: Props) {
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [manufacturados, setManufacturados] = useState<ArticuloManufacturado[]>(
    []
  );
  const [cantidad, setCantidad] = useState<number>(1);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<string>("");
  const [manufacturadoSeleccionado, setManufacturadoSeleccionado] =
    useState<string>("");

  const [tipoSeleccionado, setTipoSeleccionado] = useState<
    "insumo" | "manufacturado"
  >("insumo");

  useEffect(() => {
    void cargarArticulos();
  }, []);

  //! CARGA DE ARTÍCULOS
  const cargarArticulos = async () => {
    try {
      const insumos = await getArticulosInsumo();
      const manufacturados = await getArticulosManufacturados();
      setInsumos(insumos);
      setManufacturados(manufacturados);
    } catch (error) {
      console.error("Error al cargar articulos de las promociones:", error);
    }
  };

  //! MANEJO DE CAMBIOS EN EL DETALLE
  const handleAgregarAlDetalle = () => {
    if (tipoSeleccionado === "insumo") {
      const insumo = insumos.find((i) => i.id === Number(insumoSeleccionado));
      if (!insumo) return alert("Selecciona un insumo válido");

      setDetalle([
        ...detalle,
        {
          cantidad,
          articuloInsumo: { id: insumo.id ?? 0 },
          articuloManufacturado: null,
        },
      ]);
      setInsumoSeleccionado("");
    } else {
      const manufacturado = manufacturados.find(
        (m) => m.id === Number(manufacturadoSeleccionado)
      );
      if (!manufacturado) return alert("Selecciona un manufacturado válido");

      setDetalle([
        ...detalle,
        {
          cantidad,
          articuloInsumo: null,
          articuloManufacturado: {
            id: manufacturado.id ?? 0,
          },
        },
      ]);
      setManufacturadoSeleccionado("");
    }

    setCantidad(1);
    console.log(detalle.map((d) => console.log(d)));
  };

  //! ELIMINACIÓN DE UN DETALLE
  const eliminarDetalle = (index: number) => {
    const nuevoDetalle = [...detalle];
    nuevoDetalle.splice(index, 1);
    setDetalle(nuevoDetalle);
  };

  return (
    <div>
      <div>
        <label>Cantidad:</label>
        <input
          type="number"
          min={1}
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
        />

        <div>
          <label> Tipo de producto </label>
          <button
            type="button"
            onClick={() => setTipoSeleccionado("insumo")}
            className={
              tipoSeleccionado === "insumo"
                ? styles.botonActivo
                : styles.botonInactivo
            }
            style={{
              borderTopLeftRadius: "6px",
              borderBottomLeftRadius: "6px",
            }}
          >
            Insumo
          </button>
          <button
            type="button"
            onClick={() => setTipoSeleccionado("manufacturado")}
            className={
              tipoSeleccionado === "manufacturado"
                ? styles.botonActivo
                : styles.botonInactivo
            }
            style={{
              borderTopRightRadius: "6px",
              borderBottomRightRadius: "6px",
            }}
          >
            Manufacturado
          </button>
        </div>
        <br />
        <div>
          {tipoSeleccionado === "insumo" ? (
            <select
              value={insumoSeleccionado}
              onChange={(e) => setInsumoSeleccionado(e.target.value)}
            >
              <option value="">Seleccione un insumo</option>
              {insumos.map((insumo) => (
                <option key={insumo.id} value={insumo.id}>
                  {insumo.denominacion}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={manufacturadoSeleccionado}
              onChange={(e) => setManufacturadoSeleccionado(e.target.value)}
            >
              <option value="">Seleccione un manufacturado</option>
              {manufacturados.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.denominacion}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <button
        type="button"
        className={styles.botonAgregar}
        onClick={handleAgregarAlDetalle}
      >
        Agregar al detalle
      </button>
      <div>
        <p>Productos Añadidos</p>
        <div className={styles.insumoLista}>
          {detalle.map((item, index) => (
            <div key={index} className={styles.producto}>
              {item.articuloInsumo && (
                <span className={styles.productoNombre}>
                  {insumos.find((insumo) => insumo.id === item.articuloInsumo?.id)?.denominacion}
                </span>
              )}
              {item.articuloManufacturado && (
                <span className={styles.productoNombre}>
                  {manufacturados.find((manofacturado) => manofacturado.id === item.articuloManufacturado?.id)?.denominacion}
                </span>
              )}

              <span className={styles.productoCantidad}> cantidad:  {item.cantidad}</span>

              <button
                type="button"
                onClick={() => eliminarDetalle(index)}
                className={`${styles.formArticuloButton} ${styles.formArticuloCancelarInsumo}`}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
