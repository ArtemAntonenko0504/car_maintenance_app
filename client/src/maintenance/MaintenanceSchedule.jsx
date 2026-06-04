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

  useEffect(() => {
    loadSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadSchedule() {
    setLoading(true);

    const carsResult = await FetchHelper.car.list();
    if (!carsResult.ok) {
      setError("Nepodařilo se načíst vozidla.");
      setLoading(false);
      return;
    }

    const cars = carsResult.data.itemList;
    setCarList(cars);

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

  // badge for km - color based on remaining km
  function getKmBadgeClass(item) {
    if (item.remainingKm === undefined) return null;
    if (item.remainingKm <= 1000) return "badge badge-urgent";
    if (item.remainingKm <= 3000) return "badge badge-warning";
    return "badge badge-ok";
  }

  // badge for days - color based on remaining days
  function getDaysBadgeClass(item) {
    if (item.remainingDays === undefined) return null;
    if (item.remainingDays <= 14) return "badge badge-urgent";
    if (item.remainingDays <= 30) return "badge badge-warning";
    return "badge badge-ok";
  }

  // badge text for days
  function getDaysBadgeText(item) {
    if (item.remainingDays === undefined) return null;
    if (item.remainingDays < 0) return "Po termínu!";
    if (item.remainingDays === 0) return "Dnes!";
    return `${item.remainingDays} dní`;
  }

  // badge text for km
  function getKmBadgeText(item) {
    if (item.remainingKm === undefined) return null;
    if (item.remainingKm <= 0) return "Po termínu!";
    return `${item.remainingKm.toLocaleString()} km`;
  }

  // progress bar percentage - based on whichever is more critical
  function getProgressPercent(item) {
    let kmPercent = null;
    let daysPercent = null;

    if (item.remainingKm !== undefined && item.nextMileage) {
      kmPercent = Math.min(100, Math.max(0,
        (item.currentMileage / item.nextMileage) * 100
      ));
    }

    if (item.remainingDays !== undefined) {
      const totalDays = item.remainingDays + 
        Math.ceil((new Date() - new Date(item.lastServiceDate)) / (1000 * 60 * 60 * 24));
      daysPercent = Math.min(100, Math.max(0,
        ((totalDays - item.remainingDays) / totalDays) * 100
      ));
    }

    // return whichever is higher (more critical)
    if (kmPercent !== null && daysPercent !== null) {
      return Math.max(kmPercent, daysPercent);
    }
    return kmPercent ?? daysPercent ?? 0;
  }

  // progress bar color - based on whichever is more critical
  function getProgressColor(item) {
    const kmUrgent = item.remainingKm !== undefined && item.remainingKm <= 1000;
    const daysUrgent = item.remainingDays !== undefined && item.remainingDays <= 14;
    const kmWarning = item.remainingKm !== undefined && item.remainingKm <= 3000;
    const daysWarning = item.remainingDays !== undefined && item.remainingDays <= 30;

    if (kmUrgent || daysUrgent) return "#dc2626";
    if (kmWarning || daysWarning) return "#d97706";
    return "#2563eb";
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Přehled údržby</h1>
      </div>

      {carList.length === 0 && (
        <div className="empty-state">
          <Icon path={mdiBell} size={3} color="#ccc" />
          <h3>Žádná vozidla</h3>
          <p>Nejprve přidejte vozidlo na stránce Vozidla.</p>
        </div>
      )}

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

          {/* schedule items */}
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
                    {/* title and badges */}
                    <div className="schedule-item-header">
                      <h3 className="service-record-title">
                        {item.serviceType}
                      </h3>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {getKmBadgeClass(item) && (
                          <span className={getKmBadgeClass(item)}>
                            {getKmBadgeText(item)}
                          </span>
                        )}
                        {getDaysBadgeClass(item) && (
                          <span className={getDaysBadgeClass(item)}>
                            {getDaysBadgeText(item)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* interval info */}
                    <p className="service-record-meta">
                      {item.intervalKm && (
                        <>
                          <Icon path={mdiSpeedometer} size={0.6} />
                          každých {item.intervalKm.toLocaleString()} km
                        </>
                      )}
                      {item.intervalKm && item.intervalDays && (
                        <>&nbsp;•&nbsp;</>
                      )}
                      {item.intervalDays && (
                        <>
                          <Icon path={mdiCalendar} size={0.6} />
                          každých {item.intervalDays} dní
                        </>
                      )}
                    </p>

                    {/* next maintenance date */}
                    {item.nextMaintenanceDate && (
                      <p className="service-record-meta">
                        <Icon path={mdiCalendar} size={0.6} />
                        příští údržba: {new Date(item.nextMaintenanceDate).toLocaleDateString("cs-CZ")}
                      </p>
                    )}

                    {/* progress bar */}
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${getProgressPercent(item)}%`,
                          backgroundColor: getProgressColor(item),
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