import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthRoutes } from "./AuthRoutes";
import { AppRoutes } from "./AppRoutes";
import CarListPage from "../pages/CarListPage"; // importe sua página

export function RouterManager() {
  const { session } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/listcarros" element={<CarListPage />} />

        {/* Rotas que exigem autenticação */}
        {session?.token ? (
          <Route path="/*" element={<AppRoutes />} />
        ) : (
          <Route path="/*" element={<AuthRoutes />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
