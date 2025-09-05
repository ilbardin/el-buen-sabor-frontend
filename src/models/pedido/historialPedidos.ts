import type {EstadoPedido} from "./estadoPedido.ts";

export interface HistorialPedidos {
    idPedido: number;
    idSucursal: number;
    nombreSucursal: string;
    idCliente: number;
    estadoPedido: EstadoPedido;
    tipoEnvio: "delivery" | "takeaway";
    idDireccionEntrega: number;
    fechaCreacion: Date;
    fechaBaja: null;
    horaEstimadaFinalizacion: Date;
    total: number;
    subtotal: number;
    gastosEnvio: number | null;
    detalles: Detalle[];
    idFactura: null;
}

export interface Detalle {
    cantidad: number;
    tipoItem: string | null;
    itemId: number | null;
    precioVenta: number | null;
    subTotal: number;
    denominacion: string | null;
    categorias: string[];
}

