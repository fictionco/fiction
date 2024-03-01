import * as un from 'unsplash-js'
import nodeFetch from 'node-fetch'
import { Query } from '@factor/api/query'
import type { EndpointResponse } from '@factor/api/types'
import type { EndpointMeta } from '@factor/api'
import type { FactorUnsplash } from '.'

interface FactorUnsplashSettings {
  factorUnsplash: FactorUnsplash
}

interface UnsplashQueryParams {
  _action: 'search' | 'random'
  query?: string
  orientation?: un.Orientation

}

interface UnsplashPhoto {
  urls: { full: string, regular: string }
}

export class QueryUnsplash extends Query<FactorUnsplashSettings> {
  accessKey = this.settings.factorUnsplash.unsplashAccessKey

  count = 100
  constructor(settings: FactorUnsplashSettings) {
    super(settings)
  }

  getApi() {
    if (!this.accessKey)
      throw new Error('No Unsplash API Key')

    return un.createApi({
      accessKey: this.accessKey,
      // @ts-expect-error // npm package wants a fetch globally or this...
      fetch: nodeFetch,
    })
  }

  async run(
    params: UnsplashQueryParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<UnsplashPhoto[]>> {
    const api = this.getApi()

    const { _action, query, orientation } = params
    let data
    let r
    if (_action === 'search' && query) {
      const r = await api.search.getPhotos({ query, page: 1, perPage: this.count, orientation })
      if (r?.response)
        data = r.response.results
    }
    else if (_action === 'random') {
      r = await api.photos.getRandom({ count: this.count, featured: true, query })

      if (r?.response)
        data = r.response
    }

    if (r?.errors)
      throw this.stop('unsplash error', { data: r.errors })

    return { status: 'success', data: data as UnsplashPhoto[] }
  }
}
