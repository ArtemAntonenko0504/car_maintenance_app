import { useState, useEffect, createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import FetchHelper from "../fetch-helper";

// create context
const CarDetailContext = createContext();

// custom hook for easy access to context
export function useCarDetail() {
  return useContext(CarDetailContext);
}

function CarDetailProvider({ children }) {
  const { carId } = useParams();

  const [car, setCar] = useState(null);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // controls for modals
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditCarForm, setShowEditCarForm] = useState(false);
  const [showMileageUpdate, setShowMileageUpdate] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newMileage, setNewMileage] = useState("");

  // load car and service records when page opens
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId]);

  async function loadData() {
    setLoading(true);

    // load car data
    const carResult = await FetchHelper.car.get({ carId });
    if (!carResult.ok) {
      setError("Vozidlo nebylo nalezeno.");
      setLoading(false);
      return;
    }
    setCar(carResult.data);

    // load service records for this car
    const recordsResult = await FetchHelper.serviceRecord.list({ carId });
    if (recordsResult.ok) {
      setServiceRecords(recordsResult.data.itemList);
    }

    setLoading(false);
  }

  function handleRecordSaved(message) {
    setShowServiceForm(false);
    setSelectedRecord(null);
    setNotification({ message, type: "success" });
    loadData();
  }

  function handleRecordDeleted() {
    setShowDeleteDialog(false);
    setSelectedRecord(null);
    setNotification({ message: "Záznam byl smazán.", type: "success" });
    loadData();
  }

  function handleCarSaved(message) {
    setShowEditCarForm(false);
    setNotification({ message, type: "success" });
    loadData();
  }

  async function handleMileageUpdate() {
    if (!newMileage) return;
    const result = await FetchHelper.car.update({
      carId,
      mileage: Number(newMileage),
    });
    if (result.ok) {
      setShowMileageUpdate(false);
      setNewMileage("");
      setNotification({ message: "Kilometráž byla aktualizována.", type: "success" });
      loadData();
    } else {
      setNotification({ message: result.data.message, type: "error" });
    }
  }

  const contextValue = {
    car,
    carId,
    serviceRecords,
    loading,
    error,
    notification,
    setNotification,
    showServiceForm,
    setShowServiceForm,
    showDeleteDialog,
    setShowDeleteDialog,
    showEditCarForm,
    setShowEditCarForm,
    showMileageUpdate,
    setShowMileageUpdate,
    selectedRecord,
    setSelectedRecord,
    newMileage,
    setNewMileage,
    handleRecordSaved,
    handleRecordDeleted,
    handleCarSaved,
    handleMileageUpdate,
  };

  return (
    <CarDetailContext.Provider value={contextValue}>
      {children}
    </CarDetailContext.Provider>
  );
}

export default CarDetailProvider;