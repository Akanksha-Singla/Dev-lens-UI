import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowDownRight, ArrowUpRight, Database, FolderGit2, MessageSquareText, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ConnectRepositoryModal from "../components/ConnectRepositoryModal";
import { useState } from "react";
import { getRepositories } from "../services/repositoryService";
import StatusBadge from "../components/StatusBadge";

function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const { data: repositories = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["repositories"],
    queryFn: () => getRepositories(),
  });
  const indexed = repositories.filter((repository) => repository.status === "indexed").length;
  const indexing = repositories.filter((repository) => repository.status === "indexing").length;
  const metrics = [
    { label: "Repositories", value: isLoading ? "--" : repositories.length, icon: FolderGit2, note: "Connected to workspace", tone: "green" },
    { label: "Indexed", value: isLoading ? "--" : indexed, icon: Database, note: "Ready for questions", tone: "lime" },
    { label: "In progress", value: isLoading ? "--" : indexing, icon: Activity, note: "Currently indexing", tone: "orange" },
  ];

  return (
    <div className="page-stack">
      <div className="page-heading dashboard-heading">
        <div>
          <span className="eyebrow">{new Intl.DateTimeFormat(undefined, { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date()).toUpperCase()}</span>
          <h1>Your code, in focus.</h1>
          <p>A clearer picture of what is happening across your codebases.</p>
        </div>
        <button className="button button-primary" onClick={() => setShowModal(true)}><Plus size={17} /> Connect repository</button>
      </div>

      {isError ? (
        <div className="page-alert" role="alert"><span>{error instanceof Error ? error.message : "Repositories could not be loaded."}</span><button className="text-button" onClick={() => void refetch()}>Try again</button></div>
      ) : null}

      <section className="metrics-grid" aria-label="Workspace statistics">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article className="metric-card" key={metric.label}>
              <div className={`metric-icon metric-${metric.tone}`}><Icon size={19} /></div>
              <div className="metric-info"><span>{metric.label}</span><strong>{isLoading ? <i className="skeleton skeleton-number" /> : metric.value}</strong><small>{metric.note}</small></div>
              <ArrowUpRight className="metric-arrow" size={17} />
            </article>
          );
        })}
        <Link className="metric-card metric-ask" to="/ask">
          <div className="metric-icon metric-dark"><MessageSquareText size={19} /></div>
          <div className="metric-info"><span>Codebase Q&A</span><strong>Ask away</strong><small>Explore with DevLens AI</small></div>
          <ArrowDownRight className="metric-arrow" size={17} />
        </Link>
      </section>

      <section className="dashboard-lower">
        <div className="section-block">
          <div className="section-heading">
            <div><span className="eyebrow">YOUR WORKSPACE</span><h2>Recently connected</h2></div>
            <Link className="text-link" to="/repositories">All repositories <span aria-hidden="true">↗</span></Link>
          </div>
          {isLoading ? (
            <div className="repo-list">{[1, 2, 3].map((item) => <div className="repo-row repo-row-skeleton" key={item}><i className="skeleton skeleton-mark" /><span className="repo-skeleton-lines"><i className="skeleton skeleton-line" /><i className="skeleton skeleton-line short" /></span><i className="skeleton skeleton-pill" /></div>)}</div>
          ) : repositories.length ? (
            <div className="repo-list">
              {repositories.slice(0, 4).map((repository) => (
                <Link className="repo-row" to={`/repositories/${repository.id}`} key={repository.id}>
                  <span className="repo-mark">{repository.name.slice(0, 2).toUpperCase()}</span>
                  <span className="repo-row-main"><strong>{repository.name}</strong><small>{repository.full_name} <span className="repo-dot">·</span> {repository.default_branch}</small></span>
                  <StatusBadge status={repository.status} />
                  <ArrowUpRight className="row-arrow" size={16} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state compact-empty">
              <span className="empty-icon"><FolderGit2 size={21} /></span>
              <h3>Your first repository starts here.</h3>
              <p>Connect a GitHub repository to begin indexing.</p>
              <button className="button button-secondary" onClick={() => setShowModal(true)}><Plus size={16} /> Connect repository</button>
            </div>
          )}
        </div>

        <aside className="ask-promo">
          <div className="promo-topline"><span className="promo-orbit"><Sparkles size={19} /></span><span>DEVLENS AI</span><span className="promo-ready"><i /> READY</span></div>
          <h2>Meet the codebase halfway.</h2>
          <p>Ask how a flow works, where a function lives, or what connects the pieces.</p>
          <Link className="promo-link" to="/ask">Open codebase Q&A <span aria-hidden="true">↗</span></Link>
          <div className="promo-watermark">DL</div>
        </aside>
      </section>
      {showModal && <ConnectRepositoryModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default Dashboard;