import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import type { ArticuloManufacturado } from '../../models/articuloManufacturado';
import "./Cart.css"

interface CartItem extends ArticuloManufacturado {
  cantidad: number;
}

interface CartProps {
  items: CartItem[];
  onSave: () => void;
  onClear: () => void;
}

export const Carrito: React.FC<CartProps> = ({ items, onSave, onClear }) => {
  const total = items.reduce((sum, it) => sum + it.precioVenta * it.cantidad, 0);

  return (
    <div className="cart">
      <div className="carrito-titulo">
        <FaShoppingCart size={20} />
        &nbsp;<label>Carrito</label>
      </div>

      {items.length === 0 ? (
        <p className="empty">El carrito está vacío</p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map(({ id, denominacion, cantidad, precioVenta }) => (
              <li key={id} className="cart-item">
                <div className="item-info">
                  <span className="item-name">{denominacion}</span>
                  <span className="item-qty">Cantidad: {cantidad}</span>
                </div>
                <div className="item-total">
                  ${(precioVenta * cantidad).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <p className="cart-total">
              Total: <strong>${total.toFixed(2)}</strong>
            </p>
            <button
              className="btn-save"
              disabled={items.length === 0}
              onClick={onSave}
            >
              Guardar Carrito
            </button>
            <button
              className="btn-clear"
              disabled={items.length === 0}
              onClick={onClear}
            >
              Vaciar Carrito
            </button>
          </div>
        </>
      )}
    </div>
  );
};
