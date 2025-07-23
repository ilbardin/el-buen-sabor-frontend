export interface StockInsumo {
    idInsumo:       number;
    denominacion:   string;
    cantidadMinima: number;
    cantidadMaxima: number;
    cantidadActual: number;
    unidadMedida:   string;
    categorias:   string[];
}