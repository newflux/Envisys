// Builds public/models/chamber_lod.glb — a lighter copy of the chamber used ONLY for the two side
// units in the fleet phase. Re-run after replacing chamber_main.glb (or just delete chamber_lod.glb:
// App.vue falls back to the full model, and also ignores a stale LOD whose bounds don't match).
//
//   mkdir lodtmp && cd lodtmp && npm i @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer
//   node ../tools/make_chamber_lod.mjs ../public/models/chamber_main.glb ../public/models/chamber_lod.glb 0.1 0.01
//
import { NodeIO } from '@gltf-transform/core';
import { KHRMaterialsSpecular } from '@gltf-transform/extensions';
import { compactPrimitive, prune } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';

const [, , inp, outp, ratioArg, errArg] = process.argv;
const ratio = Number(ratioArg);
const err = Number(errArg);

await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions([KHRMaterialsSpecular]);
const doc = await io.read(inp);

let before = 0, after = 0;
for (const mesh of doc.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const idx = prim.getIndices();
    const pos = prim.getAttribute('POSITION');
    if (!idx || !pos) continue;
    const indices = idx.getArray();
    const positions = pos.getArray();
    before += indices.length / 3;
    // Primitives that are already small are left alone.
    if (indices.length / 3 < 8000) { after += indices.length / 3; continue; }
    const target = Math.max(3000 * 3, Math.floor((indices.length * ratio) / 3) * 3);
    const [out] = MeshoptSimplifier.simplify(new Uint32Array(indices), positions, 3, target, err, ["Sparse"]);
    idx.setArray(out.length < 65535 * 3 && indices.constructor === Uint16Array ? new Uint16Array(out) : out);
    compactPrimitive(prim);
    after += out.length / 3;
  }
}
await doc.transform(prune());
await io.write(outp, doc);
console.log('tris', before, '->', after);
