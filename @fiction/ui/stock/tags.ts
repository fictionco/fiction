export const tagSet = {
  format: [
    'image',
    'video',
  ],
  flags: [
    'annotated',
  ],
  // Style
  style: [
    'realistic',
    'minimal',
    'corporate',
    'lifestyle',
    'vintage',
    'modern',
    'artistic',
    'editorial',
    'candid',
    'staged',
    'abstract',
    'silhouette',
  ],

  // Subject
  subject: [
    'person',
    'man',
    'woman',
    'background',
    'people',
    'nature',
    'urban',
    'object',
    'technology',
    'food',
    'animal',
  ],

  // Shot Type
  shotType: [
    'headshot',
    'farshot',
    'midshot',
    'wideshot',
  ],

  // Color Tone (prefixed with 'color:')
  colorTone: [
    'color:warm',
    'color:cool',
    'color:neutral',
    'color:blackAndWhite',
    'color:multi',
  ],

  // Aspect Ratio (prefixed with 'aspect:')
  aspectRatio: [
    'aspect:square',
    'aspect:wide',
    'aspect:tall',
    'aspect:landscape',
    'aspect:portrait',
  ],
} as const
