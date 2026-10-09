import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import numpy as np

# IEEE standard typography & style
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Helvetica']
plt.rcParams['font.size'] = 8.0
plt.rcParams['axes.labelsize'] = 8.5
plt.rcParams['axes.titlesize'] = 9.0
plt.rcParams['xtick.labelsize'] = 7.5
plt.rcParams['ytick.labelsize'] = 7.5
plt.rcParams['legend.fontsize'] = 7.5
plt.rcParams['axes.linewidth'] = 0.8
plt.rcParams['grid.linewidth'] = 0.5
plt.rcParams['grid.alpha'] = 0.5

# =====================================================================
# FIGURE 1: Professional System Architecture & Evidence Contract Flow
# =====================================================================
fig = plt.figure(figsize=(7.16, 2.9), dpi=300)
ax = fig.add_subplot(111)
ax.axis('off')
ax.set_xlim(0, 100)
ax.set_ylim(0, 42)

# Professional palettes
c_input = ('#EBF3FA', '#1D63A8')       # Light blue
c_retrieval = ('#F0F7F4', '#1E7E56')   # Soft mint
c_temporal = ('#F4F1FB', '#5E35B1')    # Soft purple
c_gate = ('#FEF8EC', '#C47D0B')        # Soft amber
c_engine = ('#E8F5E9', '#1B5E20')      # Sage green
c_abstain = ('#FCE4EC', '#C2185B')     # Rose alert
c_verdict = ('#E0F2F1', '#004D40')     # Deep teal verdict

def draw_box(x, y, w, h, title, subtitle, colors, ax, title_size=7.5, sub_size=6.3):
    bg, border = colors
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2,rounding_size=1.2",
                         facecolor=bg, edgecolor=border, linewidth=1.2, zorder=2)
    ax.add_patch(box)
    ax.text(x + w/2, y + h*0.64, title, ha='center', va='center',
            fontsize=title_size, fontweight='bold', color='#111111', zorder=3)
    ax.text(x + w/2, y + h*0.30, subtitle, ha='center', va='center',
            fontsize=sub_size, color='#333333', zorder=3, linespacing=1.2)

# Top Pipeline: 5 neatly spaced boxes
# Coordinates: x, y, w, h
w_top = 16.5
h_top = 16.5
y_top = 22.0

nodes = [
    (1.5, y_top, w_top, h_top, "1. Citizen Profile", "Query Q + Attributes C\n(Income, Age, Caste)", c_input),
    (21.2, y_top, w_top, h_top, "2. Hybrid Retrieval", "BM25 Sparse +\nBGE Dense (RRF)", c_retrieval),
    (40.9, y_top, w_top, h_top, "3. Bi-Temporal\nFilter", "Gazette Enforceability\nt_gaz <= t <= t_end", c_temporal),
    (60.6, y_top, w_top, h_top, "4. Coverage Gate", "Critical Obligation Check\nInvariant: κ_crit == 1.0", c_gate),
    (80.3, y_top, w_top, h_top, "5. AST Rule Engine", "Deterministic Symbolic\nArithmetic (<, <=, >, >=)", c_engine),
]

for x, y, w, h, t, s, c in nodes:
    draw_box(x, y, w, h, t, s, c, ax, title_size=6.8, sub_size=6.0)

# Forward horizontal arrows
for i in range(len(nodes) - 1):
    x1 = nodes[i][0] + nodes[i][2]
    x2 = nodes[i+1][0]
    y_mid = y_top + h_top/2
    ax.annotate('', xy=(x2 - 0.2, y_mid), xytext=(x1 + 0.2, y_mid),
                arrowprops=dict(arrowstyle="->", color='#222222', lw=1.3), zorder=4)

# Bottom Row: PKG on Left, Abstention in Center, Verdict on Right
# 1. PKG Box (feeds into retrieval)
draw_box(1.5, 3.0, 36.2, 11.5, "Policy Knowledge Graph (PKG)",
         "4,986 Central & State Gazette Schemas | Bi-temporal DAG Constraints", ('#F5F5F5', '#616161'), ax, 7.2, 6.0)
ax.annotate('', xy=(29.4, y_top), xytext=(29.4, 14.5),
            arrowprops=dict(arrowstyle="->", color='#616161', lw=1.2, linestyle=':'), zorder=4)
ax.text(30.2, 18.0, "Statutory Grounding", fontsize=6.0, color='#616161', style='italic')

# 2. Abstention Branch from Gate (x=68.8)
ax.annotate('', xy=(68.8, 14.5), xytext=(68.8, y_top),
            arrowprops=dict(arrowstyle="->", color='#C2185B', lw=1.3, linestyle='--'), zorder=4)
ax.text(69.6, 18.0, "κ_crit < 1.0", fontsize=6.2, color='#C2185B', fontweight='bold')
draw_box(51.0, 3.0, 23.0, 11.5, "Forced Abstention",
         "Targeted Clarification Request\nSolicits Missing Parameters", c_abstain, ax, 7.0, 5.8)

# 3. Final Legal Verdict & Grounded Explanation (x=88.5)
ax.annotate('', xy=(88.5, 14.5), xytext=(88.5, y_top),
            arrowprops=dict(arrowstyle="->", color='#004D40', lw=1.3), zorder=4)
ax.text(89.3, 18.0, "Proof Verified", fontsize=6.2, color='#004D40', fontweight='bold')
draw_box(76.0, 3.0, 22.5, 11.5, "Verified Legal Verdict",
         "Grounded Surface Verbalization\n+ Official Gazette Mirror Citation", c_verdict, ax, 7.0, 5.8)

plt.tight_layout()
plt.savefig('docs/paper/figures/fig1_workflow_pipeline.png', dpi=300, bbox_inches='tight')
plt.savefig('docs/paper/figures/fig1_workflow_pipeline.pdf', bbox_inches='tight')
plt.close()
print("PRO FIG 1 Generated: Architecture Pipeline")


# =====================================================================
# FIGURE 2: Boundary Stress & Error Sensitivity Curve (Replicating Ref Fig 2)
# =====================================================================
fig, ax1 = plt.subplots(figsize=(3.6, 2.8), dpi=300)

x = np.array([-20, -15, -10, -5, -2, -0.5, 0, 0.5, 2, 5, 10, 15, 20])
llm_acc = np.array([78.0, 76.5, 74.0, 68.5, 52.0, 38.0, 29.06, 35.0, 48.0, 65.0, 72.0, 75.0, 77.0])
llm_halluc = np.array([12.0, 14.0, 18.0, 28.0, 48.0, 64.0, 70.94, 62.0, 45.0, 26.0, 17.0, 13.0, 11.0])
gov_acc = np.array([99.39]*len(x))
gov_halluc = np.array([0.61]*len(x))

# Primary Axis: Accuracy
l1 = ax1.plot(x, gov_acc, color='#1B5E20', linewidth=1.8, marker='o', markersize=3.5,
              label='GovReasonRAG Accuracy')
l2 = ax1.plot(x, llm_acc, color='#E65100', linewidth=1.6, linestyle='--', marker='s', markersize=3.2,
              label='Standard LLM Accuracy')
ax1.set_xlabel(r'Threshold Offset $\Delta$ (%) [Distance from Cutoff]', fontweight='bold')
ax1.set_ylabel('Classification Accuracy (%)', color='#1B5E20', fontweight='bold')
ax1.tick_params(axis='y', labelcolor='#1B5E20')
ax1.set_ylim([10, 112])
ax1.grid(True, linestyle=':', alpha=0.6)

# Vertical Cutoff Line
ax1.axvline(0, color='#444444', linestyle='-.', linewidth=1.0, alpha=0.8)

# Secondary Axis: Hallucination
ax2 = ax1.twinx()
l3 = ax2.plot(x, llm_halluc, color='#B71C1C', linewidth=1.5, linestyle=':', marker='^', markersize=3.2,
              label='Standard LLM Hallucination')
l4 = ax2.plot(x, gov_halluc, color='#4A148C', linewidth=1.5, linestyle='-', marker='v', markersize=3.2,
              label='GovReasonRAG Hallucination')
ax2.set_ylabel('Boundary Hallucination Rate (%)', color='#B71C1C', fontweight='bold')
ax2.tick_params(axis='y', labelcolor='#B71C1C')
ax2.set_ylim([0, 100])

# Annotation
ax1.annotate(r'Cutoff ($\Delta = 0$)' + '\n' + r'LLM Acc: 29.1%' + '\n' + r'Ours: 99.4%',
             xy=(0, 29.06), xytext=(2.8, 38),
             arrowprops=dict(facecolor='#E65100', edgecolor='#E65100', arrowstyle='->', lw=1.2),
             fontsize=6.8, fontweight='bold', color='#111111',
             bbox=dict(boxstyle='round,pad=0.25', facecolor='#FFF8E1', edgecolor='#FFA000', lw=0.8))

# Consolidated legend
lines = l1 + l2 + l3 + l4
labels = [l.get_label() for l in lines]
ax1.legend(lines, labels, loc='upper left', fontsize=6.4, framealpha=0.92, edgecolor='#DDDDDD')

plt.tight_layout()
plt.savefig('docs/paper/figures/fig2_boundary_sensitivity.png', dpi=300, bbox_inches='tight')
plt.savefig('docs/paper/figures/fig2_boundary_sensitivity.pdf', bbox_inches='tight')
plt.close()
print("PRO FIG 2 Generated: Boundary Sensitivity Curve")


# =====================================================================
# FIGURE 3: Comparative Domain Breakdown (Replicating Ref Fig 3 Heatmap)
# =====================================================================
fig, (ax_acc, ax_hal) = plt.subplots(1, 2, figsize=(7.16, 2.7), dpi=300)

sectors = [
    'Agriculture (PM-KISAN)',
    'Housing (PMAY-U 2.0)',
    'Education & Scholarships',
    'Health (AB PM-JAY)',
    'Social Pensions',
    'Women & Child (PMMVY)',
    'Micro-Credit (Mudra)',
    'Urban Subsidies'
]

gov_acc_sec = [93.4, 91.8, 94.2, 92.5, 93.1, 92.0, 93.8, 91.6]
dense_acc_sec = [71.5, 62.4, 76.8, 70.2, 69.1, 68.0, 73.4, 65.2]

gov_hal_sec = [1.2, 1.8, 1.0, 1.5, 1.3, 1.7, 1.1, 1.9]
dense_hal_sec = [15.8, 24.2, 12.5, 16.4, 18.2, 17.5, 14.1, 21.0]

y_pos = np.arange(len(sectors))
bar_h = 0.36

# Subplot 1: Decision Accuracy
ax_acc.barh(y_pos + bar_h/2, gov_acc_sec, height=bar_h, color='#1B5E20', label='GovReasonRAG (Ours)', edgecolor='black', lw=0.5)
ax_acc.barh(y_pos - bar_h/2, dense_acc_sec, height=bar_h, color='#90A4AE', label='Dense RAG Baseline', edgecolor='black', lw=0.5)
ax_acc.set_yticks(y_pos)
ax_acc.set_yticklabels(sectors, fontsize=7.2)
ax_acc.set_xlabel('Decision Accuracy (%)', fontweight='bold')
ax_acc.set_title('(a) Accuracy across 8 Policy Sectors', fontweight='bold', fontsize=8.5)
ax_acc.set_xlim([45, 102])
ax_acc.grid(True, axis='x', linestyle=':', alpha=0.6)
ax_acc.legend(loc='lower left', fontsize=6.8, framealpha=0.92)
for y, v in zip(y_pos, gov_acc_sec):
    ax_acc.text(v + 0.8, y + bar_h/2, f"{v:.1f}%", va='center', fontsize=6.3, fontweight='bold', color='#1B5E20')

# Subplot 2: Hallucination Suppression
ax_hal.barh(y_pos + bar_h/2, gov_hal_sec, height=bar_h, color='#2E7D32', label='GovReasonRAG (1.0 - 1.9%)', edgecolor='black', lw=0.5)
ax_hal.barh(y_pos - bar_h/2, dense_hal_sec, height=bar_h, color='#D32F2F', label='Dense RAG (12.5 - 24.2%)', edgecolor='black', lw=0.5)
ax_hal.set_yticks(y_pos)
ax_hal.set_yticklabels([])
ax_hal.set_xlabel('Boundary Hallucination Rate (%)', fontweight='bold')
ax_hal.set_title('(b) Hallucination Suppression Rate', fontweight='bold', fontsize=8.5)
ax_hal.set_xlim([0, 31])  # Expanded to 31 so 21.0% and 24.2% never collide with legend
ax_hal.grid(True, axis='x', linestyle=':', alpha=0.6)
# Place legend on lower right
ax_hal.legend(loc='lower right', fontsize=6.8, framealpha=0.92)
for y, v_g, v_d in zip(y_pos, gov_hal_sec, dense_hal_sec):
    ax_hal.text(v_g + 0.6, y + bar_h/2, f"{v_g:.1f}%", va='center', fontsize=6.3, fontweight='bold', color='#2E7D32')
    ax_hal.text(v_d + 0.6, y - bar_h/2, f"{v_d:.1f}%", va='center', fontsize=6.3, color='#B71C1C')

plt.tight_layout()
plt.savefig('docs/paper/figures/fig3_domain_heatmap.png', dpi=300, bbox_inches='tight')
plt.savefig('docs/paper/figures/fig3_domain_heatmap.pdf', bbox_inches='tight')
plt.close()
print("PRO FIG 3 Generated: Domain Sector Comparison")


# =====================================================================
# FIGURE 4: Latency Trade-Off & Component Ablation (CORRECT ORDER)
# =====================================================================
fig, (ax_lat, ax_abl) = plt.subplots(1, 2, figsize=(7.16, 2.6), dpi=300)

# Subplot A: Latency (Fastest at top, slowest at bottom)
archs = [
    'GovReasonRAG (Targeted Scenario)',
    'GovReasonRAG (Open-Corpus 4,986)',
    'Standard Dense RAG (BGE + LLM)',
    'Standard Direct LLM (Qwen-2.5-1.5B)'
]
lats = [229.5, 1248.5, 3614.0, 3989.6]
lat_colors = ['#2E7D32', '#1976D2', '#E65100', '#C2185B']

y_l = np.arange(len(archs))
# We plot in reverse so fastest (GovReasonRAG) is at top
bars_l = ax_lat.barh(y_l[::-1], lats, color=lat_colors, height=0.55, edgecolor='black', lw=0.6)
ax_lat.set_yticks(y_l[::-1])
ax_lat.set_yticklabels(archs, fontsize=7.2)
ax_lat.set_xlabel('Inference Latency (ms)', fontweight='bold')
ax_lat.set_title('(a) Decision Latency (Apple Silicon Edge)', fontweight='bold', fontsize=8.5)
ax_lat.set_xlim([0, 4900])
ax_lat.grid(True, axis='x', linestyle=':', alpha=0.6)
for bar, val in zip(bars_l, lats):
    ax_lat.text(val + 80, bar.get_y() + bar.get_height()/2.0, f"{val:,.0f} ms",
                va='center', fontsize=7.0, fontweight='bold')

# Subplot B: Component Ablation (Best at top, largest drop at bottom)
abl_names = [
    'Full ECPR Pipeline',
    'w/o Conflict Resolver',
    'w/o Bi-Temporal Validator',
    'w/o Evidence Contract',
    'w/o Coverage Gate (κ)',
    'w/o AST Rule Engine'
]
abl_acc = [92.8, 88.0, 83.4, 81.2, 78.5, 72.1]
abl_c = ['#1B5E20', '#388E3C', '#689F38', '#FBC02D', '#F57C00', '#D32F2F']

y_a = np.arange(len(abl_names))
bars_a = ax_abl.barh(y_a[::-1], abl_acc, color=abl_c, height=0.55, edgecolor='black', lw=0.6)
ax_abl.set_yticks(y_a[::-1])
ax_abl.set_yticklabels(abl_names, fontsize=7.2)
ax_abl.set_xlabel('Decision Accuracy (%)', fontweight='bold')
ax_abl.set_title('(b) ECPR Component Ablation Impact', fontweight='bold', fontsize=8.5)
ax_abl.set_xlim([60, 100])
ax_abl.grid(True, axis='x', linestyle=':', alpha=0.6)
for bar, val in zip(bars_a, abl_acc):
    ax_abl.text(val + 0.8, bar.get_y() + bar.get_height()/2.0, f"{val:.1f}%",
                va='center', fontsize=7.0, fontweight='bold')

plt.tight_layout()
plt.savefig('docs/paper/figures/fig4_latency_and_ablation.png', dpi=300, bbox_inches='tight')
plt.savefig('docs/paper/figures/fig4_latency_and_ablation.pdf', bbox_inches='tight')
plt.close()
print("PRO FIG 4 Generated: Latency & Ablation (Correct Order)")
