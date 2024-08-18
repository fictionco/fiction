import type { SizeBasic } from './schema.js'

type Direction = 'top' | 'bottom' | 'both'

const spacingClasses = {
  none: { top: 'pt-0', bottom: 'pb-0' },
  full: { top: 'min-h-[100dvh] flex items-center', bottom: 'min-h-[100dvh]' },
  xs: { top: 'pt-[calc(0.5rem+1vw)]', bottom: 'pb-[calc(0.5+1vw)]' },
  sm: { top: 'pt-[calc(1rem+2vw)]', bottom: 'pb-[calc(1rem+2vw)]' },
  md: { top: 'pt-[calc(2rem+4vw)]', bottom: 'pb-[calc(2rem+4vw)]' },
  lg: { top: 'pt-[calc(4rem+6vw)]', bottom: 'pb-[calc(4rem+6vw)]' },
  xl: { top: 'pt-[calc(6rem+10vw)]', bottom: 'pb-[calc(6rem+10vw)]' },
}

export function getSpacingClass(args: { size: SizeBasic, direction: Direction }): string {
  const { size = 'md', direction = 'both' } = args
  const classes: string[] = []
  if (direction === 'top' || direction === 'both') {
    classes.push(spacingClasses[size].top)
  }
  if (direction === 'bottom' || direction === 'both') {
    classes.push(spacingClasses[size].bottom)
  }
  return classes.join(' ')
}

const baseContentWidthClasses: Record<SizeBasic, string> = {
  none: 'mx-auto',
  full: 'mx-auto w-full',
  xs: 'mx-auto max-w-screen-lg',
  sm: 'mx-auto max-w-screen-xl',
  md: 'mx-auto max-w-screen-2xl',
  lg: 'mx-auto max-w-screen-3xl',
  xl: 'mx-auto max-w-screen-4xl',
}

const padClasses: Record<SizeBasic, string> = {
  none: '',
  full: 'px-4 sm:px-6 lg:px-8',
  xs: 'px-6 sm:px-14',
  sm: 'px-6 sm:px-14',
  md: 'px-6 sm:px-14 lg:px-20', // Updated to match your specification
  lg: 'px-6 sm:px-14 lg:px-20',
  xl: 'px-6 sm:px-14 lg:px-20',
}

export function getContentWidthClass(args: { size: SizeBasic, padSize?: SizeBasic | boolean }): string {
  const { size = 'md', padSize } = args

  const baseClass = baseContentWidthClasses[size] || baseContentWidthClasses.md

  let padClass = ''
  if (padSize === true) {
    // If padSize is true, use the same size as the content width
    padClass = padClasses.md
  }
  else if (padSize && padSize !== 'none') {
    // If padSize is specified and not 'none', use that size
    padClass = padClasses[padSize]
  }

  return `${baseClass} ${padClass}`.trim()
}
