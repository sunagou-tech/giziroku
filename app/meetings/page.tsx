import Link from "next/link";
import { AppShell, PageHeader } from "@/app/components/AppShell";
import { MeetingCard } from "@/app/components/MeetingCard";
import { meetings } from "@/lib/data";

export default function MeetingsPage() {
  return (
    <AppShell>
      <PageHeader
        title="会議一覧"
        description="文字起こし済みの会議を、日時・参加者・アクション数から探せます。"
        action={<Link className="primary-button" href="/meetings/new">新規会議</Link>}
      />
      <section className="toolbar" aria-label="会議検索">
        <input aria-label="会議を検索" placeholder="会議名、参加者、タグで検索" />
        <select aria-label="期間">
          <option>今週</option>
          <option>今月</option>
          <option>すべて</option>
        </select>
      </section>
      <section className="meeting-grid">
        {meetings.map((meeting) => (
          <MeetingCard meeting={meeting} key={meeting.id} />
        ))}
      </section>
    </AppShell>
  );
}
