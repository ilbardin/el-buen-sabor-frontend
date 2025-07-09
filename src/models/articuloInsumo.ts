export interface ArticuloInsumo {
    id?: number;
    fechaAlta: string;
    fechaBaja: string | null;
    estaActivo: boolean;
    denominacion: string;
    precioCompra: number;
    precioVenta: number;
    esParaElaborar: boolean;
    categoriaArticulo: {
        id: number;
        denominacion: string;
    };
    imagenInsumo: {
        id: number;
        denominacion: string;
    }
    unidadMedida: {
        id: number;
        denominacion: string;
    }
}

export interface ArticuloInsumoCreacion {
    estaActivo:        boolean;
    fechaAlta:         null;
    fechaBaja:         null;
    denominacion:      string;
    precioCompra:      number;
    precioVenta:       number;
    esParaElaborar:    boolean;
    categoriaArticulo: CategoriaArticuloCreacion;
    unidadMedida:      CategoriaArticuloCreacion;
    imagenInsumo:      ImagenInsumo;
}

export interface CategoriaArticuloCreacion {
    id: number;
}

export interface ImagenInsumo {
    denominacion: string;
}