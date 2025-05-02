import type { Card } from '@fiction/site'
import type { FictionPosts, TablePostConfig } from '..'
import type { ManagePostParamsRequest } from '../endpoint'
import { getNested, setNested, toSlug } from '@fiction/core'
import { Post } from '../post'

// https://stackoverflow.com/a/57103940/1858322
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

export async function managePost(args: { card: Card, fictionPosts: FictionPosts, params: DistributiveOmit<ManagePostParamsRequest, 'orgId' | 'userId'>, caller: string, disableNotify?: boolean }): Promise<Post | undefined> {
  const { fictionPosts, params, caller = 'unknown', disableNotify, card } = args

  const r = await fictionPosts.requests.ManagePost.projectRequest(params as ManagePostParamsRequest, { caller, disableNotify })

  const postConfig = r.data?.[0]

  return r.data ? new Post({ card, fictionPosts, ...postConfig }) : undefined
}

export async function managePostIndex(args: { fictionPosts: FictionPosts, params: DistributiveOmit<ManagePostParamsRequest, 'orgId'>, caller: string }): Promise<Post[]> {
  const { fictionPosts, params, caller = 'unknown' } = args
  const r = await fictionPosts.requests.ManagePost.projectRequest(params, { caller })

  return r.data?.length ? r.data.map(p => new Post({ fictionPosts, ...p })) : []
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

export function syncFields(args: { post: Post }) {
  const { post } = args
  const updates: Record<string, any> = {}

  // Define sync relationships: source → [targets with transformers]
  const syncMap = {
    title: [
      { path: 'slug', transform: toSlug },
      { path: 'userConfig.site.title', transform: (v: string) => v },
      { path: 'emailConfig.subject', transform: (v: string) => v },
    ],
    subTitle: [
      { path: 'userConfig.site.description', transform: (v: string) => v },
      { path: 'emailConfig.preview', transform: (v: string) => v },
    ],
  }

  // Process each source field
  Object.entries(syncMap).forEach(([source, targets]) => {
    const sourceValue = post[source as 'title' | 'subTitle']?.value
    const originalValue = post.settings[source as keyof TablePostConfig] as string

    // Process each target for this source
    targets.forEach(({ path, transform }) => {
      const currentValue = getNested({ data: post.toConfig(), path })
      const expectedValue = transform(originalValue || '')

      // Only update if target matches expected value from original source
      if (!currentValue || currentValue === expectedValue) {
        // Build update object for this path
        const newValue = transform(sourceValue)
        Object.assign(updates, setNested({ data: updates, path, value: newValue }))
      }
    })
  })

  // Apply updates if any exist
  if (Object.keys(updates).length > 0) {
    post.update(updates, { caller: 'syncFields', noSave: true })
  }
}
