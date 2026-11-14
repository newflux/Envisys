const puppeteer=require('puppeteer');(async()=>{const b=await puppeteer.launch({headless:'new',args:['--use-angle=d3d11','--enable-gpu','--force_high_performance_gpu']});const out=process.argv[2];
const pg=await b.newPage();await pg.setViewport({width:1440,height:800});
await pg.goto('https://envisys.vercel.app/verticals',{waitUntil:'load'});await new Promise(r=>setTimeout(r,5000));
for(const [i,y] of [[0,0],[1,500],[2,1200],[3,2400],[4,3600],[5,4800]]){await pg.evaluate(y=>{const L=window.lenisInstance;L.scrollTo(y,{immediate:true})},y);await new Promise(r=>setTimeout(r,1300));await pg.screenshot({path:`${out}/v${i}.png`})}
await pg.hover('text/THE COMPANY').catch(()=>{});await new Promise(r=>setTimeout(r,900));await pg.screenshot({path:`${out}/company.png`});
const p2=await b.newPage();await p2.setViewport({width:1440,height:800});await p2.goto('https://envisys.vercel.app/products',{waitUntil:'load'});await new Promise(r=>setTimeout(r,9000));await p2.screenshot({path:`${out}/prod0.png`});await b.close()})()
