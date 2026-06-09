import { useState, useEffect, createContext, useContext } from "react";
import FetchHelper from "../fetch-helper";

// create context
const MaintenanceScheduleContext = createContext();

// custom hook for easy access to context
export function useMaintenanceSchedule() {
  return useContext(MaintenanceScheduleContext);
}

function MaintenanceScheduleProvider({ children }) {
  const [carList, setCarList] = useState([]);
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // load all data when page opens
  useEffect(() => {
    loadSchedule();
  }, []);

  async function loadSchedule() {
    setLoading(true);

    // first load all cars
    const carsResult = await FetchHelper.car.list();
    if (!carsResult.ok) {
      setError("Nepodařilo se načíst vozidla.");
      setLoading(false);
      return;
    }

    const cars = carsResult.data.itemList;
    setCarList(cars);

    // then load maintenance schedule for each car
    const schedules = {};
    for (const car of cars) {
      const result = await FetchHelper.serviceRecord.maintenanceSchedule({
        carId: car.id,
      });
      if (result.ok) {
        schedules[car.id] = result.data.itemList;
      }
    }

    setScheduleData(schedules);
    setLoading(false);
  }

  const contextValue = {
    carList,
    scheduleData,
    loading,
    error,
  };

  return (
    <MaintenanceScheduleContext.Provider value={contextValue}>
      {children}
    </MaintenanceScheduleContext.Provider>
  );
}

export default MaintenanceScheduleProvider;