import Link from "next/link";
import { AppShell, PageHeader } from "@/app/components/AppShell";
import { StatusBadge } from "@/app/components/StatusBadge";
import { allTasks, getMeetingTitle } from "@/lib/data";

export default function TasksPage() {
  return (
    <AppShell>
      <PageHeader
        title="タスク一覧"
        description="会議から生まれた次のアクションを、担当者と期限で追跡します。"
      />
      <section className="toolbar" aria-label="タスク絞り込み">
        <input aria-label="タスク検索" placeholder="タスク名、担当者で検索" />
        <select aria-label="ステータス">
          <option>すべてのステータス</option>
          <option>未着手</option>
          <option>進行中</option>
          <option>確認待ち</option>
        </select>
      </section>
      <section className="panel">
        <div className="task-table">
          <div className="task-table-head">
            <span>タスク</span>
            <span>会議</span>
            <span>担当者</span>
            <span>期限</span>
            <span>状態</span>
          </div>
          {allTasks.map((task) => (
            <Link className="task-table-row" href={`/meetings/${task.meetingId}`} key={task.id}>
              <strong>{task.title}</strong>
              <span>{getMeetingTitle(task.meetingId)}</span>
              <span>{task.owner}</span>
              <span>{task.dueDate}</span>
              <StatusBadge status={task.status} />
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
