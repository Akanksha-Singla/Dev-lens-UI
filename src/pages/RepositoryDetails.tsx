import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, CalendarDays, Database, ExternalLink, GitBranch, LoaderCircle, Play, RefreshCw, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { deleteRepository, getIndexingStatus, getRepositoryById, startIndexing } from "../services/repositoryService";

const ACTIVE_JOB_STATES = ["pending", "queued", "waiting", "processing", "indexing"];

function RepositoryDetails() {
  const { id = "" } = useParams();
  const repositoryId = Number(id);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const repositoryQuery = useQuery({
    queryKey: ["repository", repositoryId],
    queryFn: () => getRepositoryById(repositoryId),
    enabled: Number.isInteger(repositoryId) && repositoryId > 0,
  });
  const repository = repositoryQuery.data;
  const jobQuery = useQuery({
    queryKey: ["indexing-status", repositoryId],
    queryFn: () => getIndexingStatus(repositoryId),
    enabled: !!repository,
    refetchInterval: (query) => ACTIVE_JOB_STATES.includes(query.state.data?.status?.toLowerCase() ?? "") ? 1600 : false,
  });
  const indexMutation = useMutation({
    mutationFn: () => startIndexing(repositoryId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["repository", repositoryId] }),
        queryClient.invalidateQueries({ queryKey: ["indexing-status", repositoryId] }),
        queryClient.invalidateQueries({ queryKey: ["repositories"] }),
      ]);
    },
  });
  const removeMutation = useMutation({
    mutationFn: () => deleteRepository(repositoryId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["repositories"] });
      navigate("/repositories");
    },
  });

  if (repositoryQuery.isLoading) {
    return <div className="page-stack"><div className="skeleton skeleton-line wide" /><div className="skeleton detail-skeleton" /><div className="skeleton detail-skeleton short" /></div>;
  }
  if (repositoryQuery.isError || !repository) {
    return <div className="page-stack"><Link className="back-link" to="/repositories"><ArrowLeft size={15} /> Repositories</Link><div className="empty-state"><span className="eyebrow">REPOSITORY UNAVAILABLE</span><h2>{repositoryQuery.error instanceof Error ? repositoryQuery.error.message : "This repository could not be found."}</h2><button className="button button-secondary" onClick={() => void repositoryQuery.refetch()}><RefreshCw size={15} /> Retry</button></div></div>;
  }

  const job = jobQuery.data;
  const isIndexing = ACTIVE_JOB_STATES.includes(repository.status.toLowerCase()) || ACTIVE_JOB_STATES.includes(job?.status.toLowerCase() ?? "");
  const hasProgress = !!job && (job.total_files > 0 || isIndexing);
  const progress = job?.total_files ? Math.min(100, Math.round((job.files_processed / job.total_files) * 100)) : job?.status === "completed" ? 100 : 0;

  function handleDelete() {
    if (!repository) return;
    const repositoryName = repository.full_name;
    if (window.confirm(`Remove ${repositoryName} from this workspace?`)) {
      removeMutation.mutate();
    }
  }

  return (
    <div className="page-stack">
      <Link className="back-link" to="/repositories"><ArrowLeft size={15} /> All repositories</Link>
      <section className="repo-detail-hero">
        <div className="repo-detail-title">
          <span className="repo-mark repo-mark-xl">{repository.name.slice(0, 2).toUpperCase()}</span>
          <div><span className="eyebrow">REPOSITORY OVERVIEW</span><h1>{repository.name}</h1><p>{repository.full_name}</p></div>
        </div>
        <div className="repo-detail-actions">
          <StatusBadge status={repository.status} />
          <a className="button button-secondary" href={repository.url} target="_blank" rel="noreferrer">GitHub <ExternalLink size={15} /></a>
          <button className="button button-primary" onClick={() => indexMutation.mutate()} disabled={isIndexing || indexMutation.isPending}>
            {indexMutation.isPending || isIndexing ? <><LoaderCircle size={16} className="spin" /> Indexing…</> : <><Play size={15} fill="currentColor" /> {repository.status === "indexed" ? "Re-index" : "Start indexing"}</>}
          </button>
        </div>
      </section>

      {indexMutation.isError && <div className="page-alert" role="alert"><span>{indexMutation.error.message}</span><button className="text-button" onClick={() => indexMutation.mutate()}>Try again</button></div>}
      {removeMutation.isError && <div className="page-alert" role="alert"><span>{removeMutation.error.message}</span></div>}

      <div className="detail-columns">
        <section className="detail-panel progress-panel">
          <div className="section-heading"><div><span className="eyebrow">INDEXING</span><h2>Index status</h2></div><StatusBadge status={job?.status ?? repository.status} /></div>
          {hasProgress ? (
            <>
              <div className="progress-numbers"><strong>{job?.files_processed ?? 0}<span> / {job?.total_files ?? 0}</span></strong><small>files processed</small></div>
              <div className="progress-track" role="progressbar" aria-label="Indexing progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>
              <div className="progress-caption"><span>{job?.status === "completed" ? "Indexing complete" : job?.status === "failed" ? "Indexing stopped" : "Scanning and embedding source files"}</span><strong>{progress}%</strong></div>
              {job?.error && <div className="inline-alert" role="alert">{job.error}</div>}
              {isIndexing && <p className="poll-note"><span className="live-dot" /> Updating automatically</p>}
            </>
          ) : (
            <div className="progress-empty"><span className="empty-icon"><Database size={19} /></span><h3>Ready to index</h3><p>Start an index to make this codebase searchable in Q&A.</p><button className="text-button" onClick={() => indexMutation.mutate()} disabled={indexMutation.isPending}><Play size={14} /> Start indexing</button></div>
          )}
          {jobQuery.isError && !isIndexing && <p className="muted-copy">Progress details are not available yet.</p>}
        </section>

        <section className="detail-panel metadata-panel">
          <div className="section-heading"><div><span className="eyebrow">AT A GLANCE</span><h2>Repository details</h2></div><a className="icon-button mini-icon" href={repository.url} target="_blank" rel="noreferrer" aria-label="Open repository on GitHub"><ArrowUpRight size={17} /></a></div>
          <dl className="metadata-list">
            <div><dt><GitBranch size={15} /> Default branch</dt><dd>{repository.default_branch || "Not set"}</dd></div>
            <div><dt><Database size={15} /> GitHub ID</dt><dd>#{repository.github_repo_id}</dd></div>
            <div><dt><CalendarDays size={15} /> Connected</dt><dd>{new Date(repository.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</dd></div>
            <div><dt><RefreshCw size={15} /> Last indexed</dt><dd>{repository.last_indexed_at ? new Date(repository.last_indexed_at).toLocaleString() : "Never"}</dd></div>
          </dl>
          <Link className="detail-ask-link" to={`/ask?repositoryId=${repository.id}`}><span className="metric-icon metric-dark"><span>AI</span></span><span><strong>Ask this codebase</strong><small>Open DevLens Q&A with this repo selected</small></span><ArrowUpRight size={16} /></Link>
        </section>
      </div>

      <section className="danger-zone"><div><strong>Remove repository</strong><p>Disconnect this codebase from the workspace.</p></div><button className="button button-danger" onClick={handleDelete} disabled={removeMutation.isPending}><Trash2 size={15} /> Remove</button></section>
    </div>
  );
}

export default RepositoryDetails;