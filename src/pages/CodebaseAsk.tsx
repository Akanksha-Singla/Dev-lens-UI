import { useEffect, useRef, useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { ArrowDown, ArrowUp, Code2, FileCode2, LoaderCircle, MessageSquareText, Plus, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { askCodebase, getRepositories, type CodeAnswer, type CodeSource, type Repository } from "../services/repositoryService";

interface Message {
  id: number;
  role: "user" | "assistant";
  text?: string;
  answer?: CodeAnswer;
}

function SourceReference({ source, repository }: { source: CodeSource; repository: Repository }) {
  const path = source.file_path || `file-${source.repository_file_id}`;
  const target = `${repository.url.replace(/\/$/, "")}/blob/${encodeURIComponent(repository.default_branch)}/${path.split("/").map(encodeURIComponent).join("/")}#L${source.start_line}-L${source.end_line}`;

  return (
    <a className="source-reference" href={target} target="_blank" rel="noreferrer">
      <span className="source-file-icon"><FileCode2 size={15} /></span>
      <span className="source-ref-main"><strong>{path}</strong><small>Lines {source.start_line}–{source.end_line}</small></span>
      <span className="source-score">{Math.round(source.similarity * 100)}%</span>
    </a>
  );
}

function AssistantAnswer({ answer, repository }: { answer: CodeAnswer; repository: Repository }) {
  return (
    <div className="answer-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={{
        a: ({ children, ...props }) => <a {...props} target="_blank" rel="noreferrer">{children}</a>,
        pre: ({ children }) => <pre className="code-block">{children}</pre>,
      }}>{answer.answer}</ReactMarkdown>
      {answer.sources?.length > 0 && (
        <div className="source-list"><div className="source-list-heading"><span>REFERENCES</span><span>{answer.sources.length} {answer.sources.length === 1 ? "source" : "sources"}</span></div>{answer.sources.map((source, index) => <SourceReference key={`${source.repository_file_id}-${source.start_line}-${index}`} source={source} repository={repository} />)}</div>
      )}
      {!answer.sources?.length && <p className="source-empty">No matching code references were returned.</p>}
    </div>
  );
}

function CodebaseAsk() {
  const [searchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState(searchParams.get("repositoryId") ?? "");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const repositoryQuery = useQuery({ queryKey: ["repositories"], queryFn: () => getRepositories() });
  const repositories = repositoryQuery.data ?? [];
  const repository = repositories.find((item) => String(item.id) === selectedId) ?? repositories.find((item) => item.status === "indexed") ?? repositories[0];
  const mutation = useMutation({ mutationFn: ({ repositoryId, prompt }: { repositoryId: number; prompt: string }) => askCodebase(repositoryId, prompt) });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, mutation.isPending]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = question.trim();
    if (!prompt || !repository || mutation.isPending) return;

    const userMessage: Message = { id: Date.now(), role: "user", text: prompt };
    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    mutation.reset();
    try {
      const answer = await mutation.mutateAsync({ repositoryId: repository.id, prompt });
      setMessages((current) => [...current, { id: Date.now() + 1, role: "assistant", answer }]);
    } catch {
      setQuestion(prompt);
    }
  }

  function startSuggestedQuestion(prompt: string) {
    setQuestion(prompt);
  }

  if (repositoryQuery.isLoading) {
    return <div className="page-stack"><div className="skeleton skeleton-line wide" /><div className="skeleton chat-skeleton" /></div>;
  }

  return (
    <div className="ask-page">
      <div className="ask-header">
        <div><span className="eyebrow">CODEBASE Q&A</span><h1>Ask the code.</h1><p>Get grounded answers with direct references to your source.</p></div>
        <label className="repo-select-label"><span>ASKING ABOUT</span><select value={repository ? String(repository.id) : ""} onChange={(event) => { setSelectedId(event.target.value); setMessages([]); }} disabled={!repositories.length} aria-label="Choose a repository">{repositories.length ? repositories.map((item) => <option value={item.id} key={item.id}>{item.full_name}</option>) : <option value="">No repositories</option>}</select></label>
      </div>

      {repositoryQuery.isError && <div className="page-alert" role="alert">{repositoryQuery.error.message}<button className="text-button" onClick={() => void repositoryQuery.refetch()}>Retry</button></div>}
      {!repositories.length ? (
        <div className="empty-state chat-empty"><span className="empty-icon"><MessageSquareText size={21} /></span><h2>Connect a codebase to begin.</h2><p>Once indexed, your repository will be ready for questions.</p><Link className="button button-primary" to="/repositories"><Plus size={16} /> Browse repositories</Link></div>
      ) : (
        <section className="chat-shell" aria-label="Codebase conversation">
          <div className={`chat-context${repository.status !== "indexed" ? " chat-context-warn" : ""}`}><span className="context-icon"><Code2 size={17} /></span><span><strong>{repository.full_name}</strong><small>{repository.status === "indexed" ? `Branch ${repository.default_branch} · indexed and ready` : `Repository status: ${repository.status} · answers may be incomplete`}</small></span><StatusBadge status={repository.status} /><Link to={`/repositories/${repository.id}`} aria-label="View repository details">Details ↗</Link></div>
          <div className="conversation-scroll">
            {!messages.length ? (
              <div className="chat-welcome"><span className="welcome-spark"><Sparkles size={21} /></span><span className="eyebrow">DEVLENS AI</span><h2>What are you trying to understand?</h2><p>Ask a question about <strong>{repository.name}</strong>. Answers include source references when relevant code is found.</p><div className="suggestion-list"><button onClick={() => startSuggestedQuestion("Where does the application define its API routes?")}>Where are the API routes defined? <ArrowUp size={14} /></button><button onClick={() => startSuggestedQuestion("How does repository indexing work in this codebase?")}>How does indexing work? <ArrowUp size={14} /></button><button onClick={() => startSuggestedQuestion("What are the main services and how do they connect?")}>Map the main services <ArrowUp size={14} /></button></div></div>
            ) : (
              <div className="message-list">
                {messages.map((message) => (
                  <article className={`chat-message message-${message.role}`} key={message.id}>
                    <span className={`message-avatar ${message.role === "assistant" ? "ai-avatar" : "user-avatar"}`}>{message.role === "assistant" ? <Sparkles size={15} /> : "N"}</span>
                    <div className="message-body"><span className="message-author">{message.role === "assistant" ? "DevLens AI" : "You"}</span>{message.role === "user" ? <p>{message.text}</p> : message.answer ? <AssistantAnswer answer={message.answer} repository={repository} /> : null}</div>
                  </article>
                ))}
                {mutation.isPending && <article className="chat-message message-assistant"><span className="message-avatar ai-avatar"><Sparkles size={15} /></span><div className="message-body"><span className="message-author">DevLens AI</span><div className="thinking-state"><LoaderCircle size={16} className="spin" /> Searching indexed code…</div></div></article>}
                {mutation.isError && <div className="chat-error" role="alert"><span>{mutation.error.message}</span><button className="text-button" onClick={() => mutation.reset()}>Dismiss</button></div>}
                <div ref={bottomRef} />
              </div>
            )}
          </div>
          <form className="chat-composer" onSubmit={handleSubmit}>
            <textarea value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={1} maxLength={2000} placeholder={`Ask something about ${repository.name}…`} aria-label="Your question" disabled={mutation.isPending} />
            <div className="composer-bottom"><span>Answers are grounded in indexed source code.</span><span className="composer-controls"><small>{question.length}/2000</small><button className="send-button" type="submit" aria-label="Send question" disabled={!question.trim() || mutation.isPending}><ArrowUp size={18} /></button></span></div>
          </form>
        </section>
      )}
      {repositories.length > 0 && <div className="ask-footnote"><ArrowDown size={13} /> Source matches are retrieved from the selected repository's indexed code.</div>}
    </div>
  );
}

export default CodebaseAsk;