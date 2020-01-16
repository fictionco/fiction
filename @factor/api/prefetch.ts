import { addCallback, applyFilters } from "@factor/api/hooks"
import { setting } from "@factor/api/settings"
import { currentRoute } from "@factor/app/router"
import { storeItem } from "@factor/app/store"
import { EndpointParameters } from "@factor/endpoint"
import { requestPostSingle } from "@factor/post/request"
import { FactorPost } from "@factor/post/types"

export const addGlobalPrefetch = ({
  key,
  callback
}: {
  key: string;
  callback: () => Promise<void>;
}): void => {
  addCallback({ hook: "global-prefetch", key, callback })
}

type PrefetchArguments = {
  status: string;
  permalink?: string;
  _id?: string;
} & EndpointParameters

export const preFetchPost = async ({
  to = null,
  clientOnly = false
} = {}): Promise<void> => {
  const route = to || currentRoute()

  const request = applyFilters("post-params", {
    ...route.params,
    ...route.query,
    status: "published"
  } as PrefetchArguments)

  const { permalink = "", _id } = request

  // Only add to the filter if permalink is set. That way we don't show loader for no reason.
  if (
    (!permalink && !_id) ||
    (permalink && permalink == "__webpack_hmr") ||
    /\.(png|jpg|gif|svg|ico)$/.test(permalink) ||
    route.path.includes(setting("dashboard.route"))
  ) {
    return
  }
  // For pre-fetching that happens only in the browser
  // If this applied on server it causes a mismatch (store set with full post then set to loading)
  if (clientOnly) {
    storeItem("post", { loading: true })
  }

  const post: FactorPost = await requestPostSingle(request)

  storeItem("post", post)

  return
}
