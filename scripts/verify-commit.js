// @ts-nocheck
/* eslint-disable no-console */
const chalk = require("chalk")
const msgPath = process.env.GIT_PARAMS
const msg = require("fs")
  .readFileSync(msgPath, "utf-8")
  .trim()

const commitRE = /^(revert: )?(version|release|feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
  console.log()
  console.error(
    `  ${chalk.bgRed.white(" ERROR ")} ${chalk.red(
      `invalid message format for commit "${msg}"`
    )}\n\n` +
      chalk.red(
        `  Proper commit message format is required for automated changelog generation. Examples:\n\n`
      ) +
      `    ${chalk.green(`feat(compiler): add 'comments' option`)}\n` +
      `    ${chalk.green(`fix(v-model): handle events on blur (close #28)`)}\n\n` +
      chalk.red(`  See .github/commit-convention.md for more details.\n`)
  )
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1)
}
