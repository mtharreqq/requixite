import { NextResponse, type NextRequest } from "next/server";

// Vercel tags each request with the visitor's country. Passing it on as a
// cookie keeps the pages static; the pricing reads it on the client.
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const country = request.headers.get("x-vercel-ip-country");
  if (country && /^[A-Z]{2}$/.test(country)) {
    response.cookies.set("country", country, { sameSite: "lax" });
  }
  return response;
}

export const config = { matcher: ["/", "/id"] };
