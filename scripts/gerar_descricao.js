const puppeteer = require('puppeteer');
const fs = require('fs');

const lang = process.argv[2] || 'pt';
const URL = 'https://www.metatft.com/tables/powerups';

(async () => {
  const browser = await puppeteer.launch({
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
    const frutas = [];
    const coletadas = new Set();

    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      unit.scrollIntoView({ behavior: "instant", block: "center" });
      unit.click();
      await delay(200);

      const blocos = [...document.querySelectorAll(".NewSetPowerupContainer")];
      for (const bloco of blocos) {
        const nome = bloco.querySelector(".NewSetEncounterTitle")?.textContent.trim();
        const desc = bloco.querySelector(".NewSetEncounterDesc")?.innerText.trim();
        if (nome && desc && !coletadas.has(nome)) {
          frutas.push({ nome, descricao: desc });
          coletadas.add(nome);
        }
      }

      await delay(100);
    }

    return frutas;
  });

  fs.writeFileSync(`tft_powerup_desc_${lang}.json`, JSON.stringify(data, null, 2));
  console.log(`✅ Arquivo gerado: tft_powerup_desc_${lang}.json`);
  await browser.close();
})();

