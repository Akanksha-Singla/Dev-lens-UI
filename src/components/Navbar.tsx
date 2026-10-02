import { Bell } from "lucide-react";
import { FaGithub } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
          D
        </div>

        <span className="text-lg font-bold tracking-tight">
          DevLens
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <Bell size={19} />
        </button>

        <div className="flex items-center gap-2 border-l pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
            <FaGithub size={17} />
          </div>

          <span className="text-sm font-medium">
            GitHub User
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;