## Objetivo

Levar a paleta midnight indigo (do ajuste anterior) para o resto do dashboard de forma consistente e devolver as cores semânticas verde/vermelho nos botões Certo/Errado do simulado, em ambos os modos.

## Problema identificado

Os overrides em `src/styles.css` para `.prf-theme:not(.light-theme)` remapeiam **todo `bg-emerald-500/600` e `text-emerald-*` para dourado** no modo escuro. Por isso o botão "Certo" aparece amarelo na imagem 1, mesmo o código usando `bg-emerald-600`. O "Errado" também perde contraste porque herda estilos genéricos de card.

## Mudanças

### 1. Botões Certo / Errado do simulado (Simulados.tsx + styles.css)

Reescrever o par de botões usando classes próprias (`#choice-cebraspe-certo` / `#choice-cebraspe-errado`) com regras dedicadas no CSS que **não passam pelo remap dourado**:

- **Certo (selecionado)**: verde esmeralda sólido `#10b981` (claro) / `#059669` com glow sutil (escuro). Texto branco, borda `#34d399`.
- **Certo (idle)**: card indigo `#181c3a` (escuro) / branco com borda `#cbd5e1` (claro); hover → borda verde + texto verde.
- **Errado (selecionado)**: vermelho sólido `#dc2626` (claro) / `#ef4444` com glow (escuro). Texto branco, borda `#f87171`.
- **Errado (idle)**: mesmo card neutro; hover → borda vermelha + texto vermelho.
- Adicionar exceção explícita no override do dark mode para esses dois IDs, garantindo que o dourado não sobrescreva o verde/vermelho.

### 2. Consistência da paleta midnight indigo no dashboard

Aplicar `#0b0d1c / #11142b / #181c3a / #262b4f` (tokens já criados) também em:

- **Botões secundários e ghost** do dashboard: trocar `hover:bg-slate-800` por hover indigo `#1f234a` para combinar com cards.
- **Links e ações**: garantir que `text-emerald-400` em links navegacionais continue mapeando pro dourado (acento da marca), mas links neutros usam `text-slate-300` com hover `text-amber-200`.
- **Tabelas** (Progresso, Simulados resultado, Biblioteca): linhas zebradas com `#11142b` / `#161a33`, borda `#262b4f`, header `#0e1124`, hover de linha `#1f234a`.
- **Gráficos** (Progresso `#svg-line-graph`, gauges): atualizar track de `#18223d` para `#262b4f` (alinhado à nova borda), grid lines com opacidade reduzida do mesmo tom, mantendo a linha dourada como destaque.
- **Light mode**: nenhuma mudança nas cores claras existentes além das regras novas de Certo/Errado (verde/vermelho refinados).

### 3. Modo claro — botões Certo/Errado

Hoje no claro o "Certo" fica azul-marinho e "Errado" só com borda rosa. Padronizar:

- Certo selecionado: `bg-emerald-600` + texto branco.
- Errado selecionado: `bg-red-600` + texto branco.
- Idle: card branco, borda `slate-200`, hover colorido.

## Arquivos afetados

- `src/styles.css` — adicionar bloco de exceção para `#choice-cebraspe-certo/errado` em dark e light; atualizar tracks de gráfico, hovers de tabela/botão para os novos tons indigo.
- `src/components/Simulados.tsx` — substituir as classes inline dos dois botões por classes utilitárias estáveis que o CSS dedicado consegue alvejar sem conflito.

## Fora de escopo

- Não mexer na lógica do simulado (seleção, navegação, gabarito).
- Não alterar o acento dourado da marca (sidebar ativo, gauge de retenção, badges de plano).
- Não tocar em landing page / onboarding.
