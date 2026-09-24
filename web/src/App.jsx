import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Servicios from "./pages/Servicios";
import Tienda from "./pages/Tienda";
import Contacto from "./pages/Contacto";
import Consulta from "./pages/Consulta";

const Admin = lazy(() => import("./pages/Admin"));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="admin"
          element={
            <Suspense fallback={null}>
              <Admin />
            </Suspense>
          }
        />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="tienda" element={<Tienda />} />
          <Route path="contacto" element={<Contacto />} />
          {/* Consulta del estado de una reparación (QR del comprobante). Debe ir
              antes del catch-all, que manda todo lo desconocido a Home. */}
          <Route path="r" element={<Consulta />} />
          <Route path="r/:token" element={<Consulta />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
