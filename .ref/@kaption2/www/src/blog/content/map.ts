import { posts as trafficPosts } from './traffic'
import { posts as analyticPosts } from './analytics'

export const posts = [...trafficPosts, ...analyticPosts]
