import {createContext} from "react";
import type {CartContextProps} from "./CarritoContext.tsx";

export const CartContext = createContext<CartContextProps | undefined>(undefined);