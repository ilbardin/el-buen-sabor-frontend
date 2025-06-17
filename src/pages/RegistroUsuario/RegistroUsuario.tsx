import React, {useState} from 'react';
import {FaIdCard, FaUser} from 'react-icons/fa';
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai';
import {Link, useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './RegistroUsuario.module.css';
import {ROUTES} from '../../constants/routes';
import {showAlert, showLoading} from '../../utils/alerts';
import {MdEmail} from "react-icons/md";
import {BsTelephoneFill} from "react-icons/bs";
import {registrarUsuario} from "../../services/registroUsuarioService.ts";

export const RegistroUsuario: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [paisId, setPaisId] = useState(0);
    const [provinciaId, setProvinciaId] = useState(0);
    const [localidadId, setLocalidadId] = useState(0);
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const formFields = {
        nombre: {
            minLength: 4,
            maxLength: 50,
            placeholder: 'Nombre',
        },
        apellido: {
            minLength: 4,
            maxLength: 50,
            placeholder: 'Apellido',
        },
        email: {
            maxLength: 50,
            placeholder: 'Email',
        },
        telefono: {
            maxLength: 10,
            placeholder: 'Teléfono',
        },
        username: {
            minLength: 5,
            maxLength: 20,
            placeholder: 'Usuario',
        },
        password: {
            minLength: 6,
            maxLength: 20,
            placeholder: 'Contraseña',
        },
        confirmPassword: {
            minLength: 6,
            maxLength: 20,
            placeholder: 'Confirmar Contraseña',
        },
    };

    const handleShowPassword = (field: 'password' | 'confirmPassword') => {
        if (field === 'password') {
            setShowPassword((prev) => !prev);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword((prev) => !prev);
        }
    };

    const handleRegistroSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            await showAlert('Error', 'error', 'Las contraseñas no coinciden');
            return;
        }

        try {
            const datosNuevoUsuario = {
                nombre,
                apellido,
                email,
                paisId,
                provinciaId,
                localidadId,
                direccion,
                telefono,
                username,
                password,
            };
            console.log(datosNuevoUsuario);
            showLoading('Creando cuenta...');
            await registrarUsuario(datosNuevoUsuario);
            Swal.close();
            await showAlert('Éxito', 'success', 'Cuenta creada exitosamente');
            navigate(ROUTES.LOGIN);
        } catch (error) {
            Swal.close();
            console.error(error);
            await showAlert('Error', 'error', 'Error al crear la cuenta');
        }
    };

    return (
        <div className={styles.registroContainer}>
            <div className={styles.registroWrapper}>
                <div className={styles.wrapper}>
                    <form onSubmit={handleRegistroSubmit}>
                        <h1>Registro</h1>
                        <div className={styles.inputBox}>
                            <label htmlFor="nombre">Nombre:</label>
                            <input
                                type="text"
                                id="nombre"
                                minLength={formFields.nombre.minLength}
                                maxLength={formFields.nombre.maxLength}
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />

                            <FaIdCard className={styles.icon}/>
                        </div>
                        <div className={styles.inputBox}>
                            <label htmlFor="apellido">Apellido:</label>
                            <input
                                type="text"
                                id="apellido"
                                minLength={formFields.apellido.minLength}
                                maxLength={formFields.apellido.maxLength}
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                required
                            />
                            <FaIdCard className={styles.icon}/>
                        </div>

                        <div className={styles.inputBox}>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                maxLength={formFields.email.maxLength}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <MdEmail className={styles.icon}/>
                        </div>

                        <div className={styles.inputBox}>
                            <label htmlFor="telefono">Teléfono:</label>
                            <input
                                type="tel"
                                id="telefono"
                                maxLength={formFields.telefono.maxLength}
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                required
                            />
                            <BsTelephoneFill className={styles.icon}/>
                        </div>
                        <div className={styles.inputBox}>
                            <label htmlFor="username">Usuario:</label>
                            <input
                                type="text"
                                id="username"
                                maxLength={formFields.username.maxLength}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <FaUser className={styles.icon}/>
                        </div>
                        <div className={styles.inputBox}>
                            <label htmlFor="password">Contraseña:</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                minLength={formFields.password.minLength}
                                maxLength={formFields.password.maxLength}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div
                                className={`${styles.icon} ${styles.eyeIcon}`}
                                onClick={() => handleShowPassword('password')}
                            >
                                {showPassword ? <AiFillEyeInvisible/> : <AiFillEye/>}
                            </div>
                        </div>

                        <div className={styles.inputBox}>
                            <label htmlFor="confirmar-password">Confirmar contraseña:</label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmar-password"
                                maxLength={formFields.confirmPassword.maxLength}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <div
                                className={`${styles.icon} ${styles.eyeIcon}`}
                                onClick={() => handleShowPassword('confirmPassword')}
                            >
                                {showConfirmPassword ? <AiFillEyeInvisible/> : <AiFillEye/>}
                            </div>
                        </div>
                        <button type="submit" className={styles.btn}>Registrarse</button>
                        <div className={styles.loginLink}>
                            <p>¿Ya tienes cuenta? <Link to={ROUTES.LOGIN}>Inicia sesión</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};