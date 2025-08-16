import type { Empresa } from "../../models/empresa.ts";
import { deleteEmpresa } from "../../services/empresaService.ts";
import styles from "./ModuloEmpresa.module.css";

export function ModuloEmpresa(props: { empresa: Empresa; onModificar: (empresa: Empresa) => void  }) {

  async function eliminarEmpresa() {
    await deleteEmpresa(props.empresa.id);
    
  }


  return (
    <tr style={{
      backgroundColor: props.empresa.fechaBaja === null ? "" : "red",
    }}>
      <td>{props.empresa.id}</td>
      <td>{props.empresa.cuil}</td>
      <td>{props.empresa.nombre}</td>
      <td>{props.empresa.razonSocial}</td>
      <td>{props.empresa.fechaBaja ?  String(props.empresa.fechaBaja): "Activo"}</td>

      <td>
        <div className={styles.botonesAcciones}>
          <button onClick={() => eliminarEmpresa()}>Eliminar</button>
          <button onClick={() => props.onModificar(props.empresa)}>Modificar</button>
        </div>
      </td>
    </tr>
  );
}
