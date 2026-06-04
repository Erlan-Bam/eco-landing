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
