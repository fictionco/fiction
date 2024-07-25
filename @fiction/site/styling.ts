import type { SizeBasic } from './schema.js'

type Direction = 'top' | 'bottom' | 'both'

const spacingClasses = {
  none: { top: 'pt-0', bottom: 'pb-0' },
  full: { top: 'min-h-full', bottom: 'min-h-full' },
  xs: { top: 'pt-[calc(0.25rem+1vw)]', bottom: 'pb-[calc(0.25rem+1vw)]' },
  sm: { top: 'pt-[calc(0.5rem+2vw)]', bottom: 'pb-[calc(0.5rem+2vw)]' },
  md: { top: 'pt-[calc(1.5rem+4vw)]', bottom: 'pb-[calc(1.5rem+4vw)]' },
  lg: { top: 'pt-[calc(2.5rem+6vw)]', bottom: 'pb-[calc(2.5rem+6vw)]' },
}

const contentWidthClasses = {
  none: 'mx-auto',
  full: 'mx-auto px-4 sm:px-6 lg:px-8',
  xs: 'max-w-screen-md px-5 sm:px-6 lg:px-16 mx-auto',
  sm: 'max-w-screen-lg px-5 sm:px-6 lg:px-16 mx-auto',
  md: 'max-w-screen-2xl px-5 sm:px-6 lg:px-20 mx-auto',
  lg: 'max-w-screen-3xl px-5 sm:px-6 lg:px-20 mx-auto',
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

export function getContentWidthClass(args: { size: SizeBasic }): string {
  const { size = 'md' } = args
  return contentWidthClasses[size] || contentWidthClasses.md
}
