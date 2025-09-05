import { useState, useEffect } from "react";
import type { PedidoRequest } from "../../models/pedido/pedidoRequest.ts";
import styles from "./ModuloCocina.module.css";
import { cambioEstadoPedido } from "../../services/pedidosService";
type EstadoPedido =
  | "pendiente"
  | "preparacion"
  | "cancelado"
  | "rechazado"
  | "delivery"
  | "entregado";
export const ModuloCocina = (props: { pedido: PedidoRequest }) => {
  const [estadoPedido, setEstadoPedido] = useState<EstadoPedido>(
    (props.pedido.estadoPedido as EstadoPedido) ?? "pendiente"
  );
  const [elapsedTime, setElapsedTime] = useState<string>("");
  const [colorState, setColorState] = useState<
    "normal" | "demorado" | "muyDemorado" | "finalizado"
  >("normal");

  const cambioEstado = async (nuevoEstado: typeof estadoPedido) => {
    try {
      await cambioEstadoPedido(props.pedido.idPedido, nuevoEstado);
      setEstadoPedido(nuevoEstado);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const calcularColorEstado = () => {
    if (estadoPedido === "entregado") return "finalizado";

    const pedidoDate = new Date(props.pedido.fechaCreacion);
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - pedidoDate.getTime()) / 60000
    );

    if (diffMinutes < 10) return "normal";
    if (diffMinutes < 20) return "demorado";
    return "muyDemorado";
  };

  useEffect(() => {
    const pedidoDate = new Date(props.pedido.fechaCreacion);

    const updateElapsedTime = () => {
      if (estadoPedido === "entregado") {
        setColorState("finalizado");
        return;
      }
      const now = new Date();
      const diff = Math.floor((now.getTime() - pedidoDate.getTime()) / 1000);

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      const formatted =
        (hours > 0 ? String(hours).padStart(2, "0") + ":" : "") +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

      setElapsedTime(formatted);

      setColorState(calcularColorEstado());
    };

    updateElapsedTime();
    const interval = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [props.pedido.fechaCreacion, estadoPedido]);

  return (
    <div className={`${styles.moduloCocina} ${styles[colorState]}`}>
      <div className={`${styles.moduloCocinaHeader} ${styles[colorState]}`}>
        <div className={styles.left}>
          <p>{props.pedido.idPedido}</p>
          {estadoPedido !== "entregado" ? (
            <p>{elapsedTime}</p>
          ) : (
            <p>Entregado</p>
          )}
        </div>
        <div className={styles.right}>
          <p>{props.pedido.tipoEnvio}</p>
          <p>{props.pedido.fechaCreacion.substring(11, 16) ?? "Sin hora"}</p>
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
          onClick={() =>
            cambioEstado(
              estadoPedido === "pendiente" ? "preparacion" : "entregado"
            )
          }
        >
          {estadoPedido === "pendiente"
            ? "Iniciar"
            : estadoPedido === "preparacion"
            ? "Terminar"
            : "Entregado"}
        </button>
      </div>
    </div>
  );
};
