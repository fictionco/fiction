import { log } from '@fiction/core'
import media from './mediaItems.json'
import type { tagSet } from './tags'

const logger = log.contextLogger('stockMedia')

type TagCategory = keyof typeof tagSet
type Tag = typeof tagSet[TagCategory][number]

type MediaFormat = 'image' | 'video'

type MediaItem = {
  format: MediaFormat
  url: string
  tags: Tag[]
}

type MediaCollection = MediaItem[]

type GetMediaArgs = {
  format?: MediaFormat
  tags?: Tag[]
}

export class StockMedia {
  private media: MediaCollection
  private usedMedia: Set<string> = new Set()

  constructor(media: MediaCollection) {
    this.media = media
  }

  private filterMedia(args: GetMediaArgs): MediaItem[] {
    return this.media.filter((item) => {
      if (this.usedMedia.has(item.url))
        return false
      if (args.format && item.format !== args.format)
        return false
      if (args.tags && !args.tags.every(tag => item.tags.includes(tag)))
        return false
      return true
    })
  }

  private markAsUsed(item: MediaItem): void {
    if (!item.url) {
      logger.error('No url on media item', { data: { item } })
      throw new Error('No url on media item')
    }

    this.usedMedia.add(item.url)
  }

  getRandomMedia(args: GetMediaArgs = {}): MediaItem {
    let filteredMedia = this.filterMedia(args)

    if (filteredMedia.length === 0 && this.usedMedia.size > 0) {
      this.resetUsedMedia()
      filteredMedia = this.filterMedia(args)
    }

    else if (filteredMedia.length === 0) {
      return this.media[0] // Fallback to the first item in the entire media collection if no filtered media is available
    }

    const rand = Math.random()
    const randomIndex = Math.floor(rand * filteredMedia.length)
    const selectedItem = filteredMedia[randomIndex]

    if (!selectedItem) {
      logger.error('No media items available', { data: { args, filteredMedia } })
      throw new Error('No media items available')
    }

    this.markAsUsed(selectedItem)
    return selectedItem
  }

  getAllMedia(args: GetMediaArgs = {}): MediaItem[] {
    return this.filterMedia(args)
  }

  getRandomByTags(tags: Tag[], args: Omit<GetMediaArgs, 'tags'> = {}): MediaItem {
    return this.getRandomMedia({ ...args, tags })
  }

  getRandomByAspectRatio(aspectRatio: Extract<Tag, `aspect${string}`>, args: Omit<GetMediaArgs, 'tags'> = {}): MediaItem {
    return this.getRandomMedia({ ...args, tags: [aspectRatio] })
  }

  resetUsedMedia(): void {
    this.usedMedia.clear()
  }
}

export const stockMediaHandler = new StockMedia(media as MediaItem[])
