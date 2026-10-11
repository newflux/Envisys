import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('http://127.0.0.1:4173');
  await new Promise(r => setTimeout(r, 6000)); // wait for scene to load
  
  // Take screenshot for visual verification
  await page.screenshot({ path: 'verify_visual.png' });
  
  // Create function to measure FPS via requestAnimationFrame
  async function measureFPS(durationMs) {
    return await page.evaluate(async (ms) => {
      return new Promise(resolve => {
        let frames = 0;
        let lastTime = performance.now();
        const start = lastTime;
        const frameTimes = [];
        
        function tick(now) {
          frames++;
          frameTimes.push(now - lastTime);
          lastTime = now;
          if (now - start < ms) {
             requestAnimationFrame(tick);
             // simulate scrolling to keep it active
             window.scrollBy(0, 10);
          } else {
             frameTimes.sort((a,b) => b - a); // descending order
             const low1PercentCount = Math.max(1, Math.floor(frameTimes.length * 0.01));
             const low1PercentTimes = frameTimes.slice(0, low1PercentCount);
             const avgLow1PercentTime = low1PercentTimes.reduce((a,b)=>a+b, 0) / low1PercentCount;
             const low1PercentFPS = 1000 / avgLow1PercentTime;
             
             resolve({ fps: (frames * 1000) / ms, low1: low1PercentFPS });
          }
        }
        requestAnimationFrame(tick);
      });
    }, durationMs);
  }

  // Normal speed
  console.log('Measuring Normal Speed...');
  const normalStats = await measureFPS(3000);
  console.log(`[NORMAL] FPS: ${normalStats.fps.toFixed(1)}, 1% Low: ${normalStats.low1.toFixed(1)}`);
  
  // Throttled 4x
  console.log('Measuring Throttled 4x CPU...');
  const client = await page.target().createCDPSession();
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  
  const throttledStats = await measureFPS(3000);
  console.log(`[THROTTLED 4x] FPS: ${throttledStats.fps.toFixed(1)}, 1% Low: ${throttledStats.low1.toFixed(1)}`);
  
  await browser.close();
})();
