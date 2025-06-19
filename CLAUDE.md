# Fiction Codebase Guidelines

## Build/Lint/Test Commands

- Development: `npm run app:dev`
- Build: `npm run generate`
- Lint: `npm run lint:dev`
- Type Check: `npm run types:ci` or watch with `npm run types:dev`
- Run Unit Tests: `npm run unit:dev`
- Run Single Test: `npx vitest run path/to/test.unit.test.ts`
- Coverage: `npm run unit:coverage`

## Core Architecture Principles

- **Plugin System:** Extend functionality through modular FictionPlugin classes
- **Card/Template System:** Build reusable UI components following card template patterns
- **Schema-Driven:** Use Zod schemas for validation and type safety
- **Dependency Injection:** Pass services as dependencies, avoid globals and tight coupling
- **Single Responsibility:** Each module/class does one thing well
- **YAGNI/KISS:** Build only what's needed, keep it simple and maintainable

## Code Style Guidelines

- **Formatting:** Uses Antfu ESLint config with custom rules
- **Naming:** Use camelCase for variables/functions, PascalCase for components/classes
- **Imports:** Group by external -> internal -> local, with external first
- **Types:** TypeScript with Vue 3 composition API; avoid `any` when possible
- **Error Handling:** Catch specific errors, avoid bare try/catch blocks
- **Vue Components:** Use Vue 3 composition API with `<script setup>` syntax
- **Max Statements:** No more than 2 statements per line
- **File Organization:** Group files by feature/module in workspace packages
- **Testing:** Files should end with pattern `.{type}.test.ts` (unit/flow/uiux)

## Function Design Patterns

- **Arguments:** Use single argument objects for extensibility: `{ param1, param2 }` over `param1, param2`
- **Pure Functions:** Avoid side effects when possible, make functions testable
- **Return Values:** Return meaningful objects/arrays, not primitives when context matters
- **Error Handling:** Throw typed errors, provide context in error messages
- **Async Operations:** Use async/await, handle errors appropriately

## Vue.js Guidelines (3.5+)

- **Composition API Only:** Use `<script lang="ts" setup>`, no Options API or JSX
- **Props Destructuring:** Leverage reactive destructuring with defaults:
  ```typescript
  const { count = 0, msg = 'hello' } = defineProps<{ count?: number, msg?: string }>()
  ```
- **Component Interface:** Use `defineProps`, `defineEmits`, `defineExpose` for typed interfaces
- **SSR Compatibility:** Ensure all components work with server-side rendering
- **Reactivity:** Use `ref`/`reactive` for shared state in functions/classes
- **Template Syntax:** Keep templates simple, move complex logic to computed properties

## TypeScript Guidelines

- **Type Definitions:** Prefer `type` over `interface`, minimize complexity unless valuable
- **Schema Integration:** Leverage existing Zod schemas for type inference
- **Functional Programming:** Use pure functions with injected dependencies
- **Utility Types:** Create reusable utility types for common patterns
- **Type Safety:** Ensure code is free of type errors, avoid `any`

## CSS/Styling Guidelines

- **Tailwind CSS:** Use full class names, no dynamic string interpolation
- **Class Organization:** Group related classes logically (spacing, colors, layout)
- **Responsive Design:** Mobile-first approach with appropriate breakpoints
- **Component Styling:** Keep styles scoped and component-specific
- **Minimal Approach:** Use only necessary styles, avoid over-decoration

## Database & Backend Guidelines

- **Query Builder:** Use Knex for Postgres and ClickHouse queries
- **SQL Performance:** Keep queries lean and performant, use proper indexing
- **Schema Design:** Follow established table patterns in `schema.ts` files
- **Data Validation:** Use Zod schemas for input/output validation
- **Error Handling:** Provide meaningful database error messages

## Testing Guidelines

- **Test-Driven Development:** Write tests first when possible
- **Descriptive Assertions:** Include context in test assertions:
  ```typescript
  expect(value, 'Value should match expected output').toBe(expected)
  ```
- **Test Utilities:** Use established test utilities over mocks for internal dependencies
- **Test Organization:** Group tests by functionality, use clear describe blocks
- **Coverage:** Aim for meaningful coverage, not just percentage targets

## Script Development Guidelines

- **Language:** TypeScript with ESM modules (import/export)
- **Node Version:** Use latest Node.js features (>=23.6.0)
- **Coding Style:** Functional programming, concise, YAGNI principle
- **Architecture:** DRY (Don't Repeat Yourself) and well-refactored code
- **Functions:** Pure functions when possible, avoid side effects
- **Async:** Use async/await over Promises, top-level await when needed
- **Structure:** Abstract complex operations to top, keep main logic simple and readable
- **API Design:** Simple, predictable interfaces over complex abstractions
- **Classes:** Use classes to encapsulate complex logic and group related functionality to reduce cognitive load

## Dependency Management

- **Minimal Dependencies:** Justify any external dependencies with clear benefits
- **Internal Utilities:** Create utility functions to reduce business logic complexity
- **Version Pinning:** Use specific versions for critical dependencies
- **Bundle Analysis:** Monitor bundle size and avoid bloat

## Development Workflow

- **Feature Branches:** Use descriptive branch names following convention
- **Commit Messages:** Write clear, actionable commit messages
- **Code Reviews:** Focus on maintainability, performance, and adherence to guidelines
- **Documentation:** Update relevant docs when adding new patterns or APIs
- **Type Checking:** Ensure all code passes type checking before commits

## File Organization & Exclusions

- **.ref Folders:** Contain reference code only, should be ignored
- **dist Folders:** Generated build output, should be ignored
- **Double Underscore Prefix:** Files/folders starting with `__` are deprecated or experimental, should be ignored
- **Barrel Files:** Use `index.ts` files to organize exports by functionality
- **Feature Grouping:** Organize by feature/module rather than by technology type
