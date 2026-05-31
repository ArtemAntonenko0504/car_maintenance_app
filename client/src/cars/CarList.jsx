import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiPlus, mdiCar, mdiSpeedometer } from "@mdi/js";
import FetchHelper from "../fetch-helper";
import Loading from "../common/Loading";
import ErrorMessage from "../common/Error";
import Notification from "../common/Notification";
import CarForm from "./CarForm";
import CarDeleteDialog from "./CarDeleteDialog";

function CarList() {
  // list of all cars from server
  const [carList, setCarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // controls for showing/hiding modals
  const [showCarForm, setShowCarForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // which car is selected for edit or delete
  const [selectedCar, setSelectedCar] = useState(null);

  // notification message after action
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  // load all cars when page opens
  useEffect(() => {
    loadCars();
  }, []);

  async function loadCars() {
    setLoading(true);
    const result = await FetchHelper.car.list();
    if (result.ok) {
      setCarList(result.data.itemList);
    } else {
      setError("Nepodařilo se načíst vozidla.");
    }
    setLoading(false);
  }

  // open form for adding new car
  function handleAddCar() {
    setSelectedCar(null);
    setShowCarForm(true);
  }

  // open form for editing existing car
  function handleEditCar(e, car) {
    e.stopPropagation(); // prevent navigating to car detail
    setSelectedCar(car);
    setShowCarForm(true);
  }

  // open delete confirmation dialog
  function handleDeleteCar(e, car) {
    e.stopPropagation(); // prevent navigating to car detail
    setSelectedCar(car);
    setShowDeleteDialog(true);
  }

  // called after car is successfully created or updated
  function handleCarSaved(message) {
    setShowCarForm(false);
    setNotification({ message, type: "success" });
    loadCars();
  }

  // called after car is successfully deleted
  function handleCarDeleted() {
    setShowDeleteDialog(false);
    setShowCarForm(false); // close edit form too if it was open
    setSelectedCar(null);
    setNotification({ message: "Vozidlo bylo smazáno.", type: "success" });
    loadCars();
  }


  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Moje vozidla</h1>
        <button className="btn btn-primary" onClick={handleAddCar}>
          <Icon path={mdiPlus} size={0.9} />
          Přidat vozidlo
        </button>
      </div>

      {/* empty state when no cars */}
      {carList.length === 0 && (
        <div className="empty-state">
          <Icon path={mdiCar} size={3} color="#ccc" />
          <h3>Zatím žádná vozidla</h3>
          <p>Přidejte své první vozidlo kliknutím na tlačítko výše.</p>
        </div>
      )}

      {/* list of car cards */}
      {carList.map((car) => (
        <div
          key={car.id}
          className="card car-card"
          onClick={() => navigate(`/car/${car.id}`)}
          style={{ cursor: "pointer" }}
        >
          <div className="car-card-content">
            <div className="car-card-icon">
              <Icon path={mdiCar} size={1.8} color="#2563EB" />
            </div>
            <div className="car-card-info">
              <h2 className="car-card-title">
                {car.brand} {car.model}
              </h2>
              <p className="car-card-subtitle">
                {car.year} • VIN: {car.vin}
              </p>
              <p className="car-card-mileage">
                <Icon path={mdiSpeedometer} size={0.7} />
                {car.mileage.toLocaleString()} km
              </p>
            </div>
            <div className="car-card-actions">
              <button
                className="btn btn-secondary"
                onClick={(e) => handleEditCar(e, car)}
              >
                Upravit
              </button>
              <button
                className="btn btn-danger"
                onClick={(e) => handleDeleteCar(e, car)}
              >
                Smazat
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* modal for adding/editing car */}
      {showCarForm && (
        <CarForm
          car={selectedCar}
          onSave={handleCarSaved}
          onClose={() => setShowCarForm(false)}
        />
      )}

      {/* modal for delete confirmation */}
      {showDeleteDialog && (
        <CarDeleteDialog
          car={selectedCar}
          onDelete={handleCarDeleted}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}

      {/* notification after action */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default CarList;