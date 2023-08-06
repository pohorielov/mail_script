const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

(async () => {
  // Запуск браузера
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: false,
  });

  const page = await browser.newPage();
  // Замінюємо значення navigator для обходу перевірки на автоматизацію браузера
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });
  });
  await page.goto("https://mail.google.com");

  // Авторизація на сайті Google. Замініть YOUR_EMAIL та YOUR_PASSWORD на ваші облікові дані.
  await page.waitForTimeout(1000);
  await page.waitForSelector('input[type="email"]');
  await page.focus('input[type="email"]');
  await page.keyboard.type("YOUR_EMAIL", { delay: 50 });
  await page.waitForTimeout(1000);
  await page.click("#identifierNext");
  await page.waitForTimeout(3000);
  await page.waitForSelector('input[type="password"]');
  await page.focus('input[type="password"]');
  await page.keyboard.type("YOUR_PASSWORD", { delay: 50 });
  await page.waitForTimeout(1000);
  await page.click("#passwordNext");
  await page.waitForNavigation();

  // Отримання кількості вхідних повідомлень
  const inbox = await page.waitForSelector(".aio .bsU");
  const inboxValue = await inbox.evaluate((element) => element.textContent);

  console.log("Кількість вхідних повідомлень:", inboxValue);

  // Закриття браузера
  await browser.close();
})();
