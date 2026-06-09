import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiPlus, mdiCar, mdiSpeedometer, mdiClipboardList } from "@mdi/js";
import Loading from "../common/Loading";
import ErrorMessage from "../common/Error";
import Notification from "../common/Notification";
import CarForm from "./CarForm";
import CarDeleteDialog from "./CarDeleteDialog";
import CarListProvider, { useCarList } from "./car-list-provider";

// this component uses data from context
function CarListContent() {
  const navigate = useNavigate();
  const {
    carList,
    loading,
    error,
    notification,
    setNotification,
    showCarForm,
    showDeleteDialog,
    selectedCar,
    handleAddCar,
    handleEditCar,
    handleDeleteCar,
    handleCarSaved,
    handleCarDeleted,
  } = useCarList();

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
              <p className="car-card-subtitle">
                <Icon path={mdiClipboardList} size={0.7} />
                {car.serviceRecordCount} {car.serviceRecordCount === 1 ? "záznam" : 
                car.serviceRecordCount >= 2 && car.serviceRecordCount <= 4 ? "záznamy" : "záznamů"}
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

      {/* modals */}
      {showCarForm && (
        <CarForm
          car={selectedCar}
          onSave={handleCarSaved}
          onClose={() => setNotification(null)}
        />
      )}

      {showDeleteDialog && (
        <CarDeleteDialog
          car={selectedCar}
          onDelete={handleCarDeleted}
          onClose={() => setNotification(null)}
        />
      )}

      {/* notification */}
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

// CarList wraps content with provider
function CarList() {
  return (
    <CarListProvider>
      <CarListContent />
    </CarListProvider>
  );
}

export default CarList;