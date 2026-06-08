import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiArrowLeft, mdiPlus, mdiCar, mdiSpeedometer } from "@mdi/js";
import Loading from "../common/Loading";
import ErrorMessage from "../common/Error";
import Notification from "../common/Notification";
import ServiceRecordForm from "../serviceRecords/ServiceRecordForm";
import ServiceRecordDeleteDialog from "../serviceRecords/ServiceRecordDeleteDialog";
import ServiceRecordList from "../serviceRecords/ServiceRecordList";
import CarForm from "./CarForm";
import CarDetailProvider, { useCarDetail } from "./car-detail-provider";

// this component uses data from context
function CarDetailContent() {
  const navigate = useNavigate();
  const {
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
  } = useCarDetail();

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {/* back button and title */}
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/")}>
          <Icon path={mdiArrowLeft} size={0.9} />
          Zpět na vozidla
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setShowEditCarForm(true)}
        >
          Upravit vozidlo
        </button>
      </div>

      {/* car info card */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="car-card-content">
          <div className="car-card-icon">
            <Icon path={mdiCar} size={2} color="#2563EB" />
          </div>
          <div className="car-card-info">
            <h1 className="car-card-title">
              {car.brand} {car.model}
            </h1>
            <p className="car-card-subtitle">
              {car.year} • VIN: {car.vin}
            </p>
            <p className="car-card-mileage">
              <Icon path={mdiSpeedometer} size={0.7} />
              {car.mileage.toLocaleString()} km
            </p>
          </div>
        </div>
      </div>

      {/* mileage update banner */}
      <div className="mileage-banner">
        <p>
          <strong>Aktuální kilometráž:</strong> {car.mileage.toLocaleString()} km —
          Aktualizujte pro přesný přehled údržby.
        </p>
        {showMileageUpdate ? (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              className="form-input"
              type="number"
              value={newMileage}
              onChange={(e) => setNewMileage(e.target.value)}
              placeholder="Nový stav km"
              style={{ width: "150px" }}
            />
            <button className="btn btn-primary" onClick={handleMileageUpdate}>
              Uložit
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowMileageUpdate(false)}
            >
              Zrušit
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => setShowMileageUpdate(true)}
          >
            Aktualizovat
          </button>
        )}
      </div>

      {/* service history */}
      <div className="page-header">
        <h2 className="page-title" style={{ fontSize: "20px" }}>
          Servisní historie
        </h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedRecord(null);
            setShowServiceForm(true);
          }}
        >
          <Icon path={mdiPlus} size={0.9} />
          Přidat záznam
        </button>
      </div>

      <ServiceRecordList
        serviceRecords={serviceRecords}
        onEdit={(record) => {
          setSelectedRecord(record);
          setShowServiceForm(true);
        }}
        onDelete={(record) => {
          setSelectedRecord(record);
          setShowDeleteDialog(true);
        }}
      />

      {/* modals */}
      {showServiceForm && (
        <ServiceRecordForm
          carId={carId}
          record={selectedRecord}
          onSave={handleRecordSaved}
          onClose={() => setShowServiceForm(false)}
        />
      )}

      {showDeleteDialog && (
        <ServiceRecordDeleteDialog
          record={selectedRecord}
          onDelete={handleRecordDeleted}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}

      {showEditCarForm && (
        <CarForm
          car={car}
          onSave={handleCarSaved}
          onClose={() => setShowEditCarForm(false)}
        />
      )}

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

// CarDetail wraps content with provider
function CarDetail() {
  return (
    <CarDetailProvider>
      <CarDetailContent />
    </CarDetailProvider>
  );
}

export default CarDetail;