import type {
  EndpointResponse,
  FictionAws,
  FictionDb,
} from '@fiction/core'
import {
  Query,
} from '@fiction/core'

// import type { Invalidation } from "@aws-sdk/client-cloudfront"
import type { FictionCache } from '.'

interface FictionCacheSettings {
  fictionAws?: FictionAws
  fictionCache: FictionCache
  fictionDb?: FictionDb
}

export class QueryBustSiteScript extends Query {
  fictionAws?: FictionAws
  fictionCache: FictionCache
  fictionDb?: FictionDb
  constructor(settings: FictionCacheSettings) {
    super(settings)
    this.fictionAws = settings.fictionAws
    this.fictionDb = settings.fictionDb
    this.fictionCache = settings.fictionCache
  }

  async run(params: { projectId: string }): Promise<EndpointResponse<true>> {
    if (!this.fictionAws || !this.fictionDb)
      throw new Error('Missing dependencies')

    const { projectId } = params
    // const distributionId = process.env.SCRIPT_DISTRIBUTION_ID

    // if (!distributionId) throw this.stop({ message: "no distribution found" })

    // // bust cloudfront cache
    // const r = await this.fictionAws.bustCdnCache({
    //   distributionId,
    //   paths: [`/${projectId}.*`],
    // })

    // clear the redis site cache
    this.fictionCache
      .projectCache({ projectId, _action: 'bust' })
      .catch(console.error)

    return { status: 'success', data: true }
  }
}
