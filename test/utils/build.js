import { resolve, join, dirname } from "path"
export const buildFixture = function(fixture, callback, hooks = []) {
  process.env.FACTOR_CWD = dirname(require.resolve(fixture))

  test(`Build ${fixture}`, async () => {
    const cli = require("@factor/cli").default

    const Factor = await cli.extend()

    expect(2).toBe(2)
  }, 100000)
}
