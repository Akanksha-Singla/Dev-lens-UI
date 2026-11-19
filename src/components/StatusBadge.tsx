import { Check, CircleDashed, CircleX, LoaderCircle } from "lucide-react";

interface Props {
  status: string;
}

function StatusBadge({ status }: Props) {
  const normalized = status.toLowerCase();
  const isIndexed = normalized === "indexed" || normalized === "completed";
  const isActive = ["indexing", "processing", "pending", "queued", "waiting"].includes(normalized);
  const Icon = isIndexed ? Check : isActive ? LoaderCircle : normalized === "failed" ? CircleX : CircleDashed;
  const label = normalized === "completed" ? "Indexed" : normalized === "processing" || normalized === "queued" || normalized === "waiting" ? "Indexing" : status || "Not indexed";

  return <span className={`status-badge ${isIndexed ? "status-good" : isActive ? "status-active" : normalized === "failed" ? "status-failed" : "status-neutral"}`}><Icon size={13} className={isActive ? "status-spin" : ""} />{label}</span>;
}

export default StatusBadge;