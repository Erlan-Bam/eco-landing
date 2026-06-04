# Eco Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved bilingual RU/KZ Astro landing site and services catalog for TОО "Центр экологического мониторинга".

**Architecture:** Keep the site mostly static with Astro pages and centralized `.mjs` data files for company facts, services, content, and SEO. Use reusable Astro layout/components, CSS-only disclosure interactions for mobile nav and FAQ, and generated crawler endpoints for sitemap, robots, and AI-readable files.

**Tech Stack:** Astro 6, plain Astro components, JavaScript `.mjs` data modules, CSS, Node verification scripts, T-Bank/TinkoffSans local font files.

---

## Scope Check

The approved spec is one cohesive website: a main landing page, a services catalog, bilingual routing, SEO metadata, and crawler files. This does not need to be split into separate implementation plans because each task below produces a working slice of the same static Astro site.

## Current Repo Notes

- Work from `/Users/yayzo/Documents/Spark/eco-landing`.
- The repository has a first commit containing `docs/superpowers/specs/2026-06-05-eco-landing-design.md`.
- The Astro starter files are currently untracked. Do not reset or delete them.
- Font files already exist in `public/fonts/tbank`.

## File Structure

Create or modify these files:

- `package.json` - add verification scripts.
- `src/data/company.mjs` - current TОО identity, contact facts, source links, pricing helpers.
- `src/data/services.mjs` - all services from the DOCX plus approved Satu-priced supporting items.
- `src/data/content.mjs` - RU/KZ page copy, navigation labels, FAQ, landing sections.
- `src/utils/site.mjs` - route, canonical, alternate, price, and JSON-LD helpers.
- `src/styles/global.css` - full visual system, T-Bank fonts, responsive layout, accessibility states.
- `src/layouts/BaseLayout.astro` - shared HTML shell, SEO tags, hreflang, OpenGraph, JSON-LD.
- `src/components/Header.astro` - wordmark, desktop nav, language switch, WhatsApp CTA, CSS-only mobile menu.
- `src/components/Footer.astro` - contact summary, schedule, legal address, crawler links.
- `src/components/LandingPage.astro` - all landing sections for RU/KZ.
- `src/components/ServicesPage.astro` - full services catalog for RU/KZ.
- `src/pages/index.astro` - RU landing route.
- `src/pages/services.astro` - RU services route.
- `src/pages/kz/index.astro` - KZ landing route.
- `src/pages/kz/services.astro` - KZ services route.
- `src/pages/sitemap.xml.js` - generated sitemap.
- `src/pages/robots.txt.js` - generated robots file.
- `src/pages/llms.txt.js` - generated AI-readable site summary.
- `src/pages/llm.txt.js` - compatibility mirror of `llms.txt`.
- `scripts/verify-data.mjs` - data and source-priority assertions.
- `scripts/verify-site-helpers.mjs` - route/SEO helper assertions.
- `scripts/verify-build-output.mjs` - post-build HTML/crawler assertions.

## Task 1: Data Sources And Data Tests

**Files:**
- Create: `scripts/verify-data.mjs`
- Create: `src/data/company.mjs`
- Create: `src/data/services.mjs`
- Create: `src/data/content.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add package verification scripts**

Replace `package.json` with:

```json
{
  "name": "eco-landing",
  "type": "module",
  "version": "0.0.1",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "verify:data": "node scripts/verify-data.mjs",
    "verify:helpers": "node scripts/verify-site-helpers.mjs",
    "verify:build": "node scripts/verify-build-output.mjs",
    "verify": "npm run verify:data && npm run verify:helpers && npm run build && npm run verify:build"
  },
  "dependencies": {
    "@astrojs/react": "^5.0.7",
    "@types/react": "^19.2.16",
    "@types/react-dom": "^19.2.3",
    "astro": "^6.4.4",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  }
}
```

- [ ] **Step 2: Write the failing data verification script**

Create `scripts/verify-data.mjs`:

```js
import assert from "node:assert/strict";
import { company } from "../src/data/company.mjs";
import { services, serviceCategories, featuredServiceIds } from "../src/data/services.mjs";
import { content } from "../src/data/content.mjs";

const serviceIds = new Set(services.map((service) => service.id));

assert.equal(company.bin, "250140022679");
assert.equal(company.primaryPhone.display, "+7 (707) 792-44-45");
assert.equal(company.primaryPhone.whatsapp, "https://wa.me/77077924445");
assert.equal(company.emailPublic, false);
assert.match(company.address.ru, /Жарокова/);
assert.doesNotMatch(company.address.ru, /Сейфулина/);

for (const forbidden of ["Sunny", "Safina", "Сейфулина", "g.kezembayeva@gmail.com"]) {
  assert.doesNotMatch(JSON.stringify({ company, services, content }), new RegExp(forbidden, "i"));
}

for (const requiredId of [
  "pdv",
  "puo",
  "szz",
  "ovos",
  "oovv",
  "vzip",
  "roos",
  "un",
  "rsv",
  "pec-report",
  "waste-inventory-report",
  "2tp-air",
  "2tp-water",
  "environmental-plan-report",
  "pollutant-register-report",
  "4os-report"
]) {
  assert.ok(serviceIds.has(requiredId), `Missing required DOCX service: ${requiredId}`);
}

assert.equal(services.find((service) => service.id === "puo").price.amount, 30000);
assert.equal(services.find((service) => service.id === "ppm").price.amount, 25000);
assert.equal(services.find((service) => service.id === "szz").price.type, "request");
assert.equal(services.find((service) => service.id === "roos").price.type, "request");
assert.equal(featuredServiceIds.length, 6);
assert.equal(serviceCategories.length, 5);

for (const service of services) {
  assert.ok(service.title.ru.length > 5, `Missing RU title for ${service.id}`);
  assert.ok(service.title.kz.length > 5, `Missing KZ title for ${service.id}`);
  assert.ok(service.summary.ru.length > 20, `Missing RU summary for ${service.id}`);
  assert.ok(service.summary.kz.length > 20, `Missing KZ summary for ${service.id}`);
  assert.ok(serviceCategories.some((category) => category.id === service.categoryId), `Unknown category for ${service.id}`);
}

for (const locale of ["ru", "kz"]) {
  assert.ok(content[locale].home.hero.title.length > 20);
  assert.equal(content[locale].home.directions.length, 5);
  assert.equal(content[locale].home.process.length, 5);
  assert.ok(content[locale].faq.length >= 6);
}

console.log("verify:data PASS");
```

- [ ] **Step 3: Run the data script to verify it fails**

Run:

```bash
npm run verify:data
```

Expected: FAIL with a module-not-found error for `src/data/company.mjs`.

- [ ] **Step 4: Create company data**

Create `src/data/company.mjs`:

```js
export const company = {
  brand: {
    ru: "Центр экологического мониторинга",
    kz: "Экологиялық мониторинг орталығы"
  },
  legalName: {
    ru: 'ТОО "Центр экологического мониторинга"',
    kz: '«Центр экологического мониторинга» ЖШС'
  },
  bin: "250140022679",
  registeredYear: 2025,
  expertExperienceSince: 2010,
  emailPublic: false,
  primaryPhone: {
    display: "+7 (707) 792-44-45",
    tel: "+77077924445",
    whatsapp: "https://wa.me/77077924445"
  },
  address: {
    ru: "г. Алматы, Бостандыкский район, ул. Жарокова, дом 219, кв. 19",
    kz: "Алматы қ., Бостандық ауданы, Жароков көшесі, 219-үй, 19-пәтер"
  },
  location: {
    ru: "Алматы",
    kz: "Алматы"
  },
  geography: {
    ru: "Работаем по всему Казахстану",
    kz: "Қазақстан бойынша жұмыс істейміз"
  },
  schedule: {
    ru: "Пн-Пт 10:00-18:00, Сб-Вс выходной",
    kz: "Дс-Жм 10:00-18:00, Сб-Жс демалыс"
  },
  scheduleStructured: {
    opens: "10:00",
    closes: "18:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  legacyExperienceClients: [
    "АО «Гелиос»",
    "ТОО «Шин-Лайн»",
    "ТД «Форум»"
  ],
  objectTypes: {
    ru: ["АЗС и нефтепродукты", "торговые центры", "СТО", "строительные объекты", "лаборатории", "офисы"],
    kz: ["жанармай құю станциялары және мұнай өнімдері", "сауда орталықтары", "техникалық қызмет көрсету станциялары", "құрылыс нысандары", "зертханалар", "кеңселер"]
  },
  sources: {
    prg: "https://ba.prg.kz/750000000-almaty/250140022679-too-tsentr-ekologicheskogo-monitoringa/",
    satu: "https://kezembaeva.satu.kz/",
    designSpec: "/docs/superpowers/specs/2026-06-05-eco-landing-design.md"
  }
};
```

- [ ] **Step 5: Create services data**

Create `src/data/services.mjs`:

```js
export const serviceCategories = [
  { id: "projects", title: { ru: "Проектная документация", kz: "Жобалық құжаттама" } },
  { id: "waste", title: { ru: "Отходы", kz: "Қалдықтар" } },
  { id: "water", title: { ru: "Водопользование", kz: "Су пайдалану" } },
  { id: "reports", title: { ru: "Отчетность и контроль", kz: "Есептілік және бақылау" } },
  { id: "support", title: { ru: "Сопровождение", kz: "Сүйемелдеу" } }
];

const from = (amount, source) => ({ type: "from", amount, currency: "KZT", source });
const request = () => ({ type: "request" });

export const services = [
  {
    id: "pdv",
    categoryId: "projects",
    source: "docx+satu",
    title: { ru: "Разработка проекта предельно-допустимых выбросов (ПДВ)", kz: "Шекті жол берілетін шығарындылар жобасын әзірлеу (ПДВ)" },
    summary: { ru: "Подготовка проекта по выбросам для предприятий и объектов с источниками воздействия на атмосферный воздух.", kz: "Атмосфералық ауаға әсер ету көздері бар кәсіпорындар мен нысандар үшін шығарындылар жобасын дайындау." },
    price: from(100000, "Satu: Проекты НДВ / экологические проекты")
  },
  {
    id: "puo",
    categoryId: "waste",
    source: "docx+satu",
    title: { ru: "Разработка программы управления отходами (ПУО)", kz: "Қалдықтарды басқару бағдарламасын әзірлеу (ПУО)" },
    summary: { ru: "Документ для системного учета, управления и снижения воздействия отходов предприятия.", kz: "Кәсіпорын қалдықтарын есепке алу, басқару және олардың әсерін азайтуға арналған құжат." },
    price: from(30000, "Satu: Программа управления отходами")
  },
  {
    id: "szz",
    categoryId: "projects",
    source: "docx",
    title: { ru: "Разработка проекта санитарно-защитных зон (СЗЗ)", kz: "Санитариялық-қорғау аймақтары жобасын әзірлеу (СҚА)" },
    summary: { ru: "Расчет и оформление санитарно-защитной зоны с учетом характеристик объекта и требований законодательства.", kz: "Нысан сипаттамалары мен заң талаптарын ескере отырып санитариялық-қорғау аймағын есептеу және рәсімдеу." },
    price: request()
  },
  {
    id: "ovos",
    categoryId: "projects",
    source: "docx+satu",
    title: { ru: "Разработка оценки воздействия на окружающую среду (ОВОС)", kz: "Қоршаған ортаға әсерді бағалауды әзірлеу (ОВОС)" },
    summary: { ru: "Оценка экологических факторов проекта и подготовка материалов для принятия проектных решений.", kz: "Жоба бойынша экологиялық факторларды бағалау және жобалық шешімдерге арналған материалдарды дайындау." },
    price: from(100000, "Satu: экологические проекты")
  },
  {
    id: "oovv",
    categoryId: "projects",
    source: "docx",
    title: { ru: "Разработка проекта оценки о возможном воздействии (ООВВ)", kz: "Ықтимал әсер туралы бағалау жобасын әзірлеу (ООВВ)" },
    summary: { ru: "Подготовка материалов по возможному воздействию планируемой деятельности на окружающую среду.", kz: "Жоспарланған қызметтің қоршаған ортаға ықтимал әсері бойынша материалдарды дайындау." },
    price: request()
  },
  {
    id: "vzip",
    categoryId: "water",
    source: "docx",
    title: { ru: "Разработка проекта водоохранных зон и полос (ВЗиП)", kz: "Су қорғау аймақтары мен белдеулері жобасын әзірлеу" },
    summary: { ru: "Определение и оформление водоохранных зон и полос для объектов, связанных с водными ресурсами.", kz: "Су ресурстарымен байланысты нысандар үшін су қорғау аймақтары мен белдеулерін анықтау және рәсімдеу." },
    price: request()
  },
  {
    id: "roos",
    categoryId: "projects",
    source: "docx",
    title: { ru: "Разработка разделов охраны окружающей среды (РООС)", kz: "Қоршаған ортаны қорғау бөлімдерін әзірлеу (РООС)" },
    summary: { ru: "Экологические разделы для предплановой, предпроектной и проектной документации.", kz: "Жоспарлау алдындағы, жобалау алдындағы және жобалық құжаттамаға арналған экологиялық бөлімдер." },
    price: request()
  },
  {
    id: "un",
    categoryId: "water",
    source: "docx",
    title: { ru: "Согласование удельных норм водопотребления и водоотведения (УН)", kz: "Су тұтыну және су бұрудың үлестік нормаларын келісу" },
    summary: { ru: "Подготовка и сопровождение материалов по удельным нормам водопотребления и водоотведения.", kz: "Су тұтыну және су бұрудың үлестік нормалары бойынша материалдарды дайындау және сүйемелдеу." },
    price: request()
  },
  {
    id: "rsv",
    categoryId: "water",
    source: "docx",
    title: { ru: "Разрешение на специальное водопользование (РСВ)", kz: "Арнайы су пайдалану рұқсатын рәсімдеу" },
    summary: { ru: "Сопровождение получения разрешения для деятельности, связанной со специальным водопользованием.", kz: "Арнайы су пайдаланумен байланысты қызметке рұқсат алу процесін сүйемелдеу." },
    price: request()
  },
  {
    id: "pec-report",
    categoryId: "reports",
    source: "docx+satu",
    title: { ru: "Отчет по результатам производственного экологического контроля", kz: "Өндірістік экологиялық бақылау нәтижелері бойынша есеп" },
    summary: { ru: "Подготовка отчета по результатам контроля воздействия предприятия на окружающую среду.", kz: "Кәсіпорынның қоршаған ортаға әсерін бақылау нәтижелері бойынша есеп дайындау." },
    price: from(45000, "Satu: ППЭК")
  },
  {
    id: "waste-inventory-report",
    categoryId: "reports",
    source: "docx",
    title: { ru: "Отчет по инвентаризации отходов", kz: "Қалдықтарды түгендеу бойынша есеп" },
    summary: { ru: "Систематизация сведений об отходах предприятия и подготовка отчетных материалов.", kz: "Кәсіпорын қалдықтары туралы мәліметтерді жүйелеу және есептік материалдарды дайындау." },
    price: request()
  },
  {
    id: "2tp-air",
    categoryId: "reports",
    source: "docx+satu",
    title: { ru: "Отчет 2-ТП (воздух)", kz: "2-ТП есебі (ауа)" },
    summary: { ru: "Отчетность по выбросам в атмосферный воздух для организаций с соответствующими источниками воздействия.", kz: "Атмосфералық ауаға шығарындылары бар ұйымдарға арналған есептілік." },
    price: from(100000, "Satu: экологические проекты, 2ТП-воз")
  },
  {
    id: "2tp-water",
    categoryId: "reports",
    source: "docx",
    title: { ru: "Отчет 2-ТП (водхоз)", kz: "2-ТП есебі (су шаруашылығы)" },
    summary: { ru: "Отчетность по водному хозяйству и водопользованию для объектов с соответствующими обязанностями.", kz: "Су шаруашылығы және су пайдалану бойынша міндеттері бар нысандарға арналған есептілік." },
    price: request()
  },
  {
    id: "environmental-plan-report",
    categoryId: "reports",
    source: "docx",
    title: { ru: "Отчет о выполнении плана мероприятий по охране окружающей среды", kz: "Қоршаған ортаны қорғау іс-шаралары жоспарының орындалуы туралы есеп" },
    summary: { ru: "Подготовка отчетности о выполнении природоохранных мероприятий предприятия.", kz: "Кәсіпорынның табиғатты қорғау іс-шараларының орындалуы туралы есепті дайындау." },
    price: request()
  },
  {
    id: "pollutant-register-report",
    categoryId: "reports",
    source: "docx",
    title: { ru: "Отчёт в Регистр выбросов и переноса загрязнителей", kz: "Ластағыштардың шығарындылары мен тасымалдары тіркеліміне есеп" },
    summary: { ru: "Подготовка сведений для регистра выбросов и переноса загрязнителей.", kz: "Ластағыштардың шығарындылары мен тасымалдары тіркеліміне мәліметтер дайындау." },
    price: request()
  },
  {
    id: "4os-report",
    categoryId: "reports",
    source: "docx",
    title: { ru: "Отчет 4-ОС", kz: "4-ОС есебі" },
    summary: { ru: "Подготовка формы 4-ОС и связанных отчетных материалов.", kz: "4-ОС нысанын және байланысты есептік материалдарды дайындау." },
    price: request()
  },
  {
    id: "pds-nds",
    categoryId: "water",
    source: "satu-supporting",
    title: { ru: "ПДС / НДС", kz: "ПДС / НДС" },
    summary: { ru: "Расчеты и документация по нормативам допустимых сбросов для объектов водопользования.", kz: "Су пайдалану нысандары үшін жол берілетін төгінділер нормативтері бойынша есептер мен құжаттама." },
    price: from(80000, "Satu: ПДС / НДС")
  },
  {
    id: "hazardous-waste-passport",
    categoryId: "waste",
    source: "satu-supporting",
    title: { ru: "Паспорт опасных отходов", kz: "Қауіпті қалдықтар паспорты" },
    summary: { ru: "Оформление паспорта опасных отходов с учетом состава, класса и характеристик отходов.", kz: "Қалдықтардың құрамы, класы және сипаттамалары ескерілген қауіпті қалдықтар паспортын рәсімдеу." },
    price: from(40000, "Satu: Паспорт опасных отходов")
  },
  {
    id: "ppm",
    categoryId: "support",
    source: "satu-supporting",
    title: { ru: "Программа природоохранных мероприятий (ППМ)", kz: "Табиғатты қорғау іс-шаралары бағдарламасы (ППМ)" },
    summary: { ru: "Планирование природоохранных мероприятий и связанных обязательств предприятия.", kz: "Кәсіпорынның табиғатты қорғау іс-шаралары мен байланысты міндеттемелерін жоспарлау." },
    price: from(25000, "Satu: ППМ")
  }
];

export const featuredServiceIds = ["ppm", "puo", "hazardous-waste-passport", "pec-report", "pds-nds", "pdv"];

export const featuredServices = featuredServiceIds.map((id) => services.find((service) => service.id === id));
```

- [ ] **Step 6: Create page content data**

Create `src/data/content.mjs`:

```js
export const content = {
  ru: {
    nav: {
      services: "Услуги",
      prices: "Цены",
      process: "Как работаем",
      about: "О компании",
      faq: "FAQ",
      contacts: "Контакты",
      whatsapp: "WhatsApp"
    },
    seo: {
      homeTitle: "Экологическая документация в Казахстане | Центр экологического мониторинга",
      homeDescription: "Разработка экологических проектов, отчетности и разрешений для бизнеса по Казахстану. ТОО в Алматы, опыт с 2010 года, консультация в WhatsApp.",
      servicesTitle: "Экологические услуги и цены | ПДВ, ПУО, ОВОС, отчеты",
      servicesDescription: "Каталог экологических услуг: ПДВ, ПУО, СЗЗ, ОВОС, ООВВ, РООС, РСВ, отчеты 2-ТП и 4-ОС. Цены от 25 000 ₸ и стоимость по запросу."
    },
    home: {
      hero: {
        eyebrow: "ТОО в Алматы · работа по Казахстану",
        title: "Экологическая документация и сопровождение для бизнеса по Казахстану",
        lead: "Готовим экологические проекты, отчетность, разрешения и консультационное сопровождение для юридических лиц понятным языком и с вниманием к требованиям законодательства.",
        primaryCta: "Написать в WhatsApp",
        secondaryCta: "Смотреть услуги"
      },
      trustChips: ["БИН 250140022679", "Алматы", "По всему Казахстану", "Опыт с 2010 года", "Пн-Пт 10:00-18:00"],
      directionsTitle: "Закрываем ключевые экологические задачи бизнеса",
      directions: [
        { title: "Проектная документация", text: "ПДВ/НДВ, СЗЗ, ОВОС, ООВВ и РООС для объектов разных типов." },
        { title: "Отходы", text: "ПУО, инвентаризация отходов, паспорт опасных отходов и связанные материалы." },
        { title: "Водопользование", text: "ВЗиП, ПДС/НДС, удельные нормы и разрешение на специальное водопользование." },
        { title: "Отчетность", text: "2-ТП, 4-ОС, производственный экологический контроль и отчеты по планам мероприятий." },
        { title: "Сопровождение", text: "Помогаем разобраться, какие документы нужны объекту и какие исходные данные подготовить." }
      ],
      pricesTitle: "Популярные услуги и цены",
      pricesLead: "Для части услуг указана стартовая цена по старому каталогу Satu. Если объем работ зависит от объекта, показываем стоимость по запросу.",
      allServicesCta: "Открыть полный каталог",
      processTitle: "Как работаем",
      process: [
        "Заявка в WhatsApp или звонок",
        "Первичная консультация и уточнение задачи",
        "Анализ объекта и исходных данных",
        "Подготовка экологической документации",
        "Передача результата и сопровождение"
      ],
      aboutTitle: "Опыт в экологическом проектировании с 2010 года",
      aboutText: "ТОО «Центр экологического мониторинга» зарегистрировано в 2025 году, а экспертная практика команды и руководителя в природоохранном проектировании и нормировании ведется с 2010 года.",
      aboutProof: "В портфеле опыта — проекты для АО «Гелиос», ТОО «Шин-Лайн», ТД «Форум», лабораторий, торговых центров, СТО, офисных и строительных объектов.",
      contactTitle: "Получить консультацию",
      contactLead: "Напишите в WhatsApp или позвоните, чтобы понять, какие документы нужны вашему объекту и какая стоимость подойдет под ваш объем работ."
    },
    servicesPage: {
      eyebrow: "Каталог услуг",
      title: "Экологические услуги и цены",
      lead: "Полный перечень услуг сформирован по документу заказчика. Цены указаны там, где они подтверждены старым каталогом Satu; остальные позиции рассчитываются после первичной консультации.",
      requestPrice: "Стоимость по запросу",
      fromPrefix: "от",
      cta: "Обсудить услугу"
    },
    faq: [
      { q: "Как понять, какой документ нужен нашему объекту?", a: "Напишите в WhatsApp и кратко опишите деятельность, объект и текущую задачу. После первичной консультации станет понятно, нужен ли проект, отчет, разрешение или несколько документов." },
      { q: "От чего зависит стоимость?", a: "На цену влияет тип объекта, категория, количество источников воздействия, наличие исходных данных, срочность и объем согласований." },
      { q: "Работаете ли вы вне Алматы?", a: "Да, услуги оказываются по всему Казахстану. Алматы указан как офисная и юридическая привязка компании." },
      { q: "Какие исходные данные нужны?", a: "Обычно нужны сведения об объекте, деятельности, источниках выбросов или сбросов, отходах, водопользовании и имеющихся разрешительных документах." },
      { q: "Сколько занимает подготовка?", a: "Срок зависит от документа и полноты исходных данных. После консультации можно оценить реалистичный срок под конкретную задачу." },
      { q: "Можно ли сначала получить консультацию?", a: "Да, первичная консультация через WhatsApp помогает определить объем работ и нужный набор документов." },
      { q: "Почему у части услуг цена по запросу?", a: "Для таких услуг стоимость сильно зависит от объекта и объема работ, поэтому фиксированная цена без анализа может быть неточной." }
    ]
  },
  kz: {
    nav: {
      services: "Қызметтер",
      prices: "Бағалар",
      process: "Жұмыс тәртібі",
      about: "Компания туралы",
      faq: "Сұрақ-жауап",
      contacts: "Байланыс",
      whatsapp: "WhatsApp"
    },
    seo: {
      homeTitle: "Қазақстандағы экологиялық құжаттама | Экологиялық мониторинг орталығы",
      homeDescription: "Қазақстан бойынша бизнеске арналған экологиялық жобалар, есептілік және рұқсат құжаттары. Алматыдағы ТОО, 2010 жылдан бергі тәжірибе, WhatsApp арқылы консультация.",
      servicesTitle: "Экологиялық қызметтер және бағалар | ПДВ, ПУО, ОВОС, есептер",
      servicesDescription: "Экологиялық қызметтер каталогы: ПДВ, ПУО, СҚА, ОВОС, ООВВ, РООС, РСВ, 2-ТП және 4-ОС есептері. Бағалар 25 000 ₸ бастап және сұраныс бойынша."
    },
    home: {
      hero: {
        eyebrow: "Алматыдағы ТОО · Қазақстан бойынша жұмыс",
        title: "Қазақстан бойынша бизнеске арналған экологиялық құжаттама және сүйемелдеу",
        lead: "Заңды тұлғаларға экологиялық жобалар, есептілік, рұқсат құжаттары және консультациялық сүйемелдеу дайындаймыз. Күрделі талаптарды түсінікті тілмен түсіндіреміз.",
        primaryCta: "WhatsApp-қа жазу",
        secondaryCta: "Қызметтерді көру"
      },
      trustChips: ["БИН 250140022679", "Алматы", "Қазақстан бойынша", "2010 жылдан бергі тәжірибе", "Дс-Жм 10:00-18:00"],
      directionsTitle: "Бизнеске қажет экологиялық міндеттерді жабамыз",
      directions: [
        { title: "Жобалық құжаттама", text: "Әртүрлі нысандар үшін ПДВ/НДВ, СҚА, ОВОС, ООВВ және РООС." },
        { title: "Қалдықтар", text: "ПУО, қалдықтарды түгендеу, қауіпті қалдықтар паспорты және байланысты материалдар." },
        { title: "Су пайдалану", text: "Су қорғау аймақтары, ПДС/НДС, үлестік нормалар және арнайы су пайдалану рұқсаты." },
        { title: "Есептілік", text: "2-ТП, 4-ОС, өндірістік экологиялық бақылау және іс-шаралар жоспарлары бойынша есептер." },
        { title: "Сүйемелдеу", text: "Нысанға қандай құжаттар керек екенін және қандай бастапқы деректер дайындау қажеттігін анықтауға көмектесеміз." }
      ],
      pricesTitle: "Танымал қызметтер және бағалар",
      pricesLead: "Бірқатар қызметтер үшін Satu ескі каталогындағы бастапқы баға көрсетілген. Нысанға байланысты қызметтер сұраныс бойынша есептеледі.",
      allServicesCta: "Толық каталогты ашу",
      processTitle: "Жұмыс тәртібі",
      process: [
        "WhatsApp арқылы өтінім немесе қоңырау",
        "Бастапқы консультация және міндетті нақтылау",
        "Нысан мен бастапқы деректерді талдау",
        "Экологиялық құжаттаманы дайындау",
        "Нәтижені тапсыру және сүйемелдеу"
      ],
      aboutTitle: "Экологиялық жобалау тәжірибесі 2010 жылдан бері",
      aboutText: "«Центр экологического мониторинга» ЖШС 2025 жылы тіркелген, ал команда мен жетекшінің табиғатты қорғау жобалау және нормалау саласындағы сараптамалық тәжірибесі 2010 жылдан басталады.",
      aboutProof: "Тәжірибе портфелінде АО «Гелиос», ТОО «Шин-Лайн», ТД «Форум», зертханалар, сауда орталықтары, техникалық қызмет көрсету станциялары, кеңсе және құрылыс нысандары бар.",
      contactTitle: "Консультация алу",
      contactLead: "Нысаныңызға қандай құжаттар қажет екенін және жұмыс көлеміне сәйкес құнын білу үшін WhatsApp-қа жазыңыз немесе қоңырау шалыңыз."
    },
    servicesPage: {
      eyebrow: "Қызметтер каталогы",
      title: "Экологиялық қызметтер және бағалар",
      lead: "Қызметтердің толық тізімі тапсырыс беруші құжаты бойынша қалыптастырылды. Бағалар Satu ескі каталогымен расталған жерде көрсетілген; қалған қызметтер бастапқы консультациядан кейін есептеледі.",
      requestPrice: "Құны сұраныс бойынша",
      fromPrefix: "бастап",
      cta: "Қызметті талқылау"
    },
    faq: [
      { q: "Біздің нысанға қандай құжат қажет екенін қалай білеміз?", a: "WhatsApp-қа қызмет түрін, нысанды және ағымдағы міндетті қысқаша жазыңыз. Бастапқы консультациядан кейін жоба, есеп, рұқсат немесе бірнеше құжат қажет екені анықталады." },
      { q: "Құн неге байланысты?", a: "Баға нысан түріне, санатына, әсер ету көздерінің санына, бастапқы деректердің болуына, мерзімге және келісу көлеміне байланысты." },
      { q: "Алматыдан тыс өңірлермен жұмыс істейсіздер ме?", a: "Иә, қызметтер Қазақстан бойынша көрсетіледі. Алматы компанияның кеңселік және заңды мекенжайы ретінде көрсетілген." },
      { q: "Қандай бастапқы деректер қажет?", a: "Әдетте нысан, қызмет түрі, шығарындылар немесе төгінділер көздері, қалдықтар, су пайдалану және бар рұқсат құжаттары туралы мәліметтер қажет." },
      { q: "Дайындау қанша уақыт алады?", a: "Мерзім құжат түріне және бастапқы деректердің толықтығына байланысты. Консультациядан кейін нақты міндетке сай мерзімді бағалауға болады." },
      { q: "Алдымен консультация алуға бола ма?", a: "Иә, WhatsApp арқылы бастапқы консультация жұмыс көлемін және қажетті құжаттар тізімін анықтауға көмектеседі." },
      { q: "Неге кейбір қызметтердің бағасы сұраныс бойынша?", a: "Мұндай қызметтердің құны нысанға және жұмыс көлеміне қатты байланысты, сондықтан талдаусыз бекітілген баға дәл болмауы мүмкін." }
    ]
  }
};
```

- [ ] **Step 7: Run data verification**

Run:

```bash
npm run verify:data
```

Expected: PASS with `verify:data PASS`.

- [ ] **Step 8: Commit data foundation**

Run:

```bash
git add package.json scripts/verify-data.mjs src/data/company.mjs src/data/services.mjs src/data/content.mjs
git commit -m "feat: add eco landing content data"
```

Expected: commit succeeds.

## Task 2: Site Helpers And Helper Tests

**Files:**
- Create: `scripts/verify-site-helpers.mjs`
- Create: `src/utils/site.mjs`

- [ ] **Step 1: Write the failing helper verification script**

Create `scripts/verify-site-helpers.mjs`:

```js
import assert from "node:assert/strict";
import { company } from "../src/data/company.mjs";
import { services } from "../src/data/services.mjs";
import {
  canonicalUrl,
  getAlternateLinks,
  getRoute,
  getSiteUrl,
  localizePath,
  formatPrice,
  getOrganizationJsonLd,
  getPageMeta
} from "../src/utils/site.mjs";

assert.equal(getSiteUrl(), "http://localhost:4321");
assert.equal(getRoute("ru", "home"), "/");
assert.equal(getRoute("kz", "home"), "/kz/");
assert.equal(getRoute("ru", "services"), "/services/");
assert.equal(getRoute("kz", "services"), "/kz/services/");
assert.equal(localizePath("kz", "services"), "/kz/services/");
assert.equal(canonicalUrl("/services/"), "http://localhost:4321/services/");

const alternates = getAlternateLinks("services");
assert.deepEqual(alternates, [
  { lang: "ru", href: "http://localhost:4321/services/" },
  { lang: "kk", href: "http://localhost:4321/kz/services/" }
]);

assert.equal(formatPrice(services.find((service) => service.id === "puo"), "ru"), "от 30 000 ₸");
assert.equal(formatPrice(services.find((service) => service.id === "puo"), "kz"), "30 000 ₸ бастап");
assert.equal(formatPrice(services.find((service) => service.id === "szz"), "ru"), "Стоимость по запросу");
assert.equal(formatPrice(services.find((service) => service.id === "szz"), "kz"), "Құны сұраныс бойынша");

const homeMeta = getPageMeta("ru", "home");
assert.match(homeMeta.title, /Экологическая документация/);
assert.match(homeMeta.description, /Казахстану/);

const jsonLd = getOrganizationJsonLd("ru");
assert.equal(jsonLd["@type"], "LocalBusiness");
assert.equal(jsonLd.name, company.legalName.ru);
assert.equal(jsonLd.telephone, company.primaryPhone.display);
assert.equal(jsonLd.address.streetAddress, company.address.ru);
assert.equal(jsonLd.openingHoursSpecification[0].opens, "10:00");

console.log("verify:helpers PASS");
```

- [ ] **Step 2: Run helper script to verify it fails**

Run:

```bash
npm run verify:helpers
```

Expected: FAIL with a module-not-found error for `src/utils/site.mjs`.

- [ ] **Step 3: Implement helper utilities**

Create `src/utils/site.mjs`:

```js
import { company } from "../data/company.mjs";
import { content } from "../data/content.mjs";

export const pages = ["home", "services"];

export function getSiteUrl() {
  const fromAstro = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.PUBLIC_SITE_URL : "";
  const fromNode = typeof process !== "undefined" ? process.env.PUBLIC_SITE_URL : "";
  return (fromAstro || fromNode || "http://localhost:4321").replace(/\/$/, "");
}

export function getRoute(locale, page) {
  const routes = {
    ru: { home: "/", services: "/services/" },
    kz: { home: "/kz/", services: "/kz/services/" }
  };
  return routes[locale][page];
}

export function localizePath(locale, page) {
  return getRoute(locale, page);
}

export function canonicalUrl(pathname) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${getSiteUrl()}${normalized}`;
}

export function getAlternateLinks(page) {
  return [
    { lang: "ru", href: canonicalUrl(getRoute("ru", page)) },
    { lang: "kk", href: canonicalUrl(getRoute("kz", page)) }
  ];
}

export function formatNumber(amount) {
  return new Intl.NumberFormat("ru-KZ").format(amount);
}

export function formatPrice(service, locale) {
  if (service.price.type === "request") {
    return locale === "kz" ? content.kz.servicesPage.requestPrice : content.ru.servicesPage.requestPrice;
  }
  const amount = `${formatNumber(service.price.amount)} ₸`;
  return locale === "kz" ? `${amount} бастап` : `от ${amount}`;
}

export function getPageMeta(locale, page) {
  const seo = content[locale].seo;
  if (page === "services") {
    return {
      title: seo.servicesTitle,
      description: seo.servicesDescription
    };
  }
  return {
    title: seo.homeTitle,
    description: seo.homeDescription
  };
}

export function getWhatsAppUrl(locale) {
  const text = locale === "kz"
    ? "Сәлеметсіз бе! Экологиялық қызмет бойынша консультация алғым келеді."
    : "Здравствуйте! Хочу получить консультацию по экологическим услугам.";
  return `${company.primaryPhone.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function getOrganizationJsonLd(locale) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.legalName[locale],
    alternateName: company.brand[locale],
    url: getSiteUrl(),
    telephone: company.primaryPhone.display,
    areaServed: "KZ",
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address[locale],
      addressLocality: locale === "kz" ? "Алматы" : "Алматы",
      addressCountry: locale === "kz" ? "Қазақстан" : "Казахстан"
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: company.scheduleStructured.days,
        opens: company.scheduleStructured.opens,
        closes: company.scheduleStructured.closes
      }
    ]
  };
}
```

- [ ] **Step 4: Run helper verification**

Run:

```bash
npm run verify:helpers
```

Expected: PASS with `verify:helpers PASS`.

- [ ] **Step 5: Commit helpers**

Run:

```bash
git add scripts/verify-site-helpers.mjs src/utils/site.mjs
git commit -m "feat: add routing and SEO helpers"
```

Expected: commit succeeds.

## Task 3: Base Layout, Header, Footer, And Global Styles

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace the starter page with a temporary layout smoke page**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout locale="ru" page="home">
  <main id="main-content" class="section">
    <div class="container stack-lg">
      <p class="eyebrow">Тестовая страница</p>
      <h1>Центр экологического мониторинга</h1>
      <p class="lead">Эта временная страница проверяет общий layout, шрифт, шапку и подвал.</p>
      <a class="button button-primary" href="https://wa.me/77077924445">WhatsApp</a>
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Run build to verify it fails**

Run:

```bash
npm run build
```

Expected: FAIL with a module-not-found error for `src/layouts/BaseLayout.astro`.

- [ ] **Step 3: Create global CSS**

Create `src/styles/global.css`:

```css
@font-face {
  font-family: "TinkoffSans";
  src: url("/fonts/tbank/TinkoffSans-Regular.woff2") format("woff2"),
    url("/fonts/tbank/TinkoffSans-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "TinkoffSans";
  src: url("/fonts/tbank/TinkoffSans-Medium.woff2") format("woff2"),
    url("/fonts/tbank/TinkoffSans-Medium.woff") format("woff");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "TinkoffSans";
  src: url("/fonts/tbank/TinkoffSans-Bold.woff2") format("woff2"),
    url("/fonts/tbank/TinkoffSans-Bold.woff") format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

:root {
  --color-primary: #059669;
  --color-primary-dark: #047857;
  --color-on-primary: #ffffff;
  --color-foreground: #0f172a;
  --color-forest: #064e3b;
  --color-background: #ecfdf5;
  --color-surface: #ffffff;
  --color-muted: #e8f1f3;
  --color-border: #a7f3d0;
  --color-accent: #b7791f;
  --color-destructive: #dc2626;
  --shadow-soft: 0 16px 48px rgba(15, 23, 42, 0.08);
  --radius-card: 8px;
  --container: 1160px;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: "TinkoffSans", Arial, sans-serif;
  color: var(--color-foreground);
  background:
    linear-gradient(135deg, rgba(5, 150, 105, 0.08), transparent 35%),
    var(--color-background);
  font-size: 16px;
  line-height: 1.6;
}

a {
  color: inherit;
}

img,
svg {
  display: block;
  max-width: 100%;
}

button,
summary,
a {
  -webkit-tap-highlight-color: transparent;
}

:focus-visible {
  outline: 3px solid rgba(5, 150, 105, 0.45);
  outline-offset: 3px;
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: 0.5rem;
  z-index: 100;
  transform: translateY(-150%);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-card);
  background: var(--color-forest);
  color: #fff;
}

.skip-link:focus {
  transform: translateY(0);
}

.container {
  width: min(100% - 32px, var(--container));
  margin-inline: auto;
}

.section {
  padding: clamp(3rem, 7vw, 6.5rem) 0;
}

.stack-lg > * + * {
  margin-top: 1.25rem;
}

.eyebrow {
  margin: 0;
  color: var(--color-primary-dark);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  max-width: 850px;
  margin-bottom: 1.25rem;
  color: var(--color-forest);
  font-size: clamp(2.4rem, 7vw, 5rem);
  line-height: 1.04;
  letter-spacing: 0;
}

h2 {
  max-width: 760px;
  margin-bottom: 1rem;
  color: var(--color-forest);
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.1;
  letter-spacing: 0;
}

h3 {
  color: var(--color-forest);
  font-size: 1.2rem;
  line-height: 1.25;
}

.lead {
  max-width: 760px;
  color: #334155;
  font-size: clamp(1.05rem, 2vw, 1.25rem);
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(167, 243, 208, 0.65);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
}

.header-inner {
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.wordmark {
  color: var(--color-forest);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.1;
  text-decoration: none;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-card);
  padding: 0.55rem 0.8rem;
  color: #334155;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 180ms ease, color 180ms ease;
}

.nav-link:hover {
  background: rgba(5, 150, 105, 0.08);
  color: var(--color-forest);
}

.button {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: var(--radius-card);
  padding: 0.72rem 1rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.button:hover {
  transform: translateY(-1px);
}

.button-primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.button-primary:hover {
  background: var(--color-primary-dark);
}

.button-secondary {
  border-color: rgba(5, 150, 105, 0.35);
  background: #fff;
  color: var(--color-forest);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lang-switch {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  border: 1px solid rgba(5, 150, 105, 0.2);
  border-radius: var(--radius-card);
  overflow: hidden;
  background: #fff;
}

.lang-switch a,
.lang-switch span {
  padding: 0.62rem 0.7rem;
  font-weight: 700;
  text-decoration: none;
}

.lang-switch span {
  background: rgba(5, 150, 105, 0.12);
  color: var(--color-forest);
}

.mobile-menu {
  display: none;
}

.site-footer {
  border-top: 1px solid rgba(167, 243, 208, 0.7);
  background: #fff;
  padding: 2rem 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
}

.muted {
  color: #475569;
}

@media (max-width: 920px) {
  .desktop-nav,
  .header-actions {
    display: none;
  }

  .mobile-menu {
    display: block;
  }

  .mobile-menu summary {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    border: 1px solid rgba(5, 150, 105, 0.25);
    border-radius: var(--radius-card);
    padding: 0.5rem 0.8rem;
    color: var(--color-forest);
    font-weight: 700;
    cursor: pointer;
  }

  .mobile-panel {
    position: absolute;
    left: 16px;
    right: 16px;
    top: 84px;
    display: grid;
    gap: 0.35rem;
    border: 1px solid rgba(167, 243, 208, 0.8);
    border-radius: var(--radius-card);
    background: #fff;
    padding: 0.75rem;
    box-shadow: var(--shadow-soft);
  }

  .footer-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [ ] **Step 4: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import "../styles/global.css";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import { content } from "../data/content.mjs";
import { getAlternateLinks, getOrganizationJsonLd, getPageMeta, getRoute, canonicalUrl } from "../utils/site.mjs";

const { locale = "ru", page = "home" } = Astro.props;
const lang = locale === "kz" ? "kk" : "ru";
const meta = getPageMeta(locale, page);
const pathname = getRoute(locale, page);
const alternates = getAlternateLinks(page);
const jsonLd = getOrganizationJsonLd(locale);
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="generator" content={Astro.generator} />
    <title>{meta.title}</title>
    <meta name="description" content={meta.description} />
    <link rel="canonical" href={canonicalUrl(pathname)} />
    {alternates.map((alternate) => <link rel="alternate" hreflang={alternate.lang} href={alternate.href} />)}
    <link rel="alternate" hreflang="x-default" href={canonicalUrl("/")} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={meta.title} />
    <meta property="og:description" content={meta.description} />
    <meta property="og:url" content={canonicalUrl(pathname)} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="preload" href="/fonts/tbank/TinkoffSans-Regular.woff2" as="font" type="font/woff2" crossorigin />
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body>
    <a class="skip-link" href="#main-content">{locale === "kz" ? "Негізгі мазмұнға өту" : "Перейти к содержимому"}</a>
    <Header locale={locale} nav={content[locale].nav} page={page} />
    <slot />
    <Footer locale={locale} />
  </body>
</html>
```

- [ ] **Step 5: Create Header**

Create `src/components/Header.astro`:

```astro
---
import { company } from "../data/company.mjs";
import { getRoute, getWhatsAppUrl } from "../utils/site.mjs";

const { locale, nav, page } = Astro.props;
const otherLocale = locale === "kz" ? "ru" : "kz";
const navItems = [
  { label: nav.services, href: getRoute(locale, "services") },
  { label: nav.prices, href: `${getRoute(locale, "home")}#prices` },
  { label: nav.process, href: `${getRoute(locale, "home")}#process` },
  { label: nav.about, href: `${getRoute(locale, "home")}#about` },
  { label: nav.faq, href: `${getRoute(locale, "home")}#faq` },
  { label: nav.contacts, href: `${getRoute(locale, "home")}#contacts` }
];
---

<header class="site-header">
  <div class="container header-inner">
    <a class="wordmark" href={getRoute(locale, "home")} aria-label={company.brand[locale]}>
      {company.brand[locale]}
    </a>

    <nav class="desktop-nav" aria-label={locale === "kz" ? "Негізгі навигация" : "Основная навигация"}>
      <ul class="nav-list">
        {navItems.map((item) => (
          <li><a class="nav-link" href={item.href}>{item.label}</a></li>
        ))}
      </ul>
    </nav>

    <div class="header-actions">
      <div class="lang-switch" aria-label="Language">
        {locale === "ru" ? <span>RU</span> : <a href={getRoute("ru", page)}>RU</a>}
        {locale === "kz" ? <span>KZ</span> : <a href={getRoute("kz", page)}>KZ</a>}
      </div>
      <a class="button button-primary" href={getWhatsAppUrl(locale)}>{nav.whatsapp}</a>
    </div>

    <details class="mobile-menu">
      <summary>{locale === "kz" ? "Мәзір" : "Меню"}</summary>
      <div class="mobile-panel">
        {navItems.map((item) => <a class="nav-link" href={item.href}>{item.label}</a>)}
        <a class="nav-link" href={getRoute(otherLocale, page)}>{otherLocale === "kz" ? "KZ" : "RU"}</a>
        <a class="button button-primary" href={getWhatsAppUrl(locale)}>{nav.whatsapp}</a>
      </div>
    </details>
  </div>
</header>
```

- [ ] **Step 6: Create Footer**

Create `src/components/Footer.astro`:

```astro
---
import { company } from "../data/company.mjs";
import { getRoute, getWhatsAppUrl } from "../utils/site.mjs";

const { locale } = Astro.props;
const labels = locale === "kz"
  ? { contact: "Байланыс", schedule: "Жұмыс уақыты", address: "Мекенжай", services: "Қызметтер", home: "Басты бет" }
  : { contact: "Контакты", schedule: "График", address: "Адрес", services: "Услуги", home: "Главная" };
---

<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <a class="wordmark" href={getRoute(locale, "home")}>{company.brand[locale]}</a>
      <p class="muted">{company.legalName[locale]}</p>
      <p class="muted">БИН {company.bin}</p>
    </div>
    <div>
      <p><strong>{labels.contact}</strong></p>
      <p><a href={`tel:${company.primaryPhone.tel}`}>{company.primaryPhone.display}</a> · <a href={getWhatsAppUrl(locale)}>WhatsApp</a></p>
      <p><strong>{labels.schedule}:</strong> {company.schedule[locale]}</p>
      <p><strong>{labels.address}:</strong> {company.address[locale]}</p>
      <p><a href={getRoute(locale, "home")}>{labels.home}</a> · <a href={getRoute(locale, "services")}>{labels.services}</a> · <a href="/llms.txt">llms.txt</a></p>
    </div>
  </div>
</footer>
```

- [ ] **Step 7: Run build**

Run:

```bash
npm run build
```

Expected: PASS and `dist/index.html` is generated.

- [ ] **Step 8: Commit layout foundation**

Run:

```bash
git add src/pages/index.astro src/styles/global.css src/layouts/BaseLayout.astro src/components/Header.astro src/components/Footer.astro
git commit -m "feat: add site layout foundation"
```

Expected: commit succeeds.

## Task 4: Landing Page Component And RU/KZ Landing Routes

**Files:**
- Create: `src/components/LandingPage.astro`
- Modify: `src/pages/index.astro`
- Create: `src/pages/kz/index.astro`

- [ ] **Step 1: Replace landing routes before component exists**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import LandingPage from "../components/LandingPage.astro";
---

<BaseLayout locale="ru" page="home">
  <LandingPage locale="ru" />
</BaseLayout>
```

Create `src/pages/kz/index.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import LandingPage from "../../components/LandingPage.astro";
---

<BaseLayout locale="kz" page="home">
  <LandingPage locale="kz" />
</BaseLayout>
```

- [ ] **Step 2: Run build to verify it fails**

Run:

```bash
npm run build
```

Expected: FAIL with a module-not-found error for `src/components/LandingPage.astro`.

- [ ] **Step 3: Add landing-specific styles**

Append this CSS to `src/styles/global.css`:

```css
.hero {
  min-height: calc(100dvh - 76px);
  display: grid;
  align-items: center;
  padding: clamp(3rem, 8vw, 7rem) 0;
}

.hero-actions,
.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  border: 1px solid rgba(5, 150, 105, 0.2);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  padding: 0.4rem 0.75rem;
  color: var(--color-forest);
  font-weight: 700;
  font-size: 0.92rem;
}

.section-heading {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.grid {
  display: grid;
  gap: 1rem;
}

.grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-5 {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.card {
  border: 1px solid rgba(167, 243, 208, 0.8);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  padding: 1.15rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
}

.price-card {
  display: grid;
  gap: 0.75rem;
}

.price {
  color: var(--color-forest);
  font-size: 1.35rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.steps {
  counter-reset: steps;
  list-style: none;
  padding: 0;
}

.step {
  counter-increment: steps;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.8rem;
  align-items: start;
}

.step::before {
  content: counter(steps);
  width: 2rem;
  height: 2rem;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 700;
}

.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;
}

.faq-list {
  display: grid;
  gap: 0.75rem;
}

.faq-list details {
  border: 1px solid rgba(167, 243, 208, 0.9);
  border-radius: var(--radius-card);
  background: #fff;
  padding: 1rem;
}

.faq-list summary {
  min-height: 44px;
  display: flex;
  align-items: center;
  color: var(--color-forest);
  font-weight: 700;
  cursor: pointer;
}

.contact-band {
  border-radius: var(--radius-card);
  background: var(--color-forest);
  color: #fff;
  padding: clamp(1.5rem, 4vw, 3rem);
}

.contact-band h2,
.contact-band p {
  color: #fff;
}

@media (max-width: 980px) {
  .grid-3,
  .grid-5,
  .split {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Implement landing component**

Create `src/components/LandingPage.astro`:

```astro
---
import { company } from "../data/company.mjs";
import { content } from "../data/content.mjs";
import { featuredServices } from "../data/services.mjs";
import { formatPrice, getRoute, getWhatsAppUrl } from "../utils/site.mjs";

const { locale } = Astro.props;
const page = content[locale].home;
const faq = content[locale].faq;
---

<main id="main-content">
  <section class="hero">
    <div class="container stack-lg">
      <p class="eyebrow">{page.hero.eyebrow}</p>
      <h1>{page.hero.title}</h1>
      <p class="lead">{page.hero.lead}</p>
      <div class="hero-actions">
        <a class="button button-primary" href={getWhatsAppUrl(locale)}>{page.hero.primaryCta}</a>
        <a class="button button-secondary" href={getRoute(locale, "services")}>{page.hero.secondaryCta}</a>
      </div>
      <div class="chip-row" aria-label={locale === "kz" ? "Сенім деректері" : "Данные доверия"}>
        {page.trustChips.map((chip) => <span class="chip">{chip}</span>)}
      </div>
    </div>
  </section>

  <section class="section" id="services">
    <div class="container">
      <div class="section-heading">
        <p class="eyebrow">{locale === "kz" ? "Бағыттар" : "Направления"}</p>
        <h2>{page.directionsTitle}</h2>
      </div>
      <div class="grid grid-5">
        {page.directions.map((direction) => (
          <article class="card">
            <h3>{direction.title}</h3>
            <p class="muted">{direction.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>

  <section class="section" id="prices">
    <div class="container">
      <div class="section-heading">
        <p class="eyebrow">{locale === "kz" ? "Бағалар" : "Цены"}</p>
        <h2>{page.pricesTitle}</h2>
        <p class="lead">{page.pricesLead}</p>
      </div>
      <div class="grid grid-3">
        {featuredServices.map((service) => (
          <article class="card price-card">
            <h3>{service.title[locale]}</h3>
            <p class="muted">{service.summary[locale]}</p>
            <p class="price">{formatPrice(service, locale)}</p>
          </article>
        ))}
      </div>
      <p class="cta-row" style="margin-top: 1.25rem;">
        <a class="button button-secondary" href={getRoute(locale, "services")}>{page.allServicesCta}</a>
      </p>
    </div>
  </section>

  <section class="section" id="process">
    <div class="container split">
      <div>
        <p class="eyebrow">{locale === "kz" ? "Процесс" : "Процесс"}</p>
        <h2>{page.processTitle}</h2>
      </div>
      <ol class="steps grid">
        {page.process.map((step) => <li class="step card">{step}</li>)}
      </ol>
    </div>
  </section>

  <section class="section" id="about">
    <div class="container split">
      <div>
        <p class="eyebrow">{company.legalName[locale]}</p>
        <h2>{page.aboutTitle}</h2>
      </div>
      <div class="card">
        <p>{page.aboutText}</p>
        <p class="muted">{page.aboutProof}</p>
      </div>
    </div>
  </section>

  <section class="section" id="faq">
    <div class="container">
      <div class="section-heading">
        <p class="eyebrow">FAQ</p>
        <h2>{locale === "kz" ? "Жиі қойылатын сұрақтар" : "Частые вопросы"}</h2>
      </div>
      <div class="faq-list">
        {faq.map((item) => (
          <details>
            <summary>{item.q}</summary>
            <p class="muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>

  <section class="section" id="contacts">
    <div class="container">
      <div class="contact-band split">
        <div>
          <p class="eyebrow">{locale === "kz" ? "Байланыс" : "Контакты"}</p>
          <h2>{page.contactTitle}</h2>
          <p>{page.contactLead}</p>
        </div>
        <div>
          <p><strong>{company.primaryPhone.display}</strong></p>
          <p>{company.address[locale]}</p>
          <p>{company.schedule[locale]}</p>
          <p>{company.geography[locale]}</p>
          <a class="button button-primary" href={getWhatsAppUrl(locale)}>WhatsApp</a>
        </div>
      </div>
    </div>
  </section>
</main>
```

- [ ] **Step 5: Run build**

Run:

```bash
npm run build
```

Expected: PASS and both `dist/index.html` and `dist/kz/index.html` are generated.

- [ ] **Step 6: Commit landing pages**

Run:

```bash
git add src/components/LandingPage.astro src/pages/index.astro src/pages/kz/index.astro src/styles/global.css
git commit -m "feat: add bilingual landing pages"
```

Expected: commit succeeds.

## Task 5: Services Catalog Component And Routes

**Files:**
- Create: `src/components/ServicesPage.astro`
- Create: `src/pages/services.astro`
- Create: `src/pages/kz/services.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create services routes before component exists**

Create `src/pages/services.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import ServicesPage from "../components/ServicesPage.astro";
---

<BaseLayout locale="ru" page="services">
  <ServicesPage locale="ru" />
</BaseLayout>
```

Create `src/pages/kz/services.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import ServicesPage from "../../components/ServicesPage.astro";
---

<BaseLayout locale="kz" page="services">
  <ServicesPage locale="kz" />
</BaseLayout>
```

- [ ] **Step 2: Run build to verify it fails**

Run:

```bash
npm run build
```

Expected: FAIL with a module-not-found error for `src/components/ServicesPage.astro`.

- [ ] **Step 3: Add services styles**

Append this CSS to `src/styles/global.css`:

```css
.services-hero {
  padding: clamp(3rem, 7vw, 6rem) 0 2rem;
}

.service-group {
  scroll-margin-top: 96px;
}

.service-list {
  display: grid;
  gap: 0.75rem;
}

.service-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(170px, auto) auto;
  gap: 1rem;
  align-items: center;
  border: 1px solid rgba(167, 243, 208, 0.85);
  border-radius: var(--radius-card);
  background: #fff;
  padding: 1rem;
}

.service-row h3 {
  margin-bottom: 0.35rem;
}

.service-price {
  color: var(--color-forest);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1.5rem 0 2rem;
}

@media (max-width: 780px) {
  .service-row {
    grid-template-columns: 1fr;
  }

  .service-price {
    white-space: normal;
  }
}
```

- [ ] **Step 4: Implement services component**

Create `src/components/ServicesPage.astro`:

```astro
---
import { serviceCategories, services } from "../data/services.mjs";
import { content } from "../data/content.mjs";
import { formatPrice, getWhatsAppUrl } from "../utils/site.mjs";

const { locale } = Astro.props;
const page = content[locale].servicesPage;
---

<main id="main-content">
  <section class="services-hero">
    <div class="container stack-lg">
      <p class="eyebrow">{page.eyebrow}</p>
      <h1>{page.title}</h1>
      <p class="lead">{page.lead}</p>
      <a class="button button-primary" href={getWhatsAppUrl(locale)}>WhatsApp</a>
      <div class="category-tabs" aria-label={locale === "kz" ? "Қызмет санаттары" : "Категории услуг"}>
        {serviceCategories.map((category) => (
          <a class="button button-secondary" href={`#${category.id}`}>{category.title[locale]}</a>
        ))}
      </div>
    </div>
  </section>

  <section class="section" style="padding-top: 0;">
    <div class="container stack-lg">
      {serviceCategories.map((category) => {
        const categoryServices = services.filter((service) => service.categoryId === category.id);
        return (
          <section class="service-group" id={category.id}>
            <div class="section-heading">
              <h2>{category.title[locale]}</h2>
            </div>
            <div class="service-list">
              {categoryServices.map((service) => (
                <article class="service-row">
                  <div>
                    <h3>{service.title[locale]}</h3>
                    <p class="muted">{service.summary[locale]}</p>
                  </div>
                  <p class="service-price">{formatPrice(service, locale)}</p>
                  <a class="button button-secondary" href={getWhatsAppUrl(locale)}>{page.cta}</a>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  </section>
</main>
```

- [ ] **Step 5: Run build**

Run:

```bash
npm run build
```

Expected: PASS and both `dist/services/index.html` and `dist/kz/services/index.html` are generated.

- [ ] **Step 6: Commit services catalog**

Run:

```bash
git add src/components/ServicesPage.astro src/pages/services.astro src/pages/kz/services.astro src/styles/global.css
git commit -m "feat: add bilingual services catalog"
```

Expected: commit succeeds.

## Task 6: SEO, Sitemap, Robots, And AI Crawler Files

**Files:**
- Create: `src/pages/sitemap.xml.js`
- Create: `src/pages/robots.txt.js`
- Create: `src/pages/llms.txt.js`
- Create: `src/pages/llm.txt.js`
- Create: `scripts/verify-build-output.mjs`

- [ ] **Step 1: Write build-output verification before endpoints exist**

Create `scripts/verify-build-output.mjs`:

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

function readDist(path) {
  const filePath = join(dist, path);
  assert.ok(existsSync(filePath), `Missing dist file: ${path}`);
  return readFileSync(filePath, "utf8");
}

const pages = [
  { path: "index.html", title: "Экологическая документация в Казахстане", forbidden: ["Сейфулина", "Safina", "Sunny", "g.kezembayeva@gmail.com"] },
  { path: "services/index.html", title: "Экологические услуги и цены", forbidden: ["Сейфулина", "Safina", "Sunny", "g.kezembayeva@gmail.com"] },
  { path: "kz/index.html", title: "Қазақстандағы экологиялық құжаттама", forbidden: ["Сейфулина", "Safina", "Sunny", "g.kezembayeva@gmail.com"] },
  { path: "kz/services/index.html", title: "Экологиялық қызметтер және бағалар", forbidden: ["Сейфулина", "Safina", "Sunny", "g.kezembayeva@gmail.com"] }
];

for (const page of pages) {
  const html = readDist(page.path);
  assert.match(html, new RegExp(`<title>${page.title}`));
  assert.match(html, /<meta name="description" content="[^"]{50,}"/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /hreflang="ru"/);
  assert.match(html, /hreflang="kk"/);
  assert.match(html, /77077924445/);
  assert.match(html, /Жарокова|Жароков/);
  for (const forbidden of page.forbidden) {
    assert.doesNotMatch(html, new RegExp(forbidden, "i"), `${page.path} contains forbidden text ${forbidden}`);
  }
}

const servicesHtml = readDist("services/index.html");
for (const expected of ["от 25 000 ₸", "от 30 000 ₸", "от 40 000 ₸", "от 45 000 ₸", "от 80 000 ₸", "от 100 000 ₸", "Стоимость по запросу"]) {
  assert.match(servicesHtml, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

const sitemap = readDist("sitemap.xml");
for (const loc of ["/", "/services/", "/kz/", "/kz/services/"]) {
  assert.match(sitemap, new RegExp(`<loc>http://localhost:4321${loc}</loc>`));
}
assert.match(sitemap, /hreflang="ru"/);
assert.match(sitemap, /hreflang="kk"/);

const robots = readDist("robots.txt");
assert.match(robots, /User-agent: \*/);
assert.match(robots, /Allow: \//);
assert.match(robots, /Sitemap: http:\/\/localhost:4321\/sitemap.xml/);

const llms = readDist("llms.txt");
assert.match(llms, /Центр экологического мониторинга/);
assert.match(llms, /Экологиялық мониторинг орталығы/);
assert.match(llms, /ПДВ/);
assert.match(llms, /77077924445/);

const llm = readDist("llm.txt");
assert.equal(llm, llms);

console.log("verify:build PASS");
```

- [ ] **Step 2: Run verification to confirm endpoint gap**

Run:

```bash
npm run build && npm run verify:build
```

Expected: FAIL with `Missing dist file: sitemap.xml`.

- [ ] **Step 3: Create sitemap endpoint**

Create `src/pages/sitemap.xml.js`:

```js
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
```

- [ ] **Step 4: Create robots endpoint**

Create `src/pages/robots.txt.js`:

```js
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
```

- [ ] **Step 5: Create llms endpoint and llm mirror**

Create `src/pages/llms.txt.js`:

```js
import { company } from "../data/company.mjs";
import { featuredServices, services } from "../data/services.mjs";
import { formatPrice, getRoute, getSiteUrl } from "../utils/site.mjs";

export function buildLlmsText() {
  const origin = getSiteUrl();
  const featured = featuredServices
    .map((service) => `- ${service.title.ru}: ${formatPrice(service, "ru")} / ${service.title.kz}: ${formatPrice(service, "kz")}`)
    .join("\n");
  const requestCount = services.filter((service) => service.price.type === "request").length;

  return `# ${company.brand.ru}

## RU
${company.legalName.ru} готовит экологические проекты, отчеты, разрешения и консультационное сопровождение для юридических лиц по Казахстану. БИН: ${company.bin}. Адрес: ${company.address.ru}. Контакт: ${company.primaryPhone.display}, WhatsApp ${company.primaryPhone.whatsapp}. График: ${company.schedule.ru}.

Основные услуги:
${featured}
- Услуги без фиксированной цены: ${requestCount} позиций, стоимость по запросу после первичной консультации.

Страницы:
- Главная: ${origin}${getRoute("ru", "home")}
- Услуги: ${origin}${getRoute("ru", "services")}

## KZ
${company.legalName.kz} Қазақстан бойынша заңды тұлғаларға экологиялық жобалар, есептер, рұқсат құжаттары және консультациялық сүйемелдеу дайындайды. БИН: ${company.bin}. Мекенжай: ${company.address.kz}. Байланыс: ${company.primaryPhone.display}, WhatsApp ${company.primaryPhone.whatsapp}. Жұмыс уақыты: ${company.schedule.kz}.

Беттер:
- Басты бет: ${origin}${getRoute("kz", "home")}
- Қызметтер: ${origin}${getRoute("kz", "services")}
`;
}

export async function GET() {
  return new Response(buildLlmsText(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
```

Create `src/pages/llm.txt.js`:

```js
import { buildLlmsText } from "./llms.txt.js";

export async function GET() {
  return new Response(buildLlmsText(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
```

- [ ] **Step 6: Run build-output verification**

Run:

```bash
npm run build && npm run verify:build
```

Expected: PASS with `verify:build PASS`.

- [ ] **Step 7: Commit SEO and crawler files**

Run:

```bash
git add src/pages/sitemap.xml.js src/pages/robots.txt.js src/pages/llms.txt.js src/pages/llm.txt.js scripts/verify-build-output.mjs
git commit -m "feat: add crawler and SEO outputs"
```

Expected: commit succeeds.

## Task 7: Full Verification And Browser QA

**Files:**
- No planned code files.
- Use browser screenshots during execution if visual issues are found.

- [ ] **Step 1: Run full automated verification**

Run:

```bash
npm run verify
```

Expected: PASS for `verify:data`, `verify:helpers`, Astro build, and `verify:build`.

- [ ] **Step 2: Start local server**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: dev server starts and prints a local URL, normally `http://127.0.0.1:4321/`.

- [ ] **Step 3: Browser-check desktop routes**

Open these URLs in the in-app Browser plugin:

```txt
http://127.0.0.1:4321/
http://127.0.0.1:4321/services/
http://127.0.0.1:4321/kz/
http://127.0.0.1:4321/kz/services/
```

Expected:

- Header is visible.
- Wordmark uses text `Центр экологического мониторинга` or `Экологиялық мониторинг орталығы`.
- No text overlaps.
- No horizontal scroll.
- Service prices are readable.
- WhatsApp CTA is visible.

- [ ] **Step 4: Browser-check mobile width**

Use a 375px-wide viewport in the in-app Browser plugin on:

```txt
http://127.0.0.1:4321/
http://127.0.0.1:4321/kz/services/
```

Expected:

- Mobile menu summary is visible and opens.
- Buttons remain at least 44px tall.
- Long KZ service names wrap cleanly.
- No horizontal scroll.
- Contact band content remains readable.

- [ ] **Step 5: Keyboard and FAQ check**

In the browser:

```txt
Tab through header links, language switch, WhatsApp CTA, FAQ summaries, and footer links.
Open one FAQ item with Enter.
```

Expected:

- Focus ring is visible.
- Focus order follows visual order.
- FAQ opens without a mouse.

- [ ] **Step 6: Fix any visual defects with scoped CSS**

If browser QA reveals a defect, edit only the affected CSS selectors in `src/styles/global.css`. Use changes like:

```css
@media (max-width: 480px) {
  .button {
    width: 100%;
  }

  .service-row {
    padding: 0.9rem;
  }
}
```

Run:

```bash
npm run verify
```

Expected: PASS.

- [ ] **Step 7: Commit verification polish**

If Step 6 changed files, run:

```bash
git add src/styles/global.css
git commit -m "fix: polish responsive landing layout"
```

If Step 6 did not change files, do not create an empty commit.

## Task 8: Final Review

**Files:**
- No planned code files.

- [ ] **Step 1: Confirm clean implementation status**

Run:

```bash
git status --short
```

Expected: only user-owned unrelated untracked files may remain. Implementation files should be committed.

- [ ] **Step 2: Confirm latest commits**

Run:

```bash
git log --oneline -6
```

Expected: recent commits include data, helpers, layout, landing pages, services catalog, SEO outputs, and optional responsive polish.

- [ ] **Step 3: Final verification command**

Run:

```bash
npm run verify
```

Expected: PASS.

- [ ] **Step 4: Final handoff summary**

Report:

```txt
Implemented bilingual RU/KZ Astro landing and services pages.
Verified build, data, SEO helpers, generated crawler files, and build output.
Local routes: /, /services, /kz, /kz/services.
Crawler files: /sitemap.xml, /robots.txt, /llms.txt, /llm.txt.
```

## Plan Self-Review

- Spec coverage: company identity, contacts, source priority, RU/KZ routes, services/prices, visual system, SEO files, crawler files, accessibility, performance, and verification are covered by Tasks 1-8.
- Placeholder scan: this plan defines concrete files, code, commands, and expected outputs.
- Type consistency: all data modules use `.mjs`; helper names used by pages and tests are defined in `src/utils/site.mjs`; routes use `home` and `services` consistently.
