// import React, {useEffect, useRef, useState} from 'react';
// import {useLocation, useNavigate} from 'react-router';
// import {CARRITO_EXPIRATION_TIME} from "../../constants/constants.ts";
// import {showAlert} from "../../utils/alerts.ts";
// import {useCart} from "../../context/carrito/useCart.ts";
// import useConditionalBlocker from "../../hooks/useConditionalBlocker.tsx";
// import {ROUTES} from "../../constants/routes.ts";
//
// const DuracionCarritoAlert: React.FC = () => {
//     const {cart} = useCart();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const previousCart = useRef(cart);
//     const [cartModified, setCartModified] = useState(false);
//
//     const expirationInHours = Math.ceil(CARRITO_EXPIRATION_TIME / (60 * 60 * 1000));
//
//     useEffect(() => {
//         if (cart.length > 0) {
//             if (JSON.stringify(previousCart.current) !== JSON.stringify(cart)) {
//                 setCartModified(true);
//             }
//         } else {
//             setCartModified(false);
//         }
//
//         previousCart.current = cart;
//     }, [cart]);
//
//     const handleBlockNavigation = () => {
//         if (cart.length > 0 && cartModified) {
//             void showAlert(
//                 'Duración del carrito',
//                 'info',
//                 `Recuerda, tu carrito estará disponible solo por <br><strong>${expirationInHours}</strong> <strong>horas</strong>.`,
//                 true
//             ).then(() => {
//                 setCartModified(false);
//                 navigate(-1);
//             }).catch(() => {
//             });
//         }
//     };
//
//     useConditionalBlocker(handleBlockNavigation, cart.length > 0 && cartModified && location.pathname === ROUTES.PRODUCTOS);
//
//     return null;
// };
//
// export default DuracionCarritoAlert;