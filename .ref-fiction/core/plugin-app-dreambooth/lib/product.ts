import type { Prompt } from '../types'
import imgFantasy from './product/fantasy-1.png'
import imgFantasy2 from './product/fantasy-2.png'
import imgTypographic from './product/typographic-1.png'

export const guidance = [
  '10 close up images of product, 5 different angles',
  'Only train with the items you want in the photos, minimize unwanted items/people',
  'Photos in different locations/backgrounds',
  'Photos in different lighting conditions',
  'Only color photos (larger than 512x512px)',
]

export const prompts: Prompt[] = [
  {
    value: 'fantasy',
    name: 'Fantasy Art',
    renderConfig: {
      prompt:
        'highly secured [c], high detail, fantasy art, concept art, 4 k, ultra detail, computer art ',
      guidanceScale: 12,
      numInferenceSteps: 130,
    },

    category: 'art',
    images: [imgFantasy, imgFantasy2],
    type: 'product',
  },
  {
    value: 'typographic',
    name: 'Typographic',
    renderConfig: {
      prompt:
        'A [c] with the words sweat shop edition, a digital rendering by xi gang, behance contest winner, international typographic style, rtx on, rtx, y 2 k aesthetic',
      guidanceScale: 11,
      numInferenceSteps: 130,
    },
    category: 'art',
    images: [imgTypographic],
    type: 'product',
  },
]
