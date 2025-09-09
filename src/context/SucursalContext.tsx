import React, { createContext, useContext, useEffect, useState } from "react";

interface SucursalContextType {
  sucursalId: number | null;
  setSucursalId: (id: number) => void;
}

const SucursalContext = createContext<SucursalContextType | undefined>(
  undefined
);

export const SucursalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sucursalId, setSucursalId] = useState<number | null>(() => {
    // cuando arranca, revisa si hay algo en localStorage
    const saved = localStorage.getItem("sucursalId");
    return saved ? Number(saved) : null;
  });

  // cada vez que cambia sucursalId, lo guardamos en localStorage
  useEffect(() => {
    if (sucursalId !== null) {
      localStorage.setItem("sucursalId", String(sucursalId));
    }
  }, [sucursalId]);

  return (
    <SucursalContext.Provider value={{ sucursalId, setSucursalId }}>
      {children}
    </SucursalContext.Provider>
  );
};

export const useSucursal = () => {
  const context = useContext(SucursalContext);
  if (!context) {
    throw new Error("useSucursal debe usarse dentro de un SucursalProvider");
  }
  return context;
};
