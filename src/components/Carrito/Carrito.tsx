import React from 'react';
import {FaCartPlus, FaMinus, FaPlus, FaShoppingCart} from 'react-icons/fa';
import {MdDelete} from "react-icons/md";
import type {ArticuloManufacturado} from '../../models/articuloManufacturado.ts';
import styles from "./Carrito.module.css";

interface CartItem extends ArticuloManufacturado {
    cantidad: number;
}

interface CartProps {
    items: CartItem[];
    onIncrease: (id: number) => void;
    onDecrease: (id: number) => void;
    onSave: () => void;
    onClear: () => void;
}

export const Carrito: React.FC<CartProps> = ({items, onIncrease, onDecrease, onSave, onClear}) => {
    const total = items.reduce((sum, it) => sum + it.precioVenta * it.cantidad, 0);

    return (
        <div className={styles.cart}>
            <div className={styles.carritoTitulo}>
                <FaShoppingCart size={20} style={{color: "var(--color-primario)", marginBottom: "4px"}}/>
                <label>Carrito</label>
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

                                    <div className={styles.itemQty}>
                                        <button
                                            className={`${styles.qtyBtn} ${styles.minusBtn}`}
                                            onClick={() => id !== undefined && onDecrease(id)}
                                        >
                                            <FaMinus/>
                                        </button>

                                        <span className={styles.qtyLabel}>{cantidad}</span>

                                        <button
                                            className={`${styles.qtyBtn} ${styles.plusBtn}`}
                                            onClick={() => id !== undefined && onIncrease(id)}
                                        >
                                            <FaPlus/>
                                        </button>
                                    </div>
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
                            <span className={styles.btnText}>Guardar carrito</span>
                        </button>
                        <button
                            className={`${styles.boton} ${styles.btnClear}`}
                            disabled={items.length === 0}
                            onClick={onClear}
                        >
                            <MdDelete size={20}/>
                            <span className={styles.btnText}>Vaciar carrito</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};