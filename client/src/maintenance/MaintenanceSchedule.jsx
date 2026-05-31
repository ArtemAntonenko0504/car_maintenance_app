import { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiBell, mdiCar, mdiSpeedometer, mdiCalendar, mdiWrench } from "@mdi/js";
import FetchHelper from "../fetch-helper";
import Loading from "../common/Loading";
import ErrorMessage from "../common/Error";

function MaintenanceSchedule() {
  const [carList, setCarList] = useState([]);
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // load all cars and their maintenance schedules when page opens
  useEffect(() => {
    loadSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // decide badge color based on remaining days and km
  function getBadgeClass(item) {
    if (item.isUrgent) return "badge badge-urgent";
    if (item.remainingDays <= 30 || item.remainingKm <= 3000)
      return "badge badge-warning";
    return "badge badge-ok";
  }

  // format remaining days text
  function getRemainingText(item) {
    if (item.remainingDays !== undefined) {
      if (item.remainingDays < 0) return "Po termínu!";
      if (item.remainingDays === 0) return "Dnes!";
      return `${item.remainingDays} dní`;
    }
    if (item.remainingKm !== undefined) {
      if (item.remainingKm <= 0) return "Po termínu!";
      return `${item.remainingKm.toLocaleString()} km`;
    }
    return "";
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Přehled údržby</h1>
      </div>

      {/* empty state when no cars */}
      {carList.length === 0 && (
        <div className="empty-state">
          <Icon path={mdiBell} size={3} color="#ccc" />
          <h3>Žádná vozidla</h3>
          <p>Nejprve přidejte vozidlo na stránce Vozidla.</p>
        </div>
      )}

      {/* schedule for each car */}
      {carList.map((car) => (
        <div key={car.id} style={{ marginBottom: "28px" }}>
          {/* car header */}
          <div className="card" style={{ marginBottom: "12px" }}>
            <div className="car-card-content">
              <div className="car-card-icon">
                <Icon path={mdiCar} size={1.4} color="#2563EB" />
              </div>
              <div className="car-card-info">
                <h2 className="car-card-title">
                  {car.brand} {car.model}
                </h2>
                <p className="car-card-mileage">
                  <Icon path={mdiSpeedometer} size={0.7} />
                  {car.mileage.toLocaleString()} km
                </p>
              </div>
            </div>
          </div>

          {/* maintenance items for this car */}
          {!scheduleData[car.id] || scheduleData[car.id].length === 0 ? (
            <div className="empty-state" style={{ padding: "20px" }}>
              <p>Žádné naplánované údržby — přidejte servisní záznamy s intervalem.</p>
            </div>
          ) : (
            scheduleData[car.id].map((item, index) => (
              <div key={index} className="card schedule-item">
                <div className="schedule-item-content">
                  {/* icon */}
                  <div className="service-record-icon">
                    <Icon path={mdiWrench} size={1} color="white" />
                  </div>

                  {/* info */}
                  <div className="schedule-item-info">
                    <div className="schedule-item-header">
                      <h3 className="service-record-title">
                        {item.serviceType}
                      </h3>
                      <span className={getBadgeClass(item)}>
                        {getRemainingText(item)}
                      </span>
                    </div>

                    <p className="service-record-meta">
                      {item.remainingKm !== undefined && (
                        <>
                          <Icon path={mdiSpeedometer} size={0.6} />
                          zbývá {item.remainingKm.toLocaleString()} km
                          &nbsp;•&nbsp;
                        </>
                      )}
                      {item.remainingDays !== undefined && (
                        <>
                          <Icon path={mdiCalendar} size={0.6} />
                          při {new Date(item.nextMaintenanceDate).toLocaleDateString("cs-CZ")}
                          &nbsp;({item.remainingDays} dní)
                        </>
                      )}
                    </p>

                    {/* progress bar */}
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, 100 - (item.remainingKm / item.currentMileage) * 100)
                          )}%`,
                          backgroundColor: item.isUrgent ? "#dc2626" : "#2563EB",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}

export default MaintenanceSchedule;