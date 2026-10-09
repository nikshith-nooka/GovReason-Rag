import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Circle, Polygon, Rectangle, Arc
import numpy as np

# Set figure size and DPI to match high-resolution IEEE graphic
fig = plt.figure(figsize=(9.0, 9.0), dpi=300)
ax = fig.add_subplot(111)
ax.set_facecolor('#FFFFFF')
fig.patch.set_facecolor('#FFFFFF')
ax.axis('off')
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)

# Colors matching the reference image aesthetic
CARD_EDGE = '#0E2A3A'       # Deep slate navy border
CARD_BG = '#FFFFFF'         # Crisp white card interior
ICON_STROKE = '#0E2A3A'     # Dark navy line art
ICON_FILL_BLUE = '#D9E8F5'  # Soft light blue accent fill
ICON_FILL_TEAL = '#BCE3DE'  # Soft light teal accent fill
ICON_FILL_AMBER = '#FCE8C5' # Soft light amber
ICON_FILL_RED = '#FCDAD7'   # Soft light red
ARROW_COLOR = '#0E2A3A'     # Crisp dark arrow color
TEXT_MAIN = '#0A1C2A'       # Bold title text
TEXT_SUB = '#4A6273'        # Muted subtitle text

# -------------------------------------------------------------
# HELPER: Rounded Card with Outer Label Below (Zero Text Overlap!)
# -------------------------------------------------------------
def draw_stage_card(cx, cy, w, h, title, subtitle):
    # Card box
    x = cx - w / 2
    y = cy - h / 2
    box = FancyBboxPatch((x, y), w, h,
                         boxstyle="round,pad=0.2,rounding_size=2.0",
                         facecolor=CARD_BG, edgecolor=CARD_EDGE,
                         linewidth=1.6, zorder=2)
    ax.add_patch(box)
    
    # Text labels strictly OUTSIDE and BELOW the card
    ax.text(cx, y - 2.8, title, ha='center', va='top',
            fontsize=9.5, fontweight='bold', color=TEXT_MAIN, zorder=5)
    if subtitle:
        ax.text(cx, y - 5.6, subtitle, ha='center', va='top',
                fontsize=7.5, color=TEXT_SUB, zorder=5)

# -------------------------------------------------------------
# ICON DRAWING FUNCTIONS
# -------------------------------------------------------------

# 1. Top-Right: Citizen Case Ingestion (Clipboard, ID card, DB cylinders)
def draw_icon_ingestion(cx, cy):
    # Clipboard
    cb_w, cb_h = 7.0, 9.5
    cb_x, cb_y = cx - 7.5, cy - cb_h/2
    cb = FancyBboxPatch((cb_x, cb_y), cb_w, cb_h, boxstyle="round,pad=0.1,rounding_size=0.6",
                        facecolor=ICON_FILL_BLUE, edgecolor=ICON_STROKE, linewidth=1.3, zorder=3)
    ax.add_patch(cb)
    # Clip on top
    clip = FancyBboxPatch((cb_x + 1.8, cb_y + cb_h - 0.8), 3.4, 1.6, boxstyle="round,pad=0.1,rounding_size=0.3",
                          facecolor=CARD_BG, edgecolor=ICON_STROKE, linewidth=1.2, zorder=4)
    ax.add_patch(clip)
    # Cross on paper
    ax.plot([cb_x + 3.5, cb_x + 3.5], [cb_y + 6.0, cb_y + 7.6], color=ICON_STROKE, lw=1.3, zorder=4)
    ax.plot([cb_x + 2.7, cb_x + 4.3], [cb_y + 6.8, cb_y + 6.8], color=ICON_STROKE, lw=1.3, zorder=4)
    # Text lines on clipboard
    for ly in [cb_y + 4.5, cb_y + 3.2, cb_y + 1.9]:
        ax.plot([cb_x + 1.5, cb_x + cb_w - 1.5], [ly, ly], color=ICON_STROKE, lw=1.0, zorder=4)
        
    # ID Card / Profile in center
    id_w, id_h = 6.5, 7.5
    id_x, id_y = cx + 0.2, cy - 4.2
    id_box = FancyBboxPatch((id_x, id_y), id_w, id_h, boxstyle="round,pad=0.1,rounding_size=0.5",
                            facecolor=CARD_BG, edgecolor=ICON_STROKE, linewidth=1.2, zorder=3)
    ax.add_patch(id_box)
    ax.text(cx + 3.5, id_y + 4.5, "ID", ha='center', va='center', fontsize=8, fontweight='bold', color=ICON_STROKE, zorder=4)
    ax.text(cx + 3.5, id_y + 2.2, "PROFILE", ha='center', va='center', fontsize=5.5, fontweight='bold', color=ICON_STROKE, zorder=4)

    # Database cylinders stack (right)
    for dy in [cy + 2.5, cy - 0.5]:
        cyl = FancyBboxPatch((cx + 7.5, dy), 4.5, 2.2, boxstyle="round,pad=0.1,rounding_size=0.8",
                             facecolor=ICON_FILL_TEAL, edgecolor=ICON_STROKE, linewidth=1.2, zorder=3)
        ax.add_patch(cyl)
        # Cylinder lines
        ax.plot([cx + 7.5, cx + 12.0], [dy + 1.1, dy + 1.1], color=ICON_STROKE, lw=0.8, zorder=4)

# 2. Top-Left: Context Normalization & Cloud Index (Cloud with upload arrow + stacked papers)
def draw_icon_normalization(cx, cy):
    # Cloud on left
    c_base_x, c_base_y = cx - 8.0, cy - 3.5
    # Draw cloud body using overlapping circles and a base
    c1 = Circle((cx - 5.0, cy + 1.5), 2.6, facecolor=ICON_FILL_BLUE, edgecolor=ICON_STROKE, lw=1.2, zorder=3)
    c2 = Circle((cx - 2.5, cy + 3.0), 3.0, facecolor=ICON_FILL_BLUE, edgecolor=ICON_STROKE, lw=1.2, zorder=3)
    c3 = Circle((cx + 0.2, cy + 1.5), 2.4, facecolor=ICON_FILL_BLUE, edgecolor=ICON_STROKE, lw=1.2, zorder=3)
    base = FancyBboxPatch((cx - 7.5, cy - 1.5), 10.0, 3.2, boxstyle="round,pad=0.1,rounding_size=1.0",
                          facecolor=ICON_FILL_BLUE, edgecolor=ICON_STROKE, lw=1.2, zorder=3)
    ax.add_patch(c1); ax.add_patch(c2); ax.add_patch(c3); ax.add_patch(base)
    # Upload arrow inside cloud
    ax.annotate('', xy=(cx - 2.5, cy + 2.0), xytext=(cx - 2.5, cy - 2.0),
                arrowprops=dict(arrowstyle="->", color=ICON_STROKE, lw=1.8), zorder=5)

    # Stacked normalized documents on right
    for ox, oy, bg in [(cx + 2.5, cy - 3.0, CARD_BG), (cx + 4.5, cy - 1.5, ICON_FILL_TEAL)]:
        doc = FancyBboxPatch((ox, oy), 5.5, 7.5, boxstyle="round,pad=0.1,rounding_size=0.4",
                             facecolor=bg, edgecolor=ICON_STROKE, lw=1.2, zorder=4)
        ax.add_patch(doc)
        # Sanitized cross
        ax.plot([ox + 2.7, ox + 2.7], [oy + 5.0, oy + 6.2], color=ICON_STROKE, lw=1.2, zorder=5)
        ax.plot([ox + 2.1, ox + 3.3], [oy + 5.6, oy + 5.6], color=ICON_STROKE, lw=1.2, zorder=5)
        ax.text(ox + 2.7, oy + 3.2, "CLEAN", ha='center', va='center', fontsize=4.8, fontweight='bold', color=ICON_STROKE, zorder=5)
        ax.plot([ox + 1.2, ox + 4.3], [oy + 1.8, oy + 1.8], color=ICON_STROKE, lw=0.9, zorder=5)

# 3. Middle-Left: Policy Knowledge Graph & Bi-Temporal Filter (Gazette doc + Timeline Clock/Calendar)
def draw_icon_temporal_graph(cx, cy):
    # Gazette document on left
    g_w, g_h = 7.0, 9.5
    g_x, g_y = cx - 8.0, cy - g_h/2
    doc = FancyBboxPatch((g_x, g_y), g_w, g_h, boxstyle="round,pad=0.1,rounding_size=0.5",
                         facecolor=ICON_FILL_BLUE, edgecolor=ICON_STROKE, lw=1.3, zorder=3)
    ax.add_patch(doc)
    # Gazette emblem / header
    ax.text(g_x + g_w/2, g_y + 7.5, "GAZETTE", ha='center', va='center', fontsize=5.0, fontweight='bold', color=ICON_STROKE, zorder=4)
    ax.plot([g_x + 1.2, g_x + g_w - 1.2], [g_y + 6.2, g_y + 6.2], color=ICON_STROKE, lw=1.0, zorder=4)
    # Document text lines
    for ly in [g_y + 4.8, g_y + 3.5, g_y + 2.2]:
        ax.plot([g_x + 1.2, g_x + g_w - 1.2], [ly, ly], color=ICON_STROKE, lw=0.8, zorder=4)

    # Clock / Timeline circle on right
    clock = Circle((cx + 4.5, cy + 0.5), 4.2, facecolor=ICON_FILL_AMBER, edgecolor=ICON_STROKE, lw=1.3, zorder=4)
    ax.add_patch(clock)
    # Clock hands
    ax.plot([cx + 4.5, cx + 4.5], [cy + 0.5, cy + 3.0], color=ICON_STROKE, lw=1.4, zorder=5)
    ax.plot([cx + 4.5, cx + 6.5], [cy + 0.5, cy + 0.5], color=ICON_STROKE, lw=1.4, zorder=5)
    # Hour markers
    for angle in [0, 90, 180, 270]:
        rad = np.radians(angle)
        px = cx + 4.5 + 3.4 * np.cos(rad)
        py = cy + 0.5 + 3.4 * np.sin(rad)
        ax.plot([px, px - 0.7 * np.cos(rad)], [py, py - 0.7 * np.sin(rad)], color=ICON_STROKE, lw=1.1, zorder=5)
    ax.text(cx + 4.5, cy - 3.2, "t_gaz <= t_eval", ha='center', va='center', fontsize=5.5, fontweight='bold', color=ICON_STROKE, zorder=5)

# 4. Center: Critical Coverage Gatekeeper (Large Security Shield + Checkmark + Invariant badge)
def draw_icon_gatekeeper(cx, cy):
    # Connected neural / constraint graph on top of shield
    pts = [(cx - 4.5, cy + 4.5), (cx, cy + 6.5), (cx + 4.5, cy + 4.5), (cx, cy + 2.5)]
    for p1 in pts:
        for p2 in pts:
            ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color='#7A9BB0', lw=0.8, zorder=3)
    for p in pts:
        dot = Circle(p, 0.9, facecolor=ICON_FILL_TEAL, edgecolor=ICON_STROKE, lw=1.1, zorder=4)
        ax.add_patch(dot)

    # Security Shield
    shield_pts = [
        (cx - 4.5, cy + 1.2),
        (cx + 4.5, cy + 1.2),
        (cx + 4.5, cy - 2.2),
        (cx, cy - 5.5),
        (cx - 4.5, cy - 2.2)
    ]
    shield = Polygon(shield_pts, closed=True, facecolor=ICON_FILL_TEAL, edgecolor=ICON_STROKE, lw=1.5, zorder=5)
    ax.add_patch(shield)

    # Checkmark circle inside shield
    chk_c = Circle((cx, cy - 1.2), 2.0, facecolor=CARD_BG, edgecolor=ICON_STROKE, lw=1.2, zorder=6)
    ax.add_patch(chk_c)
    # Checkmark tick
    ax.plot([cx - 0.9, cx - 0.2, cx + 1.0], [cy - 1.2, cy - 1.9, cy - 0.5], color='#1B5E20', lw=1.8, zorder=7)
    # Badge under shield
    badge = FancyBboxPatch((cx - 4.2, cy - 6.8), 8.4, 2.0, boxstyle="round,pad=0.1,rounding_size=0.4",
                           facecolor=CARD_BG, edgecolor=ICON_STROKE, lw=1.0, zorder=7)
    ax.add_patch(badge)
    ax.text(cx, cy - 5.8, "κ_crit = 1.0", ha='center', va='center', fontsize=6.2, fontweight='bold', color=ICON_STROKE, zorder=8)

# 5. Middle-Right: AST Boolean Rule Engine (Syntax Tree + Logic Gate + Math inequality)
def draw_icon_ast_engine(cx, cy):
    # Hierarchy nodes (Tree)
    root = (cx, cy + 4.5)
    left = (cx - 5.0, cy + 0.0)
    right = (cx + 5.0, cy + 0.0)
    sub1 = (cx - 6.5, cy - 4.5)
    sub2 = (cx - 3.5, cy - 4.5)
    sub3 = (cx + 5.0, cy - 4.5)

    # Connecting branch lines
    for p1, p2 in [(root, left), (root, right), (left, sub1), (left, sub2), (right, sub3)]:
        ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color=ICON_STROKE, lw=1.2, zorder=3)

    # Nodes with logic symbols
    tree_nodes = [
        (root, "AND", ICON_FILL_AMBER),
        (left, "<=", ICON_FILL_TEAL),
        (right, ">=", ICON_FILL_TEAL),
        (sub1, "Inc", CARD_BG),
        (sub2, "Age", CARD_BG),
        (sub3, "Cat", CARD_BG),
    ]
    for pt, txt, bg in tree_nodes:
        node = Circle(pt, 1.8, facecolor=bg, edgecolor=ICON_STROKE, lw=1.2, zorder=4)
        ax.add_patch(node)
        ax.text(pt[0], pt[1], txt, ha='center', va='center', fontsize=5.5, fontweight='bold', color=ICON_STROKE, zorder=5)

# 6. Bottom-Right: Statutory Verification & Official Mirror (Gazette Stamp & Scale of Justice)
def draw_icon_verification(cx, cy):
    # Scale of Justice
    base_x, base_y = cx - 4.5, cy - 5.0
    # Central pillar
    ax.plot([cx - 4.5, cx - 4.5], [cy - 5.0, cy + 4.5], color=ICON_STROKE, lw=1.5, zorder=3)
    ax.plot([cx - 6.5, cx - 2.5], [cy - 5.0, cy - 5.0], color=ICON_STROKE, lw=1.5, zorder=3) # base
    # Beam
    ax.plot([cx - 8.5, cx - 0.5], [cy + 3.8, cy + 3.8], color=ICON_STROKE, lw=1.4, zorder=3)
    # Left pan
    ax.plot([cx - 8.5, cx - 9.5], [cy + 3.8, cy + 0.8], color=ICON_STROKE, lw=0.9, zorder=3)
    ax.plot([cx - 8.5, cx - 7.5], [cy + 3.8, cy + 0.8], color=ICON_STROKE, lw=0.9, zorder=3)
    pan1 = Arc((cx - 8.5, cy + 0.8), 2.4, 1.4, theta1=180, theta2=360, edgecolor=ICON_STROKE, lw=1.2, zorder=4)
    ax.add_patch(pan1)
    # Right pan
    ax.plot([cx - 0.5, cx - 1.5], [cy + 3.8, cy + 0.8], color=ICON_STROKE, lw=0.9, zorder=3)
    ax.plot([cx - 0.5, cx + 0.5], [cy + 3.8, cy + 0.8], color=ICON_STROKE, lw=0.9, zorder=3)
    pan2 = Arc((cx - 0.5, cy + 0.8), 2.4, 1.4, theta1=180, theta2=360, edgecolor=ICON_STROKE, lw=1.2, zorder=4)
    ax.add_patch(pan2)

    # Official Seal / Stamp on right
    seal = Circle((cx + 5.2, cy - 0.5), 3.8, facecolor=ICON_FILL_TEAL, edgecolor=ICON_STROKE, lw=1.3, zorder=4)
    ax.add_patch(seal)
    # Inner star / rosette ring
    seal_in = Circle((cx + 5.2, cy - 0.5), 3.0, facecolor=CARD_BG, edgecolor=ICON_STROKE, lw=1.0, linestyle='--', zorder=5)
    ax.add_patch(seal_in)
    ax.text(cx + 5.2, cy + 0.4, "VERIFIED", ha='center', va='center', fontsize=4.8, fontweight='bold', color=ICON_STROKE, zorder=6)
    ax.text(cx + 5.2, cy - 1.2, "gov.in", ha='center', va='center', fontsize=5.2, fontweight='bold', color='#1B5E20', zorder=6)

# 7. Bottom-Left: Real-Time Governance Dashboard (Laptop displaying telemetry & verdict)
def draw_icon_dashboard(cx, cy):
    # Laptop screen
    scr_w, scr_h = 13.0, 8.5
    scr_x, scr_y = cx - scr_w/2, cy - 2.5
    scr = FancyBboxPatch((scr_x, scr_y), scr_w, scr_h, boxstyle="round,pad=0.1,rounding_size=0.6",
                         facecolor=CARD_BG, edgecolor=ICON_STROKE, lw=1.4, zorder=3)
    ax.add_patch(scr)
    # Inner screen area
    scr_in = Rectangle((scr_x + 0.8, scr_y + 0.8), scr_w - 1.6, scr_h - 1.6,
                       facecolor=ICON_FILL_BLUE, edgecolor=ICON_STROKE, lw=0.8, zorder=4)
    ax.add_patch(scr_in)

    # Content on screen: Bar chart
    bars_x = [scr_x + 1.8, scr_x + 3.2, scr_x + 4.6]
    bars_h = [2.2, 4.2, 3.4]
    for bx, bh in zip(bars_x, bars_h):
        b = Rectangle((bx, scr_y + 1.4), 0.9, bh, facecolor='#1E7E56', edgecolor=ICON_STROKE, lw=0.6, zorder=5)
        ax.add_patch(b)

    # Line graph / Pareto curve on right side of screen
    ax.plot([scr_x + 6.5, scr_x + 8.2, scr_x + 10.5], [scr_y + 2.0, scr_y + 4.8, scr_y + 5.5],
            color='#C2185B', lw=1.2, marker='o', markersize=2.5, zorder=5)

    # Laptop keyboard base
    base_w, base_h = 16.0, 1.4
    base_x, base_y = cx - base_w/2, cy - 3.8
    base = FancyBboxPatch((base_x, base_y), base_w, base_h, boxstyle="round,pad=0.1,rounding_size=0.3",
                          facecolor='#B0BEC5', edgecolor=ICON_STROKE, lw=1.4, zorder=3)
    ax.add_patch(base)
    # Trackpad
    tp = FancyBboxPatch((cx - 1.8, base_y + 0.2), 3.6, 0.8, boxstyle="round,pad=0.05,rounding_size=0.1",
                        facecolor=CARD_BG, edgecolor=ICON_STROKE, lw=0.7, zorder=4)
    ax.add_patch(tp)


# -------------------------------------------------------------
# PLACEMENT OF THE 7 CARDS (3x3 Grid Layout)
# -------------------------------------------------------------
CW, CH = 24.0, 16.5

pos_norm = (22.0, 83.0)        # Top-Left
pos_ingest = (78.0, 83.0)      # Top-Right

pos_temp = (22.0, 49.0)        # Middle-Left
pos_gate = (50.0, 49.0)        # Center
pos_ast = (78.0, 49.0)         # Middle-Right

pos_dash = (22.0, 15.0)        # Bottom-Left
pos_verify = (78.0, 15.0)      # Bottom-Right

# Draw the 7 cards
draw_stage_card(pos_ingest[0], pos_ingest[1], CW, CH,
                "Citizen Case Ingestion", "Query Q + Context C (Income, Age, Nativity)")
draw_icon_ingestion(pos_ingest[0], pos_ingest[1])

draw_stage_card(pos_norm[0], pos_norm[1], CW, CH,
                "Context Normalization & Retrieval", "BM25 Sparse + BGE Dense RRF (k=60)")
draw_icon_normalization(pos_norm[0], pos_norm[1])

draw_stage_card(pos_temp[0], pos_temp[1], CW, CH,
                "Bi-Temporal Policy Graph", "Gazette Enforceability: t_gaz <= t_eval <= t_end")
draw_icon_temporal_graph(pos_temp[0], pos_temp[1])

draw_stage_card(pos_gate[0], pos_gate[1], CW, CH,
                "Coverage Gatekeeper", "Critical Evidence Invariant: κ_crit == 1.0")
draw_icon_gatekeeper(pos_gate[0], pos_gate[1])

draw_stage_card(pos_ast[0], pos_ast[1], CW, CH,
                "AST Boolean Rule Engine", "Deterministic Symbolic Arithmetic (<=, >=, ==)")
draw_icon_ast_engine(pos_ast[0], pos_ast[1])

draw_stage_card(pos_verify[0], pos_verify[1], CW, CH,
                "Statutory Verification & Mirror", "Dead-Link Recovery to Verified Gazette Mirrors")
draw_icon_verification(pos_verify[0], pos_verify[1])

draw_stage_card(pos_dash[0], pos_dash[1], CW, CH,
                "Real-Time Civic AI Dashboard", "Verified Entitlement Verdicts & Audit Traces")
draw_icon_dashboard(pos_dash[0], pos_dash[1])


# -------------------------------------------------------------
# ORTHOGONAL CONNECTING ARROWS (Matching Ref Image Clean Elbow Flow)
# -------------------------------------------------------------
def draw_arrow(p1, p2, lw=1.6, color=ARROW_COLOR, style='-'):
    ax.annotate('', xy=p2, xytext=p1,
                arrowprops=dict(arrowstyle="->", color=color, lw=lw, linestyle=style), zorder=1)

# 1. From Case Ingestion (Top-Right) to Context Normalization (Top-Left)
draw_arrow((pos_ingest[0] - CW/2 - 0.2, pos_ingest[1]),
           (pos_norm[0] + CW/2 + 0.2, pos_norm[1]))

# 2. From Normalization (Top-Left) down to Bi-Temporal Graph (Middle-Left) via side elbow
# Go down from left edge of Top-Left card to top of Middle-Left card
ax.plot([pos_norm[0] - CW/2 + 3.0, pos_norm[0] - CW/2 + 3.0], [pos_norm[1] - CH/2, 63.0],
        color=ARROW_COLOR, lw=1.6, zorder=1)
ax.plot([pos_norm[0] - CW/2 + 3.0, pos_temp[0]], [63.0, 63.0],
        color=ARROW_COLOR, lw=1.6, zorder=1)
draw_arrow((pos_temp[0], 63.0), (pos_temp[0], pos_temp[1] + CH/2 + 0.2))

# 3. From Bi-Temporal Graph (Middle-Left) to Coverage Gatekeeper (Center)
draw_arrow((pos_temp[0] + CW/2 + 0.2, pos_temp[1]),
           (pos_gate[0] - CW/2 - 0.2, pos_gate[1]))

# 4. From Gatekeeper (Center) to AST Rule Engine (Middle-Right)
draw_arrow((pos_gate[0] + CW/2 + 0.2, pos_gate[1]),
           (pos_ast[0] - CW/2 - 0.2, pos_ast[1]))

# 5. From AST Rule Engine (Middle-Right) down to Statutory Verification (Bottom-Right) via side elbow
ax.plot([pos_ast[0] + CW/2 - 3.0, pos_ast[0] + CW/2 - 3.0], [pos_ast[1] - CH/2, 29.0],
        color=ARROW_COLOR, lw=1.6, zorder=1)
ax.plot([pos_ast[0] + CW/2 - 3.0, pos_verify[0]], [29.0, 29.0],
        color=ARROW_COLOR, lw=1.6, zorder=1)
draw_arrow((pos_verify[0], 29.0), (pos_verify[0], pos_verify[1] + CH/2 + 0.2))

# 6. From Statutory Verification (Bottom-Right) to Governance Dashboard (Bottom-Left)
draw_arrow((pos_verify[0] - CW/2 - 0.2, pos_verify[1]),
           (pos_dash[0] + CW/2 + 0.2, pos_dash[1]))

# 7. Fallback Loop: Forced Abstention from Gatekeeper (Dashed Rose Line)
ax.plot([pos_gate[0], pos_gate[0]], [pos_gate[1] - CH/2, 25.0],
        color='#C2185B', lw=1.4, linestyle='--', zorder=1)
ax.plot([pos_gate[0], pos_dash[0]], [25.0, 25.0],
        color='#C2185B', lw=1.4, linestyle='--', zorder=1)
draw_arrow((pos_dash[0], 25.0), (pos_dash[0], pos_dash[1] + CH/2 + 0.2), lw=1.4, color='#C2185B', style='--')

ax.text(pos_gate[0] - 2.0, 27.0, "Forced Abstention (κ < 1.0)",
        ha='center', va='bottom', fontsize=7.2, fontweight='bold', color='#C2185B',
        bbox=dict(boxstyle='round,pad=0.2', facecolor='#FFF0F2', edgecolor='#C2185B', lw=0.7), zorder=6)

plt.tight_layout()
plt.savefig('docs/paper/figures/fig1_workflow_pipeline.png', dpi=300, bbox_inches='tight')
plt.savefig('docs/paper/figures/fig1_workflow_pipeline.pdf', bbox_inches='tight')
plt.close()
print("SUCCESS: Master Ref-Style Fig 1 Generated!")
