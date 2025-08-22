import type {Empresa} from "../../models/empresa";
import React, {useEffect, useState} from "react";
import {getEmpresas} from "../../services/empresaService";
import {FormularioEmpresa} from "../../components/FormularioEmpresa/FormularioEmpresa";
import {ModuloEmpresa} from "../../components/ModuloEmpresa/ModuloEmpresa";
import baseABM from "../../css/abmBase.module.css"

export default function EmpresaABM() {
  const [empresa, setEmpresa] = useState<Empresa[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<
    Empresa | undefined
  >(undefined);
  const [busqueda, setBusqueda] = useState("");

  const fetchData = async () => {
    try {
      const empresas = await getEmpresas();

      setEmpresa(empresas);
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
  const empresasFiltradas = empresa.filter((emp) =>
    emp.nombre.toLowerCase().includes(busqueda)
  );
  return (
    <div className={baseABM.container}>
      {mostrarModal && (
        <FormularioEmpresa
          empresa={empresaSeleccionada}
          onClose={async () => {
            setMostrarModal(false);
            setEmpresaSeleccionada(undefined);
            await fetchData();
          }}
        />
      )}
      <h1 className={baseABM.titulo}>Empresa ABM</h1>
      <button
        value={""}
        className={baseABM.boton}
        onClick={() => setMostrarModal(true)}
      >
        Cargar Empresa
      </button>

      <div className={baseABM.filtrosContainer}>
      <input
        type="text"
        placeholder="Buscar"
        onChange={handleChange}
        className={baseABM.filtroInput}
        value={busqueda}
      />
      </div>

      <table className={baseABM.tabla}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cuil</th>
            <th>Nombre</th>
            <th>Razón Social</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresasFiltradas.map((empresa) => (
            <ModuloEmpresa
              key={empresa.id}
              empresa={empresa}
              onModificar={(empresa) => {
                setEmpresaSeleccionada(empresa);
                setMostrarModal(true);
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
