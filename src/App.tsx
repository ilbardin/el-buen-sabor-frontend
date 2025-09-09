import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthProvider.tsx";
import Router from "./Router";
import { CartProvider } from "./context/carrito/CarritoContext.tsx";
import { SucursalProvider } from "./context/SucursalContext.tsx";

function App() {
  return (
    <AuthProvider>
      <SucursalProvider>
        <BrowserRouter>
          <CartProvider>
            <Router />
          </CartProvider>
        </BrowserRouter>
      </SucursalProvider>
    </AuthProvider>
  );
}

export default App;
