const p=require('puppeteer');(async()=>{const b=await p.launch({headless:'new',args:['--use-angle=d3d11','--enable-gpu','--ignore-gpu-blocklist','--force_high_performance_gpu']});const g=await b.newPage();await g.setViewport({width:1440,height:800});
await g.goto(process.argv[3]||'http://localhost:4173/',{waitUntil:'load'});const t0=Date.now();
for(const t of (process.env.TS).split(',').map(Number)){await new Promise(r=>setTimeout(r,Math.max(0,t*1000-(Date.now()-t0))));await g.screenshot({path:process.argv[2]+'/q'+t+'.png'})}await b.close()})()
