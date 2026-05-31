import { useState } from "react";
import Icon from "@mdi/react";
import { mdiAlertCircle } from "@mdi/js";
import FetchHelper from "../fetch-helper";

function ServiceRecordDeleteDialog({ record, onDelete, onClose }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete() {
    setDeleting(true);
    const result = await FetchHelper.serviceRecord.delete({
      recordId: record.id,
    });
    setDeleting(false);

    if (result.ok) {
      onDelete();
    } else {
      setError("Nepodařilo se smazat záznam.");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Smazat záznam</h2>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <Icon path={mdiAlertCircle} size={1.5} color="#dc2626" />
          <p style={{ fontSize: "14px", color: "#444" }}>
            Opravdu chcete smazat záznam{" "}
            <strong>{record.serviceType}</strong>?
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

export default ServiceRecordDeleteDialog;