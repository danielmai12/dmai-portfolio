import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  if (host === "blog.codewithdmai.com") {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/_next") || pathname.startsWith("/blog")) {
      return NextResponse.next();
    }

    // Rewrite root and all paths to /blog/*
    const url = request.nextUrl.clone();
    url.pathname = `/blog${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
