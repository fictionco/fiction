import { vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import type { SiteUserConfig } from '@fiction/site/schema'
import { standardOption } from '../inputSets'

const templateId = 'gallery'

const MediaItemSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  href: z.string().optional(),
  media: z.object({
    format: z.enum(['url', 'video']).optional(),
    url: z.string().optional(),
  }).optional(),
  columns: z.enum(['1', '2', '3', '4']).optional(),
  rows: z.enum(['1', '2', '3', '4']).optional(),
})

export type MediaItem = z.infer<typeof MediaItemSchema>

const UserConfigSchema = z.object({
  items: z.array(MediaItemSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

async function getUserConfig(_args: { site: Site }): Promise<UserConfig & SiteUserConfig> {
  return {
    items: [
      {
        title: 'Luxurious Nights in Dubai',
        content: 'So, I stayed at the Burj Al Arab. It\'s as over-the-top as you\'d imagine. Gold everywhere, an underwater restaurant, and staff that probably outnumber the guests. I half expected to bump into a sheikh in the elevator. We also got lost in the desert, but that\'s a story for another time. Would I recommend Dubai? Absolutely.',
        media: { format: 'url', url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/f60914f7-b308-493d-0f99-5f32ec2c8a00/public' },
        columns: '1',
        rows: '2',
      },
      {
        title: 'Parisian Chic Weekend',
        content: 'Went to Paris, did the whole Eiffel Tower thing. Pro tip: champagne tastes better at 984 feet. Tried to shop like a local on the Champs-Élysées, ended up eating my weight in cheese instead. No regrets.',
        media: { format: 'url', url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/262acd7b-9d46-454d-e972-2f5693eddf00/public' },
        columns: '2',
        rows: '2',
      },
      {
        title: 'Bali Bliss Retreat',
        content: 'Found myself in Ubud. Tried yoga at sunrise, realized I\'m about as flexible as a wooden board. Redeemed myself at the infinity pool bar. Turns out I\'m great at sunset cocktails.',
        media: { format: 'url', url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/8be8d86e-7161-44d2-4568-db389b9fde00/public' },
        columns: '1',
        rows: '2',
      },
      {
        title: 'Santorini Sunsets',
        content: 'Rented a villa in Oia. Spent most of the time trying to figure out which white building was mine. The sunsets are nice, if you can see past the sea of selfie sticks. Pack sunscreen. Trust me on this one.',
        media: { format: 'url', url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/23420b27-f279-4ee7-38b6-794c01e0d900/public' },
        columns: '3',
        rows: '2',
      },
      {
        title: 'Tokyo Edge',
        content: 'Tokyo is wild. Had dinner served by robots, then stumbled into a traditional tea ceremony. Tried to shop in Ginza, but everything was either too small or too weird. Ended up buying a talking toilet seat.',
        media: { format: 'url', url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/aad4d19b-27cb-4fd2-ec48-1d6215e18600/public' },
        columns: '2',
        rows: '2',
      },
      {
        title: 'Maldives Overwater Paradise',
        content: 'Stayed in one of those fancy overwater bungalows. Woke up to fish swimming under my feet. Spent the day alternating between underwater dining and floating in the infinity pool. Turns out you can have too much of a good thing. My swimsuit disagrees.',
        media: { format: 'url', url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/f6357f0b-e979-48fe-826d-867cd4cf2700/public' },
        columns: '2',
      },
      {
        title: 'New York City Glamour',
        content: 'Tried living out my Gossip Girl fantasies in NYC. Had brunch at The Plaza, felt very fancy until I saw the bill. Went shopping in SoHo, realized I couldn\'t afford the air in most stores. Ended the night at a rooftop party, pretending I belonged there. Fake it \'til you make it, right?',
        media: { format: 'url', url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/30c9aac6-e8c3-4d9c-50a7-556044545e00/public' },
        columns: '2',
      },
      {
        title: 'Swiss Alps Ski Chic',
        content: 'Went to St. Moritz. Turns out I\'m better at après-ski than actual skiing. Spent most of my time in a fur coat (fake, don\'t worry) sipping hot cocoa and pretending I knew what \'black diamond\' meant. Met some interesting characters at the lodge. Pretty sure I saw a prince.',
        media: { format: 'url', url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/b3770f49-ce4d-4236-a733-2f0d867adc00/public' },
        columns: '1',
        rows: '2',
      },
      {
        title: 'Moroccan Desert Luxury',
        content: 'Tried \'glamping\' in the Sahara. It\'s regular camping, but with better rugs. Rode a camel at sunset, felt very Lawrence of Arabia until I realized camels aren\'t the smoothest ride. The stars were amazing, though. Never seen so many, or felt so small.',
        media: { format: 'url', url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/4155da31-5962-48d3-438b-d71749058300/public' },
        columns: '1',
        rows: '2',
      },
      {
        title: 'Amalfi Coast Yacht Week',
        content: 'Sailed the Amalfi Coast on a \'private\' yacht. By private, I mean shared with 20 strangers who became my best friends after a few limoncellos. Tried to look glam in Positano, but mostly just looked sweaty. Note to self: cobblestone streets and heels don\'t mix.',
        media: { format: 'url', url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/ef71a188-0ab7-4aec-ac26-55a90adce600/public' },
        columns: '2',
      },
      {
        title: 'Burning Man: Desert Dust and Dubious Decisions',
        content: 'Ventured to Black Rock City for Burning Man. Packed my most outrageous outfits, ended up wearing mostly dust. Saw art installations that made me question reality (or was that the dehydration?). Joined a 3 AM dance party led by a DJ in a giant rubber duck costume. Still finding playa dust in unexpected places weeks later.',
        media: { format: 'url', url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/a7fd5370-2a94-4460-91b5-c6a0f6298900/public' },
        columns: '2',
        rows: '2',
      },
      {
        title: 'Rio Carnival: Feathers, Fever, and Forgetting',
        content: 'Dived into Rio\'s Carnival madness. Attempted to samba, looked more like a startled chicken. Joined a street party that lasted longer than some of my relationships. Lost my voice, my dignity, and almost my wallet. Found them all again (except the dignity) at a late-night churrascaria. Brazilian coffee is a lifesaver.',
        media: { format: 'url', url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/295e1e27-b08c-4fa2-a83e-1e4dd1efa300/public' },
        columns: '1',
        rows: '3',
      },
    ],

  }
}

const options = [
  standardOption.ai(),
  new InputOption({
    input: 'InputList',
    key: `items`,
    options: [
      new InputOption({ key: 'content', label: 'Quote Text', input: 'InputText' }),
    ],
  }),
]

export const templates = [
  new CardTemplate({
    templateId,
    title: 'Gallery',
    category: ['media'],
    description: 'A gallery of images or videos with captions.',
    icon: 'i-tabler-message-bolt',
    colorTheme: 'emerald',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    isPublic: false,
    options,
    schema: UserConfigSchema,
    getBaseConfig: () => ({ standard: { } }),
    getUserConfig: _ => getUserConfig(_),
    demoPage: async (_) => {
      const userConfig = await getUserConfig(_)
      return {
        cards: [
          { templateId, userConfig: { ...userConfig, standard: { headers: { title: 'Masonry Layout' } } } },
        ],
      }
    },
  }),
] as const
