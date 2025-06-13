import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from './context/AuthProvider';
import Router from './Router';
import {CartProvider} from "./context/CarritoContext.tsx";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <CartProvider>
                    <Router/>
                </CartProvider>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;