export interface PedidoRequest {
    subtotal: number;
    gastosEnvio: number | null;
    total: number;
    tipoEnvio: "delivery" | "takeaway";
    cliente: { id: number };
    sucursalEmpresa: { id: number };
    detalles: DetallePedido[];
}

export interface DetallePedido {
    cantidad: number;
    subtotal: number;
    articuloManufacturado?: { id: number };
    articuloInsumo?: { id: number };
}

export interface ItemCarritoMp {
    id: string;
    title: string;
    description: string;
    pictureUrl?: string;
    categoryId?: string;
    quantity: number;
    currencyId?: string;
    unitPrice: string;
}

