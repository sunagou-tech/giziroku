import Link from "next/link";
import { AppShell, PageHeader } from "@/app/components/AppShell";
import { CompletableTaskList } from "@/app/components/CompletableTaskList";
import { GoogleCalendarSync } from "@/app/components/GoogleCalendarSync";
import { MeetingCard } from "@/app/components/MeetingCard";
import { allTasks, meetings } from "@/lib/data";

const googleCalendarEmbedUrl =
  "https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Asia%2FTokyo&showPrint=0&showCalendars=0&showTz=0&mode=WEEK&src=amEuamFwYW5lc2UjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%230B8043";

export default function DashboardPage() {
  const nextMeetings = meetings.slice(0, 2);
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
            {nextMeetings.map((meeting) => (
              <MeetingCard meeting={meeting} key={meeting.id} />
            ))}
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

      <GoogleCalendarSync />

      <section className="panel calendar-panel">
        <div className="section-heading">
          <h2>会議カレンダー</h2>
          <Link href="/meetings/new">会議を登録</Link>
        </div>
        <p className="calendar-note">
          直近の会議カードには、Googleカレンダーとの連携状態を表示しています。
        </p>
        <div className="calendar-frame">
          <iframe
            title="Google カレンダー"
            src={googleCalendarEmbedUrl}
            loading="lazy"
          />
        </div>
      </section>
    </AppShell>
  );
}
