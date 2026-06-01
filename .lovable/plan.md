## Diagnóstico

**Azul atual no Dashboard (`src/components/Dashboard.tsx`)**
- `BLUE = '#6366f1'` (indigo-500) é usado em texto, números grandes, ícones, barras, bordas e gradientes — o MESMO valor para light e dark mode.
- Em dark mode, sobre o fundo `#06080f / #0a0d1a`, o `#6366f1` fica:
  - Legível, porém com saturação alta — "puxa" a atenção e cria leve halo nos números grandes (ex.: "41.2%", contador de dias, "Foco na Meta, *Recruta*").
  - Contraste WCAG ~5.2:1 sobre o card `#11152a` — passa AA, mas o tom escuro reduz vivacidade em telas com brilho médio.
- Em light mode `#6366f1` sobre branco fica adequado (~4.8:1), então não precisa mudar.

**Conclusão:** o azul **não é o ideal em dark mode**. Ele deveria ser um pouco mais claro e levemente desaturado (periwinkle), para combinar com o midnight indigo da paleta e ganhar leveza tipográfica. Em light mode, dá pra escurecer um toque para reforçar hierarquia.

## Proposta — novo tom de azul

| Token | Light | Dark | Uso |
|---|---|---|---|
| `BLUE` (principal) | `#4f46e5` (indigo-600) | `#818cf8` (indigo-400, periwinkle) | nome do usuário, números, ícones de ação |
| `BLUE_DARK` | `#3730a3` | `#6366f1` | gradientes, hover |
| `BLUE_SOFT` (bg leve) | `#EEF3FF` | `#0e1428` | fundo de cards "low" |
| `BLUE_BORDER` | `#BFDBFE` | `#2a2f5a` | bordas suaves |
| `BLUE_ICON_BG` | `#DBEAFE` | `#141a36` | fundo de pílula de ícone |
| `BLUE_ICON_BORDER` | `#93C5FD` | `#2e3566` | borda da pílula |

`#818cf8` (indigo-400) sobre `#11152a` tem contraste ~7.1:1, mais claro e elegante — combina com o tom dourado da marca sem competir.

## Mudanças

### 1. `src/components/Dashboard.tsx`
- Converter as constantes `BLUE / BLUE_DARK / BLUE_BORDER / BLUE_ICON_BG / BLUE_ICON_BORDER` para serem **derivadas de `isDark`** (igual ao padrão já existente em `BLUE_SOFT_D`/`BLUE_BOR_D`).
- Substituir os usos hard-coded pelas versões dependentes do tema:
  - Saudação "Foco na Meta, *Nome*" — usa novo `BLUE`.
  - Card "Probabilidade de Aprovação" (`approvalProb < CUT_SCORE`) — número grande e label.
  - Gradiente da barra de probabilidade — `linear-gradient(90deg, BLUE_DARK, BLUE)`.
  - Pílula "Questões resolvidas" + número 26pt.
  - Cronograma da semana — borda/fundo/ícones do dia atual.
  - Card "Próximo objetivo" (Shield azul) — ícone + label + barra de progresso.
  - Botão CTA azul "Continuar treinamento".

### 2. `src/styles.css` — auditoria de consistência (paleta midnight indigo)
Após análise, **apenas dois pontos** ainda destoam:

- **Linha 417** — `stroke-emerald-950` em gauges ainda usa `#18223d` (antigo). Atualizar para `#262b4f` (alinhado às novas bordas).
- **Linhas 426–434** — `#svg-line-graph` em Progresso: o nó dourado tem `stroke: #0a0f1d` (antigo `panel-navy`). Trocar por `#0a0d1a` (novo token).

Botões, links, tabelas e cartões já foram atualizados na rodada anterior e estão consistentes — confirmado lendo `bg-slate-800/850/900/950`, `border-slate-800`, `hover:bg-slate-800` e mapeamentos de `text-emerald-*`.

### 3. Verificação após mudanças
- Abrir `/` (Dashboard) em dark mode no preview e conferir:
  - Nome do usuário no header — periwinkle suave, não índigo gritante.
  - "41.2%" e "26" — mesmo tom periwinkle.
  - Card "Continuar treinamento" — gradiente harmonioso com o fundo.
  - Cronograma "Hoje" — borda azul mais leve, sem competir com o card dourado abaixo.
- Conferir Simulados e Progresso para garantir que gauges/linhas seguem o ouro/indigo correto.

## Arquivos afetados

- `src/components/Dashboard.tsx` — derivar `BLUE*` de `isDark`.
- `src/styles.css` — ajustar 2 strokes/fills residuais (linhas 417 e 428).

## Fora de escopo

- Light mode mantém o tom atual (apenas pequeno ajuste opcional em `BLUE = #4f46e5`).
- Sem mudanças em Simulados.tsx (paleta já refinada na rodada anterior).
- Sem alteração no acento dourado da marca.
