import styles from "./VistaCocina.module.css";
import { ModuloCocina } from "../../components/ModuloCocina/ModuloCocina";
import type { PedidoRequest } from "../../models/pedido/pedidoRequest.ts";
import { useEffect, useState } from "react";
import { getPedidos } from "../../services/pedidosService";
import { GrUpdate } from "react-icons/gr";

export const VistaCocina = () => {
  const [pedidos, setPedidos] = useState<PedidoRequest[]>([]);
  const [mostrarEntregados, setMostrarEntregados] = useState<boolean>(false);
  const [normal, setNormal] = useState<boolean>(true);
  const [demorado, setDemorado] = useState<boolean>(true);
  const [muyDemorado, setMuyDemorado] = useState<boolean>(true);

  useEffect(() => {
    obtenerPedidos();
    const interval = setInterval(obtenerPedidos, 8000);
    return () => clearInterval(interval);
  }, []);

  const obtenerPedidos = async () => {
    const pedidosData = await getPedidos();
    console.log(pedidosData);
    setPedidos(pedidosData.content);
  };

  const calcularDemora = (pedido: PedidoRequest) => {
    if (pedido.estadoPedido === "entregado") return "finalizado";

    const pedidoDate = new Date(pedido.fechaCreacion);
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - pedidoDate.getTime()) / 60000
    );

    if (diffMinutes < 10) return "normal";
    if (diffMinutes < 20) return "demorado";
    return "muyDemorado";
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    if (!mostrarEntregados && p.estadoPedido === "entregado") return false;

    const demora = calcularDemora(p);
    if (demora === "normal" && !normal) return false;
    if (demora === "demorado" && !demorado) return false;
    if (demora === "muyDemorado" && !muyDemorado) return false;

    return true;
  });

  return (
    <div className={styles.contenedor}>
      <div className={styles.filtroEntregados}>
        <button
          className={`${styles.botonesDemora} ${normal ? styles.recargar : ""}`}
          onClick={() => obtenerPedidos()}
        >
          <GrUpdate />
        </button>
        <button
          className={`${styles.botonesDemora} ${normal ? styles.normal : ""}`}
          onClick={() => setNormal(!normal)}
        >
          Normal
        </button>
        <button
          className={`${styles.botonesDemora} ${
            demorado ? styles.demorado : ""
          }`}
          onClick={() => setDemorado(!demorado)}
        >
          Demorado
        </button>
        <button
          className={`${styles.botonesDemora} ${
            muyDemorado ? styles.muyDemorado : ""
          }`}
          onClick={() => setMuyDemorado(!muyDemorado)}
        >
          Muy Demorado
        </button>
        <button
          className={`${styles.botonesDemora} ${
            mostrarEntregados ? styles.entregado : ""
          }`}
          onClick={() => setMostrarEntregados(!mostrarEntregados)}
        >
          Entregado
        </button>
      </div>
      <div className={styles.vistaCocina}>
        {pedidosFiltrados.map((pedido) => (
          <ModuloCocina key={pedido.idPedido} pedido={pedido} />
        ))}
      </div>
    </div>
  );
};
