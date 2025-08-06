const puppeteer = require('puppeteer');
const fs = require('fs');

const lang = process.argv[2] || 'pt';
const URL = 'https://www.metatft.com/tables/powerups';

(async () => {const browser = await puppeteer.launch({
  args: ['--no-sandbox'],
  headless: 'new'
});
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: 'networkidle2' });
  await page.waitForSelector(".PowerupUnitItem", { timeout: 10000 });

  if (lang === 'pt') {
    await page.evaluate(() => {
      localStorage.setItem('language', 'pt_br');
      sessionStorage.setItem('i18nextLng', 'pt_br');
      const event = new CustomEvent('languageChanged', {
        detail: { language: 'pt_br' }
      });
      window.dispatchEvent(event);
      if (window.un && window.un.fetchLookups) {
        window.un.fetchLookups({ value: 'pt_br' });
      }
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await page.waitForSelector(".PowerupUnitItem", { timeout: 10000 });
  }

  const data = await page.evaluate(async () => {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const units = [...document.querySelectorAll(".PowerupUnitItem")];
    const results = [];

    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      const nameBase = unit.querySelector(".PowerupUnitLabel")?.textContent.trim();
      const isHero = unit.classList.contains("hero-variant");
      const name = isHero ? `${nameBase} [H]` : nameBase;

      unit.scrollIntoView({ behavior: "instant", block: "center" });
      unit.click();
      await delay(200);

      let powerups = [];
      for (let retry = 0; retry < 6; retry++) {
        await delay(100);
        powerups = [...document.querySelectorAll(".NewSetEncounterTitle")]
          .map(el => el.textContent.trim())
          .filter(Boolean);
        if (powerups.length > 0) break;
      }

      results.push({ champion: name, powerups });
      await delay(50);
    }

    return results;
  });

  fs.writeFileSync(`tft_powerups_${lang}.json`, JSON.stringify(data, null, 2));
  console.log(`✅ Arquivo gerado: tft_powerups_${lang}.json`);
  await browser.close();
})();

