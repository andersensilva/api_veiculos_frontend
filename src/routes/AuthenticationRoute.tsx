import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hocks/useAuth";

interface AuthenticationRouteProps {
  children: ReactNode;
}

const AuthenticationRoute = ({ children }: AuthenticationRouteProps) => {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default AuthenticationRoute;
