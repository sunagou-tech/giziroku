import { NextResponse } from "next/server";
import { getGoogleOAuthUrl } from "@/lib/googleCalendar";

export async function GET() {
  const oauthUrl = getGoogleOAuthUrl();

  if (!oauthUrl) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID is not configured." },
      { status: 500 }
    );
  }

  return NextResponse.redirect(oauthUrl);
}
