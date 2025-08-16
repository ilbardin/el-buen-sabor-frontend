import type { Sucursal } from "../../models/sucursal";
import { deleteSucursal } from "../../services/sucursalService";
import styles from "./ModuloSucursal.module.css";

export function ModuloSucursal(props: {
  sucursal: Sucursal;
  onModificar: (sucursal: Sucursal) => void;
}) {
  async function eliminarSucursal() {
    if (props.sucursal.id) {
      await deleteSucursal(props.sucursal.id);
    }
  }

  return (
    <tr
      style={{
        backgroundColor: props.sucursal.fechaBaja === null ? "" : "red",
      }}
    >
      <td>{props.sucursal.id}</td>
      <td>{props.sucursal.nombre}</td>
      <td>{props.sucursal.horarioApertura}</td>
      <td>{props.sucursal.horarioCierre}</td>
      <td>
        {props.sucursal.fechaBaja ? String(props.sucursal.fechaBaja) : "Activo"}
      </td>

      <td>
        <div className={styles.botonesAcciones}>
          <button onClick={() => eliminarSucursal()}>Eliminar</button>
          <button onClick={() => props.onModificar(props.sucursal)}>
            Modificar
          </button>
        </div>
      </td>
    </tr>
  );
}
