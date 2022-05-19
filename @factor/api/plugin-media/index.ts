import { FactorPlugin } from "../plugin"

type MediaLibrarySettings = {}

export class FactorMediaLibrary extends FactorPlugin<MediaLibrarySettings> {
  constructor(settings: MediaLibrarySettings = {}) {
    super(settings)
  }
  setup() {}
}
