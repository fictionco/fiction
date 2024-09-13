import type { FictionPosts } from '..'
import type { ManageIndexParamsRequest, ManagePostParamsRequest } from '../endpoint'
import { Post } from '../post'

export async function managePost(args: { fictionPosts: FictionPosts, params: ManagePostParamsRequest }): Promise<Post | undefined> {
  const { fictionPosts, params } = args
  const r = await fictionPosts.requests.ManagePost.projectRequest(params)

  return r.data ? new Post({ fictionPosts, ...r.data, sourceMode: 'global' }) : undefined
}

export async function managePostIndex(args: { fictionPosts: FictionPosts, params: ManageIndexParamsRequest }): Promise<Post[]> {
  const { fictionPosts, params } = args
  const r = await fictionPosts.requests.ManagePostIndex.projectRequest(params)

  return r.data?.length ? r.data.map(p => new Post({ fictionPosts, ...p, sourceMode: 'global' })) : []
}
