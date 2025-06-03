import React, {useEffect, useState} from 'react';
import {FaLock, FaUser} from 'react-icons/fa';
import type {Usuario} from "../../types/usuario.ts";
import {LOGIN_URL} from "../../constants/constants.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/useAuth.ts";
import Swal from "sweetalert2";
import {showAlert, showLoading} from "../../utils/alerts.ts";
import axios from 'axios';
import styles from './Login.module.css';
import type {GenericError} from "../../types/interfaces.ts";

type LoginProps = {
    onLoginSuccess: (usuario: Usuario) => void;
};

const Login: React.FC<LoginProps> = ({onLoginSuccess}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
                LOGIN_URL,
                {
                    username: username,
                    password: password,
                }
            );

            onLoginSuccess(response.data);
            Swal.close();

            navigate('/');
        } catch (err) {
            if ((err as GenericError).response?.data) {
                const backendError = err as GenericError;
                console.error(backendError.response.data);
                Swal.close();
                await showAlert('Error', 'error', backendError.response.data);
            } else {
                console.error(err);
                Swal.close();
            }
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginWrapper}>
                <div className={styles.wrapper}>
                    <form onSubmit={handleLogin}>
                        <h1>Login</h1>
                        <div className={styles.inputBox}>
                            <label>
                                <input
                                    type="text"
                                    maxLength={20}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Usuario"/>
                            </label>
                            <FaUser className={styles.icon}/>
                        </div>
                        <div className={styles.inputBox}>
                            <label>
                                <input
                                    type="password"
                                    maxLength={20}
                                    value={password}
                                    placeholder="Contraseña"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </label>
                            <FaLock className={styles.icon}/>
                        </div>
                        <div className={styles.forgotPassword}>
                            <a href="#">¿Olvidaste tu contraseña?</a>
                        </div>
                        <button type="submit" className={styles.btn}>Iniciar sesión</button>
                        <div className={styles.registerLink}>
                            <p>¿No tienes cuenta? <a href="#">Regístrate</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;