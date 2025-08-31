/*
export interface ArticuloInsumo {
    id?: number;
    fechaAlta: string;
    fechaBaja: string | null;
    estaActivo: boolean;
    denominacion: string;
    precioCompra: number;
    precioVenta: number;
    esParaElaborar: boolean;
    categoria: string;
    nombreUnidadMedida: string;
    imagenInsumo: {
        id: number;
        denominacion: string;
    }
    unidadMedida: {
        id: number;
        denominacion: string;
    }
}
*/

export interface ArticuloInsumoCreacion {
    estaActivo:        boolean;
    fechaAlta:         null;
    fechaBaja:         null;
    denominacion:      string;
    precioCompra:      number;
    precioVenta:       number;
    esParaElaborar:    boolean;
    categoriaArticulo: CategoriaArticuloCreacion;
    unidadMedida:      UnidadMedidaCreacion;
    imagenInsumo:      ImagenInsumo;
}

export interface CategoriaArticuloCreacion {
    id: number;
}
export interface UnidadMedidaCreacion {
    id: number
}

export interface ImagenInsumo {
    denominacion: string;
}

export interface ArticuloInsumo {
    id?: number;
    denominacion: string;
    fechaBaja: string | null;
    precioVenta: number;
    precioCompra: number;
    categorias: string[];          
    nombreUnidadMedida: string;    
    esParaElaborar: boolean;
    nombreImagen: string | null;   
}