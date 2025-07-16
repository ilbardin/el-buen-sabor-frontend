import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ROUTES} from '../../constants/routes.ts';
import imagenPizza from '/pizza.png';
import styles from './LandingPage.module.css';
import {FaShoppingCart, FaUser} from 'react-icons/fa';
import {showAlert, showLoading} from "../../utils/alerts.ts";
import axiosInstance from "../../api/axiosInstance.ts";
import type {UserData} from "../../models/usuario/usuario.ts";
import {LOGIN_URL} from "../../constants/constants.ts";
import Swal from "sweetalert2";
import {UserRole} from "../../models/usuario/userRoles.ts";
import type {AxiosError} from "axios";
import type {GenericError} from "../../models/errorResponseModel.ts";
import LoginCard from "../../components/LoginCard/LoginCard.tsx";
import {useAuth} from "../../context/auth/useAuth.ts";
import {alertaCarrito, existeCarrito} from "../../utils/funcionesReutilizables.ts";

type LoginProps = {
    onLoginSuccess: (userData: UserData) => void;
};

export const LandingPage = ({onLoginSuccess}: LoginProps) => {
    const {logout, setIsLoggingOut} = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<null | { nombre: string; apellido: string }>(null);
    const [loginCardPosition, setLoginCardPosition] = useState<{ top: number; left: number }>({top: 0, left: 0});
    const [showLogin, setShowLogin] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const navigate = useNavigate();

    const loginRef = useRef<HTMLDivElement>(null);
    const userIconRef = useRef<HTMLSpanElement>(null);

    const handleHide = () => {
        setShowLogin(false);
        setIsClosing(false);
    };

    const toggleLogin = useCallback(() => {
        if (showLogin) {
            setIsClosing(true);
            setTimeout(() => {
                setShowLogin(false);
                setIsClosing(false);
            }, 300);
        } else {
            setShowLogin(true);
        }
    }, [showLogin]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            showLoading('Iniciando sesión...');
            const response = await axiosInstance.post<UserData>(LOGIN_URL, {username, password});
            handleSuccess(response.data);
        } catch (err: any) {
            await handleError(err);
        }
    };

    const handleUserLogout = async () => {
        const performLogout = () => {
            logout();
            setUser(null);
            navigate(ROUTES.HOME);
        };

        if (existeCarrito()) {
            const confirmacion = await alertaCarrito();

            if (!confirmacion) {
                return;
            }
        }

        performLogout();
    };

    const handleSuccess = (data: UserData) => {
        Swal.close();
        onLoginSuccess(data);

        const storedUser = localStorage.getItem('usuario');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const navigateByRole = (role: UserRole) => {
            switch (role) {
                case UserRole.Admin:
                    navigate(ROUTES.HOME_ADMIN);
                    break;
                case UserRole.Cliente:
                    navigate(ROUTES.HOME);
                    break;
                default:
                    console.warn(`Rol sin programar: ${role}`);
                    navigate(ROUTES.HOME);
            }
        };

        navigateByRole(data.user.rol);
    };

    const handleError = async (err: AxiosError | never) => {
        Swal.close();

        if ((err as GenericError).response?.data) {
            const backendError = err as GenericError;
            console.error(backendError.response.data);
            await showAlert('Error', 'error', backendError.response.data);
        } else {
            console.error(err);
            if (err.isAxiosError) {
                await showAlert('Error', 'error', 'Error de red.');
            }
        }
    };

    const getInitials = (name: string, surname: string) => {
        const fullName = `${name} ${surname}`;
        const parts = fullName.trim().split(' ');
        return parts.map((p) => p[0].toUpperCase()).join('').slice(0, 2);
    };

    // seteo el estado de isLogginOut al montar este componente
    useEffect(() => {
        setIsLoggingOut(false);
    }, [setIsLoggingOut]);

    useEffect(() => {
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
                if (showLogin) toggleLogin();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showLogin, toggleLogin]);

    useEffect(() => {
        if ((showLogin || isClosing) && userIconRef.current) {
            const rect = userIconRef.current.getBoundingClientRect();
            const top = rect.bottom + window.scrollY + 8;
            const left = rect.right + window.scrollX - 320;
            setLoginCardPosition({top, left});
        }
    }, [showLogin, isClosing]);

    return (
        <div className={styles.container}>
            <header className={styles.navbar}>
                <div className={styles.logo}>
                    <span>EL BUEN SABOR™</span>
                </div>
                <nav className={styles.navLinks}>
                    {user && <Link to={ROUTES.PRODUCTOS}>Menú</Link>}
                    <Link to="/especiales">Nuestros especiales</Link>
                    <Link to="/sucursales">Sucursales</Link>
                </nav>
                <div className={styles.actions}>
                    <span className={styles.icon}><FaShoppingCart/></span>
                    <span className={styles.icon} onClick={toggleLogin} ref={userIconRef}>
                        {user ? (
                            <div className={styles.userCircle}>
                                {getInitials(user.nombre, user.apellido)}
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

            <main className={styles.main}>
                <div className={styles.left}>
                    <p className={styles.subtitle}>
                        La mejor rotisería del Cono Sur.
                    </p>
                    <h1 className={styles.title}>SABOR</h1>
                    <span className={styles.since}>2025</span>
                    <p className={styles.description}>
                        Para nosotros, el alimento procede de nuestros parientes, ya tengan alas, aletas o raíces.
                        <br/>
                        Así es como consideramos la comida.
                        <br/>
                        La comida tiene una cultura.
                        Tiene una historia.
                        Tiene una narración.
                        <br/>
                        Tiene <span className={styles.buenSabor}>El Buen Sabor</span>.
                    </p>
                    <button
                        className={styles.orderButton}
                        onClick={() => navigate(ROUTES.PRODUCTOS)}>
                        PEDIR
                    </button>
                </div>

                <div className={styles.right}>
                    <img src={imagenPizza} alt="Pizza" className={styles.image}/>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={styles.dishOfTheWeek}>
                    <h3>LO MEJOR DE LA SEMANA</h3>
                    <p>Lo más vendido</p>
                    <div className={styles.dishPrices}>
                        <div>$9.44 <br/>Empanadas de carne</div>
                        <div>$12.48 <br/>Lomito Simple</div>
                        <div>$20 <br/>Pizza muzzarella</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};