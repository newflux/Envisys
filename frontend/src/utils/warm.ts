/**
 * Compiles a scene's shaders one material at a time, behind a preloader.
 * Chrome on Windows (ANGLE/D3D) finishes a shader only at its first draw, and one draw of the whole scene blocks the page for seconds.
 * Here each material is drawn alone through a 1 px scissor and the page gets a frame back in between, so the preloader keeps animating
 * and `progress` can drive a real bar. Nothing visible is drawn.
 */
export async function sliceWarm(
  r: any, scene: any, camera: any,
  draw: (s: any, c: any) => void = (s, c) => r.render(s, c),
  progress?: (done: number) => void,
) {
  const meshes: any[] = []
  scene.traverse((o: any) => { if (o.isMesh) meshes.push(o) })
  const byMat = new Map<any, any[]>()
  for (const m of meshes) for (const x of Array.isArray(m.material) ? m.material : [m.material]) { if (x) (byMat.get(x) ?? byMat.set(x, []).get(x)!).push(m) }
  const vis = meshes.map((m) => m.visible)
  r.setScissorTest(true); r.setScissor(0, 0, 1, 1)
  let n = 0
  for (const group of byMat.values()) {
    meshes.forEach((m) => { m.visible = false })
    group.forEach((m) => { m.visible = true })
    try { draw(scene, camera) } catch { /* warm-up only */ }
    progress?.(++n / byMat.size)
    await new Promise<void>((res) => requestAnimationFrame(() => res()))
  }
  r.setScissorTest(false)
  meshes.forEach((m, i) => { m.visible = vis[i] })
}
