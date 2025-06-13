import React, {createContext, type ReactNode, useContext, useState} from 'react';
import type {ArticuloManufacturado} from '../models/articuloManufacturado';
import {savePedido} from '../services/articuloManufacturadoService.ts';
import {showAlert} from '../utils/alerts';

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

interface CartContextProps {
    cart: CartItem[];
    addToCart: (producto: ArticuloManufacturado) => void;
    removeFromCart: (id: number) => void;
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;
    clearCart: () => void;
    saveCart: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const saveCartToLocalStorage = (updatedCart: CartItem[]) => {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
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

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const saveCart = async () => {
        const subtotal = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        const gastosEnvio = 500; // Fijo, modifica según sea necesario
        const total = subtotal + gastosEnvio;

        // Crea los detalles del pedido
        const detalles = cart.map((item) => ({
            cantidad: item.cantidad,
            subTotal: item.precio * item.cantidad,
            articuloManufacturado: {id: item.id!},
        }));

        const pedido: PedidoRequest = {
            subtotal,
            gastosEnvio,
            total,
            tipoEnvio: 'delivery',
            detalles,
        };

        try {
            const response = await savePedido(pedido);
            await showAlert(
                '¡Pedido Guardado!',
                'success',
                `El pedido con ID ${response?.data.id} fue guardado correctamente.`
            );
            clearCart(); // Limpia el carrito después de guardar
        } catch (error) {
            console.error('Error al guardar el pedido:', error);
            await showAlert('Error', 'error', 'No se pudo guardar el pedido.');
        }
    };

    return (
        <CartContext.Provider
            value={{cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, saveCart}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextProps => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};