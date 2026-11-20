// node tools/secmap.cjs path -> top/bottom of every section on the page (scroll px)
const p = require('puppeteer')
;(async () => {
  const b = await p.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu'] })
  const g = await b.newPage(); await g.setViewport({ width: 1440, height: 900 })
  await g.goto('http://localhost:4173' + process.argv[2], { waitUntil: 'load' }); await new Promise((r) => setTimeout(r, 4000))
  console.log((await g.evaluate(() => { const sc = document.querySelector('#scroller').scrollTop; return [...document.querySelectorAll('section, .ps-cover > *')].map((e) => { const r = e.getBoundingClientRect(); return `${String(Math.round(r.top + sc)).padStart(6)}-${String(Math.round(r.bottom + sc)).padEnd(6)} ${e.tagName.toLowerCase()}#${e.id}.${[...e.classList].join('.')}` }) })).join('\n'))
  await b.close()
})()
