import { resolve, join, dirname } from "path"
export const buildFixture = fixture => {
  process.env.FACTOR_CWD = dirname(require.resolve(fixture))
  process.env.FACTOR_ENV = "test"
  test(`Build ${fixture}`, async () => {
    const cli = require("@factor/cli").default

    const Factor = await cli.extend()

    await Factor.$filters.run("create-distribution-app", { testing: true })

    expect(2).toBe(2)
  }, 100000)
}

export const loadFixture = async fixture => {
  process.env.FACTOR_CWD = dirname(require.resolve(fixture))
  process.env.FACTOR_ENV = "test"
  const cli = require("@factor/cli").default

  return await cli.extend()
}
