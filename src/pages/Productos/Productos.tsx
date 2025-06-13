import React, {useCallback, useEffect, useState} from "react";
import {getArticulosManufacturados} from "../../services/articuloManufacturadoService";
import {ArticuloManufacturadoCard} from "../../components/ProductoManufacturadoCard/ProductoManufacturadoCard.tsx";
import styles from "./Productos.module.css";
import type {ArticuloManufacturado} from "../../models/articuloManufacturado.ts";
import {Carrito} from "../../components/Carrito/Carrito.tsx";
import {useCart} from "../../context/carrito/useCart.ts";

const Productos: React.FC = () => {
    const [productos, setProductos] = useState<ArticuloManufacturado[]>([]);
    const {cart, saveCart, increaseQuantity, decreaseQuantity, clearCart} = useCart();

    const cargarProductos = useCallback(() => {
        getArticulosManufacturados()
            .then((res) => setProductos(res))
            .catch((err) => {
                console.error("Error al cargar productos", err);
            });
    }, []);

    useEffect(() => {
        cargarProductos();
    }, [cargarProductos]);

    return (
        <div className={styles.homepageLayout}>
            <div className={styles.mainContent}>
                <h1>Productos Manufacturados</h1>
                <div className={styles.gridContainer}>
                    <div className={styles.grid}>
                        {productos.map((prod) => (
                            <ArticuloManufacturadoCard
                                key={prod.id}
                                producto={prod}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.sidebar}>
                <Carrito
                    items={cart}
                    onIncrease={increaseQuantity}
                    onDecrease={decreaseQuantity}
                    onSave={saveCart}
                    onClear={clearCart}
                />
            </div>
        </div>
    );
};

export default Productos;