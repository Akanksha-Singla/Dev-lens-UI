import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderGit2,
  Settings,
} from "lucide-react";

function Sidebar() {
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
  ];

  return (
    <aside className="w-64 min-h-[calc(100vh-64px)] border-r bg-white p-4">
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={18} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-8 border-t pt-4">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500">
          <Settings size={18} />
          Settings
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;