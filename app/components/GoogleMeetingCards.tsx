"use client";

import { useEffect, useState } from "react";
import { GoogleCalendarEvent } from "@/lib/googleCalendar";
import { QuickRecordButton } from "@/app/components/QuickRecordButton";

function getEventStart(event: GoogleCalendarEvent) {
  const value = event.start.dateTime ?? event.start.date;
  return value ? new Date(value) : null;
}

function formatDate(event: GoogleCalendarEvent) {
  const start = getEventStart(event);

  if (!start) {
    return "日時未設定";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(start);
}

function formatTime(event: GoogleCalendarEvent) {
  if (event.start.date) {
    return "終日";
  }

  const start = getEventStart(event);

  if (!start) {
    return "";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(start);
}

export function GoogleMeetingCards({ limit = 3 }: { limit?: number }) {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch("/api/google/events", { cache: "no-store" });
        const data = (await response.json()) as {
          connected: boolean;
          events: GoogleCalendarEvent[];
        };

        setIsConnected(data.connected);
        setEvents(data.events ?? []);
      } catch {
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (isLoading) {
    return (
      <article className="meeting-card meeting-sync-state">
        <strong>Googleカレンダーを同期しています</strong>
      </article>
    );
  }

  if (!isConnected) {
    return (
      <article className="meeting-card meeting-sync-state">
        <strong>Googleカレンダーと連携してください</strong>
        <p>連携すると、Googleカレンダーの予定がここに表示されます。</p>
        <a className="primary-button" href="/api/google/auth">Google連携</a>
      </article>
    );
  }

  if (events.length === 0) {
    return (
      <article className="meeting-card meeting-sync-state">
        <strong>表示できる予定がありません</strong>
        <p>Googleカレンダーに予定を追加すると自動で表示されます。</p>
      </article>
    );
  }

  return (
    <>
      {events.slice(0, limit).map((event) => (
        <article className="meeting-card google-meeting-card" key={event.id}>
          <div className="card-topline">
            <span>{formatDate(event)} {formatTime(event)}</span>
            <span>Google予定</span>
          </div>
          <a href={event.htmlLink} target="_blank" rel="noreferrer" className="card-title">
            {event.summary ?? "無題の予定"}
          </a>
          <p>{event.description ?? event.location ?? "Googleカレンダーから同期された予定です。会議開始時にこのカードから録音できます。"}</p>
          <div className="tag-row">
            <span className="calendar-badge synced">Googleカレンダー連携済み</span>
          </div>
          <div className="card-footer">
            <span>{event.attendees?.length ? `${event.attendees.length}名参加` : "同期予定"}</span>
            <span>アクション未作成</span>
          </div>
          <QuickRecordButton meetingTitle={event.summary ?? "Googleカレンダー予定"} />
          <a className="calendar-link" href={event.htmlLink} target="_blank" rel="noreferrer">
            Google Calendarで開く
          </a>
        </article>
      ))}
    </>
  );
}
