import type { TablePostConfig } from '@fiction/posts'
import type { Card } from '@fiction/site'
import { Post } from '@fiction/posts'
import { createStockMediaHandler } from '../stock'

export async function getDemoPosts(args: { limit?: number, card: Card }) {
  const { limit = 5, card } = args
  const baseDate = new Date('2024-03-20')
  const stock = await createStockMediaHandler()

  const posts: TablePostConfig[] = [
    {
      title: 'Typography Essentials',
      subTitle: 'Core principles for readable text',
      slug: 'typography-essentials',
      authors: [{
        fullName: 'Sarah Chen',
        title: 'Design Lead',
        email: 'sarah@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <p class="lead">Good typography is invisible—it serves the content without distraction.</p>

          <h2>Readability Basics</h2>
          <p>Optimal line length: <strong>45-75 characters</strong>. Line height: <code>1.4-1.6</code> for body text.</p>

          <blockquote>
            <p>Typography is a beautiful group of letters, not a group of beautiful letters.</p>
            <footer>— Matthew Carter</footer>
          </blockquote>

          <h3>Quick Reference</h3>
          <table>
            <thead>
              <tr><th>Element</th><th>Size</th><th>Use</th></tr>
            </thead>
            <tbody>
              <tr><td>Body</td><td>1rem</td><td>Main content</td></tr>
              <tr><td>H2</td><td>1.618rem</td><td>Sections</td></tr>
            </tbody>
          </table>
        </article>
      `,
      categories: ['Design'],
      tags: ['typography', 'readability'],
      media: stock.getRandomByTags(['background']),
      dateAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      comments: [
        {
          commentId: 'cmt_001',
          content: 'The **45-75 character** rule is gold. I see so many sites with lines that are way too long.',
          userId: 'usr_001',
          user: { fullName: 'Alex Rivera', email: 'alex@example.com' },
          createdAt: new Date(baseDate.getTime() - 12 * 60 * 60 * 1000).toISOString(),
          status: 'approved' as const,
        },
        {
          commentId: 'cmt_002',
          content: 'What about `font-feature-settings`? Any recommendations for enabling ligatures and kerning?',
          userId: 'usr_002',
          user: { fullName: 'Morgan Lee', email: 'morgan@example.com' },
          createdAt: new Date(baseDate.getTime() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'approved' as const,
        },
      ],
    },

    {
      title: 'Code Review Tips',
      subTitle: 'Building better teams through thoughtful feedback',
      slug: 'code-review-tips',
      authors: [{
        fullName: 'Marcus Chen',
        title: 'Senior Engineer',
        email: 'marcus@tech.co',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <p>Code reviews aren't about finding bugs—they're about growing together.</p>

          <h2>Before You Comment</h2>
          <ul>
            <li>Is this constructive?</li>
            <li>Does it help them learn?</li>
            <li>Am I being specific?</li>
          </ul>

          <h3>Example: Poor vs Good</h3>
          <p><strong>Poor:</strong> "This is bad"</p>
          <p><strong>Better:</strong> "Consider handling null values here for safer execution"</p>

          <pre><code>// ✅ Better approach
function safeName(user) {
  return [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(' ') || 'Anonymous'
}</code></pre>

          <aside>
            <h4>Pro Tip</h4>
            <p>Use automated tools for syntax checks. Save human time for architecture and logic.</p>
          </aside>
        </article>
      `,
      categories: ['Engineering'],
      tags: ['code-review', 'mentorship'],
      media: stock.getRandomByTags(['object']),
      dateAt: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      comments: [
        {
          commentId: 'cmt_003',
          content: 'This hits home. I\'ve been on both sides of "this is bad" comments. The specific feedback approach works so much better.',
          userId: 'usr_003',
          user: { fullName: 'Jessica Park', email: 'jessica@dev.com' },
          createdAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'approved' as const,
        },
        {
          commentId: 'cmt_004',
          content: `Great example with the \`safeName\` function. Here's another pattern I like:

\`\`\`javascript
const getName = (user) => user?.fullName ?? 'Guest User'
\`\`\`

Nullish coalescing is perfect for these cases.`,
          userId: 'usr_004',
          user: { fullName: 'David Kim', email: 'david@example.com' },
          createdAt: new Date(baseDate.getTime() - 18 * 60 * 60 * 1000).toISOString(),
          status: 'approved' as const,
        },
        {
          commentId: 'cmt_005',
          content: 'How do you handle disagreements in code reviews? Sometimes architectural decisions come down to preference.',
          userId: 'usr_005',
          user: { fullName: 'Emma Torres', email: 'emma@startup.io' },
          createdAt: new Date(baseDate.getTime() - 8 * 60 * 60 * 1000).toISOString(),
          status: 'approved' as const,
        },
      ],
    },

    {
      title: 'Styling Edge Cases',
      subTitle: 'Testing extreme content scenarios',
      slug: 'styling-edge-cases',
      authors: [{
        fullName: 'Test Engineer',
        title: 'QA Specialist',
        email: 'test@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <h1>Very Long Heading That Tests Line Wrapping and Layout Stability</h1>

          <h2>Nested Lists</h2>
          <ul>
            <li>Level 1
              <ul>
                <li>Level 2 with <strong>bold</strong>
                  <ul>
                    <li>Level 3 with <code>code</code></li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>

          <h2>Long Code Lines</h2>
          <pre><code>// This extremely long line tests horizontal scrolling behavior
const veryLongFunctionName = (param1, param2, param3, param4) => someVeryLongCalculation(param1, param2, param3, param4)</code></pre>

          <h2>Mixed Content</h2>
          <p>Unicode: 🚀 ∑ → Math: x² + y² = z² Code: <code>array.map()</code> <strong>Bold</strong> <em>italic</em></p>

          <table>
            <thead><tr><th>Wide Header Name</th><th>Data</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Very long cell content that tests table overflow</td><td>123</td><td>✅</td></tr>
            </tbody>
          </table>
        </article>
      `,
      categories: ['Testing'],
      tags: ['edge-cases', 'qa'],
      dateAt: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      comments: [
        {
          commentId: 'cmt_006',
          content: 'Testing comment with **markdown** and `code` to verify comment rendering works correctly.',
          userId: 'usr_006',
          user: { fullName: 'QA Bot', email: 'qa@test.com' },
          createdAt: new Date(baseDate.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'approved' as const,
        },
      ],
    },

    {
      title: 'Minimal Test',
      slug: 'minimal-test',
      authors: [],
      content: '<p>Single paragraph to test minimal content styling.</p>',
      categories: [],
      tags: ['minimal'],
      dateAt: new Date(baseDate.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      comments: [], // Test empty comments
    },

    {
      title: 'Performance Metrics',
      subTitle: 'Core Web Vitals explained',
      slug: 'performance-metrics',
      authors: [{
        fullName: 'Alex Rivera',
        title: 'Performance Engineer',
        email: 'alex@perf.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <p>Monitor what matters. LCP &lt; 2.5s, FID &lt; 100ms, CLS &lt; 0.1</p>

          <h2>Measuring LCP</h2>
          <pre><code>new PerformanceObserver(list => {
  const entries = list.getEntries()
  console.log('LCP:', entries[entries.length - 1].startTime)
}).observe({ entryTypes: ['largest-contentful-paint'] })</code></pre>

          <blockquote>
            <p>You can't improve what you don't measure.</p>
          </blockquote>

          <h3>Budget Example</h3>
          <p>Set concrete limits:</p>
          <ul>
            <li><strong>JS Bundle:</strong> &lt; 250kb</li>
            <li><strong>Images:</strong> &lt; 500kb total</li>
            <li><strong>TTI:</strong> &lt; 3s on 3G</li>
          </ul>
        </article>
      `,
      categories: ['Performance'],
      tags: ['web-vitals', 'monitoring'],
      media: stock.getRandomByTags(['background']),
      dateAt: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      comments: [
        {
          commentId: 'cmt_007',
          content: 'The performance budget approach is crucial. We set up CI/CD to fail builds that exceed these limits.',
          userId: 'usr_007',
          user: { fullName: 'Sam Wilson', email: 'sam@fastsite.com' },
          createdAt: new Date(baseDate.getTime() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'approved' as const,
        },
        {
          commentId: 'cmt_008',
          content: 'What tools do you recommend for measuring Core Web Vitals in production? Currently using Lighthouse but want real user data.',
          userId: 'usr_008',
          user: { fullName: 'Riley Chen', email: 'riley@metrics.io' },
          createdAt: new Date(baseDate.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'approved' as const,
        },
      ],
    },
  ]

  const rawPosts = limit ? posts.slice(0, limit) : posts
  return rawPosts.map(p => new Post({ ...p, card })).sort(() => Math.random() - 0.5)
}
