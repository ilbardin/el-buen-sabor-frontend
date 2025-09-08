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
    const [dataCargada, setDataCargada] = useState<boolean>(false);

    const obtenerReportes = async () => {
        try {
            const ventas = await getReportes(fechaDesde, fechaHasta, "ventas");
            const productos = await getReportes(fechaDesde, fechaHasta, "productos");
            
            setReporteVentas(ventas);
            setReporteProductos(productos);
            setDataCargada(true);
        } catch (error) {
            console.error("Error al obtener reportes:", error);
            setDataCargada(false);
        }
    };

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

    const dataPorDefectoVentas = [
        ["Fecha", "Ventas"],
        ["Sin datos", 0],
    ];

    const dataPorDefectoProductos = [
        ["Producto", "Cantidad"],
        ["Sin datos", 0],
    ];

    return (
        <div>
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
                <Chart
                    chartType="ColumnChart"
                    data={dataCargada && dataVentas.length > 1 ? dataVentas : dataPorDefectoVentas}
                    options={{
                        title: reporteVentas?.tipoReporte || "Ventas",
                        hAxis: {
                            title: "Fecha",
                            format: "dd/MM/yyyy",
                        },
                        vAxis: {
                            title: "Ventas en $",
                        },
                        legend: { position: "bottom" },
                    }}
                    legendToggle

                />

                <Chart
                    chartType="PieChart"
                    data={dataCargada && dataProductos.length > 1 ? dataProductos : dataPorDefectoProductos}
                    options={{
                        title: reporteProductos?.tipoReporte || "Productos",
                    }}
                    legendToggle
                />
            </div>
        </div>
    );
}