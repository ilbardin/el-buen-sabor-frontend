import Swal, {type SweetAlertResult} from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const mostrarAlerta = (
    title: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question',
    text?: string,
    allowExit?: boolean
): Promise<SweetAlertResult> => {
    return MySwal.fire({
        title,
        icon,
        html: text, // usarlo como html aunque el parámetro se llame text,
        allowOutsideClick: allowExit,
        allowEscapeKey: allowExit,
    });
};

export const mostrarConfirmacion = async (
    title: string,
    text?: string,
    confirmButtonText: string = 'Si',
    cancelButtonText: string = 'No'
): Promise<boolean> => {
    const result = await MySwal.fire({
        title,
        html: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        scrollbarPadding: false
    });

    return result.isConfirmed;
};

export const mostrarCargando = (message: string = 'Cargando...'): void => {
    void MySwal.fire({
        title: message,
        icon: 'info',
        didOpen: () => {
            Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
};

export const alertaCarrito = async (): Promise<boolean> => {
    return await mostrarConfirmacion(
        "Confirmación",
        "Si cierra sesión, perderá los productos guardados en el carrito."
    );
};

