const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.waitForTimeout(3000);

  const meshes = await page.evaluate(() => {
    const threeCanvas = document.querySelector('canvas');
    // We can't access THREE.Scene easily unless it's exposed.
    // Let's assume we can't easily query the scene. We know from App.vue what's there.
    return "check code";
  });
  console.log(meshes);
  await browser.close();
}

run().catch(console.error);
