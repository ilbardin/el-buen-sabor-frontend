import React, {useEffect, useState} from 'react';
import {initMercadoPago, Wallet} from '@mercadopago/sdk-react';
import {showAlert, showLoading} from "../../utils/alerts.ts";
import mercadoPagoLogo from '/assets/logo-mp.png';
import Swal from "sweetalert2";
import styles from './BotonMercadoMago.module.css';
import {crearPeticionMP} from "../../services/mercadoPagoService.ts";
import type {ItemCarritoMp} from "../../models/pedidoRequest.ts";

interface Props {
    montoCarrito: number;
    items: ItemCarritoMp[];
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
            await showAlert('Error', 'error', 'Agregue al menos un elemento al carrito');
            return;
        }

        showLoading('Cargando Mercado Pago...');

        const pedido = {
            montoCarrito,
            items
        };
        console.log(pedido);

        try {
            const response = await crearPeticionMP(pedido);
            console.log(response);
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
                Ir a pagar
            </button>

            {idPreference && (
                <div style={{width: '300px'}}>
                    <Wallet initialization={{
                        preferenceId: idPreference,
                        redirectMode: 'self'}}/>
                </div>
            )}
        </div>
    );
};

export default BotonMercadoPago;
