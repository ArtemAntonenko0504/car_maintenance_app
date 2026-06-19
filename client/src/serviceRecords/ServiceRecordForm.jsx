import { useState } from "react";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import FetchHelper from "../fetch-helper";

// list of available service types
const SERVICE_TYPES = [
  "Výměna oleje",
  "Kontrola brzd",
  "Výměna vzduchového filtru",
  "Výměna zapalovacích svíček",
  "Kontrola klimatizace",
  "Výměna pneumatik",
  "Technická kontrola",
  "Jiný servis",
];

function ServiceRecordForm({ carId, record, onSave, onClose }) {
  // if record is passed - we are editing, if not - we are creating
  const isEditing = !!record;

  const [serviceType, setServiceType] = useState(
    record ? record.serviceType : ""
  );
  const [date, setDate] = useState(
    record ? record.date.split("T")[0] : ""
  );
  const [notes, setNotes] = useState(record ? record.notes || "" : "");
  const [intervalKm, setIntervalKm] = useState(
    record ? record.intervalKm || "" : ""
  );
  const [intervalDays, setIntervalDays] = useState(
    record ? record.intervalDays || "" : ""
  );
  const [mileage, setMileage] = useState(record ? record.mileage : "");

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function validate() {
    const newErrors = {};
    if (!serviceType) newErrors.serviceType = "Vyberte typ servisu.";
    if (!date) newErrors.date = "Zadejte datum.";
    if (mileage === "" || mileage === null || mileage === undefined) {
      newErrors.mileage = "Zadejte stav kilometrů.";
    }
    return newErrors;
  }

  async function handleSubmit() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);

    // convert date to ISO format that backend expects
    const dtoIn = {
      serviceType,
      date: new Date(date + "T12:00:00").toISOString(),
      notes: notes || undefined,
      intervalKm: intervalKm ? Number(intervalKm) : undefined,
      intervalDays: intervalDays ? Number(intervalDays) : undefined,
      mileage: Number(mileage),
    };

    let result;
    if (isEditing) {
      result = await FetchHelper.serviceRecord.update({
        ...dtoIn,
        recordId: record.id,
      });
    } else {
      result = await FetchHelper.serviceRecord.create({
        ...dtoIn,
        carId,
      });
    }

    setSaving(false);

    if (result.ok) {
      onSave(isEditing ? "Záznam byl upraven." : "Záznam byl přidán.");
    } else {
      setErrors({ server: result.data.message });
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? "Upravit záznam" : "Nový servisní záznam"}
          </h2>
          <button className="btn btn-secondary" onClick={onClose}>
            <Icon path={mdiClose} size={0.9} />
          </button>
        </div>

        {errors.server && (
          <p className="form-error" style={{ marginBottom: "12px" }}>
            {errors.server}
          </p>
        )}

        <div className="form-group">
          <label className="form-label">Typ servisu</label>
          <select
            className="form-input"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            disabled={isEditing}
            style={isEditing ? { backgroundColor: "#f1f5f9", cursor: "not-allowed" } : {}}
          >
            <option value="">Vyberte typ servisu</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.serviceType && <p className="form-error">{errors.serviceType}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Datum</label>
          <input
            className="form-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && <p className="form-error">{errors.date}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Stav kilometrů</label>
          <input
            className="form-input"
            type="number"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            disabled={isEditing}
            style={isEditing ? { backgroundColor: "#f1f5f9", cursor: "not-allowed" } : {}}
            placeholder="např. 15000"
          />
          {errors.mileage && <p className="form-error">{errors.mileage}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Interval údržby — km (nepovinné)
          </label>
          <input
            className="form-input"
            type="number"
            value={intervalKm}
            onChange={(e) => setIntervalKm(e.target.value)}
            placeholder="např. 15000"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Interval údržby — dny (nepovinné)
          </label>
          <input
            className="form-input"
            type="number"
            value={intervalDays}
            onChange={(e) => setIntervalDays(e.target.value)}
            placeholder="např. 365"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Poznámky — nepovinné</label>
          <textarea
            className="form-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Poznámky k servisu..."
            rows={3}
            maxLength={250}
          />
          <p style={{ fontSize: "12px", color: "#999", textAlign: "right" }}>
            {notes.length}/250
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Zrušit
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Ukládání..." : isEditing ? "Uložit změny" : "Uložit záznam"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceRecordForm;