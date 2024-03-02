import ImgAvatarAfter1 from './avatar-after-1.png'
import ImgAvatarAfter2 from './avatar-after-2.jpg'
import ImgAvatarBefore1 from './avatar-before-1.png'
import ImgYetiAfter1 from './yeti-after-1.jpg'
import ImgYetiAfter2 from './yeti-after-2.jpg'
import ImgYetiBefore1 from './yeti-before.jpg'
import ImgInteriorAfter1 from './interior-after-1.jpg'
import ImgInteriorAfter2 from './interior-after-2.jpg'
import ImgInteriorBefore1 from './interior-before.jpg'

const images = {
  'avatar-after-1': ImgAvatarAfter1,
  'avatar-after-2': ImgAvatarAfter2,
  'avatar-before-1': ImgAvatarBefore1,
  'yeti-after-1': ImgYetiAfter1,
  'yeti-after-2': ImgYetiAfter2,
  'yeti-before': ImgYetiBefore1,
  'interior-after-1': ImgInteriorAfter1,
  'interior-after-2': ImgInteriorAfter2,
  'interior-before': ImgInteriorBefore1,
}

export function getImage(imgName: keyof typeof images): string {
  return images[imgName]
}
