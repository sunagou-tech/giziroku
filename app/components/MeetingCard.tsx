import Link from "next/link";
import { Meeting } from "@/lib/data";
import { QuickRecordButton } from "@/app/components/QuickRecordButton";

export function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <article className="meeting-card">
      <div className="card-topline">
        <span>{meeting.date} {meeting.time}</span>
        <span>{meeting.duration}</span>
      </div>
      <Link href={`/meetings/${meeting.id}`} className="card-title">
        {meeting.title}
      </Link>
      <p>{meeting.summary}</p>
      <div className="tag-row">
        {meeting.tags.map((tag) => (
          <span className="tag" key={tag}>{tag}</span>
        ))}
        <span className={`calendar-badge ${meeting.calendarStatus === "連携済み" ? "synced" : ""}`}>
          Googleカレンダー{meeting.calendarStatus}
        </span>
      </div>
      <div className="card-footer">
        <span>{meeting.participants.length}名参加</span>
        <span>{meeting.actions.length}件のアクション</span>
      </div>
      <QuickRecordButton meetingTitle={meeting.title} />
      {meeting.calendarEventUrl && (
        <a
          className="calendar-link"
          href={meeting.calendarEventUrl}
          target="_blank"
          rel="noreferrer"
        >
          Google Calendarで開く
        </a>
      )}
    </article>
  );
}
