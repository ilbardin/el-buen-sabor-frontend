import React, {useCallback, useEffect, useState} from "react";
import {getArticulosManufacturados} from "../../services/articuloManufacturadoService";
import {ArticuloManufacturadoCard} from "../../components/ProductoManufacturadoCard/ProductoManufacturadoCard.tsx";
import styles from "./Productos.module.css";
import type {ArticuloManufacturado} from "../../models/articuloManufacturado.ts";
import {Carrito} from "../../components/Carrito/Carrito.tsx";
import {useCart} from "../../context/carrito/useCart.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {ROUTES} from "../../constants/routes.ts";

const Productos: React.FC = () => {
    const [productos, setProductos] = useState<ArticuloManufacturado[]>([]);
    const {cart, increaseQuantity, decreaseQuantity, clearCart} = useCart();

    const location = useLocation();
    const navigate = useNavigate();

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

    // TODO: implementar una nueva pagina con el estado del pedido
    // TODO: este metodo va a estar en la pagina del estado del pedido
    // limpia la url
    useEffect(() => {
        if (location.search.includes("preference_id")) {
            clearCart();
            navigate(ROUTES.PRODUCTOS, {replace: true});
        }
    }, [clearCart, location, navigate]);

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
                    onClear={clearCart}
                />
            </div>
        </div>
    );
};

export default Productos;
