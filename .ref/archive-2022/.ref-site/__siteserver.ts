import docsEngineServer from '@factor/plugin-docs-engine/server'
import blogEngineServer from '@factor/plugin-blog-engine/server'
import type { ServiceConfigServer } from '@factor/types'
import { featureList } from '../@apps/site/src/featureMap'
import { posts } from '../@apps/site/src/blog/map'
import { docs } from '../@apps/site/src/docs/map'

export function setup(): ServiceConfigServer | undefined {
  return {
    sitemaps: [
      {
        topic: 'feature',
        paths: featureList.map(_ => `/features/${_.path}`),
      },
    ],
    plugins: [
      docsEngineServer({ docs }),
      blogEngineServer({ posts, baseRoute: '/blog' }),
    ],
  }
}
