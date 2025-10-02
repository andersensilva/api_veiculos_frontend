import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}
