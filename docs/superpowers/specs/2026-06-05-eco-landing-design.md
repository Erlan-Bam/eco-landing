# Eco Landing Design Spec

Date: 2026-06-05
Status: Approved for implementation planning
Project: TОО "Центр экологического мониторинга"

## Summary

Build a bilingual RU/KZ Astro website for TОО "Центр экологического мониторинга": a main landing page plus a full services page. The site should present environmental documentation, monitoring, reporting, permitting, and consulting services for legal entities across Kazakhstan, with a trustworthy B2B tone and clear WhatsApp/call conversion.

The selected concept is "Экологический консалтинг без лишней сложности": official enough for environmental documentation and regulatory work, but written in clear human language. The site must avoid both dry bureaucracy and decorative greenwashing.

## Source Priority

Use sources in this order when data conflicts:

1. `/Users/yayzo/Downloads/Услуги ИП Кезембаева.docx` is the source of truth for the list of services.
2. `https://kezembaeva.satu.kz/` is the source for existing service prices, legacy experience text, schedule, and old catalog context.
3. `https://ba.prg.kz/750000000-almaty/250140022679-too-tsentr-ekologicheskogo-monitoringa/` is the source for the current TОО identity, registration data, BИН, and legal address.
4. User-approved decisions in this conversation override inferred presentation choices.

Do not carry over non-ecology catalog items from Satu, including Sunny day and Cafe Safina.

## Business Identity

Primary brand name:

- RU: `Центр экологического мониторинга`
- KZ: `Экологиялық мониторинг орталығы`
- Legal form in text: `ТОО "Центр экологического мониторинга"`

Legal and contact data:

- BИН: `250140022679`
- Location: Kazakhstan, Almaty
- Legal address: `г. Алматы, Бостандыкский район, ул. Жарокова, дом 219, кв. 19`
- Primary phone and WhatsApp: `+7 (707) 792-44-45`
- Public email: do not show
- Working hours: Monday-Friday 10:00-18:00, Saturday-Sunday closed
- Geography: all Kazakhstan, with office presence in Almaty

Trust language:

- The TОО is registered in 2025.
- Expert experience in environmental design and regulation may be described as starting in 2010.
- Do not state that the TОО itself has operated since 2010.
- It is allowed to mention practical experience with objects and clients from the legacy Satu text, including AО "Гелиос", ТОО "Шин-Лайн", ТД "Форум", laboratories, service stations, trading centers, offices, and construction projects.

## Audience And Tone

Primary audience:

- Legal entities in Kazakhstan that need environmental documentation, reporting, permits, consulting, and support with regulatory obligations.

Tone:

- Businesslike, clear, and human.
- Explain complex environmental services without overwhelming jargon.
- Use official terms where they matter, then add short plain-language explanations.
- Avoid exaggerated environmental claims and vague "eco-friendly" marketing.

## Information Architecture

Pages:

- `/` - RU landing page
- `/services` - RU full services catalog
- `/kz` - KZ landing page
- `/kz/services` - KZ full services catalog

Primary navigation:

- Services: `Услуги` / `Қызметтер`
- Prices: `Цены` / `Бағалар`
- Process: `Как работаем` / `Жұмыс тәртібі`
- About: `О компании` / `Компания туралы`
- FAQ: `FAQ` / `Сұрақ-жауап`
- Contacts: `Контакты` / `Байланыс`
- Language switcher: `RU / KZ`
- Primary CTA: `WhatsApp`

Mobile navigation:

- Compact menu with the same destinations.
- Primary WhatsApp action must remain easy to reach.
- All touch targets must be at least 44px high/wide.

## Landing Page Content

### Hero

Purpose: make it obvious what the company does and how to contact it.

RU direction:

- H1: `Экологическая документация и сопровождение для бизнеса по Казахстану`
- Supporting text: TОО "Центр экологического мониторинга" prepares environmental projects, reports, permits, and consulting support for legal entities.
- Primary CTA: `Написать в WhatsApp`
- Secondary CTA: `Смотреть услуги`

KZ direction:

- H1: `Қазақстан бойынша бизнеске арналған экологиялық құжаттама және сүйемелдеу`
- Supporting text: `ТОО "Центр экологического мониторинга" заңды тұлғаларға экологиялық жобалар, есептілік, рұқсат құжаттары және консультациялық сүйемелдеу дайындайды.`
- Primary CTA: `WhatsApp-қа жазу`
- Secondary CTA: `Қызметтерді көру`

Trust chips near hero:

- `БИН 250140022679`
- `Алматы`
- `По всему Казахстану`
- `Опыт с 2010 года`
- `Пн-Пт 10:00-18:00`

### Key Service Directions

Show five direction cards:

- Project documentation: ПДВ/НДВ, СЗЗ, ОВОС, ООВВ, РООС
- Waste management: ПУО, waste inventory, hazardous waste passport
- Water use and water protection: ВЗиП, УН, РСВ, ПДС/НДС
- Environmental reporting: 2-ТП air, 2-ТП water, 4-ОС, production ecological control reports
- Consulting and support: initial assessment, source data review, document preparation, handoff and support

### Popular Services And Prices

Show a compact pricing preview on the landing page with a link to `/services`.

Include:

- Программа природоохранных мероприятий (ППМ) - from 25 000 ₸
- Программа управления отходами (ПУО) - from 30 000 ₸
- Паспорт опасных отходов - from 40 000 ₸
- Программа производственного экологического контроля (ППЭК) - from 45 000 ₸
- ПДС / НДС - from 80 000 ₸
- ПДВ / НДВ or environmental projects - from 100 000 ₸

Use "от" in RU and "бастап" in KZ for known starting prices.

### Process

Steps:

1. Request in WhatsApp or by phone
2. Initial consultation and task clarification
3. Object/source data review
4. Documentation preparation
5. Result handoff and support

KZ steps:

1. WhatsApp немесе телефон арқылы өтінім
2. Бастапқы консультация және міндетті нақтылау
3. Нысан мен бастапқы деректерді талдау
4. Құжаттаманы дайындау
5. Нәтижені тапсыру және сүйемелдеу

### About / Trust

Communicate:

- TОО identity and legal registration.
- Expert experience in environmental design and regulation since 2010.
- Work with different object types: petroleum-related sites, trading centers, service stations, construction projects, laboratories, offices.
- Mention selected legacy client examples carefully as experience references.

Avoid unverifiable claims such as "guaranteed approval" or "best in Kazakhstan".

### FAQ

Include 6-7 entries:

- How do I know which environmental document I need?
- What affects the price?
- Do you work outside Almaty?
- What source data is needed?
- How long does preparation take?
- Can I consult before ordering?
- What if the service is not listed with a price?

### Contacts

Show:

- Phone/WhatsApp: `+7 (707) 792-44-45`
- Address: `г. Алматы, Бостандыкский район, ул. Жарокова, дом 219, кв. 19`
- Working hours: `Пн-Пт 10:00-18:00`
- Geography: `Работаем по Казахстану`

Do not show legacy Satu address `Сейфулина 597` as the current address.

## Services Page

Purpose: full catalog from the DOCX with prices where available.

Layout:

- Page intro with short explanation and WhatsApp CTA.
- Category groups.
- Desktop: clear table/list with service name, description, category, price, CTA.
- Mobile: stacked service cards.
- Sticky or repeated CTA after major groups.

Categories:

- Проектная документация
- Отходы
- Водопользование и водоохранные зоны
- Отчетность и контроль
- Сопровождение и консультации

Service source and pricing:

| RU service | KZ service | Price |
| --- | --- | --- |
| Разработка проекта предельно-допустимых выбросов (ПДВ) | Шекті жол берілетін шығарындылар жобасын әзірлеу (ПДВ) | from 100 000 ₸ |
| Разработка программы управления отходами (ПУО) | Қалдықтарды басқару бағдарламасын әзірлеу (ПУО) | from 30 000 ₸ |
| Разработка проекта санитарно-защитных зон (СЗЗ) | Санитариялық-қорғау аймақтары жобасын әзірлеу (СҚА) | Стоимость по запросу |
| Разработка оценки воздействия на окружающую среду (ОВОС) | Қоршаған ортаға әсерді бағалауды әзірлеу (ОВОС) | from 100 000 ₸ |
| Разработка проекта оценки о возможном воздействии (ООВВ) | Ықтимал әсер туралы бағалау жобасын әзірлеу (ООВВ) | Стоимость по запросу |
| Разработка проекта водоохранных зон и полос (ВЗиП) | Су қорғау аймақтары мен белдеулері жобасын әзірлеу | Стоимость по запросу |
| Разработка разделов охраны окружающей среды (РООС) | Қоршаған ортаны қорғау бөлімдерін әзірлеу (РООС) | Стоимость по запросу |
| Согласование удельных норм водопотребления и водоотведения (УН) | Су тұтыну және су бұрудың үлестік нормаларын келісу | Стоимость по запросу |
| Разрешение на специальное водопользование (РСВ) | Арнайы су пайдалану рұқсатын рәсімдеу | Стоимость по запросу |
| Отчет по результатам производственного экологического контроля | Өндірістік экологиялық бақылау нәтижелері бойынша есеп | from 45 000 ₸ |
| Отчет по инвентаризации отходов | Қалдықтарды түгендеу бойынша есеп | Стоимость по запросу |
| Отчет 2-ТП (воздух) | 2-ТП есебі (ауа) | from 100 000 ₸ when bundled as ecological projects |
| Отчет 2-ТП (водхоз) | 2-ТП есебі (су шаруашылығы) | Стоимость по запросу |
| Отчет о выполнении плана мероприятий по охране окружающей среды | Қоршаған ортаны қорғау іс-шаралары жоспарының орындалуы туралы есеп | Стоимость по запросу |
| Отчёт в Регистр выбросов и переноса загрязнителей | Ластағыштардың шығарындылары мен тасымалдары тіркеліміне есеп | Стоимость по запросу |
| Отчет 4-ОС | 4-ОС есебі | Стоимость по запросу |

Additional Satu-priced services may appear as supporting popular items only when they fit the DOCX service universe:

- `ПДС / НДС` - from 80 000 ₸
- `Паспорт опасных отходов` - from 40 000 ₸
- `Программа природоохранных мероприятий (ППМ)` - from 25 000 ₸

If there is any uncertainty in mapping a Satu price to a DOCX service, prefer "Стоимость по запросу".

## Visual System

Style:

- Professional environmental consulting.
- Blend `Organic Biophilic`, `Trust & Authority`, and `Minimal & Direct`.
- Clean, calm, and official.
- Avoid generic eco-stock clutter and decorative excess.

Typography:

- Use T-Bank / TinkoffSans files already copied to `public/fonts/tbank`.
- Use Regular, Medium, and Bold.
- `font-display: swap`.
- Body: 16-18px, line-height 1.5-1.65.
- No negative letter spacing.
- Prices and registration numbers should use stable figure rendering where possible.

Color tokens:

- Primary: `#059669`
- On primary: `#FFFFFF`
- Foreground dark green: `#064E3B`
- Foreground graphite: `#0F172A`
- Background: `#ECFDF5`
- Surface: `#FFFFFF`
- Muted: `#E8F1F3`
- Border: `#A7F3D0`
- Destructive: `#DC2626`
- Accent: a restrained warm amber/sand marker only for small trust highlights

Components:

- Header with text wordmark.
- Buttons: primary WhatsApp CTA, secondary outline CTA.
- Service cards with radius no more than 8px.
- Tables/lists with strong scanability.
- FAQ accordion.
- Contact panel.
- Language switcher.
- Mobile menu.

Visual rules:

- Do not put cards inside cards.
- Do not style full page sections as floating cards.
- Do not use decorative gradient orbs, bokeh blobs, or emoji icons.
- Use one consistent SVG icon style, preferably Lucide if icons are added.
- Keep hover/press transitions 150-300ms.
- Respect `prefers-reduced-motion`.

## SEO And Crawler Files

Every public page must include:

- Unique `title`
- Unique `description`
- Canonical URL
- `hreflang` alternates for RU/KZ
- OpenGraph title and description
- JSON-LD `Organization` or `LocalBusiness`

Recommended metadata:

- `/` title: `Экологическая документация в Казахстане | Центр экологического мониторинга`
- `/` description: `Разработка экологических проектов, отчетности и разрешений для бизнеса по Казахстану. ТОО в Алматы, опыт с 2010 года, консультация в WhatsApp.`
- `/services` title: `Экологические услуги и цены | ПДВ, ПУО, ОВОС, отчеты`
- `/services` description: `Каталог экологических услуг: ПДВ, ПУО, СЗЗ, ОВОС, ООВВ, РООС, РСВ, отчеты 2-ТП и 4-ОС. Цены от 25 000 ₸ и стоимость по запросу.`

Add static crawler files:

- `/sitemap.xml`
- `/robots.txt`
- `/llms.txt`
- `/llm.txt`

`sitemap.xml` requirements:

- Include `/`, `/services`, `/kz`, `/kz/services`.
- Use absolute URLs based on the production site origin configured for deployment.
- Include `lastmod`.
- Include alternate language links for RU and KZ pages.

`robots.txt` requirements:

- Allow all crawlers.
- Include one `Sitemap:` directive with an absolute sitemap URL.
- Derive that absolute sitemap URL from one centralized site URL configuration used by canonical links and sitemap generation.
- During local development, the configured local origin may be used; production builds must use the deployed public origin.

`llms.txt` requirements:

- Briefly describe the company, geography, services, prices, contact method, and main URLs.
- Use concise Markdown.
- Include both RU and KZ summary sections.

`llm.txt` requirements:

- For static hosting, duplicate the essential content from `llms.txt`.
- If deployment supports redirects, redirect `/llm.txt` to `/llms.txt`.

## Technical Architecture

Astro should remain the main rendering layer:

- Prefer static `.astro` components and data files.
- Use React islands only for genuinely interactive UI such as mobile menu or FAQ if needed.
- Avoid hydrating the whole page.
- Use responsive image patterns if local images are added.

Suggested structure:

- `src/data/company.ts`
- `src/data/services.ts`
- `src/data/faq.ts`
- `src/i18n/ru.ts`
- `src/i18n/kz.ts`
- `src/layouts/BaseLayout.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/ServiceCard.astro`
- `src/components/Faq.astro`
- `src/pages/index.astro`
- `src/pages/services.astro`
- `src/pages/kz/index.astro`
- `src/pages/kz/services.astro`

Data should be centralized so RU and KZ pages share the same service pricing and company facts.

## Accessibility And UX Requirements

- Normal text contrast must meet WCAG AA 4.5:1.
- Large text and icon contrast must remain readable.
- All interactive targets at least 44px.
- Keyboard focus visible.
- Header nav and mobile menu keyboard accessible.
- FAQ usable without a mouse.
- Text must wrap cleanly on mobile.
- No horizontal scroll at 375px.
- Button text must not overflow in RU or KZ.
- Do not rely on color alone for meaning.
- Use semantic HTML headings in order.

## Performance Requirements

- `npm run build` should pass.
- Keep JS minimal.
- Use `font-display: swap`.
- Preload only the most critical font file if needed.
- Lazy-load below-fold images if images are added.
- Avoid continuous decorative animations.
- Reserve stable dimensions for fixed-format elements.

## Verification Checklist

- Build succeeds.
- Pages open: `/`, `/services`, `/kz`, `/kz/services`.
- `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llm.txt` open.
- All pages have non-empty unique titles and descriptions.
- Canonical and `hreflang` links are present.
- WhatsApp and `tel:` links target `+7 (707) 792-44-45`.
- Known prices match Satu-derived values.
- DOCX services without mapped prices show "Стоимость по запросу" / KZ equivalent.
- Current address is Жарокова 219, not legacy Сейфулина 597.
- Sunny day and Cafe Safina do not appear.
- Responsive checks pass at 375px, 768px, 1024px, and 1440px.
- No horizontal scroll.
- Visible keyboard focus.
- Reduced motion preference respected.
- No emoji icons, decorative gradient orbs, or nested cards.

## Non-Goals

- No online ordering/cart.
- No payment flow.
- No user account.
- No CMS integration.
- No public email CTA.
- No final logo design beyond the text wordmark.
