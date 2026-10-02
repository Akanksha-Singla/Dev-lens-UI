import { X } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface Props {
  onClose: () => void;
}

function ConnectRepositoryModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-semibold">
              Connect Repository
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add a GitHub repository to DevLens.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium hover:bg-gray-50">
            <FaGithub size={19} />
            Connect with GitHub
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div>
            <label className="text-sm font-medium">
              GitHub Repository ID
            </label>

            <input
              type="number"
              placeholder="e.g. 123456789"
              className="mt-2 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700">
            Add Repository
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConnectRepositoryModal;