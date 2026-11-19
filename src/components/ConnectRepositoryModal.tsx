import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AlertCircle, GitBranch, LoaderCircle, X } from "lucide-react";
import { createRepository, DEMO_USER_ID } from "../services/repositoryService";

interface Props {
  onClose: () => void;
}

function ConnectRepositoryModal({ onClose }: Props) {
  const [repoUrl, setRepoUrl] = useState("");
  const [githubRepoId, setGithubRepoId] = useState("");
  const [branch, setBranch] = useState("main");
  const [validationError, setValidationError] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: createRepository,
    onSuccess: async (repository) => {
      await queryClient.invalidateQueries({ queryKey: ["repositories"] });
      onClose();
      navigate(`/repositories/${repository.id}`);
    },
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");
    mutation.reset();

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(repoUrl.trim());
    } catch {
      setValidationError("Enter a valid GitHub repository URL.");
      return;
    }

    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    if (parsedUrl.hostname.toLowerCase() !== "github.com" || segments.length < 2) {
      setValidationError("Use a URL in the format github.com/owner/repository.");
      return;
    }

    const owner = segments[0];
    const name = segments[1].replace(/\.git$/i, "");
    const id = Number(githubRepoId);
    if (!Number.isSafeInteger(id) || id <= 0) {
      setValidationError("Enter the numeric repository ID from GitHub.");
      return;
    }

    const timestamp = new Date().toISOString();
    await mutation.mutateAsync({
      userId: DEMO_USER_ID,
      githubRepoId: id,
      name,
      fullName: `${owner}/${name}`,
      url: `https://github.com/${owner}/${name}`,
      defaultBranch: branch.trim() || "main",
      createdAt: timestamp,
      updatedAt: timestamp,
    }).catch(() => undefined);
  }

  const errorMessage = validationError || mutation.error?.message;

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !mutation.isPending && onClose()}>
      <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="connect-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">NEW CONNECTION</span>
            <h2 id="connect-title">Connect a repository</h2>
            <p>Link a GitHub repository to your workspace.</p>
          </div>
          <button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose} disabled={mutation.isPending}><X size={19} /></button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="repo-url">GitHub repository URL</label>
          <div className="input-with-icon"><GitBranch size={17} /><input id="repo-url" autoFocus type="url" required placeholder="https://github.com/owner/repository" value={repoUrl} onChange={(event) => setRepoUrl(event.target.value)} /></div>
          <div className="field-grid">
            <div>
              <label className="field-label" htmlFor="repo-id">GitHub repository ID</label>
              <input className="text-input" id="repo-id" type="number" min="1" step="1" required placeholder="123456789" value={githubRepoId} onChange={(event) => setGithubRepoId(event.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="repo-branch">Default branch</label>
              <input className="text-input" id="repo-branch" type="text" required maxLength={100} placeholder="main" value={branch} onChange={(event) => setBranch(event.target.value)} />
            </div>
          </div>
          {errorMessage && <div className="inline-alert" role="alert"><AlertCircle size={17} /><span>{errorMessage}</span></div>}
          <div className="modal-actions">
            <button className="button button-secondary" type="button" onClick={onClose} disabled={mutation.isPending}>Cancel</button>
            <button className="button button-primary" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <><LoaderCircle size={16} className="spin" /> Connecting…</> : <>Connect repository <span aria-hidden="true">↗</span></>}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ConnectRepositoryModal;