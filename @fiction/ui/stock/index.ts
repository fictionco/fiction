import type { MediaObject } from '@fiction/core'
import type { LocalMediaKeys } from './localMedia'
import type { tagSet } from './tags'
import { log } from '@fiction/core'

const logger = log.contextLogger('stockMedia')

type TagCategory = keyof typeof tagSet
export type Tag = typeof tagSet[TagCategory][number]

type MediaFormat = 'image' | 'video'

export type MediaItem = {
  format: MediaFormat
  url: string
  tags: Tag[]
  slug: string
  alt?: string
  aspect?: 'square' | 'portrait' | 'landscape'
}

type MediaCollection = MediaItem[]

type GetMediaArgs = {
  format?: MediaFormat
  tags?: Tag[]
  caller?: string
}

export class StockMedia {
  private usedMedia: Set<string> = new Set()
  media: MediaCollection
  localMedia: Record<LocalMediaKeys, MediaObject>
  constructor(args: { media: MediaCollection, localMedia: Record<LocalMediaKeys, MediaObject> }) {
    this.media = args.media
    this.localMedia = args.localMedia
  }

  private filterMedia(args: GetMediaArgs = {}): MediaItem[] {
    const media = this.media

    const r = media.filter((item) => {
      if (this.usedMedia.has(item.url))
        return false
      if (args.format && item.format !== args.format)
        return false
      if (args.tags && !args.tags.every(tag => item.tags.includes(tag)))
        return false
      return true
    })

    return r
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
      logger.error('No media items available', { data: { args, filteredMedia, usedMediaSize: this.usedMedia.size } })
      const m = this.media
      return m[0] ?? {}
    }

    const rand = Math.random()
    const randomIndex = Math.floor(rand * filteredMedia.length)
    const selectedItem = filteredMedia[randomIndex]

    if (!selectedItem) {
      logger.error('No media items available', { data: { args, filteredMedia } })
      throw new Error(`No media items available: tags: "${args.tags?.join(', ')}", randomIndex: ${randomIndex}, filteredMedia: ${filteredMedia.length}`)
    }

    this.markAsUsed(selectedItem)
    const aspect = (selectedItem.tags.find(tag => tag.startsWith('aspect:')) || '').replace('aspect:', '') as 'square' | 'portrait' | 'landscape' | undefined
    return { alt: 'Example Image', aspect, ...selectedItem }
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
    const media = this.media
    return media.find(item =>
      item.slug.toLowerCase().includes(normalizedPartialSlug),
    )
  }

  // New method to get all assets matching a partial slug
  getAllAssetsBySlug(partialSlug: string): MediaItem[] {
    const normalizedPartialSlug = partialSlug.toLowerCase()
    const media = this.media
    return media.filter(item =>
      item.slug.toLowerCase().includes(normalizedPartialSlug),
    )
  }

  resetUsedMedia(): void {
    this.usedMedia.clear()
  }

  getLocalMedia(args: { key: LocalMediaKeys }): MediaObject {
    const { key } = args
    const media = this.localMedia[key]
    return media
  }
}

export async function createStockMediaHandler(): Promise<StockMedia> {
  const { default: MediaCollection } = await import('./mediaItems.json')
  const { localMedia } = await import('./localMedia')
  return new StockMedia({ media: MediaCollection as MediaCollection, localMedia })
}
