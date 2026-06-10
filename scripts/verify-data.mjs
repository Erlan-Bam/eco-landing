import assert from "node:assert/strict";
import { company } from "../src/data/company.mjs";
import { services, serviceCategories, featuredServiceIds } from "../src/data/services.mjs";
import { content } from "../src/data/content.mjs";

const serviceIds = new Set(services.map((service) => service.id));
const categoryIds = new Set(serviceCategories.map((category) => category.id));
const serializedData = JSON.stringify({ company, services, content });
const getService = (id) => services.find((service) => service.id === id);

const duplicateServiceIds = services
  .map((service) => service.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);

assert.equal(company.legalName.ru, 'ТОО "Центр экологического мониторинга"');
assert.equal(company.brand.ru, "Центр экологического мониторинга");
assert.equal(company.bin, "250140022679");
assert.equal(company.registeredYear, 2025);
assert.equal(company.expertExperienceSince, 2010);
assert.equal(company.primaryPhone.display, "+7 (707) 792-44-45");
assert.equal(company.primaryPhone.tel, "+77077924445");
assert.equal(company.primaryPhone.whatsapp, "https://wa.me/77077924445");
assert.equal(company.emailPublic, false);
assert.match(company.address.ru, /Жарокова/);
assert.doesNotMatch(company.address.ru, /Сейфулина/);
assert.equal(company.geography.ru, "Работаем по всему Казахстану");
assert.equal(company.schedule.ru, "Пн-Пт 10:00-18:00, Сб-Вс выходной");
assert.deepEqual(company.scheduleStructured.days, ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
assert.equal(company.scheduleStructured.opens, "10:00");
assert.equal(company.scheduleStructured.closes, "18:00");
assert.equal(serviceIds.size, services.length, `Duplicate service IDs: ${duplicateServiceIds.join(", ")}`);

for (const forbidden of [
  "Sunny",
  "Safina",
  "Сейфулина",
  "g.kezembayeva@gmail.com",
  "ПДВ",
  "предельно-допустимых выбросов",
  "ПДС",
  "связанные материалы"
]) {
  assert.doesNotMatch(serializedData, new RegExp(forbidden, "i"));
}

assert.doesNotMatch(serializedData, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, "Public email must not appear in site data");

for (const requiredId of [
  "ndv",
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
  "4os-report",
  "nds"
]) {
  assert.ok(serviceIds.has(requiredId), `Missing required DOCX service: ${requiredId}`);
}

assert.equal(getService("ndv").title.ru, "Разработка Проекта нормативов допустимых выбросов (НДВ)");
assert.match(getService("ndv").summary.ru, /нормативов воздействия на окружающую среду/);
assert.equal(getService("szz").title.ru, "Разработка Проекта санитарно-защитной зоны (СЗЗ)");
assert.match(getService("szz").summary.ru, /санитарно-эпидемиологического благополучия населения/);
assert.equal(getService("ovos").title.ru, "Разработка Проекта оценки воздействия на окружающую среду (ОВОС)");
assert.match(getService("ovos").summary.ru, /выявления, анализа и оценки возможного воздействия/);
assert.equal(getService("oovv").title.ru, "Разработка Отчета о возможных воздействиях (ОоВВ)");
assert.match(getService("oovv").summary.ru, /экологических и социальных последствий реализации проекта/);
assert.equal(getService("roos").title.ru, "Разработка Раздела охраны окружающей среды (РООС)");
assert.match(getService("roos").summary.ru, /комплекса природоохранных мероприятий/);
assert.equal(getService("nds").title.ru, "Разработка проекта нормативов допустимых сбросов (НДС)");
assert.match(getService("nds").summary.ru, /сточными водами в водные объекты или системы водоотведения/);
assert.equal(getService("puo").price.amount, 30000);
assert.equal(getService("ppm").price.amount, 25000);
assert.equal(getService("nds").price.amount, 80000);
assert.equal(getService("szz").price.type, "request");
assert.equal(getService("roos").price.type, "request");
assert.equal(featuredServiceIds.length, 6);
assert.equal(serviceCategories.length, 5);

for (const service of services) {
  assert.ok(service.title.ru.length > 5, `Missing RU title for ${service.id}`);
  assert.ok(service.title.kz.length > 5, `Missing KZ title for ${service.id}`);
  assert.ok(service.summary.ru.length > 20, `Missing RU summary for ${service.id}`);
  assert.ok(service.summary.kz.length > 20, `Missing KZ summary for ${service.id}`);
  assert.ok(categoryIds.has(service.categoryId), `Unknown category for ${service.id}`);
  assert.ok(["from", "request"].includes(service.price.type), `Unknown price type for ${service.id}`);
  if (service.price.type === "from") {
    assert.equal(service.price.currency, "KZT", `Unknown price currency for ${service.id}`);
    assert.ok(Number.isInteger(service.price.amount), `Invalid price amount for ${service.id}`);
    assert.ok(service.price.amount > 0, `Invalid price amount for ${service.id}`);
  }
}

for (const featuredId of featuredServiceIds) {
  assert.ok(serviceIds.has(featuredId), `Unknown featured service ID: ${featuredId}`);
}

for (const locale of ["ru", "kz"]) {
  assert.ok(content[locale].home.hero.title.length > 20);
  assert.equal(content[locale].home.directions.length, 5);
  assert.equal(content[locale].home.process.length, 5);
  assert.ok(content[locale].faq.length >= 6);
}

console.log("verify:data PASS");
