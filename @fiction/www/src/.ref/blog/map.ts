import { BlogPost } from '@factor/plugin-blog-engine/types'

export const posts = [
  new BlogPost({
    key: 'fictionLaunchRelease',
    permalink:
      'fiction-com-announces-the-worlds-first-generative-media-platform-for-professionals',
    publishDate: '2023-3-14',
    status: 'published',
    type: ['release'],
    noList: true,
    fileImport: (): Promise<any> =>
      import('./content/fictionLaunchRelease/post.md'),
    imageImport: (): Promise<any> =>
      import('./content/fictionLaunchRelease/image.jpg'),
  }),
  new BlogPost({
    key: 'fictionLaunchPost',
    permalink: 'fiction-ai-generated-images-for-professionals',
    redirects: ['the-personal-ai-toolkit-for-professionals'],
    publishDate: '2023-3-15',
    status: 'published',
    type: ['update'],
    fileImport: (): Promise<any> =>
      import('./content/fictionLaunchPost/post.md'),
    imageImport: (): Promise<any> =>
      import('./content/fictionLaunchPost/image.jpg'),
  }),
]
