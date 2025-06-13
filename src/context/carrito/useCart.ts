import {useContext} from 'react';
import type {CartContextProps} from './CarritoContext.tsx';
import {CartContext} from "./cartContext.ts";

export const useCart = (): CartContextProps => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};