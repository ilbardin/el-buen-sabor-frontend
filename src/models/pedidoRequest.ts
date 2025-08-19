export interface PedidoRequest {
    subtotal: number;
    gastosEnvio: number;
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

