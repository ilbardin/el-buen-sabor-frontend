import React, {useEffect, useState} from "react";
import {
    activarEmpleado, crearEmpleado,
    darDeBajaEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    getEmpleados
} from "../../services/empleadoService.ts";
import type {Empleado} from "../../models/usuario/empleado.ts";
import {FaEdit, FaToggleOff, FaToggleOn, FaTrash} from "react-icons/fa";
import styles from "./ControlEmpleadosPage.module.css";
import Swal from "sweetalert2";
import {showEditarEmpleadoPopup} from "../../services/empleadoPopup.ts";
import {mostrarAlerta, mostrarConfirmacion} from "../../utils/alerts.ts";
import {useAuth} from "../../context/auth/useAuth.ts";
import {UserRole} from "../../models/usuario/userRoles.ts";

const ControlEmpleadosPage: React.FC = () => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [empleadoId, setEmpleadoId] = useState<number | null>(null);
    const {usuario} = useAuth();

    useEffect(() => {
        if (usuario?.empleado?.id) {
            setEmpleadoId(usuario.empleado.id);
        }
    }, [usuario]);

    const fetchEmpleados = async () => {
        if (empleadoId !== null) {
            try {
                const listaEmpleados = await getEmpleados(empleadoId);
                setEmpleados(listaEmpleados);
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        fetchEmpleados();
    }, [empleadoId]);

    const handleEditar = async (empleado: Empleado) => {
        const formValues = await showEditarEmpleadoPopup(empleado);

        if (formValues) {
            try {
                if (empleado.id !== undefined) {
                    const response = await editarEmpleado(empleado.id, formValues);
                    await mostrarAlerta("Éxito", "success", response.message);
                    await fetchEmpleados();
                }
            } catch (error) {
                console.error(error);
                await Swal.fire("Error", "No se pudo modificar el empleado", "error");
            }
        }
    };

    const showCrearEmpleadoPopup = async () => {
        const opcionesRol = Object.values(UserRole)
            .map((rol) => `<option value="${rol}">${rol}</option>`)
            .join("");

        const {value: formValues} = await Swal.fire({
            title: "Crear Empleado",
            html: `
                <div style="text-align:left; display:flex; flex-direction:column; gap:10px;">
                    <label style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="width:100px;">Nombre:</span>
                        <input id="nombre" class="swal2-input" style="flex:1;" />
                    </label>
                    <label style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="width:100px;">Apellido:</span>
                        <input id="apellido" class="swal2-input" style="flex:1;" />
                    </label>
                    <label style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="width:100px;">Teléfono:</span>
                        <input id="telefono" class="swal2-input" style="flex:1;" />
                    </label>
                    <label style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="width:100px;">Email:</span>
                        <input id="email" class="swal2-input" style="flex:1;" />
                    </label>
                    <label style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="width:100px;">Rol:</span>
                        <select id="rol" class="swal2-select" style="flex:1;">
                            ${opcionesRol}
                        </select>
                    </label>
                    <label style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="width:100px;">Username:</span>
                        <input id="username" class="swal2-input" style="flex:1;" />
                    </label>
                    <label style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="width:100px;">Password:</span>
                        <input type="password" id="password" class="swal2-input" style="flex:1;" />
                    </label>
                </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const empleado: Empleado & { password?: string } = {
                    nombre: (document.getElementById("nombre") as HTMLInputElement).value,
                    apellido: (document.getElementById("apellido") as HTMLInputElement).value,
                    telefono: (document.getElementById("telefono") as HTMLInputElement).value,
                    email: (document.getElementById("email") as HTMLInputElement).value,
                    rol: (document.getElementById("rol") as HTMLSelectElement).value as UserRole,
                    username: (document.getElementById("username") as HTMLInputElement).value,
                    password: (document.getElementById("password") as HTMLInputElement).value,
                };

                // Validaciones obligatorias
                for (const key of ["nombre","apellido","telefono","email","rol","username"]) {
                    if (!empleado[key as keyof Empleado]) {
                        Swal.showValidationMessage(`El campo ${key} es obligatorio.`);
                        return;
                    }
                }

                return empleado;
            },
            showCancelButton: true,
            confirmButtonText: "Crear",
            cancelButtonText: "Cancelar",
        });

        return formValues;
    };

    const handleCrearEmpleado = async () => {
        const nuevoEmpleado = await showCrearEmpleadoPopup();
        if (nuevoEmpleado) {
            try {
                const response = await crearEmpleado(nuevoEmpleado);
                await mostrarAlerta("Éxito", "success", response.message);
                await fetchEmpleados();
            } catch (error: any) {
                console.error(error);
                await mostrarAlerta("Error", "error", error.message);
            }
        }
    };

    const handleToggleActivo = async (empleado: Empleado) => {
        try {
            if (empleado.estaActivo && empleado.id) {
                const confirmacionBaja = await mostrarConfirmacion(
                    "Dar de baja empleado",
                    "¿Estás seguro de que deseas dar de baja este empleado?"
                );

                if (confirmacionBaja) {
                    const response = await darDeBajaEmpleado(empleado.id);
                    await mostrarAlerta("Éxito", "success", response.message);
                }
            } else {
                if (empleado.id) {
                    const confirmacionAlta = await mostrarConfirmacion(
                        "Dar de alta empleado",
                        "¿Estás seguro de que deseas dar de alta este empleado?"
                    );

                    if (confirmacionAlta) {
                        const response = await activarEmpleado(empleado.id);
                        await mostrarAlerta("Éxito", "success", response.message);
                    }
                }
            }

            await fetchEmpleados();
        } catch (error: any) {
            console.error(error);
            await mostrarAlerta("Error", "error", error.message);
        }
    };

    const handleEliminar = async (empleado: Empleado) => {
        const confirmacion: boolean = await mostrarConfirmacion(
            "Eliminar empleado",
            "¿Estás seguro de que deseas eliminar este empleado?"
        );

        if (confirmacion) {
            try {
                if (empleado.id) {
                    const response = await eliminarEmpleado(empleado.id);
                    await mostrarAlerta("Empleado eliminado", "success", response.message);
                    await fetchEmpleados();
                }
            } catch (error: any) {
                console.error(error);
                await mostrarAlerta("Error", "error", "No se pudo eliminar el empleado");
            }
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Control de Empleados</h1>

            {/* Botón grande de Crear Empleado */}
            <button
                onClick={handleCrearEmpleado}
                style={{
                    backgroundColor: "#27ae60",
                    color: "#fff",
                    fontSize: "16px",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginBottom: "20px"
                }}
            >
                Crear Empleado
            </button>

            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Username</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {empleados.map((empleado) => (
                    <tr key={empleado.id}>
                        <td>{empleado.nombre}</td>
                        <td>{empleado.apellido}</td>
                        <td>{empleado.telefono}</td>
                        <td>{empleado.email}</td>
                        <td>{empleado.rol}</td>
                        <td>{empleado.username}</td>
                        <td>{empleado.estaActivo ? "Sí" : "No"}</td>
                        <td className={styles.actions}>
                            <button onClick={() => handleEditar(empleado)} className={styles.editBtn}>
                                <FaEdit/> Editar
                            </button>
                            <button onClick={() => handleToggleActivo(empleado)} className={styles.toggleBtn}>
                                {empleado.estaActivo ? <FaToggleOff/> : <FaToggleOn/>}
                                {empleado.estaActivo ? " Dar de baja" : " Dar de alta"}
                            </button>
                            <button onClick={() => handleEliminar(empleado)} className={styles.deleteBtn}>
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
