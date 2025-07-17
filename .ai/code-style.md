# Code Style & Architecture

## Tech Stack
- pnpm, vite, vitest, vue v3.6, tailwindcss v4, typescript, eslint, zod

## Coding Heuristics

### General
- Prefer **clarity over cleverness**, **portability over optimization**
- Prefer **small repos** over large monorepos
- Prefer **explicit imports** — never rely on autoimports or magic
- Avoid global state — always use **dependency injection** for config/context
- Use **`FictionObject`** when state or settings are involved

### Engine Arrays vs Manual Logic

Use **engine arrays** when:
- Logic varies by key/type/role and needs to stay DRY
- Centralized behavior improves testability and maintainability

```ts
// ✅ DO
const engines = [
  { type: 'text', render: () => ... },
  { type: 'date', render: () => ... },
]

for (const field of fields) {
  const engine = engines.find(e => e.type === field.type)
  engine?.render()
}
```

Avoid manual if/else logic for repetitive or branching logic:

```ts
// ❌ DON'T
if (field.type === 'text') { ... }
else if (field.type === 'date') { ... }
```

## File & Folder Conventions

- `@fiction/core`: shared logic and modules
- `@fiction/core/utils`: pure stateless helpers
- `@fiction/ui`: shared Vue + Tailwind UI components

### File Types
- Test files: `{name}.{type}.test.ts` — types: `unit`, `flow`, `uiux`
- `.ref/`: reference-only, never imported
- `__deprecated/`: legacy, WIP, ignored
- `dist/`: ignored build output

## TailwindCSS Styling

### Usage Rules
- Use full class names — **never dynamic Tailwind strings**
- Class format: `[context]-primary-[weight]`, `[context]-theme-[weight]`
- e.g. `bg-primary-500`, `border-theme-300`, `text-primary-600`
- Avoid inline styles or overrides unless absolutely required

### Primary Blue Colors
`#ffffff - 0, #eff6ff - 25, #eff6ff - 50, #dbeafe - 100, #bfdbfe - 200, #93c5fd - 300, #60a5fa - 400, #3b82f6 - 500, #2563eb - 600, #1d4ed8 - 700, #1e40af - 800, #1e3a8a - 900, #172554 - 950, #111c44 - 975, #000000 - 1000`

### Theme Grays
`#ffffff - 0, #f8fafc - 25, #f3f4f6 - 50, #e5e7eb - 100, #d1d5db - 200, #9ca3af - 300, #6b7280 - 400, #4b5563 - 500, #374151 - 600, #1f2a44 - 700, #111827 - 800, #0c0a13 - 900, #030712 - 950, #02060f - 975, #000000 - 1000`

## Testability & Dependency Injection

- Inject all dependencies (settings, config, context)
- Avoid mocking when possible — use `testUtils` instead
- Pure logic = functions. Stateful modules = classes with DI
- No hidden side effects — everything testable in isolation

## Cognitive Load Optimization

- Keep reasoning **local** — no need to jump files to understand a single behavior
- Collapse logic into **engine arrays** or **objects** where appropriate
- Avoid interfaces that exist only for TypeScript purity or abstraction's sake
- Split files if they exceed one screen height or clarity suffers

## DOs and DON'Ts

### ✅ DO
- Use `FictionObject` for modular, testable stateful modules
- Plan for DRY + YAGNI before coding
- Prefer engine arrays over branching logic
- Write pure helpers
- Favor clarity over cleverness in every decision

### ❌ DON'T
- Use auto-imports or global side effects
- Add helpers that are one-offs or barely used
- Write logic-heavy interfaces that add cognitive load
- Use ternary or `map()`/`reduce()` over `for` loops when clarity suffers
- Create "just in case" abstractions
