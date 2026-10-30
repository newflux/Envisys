// The landing page's smoke wave (same shader and curve as the preloader and the testimonials), for a canvas of its own.
// flip: the smoke hangs from the top edge instead, so it leaves upward when p falls.
// draw(p, lean): p 0 → fully light, 1 → fully black, rising from the bottom edge; lean (-0.5..0.5) tilts the crest toward the cursor.
export function createSmoke(canvas: HTMLCanvasElement, flip = false, plain = false) {
  // plain: no WebGL at all, a black veil that fades with the same progress (for phones)
  const gl = plain ? null : canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
  let last = ''
  if (!gl) {
    // no WebGL: a plain black veil that fades in with the same progress
    canvas.style.background = '#000'
    return { draw: (p: number) => { canvas.style.opacity = p.toFixed(3) } }
  }
  const vs = 'attribute vec2 position; void main(){ gl_Position = vec4(position, 0.0, 1.0); }'
  const fs = `precision mediump float;
    uniform vec2 uRes;
    uniform float uAmplitude, uOffsetY, uShift, uFlip;
    void main() {
      vec2 uv = gl_FragCoord.xy / uRes;
      float scaledY = 0.5 + (mix(uv.y, 1.0 - uv.y, uFlip) - 0.5) * 1.3;
      float wave = sin((uv.x + uShift) * -0.5 * 3.14159265 * 2.0) * uAmplitude;
      float dist = 0.5 + wave + uOffsetY - scaledY;
      gl_FragColor = vec4(0.0, 0.0, 0.0, smoothstep(-1.0, 1.5, dist));
    }`
  const sh = (type: number, src: string) => { const o = gl.createShader(type)!; gl.shaderSource(o, src); gl.compileShader(o); return o }
  const prog = gl.createProgram()!
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs))
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs))
  gl.linkProgram(prog)
  gl.useProgram(prog)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
  const a = gl.getAttribLocation(prog, 'position')
  gl.enableVertexAttribArray(a)
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0)
  const u = (n: string) => gl.getUniformLocation(prog, n)
  gl.uniform1f(u('uFlip'), flip ? 1 : 0)
  const uRes = u('uRes'), uAmp = u('uAmplitude'), uOff = u('uOffsetY'), uShift = u('uShift')

  return {
    draw(p: number, lean = 0) {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr)
      const key = `${p.toFixed(4)}|${lean.toFixed(3)}|${w}x${h}`
      if (key === last) return
      last = key
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h) }
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(uRes, w, h)
      gl.uniform1f(uAmp, 1.3 - 1.0 * p)
      gl.uniform1f(uOff, -2.8 + 5.9 * p)
      gl.uniform1f(uShift, lean * 0.35)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
  }
}
