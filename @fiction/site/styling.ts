import type { StandardSize, StandardSizeComplete } from '@fiction/core'

type Direction = 'top' | 'bottom' | 'both'

type SizeWithNone = StandardSize | 'none' | 'full'

const spacingClasses = {
  'none': { top: 'pt-0', bottom: 'pb-0' },
  'full': { top: 'min-h-[100dvh] flex items-center', bottom: 'min-h-[100dvh]' },
  'xxs': { top: 'pt-[calc(0.25rem+.3vw)]', bottom: 'pb-[calc(0.25rem+.3vw)]' },
  'xs': { top: 'pt-[calc(0.5rem+.5vw)]', bottom: 'pb-[calc(0.5rem+.5vw)]' },
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

const config: Record<
  StandardSizeComplete,
  { width: string, pad: string }
> = {
  'none': { width: '', pad: '' },
  'full': { width: 'w-full', pad: 'px-4 sm:px-6 lg:px-8' },
  'xxs': { width: 'max-w-[800px]', pad: 'px-2 sm:px-4' },
  'xs': { width: 'max-w-[960px]', pad: 'px-4 sm:px-6' },
  'sm': { width: 'max-w-[1100px]', pad: 'px-4 sm:px-8' },
  'md': { width: 'max-w-[1300px]', pad: 'px-4 sm:px-8 lg:px-12' },
  'lg': { width: 'max-w-[1500px]', pad: 'px-4 sm:px-10 lg:px-16' },
  'xl': { width: 'max-w-[1800px]', pad: 'px-4 sm:px-12 lg:px-20' },
  '2xl': { width: 'max-w-[2100px]', pad: 'px-4 sm:px-16 lg:px-24' },
}

/**
 * Returns Tailwind classes for responsive content width (default: 'md') with standard padding.
 */
export function getContentWidthClass({ size = 'md' }: { size?: keyof typeof config } = {}): string {
  const { width, pad } = config[size]
  return `mx-auto ${width} ${pad}`.trim()
}
