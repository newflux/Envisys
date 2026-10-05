const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const http = require('http');

async function waitForServer(url) {
  return new Promise((resolve) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode === 200) resolve();
        else setTimeout(check, 500);
      }).on('error', () => setTimeout(check, 500));
    };
    check();
  });
}

async function measure() {
  console.log("Building project...");
  const build = spawn('npx', ['vite', 'build'], { stdio: 'inherit', shell: true });
  await new Promise(r => build.on('close', r));

  console.log("Starting preview server...");
  const preview = spawn('npm', ['run', 'preview'], { shell: true });
  
  await waitForServer('http://localhost:4173');
  console.log("Server ready. Launching puppeteer...");

  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=gl'] });
  const page = await browser.newPage();
  
  // Set a realistic desktop viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

  console.log("Measuring FPS over 10 seconds of scrolling...");
  const metrics = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const deltas = [];
      let lastTime = performance.now();
      let frames = 0;
      let isMeasuring = true;

      const loop = (time) => {
        if (!isMeasuring) return;
        const delta = time - lastTime;
        if (delta > 0 && frames > 5) { // Skip first 5 frames warmup
          deltas.push(delta);
        }
        lastTime = time;
        frames++;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);

      // Simulate a 10 second scroll
      const duration = 10000;
      const startScroll = performance.now();
      
      const scrollLoop = (time) => {
        const elapsed = time - startScroll;
        const progress = Math.min(elapsed / duration, 1);
        
        // Scroll down proportionally
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, progress * maxScroll);

        if (progress < 1) {
          requestAnimationFrame(scrollLoop);
        } else {
          isMeasuring = false;
          // Calculate metrics
          const fpsArray = deltas.map(d => 1000 / d);
          fpsArray.sort((a, b) => a - b);
          
          const avgFps = fpsArray.reduce((a, b) => a + b, 0) / fpsArray.length;
          
          const onePercentIndex = Math.max(0, Math.floor(fpsArray.length * 0.01) - 1);
          const onePercentLow = fpsArray[onePercentIndex];

          resolve({ avg: avgFps, low1: onePercentLow, totalFrames: fpsArray.length });
        }
      };
      requestAnimationFrame(scrollLoop);
    });
  });

  console.log(`Average FPS: ${metrics.avg.toFixed(2)}`);
  console.log(`1% Low FPS: ${metrics.low1.toFixed(2)}`);
  
  await browser.close();
  preview.kill();
  process.exit(0);
}

measure().catch(console.error);
