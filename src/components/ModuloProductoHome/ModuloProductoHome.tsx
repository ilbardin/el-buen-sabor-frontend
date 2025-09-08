import { useCart } from "../../context/carrito/useCart";
import type { Promocion } from "../../models/promocion";
import type { ArticuloManufacturadoDisponible } from "../../models/articuloManufacturado";
import styles from "./ModuloProductoHome.module.css";
import { MdAddShoppingCart } from "react-icons/md";
import type { ArticuloInsumo } from "../../models/articuloInsumo";
import type { StockInsumo } from "../../models/stockInsumo";
import React, { useEffect, useState } from "react";
import { getStockInsumos } from "../../services/stockInsumoService";

export const ModuloProductoHome = (props: {
  item: Promocion | ArticuloManufacturadoDisponible | ArticuloInsumo;
}) => {
  const { addToCart } = useCart();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    const cartItem = {
      ...props.item,
      id:
        "descripcion" in props.item
          ? `${props.item.id}`
          : "precioSinDescuento" in props.item
          ? `${props.item.id}`
          : `${props.item.id}`,
    };

    addToCart(cartItem as any);
  };
  const [stockInsumo, setStockInsumo] = useState<StockInsumo[]>([]);

  useEffect(() => {
    const cargarStock = async () => {
      try {
        const stock = await getStockInsumos();
        setStockInsumo(stock);
      } catch (error) {
        console.error("Error cargando stock de insumos:", error);
      }
    };

    cargarStock();
  }, []);

  function esPromocion(
    item: Promocion | ArticuloManufacturadoDisponible | ArticuloInsumo
  ): item is Promocion {
    return "precioSinDescuento" in item;
  }

  function esInsumo(item: any): item is ArticuloInsumo {
    return "nombreImagen" in item;
  }

  function esManufacturadoDisponible(
    item: any
  ): item is ArticuloManufacturadoDisponible {
    return "listaImagenes" in item;
  }

  function tieneStockInsumo(insumo: ArticuloInsumo): boolean {
    const stock = stockInsumo.find((s) => s.idInsumo === insumo.id);
    return stock ? stock.cantidadActual > 0 : false;
  }

  const isOutOfStock =
    (esManufacturadoDisponible(props.item) &&
      props.item.cantidadDisponible === 0) ||
    (esInsumo(props.item) && !tieneStockInsumo(props.item));

  return (
    <div
      className={`${styles.moduloProductoHome} ${
        isOutOfStock ? styles.sinStock : ""
      }`}
    >
      <div className={styles.infoProducto}>
        <h1>{props.item.denominacion}</h1>
        {!esPromocion(props.item)}
        <p className={styles.precio}>
          $
          {Number(props.item.precioVenta).toLocaleString("es-AR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
        </p>
        {isOutOfStock && (
          <p className={styles.mensajeSinStock}>Sin stock actualmente</p>
        )}
      </div>
      <div className={styles.productoImagenYBoton}>
        <div className={styles.imagenProducto}>
          <img
            className={styles.moduloProductoOfertaImagen}
            src={`http://localhost:8080/uploads/images/${
              esPromocion(props.item)
                ? props.item.imagenes?.[0] ?? "default.jpg"
                : esInsumo(props.item)
                ? props.item.nombreImagen ?? "default.jpg"
                : esManufacturadoDisponible(props.item)
                ? props.item.listaImagenes?.[0] ?? "default.jpg"
                : "default.jpg"
            }`}
            alt={props.item.denominacion}
          />
        </div>

        <button
          className={styles.botonAgregar}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <MdAddShoppingCart size={20} />
          <span>Comprar</span>
        </button>
      </div>
    </div>
  );
};
