import { Outlet, NavLink } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiCar, mdiWrench } from "@mdi/js";

function Layout() {
  return (
    <div className="app-container">
      {/* top navigation bar */}
      <nav className="navbar">
        <div className="navbar-brand">
          {/* logo */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="white" fillOpacity="0.2" />
            <path
              d="M6 20 Q8 14 16 14 Q24 14 26 20"
              stroke="white"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="10" cy="21" r="2.5" fill="white" />
            <circle cx="22" cy="21" r="2.5" fill="white" />
            <path
              d="M11 14 L13 10 H19 L21 14"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="navbar-title">CarMaintenance</span>
        </div>

        <div className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <Icon path={mdiCar} size={0.9} />
            <span>Vozidla</span>
          </NavLink>

          <NavLink
            to="/schedule"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <Icon path={mdiWrench} size={0.9} />
            <span>Údržba</span>
          </NavLink>
        </div>
      </nav>

      {/* main content area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;