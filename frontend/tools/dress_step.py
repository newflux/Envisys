# Dresses a chamber converted from STEP (tools/step_to_obj.py) for the web, in Envisys's own finish:
# white powder-coat panels, a gloss-black door cladding, black hardware and castors, tinted window glass over a lit
# stainless cavity, and the ENVISYS letters cut in the door backed in silver. It then halves the triangles, bakes ambient
# occlusion into a texture for photographic shading, and writes a Draco GLB. The touchscreen opening in the door
# gets a separate 'HMI_Screen' plane (UVs 0..1, upright) that the page paints live.
# usage: powershell -File tools/blender.ps1 tools/dress_step.py   (env CH_OBJ, CH_OUT, CH_TRIS)
import bpy, bmesh, os, re, math
from mathutils import Vector
import sys, traceback
# the Store build's launcher swallows Blender's output, so a failure is written next to this script
sys.excepthook = lambda *e: open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'blender_error.txt'), 'w').write(''.join(traceback.format_exception(*e)))

HERE = os.path.dirname(os.path.abspath(__file__))
OBJ = os.environ.get('CH_OBJ', os.path.join(HERE, 'et300.obj'))
OUT = os.environ.get('CH_OUT', os.path.join(HERE, '..', 'public', 'models', 'et300.glb'))
LOGO_SRC = os.environ.get('CH_LOGO_SRC', os.path.join(HERE, '..', 'public', 'models', 'chamber_lod.glb'))  # a modelled logo, for doors without cut letters
TRIS = int(os.environ.get('CH_TRIS', '220000'))
PREV = os.path.join(HERE, 'preview_' + os.path.basename(OUT).replace('.glb', '.png'))
log = []

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.obj_import(filepath=OBJ, forward_axis='NEGATIVE_Z', up_axis='Y')
parts = [o for o in bpy.data.objects if o.type == 'MESH']
log.append(f'{len(parts)} parts')

def mat(name, base, metal=0.0, rough=0.5, coat=0.0, coat_rough=0.3, alpha=1.0, emit=None, emit_k=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*base, 1)
    b.inputs['Metallic'].default_value = metal
    b.inputs['Roughness'].default_value = rough
    if coat: b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = coat_rough
    if alpha < 1: b.inputs['Alpha'].default_value = alpha; m.surface_render_method = 'BLENDED'
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = emit_k
    return m

M = {
    'white': mat('Powder_White', (0.82, 0.83, 0.84), 0.0, 0.42, 0.3, 0.25),
    'black': mat('Gloss_Black', (0.010, 0.011, 0.013), 0.0, 0.22, 0.9, 0.05),
    'hw': mat('Hardware_Black', (0.025, 0.025, 0.027), 0.2, 0.35),
    'rubber': mat('Castor_Rubber', (0.02, 0.02, 0.022), 0.0, 0.8),
    'steel': mat('Cavity_Steel', (0.55, 0.58, 0.62), 1.0, 0.3, emit=(0.75, 0.88, 1.0), emit_k=0.22),
    'satin': mat('Satin_Steel', (0.62, 0.63, 0.65), 1.0, 0.35),
    'glass': mat('Window_Glass', (0.01, 0.015, 0.02), 0.0, 0.03, alpha=0.5),
    'logo': mat('Logo_Silver', (0.85, 0.85, 0.87), 1.0, 0.2),
}
# by part name: the door's front cladding and the lower front centre are the black strip; the cavity is steel
RULES = [
    (r'Cladding_-_DA|Bottom_Cladding_-_SA|Mid_Panel_-_DA', 'black'),
    # EA (altitude) series: the door's glass cladding, the HMI surround and the base are the black; hinges and locks are hardware
    (r'Glass_Clad_-_DA|L_Frame_Cladding|HMI_CLADDING|UB_Base|FRONT_LEG|FRAME_-_UBA|GUSSET|FRAME_-_CA_', 'black'),
    (r'DOOR_HINGE|EA_HINGE|EA_LOCK|DHFM|CIRCLIP|PIVOT_ROD', 'hw'),
    (r'INNER_CHAMBER|Tray_Channel|Duct', 'steel'),
    (r'PORT_PIPE|O_RING|SS_BUSH|SS_ANGLE', 'satin'),
    (r'SK6-B75120P', 'rubber'),
    (r'SK1-701|DHP-110|SK2-003|HINGE|HL009|WHEEL_HOLDER', 'hw'),
    (r'/ICA_|ICA_-_', 'steel'),
    (r'GF_-_|SS_FLANGE|GLAND', 'satin'),
]
counts = {}
for o in parts:
    key = next((k for pat, k in RULES if re.search(pat, o.name)), 'white')
    o.data.materials.clear(); o.data.materials.append(M[key])
    counts[key] = counts.get(key, 0) + 1
log.append(str(counts))

def bbox(objs):
    lo = Vector((1e9, 1e9, 1e9)); hi = -lo
    for o in objs:
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c); lo = Vector(map(min, lo, w)); hi = Vector(map(max, hi, w))
    return lo, hi

lo, hi = bbox(parts)
# some STEP files have their origin at the top (the ET950): lift those so the castors stand on the floor
if abs(lo.z) > 0.05:
    for o in parts: o.location.z -= lo.z
    bpy.context.view_layer.update()
    lo, hi = bbox(parts)
    log.append('lifted onto the floor')
log.append(f'bounds {tuple(round(v, 3) for v in lo)} → {tuple(round(v, 3) for v in hi)}')

# the window: a pane of tinted glass across the glass frame's opening, just behind its front face
gf = [o for o in parts if 'GF_-_' in o.name]
if gf:
    a, b = bbox(gf)
    front_y = a.y  # Blender: -Y is the front after the axis conversion
    bpy.ops.mesh.primitive_plane_add(size=1, location=((a.x + b.x) / 2, front_y + 0.012, (a.z + b.z) / 2), rotation=(math.pi / 2, 0, 0))
    g = bpy.context.object; g.name = 'Window_Glass'
    g.scale = ((b.x - a.x) * 0.92, (b.z - a.z) * 0.92, 1)
    g.data.materials.append(M['glass']); parts.append(g)
    log.append(f'glass {round(b.x - a.x, 3)} x {round(b.z - a.z, 3)} at y {round(front_y, 3)}')

# the door cladding's openings (rays from the front that pass through it): the touchscreen below the window gets a
# screen, and the ENVISYS letters cut above it get a silver plate behind them, as on the real door
from mathutils.bvhtree import BVHTree

def place_logo(x0, x1, z0, z1, y):
    """the ENVISYS logo modelled on the old chamber, fitted into the box x0..x1, z0..z1 on the plane y"""
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=LOGO_SRC)
    new = [o for o in bpy.data.objects if o not in before]
    logo = None
    for o in new:
        idx = [i for i, sl in enumerate(o.material_slots) if sl.material and sl.material.name.startswith('Logo')] if o.type == 'MESH' else []
        if not idx: continue
        bm = bmesh.new(); bm.from_mesh(o.data)
        # the old model painted some letters with the body colour, so take every small piece inside the logo's area
        lf = [f for f in bm.faces if f.material_index in idx]
        vs = [v.co for f in lf for v in f.verts]
        lo3 = Vector((min(v.x for v in vs), min(v.y for v in vs), min(v.z for v in vs))) - Vector((0.004, 0.004, 0.004))
        hi3 = Vector((max(v.x for v in vs), max(v.y for v in vs), max(v.z for v in vs))) + Vector((0.004, 0.004, 0.004))
        inside = lambda c: all(lo3[k] <= c[k] <= hi3[k] for k in range(3))
        seen, keep = set(), set()
        for f in bm.faces:
            if f in seen: continue
            stack = [f]; seen.add(f); comp = []
            while stack:
                g = stack.pop(); comp.append(g)
                for e in g.edges:
                    for h in e.link_faces:
                        if h not in seen: seen.add(h); stack.append(h)
            if all(inside(v.co) for g in comp for v in g.verts): keep.update(comp)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f not in keep], context='FACES')
        bm.to_mesh(o.data); bm.free()
        o.data.materials.clear(); o.data.materials.append(M['logo']); logo = o
    for o in new:
        if o is not logo: bpy.data.objects.remove(o, do_unlink=True)
    if not logo: return
    bpy.ops.object.select_all(action='DESELECT'); logo.select_set(True); bpy.context.view_layer.objects.active = logo
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    la, lb = bbox([logo])
    k = min((x1 - x0) / (lb.x - la.x), (z1 - z0) / (lb.z - la.z))
    logo.scale = (k, k, k); bpy.ops.object.transform_apply(scale=True)
    la, lb = bbox([logo])
    logo.location += Vector(((x0 + x1) / 2, y - 0.0015, (z0 + z1) / 2)) - Vector(((la.x + lb.x) / 2, lb.y, (la.z + lb.z) / 2))
    parts.append(logo)
    log.append('modelled logo placed')

# lettering modelled on the door itself (raised or sunk a little from the black front, above the window): paint it silver
ga_, gb_ = bbox(gf) if gf else (None, None)
engraved = 0
for o in [o for o in parts if o.data.materials and o.data.materials[0] == M['black']] if gf else []:
    me = o.data; mw = o.matrix_world; rot = mw.to_3x3()
    planes = {}
    for f in me.polygons:
        if (rot @ f.normal).y < -0.9: planes.setdefault(round((mw @ f.center).y, 3), []).append(f)
    if not planes: continue
    # the front is the frontmost large plane (a panel can have a step behind it as big as itself); lettering is the small
    # planes within a few millimetres of it, above the window
    area = {y: sum(f.area for f in fs) for y, fs in planes.items()}
    big = max(area.values())
    ymin = min(y for y, a_ in area.items() if a_ > 0.3 * big)
    marks = {y for y, a_ in area.items() if 0.0004 < abs(y - ymin) < 0.008 and a_ < 0.25 * area[ymin]}
    hits = [f for f in me.polygons if (rot @ f.normal).y < -0.9 and round((mw @ f.center).y, 3) in marks and (mw @ f.center).z > gb_.z + 0.01]
    top = sorted(planes.items(), key=lambda kv: -sum(f.area for f in kv[1]))[:4]
    log.append(f'{o.name[-40:]}: planes ' + ', '.join(f'y={y} area={sum(f.area for f in fs):.4f} n={len(fs)}' for y, fs in top) + f' | hits {len(hits)} area={sum(f.area for f in hits):.4f}')
    if len(hits) < 20: continue
    me.materials.append(M['logo']); k = len(me.materials) - 1
    for f in hits: f.material_index = k
    engraved += len(hits)
if engraved: log.append(f'door lettering painted ({engraved} faces)')

screen = None
for c in [o for o in parts if re.search(r'Cladding_-_DA|Glass_Clad_-_DA|HMI_CLADDING', o.name)]:  # the door's upper and lower cladding (EA: the glass cladding and the HMI surround)
    tree = BVHTree.FromObject(c, bpy.context.evaluated_depsgraph_get())
    ca, cb = bbox([c])
    step = 0.004
    nx, nz = int((cb.x - ca.x) / step), int((cb.z - ca.z) / step)
    # a cell is open when a ray from in front misses the sheet, or only hits something well behind its front
    inv = c.matrix_world.inverted(); back = (inv.to_3x3() @ Vector((0, 1, 0))).normalized()  # the tree is in the part's own space
    hits = [[tree.ray_cast(inv @ Vector((ca.x + (i + 0.5) * step, ca.y - 1, ca.z + (k + 0.5) * step)), back) for k in range(nz)] for i in range(nx)]
    ymin = min((c.matrix_world @ h[0]).y for col in hits for h in col if h[0] is not None)
    open_ = [[h[0] is None or (c.matrix_world @ h[0]).y > ymin + 0.01 for h in col] for col in hits]
    seen, loops = set(), []
    for i0 in range(nx):
        for k0 in range(nz):
            if not open_[i0][k0] or (i0, k0) in seen: continue
            stack = [(i0, k0)]; seen.add((i0, k0)); cells = []
            while stack:
                a, b = stack.pop(); cells.append((a, b))
                for da, db in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    q = (a + da, b + db)
                    if 0 <= q[0] < nx and 0 <= q[1] < nz and open_[q[0]][q[1]] and q not in seen: seen.add(q); stack.append(q)
            xs = [a for a, _ in cells]; zs = [b for _, b in cells]
            # openings touching the sheet's edge are its outline, not holes
            if min(xs) == 0 or min(zs) == 0 or max(xs) == nx - 1 or max(zs) == nz - 1: continue
            loops.append((ca.x + min(xs) * step, ca.x + (max(xs) + 1) * step, ca.z + min(zs) * step, ca.z + (max(zs) + 1) * step))
    ga, gb = bbox(gf)
    loops.sort(key=lambda b: -(b[1] - b[0]) * (b[3] - b[2]))
    log.append('cladding openings ' + str([tuple(round(v, 3) for v in b) for b in loops[:5]]))
    below = [b for b in loops if b[3] < ga.z + 0.01 and (b[1] - b[0]) * (b[3] - b[2]) > 0.004]
    letters = [b for b in loops if b[2] > gb.z and (b[1] - b[0]) * (b[3] - b[2]) < 0.01]
    if letters:
        x0, x1 = min(b[0] for b in letters) - 0.006, max(b[1] for b in letters) + 0.006
        z0, z1 = min(b[2] for b in letters) - 0.006, max(b[3] for b in letters) + 0.006
        bpy.ops.mesh.primitive_plane_add(size=1, location=((x0 + x1) / 2, ymin + 0.004, (z0 + z1) / 2), rotation=(math.pi / 2, 0, 0))
        plate = bpy.context.object; plate.name = 'Logo_Plate'; plate.scale = (x1 - x0, z1 - z0, 1)
        plate.data.materials.append(M['logo']); parts.append(plate)
        log.append(f'logo plate behind {len(letters)} letters')
    elif not engraved and any(b[1] - b[0] > 0.3 and b[3] - b[2] > 0.3 for b in loops) and os.path.exists(LOGO_SRC):
        # no cut letters on the window's panel: the logo goes on the black above the window and any slot over it
        top = max([gb.z] + [b[3] for b in loops if b[2] > gb.z - 0.05])
        cw = cb.x - ca.x
        place_logo(ca.x + cw * 0.22, cb.x - cw * 0.22, top + 0.012, cb.z - 0.012, ymin)
    if below and screen is None:
        x0, x1, z0, z1 = below[0]
        bpy.ops.mesh.primitive_plane_add(size=1, location=((x0 + x1) / 2, ymin + 0.006, (z0 + z1) / 2), rotation=(math.pi / 2, 0, 0))
        screen = bpy.context.object; screen.name = 'HMI_Screen'
        screen.scale = ((x1 - x0) * 0.97, (z1 - z0) * 0.97, 1)
        bpy.ops.object.transform_apply(scale=True)
        screen.data.materials.append(mat('HMI_Screen', (0.02, 0.03, 0.05), 0.0, 0.08, emit=(1, 1, 1), emit_k=1.0))
        log.append(f'screen {round(x1 - x0, 3)} x {round(z1 - z0, 3)}')

# CH_DOOR (a regex of part names): the door is exported as its own object, 'Door', pivoting on its hinge edge, so the page
# can open it. Its parts are tagged now and split off after the bake (one UV map and one AO image for both).
DOOR = os.environ.get('CH_DOOR')
hinge = None
if DOOR:
    dparts = [o for o in parts if re.search(DOOR, o.name) or o.name.startswith(('Window_Glass', 'Logo'))]
    da, db = bbox(dparts)
    hp = [o for o in parts if 'HINGE' in o.name.upper()]
    ha, hb = bbox(hp) if hp else (da, db)
    # CH_HINGE=left|right when the hinge parts sit on both sides (the ET950 has door hinges left and right)
    side = os.environ.get('CH_HINGE') or ('right' if (ha.x + hb.x) / 2 > (da.x + db.x) / 2 else 'left')
    hinge = (Vector((db.x if side == 'right' else da.x, da.y, (da.z + db.z) / 2)), side)
    for o in dparts:
        g = o.vertex_groups.new(name='door'); g.add(list(range(len(o.data.vertices))), 1.0, 'REPLACE')
    log.append(f'door: {len(dparts)} parts, hinge on the {side}')

# one mesh, smooth within each CAD face, crisp between them; then fewer triangles
bpy.ops.object.select_all(action='DESELECT')
for o in parts: o.select_set(True)
bpy.context.view_layer.objects.active = parts[0]
bpy.ops.object.join()
ch = bpy.context.object; ch.name = 'Chamber'
bpy.ops.object.shade_auto_smooth(angle=math.radians(40))
nt = len(ch.data.polygons)
if nt > TRIS:
    d = ch.modifiers.new('dec', 'DECIMATE'); d.ratio = TRIS / nt; d.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier='dec')
log.append(f'triangles {nt} → {len(ch.data.polygons)}')

# ambient occlusion, baked once with Cycles into a texture: the soft contact shading that sells it as a photograph
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.003)
bpy.ops.object.mode_set(mode='OBJECT')
AO = int(os.environ.get('CH_AO', '2048'))  # the ambient-occlusion texture's size; phones get 1024
img = bpy.data.images.new('AO', AO, AO, alpha=False)
img.colorspace_settings.name = 'Non-Color'
grp = bpy.data.node_groups.get('glTF Material Output') or bpy.data.node_groups.new('glTF Material Output', 'ShaderNodeTree')
if not grp.interface.items_tree:
    grp.interface.new_socket('Occlusion', in_out='INPUT', socket_type='NodeSocketFloat')
for m in M.values():
    nt_ = m.node_tree
    t = nt_.nodes.new('ShaderNodeTexImage'); t.image = img; t.name = 'AO'
    sep = nt_.nodes.new('ShaderNodeSeparateColor'); nt_.links.new(t.outputs['Color'], sep.inputs['Color'])
    out = nt_.nodes.new('ShaderNodeGroup'); out.node_tree = grp
    nt_.links.new(sep.outputs['Red'], out.inputs['Occlusion'])
    nt_.nodes.active = t  # the bake writes into the active image node
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.samples = 48; sc.cycles.device = 'CPU'
sc.render.bake.margin = 6
bpy.ops.object.bake(type='AO')
img.filepath_raw = os.path.join(HERE, 'ao_' + os.path.basename(OUT).replace('.glb', '.png')); img.file_format = 'PNG'; img.save()
log.append('ao baked')

door = None
if hinge and 'door' in ch.vertex_groups:
    bpy.ops.object.select_all(action='DESELECT'); ch.select_set(True); bpy.context.view_layer.objects.active = ch
    ch.vertex_groups.active_index = ch.vertex_groups['door'].index
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='DESELECT')
    bpy.ops.object.vertex_group_select(); bpy.ops.mesh.separate(type='SELECTED')
    bpy.ops.object.mode_set(mode='OBJECT')
    door = next(o for o in bpy.context.selected_objects if o is not ch); door.name = 'Door'
    bpy.context.scene.cursor.location = hinge[0]
    bpy.ops.object.select_all(action='DESELECT'); door.select_set(True); bpy.context.view_layer.objects.active = door
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
    door['hinge'] = hinge[1]
    if screen:  # the touchscreen sits in the door, so it swings with it
        screen.parent = door; screen.matrix_parent_inverse = door.matrix_world.inverted()
    log.append(f'door split: {len(door.data.polygons)} faces')

bpy.ops.object.select_all(action='DESELECT'); ch.select_set(True)
if door: door.select_set(True)
if screen: screen.select_set(True)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True, export_apply=True, export_extras=True,
                          export_image_format='WEBP', export_image_quality=82,
                          export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=7)
log.append(f'exported {OUT} {os.path.getsize(OUT) / 1e6:.2f} MB')

# a quick preview on a pale backdrop
lo, hi = bbox([ch]); ctr = (lo + hi) / 2; H = hi.z - lo.z
w = bpy.data.worlds.new('W'); sc.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.85, 0.89, 0.95, 1)
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.9
bpy.ops.object.light_add(type='AREA', location=(ctr.x - 2.5, ctr.y - 3, hi.z + 2)); L = bpy.context.object
L.data.energy = 900; L.data.size = 3; L.rotation_euler = (math.radians(50), 0, math.radians(-40))
bpy.ops.object.camera_add(location=(ctr.x + 2.6, ctr.y - 5.6, lo.z + H * 0.55)); cam = bpy.context.object
sc.camera = cam; cam.data.lens = 50
cam.rotation_euler = (ctr + Vector((0, 0, -H * 0.02)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
sc.render.engine = 'BLENDER_EEVEE'
sc.render.resolution_x, sc.render.resolution_y = 900, 1100
sc.view_settings.view_transform = 'AgX'
sc.render.filepath = PREV
bpy.ops.render.render(write_still=True)
open(PREV.replace('.png', '.txt'), 'w').write('\n'.join(log))
