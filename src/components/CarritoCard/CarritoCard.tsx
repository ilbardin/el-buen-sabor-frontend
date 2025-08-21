import {forwardRef} from 'react';

import styles from './CarritoCard.module.css';
import {Carrito} from "../Carrito/Carrito.tsx";
import {useCart} from "../../context/carrito/useCart.ts";

type CarritoCardProps = {
    showCart: boolean;
    isClosing: boolean;
    position: { top: number; left: number };
    onHide: () => void;
};

const CarritoCard = forwardRef<HTMLDivElement, CarritoCardProps>(
    ({showCart, isClosing, position}, ref) => {
        const {cart, saveCart, increaseQuantity, decreaseQuantity, clearCart} = useCart();

        if (!showCart && !isClosing) return null;

        return (
            <div
                className={`${styles.carritoCard} ${isClosing ? styles.fadeOut : styles.fadeIn}`}
                style={{
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    position: 'absolute',
                }}
                ref={ref}
            >
                <Carrito
                    items={cart}
                    onIncrease={increaseQuantity}
                    onDecrease={decreaseQuantity}
                    onSave={saveCart}
                    onClear={clearCart}
                />
            </div>
        );
    }
);

CarritoCard.displayName = 'CarritoCard';

export default CarritoCard;

