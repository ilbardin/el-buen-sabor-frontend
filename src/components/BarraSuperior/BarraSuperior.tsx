import {Link, Outlet, useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/auth/useAuth.ts';
import {UserRole} from "../../models/usuario/userRoles.ts";
import {ROUTES} from "../../constants/routes.ts";
import styles from './BarraSuperior.module.css';
import {BiSolidLogOut} from "react-icons/bi";

export const BarraSuperior = () => {
    const {logout, setIsLoggingOut, usuario} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsLoggingOut(true);
        logout();
        navigate(ROUTES.LOGIN);
    };

    return (
        <div>
            <nav className={styles.topbar}>
                <ul>
                    <li>
                        <Link to={ROUTES.HOME}>Home</Link>
                    </li>
                    {usuario?.rol === UserRole.Admin && (
                        <>
                            <li>
                                <Link to={ROUTES.PRODUCTOS}>Productos</Link>
                            </li>
                        </>
                    )}
                </ul>
                {usuario && (
                    <>
                        <p className={styles.userInfo}>
                            Estás logueado como usuario: <strong>{usuario.rol}</strong>
                        </p>
                        <button className={styles.logoutButton} onClick={handleLogout}>
                            <BiSolidLogOut size={18} style={{marginRight: 2}}/>
                            Cerrar sesión
                        </button>
                    </>
                )}
                {!usuario && (
                    <button className={styles.loginButton} onClick={() => navigate('/login')}>
                        Iniciar sesión
                    </button>
                )}
            </nav>

            <main className={styles.pageContent}>
                <Outlet/>
            </main>
        </div>
    );
};