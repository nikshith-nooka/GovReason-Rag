import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import numpy as np

# Apply clean standard IEEE academic style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Arial', 'Helvetica', 'DejaVu Sans']
plt.rcParams['font.size'] = 8.5
plt.rcParams['axes.labelsize'] = 9.0
plt.rcParams['xtick.labelsize'] = 8.0
plt.rcParams['ytick.labelsize'] = 8.0
plt.rcParams['legend.fontsize'] = 8.0
plt.rcParams['axes.linewidth'] = 0.8
plt.rcParams['grid.color'] = '#EBEBEB'
plt.rcParams['grid.linestyle'] = '--'
plt.rcParams['grid.linewidth'] = 0.6
plt.rcParams['grid.alpha'] = 0.8

# Standard IEEE Color Palette (Normal, professional colors)
COLOR_PRIMARY = '#1f77b4'    # Classic IEEE Blue
COLOR_SECONDARY = '#d95f02'  # Standard Orange
COLOR_MUTED = '#7f7f7f'      # Slate Gray
COLOR_ACCENT = '#2ca02c'     # Forest Green

# =========================================================================
# FIGURE 1: Clean, Minimalist Linear Architecture Flowchart (Double-Column)
# =========================================================================
fig = plt.figure(figsize=(7.16, 2.5), dpi=300)
ax = fig.add_subplot(111)
ax.set_facecolor('#FFFFFF')
fig.patch.set_facecolor('#FFFFFF')
ax.axis('off')
ax.set_xlim(0, 100)
ax.set_ylim(-4, 32)

def draw_clean_card(x, y, w, h, step, title, desc, color_border, color_bg):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2,rounding_size=1.0",
                         facecolor=color_bg, edgecolor=color_border, linewidth=1.2, zorder=2)
    ax.add_patch(box)
    ax.text(x + w/2, y + h*0.74, step, ha='center', va='center',
            fontsize=6.8, fontweight='bold', color=color_border, zorder=3)
    ax.text(x + w/2, y + h*0.48, title, ha='center', va='center',
            fontsize=7.8, fontweight='bold', color='#111111', zorder=3)
    ax.text(x + w/2, y + h*0.22, desc, ha='center', va='center',
            fontsize=6.2, color='#444444', zorder=3)

# 5 Main Horizontal Stages
stages = [
    (1.5, 9.0, 16.5, 18.0, "STAGE 1", "Citizen Ingestion", "Query Q + Profile C\n(Income, Age, Caste)", '#1f77b4', '#F4F8FD'),
    (21.2, 9.0, 16.5, 18.0, "STAGE 2", "Hybrid Retrieval", "BM25 Sparse +\nBGE Dense (RRF)", '#1f77b4', '#F4F8FD'),
    (40.9, 9.0, 16.5, 18.0, "STAGE 3", "Bi-Temporal Filter", "Gazette Enforceability\nt_gaz <= t <= t_end", '#1f77b4', '#F4F8FD'),
    (60.6, 9.0, 16.5, 18.0, "STAGE 4", "Coverage Gate", "Critical Invariant\nκ_crit == 1.0", '#d95f02', '#FDF6F0'),
    (80.3, 9.0, 18.0, 18.0, "STAGE 5", "AST Rule Engine", "Exact Symbolic Math\n(<=, >=, ==, in)", '#2ca02c', '#F2F9F3'),
]

for x, y, w, h, s, t, d, cb, cbg in stages:
    draw_clean_card(x, y, w, h, s, t, d, cb, cbg)

# Clean connecting arrows between stages
for i in range(len(stages) - 1):
    x1 = stages[i][0] + stages[i][2]
    x2 = stages[i+1][0]
    ax.annotate('', xy=(x2 - 0.2, 18.0), xytext=(x1 + 0.2, 18.0),
                arrowprops=dict(arrowstyle="->", color='#333333', lw=1.2), zorder=4)

# Abstention fallback from Stage 4 (Coverage Gate)
ax.annotate('', xy=(68.8, 2.5), xytext=(68.8, 9.0),
            arrowprops=dict(arrowstyle="->", color='#d95f02', lw=1.2, linestyle='--'), zorder=4)
card_abstain = FancyBboxPatch((58.0, -2.5), 21.6, 5.0, boxstyle="round,pad=0.2,rounding_size=0.6",
                              facecolor='#FFF8F0', edgecolor='#d95f02', linewidth=1.0, zorder=2)
ax.add_patch(card_abstain)
ax.text(68.8, 0.0, "Forced Abstention (κ < 1.0)\n[Solicit Missing Fact]", ha='center', va='center',
        fontsize=6.5, fontweight='bold', color='#d95f02', zorder=3)

# Verified Output from Stage 5 (AST Rule Engine)
ax.annotate('', xy=(89.3, 2.5), xytext=(89.3, 9.0),
            arrowprops=dict(arrowstyle="->", color='#2ca02c', lw=1.2), zorder=4)
card_verdict = FancyBboxPatch((81.0, -2.5), 16.6, 5.0, boxstyle="round,pad=0.2,rounding_size=0.6",
                              facecolor='#F2F9F3', edgecolor='#2ca02c', linewidth=1.0, zorder=2)
ax.add_patch(card_verdict)
ax.text(89.3, 0.0, "Authorized Verdict\n[Grounded Mirror]", ha='center', va='center',
        fontsize=6.5, fontweight='bold', color='#2ca02c', zorder=3)

plt.tight_layout()
plt.savefig('docs/paper/figures/fig1_workflow_pipeline.png', dpi=300, bbox_inches='tight')
plt.savefig('docs/paper/figures/fig1_workflow_pipeline.pdf', bbox_inches='tight')
plt.close()
print("Clean Fig 1 Generated!")


# =========================================================================
# FIGURE 2: Simple Clean Sensitivity Curve (Accuracy vs Offset)
# =========================================================================
fig, ax = plt.subplots(figsize=(3.5, 2.4), dpi=300)

x = np.array([-20, -15, -10, -5, -2, -1, 0, 1, 2, 5, 10, 15, 20])
llm_acc = np.array([78.0, 76.5, 74.0, 68.5, 52.0, 38.0, 29.1, 35.0, 48.0, 65.0, 72.0, 75.0, 77.0])
gov_acc = np.array([99.4, 99.4, 99.4, 99.4, 99.4, 99.4, 99.4, 99.4, 99.4, 99.4, 99.4, 99.4, 99.4])

ax.plot(x, gov_acc, color=COLOR_PRIMARY, linewidth=1.8, marker='o', markersize=3.5,
        label='GovReasonRAG (Ours)')
ax.plot(x, llm_acc, color=COLOR_SECONDARY, linewidth=1.6, linestyle='--', marker='s', markersize=3.5,
        label='Standard Dense RAG')

ax.set_xlabel('Statutory Boundary Offset (%)', fontsize=8.5, color='#111111')
ax.set_ylabel('Decision Accuracy (%)', fontsize=8.5, color='#111111')
ax.set_ylim([15, 108])
ax.set_xlim([-21, 21])

ax.axvline(0, color='#777777', linestyle=':', linewidth=1.0)
ax.text(1.0, 48, 'Cutoff (0%)', fontsize=7.2, color='#555555')

ax.legend(loc='lower left', frameon=True, facecolor='#FFFFFF', edgecolor='#CCCCCC', framealpha=0.95, fontsize=7.5)

plt.tight_layout()
plt.savefig('docs/paper/figures/fig2_boundary_sensitivity.png', dpi=300, bbox_inches='tight')
plt.savefig('docs/paper/figures/fig2_boundary_sensitivity.pdf', bbox_inches='tight')
plt.close()
print("Clean Fig 2 Generated!")


# =========================================================================
# FIGURE 3: Clean Domain Benchmark Comparison (Standard Bar Chart)
# =========================================================================
fig, ax = plt.subplots(figsize=(3.5, 2.5), dpi=300)

sectors = [
    'Agriculture',
    'Housing',
    'Scholarships',
    'Healthcare',
    'Pensions',
    'Maternity',
    'Micro-Credit',
    'Urban Services'
]

gov_acc_sec = [93.4, 91.8, 94.2, 92.5, 93.1, 92.0, 93.8, 91.6]
dense_acc_sec = [71.5, 62.4, 76.8, 70.2, 69.1, 68.0, 73.4, 65.2]

y_pos = np.arange(len(sectors))
h = 0.35

ax.barh(y_pos + h/2, gov_acc_sec, height=h, color=COLOR_PRIMARY, label='GovReasonRAG', edgecolor='#111111', lw=0.4)
ax.barh(y_pos - h/2, dense_acc_sec, height=h, color=COLOR_MUTED, label='Dense RAG', edgecolor='#111111', lw=0.4)

ax.set_yticks(y_pos)
ax.set_yticklabels(sectors, fontsize=7.5)
ax.set_xlabel('Decision Accuracy (%)', fontsize=8.5, color='#111111')
ax.set_xlim([0, 105])
ax.legend(loc='lower left', bbox_to_anchor=(0.05, 1.02), ncol=2, frameon=False, fontsize=7.5)

plt.tight_layout()
plt.savefig('docs/paper/figures/fig3_domain_heatmap.png', dpi=300, bbox_inches='tight')
plt.savefig('docs/paper/figures/fig3_domain_heatmap.pdf', bbox_inches='tight')
plt.close()
print("Clean Fig 3 Generated!")


# =========================================================================
# FIGURE 4: Clean Latency & Ablation Summary
# =========================================================================
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.16, 2.2), dpi=300)

# (a) Latency
models = ['GovReasonRAG (Targeted)', 'GovReasonRAG (Open)', 'Dense RAG', 'Direct LLM']
lats = [230, 1248, 3614, 3990]
bar_colors = [COLOR_ACCENT, COLOR_PRIMARY, COLOR_SECONDARY, '#b2182b']

y_pos1 = np.arange(len(models))
ax1.barh(y_pos1[::-1], lats, color=bar_colors, height=0.5, edgecolor='#111111', lw=0.4)
ax1.set_yticks(y_pos1[::-1])
ax1.set_yticklabels(models, fontsize=7.2)
ax1.set_xlabel('Latency (ms)', fontsize=8.5)
ax1.set_title('(a) Decision Latency (Apple Silicon Edge)', fontsize=8.5, fontweight='bold')
ax1.set_xlim([0, 4800])
for y, v in zip(y_pos1[::-1], lats):
    ax1.text(v + 90, y, f"{v:,} ms", va='center', fontsize=6.8)

# (b) Ablation Accuracy
ablations = ['Full ECPR', 'w/o Conflict', 'w/o Bi-Temporal', 'w/o Contract', 'w/o Gate (κ)', 'w/o AST Engine']
accs = [92.8, 88.0, 83.4, 81.2, 78.5, 72.1]
abl_colors = [COLOR_PRIMARY, '#4292c6', '#6baed6', '#9ecae1', '#c6dbef', COLOR_SECONDARY]

y_pos2 = np.arange(len(ablations))
ax2.barh(y_pos2[::-1], accs, color=abl_colors, height=0.5, edgecolor='#111111', lw=0.4)
ax2.set_yticks(y_pos2[::-1])
ax2.set_yticklabels(ablations, fontsize=7.2)
ax2.set_xlabel('Decision Accuracy (%)', fontsize=8.5)
ax2.set_title('(b) ECPR Component Ablation', fontsize=8.5, fontweight='bold')
ax2.set_xlim([65, 98])
for y, v in zip(y_pos2[::-1], accs):
    ax2.text(v + 0.6, y, f"{v:.1f}%", va='center', fontsize=6.8)

plt.tight_layout()
plt.savefig('docs/paper/figures/fig4_latency_and_ablation.png', dpi=300, bbox_inches='tight')
plt.savefig('docs/paper/figures/fig4_latency_and_ablation.pdf', bbox_inches='tight')
plt.close()
print("Clean Fig 4 Generated!")
