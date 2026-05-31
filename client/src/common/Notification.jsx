import { useEffect } from "react";
import Icon from "@mdi/react";
import { mdiCheckCircle, mdiAlertCircle } from "@mdi/js";

// Small notification shown after successful or failed action
function Notification({ message, type = "success", onClose }) {
  // Automatically close notification after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification notification-${type}`}>
      <Icon
        path={type === "success" ? mdiCheckCircle : mdiAlertCircle}
        size={1}
        color={type === "success" ? "#16A34A" : "#DC2626"}
      />
      <span>{message}</span>
    </div>
  );
}

export default Notification;