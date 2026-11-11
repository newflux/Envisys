# Builds "Envisys - data needed.xlsx" in the repo root: the short, plain-language sheet for the company. Seven small tabs, only the
# essentials, yellow cells to fill, no formulas. It reads the site's own data files, so the model lists and the 3D ticks are always
# current. (The long internal checklist is export_full_checklist.py.)
# usage (from frontend/):  python tools/export_missing_data.py        (needs node and network for `npx esbuild` the first time)
import json, os, subprocess, datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.comments import Comment
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

HERE = os.path.dirname(os.path.abspath(__file__))
FRONT = os.path.dirname(HERE)
OUT = os.path.join(os.path.dirname(FRONT), 'Envisys - data needed.xlsx')
WORK = os.path.join(HERE, 'work')
os.makedirs(WORK, exist_ok=True)
npx = 'npx.cmd' if os.name == 'nt' else 'npx'
subprocess.run([npx, '-y', 'esbuild', 'tools/missing-entry.ts', '--bundle', '--format=esm', '--platform=node', '--outfile=tools/work/missing.mjs', '--log-level=error'], cwd=FRONT, check=True)
SERIES = json.loads(subprocess.run(['node', 'tools/work/missing.mjs'], cwd=FRONT, check=True, capture_output=True, text=True).stdout)['series']
BY = {s['slug']: s for s in SERIES}
MAIN = [s for s in SERIES if s['tier'] == 'main']
OTHER = [s for s in SERIES if s['tier'] != 'main']

# ---- look ----
F, NAVY = 'Arial', '0D2340'
f_body = Font(name=F, size=11); f_bold = Font(name=F, size=11, bold=True); f_head = Font(name=F, size=11, bold=True, color='FFFFFF')
f_title = Font(name=F, size=18, bold=True, color=NAVY); f_sub = Font(name=F, size=11, italic=True, color='555555'); f_sec = Font(name=F, size=13, bold=True, color=NAVY)
fill_head = PatternFill('solid', fgColor=NAVY); fill_in = PatternFill('solid', fgColor='FFF2CC'); fill_have = PatternFill('solid', fgColor='EDEDED')
fill_ok = PatternFill('solid', fgColor='C6E0B4'); fill_no = PatternFill('solid', fgColor='F8CBAD'); fill_sec = PatternFill('solid', fgColor='EAF1F9'); fill_must = PatternFill('solid', fgColor='FFD9C2')
thin = Side(style='thin', color='B8C4D6'); border = Border(top=thin, bottom=thin, left=thin, right=thin)
wrap = Alignment(wrap_text=True, vertical='top'); center = Alignment(horizontal='center', vertical='top', wrap_text=True)

def head(ws, row, labels, widths=None):
    for j, h in enumerate(labels, 1):
        c = ws.cell(row, j, h); c.font = f_head; c.fill = fill_head; c.alignment = Alignment(wrap_text=True, vertical='center'); c.border = border
    ws.row_dimensions[row].height = 36
    if widths:
        for j, w in enumerate(widths, 1): ws.column_dimensions[get_column_letter(j)].width = w

def put(ws, row, values, kinds=None, h=None):
    """kinds: per column, 'have' (grey, already filled), 'in' (yellow, please fill), 'ok'/'no' (tick colours), or None"""
    for j, v in enumerate(values, 1):
        c = ws.cell(row, j, v); c.font = f_body; c.alignment = wrap; c.border = border
        k = (kinds or {}).get(j)
        if k == 'have': c.fill = fill_have
        elif k == 'in': c.fill = fill_in
        elif k == 'ok': c.fill = fill_ok; c.alignment = center; c.font = Font(name=F, size=13, bold=True, color='2E7D32')
        elif k == 'no': c.fill = fill_no; c.alignment = center; c.font = Font(name=F, size=13, bold=True, color='C0504D')
    if h: ws.row_dimensions[row].height = h

def section(ws, row, text, cols):
    c = ws.cell(row, 1, text); c.font = f_sec
    for j in range(1, cols + 1): ws.cell(row, j).fill = fill_sec
    ws.row_dimensions[row].height = 26

def dropdown(ws, rng, options):
    dv = DataValidation(type='list', formula1='"' + ','.join(options) + '"', allow_blank=True); ws.add_data_validation(dv); dv.add(rng)

wb = Workbook(); wb.remove(wb.active)

# =================== Start here ===================
ws = wb.create_sheet('Start here')
for col, w in zip('ABCDE', [28, 56, 44, 16, 24]): ws.column_dimensions[col].width = w
ws['A1'] = 'Envisys website: what we need from you'; ws['A1'].font = f_title
ws['A2'] = f'Short list, in plain words. {datetime.date.today().strftime("%d %B %Y")}. Leave blank anything you do not have: nothing here is compulsory, and we will not guess.'; ws['A2'].font = f_sub
section(ws, 4, 'How to fill it in', 5)
how = ['Fill only the YELLOW cells. Grey cells are already filled from your brochure.',
       'You can type straight into this file, or send the documents and photographs by email or WhatsApp and write the file name in the Notes column.',
       'Sizes in millimetres (width × depth × height), weight in kg, power in kW. Example for a size: 1450 × 1550 × 2100.',
       'Start with the tabs marked MUST. The rest can wait.']
for i, t in enumerate(how, 5):
    c = ws.cell(i, 1, '•  ' + t); c.font = f_body; ws.merge_cells(start_row=i, start_column=1, end_row=i, end_column=5); c.alignment = Alignment(wrap_text=True, vertical='top'); ws.row_dimensions[i].height = 22
section(ws, 10, 'The tabs', 5)
head(ws, 11, ['Tab', 'What to fill in', 'Why we ask', 'Priority', 'About how long'])
n_models = sum(len(s['models'] or []) for s in MAIN)
tabs = [('1  Main chambers', f'For the {n_models} models of our five main chambers: outside size, weight, power, cooling (air or water).', 'A buyer needs this to plan the room, the floor and the electrics.', 'MUST', '20 minutes, with the drawings'),
        ('2  Other chambers', f'One line for each of the other {len(OTHER)} chambers: typical outside size, weight, power.', 'The same, one line per chamber instead of per model.', 'If you can', '15 minutes'),
        ('3  Documents', 'Drawings, manuals, a test graph and a few lists for the five main chambers.', 'These become the downloads and the graphs.', 'MUST', 'Send what you already have'),
        ('4  Company and services', 'Founders (names, bios, portraits), certificates, awards, GST number and links; a link to the files for each service.', 'Trust, the footer and the Verticals page.', 'MUST (founders, certificates, awards)', '20 minutes'),
        ('5  3D models', 'Nothing to fill: a tick list of the three chamber 3D models we still need, and what to send.', 'For the interactive 3D chambers.', 'For engineering', 'Read only')]
for i, (a, b, c_, d, e) in enumerate(tabs, 12):
    put(ws, i, [a, b, c_, d, e], {4: 'in' if d.startswith('MUST') else None}, 48); ws.cell(i, 1).font = f_bold
section(ws, 18, 'Please confirm (we found these in the brochure)', 5)
for i, t in enumerate(['ET1400: the brochure gives the inside size as 1400 × 1350 × 950 mm, but the same model in the EA, ETV and EO series is 1100 × 1350 × 950 mm. Which is right?',
                       'ETS: the brochure gives one set of sizes per model. Is that the size of each zone, or of the basket?',
                       'Mini chambers: which of EM30, EM64, EM80, EM100 come as bench models, and which as floor models?'], 20):
    c = ws.cell(i, 1, '?  ' + t); c.font = f_body; ws.merge_cells(start_row=i, start_column=1, end_row=i, end_column=4); c.alignment = Alignment(wrap_text=True, vertical='top'); ws.row_dimensions[i].height = 34
    a = ws.cell(i, 5); a.fill = fill_in; a.border = border
ws.cell(19, 5, 'Your answer').font = f_bold
section(ws, 24, 'Colours', 5)
for i, (txt, fl) in enumerate([('Yellow: please fill in', fill_in), ('Grey: already filled from your brochure', fill_have), ('✔  we have it     ✘  we do not (3D tab)', None)], 25):
    c = ws.cell(i, 1, txt); c.font = f_body; c.border = border
    if fl: c.fill = fl
    ws.merge_cells(start_row=i, start_column=1, end_row=i, end_column=2)

# =================== 1 Main chambers ===================
ws = wb.create_sheet('1 Main chambers')
head(ws, 1, ['Chamber', 'Model', 'Inside size W × D × H (mm)\nfrom your brochure', 'Outside size W × D × H (mm)', 'Weight (kg)', 'Power: connected load (kW)\nand current (A)', 'Cooling', 'Notes'], [26, 16, 26, 28, 14, 28, 18, 30])
r = 2
for s in MAIN:
    for m in s['models']:
        put(ws, r, [s['name'], m['name'], f"{m['w']} × {m['d']} × {m['h']}", m['ext'], m['weight'], m['load'], m['cooling'], ''], {1: 'have', 2: 'have', 3: 'have', 4: 'in', 5: 'in', 6: 'in', 7: 'in', 8: 'in'}); r += 1
dropdown(ws, f'G2:G{r - 1}', ['Air-cooled', 'Water-cooled'])
ws.cell(1, 4).comment = Comment('Overall size of the machine including its control side, as it stands on the floor. Example: 1450 × 1550 × 2100', 'Envisys')
ws.cell(1, 6).comment = Comment('Example: 9.5 kW, 16 A', 'Envisys')
ws.freeze_panes = 'C2'

# =================== 2 Other chambers ===================
ws = wb.create_sheet('2 Other chambers')
head(ws, 1, ['Chamber', 'What it is', 'Models we list', 'Outside size W × D × H (mm)\nof a typical or the largest model', 'Weight (kg)', 'Power (kW)', 'Notes'], [32, 44, 40, 30, 14, 14, 28])
for i, s in enumerate(OTHER, 2):
    put(ws, i, [s['name'], s['tagline'], ', '.join(s['listed']), '', '', '', ''], {1: 'have', 2: 'have', 3: 'have', 4: 'in', 5: 'in', 6: 'in', 7: 'in'}, 34)
ws.freeze_panes = 'B2'

# =================== 3 Documents and media ===================
ws = wb.create_sheet('3 Documents')
for col, w in zip('ABCDEFG', [52, 14, 14, 14, 14, 14, 52]): ws.column_dimensions[col].width = w
section(ws, 1, 'A.  For each main chamber, please send (a PDF or a photo of the page is fine)', 7)
head(ws, 2, ['Document'] + [s['name'].split(' ')[0] if s['slug'] != 'walk-in' else 'Walk-in' for s in MAIN] + ['Why we ask'])
docs = [('Dimension drawing: front, side and top', 'Customers plan the room from it; it becomes a download.'),
        ('Operating manual', 'Becomes a download.'),
        ('One test graph: how fast it cools and how fast it heats (a page from a test report)', 'We draw it as a chart on the page.'),
        ('Humidity operating range (temperature against % RH, as a chart)', 'The most-asked question on humidity chambers.'),
        ('List of the standards it is tested to', 'Buyers search by standard.'),
        ('List of options and accessories, with names', 'Shows what can be added.')]
for i, (d, why) in enumerate(docs, 3):
    row = [d] + [''] * len(MAIN) + [why]
    kinds = {j: 'in' for j in range(2, 2 + len(MAIN))}
    if 'Humidity' in d:
        for j, s in enumerate(MAIN, 2):
            if s['slug'] == 'ets': row[j - 1] = 'Not applicable'; kinds[j] = 'have'
    put(ws, i, row, kinds, 48)
dropdown(ws, f'B3:{get_column_letter(1 + len(MAIN))}{2 + len(docs)}', ['Sent', 'Will send', "Don't have", 'Not applicable'])
# =================== 4 Company and services ===================
ws = wb.create_sheet('4 Company and services')
for col, w in zip('ABCD', [30, 70, 14, 58]): ws.column_dimensions[col].width = w
section(ws, 1, 'A.  The company', 4)
head(ws, 2, ['Item', 'Please give us', 'Priority', 'Your answer'])
comp = [('Founders', 'Name, title and a two-line biography for each of the three. The portrait photographs are needed too.', 'MUST'),
        ('Certificates', 'ISO 9001, 14001, 45001 and the NABL certificate (PDF), with the valid-until dates.', 'MUST'),
        ('Awards', 'Year and award name for each (we have the photographs).', 'MUST'),
        ('Footer', 'GST number, and the social media links.', 'If you can')]
for i, (a, b, p) in enumerate(comp, 3):
    put(ws, i, [a, b, p, ''], {4: 'in', 3: None}, 36); ws.cell(i, 1).font = f_bold
    if p == 'MUST': ws.cell(i, 3).fill = fill_must
r0 = 3 + len(comp) + 1
section(ws, r0, 'B.  Our services (the Verticals page): for each one, paste a link to your folder or send the files', 4)
head(ws, r0 + 1, ['Service', 'Link to files', '', 'Notes'])
for k, svc in enumerate(['Rentals', 'Test lab (Vistara)', 'After-sales and AMC', 'Refurbishment', 'Buy-back', 'Design and build']):
    put(ws, r0 + 2 + k, [svc, '', '', ''], {2: 'in', 4: 'in'}, 30); ws.cell(r0 + 2 + k, 1).font = f_bold

# =================== 5 3D models ===================
ws = wb.create_sheet('5 3D models')
head(ws, 1, ['Chamber', 'Priority', 'On the website now', 'Our file on hand (STEP)', 'What to send us', 'Note'], [38, 12, 18, 22, 60, 44])
HAVE_FILE = {'et': 'ET150, ET300 and ET950', 'eta': 'EA600'}
ASK = {'et': ('Nothing', 'Live on the website (ET950). ET150 and ET300 are ready if wanted.'), 'eta': ('Nothing', 'Live on the website (EA600).'),
       'ets': ('A STEP file of ETS100 or ETS150. In SolidWorks: File, Save As, STEP AP214.', 'We have ETS100-75T.SLDASM, but a SolidWorks assembly cannot be opened without its part files.'),
       'mini': ('STEP file of an EM64 floor model (and an EM30 bench model).', ''), 'walk-in': ('STEP file of EWS10K. A simple version (box, door, control panel) is enough.', ''),
       'battery': ('STEP file of ETB950.', ''), 'vibration-chambers': ('STEP file of ETV950 with its shaker.', ''), 'salt-spray': ('STEP file of ECS 300 or ECS 900.', ''), 'dust': ('STEP file of EDC 1500.', ''), 'chillers': ('STEP file of ETC20.', '')}
P1 = ['et', 'ets', 'eta', 'mini', 'walk-in']; P2 = []
order = P1
r = 2; live = ready = 0
for slug in order:
    s = BY[slug]; pr = 1 if slug in P1 else 2 if slug in P2 else 3
    web = s['model3d']; have = slug in HAVE_FILE
    live += web; ready += (have and not web)
    ask, note = ASK.get(slug, ('STEP file of one standard model, if it is easy to export.', 'Later.'))
    put(ws, r, [s['name'], pr, '✔' if web else '✘', ('✔  ' + HAVE_FILE[slug]) if have else '✘', ask, note], {3: 'ok' if web else 'no', 4: 'ok' if have else 'no'}, 34)
    ws.cell(r, 2).alignment = center; r += 1
c = ws.cell(r + 1, 1, f'On the website now: {live} of {len(SERIES)}.   Files on hand but not yet on the website: {ready}.  '); c.font = f_bold
ws.merge_cells(start_row=r + 1, start_column=1, end_row=r + 1, end_column=6)
ws.freeze_panes = 'B2'

wb.calculation.fullCalcOnLoad = True
try:
    wb.save(OUT)
except PermissionError:  # the old copy is open in Excel
    OUT = OUT.replace('.xlsx', ' (short).xlsx'); wb.save(OUT)
print('saved', OUT, '| tabs:', wb.sheetnames, '| 3D live', live, 'ready', ready)
