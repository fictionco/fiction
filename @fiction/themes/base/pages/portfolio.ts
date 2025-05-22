import type { CardConfigPortable } from '@fiction/site/tables.js'
import { cardConfig } from '@fiction/cards/index.js'
import { createStockMediaHandler } from '@fiction/ui/stock/index.js'

export async function getCards(): Promise<CardConfigPortable[]> {
  const stock = await createStockMediaHandler()

  return [
    cardConfig({
      templateId: 'cardHeroV1',
      userConfig: {
        items: [
          {
            title: 'Portfolio',
            subTitle: 'A curated collection of projects demonstrating your expertise and approach across different contexts',
            superTitle: {
              text: 'Selected Works',
              icon: { iconId: 'briefcase' },
              theme: 'primary',
            },
            media: stock.getRandomByTags(['aspect:wide']),
            action: {
              buttons: [
                { label: 'View Projects', href: '#featured', theme: 'primary' },
                { label: 'Client Work', href: '#consulting' },
              ],
            },
          },
        ],
      },
    }),
    cardConfig({
      templateId: 'cardBentoV1',
      userConfig: {
        items: [
          {
            superTitle: { text: 'Featured Project', theme: 'blue' },
            title: 'Primary Project Name',
            content: 'Notice how this featured project gets more space. Use this for your most impressive or recent work.',
            bg: stock.getRandomByTags(['object']),
            cols: 6,
            rows: 2,
            theme: 'blue',
            verticalPosition: 'top',
            action: {
              buttons: [{ label: 'View Project', href: '/work/project-one' }],
            },
          },
          {
            title: 'Secondary Project',
            content: 'Smaller tiles work well for supporting projects. Keep descriptions brief but impactful.',
            bg: stock.getRandomByTags(['object']),
            cols: 3,
            rows: 2,
            theme: 'emerald',
          },
          {
            title: 'Tertiary Project',
            content: 'The bento grid layout allows for visual hierarchy while maintaining a cohesive look.',
            bg: stock.getRandomByTags(['object']),
            cols: 3,
            rows: 2,
            theme: 'violet',
          },
          {
            superTitle: { text: 'Client Work', theme: 'indigo' },
            title: 'Client Project Title',
            content: 'For client work, focus on the challenge and your solution rather than technical details.',
            media: stock.getRandomByTags(['object']),
            cols: 4,
            rows: 3,
            theme: 'indigo',
          },
          {
            title: 'Product Launch',
            content: 'Color coding your projects by type creates an intuitive navigation experience.',
            bg: stock.getRandomByTags(['object']),
            cols: 4,
            rows: 3,
            theme: 'cyan',
          },
          {
            title: 'Featured Presentation',
            content: 'The mix of images and video creates visual interest throughout your portfolio.',
            media: stock.getRandomByTags(['object']),
            verticalPosition: 'top',
            cols: 4,
            rows: 3,
            theme: 'rose',
          },
        ],
      },
    }),
    cardConfig({
      templateId: 'cardPhotoGalleryV1',
      userConfig: {
        standard: {
          headers: {
            title: 'Project Gallery',
            subTitle: 'Visual showcase of work across different contexts',
          },
        },
        items: [
          {
            title: 'Category One',
            content: 'Each gallery item can represent a category of work rather than individual projects.',
            media: stock.getRandomByTags(['object']),
            cols: '2',
            theme: 'blue',
          },
          {
            title: 'Category Two',
            content: 'Consistent styling creates cohesion while different images maintain visual interest.',
            media: stock.getRandomByTags(['object']),
            cols: '2',
            theme: 'emerald',
          },
          {
            title: 'Category Three',
            content: 'The lightbox functionality allows visitors to view full-size images without leaving the page.',
            media: stock.getRandomByTags(['object']),
            cols: '2',
            theme: 'violet',
          },
          {
            title: 'Category Four',
            content: 'Themes can match your brand colors while maintaining a coordinated palette.',
            media: stock.getRandomByTags(['object']),
            cols: '2',
            theme: 'indigo',
          },
          {
            title: 'Category Five',
            content: 'Brief descriptions help visitors understand the context of each visual.',
            media: stock.getRandomByTags(['object']),
            cols: '2',
            theme: 'cyan',
          },
          {
            title: 'Category Six',
            content: 'Six categories create a balanced layout that works well on most screen sizes.',
            media: stock.getRandomByTags(['object']),
            cols: '2',
            theme: 'rose',
          },
        ],
        layout: {
          gapSize: 'md',
          aspectRatio: 'video',
          animation: 'fade',
          showAllText: false,
        },
        lightbox: {
          enabled: true,
          showCaption: true,
        },
      },
    }),
  ]
}
