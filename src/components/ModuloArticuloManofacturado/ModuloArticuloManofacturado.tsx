import type { ArticuloManufacturado } from "../../models/articuloManufacturado";
import styles from "./ModuloArticuloManofacturado.module.css";
import { eliminarArticuloManufacturado } from "../../services/articuloManufacturadoService";
export default function ModuloArticuloManofacturado(props: {
  articulo: ArticuloManufacturado;
  onModificar: (articulo: ArticuloManufacturado) => void;
}) {

    async function eliminarManofacturado() {
        if (props.articulo.id) {
          await eliminarArticuloManufacturado(props.articulo.id);
        }
      }

    return(
    <tr>
      <td>{props.articulo.denominacion}</td>
      <td>{props.articulo.descripcion}</td>
      <td>{props.articulo.tiempoEstimado}</td>
      <td>{props.articulo.precioCosto}</td>
      <td>{props.articulo.estaActivo ? "Activo" : "Inactivo"}</td>
      <td>
        {props.articulo.imagenes && props.articulo.imagenes.length > 0 ? (
          <img
            src={`http://localhost:8080/uploads/images/${props.articulo.imagenes[0].denominacion}`}
            alt="Producto"
            style={{ width: "80px", height: "auto", maxHeight: "80px" }}
          />
        ) : (
          "Sin imagen"
        )}
      </td>
      <td>
        <div className={styles.accionesBotones}>
          <button onClick={() => props.onModificar(props.articulo)}>
            Modificar
          </button>
          <button
            className={styles.boton}
            onClick={() => eliminarManofacturado()}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
