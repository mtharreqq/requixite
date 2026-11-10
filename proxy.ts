import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Language: on "/" from outside the site (typed, bookmark, another site),
  // the visitor's pick from the menu wins, else their browser's first
  // language. Moving around inside the site never switches it. Crawlers send
  // no Accept-Language, so both versions stay indexed.
  if (
    request.nextUrl.pathname === "/" &&
    request.headers.get("sec-fetch-site") !== "same-origin"
  ) {
    const lang =
      request.cookies.get("lang")?.value ??
      request.headers.get("accept-language")?.trim().slice(0, 2).toLowerCase();
    if (lang === "id")
      return NextResponse.redirect(new URL("/id", request.url), 307);
  }

  // Vercel tags each request with the visitor's country. Passing it on as a
  // cookie keeps the pages static; the pricing reads it on the client.
  const response = NextResponse.next();
  const country = request.headers.get("x-vercel-ip-country");
  if (country && /^[A-Z]{2}$/.test(country)) {
    response.cookies.set("country", country, { sameSite: "lax" });
  }
  return response;
}

export const config = { matcher: ["/", "/id"] };
