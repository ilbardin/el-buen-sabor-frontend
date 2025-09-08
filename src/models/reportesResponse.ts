export interface ReportesResponse {
    sucursal: string;
    tipoReporte: string;
    descripcion: string;
    fechaDesde: string;
    fechaHasta: string;
    detalles: ReportesResponseDetalles[]
}

export interface ReportesResponseDetalles {
    ejeX: string;
    ejeY: string;
}