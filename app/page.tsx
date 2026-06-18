import Link from "next/link";
import { AppShell, PageHeader } from "@/app/components/AppShell";
import { CompletableTaskList } from "@/app/components/CompletableTaskList";
import { GoogleCalendarBoard } from "@/app/components/GoogleCalendarBoard";
import { GoogleMeetingCards } from "@/app/components/GoogleMeetingCards";
import { allTasks } from "@/lib/data";

export default function DashboardPage() {
  const urgentTasks = allTasks.slice(0, 4);

  return (
    <AppShell>
      <PageHeader
        title="ダッシュボード"
        description="今日の会議、未完了アクション、見返すべき決定事項をまとめて確認できます。"
        action={<Link className="primary-button" href="/meetings/new">新規会議</Link>}
      />

      <section className="metric-grid" aria-label="会議サマリー">
        <div className="metric">
          <span>今週の会議</span>
          <strong>12</strong>
          <small>前週比 +2件</small>
        </div>
        <div className="metric">
          <span>未完了タスク</span>
          <strong>{allTasks.length}</strong>
          <small>期限超過 0件</small>
        </div>
        <div className="metric">
          <span>決定事項</span>
          <strong>18</strong>
          <small>今月累計</small>
        </div>
        <div className="metric">
          <span>未決定事項</span>
          <strong>5</strong>
          <small>次回確認待ち</small>
        </div>
      </section>

      <div className="two-column">
        <section className="panel">
          <div className="section-heading">
            <h2>直近の会議</h2>
            <Link href="/meetings">すべて見る</Link>
          </div>
          <div className="stack">
            <GoogleMeetingCards limit={3} />
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>次のアクション</h2>
            <Link href="/tasks">タスク一覧</Link>
          </div>
          <CompletableTaskList tasks={urgentTasks} />
        </section>
      </div>

      <section className="panel calendar-panel">
        <div className="section-heading">
          <h2>会議カレンダー</h2>
          <a className="secondary-button compact-button" href="/api/google/auth">
            Google連携
          </a>
        </div>
        <p className="calendar-note">
          Googleカレンダーと同期した予定をこのカレンダーに表示します。
        </p>
        <GoogleCalendarBoard />
      </section>
    </AppShell>
  );
}
