import { NextRequest } from "next/server";

const ONIT_API_KEY = process.env.ONIT_API_KEY;

if (!ONIT_API_KEY) {
  throw new Error("ONIT_API_KEY is not set");
}

// const ONIT_API_URL = 'https://preview-markets.onit-labs.workers.dev'
const ONIT_API_URL = 'http://localhost:8787' // 'https://preview-markets.onit-labs.workers.dev/api'

async function proxyRequest(request: NextRequest) {
  const url = request.nextUrl.clone();
  const onitApiUrl = new URL(ONIT_API_URL);

  url.protocol = onitApiUrl.protocol;
  url.port = onitApiUrl.port;
  url.host = onitApiUrl.host;
  url.pathname = url.pathname.replace("/proxy", "");

  const headers = {
    ...Object.fromEntries(request.headers.entries()),
    "accept-encoding": "gzip, deflate, br", // , zstd",
    "Accept-Encoding": "gzip, deflate, br", // , zstd", https://blog.cloudflare.com/new-standards/
    Authorization: "Bearer " + ONIT_API_KEY,
  } as Record<string, string>;

  const proxiedRequest = new Request(url.toString(), {
    method: request.method,
    headers,
    ...(request.method === "POST"
      ? { body: JSON.stringify(await request.json()) }
      : {}),
  });

  const response = await fetch(proxiedRequest).catch((e) => {
    console.log("[fetch] error", e);
    throw e;
  });

  return new Response(await response.text(), {
    headers: { "X-SuperJSON": "true" },
  });
}

export async function GET(request: NextRequest) {
  return proxyRequest(request);
}

export async function POST(request: NextRequest) {
  return proxyRequest(request);
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request);
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request);
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request);
}
