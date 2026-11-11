# rebuilds the two chamber models with the same finish and a hinged door (run from frontend/)
$ErrorActionPreference = 'Continue'
New-Item -ItemType Directory -Force tools\work | Out-Null
python -I tools\step_to_obj.py public\models\EA600-40T-A.STEP tools\work\ea600.obj 1.2 *> tools\work\ea600.log
python -I tools\step_to_obj.py ..\cad\ET950-70H-5K.STEP tools\work\et950.obj 1.2 *> tools\work\et950.log
$env:CH_DOOR = '_-_DA_-_|GF_-_|EA_LOCK|MID_PART_-_DOOR'; $env:CH_HINGE = 'left'  # both doors hinge on the left (the ET950 has hinge parts on both sides)
foreach ($b in @(@('ea600', 'ea600', '220000', '2048'), @('ea600', 'ea600_m', '80000', '1024'), @('et950', 'et950', '320000', '2048'), @('et950', 'et950_m', '90000', '1024'))) {
  $env:CH_OBJ = "D:\real_envisys\frontend\tools\work\$($b[0]).obj"; $env:CH_OUT = "D:\real_envisys\frontend\public\models\$($b[1]).glb"; $env:CH_TRIS = $b[2]; $env:CH_AO = $b[3]
  & powershell -File tools\blender.ps1 'D:\real_envisys\frontend\tools\dress_step.py'
  Copy-Item "tools\preview_$($b[1]).txt" "tools\work\log_$($b[1]).txt" -ErrorAction SilentlyContinue
}
'all done'
