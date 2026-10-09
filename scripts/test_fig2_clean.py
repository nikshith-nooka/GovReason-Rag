import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

# Standard IEEE / ACM publication style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Arial', 'Helvetica', 'DejaVu Sans']
plt.rcParams['font.size'] = 8.5
plt.rcParams['axes.labelsize'] = 9.0
plt.rcParams['xtick.labelsize'] = 8.0
plt.rcParams['ytick.labelsize'] = 8.0
plt.rcParams['legend.fontsize'] = 8.0
plt.rcParams['axes.linewidth'] = 0.8
plt.rcParams['grid.color'] = '#E0E0E0'
plt.rcParams['grid.linestyle'] = '--'
plt.rcParams['grid.linewidth'] = 0.6
plt.rcParams['grid.alpha'] = 0.8

# -------------------------------------------------------------------------
# FIG 2: Simple, Clean Line Graph (Replicating Ref Paper Fig 2 Loss Curve)
# Aspect ratio: Classic 3.5 in x 2.4 in (single IEEE column)
# Normal colors: Classic Navy Blue & Warm Orange
# -------------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(3.5, 2.3), dpi=300)

x = np.array([-20, -15, -10, -5, -2, -1, 0, 1, 2, 5, 10, 15, 20])
llm_acc = np.array([78.0, 76.5, 74.0, 68.5, 52.0, 38.0, 29.1, 35.0, 48.0, 65.0, 72.0, 75.0, 77.0])
gov_acc = np.array([99.4, 99.4, 99.4, 99.4, 99.4, 99.4, 99.4, 99.4, 99.4, 99.4, 99.4, 99.4, 99.4])

# Normal colors: Navy Blue for Proposed, Slate/Orange for Baseline
ax.plot(x, gov_acc, color='#1f77b4', linewidth=1.8, marker='o', markersize=3.5,
        label='GovReasonRAG (Ours)')
ax.plot(x, llm_acc, color='#d95f02', linewidth=1.6, linestyle='--', marker='s', markersize=3.5,
        label='Standard Dense RAG')

# Standard black text labels
ax.set_xlabel('Statutory Boundary Offset (%)', fontsize=9.0, color='#111111')
ax.set_ylabel('Decision Accuracy (%)', fontsize=9.0, color='#111111')
ax.set_ylim([15, 105])
ax.set_xlim([-21, 21])

# Subtle vertical reference line at threshold
ax.axvline(0, color='#777777', linestyle=':', linewidth=1.0)
ax.text(0.5, 20, 'Cutoff (0%)', fontsize=7.5, color='#555555')

# Simple, standard legend in top-right or lower-left
ax.legend(loc='lower left', frameon=True, facecolor='#FFFFFF', edgecolor='#CCCCCC', framealpha=0.95)

# Tight layout with zero clipping
plt.tight_layout()
plt.savefig('docs/paper/figures/fig2_boundary_sensitivity.png', dpi=300)
plt.savefig('docs/paper/figures/fig2_boundary_sensitivity.pdf')
plt.close()
print("Generated clean Fig 2!")
