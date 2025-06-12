import React from 'react';
import {FaShoppingCart, FaCartPlus} from 'react-icons/fa';
import {MdDelete} from "react-icons/md";
import type {ArticuloManufacturado} from '../../models/articuloManufacturado';
import styles from "./Carrito.module.css";

interface CartItem extends ArticuloManufacturado {
    cantidad: number;
}

interface CartProps {
    items: CartItem[];
    onSave: () => void;
    onClear: () => void;
}

export const Carrito: React.FC<CartProps> = ({items, onSave, onClear}) => {
    const total = items.reduce((sum, it) => sum + it.precioVenta * it.cantidad, 0);

    return (
        <div className={styles.cart}>
            <div className={styles.carritoTitulo}>
                <FaShoppingCart size={20}/>
                &nbsp;<label>Carrito</label>
            </div>

            {items.length === 0 ? (
                <p className={styles.empty}>El carrito está vacío</p>
            ) : (
                <>
                    <ul className={styles.cartList}>
                        {items.map(({id, denominacion, cantidad, precioVenta}) => (
                            <li key={id} className={styles.cartItem}>
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemName}>{denominacion}</span>
                                    <span className={styles.itemQty}>Cantidad: {cantidad}</span>
                                </div>
                                <div className={styles.itemTotal}>
                                    ${(precioVenta * cantidad).toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.cartSummary}>
                        <p className={styles.cartTotal}>
                            Total: <strong>${total.toFixed(2)}</strong>
                        </p>
                        <button
                            className={`${styles.boton} ${styles.btnSave}`}
                            disabled={items.length === 0}
                            onClick={onSave}
                        >
                            <FaCartPlus size={20}/>
                            &nbsp;
                            Guardar carrito
                        </button>
                        <button
                            className={`${styles.boton} ${styles.btnClear}`}
                            disabled={items.length === 0}
                            onClick={onClear}
                        >
                            <MdDelete size={20}/>
                            &nbsp;
                            Vaciar carrito
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};