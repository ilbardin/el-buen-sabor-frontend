import {useEffect, useState} from "react";
import { getReportes } from "../../services/reportesService.ts";
import styles from "./Reportes.module.css"
import { Chart } from "react-google-charts";
import type {ReportesResponse} from "../../models/reportesResponse.ts";

export default function Reportes() {

    const [fechaDesde, setFechaDesde] = useState<string>("2025-09-01");
    const [fechaHasta, setFechaHasta] = useState<string>("2025-09-25");
    const [reporteVentas, setReporteVentas] = useState<ReportesResponse>();
    const [reporteProductos, setReporteProductos] = useState<ReportesResponse>();
    const [dataVentas, setDataVentas] = useState<any[]>([["Fecha", "Ventas"]]);
    const [dataProductos, setDataProductos] = useState<any[]>([["Producto", "Cantidad"]]);

    const obtenerReportes = async () => {
        const ventas = await getReportes(fechaDesde, fechaHasta, "ventas");
        setReporteVentas(ventas);

        const productos = await getReportes(fechaDesde, fechaHasta, "productos");
        setReporteProductos(productos);
    };

    // cuando cambia reporteVentas → construyo el data para el gráfico
    useEffect(() => {
        if (reporteVentas?.detalles) {
            const chartData = [
                ["Fecha", "Ventas"],
                ...reporteVentas.detalles.map((d) => [d.ejeX, parseFloat(d.ejeY)])
            ];
            setDataVentas(chartData);
        }
    }, [reporteVentas]);

    useEffect(() => {
        if (reporteProductos?.detalles) {
            const chartData = [
                ["Producto", "Cantidad"],
                ...reporteProductos.detalles.map((d) => [d.ejeX, parseFloat(d.ejeY)])
            ];
            setDataProductos(chartData);
        }
    }, [reporteProductos]);

    return (
        <div >
            <h1>Reportes</h1>

            <label className={styles.filtroFechas}>
                Fecha desde:
                <input
                    type="date"
                    onChange={(e) => setFechaDesde(e.target.value)}
                />
            </label>
            <label className={styles.filtroFechas}>
                Fecha hasta:
                <input
                    type="date"
                    onChange={(e) => setFechaHasta(e.target.value)}
                />
            </label>
            <button onClick={() => obtenerReportes()}>Generar reporte</button>
            <div className={styles.contenedorGraficos}>
                {/* Chart de ventas */}
                <Chart
                    chartType="ColumnChart"
                    data={dataVentas}
                    options={{
                        title: reporteVentas?.tipoReporte || "Ventas",
                    }}
                    legendToggle
                />

                <Chart
                    chartType="ColumnChart"
                    data={dataProductos}
                    options={{
                        title: reporteProductos?.tipoReporte || "Productos",
                    }}
                    legendToggle
                />
            </div>

        </div>
    );
}