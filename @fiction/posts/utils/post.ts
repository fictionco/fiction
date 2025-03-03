import type { ComplexDataFilter, IndexMeta, PostHandlingObject, PostObject } from '@fiction/core'
import type { FictionPosts } from '@fiction/posts'
import type { Card, Site } from '@fiction/site'
import type { SiteContentPath } from '@fiction/site/load'
import type { StockMedia } from '@fiction/ui/stock'

import { toSlug } from '@fiction/core'
import { Post } from '@fiction/posts'
import { getSiteContentPaths } from '@fiction/site/load'
import { manageSiteIndex } from '@fiction/site/utils/manage'
import { activeSiteDisplayUrl } from '@fiction/site/utils/site'

export type LoadPostsResult = {
  posts: Post[]
  indexMeta: IndexMeta
  singlePost?: Post
  nextPost?: Post
}

export type LoadPostsConfig = {
  fictionPosts: FictionPosts
  card: Card
  postConfig: PostHandlingObject
  routeSlug?: string
  indexMeta?: IndexMeta
  viewSlug?: string
  filters?: ComplexDataFilter[]
}

/**
 * Load posts based on configuration, handles both local and global post loading
 */
export async function loadPosts(config: LoadPostsConfig): Promise<LoadPostsResult> {
  const {
    fictionPosts,
    card,
    postConfig,
    routeSlug,
    indexMeta = { offset: 0, limit: 12, count: 0 },
    viewSlug,
    filters = [],
  } = config

  // Default result structure
  const result: LoadPostsResult = {
    posts: [],
    indexMeta,
  }

  try {
    if (postConfig.format === 'local') {
      return await loadLocalPosts({
        postConfig,
        card,
        fictionPosts,
        routeSlug,
        indexMeta,
      })
    }
    else {
      return await loadGlobalPosts({
        fictionPosts,
        card,
        routeSlug,
        indexMeta,
        viewSlug,
        filters,
      })
    }
  }
  catch (error) {
    console.error('Error loading posts:', error)
    return result
  }
}

/**
 * Load posts from local entries in card configuration
 */
async function loadLocalPosts(args: {
  postConfig: PostHandlingObject
  card: Card
  fictionPosts: FictionPosts
  routeSlug?: string
  indexMeta: IndexMeta
}): Promise<LoadPostsResult> {
  const { postConfig, card, fictionPosts, routeSlug, indexMeta } = args
  const entries = postConfig.entries || []
  const { offset = 0, limit = 12 } = indexMeta

  // Create common post configuration
  const commonConfig = {
    fictionPosts,
    card,
    sourceMode: 'local' as const,
  }

  // Create all posts with proper indexing
  const allPosts = entries.map((p, i) => new Post({
    ...commonConfig,
    ...p,
    slug: p.slug || toSlug(p.title || ''),
    localSourcePath: `posts.entries.${i}`,
  }))

  const result: LoadPostsResult = {
    posts: allPosts.slice(offset, offset + limit),
    indexMeta: {
      offset,
      limit,
      count: entries.length,
    },
  }

  // Handle single post view if slug is provided
  if (routeSlug) {
    result.singlePost = allPosts.find(p => p.slug.value === routeSlug)
    result.nextPost = findNextPost(result.singlePost, allPosts)
  }

  return result
}

/**
 * Load posts from global post storage
 */
async function loadGlobalPosts(args: {
  fictionPosts: FictionPosts
  card: Card
  routeSlug?: string
  indexMeta: IndexMeta
  viewSlug?: string
  filters: ComplexDataFilter[]
}): Promise<LoadPostsResult> {
  const { fictionPosts, card, routeSlug, indexMeta, viewSlug, filters } = args
  const orgId = card.site?.settings.orgId

  if (!orgId) {
    console.error('No organization ID found')
    return { posts: [], indexMeta }
  }

  if (routeSlug) {
    const singlePost = await fictionPosts.getPost({
      card,
      where: { slug: routeSlug },
      orgId,
    })

    card.slug.value = routeSlug

    // Get list of posts for finding next post
    const postList = await fictionPosts.getPostIndex({
      card,
      limit: 10,
      offset: 0,
      orgId,
      caller: 'PostListCard',
      viewSlug,
      filters,
    })

    return {
      posts: postList?.posts || [],
      indexMeta,
      singlePost,
      nextPost: findNextPost(singlePost, postList?.posts || []),
    }
  }

  const indexArgs = {
    card,
    limit: indexMeta.limit,
    offset: indexMeta.offset,
    orgId,
    caller: 'PostListCard',
    viewSlug,
    filters,
  }

  const response = await fictionPosts.getPostIndex(indexArgs)

  return {
    posts: response?.posts || [],
    indexMeta: { ...indexMeta, ...(response?.indexMeta || {}) },
  }
}

/**
 * Find the next post in sequence
 */
function findNextPost(currentPost: Post | undefined, posts: Post[]): Post | undefined {
  if (!currentPost)
    return undefined

  const currentIndex = posts.findIndex(p => p.postId === currentPost.postId)
  return currentIndex >= 0 ? posts[currentIndex + 1] : undefined
}

export function getNextPost(args: { single?: Post, posts?: Post[] }) {
  const { single, posts = [] } = args
  if (!single)
    return undefined

  const index = posts.findIndex(p => p.slug.value === single.slug.value)
  if (index === -1)
    return undefined

  return posts[index + 1] || posts[index - 1] || undefined
}

export async function getPostPaths(args: {
  site: Site
  card: Card
  viewPath: string
  posts: PostHandlingObject
}): Promise<SiteContentPath[]> {
  const { site, viewPath, posts } = args
  const { fictionPosts } = site.fictionSites.fictionEnv.getService<{ fictionPosts: FictionPosts }>()

  const result = await loadPosts({
    fictionPosts,
    ...args,
    postConfig: posts,
    indexMeta: { limit: 1000 },
  })

  return result.posts.map(post => ({
    type: 'post',
    path: `/${viewPath}/${post.slug.value}`,
  }))
}

export type PostLocation = {
  url: string
  site: Site
  isCanonical?: boolean
}

export async function findPostLocations(args: { post: Post, fictionPosts: FictionPosts }): Promise<PostLocation[]> {
  const { post, fictionPosts } = args
  const fictionSites = fictionPosts.settings.fictionSites
  if (!post)
    return []

  // Get all sites for the organization
  const { sites } = await manageSiteIndex({ fictionSites, params: { _action: 'list' } })

  const allLocations = await Promise.all(sites.map(async (site) => {
    // Get all content paths for this site
    const contentPaths = await getSiteContentPaths(site)

    // Filter paths that match this post
    const postPaths = contentPaths.filter(path => path.type === 'post' && path.meta?.postId === post.postId)

    const siteUrl = activeSiteDisplayUrl(site, { mode: 'display' }).value

    // Format the results
    return postPaths.map((pathDetails) => {
      const url = new URL(pathDetails.path, siteUrl).toString()
      return { url, site }
    })
  }))

  // Flatten the results
  const locations = allLocations.flat()

  return locations
}

export function getDemoPosts(args: { stock: StockMedia, limit?: number }): PostObject[] {
  const { stock, limit } = args
  const baseDate = new Date('2024-03-20')

  const posts = [
    {
      title: 'The Hidden Story in Your Data',
      subTitle: 'Unlock the narrative power hiding in your numbers',
      slug: 'data-storytelling',
      authors: [{
        fullName: 'Marcus Lee',
        title: 'Data Journalist',
        email: 'marcus@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <p><em>Close your eyes and imagine</em> your data coming to life, each number transforming into a compelling story that captivates your readers. What if your charts could speak directly to your audience's deepest concerns?</p>

          <h2>When Numbers Tell Tales</h2>
          <p>Think about the last time a statistic genuinely moved you. What made it memorable? Was it the number itself, or the story it told? Let's discover how to create these moments for your readers.</p>

          <div >
            <h2>Your Data Storytelling Journey</h2>
            <ol style="margin: 20px 0;">
              <li>
                <h3>Find the Heart of Your Data</h3>
                <p>Notice how raw numbers feel cold until you connect them to human experience? Start by asking: "Why would my reader care about this?"</p>
              </li>
              <li>
                <h3>Build the Bridge</h3>
                <p>What if you could connect your data directly to your readers' lives? Look for the personal impact in every statistic.</p>
              </li>
              <li>
                <h3>Create the Aha Moment</h3>
                <p>Remember the last time you had a sudden insight? That's what we want to create for your readers.</p>
              </li>
            </ol>
          </div>

          <aside >
            <h3>Visualization Secrets Revealed</h3>
            <ul>
              <li>
                <strong>Choose Your Story Type:</strong>
                <p>See how different charts evoke different emotional responses? Match your visualization to your narrative.</p>
              </li>
              <li>
                <strong>Simplify for Impact:</strong>
                <p>Ever notice how the clearest charts often have the strongest impact?</p>
              </li>
              <li>
                <strong>Guide the Eye:</strong>
                <p>What catches your attention first in a visualization? Use this natural tendency to lead your readers through the data.</p>
              </li>
            </ul>
          </aside>

          <blockquote>
            "The goal isn't to tell your readers about data—it's to show them what matters. Imagine the moment they finally see what you see."
            <footer style="margin-top: 8px;">
              <cite>— Marcus Lee</cite>
            </footer>
          </blockquote>

          <p>Ready to transform your data from forgettable figures into unforgettable stories? Let's begin your journey into data storytelling mastery.</p>
        </article>
      `,
      excerpt: 'Transform dry statistics into compelling narratives that your readers can\'t resist. Discover the storyteller hiding in your spreadsheets.',
      categories: ['Analytics'],
      tags: ['data', 'storytelling', 'visualization'],
      media: stock.getRandomByTags(['background']),
      dateAt: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'Why Your SEO Isn\'t Working (And How to Fix It)',
      subTitle: 'Discover the human side of search engine optimization',
      slug: 'seo-content-guide',
      authors: [{
        fullName: 'Priya Sharma',
        title: 'SEO Strategist',
        email: 'priya@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <p><em>Remember the last time</em> you searched for something important? That feeling of finding exactly what you needed? That's not luck—it's strategic SEO at work. Let's make your content the answer people are searching for.</p>

          <section>
            <h2>The Truth About Modern SEO</h2>
            <p>Forget everything you think you know about SEO. Imagine if ranking well was less about technical tricks and more about genuinely understanding your readers. Let's explore how this shift changes everything.</p>

            <div >
              <div>
                <h3>What Search Engines See</h3>
                <ul>
                  <li>
                    <strong>Clear Structure</strong>
                    <p>Notice how well-organized content ranks better? It's not coincidence.</p>
                  </li>
                  <li>
                    <strong>Natural Language</strong>
                    <p>What if your keywords flowed as naturally as a conversation?</p>
                  </li>
                  <li>
                    <strong>Valuable Links</strong>
                    <p>Think of links as virtual handshakes—they build trust.</p>
                  </li>
                </ul>
              </div>

              <div>
                <h3>What Readers Experience</h3>
                <ul>
                  <li>
                    <strong>Instant Relevance</strong>
                    <p>Feel that moment when content perfectly matches your need?</p>
                  </li>
                  <li>
                    <strong>Easy Navigation</strong>
                    <p>Imagine finding everything you need without trying.</p>
                  </li>
                  <li>
                    <strong>Complete Answers</strong>
                    <p>What if every search led to a satisfying conclusion?</p>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <aside >
            <h3>Your SEO Transformation Checklist</h3>
            <p>Watch how your content changes when you focus on these elements:</p>
            <ol>
              <li>Is your content answering real questions?</li>
              <li>Could a friend understand your headlines?</li>
              <li>Does your page structure feel natural?</li>
              <li>Are you using terms your audience uses?</li>
            </ol>
          </aside>

          <div>
            <h3>The Secret Most SEO Experts Won't Tell You</h3>
            <p>The best SEO strategy is creating content so good, so useful, that people can't help but share it. Imagine your content becoming the go-to resource in your field.</p>
          </div>

          <p>Ready to see your content climb the rankings while genuinely helping your readers? Let's make your SEO work for both search engines and humans.</p>
        </article>
      `,
      excerpt: 'Stop fighting algorithms and start connecting with readers. Discover how human-centered SEO transforms your search rankings.',
      categories: ['SEO'],
      tags: ['optimization', 'search', 'content strategy'],
      media: stock.getRandomByTags(['object']),
      dateAt: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'The Art of Compelling Headlines',
      subTitle: 'Transform your ordinary titles into attention-grabbing headlines',
      slug: 'headline-writing-guide',
      authors: [{
        fullName: 'Sarah Chen',
        title: 'Content Strategy Lead',
        email: 'sarah@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <p><em>Picture this:</em> Your brilliant article sits unread while others get all the attention. The difference? Often it's just the headline. Let's transform your headlines from forgotten to unforgettable.</p>

          <h2>The 4 U's That Make Headlines Irresistible</h2>

          <p>Notice how great headlines seem to pull you in effortlessly? Here's the framework behind that magic:</p>

          <ul style="margin: 24px 0;">
            <li>
              <h3>Useful</h3>
              <p>Imagine your reader asking "What's in it for me?" Your headline should answer that instantly.</p>
            </li>
            <li>
              <h3>Urgent</h3>
              <p>Feel that slight anxiety when you might miss out on something important? That's urgency at work.</p>
            </li>
            <li>
              <h3>Unique</h3>
              <p>What would it feel like if your headline stood out from thousands of others? That's the power of uniqueness.</p>
            </li>
            <li>
              <h3>Ultra-specific</h3>
              <p>See how detailed headlines build instant credibility? They promise—and deliver—clear value.</p>
            </li>
          </ul>

          <h2>Transform Your Headlines Today</h2>

          <aside >
            <p><strong>Try this exercise:</strong> Take your last three blog titles and rewrite each one using the 4 U's. Watch how they transform from basic statements into compelling invitations.</p>
          </aside>

          <p>Have you ever noticed how some blogs seem to consistently capture attention while others struggle? The secret often lies in their headlines. Let's unlock that secret together.</p>

          <blockquote>
            "The headlines which work best are those that promise a story the audience already cares about. Now imagine how powerful your writing becomes when you master this art."
            <footer>
              <cite>— John Caples, Advertising Legend</cite>
            </footer>
          </blockquote>

          <p>Ready to see your engagement numbers transform? Your next great headline is waiting to be written. Let's create it together.</p>
        </article>
      `,
      excerpt: 'Discover the secrets of headlines that don\'t just attract clicks—they compel action. Transform your titles from skippable to unforgettable.',
      categories: ['Writing'],
      tags: ['headlines', 'copywriting', 'engagement'],
      media: stock.getRandomByTags(['object']),
      dateAt: new Date(baseDate.getTime() - 0 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'Visual Hierarchy in Blog Design',
      subTitle: 'Master the invisible force that guides your readers\' journey',
      slug: 'visual-hierarchy-guide',
      authors: [{
        fullName: 'Alex Rivera',
        title: 'UX Design Director',
        email: 'alex@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <p><em>Imagine</em> your readers flowing effortlessly through your content, intuitively knowing where to look next. That's not magic—it's visual hierarchy at work. Let's explore how to create this seamless experience for your readers.</p>

          <h2>The Secret Language of Visual Design</h2>

          <p>Have you ever wondered why some blog posts feel professional while others seem amateur? The difference often lies in the subtle art of visual hierarchy. Let's decode this visual language together.</p>

          <div>
            <section>
              <h3>Size & Scale</h3>
              <p>Watch how your eye naturally moves to larger elements first. Notice how this natural behavior creates a visual journey through your content. What if you could harness this power to guide your readers exactly where you want them to go?</p>
            </section>

            <section>
              <h3>Color & Contrast</h3>
              <p>Feel the pull of contrasting elements, the way they catch your attention and direct your focus. Imagine using this powerful tool to highlight your most important messages.</p>
            </section>
          </div>

          <aside>
            <h3 style="margin-top: 0;">Designer's Secret Weapon</h3>
            <p>Picture your perfect reader skimming your content. Where do their eyes go first? Second? By understanding this journey, you can craft a visual experience that feels both natural and engaging.</p>
          </aside>

          <h2>Transform Your Blog's Visual Appeal</h2>

          <ol >
            <li>
              <h4>Establish Clear Hierarchy</h4>
              <p>See how different heading sizes create natural breakpoints in your content?</p>
            </li>
            <li>
              <h4>Use White Space Strategically</h4>
              <p>Notice how breathing room around elements makes them feel more important?</p>
            </li>
            <li>
              <h4>Create Visual Patterns</h4>
              <p>What if your design elements worked together to create a cohesive reading experience?</p>
            </li>
          </ol>

          <div >
            <h3 >Pro Tip That Changes Everything</h3>
            <p>Always test your design with real content. Notice how beautiful typography with poor content hierarchy still fails to engage readers? That's why we always start with content strategy.</p>
          </div>

          <p>Ready to transform your blog's visual impact? Let's take your first step toward a more engaging design today.</p>
        </article>
      `,
      excerpt: 'Master the invisible forces that guide your readers through your content. Transform your blog from chaotic to captivating through strategic visual design.',
      categories: ['Design'],
      tags: ['visual design', 'typography', 'layout'],
      media: stock.getRandomByTags(['object']),
      dateAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'Write Like a Master Storyteller',
      subTitle: 'Weave psychological triggers into your narratives',
      slug: 'storytelling-psychology',
      authors: [{
        fullName: 'Maya Patel',
        title: 'Narrative Psychologist',
        email: 'maya@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <p><em>What if</em> every piece you wrote could hold readers spellbound until the very last word? The ancient art of storytelling isn't just for novelists—it's a powerful tool for anyone sharing ideas.</p>

          <h2>The Hidden Structure of Captivating Writing</h2>
          <p>Notice how certain passages seem to pull you through them effortlessly? This isn't accident—it's psychology at work.</p>

          <h3>The Three Pillars of Magnetic Writing</h3>
          <ol>
            <li>
              <h4>Tension and Release</h4>
              <p>Feel how your mind leans forward when a question is posed? Watch how master writers create tiny mysteries throughout their work, leading you paragraph by paragraph.</p>
            </li>
            <li>
              <h4>Sensory Bridges</h4>
              <p>Remember the last time a piece of writing made you feel like you were actually there? That's the power of engaging multiple senses in your descriptions.</p>
            </li>
            <li>
              <h4>Emotional Resonance</h4>
              <p>Have you noticed how the most memorable writing makes you feel something? Let's explore how to weave emotion into every paragraph.</p>
            </li>
          </ol>

          <h3>Transform Your Next Piece</h3>
          <p>Imagine starting your next article not with facts, but with a scene that pulls readers into your world:</p>

          <blockquote>
            <p>"The cursor blinked accusingly on the empty screen. You know that feeling—when you have something important to say, but the words seem just out of reach..."</p>
          </blockquote>

          <h3>The Psychology Behind the Magic</h3>
          <ul>
            <li>Pattern interrupts that wake up the reader's mind</li>
            <li>Strategic curiosity gaps that pull readers forward</li>
            <li>Memory hooks that make your ideas stick</li>
            <li>Narrative arcs that satisfy the brain's need for completion</li>
          </ul>

          <p>What powerful story are you ready to tell? Let's make your next piece of writing unforgettable.</p>
        </article>
      `,
      excerpt: 'Master the psychological principles that make readers hang on your every word. Transform your writing from merely informative to utterly captivating.',
      categories: ['Writing'],
      tags: ['psychology', 'storytelling', 'writing'],
      media: stock.getRandomByTags(['object']),
      dateAt: new Date(baseDate.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'The Science of Memorable Ideas',
      subTitle: 'Why some concepts spread while others fade',
      slug: 'idea-memorability',
      authors: [{
        fullName: 'David Zhang',
        title: 'Cognitive Science Researcher',
        email: 'david@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <p><em>Consider</em> the last idea that stayed with you for days. What made it stick? The science of memorable ideas isn't about being clever—it's about understanding how the human mind processes and retains information.</p>

          <h2>The Architecture of Memorable Ideas</h2>
          <p>Watch how your mind naturally gravitates toward certain concepts while others slip away. Let's decode this fascinating process.</p>

          <h3>Core Elements of Sticky Ideas</h3>
          <ul>
            <li>
              <h4>The Concrete Principle</h4>
              <p>Notice how abstract concepts become clearer when anchored to tangible examples? That's your brain's preference for the concrete over the abstract.</p>
            </li>
            <li>
              <h4>The Pattern Effect</h4>
              <p>What happens when you recognize a familiar pattern in a new context? Your brain suddenly lights up with understanding.</p>
            </li>
            <li>
              <h4>The Emotion Gateway</h4>
              <p>Remember how ideas connected to strong emotions seem to write themselves directly into your memory?</p>
            </li>
          </ul>

          <h3>Making Your Ideas Unforgettable</h3>
          <ol>
            <li>
              <h4>The Velcro Method</h4>
              <p>Imagine your idea as a hook looking for loops in your reader's mind. What existing knowledge can you connect to?</p>
            </li>
            <li>
              <h4>The Curiosity Bridge</h4>
              <p>Feel that slight tension when a story is left unfinished? That's your brain's natural desire for completion—use it.</p>
            </li>
            <li>
              <h4>The Echo Chamber</h4>
              <p>What if your idea could replay itself in your reader's mind, getting stronger with each iteration?</p>
            </li>
          </ol>

          <blockquote>
            <p>"The most memorable ideas aren't just understood—they're felt, seen, and experienced."</p>
            <footer>
              <cite>— Dr. Eleanor Hughes, Memory Researcher</cite>
            </footer>
          </blockquote>

          <h3>Transform Your Next Idea</h3>
          <p>Before you share your next big concept, ask yourself:</p>
          <ul>
            <li>Could a child understand this?</li>
            <li>Does it connect to something people already know?</li>
            <li>Will it make them feel something?</li>
            <li>Can they see it in action?</li>
          </ul>

          <p>Ready to make your ideas impossible to forget? Let's build something memorable together.</p>
        </article>
      `,
      excerpt: 'Discover why some ideas stick while others slip away. Learn the cognitive science behind creating concepts that lodge themselves in memory.',
      categories: ['Psychology'],
      tags: ['cognition', 'memory', 'communication'],
      media: stock.getRandomByTags(['object']),
      dateAt: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'Email Marketing Psychology',
      subTitle: 'The neuroscience of inbox engagement',
      slug: 'email-psychology',
      authors: [{
        fullName: 'Emma Rodriguez',
        title: 'Email Marketing Strategist',
        email: 'emma@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `[Previous post content structure but focused on email marketing psychology]`,
      excerpt: 'Unlock the psychological triggers that make emails irresistible to open and act upon. Transform your campaigns from inbox noise to anticipated value.',
      categories: ['Marketing'],
      tags: ['email', 'psychology', 'conversion'],
      media: stock.getRandomByTags(['object']),
      dateAt: new Date(baseDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'Color Theory for Conversions',
      subTitle: 'Using color psychology to drive action',
      slug: 'color-psychology',
      authors: [{
        fullName: 'James Wilson',
        title: 'Conversion Design Expert',
        email: 'james@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `[Previous post content structure but focused on color psychology]`,
      excerpt: 'Master the subtle art of color psychology to create designs that don\'t just look good—they convert. Learn the science behind color-driven decision making.',
      categories: ['Design'],
      tags: ['color', 'psychology', 'conversion'],
      media: stock.getRandomByTags(['object']),
      dateAt: new Date(baseDate.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'The Art of Social Proof',
      subTitle: 'Build trust through strategic social evidence',
      slug: 'social-proof',
      authors: [{
        fullName: 'Sophia Kim',
        title: 'Trust Marketing Specialist',
        email: 'sophia@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `[Previous post content structure but focused on social proof]`,
      excerpt: 'Discover how to leverage social proof to build instant credibility. Transform skeptical visitors into confident customers through strategic trust signals.',
      categories: ['Marketing'],
      tags: ['trust', 'conversion', 'psychology'],
      media: stock.getRandomByTags(['object']),
      dateAt: new Date(baseDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return limit ? posts.slice(0, limit) : posts
}
