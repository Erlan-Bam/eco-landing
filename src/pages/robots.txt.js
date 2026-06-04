import { getSiteUrl } from "../utils/site.mjs";

export async function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: ${getSiteUrl()}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
