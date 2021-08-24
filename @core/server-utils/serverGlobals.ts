import path from "path"
import { requireIfExists } from "./serverPaths"
import { deepMergeAll } from "@factor/api"
import { UserConfigServer } from "@factor/types"
import { nLog } from "./serverLogger"
export const packageConfig = (): Record<string, any> => {
  return require(path.join(process.cwd(), "package.json"))
}

export const getFactorConfig = (): UserConfigServer => {
  const { factor = {} } = packageConfig()

  const result = requireIfExists<{
    default: UserConfigServer
  }>(path.join(process.cwd(), "factor.config"))

  const configFile = result?.default || {}
  return deepMergeAll([factor, configFile])
}

export const setAppGlobals = (): void => {
  const conf = getFactorConfig()

  const test: {
    name: "appName" | "appEmail" | "appUrl" | "appDomain"
    gl: string
    defaultValue: string
  }[] = [
    { name: "appName", defaultValue: "Example", gl: "FACTOR_APP_NAME" },
    {
      name: "appEmail",
      defaultValue: "email@example.com",
      gl: "FACTOR_APP_EMAIL",
    },
    {
      name: "appUrl",
      defaultValue: "https://www.example.com",
      gl: "FACTOR_APP_URL",
    },
    { name: "appDomain", defaultValue: "example.com", gl: "FACTOR_APP_DOMAIN" },
  ]

  test.forEach(({ name, defaultValue, gl }) => {
    if (!conf[name]) {
      nLog(
        "error",
        `no factor config value for "${name}" - setting to "${defaultValue}"`,
      )
      conf[name] = defaultValue
    }
    process.env[gl] = conf[name]
  })
}
