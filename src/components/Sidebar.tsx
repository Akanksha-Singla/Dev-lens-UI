import { NavLink } from "react-router-dom";
import {
  MessageSquareText,
  LayoutDashboard,
  FolderGit2,
  CircleHelp,
} from "lucide-react";

interface Props {
  open: boolean;
  onNavigate: () => void;
}

function Sidebar({ open, onNavigate }: Props) {
  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Repositories",
      path: "/repositories",
      icon: FolderGit2,
    },
    {
      name: "Codebase Q&A",
      path: "/ask",
      icon: MessageSquareText,
    },
  ];

  return (
    <aside className={`sidebar${open ? " sidebar-open" : ""}`}>
      <div className="sidebar-section-label">WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onNavigate}
              end={link.path === "/dashboard"}
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link-active" : ""}`
              }
            >
              <Icon size={18} />
              {link.name}
              {link.name === "Codebase Q&A" && <span className="nav-new-dot" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-tip">
          <CircleHelp size={17} />
          <span><strong>Need a starting point?</strong><br />Ask DevLens about any indexed repo.</span>
        </div>
        <div className="sidebar-version">DEVLENS <span>DEMO BUILD</span></div>
      </div>
    </aside>
  );
}

export default Sidebar;