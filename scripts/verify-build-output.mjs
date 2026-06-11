import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
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
  for (const forbidden of [
    "Сейфулина",
    "Safina",
    "Sunny",
    "g.kezembayeva@gmail.com",
    "ПДВ",
    "предельно-допустимых выбросов",
    "ПДС",
    "связанные материалы"
  ]) {
    assert.doesNotMatch(html, new RegExp(forbidden, "i"), `${path} contains forbidden text ${forbidden}`);
  }
}

function luminance(hexColor) {
  const channels = hexColor
    .replace("#", "")
    .match(/../g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);

  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

const pages = [
  { path: "index.html", title: "Экологическая документация в Казахстане" },
  { path: "services/index.html", title: "Экологические услуги и цены" },
  { path: "kz/index.html", title: "Қазақстандағы экологиялық құжаттама" },
  { path: "kz/services/index.html", title: "Экологиялық қызметтер және бағалар" }
];

const cssFiles = readdirSync(join(dist, "_astro")).filter((file) => file.endsWith(".css"));
assert.ok(cssFiles.length > 0, "Missing generated CSS");

const css = cssFiles.map((file) => readFileSync(join(dist, "_astro", file), "utf8")).join("\n");
const primaryColor = css.match(/--color-primary:\s*(#[0-9a-f]{6})/i)?.[1];
assert.ok(primaryColor, "Missing --color-primary token");
assert.ok(
  contrastRatio(primaryColor, "#ffffff") >= 4.5,
  `Primary button color ${primaryColor} must pass AA contrast against white text`
);

for (const page of pages) {
  const html = readDist(page.path);
  assert.match(html, new RegExp(`<title>${page.title}`));
  assert.match(html, /<meta name="description" content="[^"]{50,}"/);
  assert.match(html, /\/fonts\/tbank\/TinkoffSans-Regular\.woff2/);
  assert.match(html, /\/fonts\/tbank\/TinkoffSans-Medium\.woff2/);
  assert.match(html, /\/fonts\/tbank\/TinkoffSans-Bold\.woff2/);
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

for (const expected of [
  "Разработка Проекта нормативов допустимых выбросов (НДВ)",
  "Разработка Проекта санитарно-защитной зоны (СЗЗ)",
  "Разработка Проекта оценки воздействия на окружающую среду (ОВОС)",
  "Разработка Отчета о возможных воздействиях (ОоВВ)",
  "Разработка Раздела охраны окружающей среды (РООС)",
  "Разработка проекта нормативов допустимых сбросов (НДС)"
]) {
  assert.match(servicesHtml, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

const servicesKzHtml = readDist("kz/services/index.html");
for (const expected of ["25 000 ₸ бастап", "100 000 ₸ бастап", "Құны сұраныс бойынша"]) {
  assert.match(servicesKzHtml, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

const sitemap = readDist("sitemap.xml");
const sitemapBlocks = sitemap.match(/<url>[\s\S]*?<\/url>/g) ?? [];
const sitemapExpectations = [
  { loc: "/", ru: "/", kk: "/kz/" },
  { loc: "/kz/", ru: "/", kk: "/kz/" },
  { loc: "/services/", ru: "/services/", kk: "/kz/services/" },
  { loc: "/kz/services/", ru: "/services/", kk: "/kz/services/" }
];

assert.equal(sitemapBlocks.length, sitemapExpectations.length);

for (const expected of sitemapExpectations) {
  const block = sitemapBlocks.find((entry) => entry.includes(`<loc>${publicOrigin}${expected.loc}</loc>`));

  assert.ok(block, `Missing sitemap URL entry: ${expected.loc}`);
  assert.match(block, new RegExp(`hreflang="ru" href="${publicOrigin}${expected.ru}"`));
  assert.match(block, new RegExp(`hreflang="kk" href="${publicOrigin}${expected.kk}"`));
}

const robots = readDist("robots.txt");
assert.match(robots, /User-agent: \*/);
assert.match(robots, /Allow: \//);
assert.match(robots, new RegExp(`Sitemap: ${publicOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\/sitemap\\.xml`));

const llms = readDist("llms.txt");
assert.match(llms, /Центр экологического мониторинга/);
assert.match(llms, /Экологиялық мониторинг орталығы/);
assert.match(llms, /НДВ/);
assert.match(llms, /НДС/);
assert.doesNotMatch(llms, /ПДВ/);
assert.doesNotMatch(llms, /ПДС/);
assert.match(llms, /77077924445/);
assert.match(llms, /Стоимость по запросу/);

const llm = readDist("llm.txt");
assert.equal(llm, llms);

console.log("verify:build PASS");
