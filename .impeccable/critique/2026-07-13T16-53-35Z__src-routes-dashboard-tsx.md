---
timestamp: 2026-07-13T16-53-35Z
slug: src-routes-dashboard-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Bell badge abre dropdown vazio |
| 2 | Match System / Real World | 3/4 | 'Nota Líquida' sem tooltip inline |
| 3 | User Control and Freedom | 2/4 | Onboarding sem skip; sem undo em task completion |
| 4 | Consistency and Standards | 2/4 | 3 sistemas de tema empilhados com !important |
| 5 | Error Prevention | 2/4 | Sem validação de data passada; sem confirm destrutivo |
| 6 | Recognition Rather Than Recall | 3/4 | ⌘K visível, nav label+icon, chips Athena |
| 7 | Flexibility and Efficiency | 2/4 | Apenas ⌘K; sem keyboard nav; sem bulk actions |
| 8 | Aesthetic and Minimalist Design | 2/4 | 6 seções + orbs + pulse dots + eyebrows competindo |
| 9 | Error Recovery | 2/4 | Athena errors silenciados; null schedule propagado |
| 10 | Help and Documentation | 1/4 | Zero tooltips em métricas; Athena é o único help |
| **Total** | | **22/40** | **Acceptable — melhorias significativas necessárias** |

## Anti-Patterns Verdict

**LLM assessment**: Lê claramente como dark AI SaaS de 2025. Passa no teste de primeira ordem mas falha no de segunda — alguém adivinharia "dark SaaS com amber accent, glowy orbs e gradiente violeta" só de saber que é app de concurso PRF. Violações confirmadas: gradient text no hero H1, uppercase tracked eyebrow em cada seção, side-stripe border no nav, hero-metric template no bloco de aprovação, card grid idêntico nas 4 métricas, glassmorphism como default, radial-glow orbs em cada card.

**Deterministic scan**: 84 findings, exit code 2. Dominante: 40 instâncias de AI color palette — gradientes indigo/violeta em 8/11 componentes. 37 instâncias de gray-on-color (~15 falsos positivos: text-slate-950 em amber é near-black ~8:1). Problemas reais de contraste: AdminPanel (text-slate-400 em indigo-600/green-600) e LandingPage (slate-400/500 em amber). 1 gradient text confirmado (LandingPage:250). 4 bounce easing (AdminPanel, Simulados, Treinar). 2 layout transitions em EditalVerticalizado. Global * transition não capturada pelo detector.

## Overall Impression

Funcionalidade sólida e boa base técnica — sistema de quiz, ⌘K, mobile drawer, prefers-reduced-motion. Mas o visual foi construído sobre o scaffold padrão de AI SaaS dark: tudo indigo/violeta, glow orbs em cada card, eyebrow em cada seção, gradient text no hero. O maior risco: o Dashboard bombardeia candidatos estressados com 6 seções simultâneas sem hierarquia clara de onde começar.

## O que está funcionando

1. **Sistema de quiz (choice-cebraspe)**: Estados correto/incorreto com escape de alta especificidade do PRF theme. Genuinamente bem executado.
2. **Shortcuts e acessibilidade base**: ⌘K, prefers-reduced-motion, focus-visible amber, text-wrap: balance/pretty.
3. **Mobile sidebar**: Slide + overlay + fechamento automático. Funciona corretamente.

## Priority Issues

**[P1] Gradient text no hero — LandingPage.tsx:251**: bg-clip-text + gradient no H1. Maior AI tell da landing. Fix: text-amber-400 sólido. Comando: $impeccable typeset

**[P1] Uppercase eyebrow em cada seção — Dashboard.tsx + AppShell.tsx**: 7 instâncias, 100% das seções. Fix: manter no máximo 1 como momento de marca; substituir demais por badge de status ou nada. Comando: $impeccable typeset

**[P1] Side-stripe border no nav ativo — AppShell.tsx:83 + styles.css:464**: border-r-2 e border-left em dois temas. Fix: remover stripes, fortalecer bg-tint existente para bg-indigo-600/25. Comando: $impeccable polish

**[P2] Erros API silenciados — Athena.tsx:37 + Onboarding.tsx:48**: catch sem UI feedback. Fix: mensagem bot de erro + retry button; fallback de schedule. Comando: $impeccable harden

**[P2] Global * transition — styles.css:112**: transition em todos os elementos. Fix: remover regra, aplicar explicitamente só em interativos. Comando: $impeccable optimize

## Persona Red Flags

**Jordan**: Dashboard abre com "0.0% aprovação" sem orientação. 'Nota Líquida' sem tooltip. 6 seções sem hierarquia de primeiro passo. Onboarding trava em campo obrigatório.

**Casey**: Hamburger só no topo-esquerdo (oposto da thumb zone). Aprovação% some no header mobile. Sem indicador de sessão anterior. Texto de missões em text-[10px].

**Alex**: Apenas ⌘K. Sem arrow key nav. Sem bulk. Diagnóstico trunca em 3 de 14 disciplinas.

## Minor Observations

- animate-pulse permanente no Shield do admin (ruído visual constante)
- Avatar header abre Planos; sidebar também tem plano — dois pontos de entrada confusos
- Bell sem close button e sem Escape dismiss
- text-4xl ~51px para aprovação% — grande demais no contexto
- LandingPage header 96-112px + alert bar = ~145px de chrome fixo
- Onboarding card rounded-3xl (24px) excede máximo de 16px para cards
