import Icon from "@mdi/react";
import { mdiAlertCircle } from "@mdi/js";

// Displayed when server returns an error
function Error({ message }) {
  return (
    <div className="error-container">
      <Icon path={mdiAlertCircle} size={2} color="#DC2626" />
      <p>{message || "Něco se pokazilo. Zkuste to znovu."}</p>
    </div>
  );
}

export default Error;