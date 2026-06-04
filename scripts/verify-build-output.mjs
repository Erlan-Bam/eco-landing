import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const publicOrigin = (process.env.PUBLIC_SITE_URL || "http://localhost:4321").replace(/\/+$/, "");

function readDist(path) {
  const filePath = join(dist, path);
  assert.ok(existsSync(filePath), `Missing dist file: ${path}`);
  return readFileSync(filePath, "utf8");
}

function expectNoForbiddenText(path, html) {
  for (const forbidden of ["Сейфулина", "Safina", "Sunny", "g.kezembayeva@gmail.com"]) {
    assert.doesNotMatch(html, new RegExp(forbidden, "i"), `${path} contains forbidden text ${forbidden}`);
  }
}

const pages = [
  { path: "index.html", title: "Экологическая документация в Казахстане" },
  { path: "services/index.html", title: "Экологические услуги и цены" },
  { path: "kz/index.html", title: "Қазақстандағы экологиялық құжаттама" },
  { path: "kz/services/index.html", title: "Экологиялық қызметтер және бағалар" }
];

for (const page of pages) {
  const html = readDist(page.path);
  assert.match(html, new RegExp(`<title>${page.title}`));
  assert.match(html, /<meta name="description" content="[^"]{50,}"/);
  assert.match(html, /77077924445/);
  assert.match(html, /Жарокова|Жароков/);
  expectNoForbiddenText(page.path, html);

  if (process.env.PUBLIC_SITE_URL) {
    assert.match(html, /rel="canonical"/);
    assert.match(html, /hreflang="ru"/);
    assert.match(html, /hreflang="kk"/);
    assert.match(html, /property="og:url"/);
    assert.match(html, new RegExp(publicOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  } else {
    assert.doesNotMatch(html, /localhost:4321/);
    assert.doesNotMatch(html, /rel="canonical"/);
    assert.doesNotMatch(html, /hreflang=/);
    assert.doesNotMatch(html, /property="og:url"/);
  }
}

const servicesHtml = readDist("services/index.html");
for (const expected of ["от 25 000 ₸", "от 30 000 ₸", "от 40 000 ₸", "от 45 000 ₸", "от 80 000 ₸", "от 100 000 ₸", "Стоимость по запросу"]) {
  assert.match(servicesHtml, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

const servicesKzHtml = readDist("kz/services/index.html");
for (const expected of ["25 000 ₸ бастап", "100 000 ₸ бастап", "Құны сұраныс бойынша"]) {
  assert.match(servicesKzHtml, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

const sitemap = readDist("sitemap.xml");
for (const loc of ["/", "/services/", "/kz/", "/kz/services/"]) {
  assert.match(sitemap, new RegExp(`<loc>${publicOrigin}${loc}</loc>`));
}
assert.match(sitemap, /hreflang="ru"/);
assert.match(sitemap, /hreflang="kk"/);

const robots = readDist("robots.txt");
assert.match(robots, /User-agent: \*/);
assert.match(robots, /Allow: \//);
assert.match(robots, new RegExp(`Sitemap: ${publicOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\/sitemap\\.xml`));

const llms = readDist("llms.txt");
assert.match(llms, /Центр экологического мониторинга/);
assert.match(llms, /Экологиялық мониторинг орталығы/);
assert.match(llms, /ПДВ/);
assert.match(llms, /77077924445/);
assert.match(llms, /Стоимость по запросу/);

const llm = readDist("llm.txt");
assert.equal(llm, llms);

console.log("verify:build PASS");
