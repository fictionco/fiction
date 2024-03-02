export function getDimensions(aspect: 'square' | 'portrait' | 'landscape' | 'wide' | 'tall') {
  switch (aspect) {
    case 'portrait': {
      return { width: 512, height: 768 }
    }
    case 'landscape': {
      return { width: 768, height: 512 }
    }
    case 'wide': {
      return { width: 1024, height: 512 }
    }
    case 'tall': {
      return { width: 512, height: 1024 }
    }
    default: {
      return { width: 512, height: 512 }
    }
  }
}
