import { useState } from "react";
import type { Promocion } from "../../models/promocion";
import type { ArticuloManufacturado } from "../../models/articuloManufacturado";
import ModuloProductoOferta from "../../components/ModuloProductoOferta/ModuloProductoOferta";
import styles from "./Prueba.module.css";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

export default function Prueba(props: {
  productos: Promocion[] | ArticuloManufacturado[];
}) {
  const [contador, setContador] = useState(0);

  function aumentarContador(num: number) {
    if (!props.productos) return;

    const total = props.productos.length;
    const nuevaPosicion = contador + num;

    if (nuevaPosicion < 0) {
      if (nuevaPosicion < -4) {
        setContador(total - 5);
      } else {
        setContador(0);
      }
    } else if (nuevaPosicion + 5 <= total) {
      setContador(nuevaPosicion);
    } else if (nuevaPosicion < total) {
      setContador(total - 5);
    } else {
      setContador(0);
    }
  }

  return (
    <>
      <div className={styles.contenedor}>
        <div className={styles.carrusel}>
          <button
            className={`${styles.boton} ${styles.izquierda}`}
            onClick={() => aumentarContador(-5)}
          >
            {<SlArrowLeft />}
          </button>

          <div className={styles.prueba}>
            {props.productos?.slice(contador, contador + 5).map((oferta) => (
              <ModuloProductoOferta promocion={oferta} key={oferta.id} />
            ))}
          </div>
          <button
            className={`${styles.boton} ${styles.derecha}`}
            onClick={() => aumentarContador(5)}
          >
            {<SlArrowRight />}
          </button>
        </div>
      </div>
    </>
  );
}
