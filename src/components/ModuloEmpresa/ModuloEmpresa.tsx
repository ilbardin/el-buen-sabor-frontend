import type { Empresa } from "../../models/empresa.ts";
import { deleteEmpresa } from "../../services/empresaService.ts";
import styles from "./ModuloEmpresa.module.css";

export function ModuloEmpresa(props: {
  empresa: Empresa;
  onModificar: (empresa: Empresa) => void;
}) {
  async function eliminarEmpresa() {
    if (props.empresa.id) {
      await deleteEmpresa(props.empresa.id);
    }
  }

  return (
    <tr>
      <td>{props.empresa.id}</td>
      <td>{props.empresa.cuil}</td>
      <td>{props.empresa.nombre}</td>
      <td>{props.empresa.razonSocial}</td>
      <td
        style={{
          backgroundColor:
            props.empresa.fechaBaja === null ? "" : "rgba(231, 76, 60, 0.1)",
        }}
      >
        {props.empresa.fechaBaja ? String(props.empresa.fechaBaja) : "Activo"}
      </td>

      <td>
        <div className={styles.botonesAcciones}>
          <button onClick={() => props.onModificar(props.empresa)}>
            Modificar
          </button>
          <button onClick={() => eliminarEmpresa()}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}
