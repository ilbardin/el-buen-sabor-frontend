import { useEffect, useState } from "react";
import type { PedidoRequest } from "../../models/pedido/pedidoRequest";
import { getPedidos } from "../../services/pedidosService";
import styles from "./vistaDelivery.module.css";
import { ModuloDelivery } from "../../components/ModuloDelivery/ModuloDelivery";

export default function VistaDelivery() {
  const [pedidos, setPedidos] = useState<PedidoRequest[]>([]);
  const [mostrarEntregados, setMostrarEntregados] = useState<boolean>(false);
  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = async () => {
    const pedidosData = await getPedidos();
    setPedidos(pedidosData);
  };

  const filtrarTipo = pedidos.filter(
    (p) =>p.estadoPedido.toLowerCase().trim() !== "pendiente" && p.tipoEnvio.toLowerCase().trim() === "delivery"
  );

  const filtrarEntregados = filtrarTipo.filter(
    (p) =>
      mostrarEntregados || p.estadoPedido.toLowerCase().trim() !== "entregado"
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
      {
        <div className={styles.vistaCocina}>
          {filtrarEntregados.map((pedido) => (
            <ModuloDelivery key={pedido.idPedido} pedido={pedido} onActualizar={obtenerPedidos} />
          ))}
        </div>
      }
    </div>
  );
}
