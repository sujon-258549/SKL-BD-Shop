import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { TProductResponse } from "@/components/allProduct/type";

interface TCartProduct extends TProductResponse {
  price(price: any): unknown;
  discount(discount: any): unknown;
  name: string | undefined;
  photo: any;
  _id?: string;
  orderQuantity: number;
}

interface TInitialState {
  products: TCartProduct[];
  deliveryAmount: number; // শুরুতে ০ সেট করুন
}

const initialState: TInitialState = {
  products: [],
  deliveryAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const matchProduct = state.products.find(
        (product) => product._id === action.payload._id
      );

      if (matchProduct) {
        matchProduct.orderQuantity += 1;
        return;
      } else {
        state.products.push({ ...action.payload, orderQuantity: 1 });
      }
    },

    incrementProductQuantity: (state, action) => {
      const matchProduct = state.products.find(
        (product) => product._id === action.payload._id
      );
      if (matchProduct) {
        matchProduct.orderQuantity += 1;
        return;
      }
    },
    decrementProductQuantity: (state, action) => {
      const matchProduct = state.products.find(
        (product) => product._id === action.payload._id
      );

      if (matchProduct) {
        if (matchProduct.orderQuantity > 1) {
          matchProduct.orderQuantity -= 1;
        }
      }
    },
    clearCart: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload._id
      );
    },
    // ✅ Remove all products (for successful order)
    clearAllCart: (state) => {
      state.products = [];
      state.deliveryAmount = 0; // Optional: Reset delivery charge
    },
    deliveryAmount: (state, action) => {
      // Single delivery charge based on district
      const deliveryCharge = action.payload === "Dhaka" ? 100 : 120;
      state.deliveryAmount = deliveryCharge;
    },
  },
});

export const orderSelector = (state: RootState) => {
  return state.cart.products;
};
export const deliveryAmountValue = (state: RootState) => {
  return state.cart.deliveryAmount;
};
export const {
  addProduct,
  incrementProductQuantity,
  decrementProductQuantity,
  clearCart,
  deliveryAmount,
  clearAllCart,
} = cartSlice.actions;

export default cartSlice.reducer;
