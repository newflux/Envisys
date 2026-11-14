const puppeteer=require('puppeteer');(async()=>{const b=await puppeteer.launch({headless:'new',args:['--use-angle=d3d11','--enable-gpu','--force_high_performance_gpu']});const pg=await b.newPage();await pg.setViewport({width:1440,height:800});
await pg.goto(process.argv[2],{waitUntil:'load'});await new Promise(r=>setTimeout(r,16000));
const r=await pg.evaluate(()=>performance.getEntriesByType('resource').filter(e=>/glb|draco|\.woff|assets\/.*\.js|smoke|hdr|\.mp4|\.webp|\.jpg/.test(e.name)).map(e=>[Math.round(e.startTime),Math.round(e.responseEnd),Math.round(e.transferSize/1024),e.name.split('/').slice(3).join('/')]).sort((a,b)=>a[0]-b[0]));
r.forEach(x=>console.log(String(x[0]).padStart(6),String(x[1]).padStart(6),String(x[2]).padStart(5)+'KB',x[3]));await b.close()})()
