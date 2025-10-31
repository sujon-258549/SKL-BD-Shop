import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../fetures/store"; // Adjust the import path as needed
// import { setUser } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  // baseUrl: "https://backend-black-two-21.vercel.app/api",
  baseUrl: "http://localhost:4000/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token;
    console.log(token);
    if (token) {
      headers.set("authorization", `${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["product", "category", "User", "order"],
  baseQuery: baseQuery,
  endpoints: () => ({}),
});
