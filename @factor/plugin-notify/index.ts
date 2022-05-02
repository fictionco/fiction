import { FactorPlugin } from "@factor/api"

export class FactorNotify extends FactorPlugin<{}> {
  constructor() {
    super({})
  }
  setup = () => {
    return {
      name: this.constructor.name,
      paths: [this.utils.safeDirname(import.meta.url)],
    }
  }
}
