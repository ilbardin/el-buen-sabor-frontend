import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import styles from './ProductoDetalle.module.css';
import {FaArrowLeft} from "react-icons/fa6";
import type {ArticuloManufacturado} from "../../models/articuloManufacturado.ts";
import {ROUTES} from "../../constants/routes.ts";
import {getDetallesArticuloManufacturado} from "../../services/articuloManufacturadoService.ts";
import {useCart} from "../../context/carrito/useCart.ts";
import {MdAddShoppingCart} from "react-icons/md";
import {showAlert} from '../../utils/alerts';
import {FaShoppingCart} from "react-icons/fa";

export const ProductoDetalle = () => {
    const {id} = useParams();
    const [producto, setProducto] = useState<ArticuloManufacturado | undefined>(undefined);
    const navigate = useNavigate();
    const {addToCart, isItemInCart} = useCart(); // Usamos la nueva función del contexto

    const cargarProducto = async (id: string | undefined) => {
        if (id) {
            return await getDetallesArticuloManufacturado(id);
        }
    };

    useEffect(() => {
        const fetchProducto = async () => {
            const producto = await cargarProducto(id);
            setProducto(producto);
        };
        void fetchProducto();
    }, [id]);

    if (!producto) {
        return null;
    }

    const handleGoBack = () => {
        navigate(ROUTES.PRODUCTOS);
    };

    const handleAddToCart = () => {
        addToCart(producto);
        showAlert('Producto agregado', 'success', 'El producto fue agregado al carrito exitosamente.').then(() => handleGoBack());
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
                {producto.id !== undefined && !isItemInCart(producto.id) ? (
                    <button
                        className={styles.botonAgregar}
                        onClick={handleAddToCart}
                    >
                        <MdAddShoppingCart size={20}/>
                        &nbsp;
                        Agregar al carrito
                    </button>
                ) : (
                    <div className={styles.productoAgregado}>
                        <FaShoppingCart size={20} style={{color: "var(--color-terciario)", marginBottom: "3px"}}/>
                        <p>Producto en el carrito.</p>
                    </div>
                )}
            </div>
        </div>
    );
};