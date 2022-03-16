/* eslint-disable @typescript-eslint/no-use-before-define */
import { _stop } from "@factor/api/error"

import { Queries as UserAuthQueries } from "./userAuth"
import { Queries as UserGoogleAuthQueries } from "./userGoogle"
import { serverUrl } from "./url"

import { EndpointMethodOptions, Endpoint } from "./endpoint"

import { Query } from "./query"
export class UserMethod<T extends Query> extends Endpoint<T> {
  constructor(options: EndpointMethodOptions<T>) {
    super({ baseURL: serverUrl(), basePath: "/user", ...options })
  }
}

export const Queries = {
  ...UserAuthQueries,
  ...UserGoogleAuthQueries,
}

type EndpointMap = {
  [P in keyof typeof Queries]: UserMethod<typeof Queries[P]>
}

export const getEndpointsMap = (): EndpointMap => {
  return Object.fromEntries(
    Object.entries(Queries).map(([key, query]) => {
      return [key, new UserMethod({ key, queryHandler: query })]
    }),
  ) as EndpointMap
}
