export interface PedidoRequest {
  id: number;
  idPedido: number;
  subTotal: number;
  gastosEnvio: number | null;
  total: number;
  tipoEnvio: "delivery" | "takeaway";
  idCliente: number;
  idSucursal: number;
  fechaCreacion: string;
  detalles: DetallePedido[];
  estadoPedido: string;
}

export interface DetallePedido {
  id: number;
  cantidad: number;
  subTotal: number;
  tipoItem: string;
  denominacion: string
  articuloManufacturado?: { id: number; denominacion?: string };
  articuloInsumo?: { id: number; denominacion?: string };
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



