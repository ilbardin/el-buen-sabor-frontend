import type { Promocion } from "../../models/promocion";

export function PromocionItem( props: { promocion: Promocion } ) {
  return (
    <>
      <tr>
      <td>{props.promocion.id!}</td>
      <td>{props.promocion.denominacion}</td>
      <td>{props.promocion.descuento}</td>
      <td>{props.promocion.fechaDesde}</td>
      <td>{props.promocion.fechaHasta}</td>
      <td>
        <button>Modificar</button>
        <button>Eliminar</button>
      </td>
      
    </tr>
    </>
  );
}
