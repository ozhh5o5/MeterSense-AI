import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Anomalies from "./pages/Anomalies";
import Maintenance from "./pages/Maintenance";
import Topology from "./pages/Topology";
import Federated from "./pages/Federated";
import MapPage from "./pages/MapPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/anomalies" element={<Anomalies />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/topology" element={<Topology />} />
        <Route path="/federated" element={<Federated />} />
        <Route path="/map" element={<MapPage />} />
      </Route>
    </Routes>
  );
}
