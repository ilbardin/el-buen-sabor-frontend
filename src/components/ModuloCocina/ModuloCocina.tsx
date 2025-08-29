import { useState, useEffect } from "react";
import type { PedidoRequest } from "../../models/pedidoRequest";
import styles from "./ModuloCocina.module.css";

export const ModuloCocina = (props: { pedido: PedidoRequest }) => {
  const [estadoPedido, setEstadoPedido] = useState<
    "Iniciar" | "Listo" | "Terminar"
  >("Iniciar");
  const [elapsedTime, setElapsedTime] = useState<string>("");
  const [colorState, setColorState] = useState<
    "normal" | "demorado" | "muyDemorado" | "finalizado"
  >("normal");

  const calcularColorEstado = () => {
    if (estadoPedido === "Terminar") return "finalizado";

    const pedidoDate = new Date(props.pedido.fechaHoraPedido);
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - pedidoDate.getTime()) / 60000
    );

    if (diffMinutes < 10) return "normal";
    if (diffMinutes < 20) return "demorado";
    return "muyDemorado";
  };

  useEffect(() => {
    const pedidoDate = new Date(props.pedido.fechaHoraPedido);

    const updateElapsedTime = () => {
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

      if (estadoPedido !== "Terminar") {
        setColorState(calcularColorEstado());
      }
    };

    updateElapsedTime();
    const interval = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [props.pedido.fechaHoraPedido, estadoPedido]);

  function cambioEstado() {
    if (estadoPedido === "Iniciar") {
      setEstadoPedido("Listo");
    } else if (estadoPedido === "Listo") {
      setEstadoPedido("Terminar");
    } else {
      setColorState("finalizado");
    }
  }
  return (
    <div className={`${styles.moduloCocina} ${styles[colorState]}`}>
      <div className={`${styles.moduloCocinaHeader} ${styles[colorState]}`}>
        <div className={styles.left}>
          <p>{props.pedido.id}</p>
          <p>{colorState === "finalizado" ? "Finalizado" : elapsedTime}</p>
        </div>
        <div className={styles.right}>
          <p>{props.pedido.tipoEnvio}</p>
          <p>{props.pedido.fechaHoraPedido.substring(11, 16)}</p>
        </div>
      </div>
      <div>
        <div className={styles.detallesContainer}>
          {props.pedido.detalles.map((detalle) => (
            <div key={detalle.id} className={styles.detalle}>
              <p>{detalle.cantidad}</p>
              <p>
                {detalle.articuloInsumo?.denominacion ??
                  detalle.articuloManufacturado?.denominacion ??
                  ""}
              </p>
            </div>
          ))}
        </div>
      </div>
      {colorState !== "finalizado" && (
        <div>
          <button className={styles.boton} onClick={() => cambioEstado()}>
            {estadoPedido}
          </button>
        </div>
      )}
    </div>
  );
};
