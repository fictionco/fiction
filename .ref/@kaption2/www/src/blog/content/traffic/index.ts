import { BlogPost } from '@factor/plugin-blog-engine'

export const posts = [
  new BlogPost({
    key: 'seoProcess',
    publishDate: '2021-7-24',
    status: 'published',
    type: ['guide'],
    fileImport: () => import('./seoProcess/post.md'),
    imageImport: () => import('./seoProcess/chart.jpg'),
  }),
]
