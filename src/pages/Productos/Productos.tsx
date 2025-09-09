import React, { useEffect, useRef, useState } from "react";
import { getManufacturadosPorSucursal } from "../../services/articuloManufacturadoService";
import styles from "./Productos.module.css";
import type { ArticuloManufacturadoDisponible } from "../../models/articuloManufacturado.ts";
import { Carrito } from "../../components/Carrito/Carrito.tsx";
import { useCart } from "../../context/carrito/useCart.ts";
import { ROUTES } from "../../constants/routes.ts";
import NavbarCliente from "../../components/NavbarCliente/NavbarCliente.tsx";
import { useAuth } from "../../context/auth/useAuth.ts";
import type { Promocion } from "../../models/promocion.ts";
import { getPromociones } from "../../services/promocionService.ts";
import { ProductosHome } from "../ProductosHome/ProductosHome.tsx";
import type { ArticuloInsumo } from "../../models/articuloInsumo.ts";
import { getArticulosInsumo } from "../../services/ingredientesService.ts";
import { RiDiscountPercentLine } from "react-icons/ri";
import { AiFillHome } from "react-icons/ai";
import { FaPizzaSlice } from "react-icons/fa";
import { FaHamburger } from "react-icons/fa";
import { GiSandwich } from "react-icons/gi";
import { LuSandwich } from "react-icons/lu";
import { GiBeerBottle } from "react-icons/gi";
import { useSucursal } from "../../context/SucursalContext.tsx";

const Productos: React.FC = () => {
  const { setIsLoggingOut, usuario } = useAuth();

  const loginRef = useRef<HTMLDivElement>(null);
  const userIconRef = useRef<HTMLSpanElement>(null);

  const [productos, setProductos] = useState<ArticuloManufacturadoDisponible[]>(
    []
  );
  const { cart, increaseQuantity, decreaseQuantity, checkoutCart, clearCart } =
    useCart();
  const [ofertas, setOfertas] = useState<Promocion[]>([]);
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const { sucursalId } = useSucursal();
  useEffect(() => {
    async function cargarProductos() {
      const ofertas = await getPromociones();
      const productosStock = await getManufacturadosPorSucursal(sucursalId);
      console.log("productosStock: ", productosStock);
      const insumos = await getArticulosInsumo();
      console.log("insumos: ", insumos);
      setOfertas(ofertas);
      setProductos(productosStock);
      setInsumos(insumos);
    }

    void cargarProductos();
  }, [sucursalId]);

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

  const insumosFiltrados = insumos.filter(
    (i) =>
      i.denominacion.toLowerCase().includes(busqueda.toLowerCase()) &&
      !i.esParaElaborar
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
            icon: <AiFillHome />,
          },
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
            <div>
              <button
                className={styles.categoriaButton}
                onClick={() => {
                  const section = document.getElementById("promo");
                  section?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <RiDiscountPercentLine />
              </button>
              <button
                className={styles.categoriaButton}
                onClick={() => {
                  const section = document.getElementById("pizza");
                  section?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <FaPizzaSlice />
              </button>
              <button
                className={styles.categoriaButton}
                onClick={() => {
                  const section = document.getElementById("hamburguesa");
                  section?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <FaHamburger />
              </button>
              <button
                className={styles.categoriaButton}
                onClick={() => {
                  const section = document.getElementById("lomo");
                  section?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <GiSandwich />
              </button>
              <button
                className={styles.categoriaButton}
                onClick={() => {
                  const section = document.getElementById("Empanadas");
                  section?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <img style={{ height: "20px", filter: "invert(1)" }} src="https://cdn-icons-png.freepik.com/512/6003/6003915.png" alt="" />
              </button>
              <button
                className={styles.categoriaButton}
                onClick={() => {
                  const section = document.getElementById("sandwich");
                  section?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <LuSandwich />
              </button>
              <button
                className={styles.categoriaButton}
                onClick={() => {
                  const section = document.getElementById("bebida");
                  section?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <GiBeerBottle />
              </button>
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
                    <h3 id="promo" className={styles.title}>
                      OFERTAS
                    </h3>
                    <ProductosHome item={ofertas} />
                  </div>
                )}

                <div>
                  <h3 id="pizza" className={styles.title}>PIZZAS</h3>
                  <ProductosHome item={filtrarPorCategoria("Pizza")} />
                </div>

                <div>
                  <h3 id="hamburguesa" className={styles.title}>HAMBURGUESAS</h3>
                  <ProductosHome item={filtrarPorCategoria("Hamburguesa")} />
                </div>

                <div>
                  <h3 id="lomo" className={styles.title}>LOMOS</h3>
                  <ProductosHome
                    key={"lomo"}
                    item={filtrarPorCategoria("Lomo")}
                  />
                </div>

                <div>
                  <h3 id="sandwich" className={styles.title}>SANDWICHES</h3>
                  <ProductosHome
                    key={"lomo"}
                    item={filtrarPorCategoria("Sandwich")}
                  />
                </div>

                <div>
                  <h3 id="sandwich" className={styles.title}>EMPANADAS</h3>
                  <ProductosHome
                    key={"empanada"}
                    item={filtrarPorCategoria("Empanadas")}
                  />
                </div>

                <div>
                  <h3 id="bebida" className={styles.title}>GASEOSAS</h3>
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
