# The long, internal version (every item for every chamber, 600+ rows). The sheet for the company is export_missing_data.py. Builds "Envisys - full checklist (internal).xlsx" in the repo root: every piece of data the site still needs, by chamber, by model and by page,
# so it can be handed to the company. It reads the site's own data files, so it always matches what is actually missing.
# usage (from frontend/):  python tools/export_full_checklist.py        (needs node and network for `npx esbuild` the first time)
import json, os, subprocess, sys, datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule
from openpyxl.utils import get_column_letter

HERE = os.path.dirname(os.path.abspath(__file__))
FRONT = os.path.dirname(HERE)
OUT = os.path.join(os.path.dirname(FRONT), 'Envisys - full checklist (internal).xlsx')
WORK = os.path.join(HERE, 'work')
os.makedirs(WORK, exist_ok=True)
npx = 'npx.cmd' if os.name == 'nt' else 'npx'
subprocess.run([npx, '-y', 'esbuild', 'tools/missing-entry.ts', '--bundle', '--format=esm', '--platform=node', '--outfile=tools/work/missing.mjs', '--log-level=error'], cwd=FRONT, check=True)
data = json.loads(subprocess.run(['node', 'tools/work/missing.mjs'], cwd=FRONT, check=True, capture_output=True, text=True).stdout)
SERIES = data['series']

# ---- look ----
F = 'Arial'
NAVY, ORANGE, PALE = '0D2340', 'FF6A1A', 'EAF1F9'
f_body = Font(name=F, size=10); f_bold = Font(name=F, size=10, bold=True); f_head = Font(name=F, size=10, bold=True, color='FFFFFF')
f_title = Font(name=F, size=16, bold=True, color=NAVY); f_sub = Font(name=F, size=10, italic=True, color='555555')
fill_head = PatternFill('solid', fgColor=NAVY); fill_fill = PatternFill('solid', fgColor='FFF2CC'); fill_band = PatternFill('solid', fgColor=PALE)
fill_miss = PatternFill('solid', fgColor='FCE4D6'); fill_have = PatternFill('solid', fgColor='E2F0D9'); fill_na = PatternFill('solid', fgColor='EDEDED')
thin = Side(style='thin', color='C9D4E2'); border = Border(top=thin, bottom=thin, left=thin, right=thin)
wrap = Alignment(wrap_text=True, vertical='top')

def sheet(wb, title, headers, widths, rows, fills=None, status_col=None, validate=None):
    ws = wb.create_sheet(title)
    for j, h in enumerate(headers, 1):
        c = ws.cell(1, j, h); c.font = f_head; c.fill = fill_head; c.alignment = Alignment(wrap_text=True, vertical='center'); c.border = border
    for i, r in enumerate(rows, 2):
        for j, v in enumerate(r, 1):
            c = ws.cell(i, j, v); c.font = f_body; c.alignment = wrap; c.border = border
            if fills and (i, j) in fills: c.fill = fills[(i, j)]
    for j, w in enumerate(widths, 1): ws.column_dimensions[get_column_letter(j)].width = w
    ws.freeze_panes = 'A2'; ws.auto_filter.ref = f'A1:{get_column_letter(len(headers))}{len(rows) + 1}'; ws.row_dimensions[1].height = 30
    if status_col:
        L = get_column_letter(status_col); rng = f'{L}2:{L}{len(rows) + 1}'
        dv = DataValidation(type='list', formula1='"Missing,Have,Not applicable"', allow_blank=False); ws.add_data_validation(dv); dv.add(rng)
        ws.conditional_formatting.add(rng, CellIsRule(operator='equal', formula=['"Missing"'], fill=fill_miss))
        ws.conditional_formatting.add(rng, CellIsRule(operator='equal', formula=['"Have"'], fill=fill_have))
        ws.conditional_formatting.add(rng, CellIsRule(operator='equal', formula=['"Not applicable"'], fill=fill_na))
    return ws

WHERE = {'pull': 'Performance chart on the chamber page', 'heat': 'Performance chart on the chamber page', 'uniformity': 'Performance chart on the chamber page', 'envelope': 'Operating-envelope chart on the chamber page',
         'ramp': 'Performance chart on the chamber page', 'ext': 'Data panel and downloadable data sheet', 'weight': 'Data panel and downloadable data sheet', 'door': 'Site and build data on the chamber page',
         'shelves': 'Site and build data on the chamber page', 'ports': 'Site and build data on the chamber page', 'load': 'Data panel and data sheet (needed for site planning)', 'cooling': 'Data panel and data sheet (needed for site planning)',
         'utilities': 'Site and build data on the chamber page', 'floor': 'Site and build data on the chamber page', 'clearance': 'Site and build data on the chamber page', 'ambient': 'Site and build data on the chamber page',
         'noise': 'Data panel and data sheet', 'heat': 'Site and build data on the chamber page', 'options': 'Options list on the chamber page', 'standards': 'Standards list on the chamber page',
         'drawing': 'Downloads on the chamber page', 'manual': 'Downloads on the chamber page'}
OWNER = {'Performance curves': 'Engineering / test lab (Vistara)', 'Dimensions and weight': 'Engineering / design', 'Power and utilities': 'Engineering / electrical', 'Site and noise': 'Engineering / service',
         'Options and accessories': 'Sales / product management', 'Standards and downloads': 'Quality / design'}

wb = Workbook(); wb.remove(wb.active)
wb.calculation.fullCalcOnLoad = True  # the Summary formulas are calculated when the file is opened

# ---- Read me ----
ws = wb.create_sheet('Read me')
ws.column_dimensions['A'].width = 4; ws.column_dimensions['B'].width = 30; ws.column_dimensions['C'].width = 95
ws['B2'] = 'Envisys website: data needed'; ws['B2'].font = f_title
ws['B3'] = f'Generated {datetime.date.today().strftime("%d %B %Y")} from the website\'s own data files. Re-run tools/export_missing_data.py after any update.'; ws['B3'].font = f_sub
lines = [('What this is', 'Every piece of information the website still needs, so each chamber page can answer a buyer without a phone call. Nothing here is guessed: the site shows "To come" or a "Still to come" card wherever an item below is Missing, and the item disappears from the page the moment it is supplied.'),
         ('Tabs', 'Summary: how much is missing per chamber (calculated).  Chamber data: every item for every chamber, with a status.  Models: one row per model, to fill in directly.  Site content: everything that is not chamber data.  Questions: things to confirm.'),
         ('How to fill it in', 'Type the value or a file link in the yellow cells (Chamber data → "Value / link"; Models → the yellow columns). Change Status to Have when done, or Not applicable if the item does not apply to that chamber.'),
         ('Units', 'Millimetres for sizes, kilograms for weight, kW and A for load, dB(A) for noise, °C and % RH as used in the brochure.'),
         ('Files', 'Send drawings, manuals and curves as PDF / DWG / CSV or Excel. Photographs at full size. Videos as the original file, not a screen recording.'),
         ('Colours', 'Orange = Missing · Green = Have · Grey = Not applicable · Yellow = type here.')]
for i, (a, b) in enumerate(lines, 5):
    ws.cell(i, 2, a).font = f_bold; c = ws.cell(i, 3, b); c.font = f_body; c.alignment = wrap; ws.cell(i, 2).alignment = wrap; ws.row_dimensions[i].height = 48

# ---- Chamber data ----
rows, fills = [], {}
BASE = [('Basics', 'temp', 'Temperature range (low and high, with variants)', 'Headline figures and range bar'), ('Basics', 'hum', 'Humidity range, if the chamber controls humidity', 'Headline figures and range bar'),
        ('Basics', 'models', 'Model list with interior size (W × D × H) and nominal volume', 'Model picker, table and data sheet')]
for s in SERIES:
    topic_rows = []
    if s['hasPicker']:
        topic_rows += [('Basics', 'Temperature range', 'Have', 'Headline figures and range bar'), ('Basics', 'Model list with interior size and volume', 'Have', 'Model picker, table and data sheet')]
        for n in s['needs']:
            st = 'Not applicable' if n['na'] else ('Have' if n['done'] else 'Missing')
            topic_rows.append((n['card'], n['label'], st, WHERE[n['id']]))
    else:
        has_tab = s['hasLineup'] or s['hasTables'] or s['specs'] > 1
        topic_rows += [('Basics', 'Temperature and humidity ranges', 'Have' if s['specs'] > 0 else 'Missing', 'Headline figures'),
                       ('Basics', 'Model list with interior size (W × D × H) and nominal volume', 'Have' if s['hasLineup'] else 'Missing', 'Model picker, table and data sheet')]
        for n in data['needs']:
            topic_rows.append((n['card'], n['label'], 'Missing', WHERE[n['id']]))
    topic_rows += [('Media', 'Real product photographs: front, open door, interior, in use (hero plus 3 to 4)', 'Have' if s['gallery'] >= 3 else 'Missing', 'Hero and gallery'),
                   ('Media', '3D model (STEP file) for the interactive view', 'Have' if s['model3d'] else 'Missing', 'Showcase and hover'),
                   ('Media', 'Brochure (PDF) for this series', 'Have' if s['brochure'] else 'Missing', 'Brochure link and data sheet')]
    for topic, label, st, where in topic_rows:
        r = len(rows) + 2
        rows.append([s['name'], s['group'], 'Flagship' if s['tier'] == 'main' else 'Catalogue', topic, label, where, st, '', OWNER.get(topic, 'Marketing' if topic == 'Media' else 'Engineering / product'), ''])
        fills[(r, 8)] = fill_fill
ws_c = sheet(wb, 'Chamber data', ['Chamber', 'Group', 'Tier', 'Topic', 'Data item', 'Where it shows on the site', 'Status', 'Value / link (fill here)', 'Likely owner', 'Notes'],
             [30, 24, 11, 22, 62, 40, 14, 40, 28, 28], rows, fills, status_col=7)
n_rows = len(rows) + 1

# ---- Summary (calculated from Chamber data) ----
ws = wb.create_sheet('Summary', 1)
for j, h in enumerate(['Chamber', 'Group', 'Tier', 'Spec page', 'Missing', 'Have', 'Not applicable', '% complete'], 1):
    c = ws.cell(1, j, h); c.font = f_head; c.fill = fill_head; c.border = border; c.alignment = Alignment(wrap_text=True, vertical='center')
for i, s in enumerate(SERIES, 2):
    ws.cell(i, 1, s['name']); ws.cell(i, 2, s['group']); ws.cell(i, 3, 'Flagship' if s['tier'] == 'main' else 'Catalogue'); ws.cell(i, 4, 'Redesigned (picker, table, data sheet)' if s['hasPicker'] else 'Basic list')
    for col, status in ((5, 'Missing'), (6, 'Have'), (7, 'Not applicable')):
        ws.cell(i, col, f"=COUNTIFS('Chamber data'!$A$2:$A${n_rows},$A{i},'Chamber data'!$G$2:$G${n_rows},\"{status}\")")
    ws.cell(i, 8, f'=IF(F{i}+E{i}=0,0,F{i}/(F{i}+E{i}))'); ws.cell(i, 8).number_format = '0%'
    for j in range(1, 9): ws.cell(i, j).font = f_body; ws.cell(i, j).border = border; ws.cell(i, j).alignment = Alignment(vertical='top', wrap_text=True)
last = len(SERIES) + 1; t = last + 1
ws.cell(t, 1, 'All chambers').font = f_bold
for col in (5, 6, 7): ws.cell(t, col, f'=SUM({get_column_letter(col)}2:{get_column_letter(col)}{last})').font = f_bold
ws.cell(t, 8, f'=IF(F{t}+E{t}=0,0,F{t}/(F{t}+E{t}))').font = f_bold; ws.cell(t, 8).number_format = '0%'
for j in range(1, 9): ws.cell(t, j).border = border; ws.cell(t, j).fill = fill_band
for j, w in enumerate([34, 26, 12, 36, 10, 10, 15, 12], 1): ws.column_dimensions[get_column_letter(j)].width = w
ws.freeze_panes = 'A2'; ws.row_dimensions[1].height = 30
ws.cell(t + 2, 1, '% complete = Have ÷ (Have + Missing); Not applicable items are left out. All figures are calculated from the Chamber data tab.').font = f_sub

# ---- Models ----
mrows, mfills = [], {}
for s in SERIES:
    for m in (s['models'] or []):
        r = len(mrows) + 2
        mrows.append([s['name'], m['name'], f"{m['w']} × {m['d']} × {m['h']}", m['volume'], m['ext'], m['weight'], m['load'], m['cooling'], m['noise']])
        for col, key in ((5, 'ext'), (6, 'weight'), (7, 'load'), (8, 'cooling'), (9, 'noise')):
            if not m[key]: mfills[(r, col)] = fill_fill
sheet(wb, 'Models', ['Chamber', 'Model', 'Interior W × D × H (mm), from the brochure', 'Nominal volume', 'External size W × D × H (mm)', 'Net weight (kg)', 'Connected load (kW) and current (A)', 'Cooling (air or water, flow and temperature)', 'Noise (dB(A))'],
      [28, 18, 26, 16, 26, 16, 26, 34, 14], mrows, mfills)

# ---- Site content ----
SITE = [
 ('All pages', 'Contact', 'Phone number and WhatsApp number to publish (click-to-call and WhatsApp buttons on mobile)', 'Number(s), and which team answers each', 'Sales'),
 ('All pages', 'Contact', 'Official email addresses by purpose: sales, service, rentals, careers', 'Email list', 'Admin'),
 ('All pages', 'Contact', 'Where quote requests should go (inbox or CRM) and the auto-reply wording', 'Address, text', 'Sales'),
 ('Footer', 'Legal', 'Registered company name, CIN and GSTIN, registered address; social media links', 'Text and URLs', 'Admin'),
 ('Footer', 'Legal', 'Privacy policy and terms of use text', 'Document (or approval to use a standard template)', 'Admin'),
 ('Landing', 'Media', 'Short film: a 10 to 15 second silent loop (and, if wanted, a longer film), cut from the hollow-shot footage', 'MP4 original, 1080p or better', 'Marketing'),
 ('Landing and About', 'Trust', 'Written permission for each client logo shown, and a list of which to show (34 logos are on file)', 'List, permissions', 'Sales'),
 ('Landing', 'Trust', 'Each testimonial with full name, role, company and permission to publish (currently Google-review first names)', 'Text, permission', 'Sales'),
 ('About', 'People', 'The three founders: full names, titles, a short biography, years of experience, and professional portraits on a plain background', 'Text, JPG at full size', 'Directors'),
 ('About', 'People', 'Team photo caption, head count and, if wanted, names of department heads', 'Text', 'HR'),
 ('About', 'Trust', 'Awards: year, awarding body and award name for each, with scans of the certificates', 'Text, PDF or JPG', 'Admin'),
 ('About', 'Trust', 'ISO 9001, 14001 and 45001 certificates and the NABL accreditation certificate, with valid-until dates', 'PDF', 'Quality'),
 ('About', 'Company', 'Company timeline since 2014: milestones with years', 'Text', 'Directors'),
 ('About (map)', 'Locations', 'Exact address, opening hours and a Google Maps link for each unit (SB-58, SB-118, SB-37, C-426); confirm which buildings belong to which unit', 'Text, links', 'Admin'),
 ('Verticals: Design and build', 'Service', 'Process in 3 to 5 steps, typical lead time, examples of custom work', 'Text, photos', 'Engineering'),
 ('Verticals: Test lab (Vistara)', 'Service', 'NABL scope of accreditation (PDF), the list of tests and standards covered, how to book, turnaround time, a sample report', 'PDF, text', 'Vistara lab'),
 ('Verticals: Rentals', 'Service', 'Which chambers can be rented, minimum period, terms, deposit, delivery and installation, and whether prices are shown or on request', 'Text, price policy', 'Sales'),
 ('Verticals: After-sales and AMC', 'Service', 'AMC plans and what each covers, response times, cities covered', 'Text', 'Service'),
 ('Verticals: Refurbishment', 'Service', 'Scope, process, warranty and before-and-after photographs of a real job', 'Text, photos', 'Service'),
 ('Verticals: Buy-back', 'Service', 'Eligibility, how an old chamber is valued, how the process runs', 'Text', 'Sales'),
 ('In stock', 'Stock', 'The chart of chambers kept in stock: model, quantity, lead time, location, whether to show price, and how often it is updated', 'Excel', 'Sales'),
 ('Industries', 'Media', 'Photographs from real client sites or Envisys work for Automotive, Aerospace, Defence, Electronics, EV and Energy (the current ones are public-domain stock)', 'JPG at full size, with client permission', 'Marketing'),
 ('Industries', 'Trust', 'One case study per industry: client (if allowed), test, chamber used, result', 'Text, photos', 'Sales'),
 ('Products (all)', 'Media', 'Videos of chambers running: door opening, control screen, a test in progress', 'MP4 originals', 'Marketing'),
 ('Products (all)', 'Policy', 'Whether prices or price ranges are shown, and the lead time to show for standard models', 'Decision', 'Directors'),
 ('Resources', 'Content', 'Which blog posts and white papers to keep; new topics wanted', 'List, documents', 'Marketing'),
 ('Careers', 'Content', 'Open positions with job descriptions, and where applications go', 'Text', 'HR'),
 ('SEO', 'Search', 'Target keywords and target cities or industries; competitor sites to watch', 'List', 'Marketing'),
 ('SEO', 'Search', 'Domain name and hosting details; access to Google Search Console and Analytics (or permission to create them)', 'Accounts', 'Admin'),
 ('Languages', 'Content', 'Whether other languages are wanted (Hindi, others) and who will supply the translations', 'Decision', 'Directors')]
sheet(wb, 'Site content', ['Page', 'Type', 'What we need', 'Format', 'Likely owner', 'Status', 'Value / link (fill here)', 'Notes'],
      [26, 12, 90, 30, 18, 14, 40, 28], [[a, b, c, d, e, 'Missing', '', ''] for a, b, c, d, e in SITE], {(i, 7): fill_fill for i in range(2, len(SITE) + 2)}, status_col=6)

# ---- Questions ----
Q = [('ET1400 interior size', 'The brochure prints 1400 × 1350 × 950 mm for ET1400, but the same model in the EA, ETV and EO series is 1100 × 1350 × 950 mm. Which is right? The site currently shows the printed value.'),
     ('Volume figures', 'Volumes on the site are the nominal ones from the model names (ET300 = 300 L). Confirm that is how to present them.'),
     ('ETS100 file', 'ETS100-75T.SLDASM is a SolidWorks assembly that only links to part files. Please export it as STEP (File, Save As, STEP AP214) so a 3D model can be made.'),
     ('Door hinge side', 'We assumed the main door of ET and EA chambers hinges on the left, from the photographs. Confirm.'),
     ('ETS dimensions', 'The brochure gives one set of dimensions per ETS model. Is that each zone, or the basket? The site says "each zone".'),
     ('Mini chambers', 'Which of EM30, EM64, EM80 and EM100 come as bench models and which as floor models? (EM64 is listed as both.)'),
     ('Phone and email', 'Confirm +91 99000 14150 and enquiry@envisystech.com are the numbers and address to publish.'),
     ('Canva design', 'The Canva specification design link needs a login. Please share a view-only link or export it as PDF.'),
     ('Founders', 'Names of the second and third founder (only Ramesh is named so far).')]
sheet(wb, 'Questions', ['Topic', 'Question', 'Answer'], [26, 110, 50], [[a, b, ''] for a, b in Q], {(i, 3): fill_fill for i in range(2, len(Q) + 2)})

wb.move_sheet('Read me', offset=-wb.index(wb['Read me']))
wb.save(OUT)
print('saved', OUT)
