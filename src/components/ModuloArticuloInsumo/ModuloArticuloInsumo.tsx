import type { ArticuloInsumo } from "../../models/articuloInsumo";
import styles from "./ModuloArticuloInsumo.module.css";
import { eliminarArticuloInsumo } from "../../services/ingredientesService";

export default function ModuloArticuloInsumo(props: {
  articulo: ArticuloInsumo;
  onModificar: (articulo: ArticuloInsumo) => void;
}) {
  async function eliminarInsumo() {
    if (props.articulo.id) {
      await eliminarArticuloInsumo(props.articulo.id);
    }
  }
  return (
    <tr>
      <td>{props.articulo.denominacion}</td>
      <td>{props.articulo.categoria}</td>
      <td>{props.articulo.precioCompra}</td>
      <td>{props.articulo.precioVenta}</td>
      <td>
        {props.articulo.imagenInsumo &&
        props.articulo.imagenInsumo.denominacion?.trim()?.length > 0 ? (
          <img
            src={`http://localhost:8080/uploads/images/${props.articulo.imagenInsumo.denominacion}`}
            alt="Producto"
            style={{ width: "80px", height: "auto", maxHeight: "80px" }}
          />
        ) : (
          "Sin imagen"
        )}
      </td>

      <td>
        <div className={styles.botonesAcciones}>
          <button onClick={() => props.onModificar(props.articulo)}>
            Modificar
          </button>
          <button onClick={() => eliminarInsumo()}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}
