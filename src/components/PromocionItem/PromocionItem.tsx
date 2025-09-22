import type {Promocion} from "../../models/promocion";
import {eliminarPromocion} from "../../services/promocionService";
import {mostrarCargando, mostrarConfirmacion} from "../../utils/alerts.ts";
import baseModulo from "../../css/baseModulo.module.css";

export function PromocionItem(props: {
  promocion: Promocion;
  onEditar: (promo: Promocion) => void;
  onEliminar: () => void;
}) {
  const deletePromocion = async (id: number) => {
    const confirmacion: boolean = await mostrarConfirmacion(
      "Eliminar promoción",
      "¿Estás seguro de que deseas eliminar esta promoción?"
    );

    if (confirmacion) {
      mostrarCargando();
      await eliminarPromocion(id);
      props.onEliminar();
    }
  };

  return (
    <>
      <tr className={baseModulo.filaTabla}>
        <td>{props.promocion.id!}</td>
        <td>{props.promocion.denominacion}</td>
        <td>{(props.promocion.descuento * 100)}%</td>
        <td>{props.promocion.fechaDesde}</td>
        <td>{props.promocion.fechaHasta}</td>
        <td className={baseModulo.tdBotonera}>
          <div className={baseModulo.botonesAcciones}>
            <button
              onClick={() => {
                props.onEditar(props.promocion);
              }}
            >
              Modificar
            </button>
            <button
              onClick={async () => {
                if (props.promocion.id !== undefined) {
                  await deletePromocion(props.promocion.id);
                }
              }}
            >
              Eliminar
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}
