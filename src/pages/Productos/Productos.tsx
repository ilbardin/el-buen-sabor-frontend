import React, { useCallback, useEffect, useState } from "react";
import {
  getArticulosManufacturados,
  savePedido,
} from "../../services/articuloManufacturadoService";
import { ArticuloManufacturadoCard } from "../../components/ProductosManofacturadosCard/ProductosManofacturadsCard";
import { Carrito } from "../../components/Cart/Cart";
import type { ArticuloManufacturado } from "../../models/articuloManufacturado";
import type { PedidoRequest } from "../../models/PedidoRequest";
import { showAlert } from "../../utils/alerts";
import styles from "./Productos.module.css";

interface CartItem extends ArticuloManufacturado {
  cantidad: number;
  precio: number;
}

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<ArticuloManufacturado[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const cargarProductos = useCallback(() => {
    getArticulosManufacturados()
      .then((res) => setProductos(res))
      .catch((err) => {
        console.error("Error al cargar productos", err);
        void showAlert("Error", "error", "Error al cargar productos");
      });
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleDelete = (id: number) => {
    setProductos((prev) => prev.filter((prod) => prod.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = (prod: ArticuloManufacturado) => {
    const precioNum = Number(prod.precioVenta);
    setCart((prev) => {
      const found = prev.find((it) => it.id === prod.id);
      if (found) {
        return prev.map((it) =>
          it.id === prod.id ? { ...it, cantidad: it.cantidad + 1 } : it
        );
      }
      return [...prev, { ...prod, precio: precioNum, cantidad: 1 }];
    });
  };

  const handleSave = async () => {
    console.log("Cart items:", cart);

    const subtotal = cart.reduce(
      (sum, it) => sum + Number(it.precio) * it.cantidad,
      0
    );
    const gastosEnvio = 500;
    const total = subtotal + gastosEnvio;

    const detalles = cart.map((item) => ({
      cantidad: item.cantidad,
      subTotal: Number(item.precio) * item.cantidad,
      articuloManufacturado: { id: item.id! },
    }));

    const pedido: PedidoRequest = {
      subtotal,
      gastosEnvio,
      total,
      tipoEnvio: "delivery",
      detalles,
    };

    console.log("Pedido a enviar:", pedido);

    try {
      const res = await savePedido(pedido);
      await showAlert(
        "Éxito",
        "success",
        `¡El pedido con id ${res.data.id} se guardó correctamente!`
      );
      setCart([]);
      localStorage.removeItem("cart");
    } catch (err) {
      console.error("Error al guardar el pedido:", err);
      await showAlert(
        "Error",
        "error",
        "Ocurrió un error al guardar el pedido."
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

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
                onAdd={handleAdd}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.sidebar}>
        <Carrito items={cart} onSave={handleSave} onClear={handleClearCart} />
      </div>
    </div>
  );
};

export default Productos;
