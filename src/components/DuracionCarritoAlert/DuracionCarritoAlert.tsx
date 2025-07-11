import React, {useEffect, useMemo, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {CARRITO_EXPIRATION_TIME} from "../../constants/constants.ts";
import {showAlert} from "../../utils/alerts.ts";
import {useCart} from "../../context/carrito/useCart.ts";


const DuracionCarritoAlert: React.FC = () => {
    const location = useLocation();
    const {cart} = useCart();
    const [alertShown, setAlertShown] = useState(false);

    const expirationInHours = useMemo(() => Math.ceil(CARRITO_EXPIRATION_TIME / (60 * 60 * 1000)), []);

    useEffect(() => {
        if (location.pathname !== '/productos' && cart.length > 0 && !alertShown) {
            void showAlert(
                'Duración del carrito',
                'info',
                `Recuerda, tu carrito estará disponible solo por ${expirationInHours} hora(s).`,
                true
            );
            setAlertShown(true);
        }
    }, [location.pathname, cart.length, alertShown, expirationInHours]);

    return null;
};

export default DuracionCarritoAlert;