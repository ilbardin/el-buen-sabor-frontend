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

export default function DetallesFormularioPromocion({ detalle, setDetalle }: Props) {
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [manufacturados, setManufacturados] = useState<ArticuloManufacturado[]>(
    []
  );

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

  //! AGREGA UN NUEVO INSUMO AL DETALLE PARA RELLENAR (VACIO)
  const addNewInsumo = () => {
    setDetalle([
      ...detalle,
      {
        cantidad: 1,
        articuloInsumo: null,
        articuloManufacturado: null,
      },
    ]);
  };

  //! MANEJO DE CAMBIOS EN EL DETALLE
  const handleChangeDetalle = (
    index: number,
    campo: "cantidad" | "articuloInsumo" | "articuloManufacturado",
    valor: unknown
  ) => {
    const nuevosDetalles = [...detalle];
    if (campo === "cantidad") {
      nuevosDetalles[index].cantidad = Number(valor);
    } else {
      nuevosDetalles[index].articuloInsumo = null;
      nuevosDetalles[index].articuloManufacturado = null;
      if (campo === "articuloInsumo") {
        nuevosDetalles[index].articuloInsumo = { id: Number(valor) };
      } else {
        nuevosDetalles[index].articuloManufacturado = { id: Number(valor) };
      }
    }
    setDetalle(nuevosDetalles);
  };

  return (
    <div>
      <h2>Detalles de la Promoción</h2>
      {detalle.map((item, index) => (
        <div key={index} className={styles.itemDetalle}>
          <label>Cantidad:</label>
          <input
            type="number"
            min="1"
            value={item.cantidad}
            onChange={(e) =>
              handleChangeDetalle(index, "cantidad", e.target.value)
            }
          />

          <select
            onChange={(e) =>
              handleChangeDetalle(index, "articuloInsumo", e.target.value)
            }
            value={item.articuloInsumo?.id ?? ""}
          >
            <option value="">Insumo</option>
            {insumos.map((insumo) => (
              <option key={insumo.id} value={insumo.id}>
                {insumo.denominacion}
              </option>
            ))}
          </select>

          <select
            onChange={(e) =>
              handleChangeDetalle(
                index,
                "articuloManufacturado",
                e.target.value
              )
            }
            value={item.articuloManufacturado?.id ?? ""}
          >
            <option value="">Manufacturado</option>
            {manufacturados.map((m) => (
              <option key={m.id} value={m.id}>
                {m.denominacion}
              </option>
            ))}
          </select>
        </div>
      ))}

      
      <button
        type="button"
        className={styles.botonAgregar}
        onClick={addNewInsumo}
      >
        + Agregar artículo
      </button>
    </div>
  );
}
