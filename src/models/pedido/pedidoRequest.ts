export interface PedidoRequest {
  idSucursal: number;
  idCliente: number;
  direccionEntrega?: string;
  idDireccionEntrega?: number;
  tipoEnvio: "delivery" | "takeaway";
  total: number;
  subtotal: number;
  gastosEnvio: number | null;
  detalles: DetallePedido[];
  idPedido?: number;
  nombreSucursal?: string;
  fechaCreacion?: string;
  estadoPedido?: string;
}

export interface DetallePedido {
  cantidad: number;
  tipoItem: string;
  itemId: number;
  subtotal: number;
  denominacion?: string;
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



