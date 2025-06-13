import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import styles from './ProductoDetalle.module.css';
import {FaArrowLeft} from "react-icons/fa6";
import type {ArticuloManufacturado} from "../../models/articuloManufacturado.ts";
import {ROUTES} from "../../constants/routes.ts";
import {getDetallesArticuloManufacturado} from "../../services/articuloManufacturadoService.ts";
import {useCart} from "../../context/carrito/useCart.ts";

export const ProductoDetalle = () => {
    const {id} = useParams();
    const [producto, setProducto] = useState<ArticuloManufacturado | undefined>(undefined);
    const navigate = useNavigate();
    const {addToCart} = useCart();

    const cargarProducto = async (id: string | undefined) => {
        if (id) {
            return await getDetallesArticuloManufacturado(id);
        }
    };

    useEffect(() => {
        const fetch = async () => {
            const producto = await cargarProducto(id);
            setProducto(producto);
        };
        void fetch();
    }, [id]);

    if (!producto) {
        return null;
    }

    const handleGoBack = () => {
        navigate(ROUTES.PRODUCTOS);
    };

    const handleAddToCart = () => {
        addToCart(producto); // Agrega el producto al carrito usando el contexto
    };

    return (
        <div className={styles.detalleContainer}>
            <button
                className="volver-button"
                style={{marginTop: "40px"}}
                onClick={handleGoBack}
                aria-label="Volver"
                title="Volver">
                <FaArrowLeft/>
            </button>
            <div className={styles.detalleLeft}>
                <img
                    src={'https://placehold.co/300x200?text=Producto'}
                    alt={producto.denominacion}
                    className={styles.detalleImagen}
                />
                <div className={styles.detalleDescripcion}>
                    <h3>Descripción:</h3>
                    <p>{producto.descripcion}</p>
                </div>
            </div>

            <div className={styles.detalleRight}>
                <h2 className={styles.detalleNombre}>{producto.denominacion}</h2>
                <p className={styles.detallePrecio}>$ {producto.precioVenta.toFixed(2)}</p>
                <button
                    className={styles.addToCartButton}
                    onClick={handleAddToCart}
                >
                    Agregar al carrito
                </button>
            </div>
        </div>
    );
};