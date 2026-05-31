import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";

// Displayed while data is being fetched from the server
function Loading() {
  return (
    <div className="loading-container">
      <Icon path={mdiLoading} size={2} spin={true} color="#2563EB" />
      <p>Načítání...</p>
    </div>
  );
}

export default Loading;