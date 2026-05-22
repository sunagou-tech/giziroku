import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/googleCalendar";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const origin = request.nextUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/?calendar=error`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const response = NextResponse.redirect(`${origin}/?calendar=connected`);

    response.cookies.set("google_access_token", tokens.access_token, {
      httpOnly: true,
      maxAge: Math.max(tokens.expires_in - 60, 60),
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    if (tokens.refresh_token) {
      response.cookies.set("google_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  } catch {
    return NextResponse.redirect(`${origin}/?calendar=error`);
  }
}
