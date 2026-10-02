import {useEffect ,useState} from "react";
import { getRepositories } from "../services/repositoryService";
import ConnectRepositoryModal from "../components/ConnectRepositoryModal";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  status: string;
}



function Repositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading,setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(()=>{
   async function fetchRespositories() {
 try{
    const response  = await getRepositories(4); 
    console.log("Response datacomponent :", response); // Log the response data for debugging
    if(response.ResultCode !== 200){
      console.error("Error fetching repositories1:", response.ReturnMessage);
      setLoading(false);
      return;
    }
    // Replace 1 with the actual user ID
      setRepositories(response.Responsedata);
      console.log("Repositories fetched1:", repositories); // Log the repositories for debugging
      setLoading(false);
    }catch(error){
      console.error("Error fetching repositories2:", error);
    }
   }
  fetchRespositories()
  },[]);

  if (loading) {
    return <p>Loading repositories...</p>;
  }

  return (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Repositories
        </h1>

        <p className="mt-1 text-gray-500">
          Manage and analyze your connected codebases.
        </p>
      </div>

      <button
        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        onClick={() => setShowModal(true)}
      >
        + Connect Repository
      </button>
    </div>

    {/* Repository Grid */}
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {repositories.map((repo) => (
        <div
          key={repo.id}
          className="group rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <span className="text-lg">📦</span>
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                repo.status === "indexed"
                  ? "bg-green-50 text-green-700"
                  : repo.status === "indexing"
                  ? "bg-yellow-50 text-yellow-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {repo.status}
            </span>
          </div>

          <h2 className="mt-5 text-lg font-semibold group-hover:text-indigo-600">
            {repo.name}
          </h2>

          <p className="mt-1 truncate text-sm text-gray-500">
            {repo.full_name}
          </p>

          <div className="mt-6 border-t pt-4">
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View Repository →
            </button>
          </div>
        </div>
      ))}
    </div>
    {showModal && (
      <ConnectRepositoryModal
        onClose={() => setShowModal(false)}
      />
)}
  </div>
);
}

export default Repositories;