import React, {useEffect, useState} from "react";
import {getEmpleados} from "../../services/empleadoService.ts";
import type {Empleado} from "../../models/usuario/empleado.ts";
import {FaEdit, FaTrash, FaUserSlash} from "react-icons/fa";
import styles from "./ControlEmpleadosPage.module.css";

const ControlEmpleadosPage: React.FC = () => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);

    const getListaEmpleados = async () => {
        const listaEmpleados: Empleado[] = await getEmpleados();
        setEmpleados(listaEmpleados);
    };

    useEffect(() => {
        getListaEmpleados();
    }, []);

    const darDeBaja = (empleado: Empleado) => {
        console.log(`Dar de baja empleado ID: ${empleado.id}`, empleado);
    };

    const modificarEmpleado = (empleado: Empleado) => {
        console.log(`Modificar empleado ID: ${empleado.id}`, empleado);
    };

    const eliminarEmpleado = (empleado: Empleado) => {
        console.log(`Eliminar empleado ID: ${empleado.id}`, empleado);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Control de Empleados</h1>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Usuario</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {empleados.map((empleado, index) => (
                    <tr
                        key={empleado.id}
                        className={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                    >
                        <td>{empleado.id}</td>
                        <td>{empleado.nombre}</td>
                        <td>{empleado.apellido}</td>
                        <td>{empleado.telefono}</td>
                        <td>{empleado.email}</td>
                        <td>{empleado.rol}</td>
                        <td>{empleado.username ?? "-"}</td>
                        <td>{empleado.estaActivo ? "Sí" : "No"}</td>
                        <td className={styles.actions}>
                            <button
                                className={`${styles.btn} ${styles.btnWarning}`}
                                onClick={() => darDeBaja(empleado)}
                            >
                                <FaUserSlash/> Dar de baja
                            </button>
                            <button
                                className={`${styles.btn} ${styles.btnSuccess}`}
                                onClick={() => modificarEmpleado(empleado)}
                            >
                                <FaEdit/> Modificar
                            </button>
                            <button
                                className={`${styles.btn} ${styles.btnDanger}`}
                                onClick={() => eliminarEmpleado(empleado)}
                            >
                                <FaTrash/> Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ControlEmpleadosPage;

