import React, {useState, useEffect} from "react";
import type {Sucursal} from "../../models/sucursal";
import {getSucursal} from "../../services/sucursalService";
import {ModuloSucursal} from "../../components/ModuloSucursal/ModuloSucursal";
import {FormularioSucursal} from "../../components/FormularioSucursal/formularioSucursal";
import styles from "./SucursalABM.module.css";
import baseABM from "../../css/abmBase.module.css";
import type {Empresa} from "../../models/empresa";
import {getEmpresas} from "../../services/empresaService";

export default function SucursalABM() {
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState<
        Sucursal | undefined
    >(undefined);
    const [busqueda, setBusqueda] = useState("");
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [idEmpresa, setIdEmpresa] = useState(0);

    const fetchData = async () => {
        try {
            const sucursales = await getSucursal();
            const empresas = await getEmpresas();
            setEmpresas(empresas);
            setSucursales(sucursales);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        void fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value.toLowerCase());
    };
    const handleChangeCategorias = (e: any) => {
        setIdEmpresa(Number(e.target.value));
    };

    const sucursalesFiltradas = sucursales.filter((sucursal) =>
        sucursal.nombre.toLowerCase().includes(busqueda)
    );

    const sucursalesFinales = sucursalesFiltradas.filter(
        (sucursal) =>
            idEmpresa === 0 || (sucursal.empresa && sucursal.empresa.id === idEmpresa)
    );

    return (
        <div className={baseABM.container}>
            {mostrarModal && (
                <FormularioSucursal
                    sucursal={sucursalSeleccionada}
                    onClose={async () => {
                        setMostrarModal(false);
                        setSucursalSeleccionada(undefined);
                        await fetchData();
                    }}
                />
            )}

            <h1 className={baseABM.titulo}>Sucursal ABM</h1>

            <button
                value={""}
                className={baseABM.boton}
                onClick={() => setMostrarModal(true)}
            >
                Cargar Sucursal
            </button>

            <div className={baseABM.filtrosContainer}>
                <input
                    type="text"
                    placeholder="Buscar"
                    onChange={handleChange}
                    className={baseABM.filtroInput}
                    value={busqueda}
                />

                <select
                    value={idEmpresa}
                    onChange={handleChangeCategorias}
                    className={styles.filtroSelect}
                >
                    <option value="">Todas las Empresas</option>
                    {empresas.map((empresa, idx) => (
                        <option key={idx} value={empresa.id}>
                            {empresa.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <table className={baseABM.tabla}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apertura</th>
                    <th>Cierre</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {sucursalesFinales.map((sucursal) => (
                    <ModuloSucursal
                        key={sucursal.id}
                        sucursal={sucursal}
                        onModificar={(sucursal) => {
                            setSucursalSeleccionada(sucursal);
                            setMostrarModal(true);
                        }}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}
