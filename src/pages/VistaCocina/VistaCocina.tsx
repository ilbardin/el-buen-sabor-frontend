import styles from "./VistaCocina.module.css";
import { ModuloCocina } from "../../components/ModuloCocina/ModuloCocina";
import type { PedidoRequest } from "../../models/pedidoRequest";
import { useEffect, useState } from "react";
import { getPedidos } from "../../services/pedidosService";

export const VistaCocina = () => {
  const [pedidos, setPedidos] = useState<PedidoRequest[]>([]);
  const [mostrarEntregados, setMostrarEntregados] = useState<boolean>(true);

  useEffect(() => {
    const obtenerPedidos = async () => {
      const pedidosData = await getPedidos();
      setPedidos(pedidosData);
    };
    obtenerPedidos();
    console.log(pedidos.map((p) => p.id));
  }, []);

  const pedidosFiltrados = pedidos.filter(
    (p) => mostrarEntregados || p.estadoPedido !== "entregado"
  );

  return (
    <div className={styles.contenedor}>
      <label className={styles.filtroEntregados}>
        <input
          type="checkbox"
          checked={mostrarEntregados}
          onChange={(e) => setMostrarEntregados(e.target.checked)}
        />
        Mostrar entregados
      </label>
      <div className={styles.vistaCocina}>
        {pedidosFiltrados.map((pedido) => (
          <ModuloCocina key={pedido.idPedido} pedido={pedido} />
        ))}
      </div>
    </div>
  );
};
