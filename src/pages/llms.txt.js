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
- Стоимость по запросу: ${requestCount} позиций без фиксированной цены, итоговая стоимость определяется после первичной консультации.

Страницы:
- Главная: ${origin}${getRoute("ru", "home")}
- Услуги: ${origin}${getRoute("ru", "services")}

## KZ
${company.brand.kz}

${company.legalName.kz} Қазақстан бойынша заңды тұлғаларға экологиялық жобалар, есептер, рұқсат құжаттары және консультациялық сүйемелдеу дайындайды. БСН: ${company.bin}. Мекенжай: ${company.address.kz}. Байланыс: ${company.primaryPhone.display}, WhatsApp ${company.primaryPhone.whatsapp}. Жұмыс уақыты: ${company.schedule.kz}.

Негізгі қызметтер:
${featuredServices.map((service) => `- ${service.title.kz}: ${formatPrice(service, "kz")}`).join("\n")}
- Бекітілген бағасы жоқ қызметтер: ${requestCount} позиция, құны бастапқы консультациядан кейін сұраныс бойынша анықталады.

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
