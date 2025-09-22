import {createContext} from "react";
import type {CartContextProps} from "./CarritoContext.tsx";

export const CartContext = createContext<CartContextProps>({
    cart: [],
    addToCart: () => {
    },
    removeFromCart: () => {
    },
    increaseQuantity: () => {
    },
    decreaseQuantity: () => {
    },
    clearCart: () => {
    },
    checkoutCart: async () => {
    },
    isItemInCart: () => false,
});
