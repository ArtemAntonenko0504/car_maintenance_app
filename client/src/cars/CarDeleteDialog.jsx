import Icon from "@mdi/react";
import { mdiAlertCircle } from "@mdi/js";
import { useState } from "react";
import FetchHelper from "../fetch-helper";

function CarDeleteDialog({ car, onDelete, onClose }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete() {
    setDeleting(true);
    const result = await FetchHelper.car.delete({ carId: car.id });
    setDeleting(false);

    if (result.ok) {
      onDelete();
    } else {
      setError("Nepodařilo se smazat vozidlo.");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Smazat vozidlo</h2>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <Icon path={mdiAlertCircle} size={1.5} color="#dc2626" />
          <p style={{ fontSize: "14px", color: "#444" }}>
            Opravdu chcete smazat vozidlo <strong>{car.brand} {car.model}</strong>?
            Budou smazány také všechny servisní záznamy tohoto vozidla.
          </p>
        </div>

        {error && (
          <p className="form-error" style={{ marginTop: "12px" }}>
            {error}
          </p>
        )}

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Zrušit
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Mazání..." : "Smazat"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarDeleteDialog;