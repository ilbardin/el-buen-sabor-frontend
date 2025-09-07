import {useCart} from "../../context/carrito/useCart";
import type {Promocion} from "../../models/promocion";
import type {ArticuloManufacturadoDisponible} from "../../models/articuloManufacturado";
import styles from "./ModuloProductoHome.module.css";
import {MdAddShoppingCart} from "react-icons/md";
import type {ArticuloInsumo} from "../../models/articuloInsumo";
import React from "react";

export const ModuloProductoHome = (props: {
    item: Promocion | ArticuloManufacturadoDisponible | ArticuloInsumo;
}) => {
    const {addToCart} = useCart();

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

    function esPromocion(
        item: Promocion | ArticuloManufacturadoDisponible | ArticuloInsumo
    ): item is Promocion {
        return "precioSinDescuento" in item;
    }

    function esInsumo(item: any): item is ArticuloInsumo {
        return 'nombreImagen' in item;
    }

    function esManufacturadoDisponible(item: any): item is ArticuloManufacturadoDisponible {
        return 'listaImagenes' in item;
    }

    return (
        <div className={styles.moduloProductoHome}>
            <div className={styles.infoProducto}>
                <h1>{props.item.denominacion}</h1>
                {!esPromocion(props.item)}
                <p className={styles.precio}>${props.item.precioVenta}</p>
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

                <button className={styles.botonAgregar} onClick={handleAddToCart}>
                    <MdAddShoppingCart size={20}/>
                    <span>Comprar</span>
                </button>
            </div>
        </div>
    );
};
