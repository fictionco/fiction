import type { TablePostConfig } from '@fiction/posts'
import { createStockMediaHandler } from '../stock'

export async function getDemoPosts(args: { limit?: number } = {}): Promise<TablePostConfig[]> {
  const { limit = 6 } = args
  const baseDate = new Date('2024-03-20')

  const stock = await createStockMediaHandler()

  const posts: TablePostConfig[] = [
    {
      title: 'The Hidden Story in Your Data: Unlocking Narrative Power Through Visualization Techniques',
      subTitle: 'How to turn numbers into compelling stories',
      slug: 'data-storytelling',
      authors: [{
        fullName: 'Marcus Lee',
        title: 'Data Journalist',
        email: 'marcus@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <p><strong>Data isn't just numbers</strong>—it's a story waiting to be told. Imagine your charts speaking to your audience's emotions.</p>
          <h2>Why Stories Matter</h2>
          <p>Statistics alone are forgettable. Connect them to human experiences to make them unforgettable.</p>
          <table>
            <thead>
              <tr><th>Technique</th><th>Impact</th></tr>
            </thead>
            <tbody>
              <tr><td>Human Context</td><td>Engages emotions</td></tr>
              <tr><td>Visual Simplicity</td><td>Improves recall</td></tr>
            </tbody>
          </table>
          <p>Ready to transform your data? Start with a single statistic and build its story.</p>
        </article>
      `,
      categories: ['Analytics'],
      tags: ['data', 'storytelling', 'visualization'],
      media: stock.getRandomByTags(['background']),
      dateAt: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'SEO Fix',
      subTitle: '',
      slug: 'seo-content-guide',
      authors: [{
        fullName: 'Priya Sharma',
        title: 'SEO Strategist',
        email: 'priya@example.com',
        avatar: undefined, // Test missing avatar
      }],
      content: `
        <article>
          <p>SEO isn't about tricks—it's about understanding your audience.</p>
          <h2>Human-Centered SEO</h2>
          <ul>
            <li><strong>Clear Headlines:</strong> Write for humans, not bots.</li>
            <li><strong>Engaging Content:</strong> Answer real questions.</li>
          </ul>
          <pre><code>meta[name="description"] { content: "Engage readers first"; }</code></pre>
          <p>Focus on value, and rankings will follow.</p>
        </article>
      `,
      categories: ['SEO'],
      tags: ['optimization', 'search'],
      media: stock.getRandomByTags(['object']),
      dateAt: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'Headlines That Grab Attention & Boost Engagement in 2025!',
      subTitle: 'Craft titles that demand clicks',
      slug: 'headline-writing-guide',
      authors: [
        {
          fullName: 'Sarah Chen',
          title: 'Content Strategy Lead',
          email: 'sarah@example.com',
          avatar: stock.getRandomByTags(['person']),
        },
        {
          fullName: 'John Doe',
          title: 'Copywriter',
          email: 'john@example.com',
          avatar: stock.getRandomByTags(['person']),
        }, // Test multiple authors
      ],
      content: `
        <article>
          <p>A great headline is your first impression. Make it count.</p>
          <h2>Headline Formula</h2>
          <ol>
            <li><strong>Useful:</strong> Promise clear value.</li>
            <li><strong>Urgent:</strong> Create a need to act now.</li>
          </ol>
          <blockquote><p>“A headline is a promise.” — David Ogilvy</p></blockquote>
          <p>Test your headlines with A/B splits to see what works.</p>
        </article>
      `,
      categories: ['Writing'],
      tags: ['headlines', 'copywriting'],
      dateAt: new Date(baseDate.getTime()).toISOString(),
    },
    {
      title: 'Visual Hierarchy',
      subTitle: 'Guide readers with design',
      slug: 'visual-hierarchy-guide',
      authors: [{
        fullName: 'Alex Rivera',
        title: 'UX Design Director',
        email: 'alex@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <p><em>Visual hierarchy</em> directs your reader's eyes.</p>
          <h2>Key Principles</h2>
          <ul>
            <li><strong>Size:</strong> Bigger elements draw focus.</li>
            <li><strong>Color:</strong> Contrasts highlight priorities.</li>
          </ul>
          <p>Use white space to give content room to breathe.</p>
        </article>
      `,
      categories: ['Design'],
      tags: ['visual design', 'layout'],
      dateAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'Storytelling Secrets: How to Engage Readers with Narrative Psychology & Emotional Triggers',
      subTitle: 'Weave stories that stick',
      slug: 'storytelling-psychology',
      authors: [{
        fullName: 'Maya Patel',
        title: 'Narrative Psychologist',
        email: 'maya@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <p>Stories captivate because they tap into psychology.</p>
          <h2>Three Elements</h2>
          <ul>
            <li><strong>Tension:</strong> Create curiosity.</li>
            <li><strong>Senses:</strong> Paint vivid scenes.</li>
            <li><strong>Emotion:</strong> Connect deeply.</li>
          </ul>
          <p><span style="color: #ff4500;">Start with a hook</span> to pull readers in.</p>
        </article>
      `,
      categories: ['Writing'],
      tags: ['psychology', 'storytelling'],
      media: stock.getRandomByTags(['object']),
      dateAt: new Date(baseDate.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'Minimal Post',
      slug: 'minimal-post',
      authors: [], // Test no authors
      content: `
        <p>Just a paragraph to test minimal content.</p>
      `,
      categories: [],
      tags: [],
      media: stock.getRandomByTags(['object']),
      dateAt: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'Complex Formatting: Nested Lists, Code, and More!',
      subTitle: 'Stress-test your editor',
      slug: 'complex-formatting',
      authors: [{
        fullName: 'Emma Rodriguez',
        title: 'Content Engineer',
        email: 'emma@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <p>Test complex formatting below:</p>
          <h2>Nested Lists</h2>
          <ul>
            <li>Level 1
              <ul>
                <li>Level 2
                  <ul>
                    <li>Level 3</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          <h2>Code Block</h2>
          <pre><code>function testEditor() {\n  return "TipTap rules!";\n}</code></pre>
          <h2>Inline Styles</h2>
          <p><strong>Bold</strong>, <em>italic</em>, <span style="color: blue;">colored text</span>.</p>
        </article>
      `,
      categories: ['Testing'],
      tags: ['formatting', 'editor'],
      media: stock.getRandomByTags(['object']),
      dateAt: new Date(baseDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'Special Ch@racters & Emojis 🚀',
      subTitle: 'Test rendering of unusual input',
      slug: 'special-characters',
      authors: [{
        fullName: 'James Wilson',
        title: 'Frontend Developer',
        email: 'james@example.com',
        avatar: stock.getRandomByTags(['person']),
      }],
      content: `
        <article>
          <p>Test special characters: @#$%^&*()_+=[]{}|;:,.<>?</p>
          <p>Emojis: 😊👍🚀</p>
          <p>Ensure these render correctly in your editor.</p>
        </article>
      `,
      categories: ['Testing'],
      tags: ['characters', 'emojis'],
      media: stock.getRandomByTags(['object']),
      dateAt: new Date(baseDate.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return limit ? posts.slice(0, limit) : posts
}
