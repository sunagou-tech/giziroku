import { TaskStatus } from "@/lib/data";

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <span className={`status status-${status}`}>{status}</span>;
}
