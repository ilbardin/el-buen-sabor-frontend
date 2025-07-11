import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from './context/auth/AuthProvider.tsx';
import Router from './Router';
import {CartProvider} from "./context/carrito/CarritoContext.tsx";
import DuracionCarritoAlert from "./components/DuracionCarritoAlert/DuracionCarritoAlert.tsx";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <CartProvider>
                    <DuracionCarritoAlert/>
                    <Router/>
                </CartProvider>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;