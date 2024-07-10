import { type ActionItem, vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { staticFileUrls } from '@fiction/site/utils/site'

const templateId = 'story'

const schema = z.object({
  content: z.string().optional(),
  mediaItems: z.array(z.object({
    name: z.string().optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', options: [] }),
]

async function defaultConfig(args: { site: Site }): Promise<UserConfig> {
  const { site } = args

  const filenames = ['bond1.png', 'bond2.jpg'] as const

  const urls = staticFileUrls({ site, filenames })

  return {
    content: `<h2>Get the Real Deal in Espionage</h2>
<p>Looking for top-tier espionage services? Look no further. Here's the deal: I'm James Bond. Yes, <em>the</em> James Bond. I've spent decades saving the world, but now I'm available for your smaller, yet equally thrilling, spy needs. Whether it's gathering dirt on your business rival or finding out if your spouse is cheating, I bring the same level of skill, secrecy, and style that you've seen on the big screen.</p>

<h2>No Job Too Small, No Fee Too Large</h2>
<p>Ever wanted to hire someone who can infiltrate a high-security facility without breaking a sweat? Maybe you just need someone to discreetly monitor a situation without drawing any attention. From thwarting global threats to simply bugging your boss's office, I handle it all. Just keep in mind, my services don't come cheap. After all, you're not hiring a run-of-the-mill private investigator. You're hiring James Bond.</p>

<h2>Ready to Make Your Move?</h2>
<p>So, if you're ready to take your espionage game to the next level, reach out. Whether it's tracking down a secret, delivering a confidential message, or just making sure your competition stays one step behind, I'm your man. Because in the world of espionage, you don't just need a spy. You need James Bond.</p>`,
  }
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['content'],
    description: 'Text that reveals itself as you scroll, with scrolling media items',
    icon: 'i-tabler-compass',
    colorTheme: 'green',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    options,
    getUserConfig: async args => defaultConfig(args),
    demoPage: async (args) => {
      const userConfig = await defaultConfig(args)
      return {
        cards: [
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
