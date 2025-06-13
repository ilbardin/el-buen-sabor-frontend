import React, {useState} from 'react';
import type {ArticuloManufacturado} from '../../models/articuloManufacturado';
import {MdAddShoppingCart} from 'react-icons/md';
import styles from './ProductoManufacturadoCard.module.css';
import {useNavigate} from 'react-router-dom';
import {ROUTES} from "../../constants/routes.ts";

interface Props {
    producto: ArticuloManufacturado;
    onAdd: (producto: ArticuloManufacturado) => void;
    onDelete: (id: number) => void;
}

export const ArticuloManufacturadoCard: React.FC<Props> = ({producto, onAdd}) => {
    const [imgSrc, setImgSrc] = useState('https://placehold.co/300x200?text=Producto');
    const navigate = useNavigate();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAdd(producto);
    };

    const handleDetails = () => {
        navigate(`${ROUTES.PRODUCTOS}/${producto.id}`);
    };

    return (
        <div className={styles.card} onClick={handleDetails}>
            <div className={styles.cardImgWrapper}>
                <img
                    src={imgSrc}
                    alt={producto.denominacion}
                    className={styles.cardImg}
                    onError={() =>
                        setImgSrc(`https://placehold.co/300x200?text=${encodeURIComponent(producto.denominacion)}`)
                    }/>
            </div>
            <h3>{producto.denominacion}</h3>
            <p className={styles.subtitle}>{producto.descripcion}</p>
            <p className={styles.price}>${producto.precioVenta.toFixed(2)}</p>
            <button className={`${styles.btn} ${styles.btnAdd}`} onClick={handleAddToCart}>
                <MdAddShoppingCart size={20}/>
                &nbsp;Agregar al carrito
            </button>
        </div>
    );
};
