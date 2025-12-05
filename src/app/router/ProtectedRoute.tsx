
import { userCurrentUser } from "@/redux/fetures/auth/authSlice";
import { useAppSelector } from "@/redux/fetures/hooks";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: ReactNode;
}

interface TUser {
  userInfo?: {
    role?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const user = useAppSelector(userCurrentUser) as TUser | null;
  const role = user?.userInfo?.role;

  // Not logged in → redirect to login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch → redirect to unauthorized page
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // All good → render children
  return <>{children}</>;
};

export default ProtectedRoute;
