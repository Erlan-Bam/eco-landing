import assert from "node:assert/strict";
import { company } from "../src/data/company.mjs";
import { content } from "../src/data/content.mjs";
import { services } from "../src/data/services.mjs";
import {
  canonicalUrl,
  formatPrice,
  getAlternateLinks,
  getOrganizationJsonLd,
  getPageMeta,
  getRoute,
  getSiteUrl,
  getWhatsAppUrl,
  localizePath,
  pages
} from "../src/utils/site.mjs";

const puo = services.find((service) => service.id === "puo");
const szz = services.find((service) => service.id === "szz");

assert.equal(getSiteUrl(), "http://localhost:4321");
assert.deepEqual(pages, ["home", "services"]);

assert.equal(getRoute("ru", "home"), "/");
assert.equal(getRoute("kz", "home"), "/kz/");
assert.equal(getRoute("ru", "services"), "/services/");
assert.equal(getRoute("kz", "services"), "/kz/services/");
assert.equal(localizePath("kz", "services"), "/kz/services/");

assert.equal(canonicalUrl("/services/"), "http://localhost:4321/services/");
assert.deepEqual(getAlternateLinks("services"), [
  { lang: "ru", href: "http://localhost:4321/services/" },
  { lang: "kk", href: "http://localhost:4321/kz/services/" }
]);

assert.equal(formatPrice(puo, "ru"), "от 30 000 ₸");
assert.equal(formatPrice(puo, "kz"), "30 000 ₸ бастап");
assert.equal(formatPrice(szz, "ru"), "Стоимость по запросу");
assert.equal(formatPrice(szz, "kz"), "Құны сұраныс бойынша");

assert.deepEqual(getPageMeta("ru", "home"), {
  title: content.ru.seo.homeTitle,
  description: content.ru.seo.homeDescription
});
assert.deepEqual(getPageMeta("kz", "services"), {
  title: content.kz.seo.servicesTitle,
  description: content.kz.seo.servicesDescription
});

const whatsappRu = getWhatsAppUrl("ru");
const whatsappKz = getWhatsAppUrl("kz");

assert.ok(whatsappRu.startsWith("https://wa.me/77077924445?text="));
assert.ok(whatsappRu.includes(encodeURIComponent("Здравствуйте! Хочу получить консультацию по экологическим услугам.")));
assert.ok(whatsappKz.includes(encodeURIComponent("Сәлеметсіз бе! Экологиялық қызмет бойынша консультация алғым келеді.")));

const jsonLdRu = getOrganizationJsonLd("ru");
const jsonLdKz = getOrganizationJsonLd("kz");

assert.equal(jsonLdRu["@context"], "https://schema.org");
assert.equal(jsonLdRu["@type"], "LocalBusiness");
assert.equal(jsonLdRu.name, company.legalName.ru);
assert.equal(jsonLdRu.alternateName, company.brand.ru);
assert.equal(jsonLdRu.url, "http://localhost:4321");
assert.equal(jsonLdRu.telephone, company.primaryPhone.display);
assert.equal(jsonLdRu.areaServed, "KZ");
assert.deepEqual(jsonLdRu.address, {
  "@type": "PostalAddress",
  streetAddress: company.address.ru,
  addressLocality: "Алматы",
  addressCountry: "Казахстан"
});
assert.deepEqual(jsonLdRu.openingHoursSpecification, {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: company.scheduleStructured.days,
  opens: company.scheduleStructured.opens,
  closes: company.scheduleStructured.closes
});
assert.equal(jsonLdKz.address.addressCountry, "Қазақстан");

console.log("verify:helpers PASS");
