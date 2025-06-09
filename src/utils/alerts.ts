import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showAlert = (
    title: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question',
    text?: string,
    allowExit?: boolean
) => {
    return MySwal.fire({
        title,
        icon,
        html: text, // usarlo como html aunque el parámetro se llame text,
        allowOutsideClick: allowExit,
        allowEscapeKey: allowExit,
    });
};

export const showConfirm = async (
    title: string,
    text?: string,
    confirmButtonText: string = 'Si',
    cancelButtonText: string = 'No'
) => {
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

export const showLoading = (message: string = 'Cargando...') => {
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

