import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, GitBranch, Plus, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import ConnectRepositoryModal from "../components/ConnectRepositoryModal";
import StatusBadge from "../components/StatusBadge";
import { getRepositories } from "../services/repositoryService";

function Repositories() {
  const [showModal, setShowModal] = useState(false);
  const { data: repositories = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["repositories"],
    queryFn: () => getRepositories(),
  });

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div><span className="eyebrow">CODEBASES</span><h1>Repositories</h1><p>Every connected codebase, in one place.</p></div>
        <button className="button button-primary" onClick={() => setShowModal(true)}><Plus size={17} /> Connect repository</button>
      </div>

      <div className="list-toolbar"><span>{isLoading ? "Loading repositories…" : `${repositories.length} ${repositories.length === 1 ? "repository" : "repositories"}`}</span><span className="toolbar-live"><i /> SYNCED WITH WORKSPACE</span></div>
      {isError && <div className="page-alert" role="alert"><span>{error instanceof Error ? error.message : "Repositories could not be loaded."}</span><button className="text-button" onClick={() => void refetch()}><RefreshCw size={14} /> Retry</button></div>}

      {isLoading ? (
        <div className="repository-grid" aria-label="Loading repositories">{[1, 2, 3].map((item) => <div className="repository-card repo-card-loading" key={item}><i className="skeleton skeleton-mark" /><i className="skeleton skeleton-pill" /><i className="skeleton skeleton-line wide" /><i className="skeleton skeleton-line" /><i className="skeleton skeleton-line short" /></div>)}</div>
      ) : repositories.length ? (
        <div className="repository-grid">
          {repositories.map((repository) => (
            <article className="repository-card" key={repository.id}>
              <div className="repository-card-top"><span className="repo-mark repo-mark-large">{repository.name.slice(0, 2).toUpperCase()}</span><StatusBadge status={repository.status} /></div>
              <div className="repository-card-title"><h2>{repository.name}</h2><a className="icon-button mini-icon" href={repository.url} target="_blank" rel="noreferrer" aria-label={`Open ${repository.full_name} on GitHub`}><ArrowUpRight size={16} /></a></div>
              <p className="repo-fullname">{repository.full_name}</p>
              <div className="repository-meta"><span><GitBranch size={14} /> {repository.default_branch || "Default branch"}</span><span>#{repository.github_repo_id}</span></div>
              <div className="repository-card-footer"><span>{repository.last_indexed_at ? `Indexed ${new Date(repository.last_indexed_at).toLocaleDateString()}` : "Not indexed yet"}</span><Link className="text-link" to={`/repositories/${repository.id}`}>View details <span aria-hidden="true">↗</span></Link></div>
            </article>
          ))}
        </div>
      ) : !isError ? (
        <div className="empty-state empty-repositories"><span className="empty-icon"><span className="repo-mark">GH</span></span><span className="eyebrow">A CLEAN SLATE</span><h2>No repositories yet.</h2><p>Connect a GitHub repository to see its indexing status and ask questions about the code.</p><button className="button button-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Connect repository</button></div>
      ) : null}
      {showModal && <ConnectRepositoryModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default Repositories;