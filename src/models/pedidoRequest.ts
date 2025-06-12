export interface PedidoRequest {
    subtotal: number;
    gastosEnvio: number;
    total: number;
    tipoEnvio: "delivery" | "takeaway";
    detalles: DetallePedido[];
}

export interface DetallePedido {
    cantidad: number;
    subTotal: number;
    articuloManufacturado?: { id: number };
    articuloInsumo?: { id: number };
}
