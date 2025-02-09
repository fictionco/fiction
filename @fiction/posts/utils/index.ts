import type { FictionPosts } from '..'
import type { ManagePostParamsRequest } from '../endpoint'
import { Post } from '../post'

// https://stackoverflow.com/a/57103940/1858322
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

export async function managePost(args: { fictionPosts: FictionPosts, params: DistributiveOmit<ManagePostParamsRequest, 'orgId' | 'userId'>, caller: string }): Promise<Post | undefined> {
  const { fictionPosts, params, caller = 'unknown' } = args
  const r = await fictionPosts.requests.ManagePost.projectRequest(params as ManagePostParamsRequest, { caller })

  const postConfig = r.data?.[0]

  return r.data ? new Post({ fictionPosts, ...postConfig, sourceMode: 'standard' }) : undefined
}

export async function managePostIndex(args: { fictionPosts: FictionPosts, params: DistributiveOmit<ManagePostParamsRequest, 'orgId'>, caller: string }): Promise<Post[]> {
  const { fictionPosts, params, caller = 'unknown' } = args
  const r = await fictionPosts.requests.ManagePost.projectRequest(params, { caller })

  return r.data?.length ? r.data.map(p => new Post({ fictionPosts, ...p, sourceMode: 'standard' })) : []
}

export async function createHelloWorldPost(args: { orgId: string, userId: string, fictionPosts: FictionPosts }) {
  const { fictionPosts, orgId, userId } = args

  const { createStockMediaHandler } = await import('@fiction/ui/stock')
  const stock = await createStockMediaHandler()
  await fictionPosts.queries.ManagePost.serve({
    _action: 'create',
    orgId,
    userId,
    fields: {
      title: 'Hello World',
      subTitle: 'Your first post to get things started',
      content: `
              <article>
                <p><em>Welcome to your first post!</em> This is where your story begins. Feel free to edit this content and make it your own.</p>

                <h2>Getting Started</h2>
                <p>Notice how headings and paragraphs create natural reading flow? Watch how styled elements catch attention:</p>

                <blockquote>
                  "Great content starts with a simple hello."
                  <footer>
                    <cite>— Your Site</cite>
                  </footer>
                </blockquote>

                <p>Ready to write your story? Just click edit to begin.</p>
              </article>
          `,
      media: stock.getRandomByTags(['aspect:square']),
      dateAt: new Date().toISOString(),
    },
  }, { server: true })
}
