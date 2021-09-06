import { fetchUser, fetchItems, fetchIdsByType } from "."
import { storeItem, stored, currentRoute } from "@factor/api"
import { ListTypes, DataItem, UserItem } from "./types"

export const itemsPerPage = 50

/**
 * Ids of the items that should be currently displayed based on
 * current list type and current pagination
 */
export const getActiveIds = (): string[] => {
  const activeType = stored<ListTypes>("activeType") ?? ListTypes.TOP

  if (!activeType) return []

  const route = currentRoute()

  const page = Number(route.params.page) || 1
  const start = (page - 1) * itemsPerPage
  const end = page * itemsPerPage

  const list = stored<string[]>(activeType) ?? []

  return list.slice(start, end)
}

/**
 * Set a list of items in the store
 */
export const setItems = ({ items }: { items: DataItem[] }): void => {
  items.forEach((item) => {
    if (item) {
      storeItem(item.id, item)
    }
  })
}

/**
 * on the client, the store itself serves as a cache.
 * only fetch items that we do not already have, or has expired (3 minutes)
 * @param ids - list of HN item ids
 */
export const requestItems = async ({
  ids,
}: {
  ids: string[]
}): Promise<void> => {
  const now = Date.now()
  ids = ids.filter((id: string) => {
    const item = stored<DataItem>(id)
    if (!item) {
      return true
    }
    if (now - item.__lastUpdated > 1000 * 60 * 3) {
      return true
    }
    return false
  })
  if (ids.length > 0) {
    const items = await fetchItems(ids)
    setItems({ items })
  }

  return
}

/**
 * ensure all active items are fetched and in store
 */
export const ensureActiveItems = (): Promise<void> => {
  return requestItems({
    ids: getActiveIds(),
  })
}

export const setUser = ({ id, user }: { id: string; user?: any }): void => {
  storeItem(id, user || false)
}

export const requestUser = async ({
  id,
}: {
  id: string
}): Promise<UserItem> => {
  let user = stored<UserItem>(id)

  if (user) return user

  user = await fetchUser(id)

  setUser({ id, user })

  return user
}

export const setActiveType = ({ type }: { type: ListTypes }): void => {
  storeItem("activeType", type)
}

export const setList = ({
  type,
  ids,
}: {
  type: ListTypes
  ids: string[]
}): void => {
  storeItem(type, ids)
}

/**
 * recursively fetch all descendent comments
 */
export const fetchComments = async (item?: DataItem): Promise<void> => {
  if (item && item.kids) {
    await requestItems({
      ids: item.kids,
    })

    Promise.all(
      item.kids.map((id: string) => {
        return fetchComments(stored<DataItem>(id))
      }),
    )
  } else return
}

/**
 * items that should be currently displayed.
 * this Array may not be fully fetched.
 */
export const getActiveItems = (): DataItem[] => {
  return getActiveIds()
    .map((id: string | number) => stored<DataItem>(id))
    .filter((_: any) => _) as DataItem[]
}

/**
 * ensure data for rendering given list type
 */
export const requestListData = async ({
  type,
}: {
  type: ListTypes
}): Promise<void> => {
  setActiveType({ type })

  const ids = await fetchIdsByType(type)

  await setList({ type, ids })

  await ensureActiveItems()

  return
}
