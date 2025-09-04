export interface DatosEstadoPedido {
    id: number;
    fechaAlta: Date;
    horaEstimadaFinalizacion: Date;
    subtotal: number;
    gastosEnvio: null;
    total: number;
    estado: string;
    tipoEnvio: string;
    fechaHoraPedido: Date;
    facturaVenta: null;
    sucursalEmpresa: SucursalEmpresa;
    cliente: Cliente;
    detalles: Detalle[];
}

export interface Cliente {
    id: number;
}

export interface Detalle {
    id: number;
    cantidad: number;
    articuloManufacturado: ArticuloManufacturado;
    promocion: null;
}

export interface ArticuloManufacturado {
    id: number;
    denominacion: string;
    descripcion: string;
    precioVenta: number;
    categoria: string;
    listaImagenes: null;
}

export interface SucursalEmpresa {
    id: number;
    nombre: string;
}
