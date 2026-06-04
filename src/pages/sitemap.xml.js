import { getAlternateLinks, getRoute, getSiteUrl, pages } from "../utils/site.mjs";

export async function GET() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages.flatMap((page) => [
    { locale: "ru", page, loc: `${getSiteUrl()}${getRoute("ru", page)}` },
    { locale: "kz", page, loc: `${getSiteUrl()}${getRoute("kz", page)}` }
  ]);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map((entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${lastmod}</lastmod>
${getAlternateLinks(entry.page).map((alternate) => `    <xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${alternate.href}" />`).join("\n")}
  </url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
}
