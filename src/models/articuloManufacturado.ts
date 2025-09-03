export interface ArticuloManufacturado {
    id?: number;
    fechaBaja?: string | null;
    denominacion: string;
    descripcion: string;
    precioVenta: number;
    precioCosto: number;
    tiempoEstimado: number;
    categoria: string;
    imagenes?: ImagenManofacturado[];
}

export interface ArticuloManufacturadoCreacion {
    denominacion: string;
    descripcion: string;
    precioVenta: number;
    tiempoEstimado: number;
    categoria: Categoria;
    detalles: Detalle[];
    imagenes: ImagenManofacturado[];
}

export interface Categoria {
    id: number;
}

export interface Detalle {
    cantidad: number;
    insumo: Categoria;
}

export interface ImagenManofacturado {
    denominacion: string;
}