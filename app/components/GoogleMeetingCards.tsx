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

export function GoogleMeetingCards() {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

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
      }
    }

    loadEvents();
  }, []);

  if (!isConnected || events.length === 0) {
    return null;
  }

  return (
    <>
      {events.slice(0, 3).map((event) => (
        <article className="meeting-card google-meeting-card" key={event.id}>
          <div className="card-topline">
            <span>{formatDate(event)} {formatTime(event)}</span>
            <span>Google予定</span>
          </div>
          <a href={event.htmlLink} target="_blank" rel="noreferrer" className="card-title">
            {event.summary ?? "無題の予定"}
          </a>
          <p>Googleカレンダーから同期された予定です。会議開始時にこのカードから録音できます。</p>
          <div className="tag-row">
            <span className="calendar-badge synced">Googleカレンダー連携済み</span>
          </div>
          <div className="card-footer">
            <span>同期予定</span>
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
