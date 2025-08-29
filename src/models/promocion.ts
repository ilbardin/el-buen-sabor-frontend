export interface Promocion {
  id?: number;
  denominacion: string;
  fechaDesde: string;
  fechaHasta: string;
  descuento: number;
  precioSinDescuento: number;
  precioVenta: number;
  imagenes: string[];
  detalle: PromocionDetalle[];
}

export interface PromocionDetalle {
  cantidad: number;
  articuloInsumo?: ArticuloInsumo | null;
  articuloManufacturado?: ArticuloManufacturado | null;
}

export interface ArticuloInsumo {
  id: number;
  denominacion?: string;
}

export interface ArticuloManufacturado {
  id: number;
  denominacion?: string;
}
