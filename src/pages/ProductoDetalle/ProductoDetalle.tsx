import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import styles from './ProductoDetalle.module.css';
import {FaArrowLeft} from "react-icons/fa6";
import type {ArticuloManufacturado} from "../../models/articuloManufacturado.ts";
import {ROUTES} from "../../constants/routes.ts";
import {getDetallesArticuloManufacturado} from "../../services/articuloManufacturadoService.ts";

export const ProductoDetalle = () => {
    const {id} = useParams();
    const [producto, setProducto] = useState<ArticuloManufacturado | undefined>(undefined);
    const navigate = useNavigate();

    const cargarProducto = async (id: string | undefined) => {
        if (id) {
            return await getDetallesArticuloManufacturado(id);
        }
    };

    useEffect(() => {
        const fetch = async () => {
            const producto = await cargarProducto(id);
            console.log(producto);
            setProducto(producto);
        };
        void fetch();
    }, [id]);

    if (!producto) {
        return;
    }

    const handleGoBack = () => {
        navigate(ROUTES.PRODUCTOS);
    }

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
                <img src={'https://placehold.co/300x200?text=Producto'} alt={producto.denominacion} className={styles.detalleImagen}/>
                <div className={styles.detalleDescripcion}>
                    <h3>Descripción:</h3>
                    <p>{producto.descripcion}</p>
                </div>
            </div>

            <div className={styles.detalleRight}>
                <h2 className={styles.detalleNombre}>{producto.denominacion}</h2>
                <p className={styles.detallePrecio}>$ {producto.precioVenta}</p>
            </div>
        </div>
    );
};
