import type { RegularizationTheme } from '../types'
import { prompts as avatarPrompts } from './avatar'
import {
  guidance as productGuidance,
  prompts as productPrompts,
} from './product'

export * from '../types'

export const regularizationThemes: RegularizationTheme[] = [
  {
    value: 'man',
    name: 'Man',
    conceptConfig: {
      classToken: 'man',
      classDataZipUrl: 'https://github.com/supereon/data/raw/main/img/man.zip',
    },
    type: 'avatar',
  },
  {
    value: 'woman',
    name: 'Woman',
    conceptConfig: {
      classToken: 'woman',
      classDataZipUrl:
        'https://github.com/supereon/data/raw/main/img/woman.zip',
    },
    type: 'avatar',
  },
  {
    value: 'boy',
    name: 'Child (Boy)',
    conceptConfig: {
      classToken: 'boy',
      classDataZipUrl: 'https://github.com/supereon/data/raw/main/img/boy.zip',
    },
    type: 'avatar',
  },
  {
    value: 'girl',
    name: 'Child (Girl)',
    conceptConfig: {
      classToken: 'girl',
      classDataZipUrl: 'https://github.com/supereon/data/raw/main/img/girl.zip',
    },
    type: 'avatar',
  },
  {
    value: 'manSuit',
    name: 'Man (Business)',
    conceptConfig: {
      classToken: 'man',
      classDataZipUrl:
        'https://github.com/supereon/data/raw/main/img/man-suit.zip',
    },
    type: 'avatar',
  },
  {
    value: 'couple',
    name: 'Couple',
    conceptConfig: {
      classToken: 'couple',
      classDataZipUrl:
        'https://github.com/supereon/data/raw/main/img/couple.zip',
    },
    type: 'avatar',
  },
  {
    value: 'dog',
    name: 'Dog',
    conceptConfig: {
      classToken: 'dog',
      classDataZipUrl: 'https://github.com/supereon/data/raw/main/img/dog.zip',
    },
    type: 'animal',
  },
]

export { avatarPrompts, productPrompts, productGuidance }
