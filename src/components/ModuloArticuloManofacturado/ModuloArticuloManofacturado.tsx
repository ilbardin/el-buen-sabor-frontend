import type {ArticuloManufacturado} from "../../models/articuloManufacturado";
import {eliminarArticuloManufacturado} from "../../services/articuloManufacturadoService";
import baseModulo from "../../css/baseModulo.module.css";

export default function ModuloArticuloManofacturado(props: {
  articulo: ArticuloManufacturado;
  onModificar: (articulo: ArticuloManufacturado) => void;
}) {
  async function eliminarManofacturado() {
    if (props.articulo.id) {
      await eliminarArticuloManufacturado(props.articulo.id);
    }
  }

  return (
    <tr className={baseModulo.filaTabla}>
      <td>{props.articulo.denominacion}</td>
      <td>{props.articulo.descripcion}</td>
      <td>{props.articulo.tiempoEstimado}</td>
      <td>{props.articulo.precioCosto}</td>
      <td>{props.articulo.fechaBaja ? "Inactivo" : "Activo"}</td>
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
      <td  className={baseModulo.tdBotonera}>
        <div className={baseModulo.botonesAcciones}>
          <button onClick={() => props.onModificar(props.articulo)}>
            Modificar
          </button>
          <button onClick={() => eliminarManofacturado()}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}
