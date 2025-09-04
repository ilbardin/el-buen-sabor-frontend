import React, {useEffect, useRef, useState} from "react";
import {getArticulosManufacturados} from "../../services/articuloManufacturadoService";
import styles from "./Productos.module.css";
import type {ArticuloManufacturado} from "../../models/articuloManufacturado.ts";
import {Carrito} from "../../components/Carrito/Carrito.tsx";
import {useCart} from "../../context/carrito/useCart.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {ROUTES} from "../../constants/routes.ts";
import NavbarCliente from "../../components/NavbarCliente/NavbarCliente.tsx";
import {useAuth} from "../../context/auth/useAuth.ts";
import type {Promocion} from "../../models/promocion.ts";
import {getPromociones} from "../../services/promocionService.ts";
import {ProductosHome} from "../ProductosHome/ProductosHome.tsx";
import type {ArticuloInsumo} from "../../models/articuloInsumo.ts";
import {getArticulosInsumo} from "../../services/ingredientesService.ts";

const Productos: React.FC = () => {
    const {setIsLoggingOut, usuario} = useAuth();

    const loginRef = useRef<HTMLDivElement>(null);
    const userIconRef = useRef<HTMLSpanElement>(null);

    const [productos, setProductos] = useState<ArticuloManufacturado[]>([]);
    const {cart, increaseQuantity, decreaseQuantity, checkoutCart, clearCart} = useCart();
    const [ofertas, setOfertas] = useState<Promocion[]>([]);
    const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");


    useEffect(() => {
        async function cargarProductos() {
            const ofertas = await getPromociones();
            const productos = await getArticulosManufacturados();
            const insumos = await getArticulosInsumo();
            setOfertas(ofertas);
            setProductos(productos);
            setInsumos(insumos);
        }

        void cargarProductos();
    }, []);

    // TODO: implementar una nueva pagina con el estado del pedido
    // TODO: este metodo va a estar en la pagina del estado del pedido
    // limpia la url
    useEffect(() => {
        if (location.search.includes("preference_id")) {
            clearCart();
            navigate(ROUTES.PRODUCTOS, {replace: true});
        }
    }, [clearCart, location, navigate]);

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

    const filtrarPorCategoria = (nombreCategoria: string) => {
        return productos.filter(
            (producto) => producto.categoria === nombreCategoria
        );
    };

    // BUSCADOR FILTRO

    const handleChangeBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value);
    };

    const productosFiltrados = productos.filter((p) =>
        p.denominacion.toLowerCase().includes(busqueda.toLowerCase())
    );

    const insumosFiltrados = insumos.filter((i) =>
        (i.denominacion.toLowerCase().includes(busqueda.toLowerCase()) && !i.esParaElaborar)
    );

    const ofertasFiltradas = ofertas.filter((o) =>
        o.denominacion.toLowerCase().includes(busqueda.toLowerCase())
    );


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
            <>
                <div className={styles.homepageLayout}>
                    <div className={styles.mainContent}>
                        <div className={styles.filtrosContainer}>
                            <input
                                type="text"
                                placeholder="Buscar"
                                onChange={handleChangeBusqueda}
                                className={styles.filtroInput}
                                value={busqueda}
                            />
                        </div>
                        {busqueda ? (
                            <div>
                                <h3 className={styles.title}>Resultados</h3>
                                <ProductosHome
                                    item={[
                                        ...productosFiltrados,
                                        ...insumosFiltrados,
                                        ...ofertasFiltradas,
                                    ]}
                                />

                            </div>
                        ) : (
                            <>
                                <div>
                                    <h3 className={styles.title}>Ofertas</h3>
                                    <ProductosHome item={ofertas}/>
                                </div>
                                <div>
                                    <h3 className={styles.title}>Pizza</h3>
                                    <ProductosHome item={filtrarPorCategoria("Pizza")}/>
                                </div>
                                <div>
                                    <h3 className={styles.title}>Hamburguesa</h3>
                                    <ProductosHome item={filtrarPorCategoria("Hamburguesa")}/>
                                </div>
                                <div>
                                    <h3 className={styles.title}>Lomo</h3>
                                    <ProductosHome
                                        key={"lomo"}
                                        item={filtrarPorCategoria("Lomo")}
                                    />
                                </div>
                                <div>
                                    <h3 className={styles.title}>Gaseosas</h3>
                                    <ProductosHome
                                        key={"bebidas"}
                                        item={insumos.filter((insumo) =>
                                            insumo.categorias.some(
                                                (categoria) => categoria === "Bebidas"
                                            )
                                        )}
                                    />
                                </div>
                            </>
                        )}
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
            </>
        </div>
    );
};

export default Productos;
