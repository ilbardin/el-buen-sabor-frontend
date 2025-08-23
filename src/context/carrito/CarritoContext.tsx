import React, {type ReactNode, useCallback, useEffect, useState} from 'react';
import type {ArticuloManufacturado} from '../../models/articuloManufacturado.ts';
import {savePedido} from '../../services/articuloManufacturadoService.ts';
import {showAlert, showLoading} from '../../utils/alerts.ts';
import {CartContext} from './cartContext.ts';
import {useAuth} from "../auth/useAuth.ts";
import {CARRITO_EXPIRATION_TIME} from "../../constants/constants.ts";
import {tipoEnvio} from "../../components/TipoEnvio/TipoEnvio.tsx";
import type {PedidoRequest} from "../../models/pedidoRequest.ts";
import Swal from "sweetalert2";
import {crearPeticionMP} from "../../services/mercadoPagoService.ts";
import {mapCartItemsToMpItems} from "../../utils/funcionesReutilizables.ts";

const CHECK_INTERVAL = 60000;

interface CartItem extends ArticuloManufacturado {
    cantidad: number;
    precio: number;
}

export interface CartContextProps {
    cart: CartItem[];
    addToCart: (producto: ArticuloManufacturado) => void;
    removeFromCart: (id: number) => void;
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;
    clearCart: () => void;
    checkoutCart: () => Promise<void>;
    isItemInCart: (id: number) => boolean;
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const {usuario} = useAuth();
    const clienteId = usuario?.cliente?.id || 1; // seteo en 1 para el caso del usuario admin

    const [cart, setCart] = useState<CartItem[]>([]);

    const clearCart = useCallback(() => {
        setCart([]);
        localStorage.removeItem(`cart_${clienteId}`);
        localStorage.removeItem(`cart_${clienteId}_expires`);
    }, [clienteId]);

    const loadCart = useCallback(() => {
        const savedCart = localStorage.getItem(`cart_${clienteId}`);
        const expiration = localStorage.getItem(`cart_${clienteId}_expires`);

        if (savedCart && expiration) {
            const isExpired = Date.now() > parseInt(expiration, 10);

            if (!isExpired) {
                return JSON.parse(savedCart);
            }

            clearCart();
        }

        return [];
    }, [clearCart, clienteId]);

    useEffect(() => {
        const initialCart = loadCart();
        setCart(initialCart);
    }, [loadCart]);

    useEffect(() => {
        if (cart.length === 0) {
            return;
        }

        const interval = setInterval(() => {
            const expiration = localStorage.getItem(`cart_${clienteId}_expires`);

            if (expiration && Date.now() > parseInt(expiration, 10)) {
                clearCart();
                clearInterval(interval);
            }
        }, CHECK_INTERVAL);

        return () => clearInterval(interval);
    }, [cart, clearCart, clienteId]);

    const saveCartToLocalStorage = (updatedCart: CartItem[]) => {
        localStorage.setItem(`cart_${clienteId}`, JSON.stringify(updatedCart));
        localStorage.setItem(`cart_${clienteId}_expires`, (Date.now() + CARRITO_EXPIRATION_TIME).toString());
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

    const checkoutCart = async () => {
        if (!clienteId) {
            await showAlert("Error", "error", "No ha iniciado sesión.");
            return;
        }

        const tipoEnvioSeleccionado = await tipoEnvio();
        if (!tipoEnvioSeleccionado) return;

        const subtotal = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        const gastosEnvio = tipoEnvioSeleccionado === "delivery" ? 500 : 0;
        const total = subtotal + gastosEnvio;

        const detalles = cart.map((item) => ({
            cantidad: item.cantidad,
            subtotal: item.precio * item.cantidad,
            articuloManufacturado: {id: item.id!},
        }));

        const pedido: PedidoRequest = {
            subtotal,
            gastosEnvio,
            total,
            tipoEnvio: tipoEnvioSeleccionado,
            detalles,
            cliente: {id: clienteId},
            sucursalEmpresa: {id: 1} // TODO: ajustar
        };

        try {
            const response = await savePedido(pedido);
            const idPedido: string = response?.data.id.toString();

            const mpItems = mapCartItemsToMpItems(cart);

            showLoading('Cargando Mercado Pago...');

            const mpResponse = await crearPeticionMP({
                montoCarrito: total,
                items: mpItems,
                idPedido,
            });

            if (mpResponse.initPoint) {
                window.location.href = mpResponse.initPoint;
                clearCart(); // TODO: despues limpiar carrito si el pago fue exitoso
            } else {
                await showAlert('Error', 'error', 'No se pudo obtener el link de pago.');
            }

        } catch (error) {
            Swal.close();
            console.error('Error en el checkout:', error);
            await showAlert('Error', 'error', 'Ocurrió un error al procesar el checkout.');
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
                checkoutCart,
                isItemInCart
            }}>
            {children}
        </CartContext.Provider>
    );
};
