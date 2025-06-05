export interface ArticuloManufacturado {
    id?: number;
    estaActivo?: boolean;
    denominacion: string;
    descripcion: string;
    precioVenta: number;
    precioCosto: number;
    tiempoEstimado: number;
    categoriaArticulo: string;
}

export interface ArticuloManufacturadoCreacion {
    denominacion:   string;
    descripcion:    string;
    precioVenta:    number;
    tiempoEstimado: number;
    categoria:      Categoria;
    detalles:       Detalle[];
    imagenInsumo:   string;
}

export interface Categoria {
    id: number;
}

export interface Detalle {
    cantidad: number;
    insumo:   Categoria;
}