import path from "path"
import fs from "fs-extra"
import { compile, JSONSchema } from "json-schema-to-typescript"
import { UserConfig } from "@factor/types"
import { runHooks } from "./hook"

export const generateStaticConfig = async (
  config: UserConfig,
): Promise<void> => {
  const genConfigPath = path.join(process.cwd(), "/.factor")
  const title = "CompiledUserConfig"

  const staticConfig = {
    routes:
      config.routes
        ?.map((_) => _.name)
        .filter((_) => _)
        .sort() ?? [],
    paths: config.paths?.sort() || [],
    endpoints: config.endpoints
      ?.map((_) => _.key)
      .sort()
      .filter((_) => _) ?? [""],
  }

  const staticSchema: JSONSchema = {
    title,
    type: "object",
    properties: {
      endpoints: {
        enum: staticConfig.endpoints,
        type: "string",
      },
      routes: {
        enum: staticConfig.routes,
        type: "string",
      },
      paths: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: ["routes"],
  }

  const schema = await runHooks({
    hook: "staticConfig",
    args: [{ staticConfig, staticSchema }],
  })

  const stringed = JSON.stringify(schema.staticConfig, null, 2)

  const configJson = path.join(genConfigPath, "config.json")
  const ts = await compile(schema.staticSchema, title, { format: true })

  await fs.emptyDir(genConfigPath)
  await fs.ensureFile(configJson)
  await fs.writeFile(configJson, stringed)
  await fs.writeFile(path.join(genConfigPath, "config.ts"), ts)
}
