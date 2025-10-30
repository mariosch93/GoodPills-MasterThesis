import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Cart.jsx";

export const store = configureStore({
    reducer: {
        cart: cartReducer,
    }
})