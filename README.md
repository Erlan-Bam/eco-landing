# Центр экологического мониторинга

Bilingual RU/KZ Astro landing site for environmental consulting services in Kazakhstan.

## Routes

- `/` - Russian landing page
- `/services/` - Russian services catalog
- `/kz/` - Kazakh landing page
- `/kz/services/` - Kazakh services catalog
- `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llm.txt` - crawler and AI-reader files

## Local Development

```sh
npm install
npm run dev
```

## Verification

```sh
npm run verify
PUBLIC_SITE_URL=https://your-domain.vercel.app npm run build
PUBLIC_SITE_URL=https://your-domain.vercel.app npm run verify:build
```

Set `PUBLIC_SITE_URL` in production so canonical URLs, Open Graph URLs, sitemap, robots, and crawler files use the deployed domain.
