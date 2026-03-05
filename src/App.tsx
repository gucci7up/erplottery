/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Bancas from './pages/Bancas';
import Empleados from './pages/Empleados';
import OperacionesDiarias from './pages/OperacionesDiarias';
import Nomina from './pages/Nomina';
import GastosMensuales from './pages/GastosMensuales';
import ContabilidadGeneral from './pages/ContabilidadGeneral';
import Reportes from './pages/Reportes';
import Configuracion from './pages/Configuracion';
import Login from './pages/Login';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="bancas" element={<Bancas />} />
        <Route path="empleados" element={<Empleados />} />
        <Route path="operaciones" element={<OperacionesDiarias />} />
        <Route path="nomina" element={<Nomina />} />
        <Route path="gastos" element={<GastosMensuales />} />
        <Route path="contabilidad" element={<ContabilidadGeneral />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="configuracion" element={<Configuracion />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

