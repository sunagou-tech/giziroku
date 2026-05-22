"use client";

import { useEffect, useState } from "react";
import { GoogleCalendarEvent } from "@/lib/googleCalendar";

function formatEventTime(event: GoogleCalendarEvent) {
  const value = event.start.dateTime ?? event.start.date;

  if (!value) {
    return "日時未設定";
  }

  if (event.start.date) {
    return value;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function GoogleCalendarSync() {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch("/api/google/events", { cache: "no-store" });
        const data = (await response.json()) as {
          connected: boolean;
          events: GoogleCalendarEvent[];
          error?: string;
        };

        setIsConnected(data.connected);
        setEvents(data.events ?? []);
        setErrorMessage(data.error ?? "");
      } catch {
        setErrorMessage("Googleカレンダーの予定を取得できませんでした。");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <section className="panel google-sync-panel">
      <div className="section-heading">
        <h2>Googleカレンダー同期</h2>
        <a className="secondary-button compact-button" href="/api/google/auth">
          {isConnected ? "再連携" : "Google連携"}
        </a>
      </div>

      {isLoading ? (
        <p className="calendar-note">Googleカレンダーを確認しています。</p>
      ) : errorMessage ? (
        <p className="recorder-error">{errorMessage}</p>
      ) : !isConnected ? (
        <p className="calendar-note">
          Google連携を押すと、今後30日間の予定をこの画面に同期できます。
        </p>
      ) : events.length > 0 ? (
        <div className="google-event-list">
          {events.map((event) => (
            <a href={event.htmlLink} target="_blank" rel="noreferrer" className="google-event-row" key={event.id}>
              <span>{formatEventTime(event)}</span>
              <strong>{event.summary ?? "無題の予定"}</strong>
            </a>
          ))}
        </div>
      ) : (
        <p className="calendar-note">今後30日間の予定はありません。</p>
      )}
    </section>
  );
}
