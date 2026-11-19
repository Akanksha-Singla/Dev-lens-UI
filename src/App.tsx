import { lazy, Suspense, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import Repositories from "./pages/Repository";
import ErrorBoundary from "./components/ErrorBoundary";

const RepositoryDetails = lazy(() => import("./pages/RepositoryDetails"));
const CodebaseAsk = lazy(() => import("./pages/CodebaseAsk"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 15_000, retry: 1, refetchOnWindowFocus: true },
  },
});

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    localStorage.getItem("devlens-theme") === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("devlens-theme", theme);
  }, [theme]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
            <Route element={<DashboardLayout theme={theme} onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/repositories" element={<Repositories />} />
              <Route path="/repositories/:id" element={<Suspense fallback={<div className="route-loading"><span className="spin-dot" /> Loading view…</div>}><RepositoryDetails /></Suspense>} />
              <Route path="/ask" element={<Suspense fallback={<div className="route-loading"><span className="spin-dot" /> Loading view…</div>}><CodebaseAsk /></Suspense>} />
            </Route>
            <Route path="*" element={<Navigate replace to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;