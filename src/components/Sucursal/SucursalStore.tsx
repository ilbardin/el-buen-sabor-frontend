import {create} from "zustand";
import {persist} from "zustand/middleware";

type SucursalStatedsf = {
    idSucursal: number | null;
    denominacionSucursal: string | null;
    setIdSucursal: (id: number) => void;
    setDenominacion: (denominacion: string) => void;
};

export const useSucursalStore = create(
    persist<SucursalStatedsf>(
        (set) => ({
            denominacionSucursal: "Seleccione una Sucursal",
            idSucursal: 1,
            setIdSucursal: (id) => set({idSucursal: id}),
            setDenominacion: (denominacion) => set({denominacionSucursal: denominacion}),
        }),
        {
            name: "sucursal-storage",
        }
    )
);
