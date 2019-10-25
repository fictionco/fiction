// import { resolve, join, dirname } from "path"
// export const buildFixture = fixture => {
//   process.env.FACTOR_CWD = dirname(require.resolve(fixture))
//   process.env.FACTOR_ENV = "test"

//   test(`Build ${fixture}`, async () => {
//     const cli = require("@factor/cli")

//     const Factor = await cli.factorize()

//     await Factor.$filters.run("create-distribution-app", { testing: true })

//     expect(2).toBe(2)
//   }, 100000)
// }

// export const loadFixture = async fixture => {
//   process.env.FACTOR_CWD = dirname(require.resolve(fixture))
//   process.env.FACTOR_ENV = "test"
//   const cli = require("@factor/cli")

//   return await cli.factorize()
// }
