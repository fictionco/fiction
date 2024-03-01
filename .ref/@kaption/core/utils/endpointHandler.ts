import type { EndpointSettings, Query } from '@factor/api'
import { Endpoint } from '@factor/api'
import type { FactorAdmin } from '@factor/api/plugin-admin'

export class KaptionEndpoint<T extends Query> extends Endpoint<T> {
  // adds project based handling
  factorAdmin?: FactorAdmin
  constructor(settings: { factorAdmin?: FactorAdmin } & EndpointSettings<T>) {
    super(settings)

    this.factorAdmin = settings.factorAdmin
  }
}

export type KaptionEndpointMap<T extends Record<string, Query>> = {
  [P in keyof T]: KaptionEndpoint<T[P]>
}
