import { NextRequest, NextResponse } from "next/server";

const ONIT_API_KEY = process.env.ONIT_API_KEY;

if (!ONIT_API_KEY) {
  throw new Error("ONIT_API_KEY is not set");
}

/**
 * Middleware to proxy requests to the Onit API
 * and attach the API key to the request
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (/^\/api\/proxy/.test(path)) {
    const newResponse = NextResponse.next();
    newResponse.headers.set("Authorization", `Bearer ${ONIT_API_KEY}`);
    return newResponse;
  }
}

export const config = {
  matcher: "/api/proxy",
};
