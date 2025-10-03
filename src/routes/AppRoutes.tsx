import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Marcas from "../pages/MarcaPage";
import Modelos from "../pages/ModeloPage";
import Carros from "../pages/CarroPage";
import CarList from "../pages/CarListPage";
import AppLayout from "../components/AppLayout";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/marcas" element={<Marcas />} />
        <Route path="/modelos" element={<Modelos />} />
        <Route path="/carros" element={<Carros />} />
        <Route path="/Listcarro" element={<CarList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
