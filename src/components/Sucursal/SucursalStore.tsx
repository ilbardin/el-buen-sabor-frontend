import { create } from "zustand";
import { persist } from "zustand/middleware";

type SucursalStatedsf = {
  idSucursal: number | null;
  setIdSucursal: (id: number) => void;
};

export const useSucursalStore = create(
  persist<SucursalStatedsf>(
    (set) => ({
      idSucursal: 1,
      setIdSucursal: (id) => set({ idSucursal: id }),
    }),
    {
      name: "sucursal-storage",
    }
  )
);
