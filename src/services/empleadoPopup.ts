import Swal from "sweetalert2";
import type {Empleado} from "../models/usuario/empleado.ts";
import {EmpleadoRole, UserRole} from "../models/usuario/userRoles.ts";
import {soloNumeros} from "../utils/funcionesReutilizables.ts";

export async function showEditarEmpleadoPopup(empleado: Empleado) {
    const opcionesRol = Object.values(EmpleadoRole)
        .map((rol) => `<option value="${rol}">${rol}</option>`)
        .join("");

    const {value: formValues} = await Swal.fire({
        title: "Editar Empleado",
        width: 600,
        html: `
            <div style="text-align:left; display:flex; flex-direction:column; gap:10px;">
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Nombre:</span>
                    <input id="nombre" class="swal2-input" style="flex:1;" value="${empleado.nombre}" />
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Apellido:</span>
                    <input id="apellido" class="swal2-input" style="flex:1;" value="${empleado.apellido}" />
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Teléfono:</span>
                    <input id="telefono" class="swal2-input" style="flex:1;" value="${empleado.telefono}" />
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Email:</span>
                    <input id="email" class="swal2-input" style="flex:1;" value="${empleado.email}" />
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Rol:</span>
                    <select id="rol" class="swal2-select" style="flex:1;">
                        ${opcionesRol}
                    </select>
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Username:</span>
                    <input id="username" class="swal2-input" style="flex:1;" value="${empleado.username ?? ""}" />
                </label>
            </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
            const updated = {
                nombre: (document.getElementById("nombre") as HTMLInputElement).value,
                apellido: (document.getElementById("apellido") as HTMLInputElement).value,
                telefono: (document.getElementById("telefono") as HTMLInputElement).value,
                email: (document.getElementById("email") as HTMLInputElement).value,
                rol: (document.getElementById("rol") as HTMLSelectElement).value,
                username: (document.getElementById("username") as HTMLInputElement).value,
            };

            const iguales =
                updated.nombre === empleado.nombre &&
                updated.apellido === empleado.apellido &&
                updated.telefono === empleado.telefono &&
                updated.email === empleado.email &&
                updated.rol === empleado.rol &&
                updated.username === (empleado.username ?? "");

            if (iguales) {
                Swal.showValidationMessage("Debes modificar al menos un campo para continuar.");
                return;
            }

            const error = validarEmpleado(empleado);

            if (error) {
                Swal.showValidationMessage(error);
                return;
            }

            return updated;
        },
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
    });

    return formValues;
}

export async function showCrearEmpleadoPopup(): Promise<Empleado | undefined> {
    const opcionesRol = Object.values(EmpleadoRole)
        .map((rol) => `<option value="${rol}">${rol}</option>`)
        .join("");

    const {value: formValues} = await Swal.fire({
        title: "Crear Empleado",
        width: 600,
        html: `
            <div style="text-align:left; display:flex; flex-direction:column; gap:10px;">
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Nombre:</span>
                    <input id="nombre" class="swal2-input" maxlength="50" style="flex:1;" />
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Apellido:</span>
                    <input id="apellido" class="swal2-input" maxlength="50" style="flex:1;" />
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Teléfono:</span>
                    <input id="telefono" type="tel" class="swal2-input" maxlength="11" style="flex:1;" />
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Email:</span>
                    <input id="email" type="email" class="swal2-input" maxlength="50" style="flex:1;" />
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Rol:</span>
                    <select id="rol" class="swal2-select" style="flex:1;">
                        ${opcionesRol}
                    </select>
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Usuario:</span>
                    <input id="username" class="swal2-input" maxlength="50" style="flex:1;" />
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="width:100px;">Password:</span>
                    <input type="password" id="password" class="swal2-input" maxlength="50" style="flex:1;" />
                </label>
            </div>
        `,
        didOpen: () => {
            const telInput = document.getElementById("telefono") as HTMLInputElement;
            telInput.addEventListener("input", soloNumeros);
        },
        focusConfirm: false,
        preConfirm: () => {
            const empleado: Empleado & { password?: string } = {
                nombre: (document.getElementById("nombre") as HTMLInputElement).value.trim(),
                apellido: (document.getElementById("apellido") as HTMLInputElement).value.trim(),
                telefono: (document.getElementById("telefono") as HTMLInputElement).value.trim(),
                email: (document.getElementById("email") as HTMLInputElement).value.trim(),
                rol: (document.getElementById("rol") as HTMLSelectElement).value as UserRole,
                username: (document.getElementById("username") as HTMLInputElement).value.trim(),
                password: (document.getElementById("password") as HTMLInputElement).value,
            };

            for (const key of ["nombre", "apellido", "telefono", "email", "rol", "username"]) {
                if (!empleado[key as keyof Empleado]) {
                    Swal.showValidationMessage(`El campo ${key} es obligatorio.`);
                    return;
                }
            }

            const error = validarEmpleado(empleado);

            if (error) {
                Swal.showValidationMessage(error);
                return;
            }

            return empleado;
        },
        showCancelButton: true,
        confirmButtonText: "Crear",
        cancelButtonText: "Cancelar",
    });

    return formValues;
}

function validarEmpleado(empleado: Empleado & { password?: string }, iguales?: boolean): string | null {
    if (iguales) {
        return "Debes modificar al menos un campo para continuar.";
    }

    if (empleado.nombre.length < 4) {
        return "El nombre debe tener al menos 4 caracteres.";
    }

    if (empleado.apellido.length < 4) {
        return "El apellido debe tener al menos 4 caracteres.";
    }

    if (empleado.telefono.length < 10 || empleado.telefono.length > 11) {
        return "El teléfono debe tener entre 10 y 11 dígitos.";
    }

    if (empleado.username && empleado.username.length < 4) {
        return "El nombre de usuario debe tener al menos 4 caracteres.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(empleado.email)) {
        return "El email no tiene un formato válido.";
    }

    return null;
}

