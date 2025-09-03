import type { ArticuloInsumo } from "../../models/articuloInsumo";
import styles from "./ModuloArticuloInsumo.module.css";
import baseModulo from "../../css/baseModulo.module.css";
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
    <tr className={baseModulo.filaTabla}>
      <td>{props.articulo.denominacion}</td>
      <td>
        <div className={styles.listaCategorias}>
          {props.articulo.categorias.map((categoria) => (
            <span>{categoria}</span>
          ))}
        </div>
      </td>
      <td>{props.articulo.precioCompra}</td>
      <td>{props.articulo.precioVenta}</td>
      <td>
        {props.articulo.nombreImagen &&
        props.articulo.nombreImagen?.trim()?.length > 0 ? (
          <img
            src={`http://localhost:8080/uploads/images/${props.articulo.nombreImagen}`}
            alt="Producto"
            style={{ width: "80px", height: "auto", maxHeight: "80px" }}
          />
        ) : (
          "Sin imagen"
        )}
      </td>

      <td className={baseModulo.tdBotonera}>
        <div className={baseModulo.botonesAcciones}>
          <button onClick={() => props.onModificar(props.articulo)}>
            Modificar
          </button>
          <button onClick={() => eliminarInsumo()}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}
