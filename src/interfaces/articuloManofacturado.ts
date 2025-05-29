export interface ArticuloManofacturado {
    id?: number;
    estaActivo?: boolean;
    denominacion: string;
    descripcion: string;
    precioVenta: number;
    precioCosto: number;
    tiempoEstimado: number;
    categoriaArticulo: string;
}