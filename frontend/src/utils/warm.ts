/**
 * Compiles a scene's shaders in a few batches, behind a preloader.
 * Chrome on Windows (ANGLE/D3D) finishes a shader only at its first draw, and one draw of the whole scene blocks the page for seconds.
 * Here the materials are drawn in a few batches through a 1 px scissor, with the page getting control back in between, so the
 * preloader keeps animating and `progress` can drive a real bar. Nothing visible is drawn.
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
  // a handful of batches, not one per material: the page breathes a few times without adding real delay
  const groups = [...byMat.values()], steps = Math.min(5, groups.length), per = Math.ceil(groups.length / steps)
  for (let k = 0; k < groups.length; k += per) {
    meshes.forEach((m) => { m.visible = false })
    groups.slice(k, k + per).forEach((g) => g.forEach((m) => { m.visible = true }))
    try { draw(scene, camera) } catch { /* warm-up only */ }
    progress?.(Math.min(1, (k + per) / groups.length))
    await new Promise<void>((res) => setTimeout(res, 0))
  }
  r.setScissorTest(false)
  meshes.forEach((m, i) => { m.visible = vis[i] })
}
