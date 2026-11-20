// node tools/fixedels.cjs path -> every fixed/sticky element with its size and classes
const p = require('puppeteer')
;(async () => {
  const b = await p.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu'] })
  const g = await b.newPage(); await g.setViewport({ width: 1440, height: 900 })
  await g.goto('http://localhost:4173' + process.argv[2], { waitUntil: 'load' }); await new Promise((r) => setTimeout(r, 4000))
  console.log((await g.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => /fixed|sticky/.test(getComputedStyle(e).position)).map((e) => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return `${e.tagName.toLowerCase()}.${[...e.classList].join('.')} ${Math.round(r.width)}x${Math.round(r.height)} vis=${cs.visibility} op=${cs.opacity} filt=${cs.filter} bdf=${cs.backdropFilter} mix=${cs.mixBlendMode}` }))).join('\n'))
  await b.close()
})()
