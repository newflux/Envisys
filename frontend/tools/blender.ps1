# usage: powershell -File tools/blender.ps1 tools/dress_chamber.py  — runs a Blender script headless (Store install: only the launcher alias can start it)
# A Python error in the script makes it exit 1; dress_step.py writes the traceback to tools/blender_error.txt.
param([string]$script)
$p = Start-Process -FilePath "$env:LOCALAPPDATA\Microsoft\WindowsApps\BlenderFoundation.Blender_ppwjx1n5r4v9t\blender-launcher.exe" -ArgumentList @('-b', '--python-exit-code', '1', '--python', "`"$script`"") -PassThru -Wait -WindowStyle Hidden
"exit $($p.ExitCode)"
