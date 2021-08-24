import path from "path"
import os from "os"

export const temporaryDirectory = path.join(
  os.tmpdir(),
  "jest_playwright_global_setup",
)

export const playwrightEndpointPath = path.join(
  temporaryDirectory,
  "wsEndpoint",
)
