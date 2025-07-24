import type { Empresa } from "../../models/empresa.ts";

export function ModuloEmpresa(props: { empresa: Empresa }) {
  return (
    <tr>
      <td>{props.empresa.cuil}</td>
      <td>{props.empresa.nombre}</td>
      <td>{props.empresa.razonSocial}</td>

      <td>
        <div className={styles.botonesAcciones}>
          <button onClick={() => eliminarEmpresa()}>Eliminar</button>
          <button onClick={() => modificarEmpresa()}>Modificar</button>
        </div>
      </td>
    </tr>
  );
}
