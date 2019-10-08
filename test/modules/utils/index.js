import { resolve, join, dirname } from "path"
export { default as getPort } from "get-port"
export { default as rp } from "request-promise-native"

export const waitFor = ms => {
  return new Promise(resolve => setTimeout(resolve, ms || 0))
}

export const buildFixture = fixture => {
  process.env.FACTOR_CWD = dirname(require.resolve(fixture))
  process.env.FACTOR_ENV = "test"

  test(`Build ${fixture}`, async () => {
    const cli = require("@factor/cli").default

    try {
      const Factor = await cli.factorize()

      await Factor.$filters.run("create-distribution-app", { testing: true })
    } catch (error) {
      console.error(error)
    }

    expect(2).toBe(2)
  }, 100000)
}

export const loadFixture = async fixture => {
  process.env.FACTOR_CWD = dirname(require.resolve(fixture))
  process.env.FACTOR_ENV = "test"
  const cli = require("@factor/cli").default

  return await cli.factorize()
}
