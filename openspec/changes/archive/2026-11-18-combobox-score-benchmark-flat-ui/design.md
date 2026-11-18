# Technical Design: Combobox Inputs, Benchmark Evaluation & Flat UI

## Context
See `proposal.md` for motivation and requirements context. The current system utilizes HTML5 range sliders (`<input type="range">`) in Stages 2, 3, 6, and 7 across both Non-Fraud and Fraud tracks. Calculated sub-scores are pure reactive numbers without business tier benchmarking. Visually, the layout utilizes colorful cards with gradient headers and decorative icons.

## Goals / Non-Goals

### Goals
- Replace all slider range inputs with clear, accessible combobox/select inputs offering explicit numerical ratings (1–10) and qualitative descriptors.
- Implement a simulated benchmark API (`scoringApi.ts`) that asynchronously compares sub-scores and aggregate scores against benchmark matrices, yielding status bands (`LOW`, `NORMAL`, `HIGH`, `CRITICAL`).
- Simplify the layout into a clean, flat enterprise design with no decorative gradient hero banners or unnecessary icons.
- Maintain reactive validation, 2–4 fields per stage, and seamless 5-stage vs 8-stage dynamic escalation.

### Non-Goals
- Real backend API integration (remains entirely client-side simulated async service).
- Modifying Stage 1 intake fields (which remains the unified entry point).

## Decisions

### 1. Factor Selection Control: Standardized Combobox Dropdowns
- **Decision**: Use `<SelectInput>` components or styled `<select>` elements with standard 1–10 options:
  - `1` (1 - Minimal)
  - `3` (3 - Low)
  - `5` (5 - Moderate)
  - `7` (7 - High)
  - `10` (10 - Critical)
- **Rationale**: Immediate clarity on mobile and desktop without ambiguous slider drag positions; ensures accessible keyboard navigation.
- **Alternatives Considered**: Custom popover combobox with search (overkill for 5–10 discrete values); number input with stepper (lacks immediate qualitative label).

### 2. Simulated Score Benchmark API (`scoringApi.ts`)
- **Decision**: Create an async service `evaluateScore(score: number, context: 'subscore' | 'gate' | 'total'): Promise<BenchmarkResult>` that simulates a realistic network call (150ms delay) with benchmark bands:
  - `< 6`: `LOW` (Green pill / `bg-emerald-50 text-emerald-700 border-emerald-200`)
  - `6 - 11`: `NORMAL` (Blue pill / `bg-sky-50 text-sky-700 border-sky-200`)
  - `12 - 16`: `HIGH` (Amber pill / `bg-amber-50 text-amber-700 border-amber-200`)
  - `> 16`: `CRITICAL` (Rose pill / `bg-rose-50 text-rose-700 border-rose-200`)
- **Rationale**: Clean separation of business benchmark logic from UI components, matching real-world enterprise architectures where scoring engines reside behind APIs.

### 3. Reactive Benchmark Integration in Form Store / Composables
- **Decision**: Trigger async evaluation on factor changes with debounce or immediate watch, storing benchmark results in reactive state (e.g., `stage2Benchmark`, `stage3Benchmark`, `gateBenchmark`, `grandTotalBenchmark`) with simple loading/resolved states.
- **Rationale**: Decouples presentation from scoring calculations and prevents UI freeze.

### 4. Flat Minimalist Enterprise Styling
- **Decision**:
  - Remove dark gradient banners (e.g., `from-slate-900 to-indigo-950`) and complex card gradients.
  - Standardize on clean neutral borders (`border-slate-200`), clean white/light gray cards (`bg-white border border-slate-200 rounded-lg p-5`), flat semantic badges, and clear text hierarchy.
  - Strip redundant decorative SVG illustrations in stage headers; retain simple status badges and necessary navigation buttons.
- **Rationale**: Provides a crisp, distraction-free corporate aesthetic suitable for high-density enterprise operations.

## Risks / Trade-offs

- **[Async Evaluation Latency during Fast Step Navigation]** → Mitigation: Cache evaluations and make transitions seamless so the form does not stutter or lock while evaluating scores.
- **[Dropdown Value Casts]** → Mitigation: Ensure select option values are parsed as numbers (`Number(target.value)`) before passing to formula calculations to avoid string concatenation bugs.
