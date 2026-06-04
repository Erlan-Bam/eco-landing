import { company } from "../data/company.mjs";
import { content } from "../data/content.mjs";

export const pages = ["home", "services"];

const routes = {
  ru: {
    home: "/",
    services: "/services/"
  },
  kz: {
    home: "/kz/",
    services: "/kz/services/"
  }
};

const alternateLangs = {
  ru: "ru",
  kz: "kk"
};

const countryNames = {
  ru: "Казахстан",
  kz: "Қазақстан"
};

const whatsappMessages = {
  ru: "Здравствуйте! Хочу получить консультацию по экологическим услугам.",
  kz: "Сәлеметсіз бе! Экологиялық қызмет бойынша консультация алғым келеді."
};

const metaKeys = {
  home: {
    title: "homeTitle",
    description: "homeDescription"
  },
  services: {
    title: "servicesTitle",
    description: "servicesDescription"
  }
};

const resolveSiteUrl = () => {
  const envUrl = import.meta.env?.PUBLIC_SITE_URL ?? process.env.PUBLIC_SITE_URL;

  return (envUrl || "http://localhost:4321").replace(/\/+$/, "");
};

const assertLocale = (locale) => {
  if (!routes[locale]) {
    throw new Error(`Unknown locale: ${locale}`);
  }
};

const assertPage = (page) => {
  if (!pages.includes(page)) {
    throw new Error(`Unknown page: ${page}`);
  }
};

export const getSiteUrl = () => resolveSiteUrl();

export const getRoute = (locale, page) => {
  assertLocale(locale);
  assertPage(page);

  return routes[locale][page];
};

export const localizePath = (locale, page) => getRoute(locale, page);

export const canonicalUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${getSiteUrl()}${normalizedPath}`;
};

export const getAlternateLinks = (page) => {
  assertPage(page);

  return Object.keys(routes).map((locale) => ({
    lang: alternateLangs[locale],
    href: canonicalUrl(getRoute(locale, page))
  }));
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat("ru-KZ").format(value).replace(/\s/g, " ");
};

export const formatPrice = (service, locale) => {
  assertLocale(locale);

  const price = service.price ?? service;

  if (price.type === "request") {
    return content[locale].servicesPage.requestPrice;
  }

  if (price.type === "from") {
    const formattedAmount = `${formatNumber(price.amount)} ₸`;

    return locale === "kz"
      ? `${formattedAmount} ${content[locale].servicesPage.fromPrefix}`
      : `${content[locale].servicesPage.fromPrefix} ${formattedAmount}`;
  }

  throw new Error(`Unknown price type: ${price.type}`);
};

export const getPageMeta = (locale, page) => {
  assertLocale(locale);
  assertPage(page);

  const keys = metaKeys[page];

  return {
    title: content[locale].seo[keys.title],
    description: content[locale].seo[keys.description]
  };
};

export const getWhatsAppUrl = (locale) => {
  assertLocale(locale);

  return `${company.primaryPhone.whatsapp}?text=${encodeURIComponent(whatsappMessages[locale])}`;
};

export const getOrganizationJsonLd = (locale) => {
  assertLocale(locale);

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
      addressLocality: "Алматы",
      addressCountry: countryNames[locale]
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: company.scheduleStructured.days,
      opens: company.scheduleStructured.opens,
      closes: company.scheduleStructured.closes
    }
  };
};
