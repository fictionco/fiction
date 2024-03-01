import { BlogPost } from '@factor/plugin-blog-engine'

export const posts = [
  new BlogPost({
    key: 'startupFoundersGuideToAnalytics',
    publishDate: '2021-7-25',
    status: 'published',
    type: ['article'],
    fileImport: () => import('./startupFoundersGuide/post.md'),
    imageImport: () => import('./startupFoundersGuide/stages-analytics.jpg'),
  }),
]
