/* eslint-disable jest/no-export */
import path from "path"
import fs from "fs-extra"
import execa from "execa"
/**
 * Build an app using it's module name
 */
export const buildFixture = (moduleName: string): void => {
  const cwd = path.dirname(
    require.resolve(path.join(moduleName, "package.json")),
  )

  fs.removeSync(path.resolve(cwd, "dist"))

  test(`Build ${moduleName}`, async () => {
    let error: Error | undefined = undefined

    try {
      await execa("factor", ["prerender"], {
        cwd,
        stdio: "inherit",
      })
    } catch (error_: any) {
      error = error_
    }

    expect(error).not.toBeTruthy()
  }, 100_000)
}
