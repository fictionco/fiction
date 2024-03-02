import process from 'node:process'
import { chalk, fs } from '@fiction/core'

const msgPath = process.env.GIT_PARAMS ?? ''
const msg = fs.readFileSync(msgPath, 'utf8').trim()

const reasons = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'workflow',
  'build',
  'ci',
  'chore',
  'types',
  'wip',
  'release',
  'explore',
]

const commitRE = new RegExp(
  `^(revert: )?(${reasons.join('|')})((.+))?: .{1,50}`,
)

if (!commitRE.test(msg)) {
  console.error(
    `\n${chalk.bgBlue.white.bold(' FIX COMMIT MESSAGE FORMAT ')}\n\n`
    + `${chalk.bold(
        `Invalid commit message with text: "${msg}"`,
      )}\n\n A special message format is needed for changelogs. Examples:\n\n`
      + `    ${chalk.bold(`reason(category): description`)}\n`
      + `    ${chalk.bold(`feat(compiler): add 'comments' option`)}\n`
      + `    ${chalk.bold(`fix(ops): handle events on blur (close #28)`)}\n\n`
      + ` ${chalk.bold(`Available commit reasons:\n`)} ${reasons.join(', ')}\n\n`,
  )

  process.exit(1)
}
