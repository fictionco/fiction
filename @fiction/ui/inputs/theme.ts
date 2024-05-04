import { twMerge } from 'tailwind-merge'

export function inputClasses(feature: 'box') {
  const out: string[] = []

  if (feature === 'box')
    out.push('text-input-size bg-theme-100 hover:bg-theme-200 border-theme-200')

  return out
}

export function textInputClasses(args: { inputClass: string }) {
  const { inputClass = '' } = args
  const out = [
    'font-mono',
    'font-medium',
    'tracking-tight',
    'antialiased',
    'block',
    'w-full',
    'appearance-none',
    'outline-none',
    'focus:outline-none',
    'focus:shadow-[inset_0px_4px_4px_-4px_rgba(0,0,0,0.1)]',
    'disabled:cursor-not-allowed',
    'disabled:opacity-70',
    'resize-none',
    'focus:ring-0',
    'focus:ring-input-color',
    'rounded-input',
    'px-input-x',
    'py-input-y',
    'text-[.9em]',
    'input-shadow-sm',
    'border-theme-200 dark:border-theme-600 focus:border-theme-400 dark:focus:border-theme-500',
    'placeholder:text-theme-300 dark:placeholder:text-theme-600',
    'bg-theme-50 dark:bg-theme-900',
    'text-theme-800 dark:text-theme-0',
    'max-w-input',
    inputClass,
  ]

  return twMerge(out)
}
