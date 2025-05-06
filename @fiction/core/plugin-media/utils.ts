import type { ImageFilter } from '../schemas/schemas.js'

export function getImageFilter(f: ImageFilter, a?: number): string {
  if (a === undefined)
    return ''

  let v: string = ''
  if (f === 'blur')
    v = `blur(${(a / 100) * 10}px)`
  else if (f === 'opacity')
    v = `opacity(${a / 100})`
  else if (f === 'grayscale')
    v = `grayscale(${a / 100})`
  else if (f === 'invert')
    v = `invert(${a / 100})`
  else if (f === 'sepia')
    v = `sepia(${a / 100})`
  else if (f === 'brightness')
    v = `brightness(${(a / 100) * 2})`
  else if (f === 'saturate')
    v = `saturate(${(a / 100) * 2})`
  else if (f === 'hue-rotate')
    v = `hue-rotate(${(a / 100) * 360}deg)`
  else if (f === 'contrast')
    v = `contrast(${(a / 100) * 2})`

  return v
}
