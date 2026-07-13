# Critique v2 — Prova X AI (post-fix)
**Target:** src/components — Dashboard, AppShell, Onboarding, Athena, Simulados, Treinar, Biblioteca, Cronograma, Progresso, LandingPage, AdminPanel

## Score: 25/40

| # | Heuristic | v1 | v2 | Δ |
|---|-----------|----|----|---|
| 1 | Visibility of System Status | 3 | 3 | 0 |
| 2 | Match System / Real World | 3 | 3 | 0 |
| 3 | User Control and Freedom | 2 | 3 | **+1** |
| 4 | Consistency and Standards | 2 | 2 | 0 |
| 5 | Error Prevention | 2 | 2 | 0 |
| 6 | Recognition Rather Than Recall | 3 | 3 | 0 |
| 7 | Flexibility and Efficiency | 2 | 2 | 0 |
| 8 | Aesthetic and Minimalist Design | 2 | 3 | **+1** |
| 9 | Error Recovery | 2 | 3 | **+1** |
| 10 | Help and Documentation | 1 | 1 | 0 |

## Anti-patterns — detector v2

### Eliminated ✓
- gradient-text (LandingPage hero H1)
- bounce-easing (AdminPanel ×2, Simulados trophy, Treinar success)
- layout-transition/width (EditalVerticalizado progress bars → scaleX)
- side-stripe borders (nav JS classes + PRF CSS theme)
- glassmorphism blanket (broad `backdrop-filter` rule removed)
- global `* { transition }` (replaced with targeted interactive selectors)
- page-header eyebrows ×7 (Simulados, Treinar, Progresso, Biblioteca, Cronograma, Onboarding ×4)
- glow orbs ×2 (Dashboard mission + approval cards)
- nav section label (AppShell "Operações PRF")

### Remaining
- **gray-on-color (real)**: `text-slate-400` on `bg-indigo-600` (AdminPanel stat labels) and `text-slate-400` on `bg-amber-500` (LandingPage badge) — needs darker tint
- **ai-color-palette**: indigo/violet brand is intentional product choice, not slop
- **micro-text**: `text-[9px]` in Athena stat labels (residual)
- **Deliberate kept**: one eyebrow "Diagnóstico estratégico" (Dashboard) — contextually justified

## Remaining P1 items
1. **Contrast fix** — `text-slate-400` on colored backgrounds: use `text-indigo-200` on indigo bg, and a darker text on amber
2. **Tooltip/help** — "Nota Líquida" and approval metric have zero hover explanation (H2 + H10)
3. **Date validation** — Onboarding concurso date accepts any string (H5)

## Trend: 22 → 25 (+3 in one session)
