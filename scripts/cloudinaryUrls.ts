import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { tagSet } from '../@fiction/cards/stock/tags.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.resolve(__dirname, '../@fiction/core/.env') })

const outputPath = path.resolve(__dirname, '../@fiction/cards/stock/mediaItems.json')

cloudinary.config({
  cloud_name: 'fiction-com-inc',
  api_key: '328336531555545',
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY

if (!GOOGLE_VISION_API_KEY) {
  throw new Error('GOOGLE_VISION_API_KEY is not set in the environment variables')
}

type AspectRatio = 'aspect:tall' | 'aspect:square' | 'aspect:landscape' | 'aspect:portrait' | 'aspect:wide'

type MediaItem = {
  format: 'image' | 'video'
  url: string
  tags: string[]
}

function getAspectRatio(width: number, height: number): AspectRatio {
  const ratio = width / height
  if (ratio >= 2)
    return 'aspect:wide'
  if (ratio <= 0.5)
    return 'aspect:tall'
  if (ratio > 1.2)
    return 'aspect:landscape'
  if (ratio < 0.8)
    return 'aspect:portrait'
  return 'aspect:square'
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

async function addTag(publicId: string, resourceType: string, tag: string): Promise<void> {
  try {
    await cloudinary.uploader.add_tag(tag, [publicId], { resource_type: resourceType })
    console.log(`Added tag ${tag} to ${publicId}`)
  }
  catch (error) {
    console.error(`Error adding tag to ${publicId}:`, error)
  }
}

async function getAIStyleTags(imageUrl: string): Promise<string[]> {
  try {
    console.log(`Fetching AI tags for image: ${imageUrl}`)
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              image: { source: { imageUri: imageUrl } },
              features: [
                { type: 'LABEL_DETECTION', maxResults: 10 },
                { type: 'IMAGE_PROPERTIES' },
              ],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = (await response.json()) as {
      responses: [
        {
          labelAnnotations: { description: string, score: number }[]
          imagePropertiesAnnotation: {
            dominantColors: {
              colors: { color: { red: number, green: number, blue: number } }[]
            }
          }
        },
      ]
    }

    const labels = data.responses[0].labelAnnotations
      .filter(label => label.score > 0.7)
      .map(label => label.description.toLowerCase())

    const tags: string[] = []

    // Match to predefined style tags
    const matchedStyleTags = matchTags(labels, tagSet.style)
    tags.push(...matchedStyleTags)

    // Match to predefined subject tags
    const matchedSubjectTags = matchTags(labels, tagSet.subject)
    tags.push(...matchedSubjectTags)

    // Match to predefined shot type tags
    const matchedShotTypeTags = matchTags(labels, tagSet.shotType)
    tags.push(...matchedShotTypeTags)

    // Determine color tone based on image properties
    const colorToneTag = determineColorTone(data.responses[0].imagePropertiesAnnotation.dominantColors.colors)
    if (colorToneTag)
      tags.push(colorToneTag)

    // Optionally, add logic for aspect ratio or any other custom tags
    // Example: tags.push('aspect:square') based on your own logic

    return tags
  }
  catch (error) {
    console.error('Error in AI style tagging:', error)
    return []
  }
}

function matchTags(labels: string[], predefinedTags: readonly string[]): string[] {
  return predefinedTags.filter(tag => labels.some(label => label.includes(tag)))
}

function determineColorTone(colors: { color: { red: number, green: number, blue: number } }[]): string | null {
  const avgColor = colors.reduce((acc, color) => {
    acc.red += color.color.red
    acc.green += color.color.green
    acc.blue += color.color.blue
    return acc
  }, { red: 0, green: 0, blue: 0 })

  const count = colors.length
  avgColor.red /= count
  avgColor.green /= count
  avgColor.blue /= count

  if (avgColor.red > avgColor.blue) {
    return 'color:warm'
  }
  else if (avgColor.blue > avgColor.red) {
    return 'color:cool'
  }
  else if (avgColor.red === avgColor.blue && avgColor.green === avgColor.red) {
    return 'color:neutral'
  }
  else {
    return 'color:multi'
  }
}

async function testGoogleVisionAPI() {
  const testImageUrl = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  console.log('Testing Google Vision API...')
  console.log('API Key:', `${GOOGLE_VISION_API_KEY?.substring(0, 5)}...${GOOGLE_VISION_API_KEY?.slice(-5)}`)

  try {
    const tags = await getAIStyleTags(testImageUrl)
    console.log('Test result:', tags)
    if (tags.length > 0) {
      console.log('Google Vision API test successful!')
    }
    else {
      console.error('Google Vision API test failed. No tags were returned.')
      console.log('Please check your API key and Google Cloud Console settings.')
      process.exit(1)
    }
  }
  catch (error) {
    console.error('Error during Google Vision API test:', error)
    console.log('Please check your API key and Google Cloud Console settings.')
    process.exit(1)
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

      const { width, height } = await fetchAssetDetails(resource.public_id, resource.resource_type)
      const aspectRatio = getAspectRatio(width, height)

      let tags = resource.tags || []
      const existingAspectTag = tags.find((tag: string) => tag.startsWith('aspect:'))
      if (!existingAspectTag) {
        await addTag(resource.public_id, resource.resource_type, aspectRatio)
        tags.push(aspectRatio)
      }
      else if (existingAspectTag !== aspectRatio) {
        tags = tags.filter((tag: string) => !tag.startsWith('aspect:'))
        await addTag(resource.public_id, resource.resource_type, aspectRatio)
        tags.push(aspectRatio)
      }

      if (isImage && !tags.includes('annotated')) {
        const aiStyleTags = await getAIStyleTags(url)
        for (const tag of aiStyleTags) {
          if (!tags.includes(tag)) {
            await addTag(resource.public_id, resource.resource_type, tag)
            tags.push(tag)
          }
        }

        await addTag(resource.public_id, resource.resource_type, 'annotated')
      }

      return { format: isImage ? 'image' : 'video', url, tags }
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

async function main() {
  await testGoogleVisionAPI()
  await fetchAndFormatAssets()
}

main().catch((error) => {
  console.error('An error occurred:', error)
  process.exit(1)
})
