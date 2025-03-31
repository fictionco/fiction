# Fiction Codebase Guidelines

## Build/Lint/Test Commands

- Development: `npm run app:dev`
- Build: `npm run generate`
- Lint: `npm run lint:dev`
- Type Check: `npm run types:ci` or watch with `npm run types:dev`
- Run Unit Tests: `npm run unit:dev`
- Run Single Test: `npx vitest run path/to/test.unit.test.ts`
- Coverage: `npm run unit:coverage`

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

Commit hooks run type checking via `simple-git-hooks` to ensure type safety.