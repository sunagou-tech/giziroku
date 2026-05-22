"use client";

import { useEffect, useMemo, useState } from "react";
import { GoogleCalendarEvent } from "@/lib/googleCalendar";

const weekdayLabels = ["日", "月", "火", "水", "木", "金", "土"];

function startOfWeek(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  nextDate.setDate(nextDate.getDate() - nextDate.getDay());
  return nextDate;
}

function getEventStart(event: GoogleCalendarEvent) {
  const value = event.start.dateTime ?? event.start.date;
  return value ? new Date(value) : null;
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function formatTime(event: GoogleCalendarEvent) {
  if (event.start.date) {
    return "終日";
  }

  const start = getEventStart(event);

  if (!start) {
    return "日時未設定";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(start);
}

export function GoogleCalendarBoard() {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const weekDays = useMemo(() => {
    const base = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(base);
      date.setDate(base.getDate() + index);
      return date;
    });
  }, []);

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

  const eventsByDay = useMemo(() => {
    return events.reduce<Record<string, GoogleCalendarEvent[]>>((groupedEvents, event) => {
      const start = getEventStart(event);

      if (!start) {
        return groupedEvents;
      }

      const key = getDateKey(start);
      groupedEvents[key] = [...(groupedEvents[key] ?? []), event];
      return groupedEvents;
    }, {});
  }, [events]);

  if (isLoading) {
    return <p className="calendar-note">Googleカレンダーを確認しています。</p>;
  }

  if (errorMessage) {
    return <p className="recorder-error">{errorMessage}</p>;
  }

  if (!isConnected) {
    return (
      <div className="calendar-empty">
        <strong>Googleカレンダーと連携すると予定がここに表示されます</strong>
        <span>右上のGoogle連携ボタンから接続してください。</span>
      </div>
    );
  }

  return (
    <div className="app-calendar">
      {weekDays.map((day) => {
        const key = getDateKey(day);
        const dayEvents = eventsByDay[key] ?? [];

        return (
          <section className="calendar-day" key={key}>
            <div className="calendar-day-head">
              <span>{weekdayLabels[day.getDay()]}</span>
              <strong>{day.getDate()}</strong>
            </div>

            {dayEvents.length > 0 ? (
              <div className="calendar-event-stack">
                {dayEvents.map((event) => (
                  <a className="calendar-event" href={event.htmlLink} target="_blank" rel="noreferrer" key={event.id}>
                    <span>{formatTime(event)}</span>
                    <strong>{event.summary ?? "無題の予定"}</strong>
                  </a>
                ))}
              </div>
            ) : (
              <span className="calendar-no-event">予定なし</span>
            )}
          </section>
        );
      })}
    </div>
  );
}
