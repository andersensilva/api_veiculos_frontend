import { BrowserRouter, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthRoutes } from "./AuthRoutes";
import { AppRoutes } from "./AppRoutes";

export function RouterManager() {
  const { session } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {session?.token ? <AppRoutes /> : <AuthRoutes />}
    </BrowserRouter>
  );
}
