import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

interface Props {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

function DashboardLayout({ theme, onToggleTheme }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} onMenu={() => setMenuOpen(!menuOpen)} />
      <div className="workspace">
        <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
        {menuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;