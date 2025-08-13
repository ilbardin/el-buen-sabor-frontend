import React, {useEffect, useState} from 'react';
import {initMercadoPago, Wallet} from '@mercadopago/sdk-react';
import {showAlert, showLoading} from "../../utils/alerts.ts";
import mercadoPagoLogo from '/assets/logo-mp.png';
import Swal from "sweetalert2";
import styles from './BotonMercadoMago.module.css';
import type {ArticuloManufacturado} from "../../models/articuloManufacturado.ts";
import {crearPeticionMP} from "../../services/mercadoPagoService.ts";

interface CartItem extends ArticuloManufacturado {
    cantidad: number;
}

interface Props {
    montoCarrito: number;
    items: CartItem[];
}

const BotonMercadoPago: React.FC<Props> = ({montoCarrito, items}) => {
    const [idPreference, setIdPreference] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const apiKey = import.meta.env.VITE_MERCADOPAGO_KEY;

        if (!apiKey) {
            setError('MercadoPago API key faltante o incorrecta.');
        } else {
            initMercadoPago(apiKey);
        }
    }, []);

    const handleComprar = async () => {
        if (items.length === 0) {
            await showAlert('Error', 'error', 'Agregue al menos un instrumento al carrito');
            return;
        }

        showLoading('Cargando Mercado Pago...');

        // TODO: ajustar detalles
        const pedido = {
            id: '',
            init_point: ''
        };

        try {
            const response = await crearPeticionMP(pedido);
            setIdPreference(response.id);
            Swal.close();
        } catch (err) {
            Swal.close();
            console.error("Error generando preferencia", err);
            await showAlert('Error', 'error', 'Ocurrió un error al generar la preferencia de pago.');
        }
    };

    if (error) {
        return (
            <div style={{color: 'red', backgroundColor: '#ffe6e6', padding: '1rem', textAlign: 'center'}}>
                {error}
            </div>
        );
    }

    return (
        <div className={styles.divBoton}>
            <button className={styles.btnMercadoPago} onClick={handleComprar}>
                <img src={mercadoPagoLogo} alt="Mercado Pago" className={styles.logoMercadoPago}/>
                Comprar con Mercado Pago
            </button>

            {idPreference && (
                <div className='divVisible' style={{width: '300px'}}>
                    <Wallet initialization={{preferenceId: idPreference}}/>
                </div>
            )}
        </div>
    );
};

export default BotonMercadoPago;
