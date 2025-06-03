import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {UserRole} from "../../types/userRoles.ts";
import {showAlert, showLoading} from "../../utils/alerts.ts";
import Swal from "sweetalert2";
import {useAuth} from "../../context/useAuth.ts";
import styles from "./Login.module.css";

type Usuario = {
    id: number;
    nombreUsuario: string;
    rol: UserRole;
};

type LoginProps = {
    onLoginSuccess: (usuario: Usuario) => void;
};

const loginUrl = import.meta.env.VITE_API_URL + '/auth/login';

const Login: React.FC<LoginProps> = ({onLoginSuccess}) => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [clave, setClave] = useState('');
    const navigate = useNavigate();
    const {setIsLoggingOut} = useAuth();

    useEffect(() => {
        setIsLoggingOut(false);
    }, [setIsLoggingOut]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            showLoading('Iniciando sesión...');

            const response = await axios.post<Usuario>(
                loginUrl,
                {
                    nombreUsuario,
                    clave,
                }
            );

            onLoginSuccess(response.data);
            Swal.close();

            navigate('/');
        } catch (err: any) {
            Swal.close();
            console.error(err);
            await showAlert('Error', 'error', 'Error al iniciar sesión.');
        }
    };

    return (
        <body>
        <div className={styles.wrapper}>
            <form action="">
                <h1>Login</h1>
                <div className={styles.inputBox}>
                    <input type="text" placeholder="Usuario"/>
                    <i className="bx bxs-user"></i>
                </div>
                <div className={styles.inputBox}>
                    <input type="password" placeholder="Password"/>
                    <i className='bx bxs-lock-alt'></i>
                </div>
                <div className={styles.rememberForget}>
                    <label><input type="checkbox"/>
                        Recordarme</label>
                    <a href="#">¿Olvidó su contraseña?</a>
                </div>
                <button type="submit" className={styles.btn}>Iniciar sesión</button>
                <div className={styles.registerLink}>
                    <p>¿No tienes una cuenta? <a href="#">Registrarse</a></p>
                </div>
            </form>
        </div>
        </body>
    );
};

export default Login;
