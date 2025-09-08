import React, {useEffect, useRef, useState} from "react";
import {getManufacturadosPorSucursal} from "../../services/articuloManufacturadoService";
import styles from "./Productos.module.css";
import type {ArticuloManufacturadoDisponible} from "../../models/articuloManufacturado.ts";
import {Carrito} from "../../components/Carrito/Carrito.tsx";
import {useCart} from "../../context/carrito/useCart.ts";
import {ROUTES} from "../../constants/routes.ts";
import NavbarCliente from "../../components/NavbarCliente/NavbarCliente.tsx";
import {useAuth} from "../../context/auth/useAuth.ts";
import type {Promocion} from "../../models/promocion.ts";
import {getPromociones} from "../../services/promocionService.ts";
import {ProductosHome} from "../ProductosHome/ProductosHome.tsx";
import type {ArticuloInsumo} from "../../models/articuloInsumo.ts";
import {getArticulosInsumo} from "../../services/ingredientesService.ts";
import {AiFillHome} from "react-icons/ai";

const Productos: React.FC = () => {
    const {setIsLoggingOut, usuario} = useAuth();

    const loginRef = useRef<HTMLDivElement>(null);
    const userIconRef = useRef<HTMLSpanElement>(null);

    const [productos, setProductos] = useState<ArticuloManufacturadoDisponible[]>([]);
    const {cart, increaseQuantity, decreaseQuantity, checkoutCart, clearCart} = useCart();
    const [ofertas, setOfertas] = useState<Promocion[]>([]);
    const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
    const [busqueda, setBusqueda] = useState("");


    useEffect(() => {
        async function cargarProductos() {
            const ofertas = await getPromociones();
            const productosStock = await getManufacturadosPorSucursal(1);
            console.log('productosStock: ', productosStock)
            const insumos = await getArticulosInsumo();
            console.log('insumos: ', insumos)
            setOfertas(ofertas);
            setProductos(productosStock);
            setInsumos(insumos);
        }

        void cargarProductos();
    }, []);

    useEffect(() => {
        setIsLoggingOut(false);
    }, [setIsLoggingOut]);

    const filtrarPorCategoria = (nombreCategoria: string) => {
        return productos.filter(
            (producto) => producto.nombreCategoria === nombreCategoria
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
                    {
                        label: "HOME",
                        to: ROUTES.HOME,
                        requiresAuth: true,
                        icon: <AiFillHome/>
                    }
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
                                maxLength={50}
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
                                {ofertas.length > 0 && (
                                    <div>
                                        <h3 className={styles.title}>OFERTAS</h3>
                                        <ProductosHome item={ofertas}/>
                                    </div>
                                )}

                                <div>
                                    <h3 className={styles.title}>PIZZAS</h3>
                                    <ProductosHome item={filtrarPorCategoria("Pizza")}/>
                                </div>

                                <div>
                                    <h3 className={styles.title}>HAMBURGUESAS</h3>
                                    <ProductosHome item={filtrarPorCategoria("Hamburguesa")}/>
                                </div>

                                <div>
                                    <h3 className={styles.title}>LOMOS</h3>
                                    <ProductosHome
                                        key={"lomo"}
                                        item={filtrarPorCategoria("Lomo")}
                                    />
                                </div>

                                <div>
                                    <h3 className={styles.title}>GASEOSAS</h3>
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
