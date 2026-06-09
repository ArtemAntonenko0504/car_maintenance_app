import { useState, useEffect, createContext, useContext } from "react";
import FetchHelper from "../fetch-helper";

// create context - this is what other components will use to get data
const CarListContext = createContext();

// custom hook for easy access to context
export function useCarList() {
  return useContext(CarListContext);
}

function CarListProvider({ children }) {
  const [carList, setCarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showCarForm, setShowCarForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  // load all cars when provider mounts
  useEffect(() => {
    loadCars();
  }, []);

  async function loadCars() {
    setLoading(true);
    const result = await FetchHelper.car.list();
    if (result.ok) {
      // for each car load number of service records
      const carsWithCount = await Promise.all(
        result.data.itemList.map(async (car) => {
          const recordsResult = await FetchHelper.serviceRecord.list({
            carId: car.id,
          });
          return {
            ...car,
            serviceRecordCount: recordsResult.ok
              ? recordsResult.data.itemList.length
              : 0,
          };
        })
      );
      setCarList(carsWithCount);
    } else {
      setError("Nepodařilo se načíst vozidla.");
    }
    setLoading(false);
  }

  function handleAddCar() {
    setSelectedCar(null);
    setShowCarForm(true);
  }

  function handleEditCar(e, car) {
    e.stopPropagation();
    setSelectedCar(car);
    setShowCarForm(true);
  }

  function handleDeleteCar(e, car) {
    e.stopPropagation();
    setSelectedCar(car);
    setShowDeleteDialog(true);
  }

  function handleCarSaved(message) {
    setShowCarForm(false);
    setNotification({ message, type: "success" });
    loadCars();
  }

  function handleCarDeleted() {
    setShowDeleteDialog(false);
    setShowCarForm(false);
    setSelectedCar(null);
    setNotification({ message: "Vozidlo bylo smazáno.", type: "success" });
    loadCars();
  }

  // everything we pass to child components through context
  const contextValue = {
    carList,
    loading,
    error,
    notification,
    setNotification,
    showCarForm,
    setShowCarForm,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedCar,
    handleAddCar,
    handleEditCar,
    handleDeleteCar,
    handleCarSaved,
    handleCarDeleted,
  };

  return (
    <CarListContext.Provider value={contextValue}>
      {children}
    </CarListContext.Provider>
  );
}

export default CarListProvider;