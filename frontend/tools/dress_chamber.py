# Dresses a chamber GLB for the web: welds the CAD triangle soup, sorts its parts into body / hardware / castors,
# gives everything premium materials, halves the triangles, exports a Draco GLB, and renders a preview on a plinth.
# usage: powershell -File tools/blender.ps1 tools/dress_chamber.py   (set $env:CH_SRC / $env:CH_OUT first for another model)
# CH_SRC may be .glb/.gltf or .fbx; the preview render lands next to this script, outside public/.
import bpy, bmesh, os, math
from mathutils import Vector

SRC = os.environ.get('CH_SRC', r'D:\real_envisys\frontend\public\models\chamber_lod.glb')
OUT = os.environ.get('CH_OUT', r'D:\real_envisys\frontend\public\models\et300.glb')
PREV = os.environ.get('CH_PREVIEW', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'preview_' + os.path.basename(OUT).replace('.glb', '.png')))
LOG = PREV.replace('.png', '.txt')
log = []

bpy.ops.wm.read_factory_settings(use_empty=True)
(bpy.ops.import_scene.fbx if SRC.lower().endswith('.fbx') else bpy.ops.import_scene.gltf)(filepath=SRC)
chamber = [o for o in bpy.data.objects if o.type == 'MESH']

# ── materials, in Envisys's own colours: white powder-coat panels with a gloss-black centre strip down the front,
#    black hardware and rubber, dark glass screens, brushed steel inside
def mat(name, base, metal=0.0, rough=0.5, coat=0.0, coat_rough=0.3):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*base, 1)
    b.inputs['Metallic'].default_value = metal
    b.inputs['Roughness'].default_value = rough
    if coat:
        b.inputs['Coat Weight'].default_value = coat
        b.inputs['Coat Roughness'].default_value = coat_rough
    return m

M = {
    'body': mat('Body_White', (0.80, 0.81, 0.82), 0.0, 0.42, 0.25, 0.3),
    'panel': mat('Panel_White', (0.84, 0.85, 0.86), 0.0, 0.38, 0.3, 0.25),
    'front': mat('Front_Black', (0.012, 0.013, 0.015), 0.0, 0.3, 0.8, 0.06),
    'hw': mat('Hardware_Black', (0.03, 0.03, 0.032), 0.3, 0.38),
    'rubber': mat('Rubber_Black', (0.012, 0.012, 0.013), 0.0, 0.85),
    'screen': mat('Screen_Glass', (0.006, 0.007, 0.009), 0.0, 0.06, 1.0, 0.03),
    'steel': mat('Interior_Steel', (0.62, 0.63, 0.65), 1.0, 0.28),
    'logo': mat('Logo_Silver', (0.80, 0.80, 0.82), 1.0, 0.22),
}
remap = {'Cavity_Interior': 'steel', 'Black': 'screen', 'Logo': 'logo'}
STRIP = float(os.environ.get('CH_STRIP', '0.28'))  # half-width of the black front strip, in metres

for o in chamber:
    log.append(f'{o.name} parent={o.parent.name if o.parent else None} loc={tuple(round(v, 3) for v in o.location)} rot={tuple(round(v, 3) for v in o.rotation_euler)}')
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
# transforms stay on the nodes as imported: applying them moved the door twice in the export

for o in chamber:
    me = o.data
    old = [s.material.name if s.material else '' for s in o.material_slots]
    bm = bmesh.new(); bm.from_mesh(me)  # read the faces before the slots are cleared, which resets their indices
    me.materials.clear()
    keys = list(M)
    for k in keys:
        me.materials.append(M[k])
    idx = {k: i for i, k in enumerate(keys)}
    before = len(bm.faces)
    # the separate front piece (logo + screens) gets the lighter panel tone
    front_piece = o.dimensions.z < 1.5
    # weld the CAD's loose triangles. Keep it fine: 1.5 mm collapsed panels into shards and swallowed the castors
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.0004)
    bm.faces.ensure_lookup_table()
    seen = set(); counts = {}
    for f in bm.faces:
        if f.index in seen: continue
        stack = [f]; seen.add(f.index); comp = []
        while stack:
            g = stack.pop(); comp.append(g)
            for e in g.edges:
                for h in e.link_faces:
                    if h.index not in seen: seen.add(h.index); stack.append(h)
        # welding joins parts of different materials, so the part decides only for faces that had the plain exterior paint
        vs = [v.co for g in comp for v in g.verts]
        mn = Vector((min(v.x for v in vs), min(v.y for v in vs), min(v.z for v in vs)))
        mx = Vector((max(v.x for v in vs), max(v.y for v in vs), max(v.z for v in vs)))
        size = max(mx - mn)
        if front_piece: part = 'panel'
        elif mx.z < 0.16 and size < 0.25: part = 'rubber'   # castors and feet
        elif size < 0.22: part = 'hw'                          # latches, hinges, ports, screws
        else: part = 'body'
        for g in comp:
            oldname = old[g.material_index] if g.material_index < len(old) else ''
            base = next((v for k, v in remap.items() if oldname.startswith(k)), part)
            # the black strip: front-facing paint within the middle of the width (x is centred on the chamber)
            if base in ('body', 'panel'):
                c = o.matrix_world @ g.calc_center_median()
                if (o.matrix_world.to_3x3() @ g.normal).y < -0.6 and abs(c.x) < STRIP: base = 'front'
            g.material_index = idx[base]
            counts[base] = counts.get(base, 0) + 1
    bm.to_mesh(me); bm.free()
    log.append(f'{o.name}: faces {before} → {len(me.polygons)} {counts}')
    # smooth the curved parts, keep panels crisp
    for p in me.polygons: p.use_smooth = True
    try:
        bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
        bpy.ops.object.shade_auto_smooth(angle=math.radians(35))
    except Exception as e:
        log.append('autosmooth: ' + str(e))
    # halve the triangles on the big body; flat CAD panels survive it untouched
    if len(me.polygons) > 20000:
        d = o.modifiers.new('dec', 'DECIMATE'); d.ratio = 0.5; d.use_collapse_triangulate = True

for o in chamber:
    bb = [o.matrix_world @ Vector(c) for c in o.bound_box]
    log.append(f'{o.name} world min={tuple(round(min(v[i] for v in bb),3) for i in range(3))} max={tuple(round(max(v[i] for v in bb),3) for i in range(3))} mods={[m.type for m in o.modifiers]}')
# ── export
bpy.ops.object.select_all(action='DESELECT')
for o in chamber: o.select_set(True)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True, export_apply=True,
                          export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6)
log.append(f'exported {OUT} {os.path.getsize(OUT) / 1e6:.2f} MB')

# ── preview: the reference set-up — pale grey wall, a concrete plinth, one soft light from above
lo = Vector((1e9, 1e9, 1e9)); hi = -lo
for o in chamber:
    for c in o.bound_box:
        w = o.matrix_world @ Vector(c); lo = Vector(map(min, lo, w)); hi = Vector(map(max, hi, w))
ctr = (lo + hi) / 2; H = hi.z - lo.z
bpy.ops.mesh.primitive_cube_add(size=1, location=(ctr.x, ctr.y, lo.z - 1.5))
pl = bpy.context.object; pl.scale = (4, 4, 3); pl.rotation_euler.z = math.radians(45)
cm = bpy.data.materials.new('Concrete'); cm.use_nodes = True
nt = cm.node_tree; b = nt.nodes['Principled BSDF']
nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 6; nz.inputs['Detail'].default_value = 12
ramp = nt.nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].color = (0.16, 0.16, 0.16, 1); ramp.color_ramp.elements[1].color = (0.32, 0.32, 0.31, 1)
nt.links.new(nz.outputs['Fac'], ramp.inputs['Fac']); nt.links.new(ramp.outputs['Color'], b.inputs['Base Color'])
b.inputs['Roughness'].default_value = 0.9
pl.data.materials.append(cm)

w = bpy.data.worlds.new('W'); bpy.context.scene.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.62, 0.62, 0.62, 1)
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.35
bpy.ops.object.light_add(type='AREA', location=(ctr.x - 1.2, ctr.y - 1.5, hi.z + 3))
L = bpy.context.object; L.data.energy = 900; L.data.size = 3; L.rotation_euler = (math.radians(25), math.radians(-15), 0)
bpy.ops.object.light_add(type='AREA', location=(ctr.x + 3, ctr.y + 2, hi.z + 1))
R = bpy.context.object; R.data.energy = 300; R.data.size = 2; R.data.color = (0.8, 0.88, 1)
R.rotation_euler = (math.radians(-60), math.radians(40), 0)

bpy.ops.object.camera_add(location=(ctr.x + 4.2, ctr.y - 6.6, lo.z + H * 0.35))
cam = bpy.context.object; bpy.context.scene.camera = cam; cam.data.lens = 55
d = ctr + Vector((0, 0, H * 0.05)) - cam.location
cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()

sc = bpy.context.scene
for eng in ('BLENDER_EEVEE', 'BLENDER_EEVEE_NEXT'):
    try: sc.render.engine = eng; break
    except Exception: pass
sc.render.resolution_x, sc.render.resolution_y = 900, 1100
sc.view_settings.view_transform = 'AgX'
sc.render.filepath = PREV
bpy.ops.render.render(write_still=True)
log.append('preview ' + PREV)
open(LOG, 'w').write('\n'.join(log))
