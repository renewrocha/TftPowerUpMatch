const puppeteer = require('puppeteer');
const fs = require('fs');

const lang = process.argv[2] || 'pt';
const URL = 'https://www.metatft.com/powerups';

(async () => {
  const browser = await puppeteer.launch({
  args: ['--no-sandbox'],
  headless: 'new'
});
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: 'networkidle2' });
  await page.waitForSelector(".TierListRow", { timeout: 10000 });

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
    await page.waitForSelector(".TierListRow", { timeout: 10000 });
  }

  const data = await page.evaluate(() => {
    const rows = document.querySelectorAll(".TierListRow");
    const result = [];

    rows.forEach(row => {
      const tierTitle = row.querySelector(".TierListTierTitle")?.textContent.trim();
      const items = row.querySelectorAll(".TeamBuilderUnitLabel");

      items.forEach(item => {
        const name = item.textContent.trim();
        if (name) result.push({ nome: name, tier: tierTitle });
      });
    });

    return result;
  });

  fs.writeFileSync(`tft_powerup_ranking_${lang}.json`, JSON.stringify(data, null, 2));
  console.log(`✅ Arquivo gerado: tft_powerup_ranking_${lang}.json`);
  await browser.close();
})();

