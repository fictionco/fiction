import { UserConfig, FactorPlugin } from "@factor/api"

export class FactorHighlightCode extends FactorPlugin<{}> {
  constructor() {
    super({})
  }
  setup = (): UserConfig => {
    return {
      name: this.constructor.name,
      paths: [this.utils.safeDirname(import.meta.url)],
      vite: {
        optimizeDeps: {
          include: ["highlight.js"],
        },
      },
    }
  }
}
