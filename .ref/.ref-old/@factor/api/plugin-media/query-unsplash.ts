import * as un from "unsplash-js"
import nodeFetch from "node-fetch"
import { Query } from "../query"
import { EndpointResponse } from "../types"
import type { FactorMedia } from "."

type FactorUnsplashSettings = {
  factorMedia: FactorMedia
}

type UnsplashQueryParams = {
  _action: "search" | "random"
  query?: string
}

type UnsplashPhoto = {
  urls: { full: string; regular: string }
}

export class QueryUnsplash extends Query<FactorUnsplashSettings> {
  accessKey = this.settings.factorMedia.unsplashAccessKey
  api?: ReturnType<typeof un.createApi>
  count = 100
  constructor(settings: FactorUnsplashSettings) {
    super(settings)

    if (this.accessKey) {
      this.api = un.createApi({
        accessKey: this.accessKey,
        // @ts-ignore // npm package wants a fetch globally or this...
        fetch: nodeFetch,
      })
    }
  }
  async run(
    params: UnsplashQueryParams,
  ): Promise<EndpointResponse<UnsplashPhoto[]>> {
    if (!this.api) throw this.stop("no unsplash api")

    const { _action, query } = params
    let data = undefined
    let r
    if (_action === "search" && query) {
      const r = await this.api.search.getPhotos({
        query,
        page: 1,
        perPage: this.count,
      })
      if (r?.response) {
        data = r.response.results
      }
    } else if (_action == "random") {
      r = await this.api.photos.getRandom({ count: this.count, featured: true })

      if (r?.response) {
        data = r.response
      }
    }

    if (r?.errors) {
      throw this.stop({ message: "unsplash error", data: r.errors })
    }

    return { status: "success", data: data as UnsplashPhoto[] }
  }
}
