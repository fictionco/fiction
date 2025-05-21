import type { PageTemplate } from '@fiction/site'

export function getPageTemplates(): PageTemplate[] {
  return [
    {
      pageTemplateId: 'landing',
      title: 'Landing Page',
      description: 'Showcase your brand with hero slider, features, and call to action',
      getCards: () => import('./landing').then(m => m.getCards()),
    },
    {
      pageTemplateId: 'profile',
      title: 'Profile Page',
      description: 'Showcase your profile with a hero, features, and call to action',
      getCards: () => import('./profile').then(m => m.getCards()),
    },
  ]
}
