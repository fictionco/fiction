import fs from "fs-extra"
import path from "path"

const setup = async (): Promise<void> => {
  // close playwright server
  await global.__BROWSER_SERVER__?.close()

  // remove temporary files
  if (!process.env.FACTOR_PRESERVE_BUILD_ARTIFACTS) {
    await fs.remove(path.resolve(__dirname, "../temp"))
  }
}

export default setup
