import type {
  EndpointResponse,
  FactorAws,
  FactorDb,
} from '@factor/api'
import {
  Query,
} from '@factor/api'

// import type { Invalidation } from "@aws-sdk/client-cloudfront"
import type { FactorCache } from '.'

interface FactorCacheSettings {
  factorAws?: FactorAws
  factorCache: FactorCache
  factorDb?: FactorDb
}

export class QueryBustSiteScript extends Query {
  factorAws?: FactorAws
  factorCache: FactorCache
  factorDb?: FactorDb
  constructor(settings: FactorCacheSettings) {
    super(settings)
    this.factorAws = settings.factorAws
    this.factorDb = settings.factorDb
    this.factorCache = settings.factorCache
  }

  async run(params: { projectId: string }): Promise<EndpointResponse<true>> {
    if (!this.factorAws || !this.factorDb)
      throw new Error('Missing dependencies')

    const { projectId } = params
    // const distributionId = process.env.SCRIPT_DISTRIBUTION_ID

    // if (!distributionId) throw this.stop({ message: "no distribution found" })

    // // bust cloudfront cache
    // const r = await this.factorAws.bustCdnCache({
    //   distributionId,
    //   paths: [`/${projectId}.*`],
    // })

    // clear the redis site cache
    this.factorCache
      .projectCache({ projectId, _action: 'bust' })
      .catch(console.error)

    return { status: 'success', data: true }
  }
}
