import axiosInstance from "../api/axiosInstance.ts";

const URL_FACTURAS = "/facturas";

export async function getFacturaPdf(idPedido: number): Promise<void> {
    try {
        const response = await axiosInstance.get(`${URL_FACTURAS}/descargar-pdf/${idPedido}`, {
            responseType: "blob",
        });

        const file = new Blob([response.data], {type: "application/pdf"});
        const fileURL = URL.createObjectURL(file);

        const newWindow = window.open(fileURL, "_blank");

        if (newWindow) {
            newWindow.onload = () => {
                newWindow.focus();
                // newWindow.print();
            };
        }
    } catch (error) {
        console.error("Error al obtener el PDF:", error);
        throw error;
    }
}
