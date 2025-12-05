import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../fetures/store";
import { logOut } from "../fetures/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://backend-black-two-21.vercel.app/api", // vercel backend api
  // baseUrl: "http://localhost:4000/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token;
    if (token) {
      headers.set("authorization", `${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  if (
    result.error &&
    result.error.status === 401 
  ) {
    // Redux থেকে logout
    api.dispatch(logOut());
    // Login page redirect
    window.location.href = "/login";
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["product", "category", "User", "order"],
  endpoints: () => ({}),
});
