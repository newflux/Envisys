const puppeteer = require('puppeteer');
const fs = require('fs');

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1536, height: 730 });

  console.log('Loading page...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.waitForTimeout(3000); // Wait for initial animations

  console.log('Capturing Hero pose...');
  await page.screenshot({ path: 'hero.png' });

  console.log('Scrolling to Line-up (50%)...');
  // Scroll carefully to trigger lenis and gsap
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight * 0.5, behavior: 'auto' });
  });
  
  await page.waitForTimeout(3000); // Wait for GSAP timeline
  console.log('Capturing Line-up pose...');
  await page.screenshot({ path: 'lineup.png' });

  // Evaluate pixels in browser context
  async function analyze(imagePath, name) {
    const base64 = fs.readFileSync(imagePath, { encoding: 'base64' });
    const result = await page.evaluate(async (b64, name) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const data = ctx.getImageData(0, 0, img.width, img.height).data;

          function getPixel(x, y) {
            const idx = (y * img.width + x) * 4;
            return [data[idx], data[idx+1], data[idx+2]];
          }

          let log = `\n--- Analysis for ${name} ---\n`;
          log += `Top-Left Corner (10, 10) Void: ${getPixel(10, 10)}\n`;
          log += `Top-Left Mid (200, 150) Rect?: ${getPixel(200, 150)}\n`;
          log += `Mid-Left (100, 300) Rect?: ${getPixel(100, 300)}\n`;
          
          let lastColor = getPixel(10, 10);
          for (let x = 10; x < 500; x += 10) {
            const c = getPixel(x, 150);
            if (Math.abs(c[0] - lastColor[0]) > 2) {
              log += `Edge detected at X=${x}, Y=150: old= ${lastColor} new= ${c}\n`;
              break;
            }
            lastColor = c;
          }
          resolve(log);
        };
        img.src = 'data:image/png;base64,' + b64;
      });
    }, base64, name);
    console.log(result);
  }

  await analyze('hero.png', 'Hero');
  await analyze('lineup.png', 'Line-up');
  
  await browser.close();
}

run().catch(console.error);
