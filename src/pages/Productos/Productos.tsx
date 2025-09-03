import React, {useCallback, useEffect, useRef, useState} from "react";
import {getArticulosManufacturados} from "../../services/articuloManufacturadoService";
import {ArticuloManufacturadoCard} from "../../components/ProductoManufacturadoCard/ProductoManufacturadoCard.tsx";
import styles from "./Productos.module.css";
import type {ArticuloManufacturado} from "../../models/articuloManufacturado.ts";
import {Carrito} from "../../components/Carrito/Carrito.tsx";
import {useCart} from "../../context/carrito/useCart.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {ROUTES} from "../../constants/routes.ts";
import NavbarCliente from "../../components/NavbarCliente/NavbarCliente.tsx";
import {useAuth} from "../../context/auth/useAuth.ts";

const Productos: React.FC = () => {
    const {setIsLoggingOut, usuario} = useAuth();

    const loginRef = useRef<HTMLDivElement>(null);
    const userIconRef = useRef<HTMLSpanElement>(null);

    const [productos, setProductos] = useState<ArticuloManufacturado[]>([]);
    const {cart, increaseQuantity, decreaseQuantity, checkoutCart, clearCart} = useCart();

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

    // TODO: este metodo va a estar en la pagina del estado del pedido
    // limpia la url
    useEffect(() => {
        if (location.search.includes("preference_id")) {
            clearCart();
            navigate(ROUTES.PRODUCTOS, {replace: true});
        }
    }, [clearCart, location, navigate]);

    useEffect(() => {
        setIsLoggingOut(false);
    }, [setIsLoggingOut]);

    return (
        <div className={styles.contenedorProductos}>
            <NavbarCliente
                usuario={usuario}
                navLinks={[
                    {label: "Home", to: ROUTES.HOME, requiresAuth: true},
                    {label: "Nuestros especiales", to: "/especiales"},
                    {label: "Sucursales", to: "/sucursales"},
                ]}
                loginRef={loginRef}
                userIconRef={userIconRef}
            />
            <div className={styles.homepageLayout}>
                <div className={styles.mainContent}>
                    <h1>Nuestros productos</h1>
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
                        onCheckout={checkoutCart}
                        onClear={clearCart}
                    />
                </div>
            </div>
        </div>
    );
};

export default Productos;
