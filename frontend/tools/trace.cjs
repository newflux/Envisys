// node tools/trace.cjs [port] -> long main-thread tasks in the first ~3 s with what triggered them (timers, script, layout...)
const puppeteer = require('puppeteer')
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--force_high_performance_gpu'] })
  const w = await b.newPage(); await w.goto('about:blank'); await w.evaluate(() => { document.createElement('canvas').getContext('webgl2'); document.createElement('canvas').getContext('2d') }); await w.close()
  const pg = await b.newPage(); await pg.setViewport({ width: 1440, height: 800 })
  await pg.evaluateOnNewDocument(() => { const iv = setInterval(() => { if (window.__preloaderTl) { performance.mark('logoStart'); clearInterval(iv) } }, 5) })
  await pg.tracing.start({ categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'blink.user_timing'] })
  await pg.goto('http://localhost:' + (process.argv[2] || 4174) + '/', { waitUntil: 'domcontentloaded' }); await new Promise(r => setTimeout(r, 3500))
  const buf = await pg.tracing.stop(); const ev = JSON.parse(Buffer.from(buf).toString()).traceEvents
  const mark = ev.find(e => e.name === 'logoStart'); const t0 = mark ? mark.ts : 0
  const main = ev.find(e => e.name === 'thread_name' && e.args?.name === 'CrRendererMain' && e.pid === mark?.pid)
  const tasks = ev.filter(e => e.name === 'RunTask' && e.pid === mark?.pid && e.tid === main?.tid && e.dur > 120000 && e.ts > t0 - 100000 && e.ts < t0 + 2000000).sort((a, b) => a.ts - b.ts)
  for (const t of tasks) {
    const inside = ev.filter(e => e.ts >= t.ts && e.ts <= t.ts + t.dur && e.tid === t.tid && e.dur > 15000 && e.name !== 'RunTask' && e.pid === t.pid)
    const desc = inside.slice(0, 10).map(e => e.name + (e.args?.data?.functionName ? ':' + e.args.data.functionName : '') + (e.args?.data?.url ? '(' + e.args.data.url.split('/').pop() + ':' + e.args.data.lineNumber + ')' : '') + ' ' + Math.round(e.dur / 1000)).join(' > ')
    console.log('logo+' + ((t.ts - t0) / 1e6).toFixed(2) + 's', Math.round(t.dur / 1000) + 'ms', desc)
  }
  await b.close()
})()
