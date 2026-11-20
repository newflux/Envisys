// node tools/wheeltrace.cjs path -> wheel-scroll with a Chrome trace; prints the longest events on every thread (what fills the stalls)
const p = require('puppeteer'), fs = require('fs')
;(async () => {
  const b = await p.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--force_high_performance_gpu'] })
  const g = await b.newPage(); await g.setViewport({ width: 1440, height: 900 })
  await g.goto('http://localhost:4173' + process.argv[2], { waitUntil: 'load' }); await new Promise((r) => setTimeout(r, 5000))
  await g.mouse.move(720, 450)
  await g.tracing.start({ path: 'trace.json', categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'blink', 'cc', 'gpu', 'v8', 'loading', 'disabled-by-default-devtools.timeline.frame', 'disabled-by-default-cc.debug', 'disabled-by-default-devtools.timeline.layers', 'disabled-by-default-skia', 'disabled-by-default-gpu.service'] })
  for (let i = 0; i < 40; i++) { await g.mouse.wheel({ deltaY: 120 }); await new Promise((r) => setTimeout(r, 70)) }
  await new Promise((r) => setTimeout(r, 1000))
  await g.tracing.stop(); await b.close()
  const ev = JSON.parse(fs.readFileSync('trace.json', 'utf8')).traceEvents
  const tn = {}; ev.filter((e) => e.name === 'thread_name').forEach((e) => (tn[e.pid + ':' + e.tid] = e.args.name))
  const long = ev.filter((e) => e.ph === 'X' && e.dur > 40000 && !/RunTask|Scheduler|GpuChannel|GPUTask|RendererRasterWorker|CommandBuffer|ThreadControllerImpl|ThreadPool/.test(e.name)).sort((a, b) => b.dur - a.dur)
  const seen = new Set()
  for (const e of long) {
    const k = e.name + (tn[e.pid + ':' + e.tid] || '')
    if (seen.has(k)) continue; seen.add(k)
    console.log(String(Math.round(e.dur / 1000)).padStart(5) + 'ms', (tn[e.pid + ':' + e.tid] || e.tid).toString().padEnd(22), e.name, JSON.stringify(e.args?.data || e.args || {}).slice(0, 140))
    if (seen.size > 40) break
  }
  fs.unlinkSync('trace.json')
})()
