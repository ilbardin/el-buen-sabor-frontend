import React, {type ReactNode, useCallback, useEffect, useState} from 'react';
import type {ArticuloManufacturado} from '../../models/articuloManufacturado.ts';
import {savePedido} from '../../services/articuloManufacturadoService.ts';
import {showAlert} from '../../utils/alerts.ts';
import {CartContext} from './cartContext.ts';
import {useAuth} from "../auth/useAuth.ts";
import {CARRITO_EXPIRATION_TIME} from "../../constants/constants.ts";
import {tipoEnvio} from "../../components/TipoEnvio/TipoEnvio.tsx";

const CHECK_INTERVAL = 60000;

interface CartItem extends ArticuloManufacturado {
    cantidad: number;
    precio: number;
}

interface PedidoRequest {
    subtotal: number;
    gastosEnvio: number;
    total: number;
    tipoEnvio: 'delivery' | 'takeaway';
    detalles: {
        cantidad: number;
        subTotal: number;
        articuloManufacturado: { id: number };
    }[];
}

export interface CartContextProps {
    cart: CartItem[];
    addToCart: (producto: ArticuloManufacturado) => void;
    removeFromCart: (id: number) => void;
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;
    clearCart: () => void;
    saveCart: () => Promise<void>;
    isItemInCart: (id: number) => boolean;
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const {usuario} = useAuth();
    const userId = usuario?.email || 'guest';

    const [cart, setCart] = useState<CartItem[]>([]);

    const clearCart = useCallback(() => {
        setCart([]);
        localStorage.removeItem(`cart_${userId}`);
        localStorage.removeItem(`cart_${userId}_expires`);
    }, [userId]);

    const loadCart = useCallback(() => {
        const savedCart = localStorage.getItem(`cart_${userId}`);
        const expiration = localStorage.getItem(`cart_${userId}_expires`);

        if (savedCart && expiration) {
            const isExpired = Date.now() > parseInt(expiration, 10);

            if (!isExpired) {
                return JSON.parse(savedCart);
            }

            clearCart();
        }

        return [];
    }, [clearCart, userId]);

    useEffect(() => {
        const initialCart = loadCart();
        setCart(initialCart);
    }, [loadCart]);

    useEffect(() => {
        if (cart.length === 0) {
            return;
        }

        const interval = setInterval(() => {
            const expiration = localStorage.getItem(`cart_${userId}_expires`);

            if (expiration && Date.now() > parseInt(expiration, 10)) {
                clearCart();
                clearInterval(interval);
            }
        }, CHECK_INTERVAL);

        return () => clearInterval(interval);
    }, [cart, clearCart, userId]);

    const saveCartToLocalStorage = (updatedCart: CartItem[]) => {
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
        localStorage.setItem(`cart_${userId}_expires`, (Date.now() + CARRITO_EXPIRATION_TIME).toString());
    };

    const addToCart = (producto: ArticuloManufacturado) => {
        setCart((prev) => {
            const found = prev.find((item) => item.id === producto.id);
            if (found) {
                const updatedCart = prev.map((item) =>
                    item.id === producto.id ? {...item, cantidad: item.cantidad + 1} : item
                );
                saveCartToLocalStorage(updatedCart);
                return updatedCart;
            }
            const newCart = [...prev, {...producto, precio: Number(producto.precioVenta), cantidad: 1}];
            saveCartToLocalStorage(newCart);
            return newCart;
        });
    };

    const isItemInCart = (id: number) => {
        return cart.some((item) => item.id === id);
    };

    const removeFromCart = (id: number) => {
        setCart((prev) => {
            const updatedCart = prev.filter((item) => item.id !== id);
            saveCartToLocalStorage(updatedCart);
            return updatedCart;
        });
    };

    const increaseQuantity = (id: number) => {
        setCart((prev) => {
            const updatedCart = prev.map((item) =>
                item.id === id ? {...item, cantidad: item.cantidad + 1} : item
            );
            saveCartToLocalStorage(updatedCart);
            return updatedCart;
        });
    };

    const decreaseQuantity = (id: number) => {
        setCart((prev) => {
            const updatedCart = prev.reduce((acc, item) => {
                if (item.id === id) {
                    if (item.cantidad > 1) {
                        acc.push({...item, cantidad: item.cantidad - 1});
                    }
                } else {
                    acc.push(item);
                }
                return acc;
            }, [] as CartItem[]);
            saveCartToLocalStorage(updatedCart);
            return updatedCart;
        });
    };

    const saveCart = async () => {
        const tipoEnvioSeleccionado = await tipoEnvio();

        if (!tipoEnvioSeleccionado) {
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        const gastosEnvio = tipoEnvioSeleccionado === "delivery" ? 500 : 0;
        const total = subtotal + gastosEnvio;

        const detalles = cart.map((item) => ({
            cantidad: item.cantidad,
            subTotal: item.precio * item.cantidad,
            articuloManufacturado: {id: item.id!},
        }));

        const pedido: PedidoRequest = {
            subtotal,
            gastosEnvio,
            total,
            tipoEnvio: tipoEnvioSeleccionado,
            detalles,
        };

        try {
            const response = await savePedido(pedido);
            await showAlert(
                '¡Pedido Guardado!',
                'success',
                `El pedido con ID ${response?.data.id} fue guardado correctamente.`
            );
            clearCart();
        } catch (error) {
            console.error('Error al guardar el pedido:', error);
            await showAlert('Error', 'error', 'No se pudo guardar el pedido.');
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                saveCart,
                isItemInCart
            }}>
            {children}
        </CartContext.Provider>
    );
};