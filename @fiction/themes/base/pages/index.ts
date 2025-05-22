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
    {
      pageTemplateId: 'portfolio',
      title: 'Portfolio Page',
      description: 'Showcase your portfolio with a hero, features, and call to action',
      getCards: () => import('./portfolio').then(m => m.getCards()),
    },
    {
      pageTemplateId: 'journey',
      title: 'Journey Page',
      description: 'Great for showcasing milestones, projects, and a timeline of your work',
      getCards: () => import('./journey').then(m => m.getCards()),
    },
  ]
}
