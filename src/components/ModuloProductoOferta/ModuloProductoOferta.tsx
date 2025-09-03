import { MdAddShoppingCart } from "react-icons/md";
import type { Promocion } from "../../models/promocion";
import styles from "./ModuloProductoOferta.module.css";
import { useCart } from "../../context/carrito/useCart";
import type { ArticuloManufacturado } from "../../models/articuloManufacturado";

function esPromocion(
  item: Promocion | ArticuloManufacturado
): item is Promocion {
  return "precioSinDescuento" in item;
}

export default function ModuloProductoOferta(props: {
  promocion: Promocion | ArticuloManufacturado;
}) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!esPromocion(props.promocion)) {
      addToCart(props.promocion);
    }
  };

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
      {esPromocion(props.promocion) && (
        <p className={styles.moduloProductoOfertaDescuento}>
          $ {props.promocion.precioSinDescuento.toFixed(2)}
        </p>
      )}
      <p className={styles.moduloProductoOfertaPrecio}>
        $ {props.promocion.precioVenta.toFixed(2)}
      </p>

      <button
        className={`${styles.btn} ${styles.btnAdd}`}
        onClick={handleAddToCart}
      >
        <MdAddShoppingCart size={20} />
        &nbsp;Agregar al <br /> carrito
      </button>
    </div>
  );
}
