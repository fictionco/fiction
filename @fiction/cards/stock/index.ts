type MediaFormat = 'image' | 'video'
type AspectRatio = 'landscape' | 'portrait' | 'square' | 'wide' | 'tall'
type ColorTone = 'multi' | 'cold' | 'warm' | 'neutral' | 'vibrant' | 'blackWhite'
type Category = 'silhouette' | 'person' | 'landscape' | 'abstract' | 'object'
type Tags = 'man' | 'woman' | 'trees' | 'mountain' | 'lake' | 'city' | 'building' | 'sky' | 'minimal' | 'colorful' | 'midShot' | 'wideShot' | 'closeUp' | 'farAway' | 'yellow' | 'blue' | 'orange' | 'green'

const media: MediaCollection = [
  {
    format: 'image',
    aspect: 'landscape',
    url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/4880097a-27b0-444f-ba79-e2a017bc0400/public',
    tags: ['man', 'minimal', 'midShot'],
    category: 'silhouette',
    colorTone: 'blackWhite',
  },
]

type MediaItem = {
  format: MediaFormat
  aspect: AspectRatio
  url: string
  tags: Tags[]
  category: Category
  colorTone: ColorTone
}

type MediaCollection = MediaItem[]

type GetMediaArgs = {
  format?: MediaFormat
  aspect?: AspectRatio
  tags?: Tags[]
  category?: Category
  colorTone?: ColorTone
}

export class StockMedia {
  private media: MediaCollection

  constructor(media: MediaCollection) {
    this.media = media
  }

  private filterMedia(args: GetMediaArgs): MediaItem[] {
    return this.media.filter((item) => {
      if (args.format && item.format !== args.format)
        return false
      if (args.aspect && item.aspect !== args.aspect)
        return false
      if (args.tags && !args.tags.every(tag => item.tags.includes(tag)))
        return false
      if (args.category && item.category !== args.category)
        return false
      if (args.colorTone && item.colorTone !== args.colorTone)
        return false
      return true
    })
  }

  getRandomMedia(args: GetMediaArgs = {}): MediaItem | null {
    const filteredMedia = this.filterMedia(args)
    return filteredMedia.length ? filteredMedia[Math.floor(Math.random() * filteredMedia.length)] : null
  }

  getAllMedia(args: GetMediaArgs = {}): MediaItem[] {
    return this.filterMedia(args)
  }

  getRandomByCategory(category: Category, args: Omit<GetMediaArgs, 'category'> = {}): MediaItem | null {
    return this.getRandomMedia({ ...args, category })
  }

  getRandomByTags(tags: Tags[], args: Omit<GetMediaArgs, 'tags'> = {}): MediaItem | null {
    return this.getRandomMedia({ ...args, tags })
  }

  getRandomProfilePicture(args: Omit<GetMediaArgs, 'format' | 'category'> = {}): MediaItem | null {
    return this.getRandomMedia({ ...args, format: 'image', category: 'person' })
  }

  getRandomLandscape(args: Omit<GetMediaArgs, 'format' | 'category'> = {}): MediaItem | null {
    return this.getRandomMedia({ ...args, format: 'image', category: 'landscape' })
  }
}
