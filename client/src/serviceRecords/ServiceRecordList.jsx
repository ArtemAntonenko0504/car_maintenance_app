import Icon from "@mdi/react";
import { mdiWrench, mdiCalendar, mdiSpeedometer } from "@mdi/js";

// icons for different service types
const serviceIcons = {
  "Výměna oleje": mdiWrench,
  "Kontrola brzd": mdiWrench,
  "Výměna vzduchového filtru": mdiWrench,
};

function ServiceRecordList({ serviceRecords, onEdit, onDelete }) {
  // empty state when no records
  if (serviceRecords.length === 0) {
    return (
      <div className="empty-state">
        <Icon path={mdiWrench} size={3} color="#ccc" />
        <h3>Žádné servisní záznamy</h3>
        <p>Přidejte první servisní záznam kliknutím na tlačítko výše.</p>
      </div>
    );
  }

  return (
    <div>
      {serviceRecords.map((record) => (
        <div key={record.id} className="card service-record-card">
          <div className="service-record-content">
            {/* icon */}
            <div className="service-record-icon">
              <Icon
                path={serviceIcons[record.serviceType] || mdiWrench}
                size={1.2}
                color="white"
              />
            </div>

            {/* info */}
            <div className="service-record-info">
              <h3 className="service-record-title">{record.serviceType}</h3>
              <p className="service-record-meta">
                <Icon path={mdiCalendar} size={0.6} />
                {new Date(record.date).toLocaleDateString("cs-CZ")}
                &nbsp;•&nbsp;
                <Icon path={mdiSpeedometer} size={0.6} />
                {record.mileage.toLocaleString()} km
              </p>
              {record.notes && (
                <p className="service-record-notes">{record.notes}</p>
              )}
            </div>

            {/* actions */}
            <div className="service-record-actions">
              <button
                className="btn btn-secondary"
                onClick={() => onEdit(record)}
              >
                Upravit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onDelete(record)}
              >
                Smazat
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ServiceRecordList;