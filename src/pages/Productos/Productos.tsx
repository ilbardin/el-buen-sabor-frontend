import React, { useCallback, useEffect, useState } from "react";
import { getArticulosManufacturados } from "../../services/articuloManufacturadoService";
import { ArticuloManufacturadoCard } from "../../components/ProductoManufacturadoCard/ProductoManufacturadoCard.tsx";
import styles from "./Productos.module.css";
import type { ArticuloManufacturado } from "../../models/articuloManufacturado.ts";
import { Carrito } from "../../components/Carrito/Carrito.tsx";
import { useCart } from "../../context/carrito/useCart.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes.ts";
import Prueba from "../Prueba/Prueba.tsx";
import type { Promocion } from "../../models/promocion.ts";
import { getPromociones } from "../../services/promocionService.ts";

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<ArticuloManufacturado[]>([]);
  const { cart, increaseQuantity, decreaseQuantity, checkoutCart, clearCart } =
    useCart();
  const [ofertas, setOfertas] = useState<Promocion[]>();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarOfertas() {
      const ofertas = await getPromociones();
      setOfertas(ofertas);
    }
    async function cargarProductosManofacturados() {
      const productos = await getArticulosManufacturados();
      setProductos(productos);
    }
      void cargarOfertas();
      void cargarProductosManofacturados();
  }, []);

  // TODO: implementar una nueva pagina con el estado del pedido
  // TODO: este metodo va a estar en la pagina del estado del pedido
  // limpia la url
  useEffect(() => {
    if (location.search.includes("preference_id")) {
      clearCart();
      navigate(ROUTES.PRODUCTOS, { replace: true });
    }
  }, [clearCart, location, navigate]);

  return (
    <>
      <div className={styles.homepageLayout}>
        <div className={styles.mainContent}>
          <div>
            <h3 className={styles.title}>Ofertas</h3>
            <Prueba productos={ofertas} />
          </div>
          <div>
            <h3 className={styles.title}>Productos</h3>
            <Prueba productos={productos}/>
          </div>
          <div className={styles.gridContainer}>
            <div className={styles.grid}>
              {productos.map((prod) => (
                <ArticuloManufacturadoCard key={prod.id} producto={prod} />
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
    </>
  );
};

export default Productos;
