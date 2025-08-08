import type { Promocion } from "../../models/promocion";
import { eliminarPromocion } from "../../services/promocionService";

export function PromocionItem( props: { promocion: Promocion, onEditar: (promo: Promocion) => void } ) {

  const deletePromocion = async (id: number) => {
    await eliminarPromocion(id);
  }

  return (
    <>
      <tr>
      <td>{props.promocion.id!}</td>
      <td>{props.promocion.denominacion}</td>
      <td>{props.promocion.descuento}</td>
      <td>{props.promocion.fechaDesde}</td>
      <td>{props.promocion.fechaHasta}</td>
      <td>
        <button
          onClick={() => {
            props.onEditar(props.promocion);
          }}
        >
          Modificar
        </button>
        <button onClick={() => {
            if (props.promocion.id !== undefined) {
              deletePromocion(props.promocion.id);
            }
          }}>Eliminar</button>
      </td>
      
    </tr>
    </>
  );
}
