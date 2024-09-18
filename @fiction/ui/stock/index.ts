import type { tagSet } from './tags'
import { log } from '@fiction/core'
import media from './mediaItems.json'

const logger = log.contextLogger('stockMedia')

type TagCategory = keyof typeof tagSet
export type Tag = typeof tagSet[TagCategory][number]

type MediaFormat = 'image' | 'video'

type MediaItem = {
  format: MediaFormat
  url: string
  tags: Tag[]
  slug: string
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

    if (filteredMedia.length === 0) {
      logger.error('No media items available', { data: { args, filteredMedia } })
      return this.media[0] // Fallback to the first item in the entire media collection if no filtered media is available
    }

    const rand = Math.random()
    const randomIndex = Math.floor(rand * filteredMedia.length)
    const selectedItem = filteredMedia[randomIndex]

    if (!selectedItem) {
      logger.error('No media items available', { data: { args, filteredMedia } })
      throw new Error(`No media items available: tags: "${args.tags?.join(', ')}", randomIndex: ${randomIndex}, filteredMedia: ${filteredMedia.length}`)
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

  getRandomByAspectRatio(aspectRatio?: Extract<Tag, `aspect${string}`> | 'portrait' | 'landscape' | 'squarish', args: GetMediaArgs = {}): MediaItem {
    let aspectTag: Tag
    if (aspectRatio === 'portrait') {
      aspectTag = 'aspect:portrait'
    }
    else if (aspectRatio === 'landscape') {
      aspectTag = 'aspect:landscape'
    }
    else if (aspectRatio === 'squarish') {
      aspectTag = 'aspect:square'
    }
    else {
      aspectTag = aspectRatio || 'aspect:square'
    }

    return this.getRandomMedia({ ...args, tags: [aspectTag, ...(args.tags || [])] })
  }

  getAssetBySlug(partialSlug: string): MediaItem | undefined {
    const normalizedPartialSlug = partialSlug.toLowerCase()

    return this.media.find(item =>
      item.slug.toLowerCase().includes(normalizedPartialSlug),
    )
  }

  // New method to get all assets matching a partial slug
  getAllAssetsBySlug(partialSlug: string): MediaItem[] {
    const normalizedPartialSlug = partialSlug.toLowerCase()

    return this.media.filter(item =>
      item.slug.toLowerCase().includes(normalizedPartialSlug),
    )
  }

  resetUsedMedia(): void {
    this.usedMedia.clear()
  }
}

export const stockMediaHandler = new StockMedia(media as MediaItem[])
