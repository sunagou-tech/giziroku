import { NextRequest, NextResponse } from "next/server";
import { GoogleCalendarEvent, refreshGoogleAccessToken } from "@/lib/googleCalendar";

async function getAccessToken(request: NextRequest) {
  const accessToken = request.cookies.get("google_access_token")?.value;
  const refreshToken = request.cookies.get("google_refresh_token")?.value;

  if (accessToken) {
    return { accessToken, refreshed: null };
  }

  if (!refreshToken) {
    return { accessToken: null, refreshed: null };
  }

  const refreshed = await refreshGoogleAccessToken(refreshToken);
  return { accessToken: refreshed.access_token, refreshed };
}

export async function GET(request: NextRequest) {
  try {
    const { accessToken, refreshed } = await getAccessToken(request);

    if (!accessToken) {
      return NextResponse.json({ connected: false, events: [] });
    }

    const rangeStart = new Date();
    rangeStart.setDate(rangeStart.getDate() - 7);
    rangeStart.setHours(0, 0, 0, 0);
    const rangeEnd = new Date();
    rangeEnd.setDate(rangeEnd.getDate() + 60);

    const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");
    url.searchParams.set("timeMin", rangeStart.toISOString());
    url.searchParams.set("timeMax", rangeEnd.toISOString());
    url.searchParams.set("maxResults", "50");

    const calendarResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!calendarResponse.ok) {
      return NextResponse.json(
        { connected: false, events: [], error: "Failed to load Google Calendar events." },
        { status: calendarResponse.status }
      );
    }

    const data = (await calendarResponse.json()) as { items?: GoogleCalendarEvent[] };
    const response = NextResponse.json({
      connected: true,
      events: data.items ?? [],
    });

    if (refreshed) {
      response.cookies.set("google_access_token", refreshed.access_token, {
        httpOnly: true,
        maxAge: Math.max(refreshed.expires_in - 60, 60),
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { connected: false, events: [], error: "Google Calendar sync failed." },
      { status: 500 }
    );
  }
}
