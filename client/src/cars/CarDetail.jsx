import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiArrowLeft, mdiPlus, mdiCar, mdiSpeedometer } from "@mdi/js";
import FetchHelper from "../fetch-helper";
import Loading from "../common/Loading";
import ErrorMessage from "../common/Error";
import Notification from "../common/Notification";
import ServiceRecordForm from "../serviceRecords/ServiceRecordForm";
import ServiceRecordDeleteDialog from "../serviceRecords/ServiceRecordDeleteDialog";
import ServiceRecordList from "../serviceRecords/ServiceRecordList";
import CarForm from "./CarForm";

function CarDetail() {
  // get carId from URL - e.g. /car/8281fde2
  const { carId } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // controls for modals
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditCarForm, setShowEditCarForm] = useState(false);
  const [showMileageUpdate, setShowMileageUpdate] = useState(false);

  // selected service record for edit or delete
  const [selectedRecord, setSelectedRecord] = useState(null);

  // new mileage value for banner update
  const [newMileage, setNewMileage] = useState("");

  const [notification, setNotification] = useState(null);

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

  // called after service record is saved
  function handleRecordSaved(message) {
    setShowServiceForm(false);
    setSelectedRecord(null);
    setNotification({ message, type: "success" });
    loadData();
  }

  // called after service record is deleted
  function handleRecordDeleted() {
    setShowDeleteDialog(false);
    setSelectedRecord(null);
    setNotification({ message: "Záznam byl smazán.", type: "success" });
    loadData();
  }

  // called after car is updated
  function handleCarSaved(message) {
    setShowEditCarForm(false);
    setNotification({ message, type: "success" });
    loadData();
  }

  // update mileage from banner
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

export default CarDetail;