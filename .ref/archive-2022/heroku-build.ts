/* eslint-disable no-console */
import { execa } from 'execa'

function run(): void {
  if (!process.env.HEROKU_BUILD_COMMAND)
    return console.error('NO BUILD: no HEROKU_BUILD_COMMAND variable is set')

  else

    console.log(`building with '${process.env.HEROKU_BUILD_COMMAND}'`)

  const cmd = process.env.HEROKU_BUILD_COMMAND

  const [first, ...rest] = cmd?.split(' ') || []

  const _process = execa(first, rest)

  if (_process.stdout)
    _process.stdout.pipe(process.stdout)

  if (_process.stderr)
    _process.stderr.pipe(process.stderr)
}

run()
