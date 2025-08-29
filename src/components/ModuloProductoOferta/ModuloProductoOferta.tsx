import type { Promocion } from "../../models/promocion";
import styles from "./ModuloProductoOferta.module.css";
export default function ModuloProductoOferta(props: { promocion: Promocion }) {
  return (
    <div className={styles.moduloProductoOferta}>
      <img
        className={styles.moduloProductoOfertaImagen}
        src={`http://localhost:8080/uploads/images/${props.promocion.imagenes[0]}`}
        alt=""
      />

      <p className={styles.moduloProductoOfertaDenominacion}>
        {props.promocion.denominacion}
      </p>
      <p className={styles.moduloProductoOfertaDescuento}>
        $ {props.promocion.precioSinDescuento.toFixed(2)}
      </p>
      <p className={styles.moduloProductoOfertaPrecio}>
        $ {props.promocion.precioVenta.toFixed(2)}
      </p>
    </div>
  );
}
