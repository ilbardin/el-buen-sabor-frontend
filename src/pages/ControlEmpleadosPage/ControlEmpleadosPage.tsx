import React, {useEffect, useState} from "react";
import {
    activarEmpleado,
    darDeBajaEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    getEmpleados
} from "../../services/empleadoService.ts";
import type {Empleado} from "../../models/usuario/empleado.ts";
import {FaEdit, FaTrash, FaUserCheck, FaUserSlash} from "react-icons/fa";
import styles from "./ControlEmpleadosPage.module.css";

const ControlEmpleadosPage: React.FC = () => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);

    const cargarEmpleados = async () => {
        try {
            const lista = await getEmpleados();
            setEmpleados(lista);
        } catch (error) {
            console.error("Error al cargar empleados", error);
        }
    };

    useEffect(() => {
        cargarEmpleados();
    }, []);

    const toggleEstadoEmpleado = async (empleado: Empleado) => {
        try {
            if (empleado.estaActivo) {
                await darDeBajaEmpleado(empleado.id);
            } else {
                await activarEmpleado(empleado.id);
            }
            await cargarEmpleados();
        } catch (error) {
            console.error("Error al actualizar estado del empleado", error);
        }
    };

    const modificarEmpleado = async (empleado: Empleado) => {
        try {
            await editarEmpleado(empleado.id, empleado);
            console.log("Empleado modificado:", empleado);
            await cargarEmpleados();
        } catch (error) {
            console.error("Error al modificar empleado", error);
        }
    };

    const borrarEmpleado = async (empleado: Empleado) => {
        try {
            await eliminarEmpleado(empleado.id);
            console.log("Empleado eliminado:", empleado);
            await cargarEmpleados();
        } catch (error) {
            console.error("Error al eliminar empleado", error);
        }
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
                                onClick={() => toggleEstadoEmpleado(empleado)}
                            >
                                {empleado.estaActivo ? (
                                    <>
                                        <FaUserSlash/> Dar de baja
                                    </>
                                ) : (
                                    <>
                                        <FaUserCheck/> Dar de alta
                                    </>
                                )}
                            </button>
                            <button
                                className={`${styles.btn} ${styles.btnSuccess}`}
                                onClick={() => modificarEmpleado(empleado)}
                            >
                                <FaEdit/> Modificar
                            </button>
                            <button
                                className={`${styles.btn} ${styles.btnDanger}`}
                                onClick={() => borrarEmpleado(empleado)}
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
