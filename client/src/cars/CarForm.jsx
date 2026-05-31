import { useState } from "react";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import FetchHelper from "../fetch-helper";

function CarForm({ car, onSave, onClose }) {
  // if car is passed - we are editing, if not - we are creating
  const isEditing = !!car;

  // form fields - fill with existing data if editing
  const [brand, setBrand] = useState(car ? car.brand : "");
  const [model, setModel] = useState(car ? car.model : "");
  const [year, setYear] = useState(car ? car.year : "");
  const [mileage, setMileage] = useState(car ? car.mileage : "");
  const [vin, setVin] = useState(car ? car.vin : "");

  // error messages for each field
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // simple validation before sending to server
  function validate() {
    const newErrors = {};
    if (!brand) newErrors.brand = "Zadejte značku vozidla.";
    if (!model) newErrors.model = "Zadejte model vozidla.";
    if (!year) newErrors.year = "Zadejte rok výroby.";
    if (!mileage && mileage !== 0) newErrors.mileage = "Zadejte stav kilometrů.";
    if (!vin) newErrors.vin = "Zadejte VIN kód.";
    return newErrors;
  }

  async function handleSubmit() {
    // check for errors first
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);

    const dtoIn = {
      brand,
      model,
      year: Number(year),
      mileage: Number(mileage),
      vin,
    };

    let result;
    if (isEditing) {
      // update existing car
      result = await FetchHelper.car.update({ ...dtoIn, carId: car.id });
    } else {
      // create new car
      result = await FetchHelper.car.create(dtoIn);
    }

    setSaving(false);

    if (result.ok) {
      onSave(isEditing ? "Vozidlo bylo upraveno." : "Vozidlo bylo přidáno.");
    } else {
      setErrors({ server: result.data.message });
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? "Upravit vozidlo" : "Přidat vozidlo"}
          </h2>
          <button className="btn btn-secondary" onClick={onClose}>
            <Icon path={mdiClose} size={0.9} />
          </button>
        </div>

        {/* server error message */}
        {errors.server && (
          <p className="form-error" style={{ marginBottom: "12px" }}>
            {errors.server}
          </p>
        )}

        <div className="form-group">
          <label className="form-label">Značka</label>
          <input
            className="form-input"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="např. Škoda"
          />
          {errors.brand && <p className="form-error">{errors.brand}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Model</label>
          <input
            className="form-input"
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="např. Octavia"
          />
          {errors.model && <p className="form-error">{errors.model}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Rok výroby</label>
          <input
            className="form-input"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="např. 2020"
          />
          {errors.year && <p className="form-error">{errors.year}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Stav kilometrů</label>
          <input
            className="form-input"
            type="number"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="např. 15000"
          />
          {errors.mileage && <p className="form-error">{errors.mileage}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">VIN kód</label>
          <input
            className="form-input"
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="např. WBA3A5G59DNP26082"
          />
          {errors.vin && <p className="form-error">{errors.vin}</p>}
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
            {saving ? "Ukládání..." : isEditing ? "Uložit změny" : "Přidat vozidlo"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarForm;