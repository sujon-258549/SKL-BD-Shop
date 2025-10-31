import AllProduct from "@/components/allProduct/AllProduct";
import ProductDetails from "@/components/allProduct/ProductDetails";
import Home from "@/components/home/Home";
import LoginForm from "@/components/login/LoginForm";
// import LoginForm from "../../components/login/Login";
import Main from "@/components/main/Main";
import Shipping from "@/components/shipping/Shipping";
import CreateCategory from "@/components/sidebar/CreateCategory";
import Dashboard from "@/components/sidebar/dashboard/Dashboard";
import MainSidebar from "@/components/sidebar/MainSidebar";
import Profile from "@/components/sidebar/Profile";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AllProductTable from "@/components/sidebar/AllProductTable";
import ProductsList from "@/components/sidebar/ProductsList";
import UpdateAdmin from "@/components/register/UpdateAdmin";
import ChangePassword from "@/components/login/ChangePassword";
import OrderDetails from "@/components/sidebar/dashboard/OrderDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/all-product",
        element: <AllProduct />,
      },
      {
        path: "/shipping",
        element: <Shipping />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/dashboard",
    element: <MainSidebar></MainSidebar>,
    children: [
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/create-category",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateCategory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/create-product",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            {" "}
            <ProductsList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/profile",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            {" "}
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/all-product-table",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            {" "}
            <AllProductTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/update-admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            {" "}
            <UpdateAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/change-password",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            {" "}
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/order-details/:id",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            {" "}
            <OrderDetails />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
