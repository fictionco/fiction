import { _stop } from "../error"
import { EndpointMethodOptions, FactorEndpoint } from "../engine/endpoint"
import { Query } from "../engine/query"
import { Queries as UserAuthQueries, ManageUserParams } from "./userAuth"
import { Queries as UserGoogleAuthQueries } from "./userGoogle"

export type { ManageUserParams }

export class UserMethod<T extends Query> extends FactorEndpoint<T> {
  constructor(options: EndpointMethodOptions<T>) {
    super({ basePath: "/user", ...options })
  }
}

export const Queries = {
  ...UserAuthQueries,
  ...UserGoogleAuthQueries,
}

type EndpointMap = {
  [P in keyof typeof Queries]: UserMethod<typeof Queries[P]>
}

export const userEndpoints = (): EndpointMap => {
  return Object.fromEntries(
    Object.entries(Queries).map(([key, query]) => {
      return [key, new UserMethod({ key, queryHandler: query })]
    }),
  ) as EndpointMap
}
