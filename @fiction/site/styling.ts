import type { StandardSize } from '@fiction/core'

type Direction = 'top' | 'bottom' | 'both'

type SizeWithNone = StandardSize | 'none' | 'full'

const spacingClasses = {
  'none': { top: 'pt-0', bottom: 'pb-0' },
  'full': { top: 'min-h-[100dvh] flex items-center', bottom: 'min-h-[100dvh]' },
  'xxs': { top: 'pt-[calc(0.25rem+.3vw)]', bottom: 'pb-[calc(0.25rem+.3vw)]' },
  'xs': { top: 'pt-[calc(0.5rem+.5vw)]', bottom: 'pb-[calc(0.5rem+.3vw)]' },
  'sm': { top: 'pt-[calc(1rem+1vw)]', bottom: 'pb-[calc(1rem+1vw)]' },
  'md': { top: 'pt-[calc(2rem+2.5vw)]', bottom: 'pb-[calc(2rem+2.5vw)]' },
  'lg': { top: 'pt-[calc(4rem+5vw)]', bottom: 'pb-[calc(4rem+5vw)]' },
  'xl': { top: 'pt-[calc(6rem+8vw)]', bottom: 'pb-[calc(6rem+8vw)]' },
  '2xl': { top: 'pt-[calc(8rem+12vw)]', bottom: 'pb-[calc(8rem+12vw)]' },
}

export function getSpacingClass(args: { size: SizeWithNone, direction: Direction }): string {
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

const baseContentWidthClasses: Record<SizeWithNone, string> = {
  'none': 'mx-auto',
  'full': 'mx-auto w-full',
  'xxs': 'mx-auto max-w-screen-sm',
  'xs': 'mx-auto max-w-screen-md',
  'sm': 'mx-auto max-w-screen-lg',
  'md': 'mx-auto max-w-screen-xl',
  'lg': 'mx-auto max-w-screen-2xl',
  'xl': 'mx-auto max-w-screen-3xl',
  '2xl': 'mx-auto max-w-screen-4xl',
}

const padClasses: Record<SizeWithNone, string> = {
  'none': '',
  'full': 'px-4 sm:px-6 lg:px-8',
  'xxs': 'px-2 sm:px-4',
  'xs': 'px-4 sm:px-6',
  'sm': 'px-4 sm:px-8',
  'md': 'px-4 sm:px-10 lg:px-20',
  'lg': 'px-4 sm:px-14 lg:px-20',
  'xl': 'px-4 sm:px-14 lg:px-20',
  '2xl': 'px-4 sm:px-14 lg:px-20',
}

export function getContentWidthClass(args: { size?: SizeWithNone, padSize?: SizeWithNone | boolean }): string {
  const { size = 'md', padSize } = args

  const baseClass = baseContentWidthClasses[size] || baseContentWidthClasses.md

  let padClass = ''
  if (padSize === true) {
    // If padSize is true, use the same size as the content width
    padClass = padClasses[size]
  }
  else if (padSize && padSize !== 'none') {
    // If padSize is specified and not 'none', use that size
    padClass = padClasses[padSize]
  }

  return `${baseClass} ${padClass}`.trim()
}
