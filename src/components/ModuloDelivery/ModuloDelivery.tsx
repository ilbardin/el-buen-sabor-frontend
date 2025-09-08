import { useState } from "react";
import type { PedidoRequest } from "../../models/pedido/pedidoRequest";
import { cambioEstadoPedido } from "../../services/pedidosService";
import styles from "./ModuloDelivery.module.css";
type EstadoPedido =
  | "pendiente"
  | "preparacion"
  | "cancelado"
  | "rechazado"
  | "delivery"
  | "entregado";

export const ModuloDelivery = (props: {
  pedido: PedidoRequest;
  onActualizar?: () => Promise<void> | void;
}) => {
  const [estadoPedido, setEstadoPedido] = useState<EstadoPedido>(
    (props.pedido.estadoPedido as EstadoPedido) ?? "delivery"
  );
  const cambioEstado = async () => {
    try {
      await cambioEstadoPedido(props.pedido.idPedido ?? 0, "entregado");
      setEstadoPedido("entregado");
      if (props.onActualizar) {
        await props.onActualizar();
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  return (
    <div className={styles.moduloCocina}>
      <div className={`${styles.moduloCocinaHeader}`}>
        <div className={styles.left}>
          <p>{props.pedido.idPedido}</p>
          <p>{props.pedido.direccionEntrega}</p>
        </div>
        <div className={styles.right}>
          <p>{props.pedido.fechaCreacion?.substring(11, 16) ?? "Sin hora"}</p>
        </div>
      </div>
      <div>
        <div className={styles.detallesContainer}>
          {props.pedido.detalles.map((detalle) => (
            <div key={detalle.itemId} className={styles.detalle}>
              <p>{detalle.cantidad}</p>
              <p>{detalle.denominacion}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <button
          className={`${styles.boton} ${
            estadoPedido === "entregado" ? styles.botonDeshabilitado : ""
          }`}
          onClick={() => cambioEstado()}
        >
          {estadoPedido.toLowerCase().trim() === "entregado"
            ? "Entregado"
            : "Marcar como entregado"}
        </button>
      </div>
    </div>
  );
};
