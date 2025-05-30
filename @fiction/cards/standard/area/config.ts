import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import { deepMerge } from '@fiction/core'
import { z } from 'zod/v4'

export const schema = z.object({
  test: z.string().optional(),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

// Demo helper to create content cards
function getDemoContent(type: string) {
  return [
    {
      templateId: 'cardHeroV1',
      userConfig: {
        title: type,
        subTitle: 'Showcase different area styles and capabilities',
        alignment: 'center',
      },
    },
  ]
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()

  // Enhanced demo configurations
  const demoConfigs: Record<string, StandardUserConfig> = {
    // Clean modern look
    modern: {
      standard: {
        background: { backgroundColor: '#1a1a1a' },
        themeColor: 'gray',
        primaryColor: 'purple',
        fonts: {
          title: { family: 'Plus+Jakarta+Sans', weight: '600' },
          body: { family: 'Inter' },
        },
      },
    },

    // Gradient background
    gradient: {
      standard: {
        background: {
          gradient: {
            angle: 135,
            stops: [
              { color: '#1e3a8a', position: 0 },
              { color: '#3b82f6', position: 50 },
              { color: '#60a5fa', position: 100 },
            ],
          },
        },
        themeColor: 'blue',
        primaryColor: 'orange',
      },
    },

    // Elegant serif style
    elegant: {
      standard: {
        background: { backgroundColor: '#d02020' },
        themeColor: 'amber',
        primaryColor: 'rose',
        fonts: {
          title: { family: 'Playfair+Display', weight: '400' },
          body: { family: 'Lora' },
        },
      },
    },

    // Video background
    videoHero: {
      standard: {
        background: {
          ...stock.getRandomByTags(['video']),
          effects: { overlay: { color: 'rgba(0,0,0,0.6)' } },
        },
        themeColor: 'overlay',
        primaryColor: 'cyan',
        fonts: {
          title: { family: 'Space+Grotesk', weight: '500' },
        },
      },
    },

    // Image with overlay
    imageOverlay: {
      standard: {
        background: {
          ...stock.getRandomByTags(['aspect:landscape']),
          effects: {
            overlay: {
              color: 'rgba(15,23,42,0.8)',
              blendMode: 'multiply',
            },
          },
        },
        themeColor: 'overlay',
        primaryColor: 'emerald',
      },
    },

    // Monochrome style
    monochrome: {
      standard: {
        background: { backgroundColor: '#0a0a0a' },
        themeColor: 'gray',
        fonts: {
          title: { family: 'DM+Sans', weight: '500' },
          body: { family: 'DM+Sans' },
        },
      },
    },

    // Vibrant color
    vibrant: {
      standard: {
        background: {
          gradient: {
            angle: 45,
            stops: [
              { color: '#7c3aed', position: 0 },
              { color: '#db2777', position: 100 },
            ],
          },
        },
        themeColor: 'slate',
        primaryColor: 'pink',
        fonts: {
          title: { family: 'DM+Sans', weight: '500' },
        },
      },
    },

    // Minimal light
    minimal: {
      standard: {
        background: { backgroundColor: '#ffffff' },
        themeColor: 'gray',
        primaryColor: 'slate',
        fonts: {
          title: { family: 'Satoshi', weight: '500' },
          body: { family: 'Satoshi' },
        },
      },
    },
  } as const

  return {
    schema,
    options: [],
    userConfig: {},
    demoPage: {
      cards: [
        // Modern bases
        { templateId, userConfig: demoConfigs.modern, cards: getDemoContent('Modern Style') },
        { templateId, userConfig: demoConfigs.minimal, cards: getDemoContent('Minimal Light') },
        { templateId, userConfig: demoConfigs.monochrome, cards: getDemoContent('Monochrome') },

        // Rich backgrounds
        { templateId, userConfig: demoConfigs.gradient, cards: getDemoContent('Gradient Background') },
        { templateId, userConfig: deepMerge([demoConfigs.modern, demoConfigs.videoHero]), cards: getDemoContent('Video Background') },
        { templateId, userConfig: demoConfigs.imageOverlay, cards: getDemoContent('Image Overlay') },

        // Typography focused
        { templateId, userConfig: demoConfigs.elegant, cards: getDemoContent('Elegant Serif') },
        { templateId, userConfig: demoConfigs.vibrant, cards: getDemoContent('Vibrant Style') },
      ],
    },
  }
}
