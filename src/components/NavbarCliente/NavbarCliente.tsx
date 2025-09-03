import React, {type RefObject, useContext, useState} from "react";
import {Link} from "react-router-dom";
import {FaShoppingCart, FaUser} from "react-icons/fa";
import styles from "./NavbarCliente.module.css";
import CarritoCard from "../CarritoCard/CarritoCard.tsx";
import LoginCard from "../LoginCard/LoginCard.tsx";
import {CartContext} from "../../context/carrito/cartContext.ts";
import {useAuthHandlers} from "../../hooks/useAuthHandlers.ts";

export interface NavLink {
    label: string;
    to: string;
    requiresAuth?: boolean;
}

export interface NavbarProps {
    usuario: { nombre: string; apellido: string } | null;
    navLinks: NavLink[];

    // props carrito opcionales
    showCart?: boolean;
    isCartClosing?: boolean;
    cartPosition?: { top: number; left: number };
    toggleCart?: () => void;
    handleHideCart?: () => void;
    cartRef?: RefObject<HTMLDivElement | null>;
    cartIconRef?: RefObject<HTMLSpanElement | null>;

    // props login
    showLogin: boolean;
    isClosing: boolean;
    loginCardPosition: { top: number; left: number };
    toggleLogin: () => void;
    handleHide: () => void;
    loginRef: RefObject<HTMLDivElement | null>;
    userIconRef: RefObject<HTMLSpanElement | null>;

    getInitials: (nombre: string, apellido: string) => string;
}

const NavbarCliente: React.FC<NavbarProps> = ({
                                                  usuario,
                                                  navLinks,
                                                  showCart,
                                                  isCartClosing,
                                                  cartPosition,
                                                  toggleCart,
                                                  handleHideCart,
                                                  cartRef,
                                                  cartIconRef,
                                                  showLogin,
                                                  isClosing,
                                                  loginCardPosition,
                                                  toggleLogin,
                                                  handleHide,
                                                  loginRef,
                                                  userIconRef,
                                                  getInitials,
                                              }) => {
    const {cart} = useContext(CartContext);
    const existeCarrito = cart.length > 0;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {handleLogin, handleUserLogout} = useAuthHandlers(username, password);

    return (
        <header className={styles.navbar}>
            <div className={styles.logo}>
                <span>EL BUEN SABOR™</span>
            </div>

            <nav className={styles.navLinks}>
                {navLinks.map(({label, to, requiresAuth}, idx) => {
                    if (requiresAuth && !usuario) return null;
                    return (
                        <Link key={idx} to={to}>
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.actions}>
                {/* Renderizar carrito solo si todas las props necesarias están definidas */}
                {usuario && toggleCart && cartIconRef && showCart !== undefined && isCartClosing !== undefined && cartPosition && handleHideCart && cartRef && (
                    <>
            <span
                className={styles.icon}
                onClick={toggleCart}
                ref={cartIconRef}
                style={{position: "relative"}}
            >
              <FaShoppingCart/>
                {existeCarrito && (
                    <span
                        className={styles.cartDot}
                        style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: "red",
                        }}
                    />
                )}
            </span>

                        <CarritoCard
                            showCart={showCart}
                            isClosing={isCartClosing}
                            position={cartPosition}
                            onHide={handleHideCart}
                            ref={cartRef}
                        />
                    </>
                )}

                <span className={styles.icon} onClick={toggleLogin} ref={userIconRef}>
          {usuario ? (
              <div className={styles.userCircle}>
                  {getInitials(usuario.nombre, usuario.apellido)}
              </div>
          ) : (
              <FaUser/>
          )}
        </span>

                <LoginCard
                    showLogin={showLogin}
                    isClosing={isClosing}
                    loginCardPosition={loginCardPosition}
                    handleLogin={handleLogin}
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    onLogout={handleUserLogout}
                    onHide={handleHide}
                    ref={loginRef}
                />
            </div>
        </header>
    );
};

export default NavbarCliente;
