import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.resolve(__dirname, '../@fiction/core/.env') })

const outputPath = path.resolve(__dirname, '../@fiction/cards/stock/mediaItems.json')

cloudinary.config({
  cloud_name: 'fiction-com-inc',
  api_key: '328336531555545',
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

type AspectRatio = 'aspectTall' | 'aspectSquare' | 'aspectLandscape' | 'aspectPortrait' | 'aspectWide'

type MediaItem = {
  format: 'image' | 'video'
  url: string
  tags: string[]
}

function getAspectRatio(width: number, height: number): AspectRatio {
  const ratio = width / height
  if (ratio > 1.5)
    return 'aspectWide'
  if (ratio > 1.2)
    return 'aspectLandscape'
  if (ratio < 0.8)
    return 'aspectTall'
  if (ratio < 0.9)
    return 'aspectPortrait'
  return 'aspectSquare'
}

async function fetchAssetDetails(publicId: string, resourceType: string): Promise<{ width: number, height: number }> {
  try {
    const result = await cloudinary.api.resource(publicId, { resource_type: resourceType })
    return { width: result.width, height: result.height }
  }
  catch (error) {
    console.error(`Error fetching details for ${publicId}:`, error)
    return { width: 0, height: 0 }
  }
}

async function addAspectRatioTag(publicId: string, resourceType: string, aspectRatio: AspectRatio): Promise<void> {
  try {
    await cloudinary.uploader.add_tag(aspectRatio, [publicId], { resource_type: resourceType })
    console.log(`Added tag ${aspectRatio} to ${publicId}`)
  }
  catch (error) {
    console.error(`Error adding tag to ${publicId}:`, error)
  }
}

async function fetchAndFormatAssets(): Promise<MediaItem[]> {
  try {
    const { resources } = await cloudinary.search
      .expression('resource_type:image OR resource_type:video')
      .with_field('tags')
      .sort_by('public_id', 'desc')
      .max_results(500)
      .execute()

    const assets: MediaItem[] = await Promise.all(resources.map(async (resource: any) => {
      const isImage = resource.resource_type === 'image'
      const transformations = 'f_auto,q_auto,c_fill,w_1000,h_1000'

      const url = `https://res.cloudinary.com/${cloudinary.config().cloud_name}/${resource.resource_type}/upload/${transformations}/v${resource.version}/${resource.public_id}.${resource.format}`

      let aspectRatio: AspectRatio | undefined = resource.tags.find((tag: string) => tag.startsWith('aspect')) as AspectRatio

      if (!aspectRatio) {
        const { width, height } = await fetchAssetDetails(resource.public_id, resource.resource_type)
        aspectRatio = getAspectRatio(width, height)
        await addAspectRatioTag(resource.public_id, resource.resource_type, aspectRatio)
        resource.tags.push(aspectRatio)
      }

      return {
        format: isImage ? 'image' : 'video',
        url,
        tags: resource.tags,
      }
    }))

    await fs.writeFile(outputPath, JSON.stringify(assets, null, 2))
    console.log(`Retrieved ${assets.length} media items and saved to ${outputPath}`)

    return assets
  }
  catch (error) {
    console.error('Error fetching Cloudinary assets:', error)
    return []
  }
}

fetchAndFormatAssets()
