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
    <tr>
      <td>{props.sucursal.id}</td>
      <td>{props.sucursal.nombre}</td>
      <td>{props.sucursal.horarioApertura}</td>
      <td>{props.sucursal.horarioCierre}</td>
      <td
        style={{
        backgroundColor: props.sucursal.fechaBaja === null ? "" : "rgba(231, 76, 60, 0.1)",
      }}
      >
        {props.sucursal.fechaBaja ? String(props.sucursal.fechaBaja) : "Activo"}
      </td>

      <td>
        <div className={styles.botonesAcciones}>
          <button onClick={() => props.onModificar(props.sucursal)}>
            Modificar
          </button>
          <button onClick={() => eliminarSucursal()}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}
