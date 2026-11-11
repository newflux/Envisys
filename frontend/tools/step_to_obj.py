# Converts a chamber's STEP assembly into a clean OBJ for Blender, one object per part, in metres.
# It meshes the real CAD surfaces (so no cracks, curves where the CAD has curves) and skips the parts nobody sees:
# the refrigeration, fan and electrics inside the body. The cavity seen through the door window stays.
# usage: python tools/step_to_obj.py <in.STEP> <out.obj> [deflection_mm=1.2]
import sys, re, time
from OCP.STEPCAFControl import STEPCAFControl_Reader
from OCP.TDocStd import TDocStd_Document
from OCP.TCollection import TCollection_ExtendedString
from OCP.XCAFDoc import XCAFDoc_DocumentTool
from OCP.TDF import TDF_Label
from OCP.OCP.collections import Sequence_TDF_Label
from OCP.TDataStd import TDataStd_Name
from OCP.TopLoc import TopLoc_Location
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.BRep import BRep_Tool
from OCP.TopExp import TopExp_Explorer
from OCP.TopAbs import TopAbs_FACE, TopAbs_REVERSED
from OCP.TopoDS import TopoDS
from OCP.IFSelect import IFSelect_RetDone

SKIP = re.compile(r'NTZ136|RCT|Compressor Tray|CONDENSER|L CLAMP|Motor Rib|Electrical Assy|Insulation Cover|Insltn|STIFFNER|Stiffner|Top Rib|MOTOR HAT|'
                  r'Drain Tray|Supp|PROXIMITY|SENSING|MAGNETIC|DZLM|Gasket Flange|Fan|FAN|HC -|Plainum|Condenser Holder|Duct Sheet|'
                  r'CHASSIS  - OBA|Compressor|Tray Holder|Mtg|INCH|DOOR LEVEL PLATFORM|Rear Panel - ICA|SP - ICSA|COIL|HEATER|EVA - |NUT|door_ins', re.I)

src, out = sys.argv[1], sys.argv[2]
defl = float(sys.argv[3]) if len(sys.argv) > 3 else 1.2
t0 = time.time()
doc = TDocStd_Document(TCollection_ExtendedString('doc'))
r = STEPCAFControl_Reader(); r.SetNameMode(True)
assert r.ReadFile(src) == IFSelect_RetDone
r.Transfer(doc)
st = XCAFDoc_DocumentTool.ShapeTool_s(doc.Main())
print(f'read {time.time() - t0:.0f}s')

def name(l):
    a = TDataStd_Name()
    return a.Get().ToExtString() if l.FindAttribute(TDataStd_Name.GetID_s(), a) else '?'

parts = []  # (path, shape with its global location)
def walk(l, loc, path):
    ref = TDF_Label()
    lab = ref if (st.IsReference_s(l) and st.GetReferredShape_s(l, ref)) else l
    here = loc.Multiplied(st.GetLocation_s(l)) if st.IsReference_s(l) else loc
    p = path + [name(lab)]
    if SKIP.search(p[-1]):
        return
    kids = Sequence_TDF_Label()
    if st.GetComponents_s(lab, kids):
        for i in range(1, kids.Length() + 1):
            walk(kids.Value(i), here, p)
    else:
        parts.append(('/'.join(p), st.GetShape_s(lab).Moved(here)))

roots = Sequence_TDF_Label(); st.GetFreeShapes(roots)
for i in range(1, roots.Length() + 1):
    walk(roots.Value(i), TopLoc_Location(), [])
print(f'{len(parts)} parts kept')

with open(out, 'w') as f:
    vbase = 1; tris = 0
    for path, shape in parts:
        BRepMesh_IncrementalMesh(shape, defl, False, 0.2, True)  # 0.2 rad: round parts stay round
        f.write(f'o {re.sub(r"[^A-Za-z0-9_./-]+", "_", path)[-120:]}\n')
        ex = TopExp_Explorer(shape, TopAbs_FACE)
        while ex.More():
            face = TopoDS.Face(ex.Current()); ex.Next()
            L = TopLoc_Location()
            tri = BRep_Tool.Triangulation_s(face, L)
            if tri is None:
                continue
            T = L.Transformation()
            for k in range(1, tri.NbNodes() + 1):
                q = tri.Node(k).Transformed(T)
                f.write(f'v {q.X() * 0.001:.5f} {q.Y() * 0.001:.5f} {q.Z() * 0.001:.5f}\n')
            flip = face.Orientation() == TopAbs_REVERSED
            for k in range(1, tri.NbTriangles() + 1):
                a, b, c = tri.Triangle(k).Get()
                if flip: b, c = c, b
                f.write(f'f {a + vbase - 1} {b + vbase - 1} {c + vbase - 1}\n')
            vbase += tri.NbNodes(); tris += tri.NbTriangles()
print(f'{tris} triangles, {time.time() - t0:.0f}s')
