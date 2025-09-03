import { useCart } from "../../context/carrito/useCart";
import type { Promocion } from "../../models/promocion";
import type { ArticuloManufacturado } from "../../models/articuloManufacturado";
import styles from "./ModuloProductoHome.module.css";
import { MdAddShoppingCart } from "react-icons/md";
import type { ArticuloInsumo } from "../../models/articuloInsumo";

function esPromocion(
  item: Promocion | ArticuloManufacturado | ArticuloInsumo
): item is Promocion {
  return "precioSinDescuento" in item;
}

export const ModuloProductoHome = (props: {
  item: Promocion | ArticuloManufacturado | ArticuloInsumo;
}) => {
  const { addToCart } = useCart();
  /*
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!esPromocion(props.item)) {
      addToCart(props.item);
    }
  };
*/
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    const cartItem = {
      ...props.item,
      id:
        "descripcion" in props.item
          ? `M-${props.item.id}`
          : "precioSinDescuento" in props.item
          ? `P-${props.item.id}`
          : `I-${props.item.id}`,
    };

    addToCart(cartItem as any);
  };

  return (
    <div className={styles.moduloProductoHome}>
      <div className={styles.infoProducto}>
        <h1>{props.item.denominacion}</h1>
        {!esPromocion(props.item) && <p>{props.item.descripcion}</p>}
        <p className={styles.precio}>${props.item.precioVenta}</p>
      </div>
      <div className={styles.productoImagenYBoton}>
        <div className={styles.imagenProducto}>
          <img
            className={styles.moduloProductoOfertaImagen}
            src={`http://localhost:8080/uploads/images/${
              esPromocion(props.item)
                ? props.item.imagenes?.[0]
                : "descripcion" in props.item
                ? props.item.imagenes?.[0]?.denominacion
                : props.item.nombreImagen ?? "default.jpg"
            }`}
            alt=""
          />
        </div>

        <button className={styles.botonAgregar} onClick={handleAddToCart}>
          <MdAddShoppingCart size={20} />
          <span>Comprar</span>
        </button>
      </div>
    </div>
  );
};
