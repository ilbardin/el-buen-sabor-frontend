import React, {useEffect, useState} from 'react';
import {FaLock, FaUser} from 'react-icons/fa';
import type {UserData} from "../../models/usuario/usuario.ts";
import {LOGIN_URL} from "../../constants/constants.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/auth/useAuth.ts";
import Swal from "sweetalert2";
import {showAlert, showLoading} from "../../utils/alerts.ts";
import axiosInstance from "../../api/axiosInstance.ts";
import type {GenericError} from "../../models/errorResponseModel.ts";
import styles from './Login.module.css';
import {ROUTES} from "../../constants/routes.ts";
import type {AxiosError} from "axios";

type LoginProps = {
    onLoginSuccess: (userData: UserData) => void;
};

const Login: React.FC<LoginProps> = ({onLoginSuccess}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {setIsLoggingOut} = useAuth();

    useEffect(() => {
        setIsLoggingOut(false);
    }, [setIsLoggingOut]);

    const formFields = {
        username: {
            maxLength: 20,
            placeholder: 'Usuario',
        },
        password: {
            maxLength: 20,
            placeholder: 'Contraseña',
        },
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

    const handleSuccess = (data: UserData) => {
        onLoginSuccess(data);
        Swal.close();

        navigate(ROUTES.HOME);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            showLoading('Iniciando sesión...');
            const response = await axiosInstance.post<UserData>(LOGIN_URL, {username, password});
            handleSuccess(response.data);
        } catch (err: unknown) {
            // @ts-expect-error tipado
            await handleError(err);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginWrapper}>
                <div className={styles.wrapper}>
                    <form onSubmit={handleLoginSubmit}>
                        <h1>Login</h1>
                        <div className={styles.inputBox}>
                            <label>
                                <input
                                    type="text"
                                    maxLength={formFields.username.maxLength}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder={formFields.username.placeholder}
                                />
                            </label>
                            <FaUser className={styles.icon}/>
                        </div>
                        <div className={styles.inputBox}>
                            <label>
                                <input
                                    type="password"
                                    maxLength={formFields.password.maxLength}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder={formFields.password.placeholder}
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