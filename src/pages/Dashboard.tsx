import {
  FolderGit2,
  Database,
  Activity,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

function Dashboard() {
  const stats = [
    {
      label: "Repositories",
      value: "4",
      icon: FolderGit2,
    },
    {
      label: "Indexed Files",
      value: "1,248",
      icon: Database,
    },
    {
      label: "AI Questions",
      value: "86",
      icon: Sparkles,
    },
    {
      label: "System Status",
      value: "Healthy",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back 👋
        </h1>

        <p className="mt-2 text-gray-500">
          Understand, explore and interact with your codebase using AI.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-indigo-50 p-2.5">
                  <Icon size={20} className="text-indigo-600" />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-gray-400"
                />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                {stat.label}
              </p>

              <p className="mt-1 text-2xl font-bold">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* AI Section */}
      <div className="rounded-2xl bg-indigo-600 p-8 text-white shadow-sm">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <Sparkles size={20} />

            <span className="text-sm font-medium">
              DevLens AI
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-bold">
            Ask questions about your codebase.
          </h2>

          <p className="mt-2 text-indigo-100">
            Find authentication flows, understand APIs, explore
            dependencies and discover how your application works.
          </p>

          <button className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-gray-100">
            Explore Codebase →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;