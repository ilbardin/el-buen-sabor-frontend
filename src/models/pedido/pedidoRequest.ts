export interface PedidoRequest {
  id: number;
  subTotal: number;
  gastosEnvio: number | null;
  total: number;
  tipoEnvio: "delivery" | "takeaway";
  cliente: { id: number };
  sucursalEmpresa: { id: number };
  fechaHoraPedido: string;
  detalles: DetallePedido[];
}

export interface DetallePedido {
  id: number;
  cantidad: number;
  subTotal: number;
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
