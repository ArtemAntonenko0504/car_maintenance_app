import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import CarList from "./cars/CarList";
import CarDetail from "./cars/CarDetail";
import MaintenanceSchedule from "./maintenance/MaintenanceSchedule";
import "./App.css";

function App() {
  return (
    // BrowserRouter enables navigation between pages without page reload
    <BrowserRouter>
      <Routes>
        {/* Layout wraps all pages - navbar stays, only content changes */}
        <Route path="/" element={<Layout />}>
          {/* Main page - list of all cars */}
          <Route index element={<CarList />} />

          {/* Car detail page with service history */}
          <Route path="car/:carId" element={<CarDetail />} />

          {/* Maintenance schedule page */}
          <Route path="schedule" element={<MaintenanceSchedule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
