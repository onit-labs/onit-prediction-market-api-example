import { NextRequest, NextResponse } from "next/server";

const ONIT_API_KEY = process.env.ONIT_API_KEY!;

if (!ONIT_API_KEY) {
  throw new Error("ONIT_API_KEY is not set");
}

const ONIT_API_URL = process.env.ONIT_API_URL!;

if (!ONIT_API_URL) {
  throw new Error("ONIT_API_URL is not set");
}

/**
 * Middleware to proxy requests to the Onit API
 * and attach the API key to the request
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // If the request is for the Onit API, attach the API key to the request and change the base URL
  if (/^\/api\/proxy/.test(path)) {
    // Change the base URL to the Onit API URL
    const url = ONIT_API_URL + path.replace("/api/proxy", "");
    return NextResponse.rewrite(url, {
      headers: {
        // Attach the API key to the request
        Authorization: `Bearer ${ONIT_API_KEY}`,
      },
    });
  }
}

export const config = {
  matcher: "/api/proxy/:path*",
};
