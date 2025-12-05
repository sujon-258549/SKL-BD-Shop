import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Main from "@/components/main/Main";
import ProtectedRoute from "./ProtectedRoute";
import { SuspenseWrapper } from "./SuspenseWrapper";

// Lazy load components for code splitting and faster initial load
const AllProduct = lazy(() => import("@/components/allProduct/AllProduct"));
const ProductDetails = lazy(() => import("@/components/allProduct/ProductDetails"));
const Home = lazy(() => import("@/components/home/Home"));
const LoginForm = lazy(() => import("@/components/login/LoginForm"));
const Shipping = lazy(() => import("@/components/shipping/Shipping"));
const CreateCategory = lazy(() => import("@/components/sidebar/CreateCategory"));
const Dashboard = lazy(() => import("@/components/sidebar/dashboard/Dashboard"));
const MainSidebar = lazy(() => import("@/components/sidebar/MainSidebar"));
const Profile = lazy(() => import("@/components/sidebar/Profile"));
const AllProductTable = lazy(() => import("@/components/sidebar/AllProductTable"));
const ProductsList = lazy(() => import("@/components/sidebar/ProductsList"));
const UpdateAdmin = lazy(() => import("@/components/register/UpdateAdmin"));
const ChangePassword = lazy(() => import("@/components/login/ChangePassword"));
const OrderDetails = lazy(() => import("@/components/sidebar/dashboard/OrderDetails"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: (
          <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/all-product",
        element: (
          <SuspenseWrapper>
            <AllProduct />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/shipping",
        element: (
          <SuspenseWrapper>
            <Shipping />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/product/:id",
        element: (
          <SuspenseWrapper>
            <ProductDetails />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <LoginForm />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <SuspenseWrapper>
        <MainSidebar></MainSidebar>
      </SuspenseWrapper>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <SuspenseWrapper>
              <Dashboard />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/create-category",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <SuspenseWrapper>
              <CreateCategory />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/create-product",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <SuspenseWrapper>
              <ProductsList />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/profile",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <SuspenseWrapper>
              <Profile />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/all-product-table",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <SuspenseWrapper>
              <AllProductTable />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/update-admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <SuspenseWrapper>
              <UpdateAdmin />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/change-password",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <SuspenseWrapper>
              <ChangePassword />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/order-details/:id",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <SuspenseWrapper>
              <OrderDetails />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
