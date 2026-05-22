import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/app/components/AppShell";
import { CompletableTaskList } from "@/app/components/CompletableTaskList";
import { getMeeting } from "@/lib/data";

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meeting = getMeeting(id);

  if (!meeting) {
    notFound();
  }

  return (
    <AppShell>
      <header className="detail-header">
        <div>
          <Link className="back-link" href="/meetings">会議一覧へ戻る</Link>
          <h1>{meeting.title}</h1>
          <p>{meeting.date} {meeting.time} / {meeting.duration}</p>
        </div>
        <Link className="secondary-button" href="/tasks">関連タスクを見る</Link>
      </header>

      <section className="detail-grid">
        <div className="panel">
          <h2>基本情報</h2>
          <dl className="info-list">
            <div>
              <dt>参加者</dt>
              <dd>{meeting.participants.join("、")}</dd>
            </div>
            <div>
              <dt>会議の目的</dt>
              <dd>{meeting.purpose}</dd>
            </div>
          </dl>
        </div>
        <div className="panel">
          <h2>要約</h2>
          <p className="body-text">{meeting.summary}</p>
        </div>
      </section>

      <section className="panel">
        <h2>文字起こし</h2>
        <p className="transcript">{meeting.transcript}</p>
      </section>

      <section className="detail-grid">
        <div className="panel">
          <h2>決定事項</h2>
          <ul className="check-list">
            {meeting.decisions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h2>未決定事項</h2>
          <ul className="open-list">
            {meeting.openIssues.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>次のアクション</h2>
          <span>{meeting.actions.length}件</span>
        </div>
        <CompletableTaskList tasks={meeting.actions} />
      </section>
    </AppShell>
  );
}
