import { twMerge } from 'tailwind-merge'

// export function inputClasses(feature: 'box') {
//   const out: string[] = []

//   if (feature === 'box')
//     out.push('text-input-size bg-theme-100 hover:bg-theme-200 border-theme-200')

//   return out
// }

export function selectInputClasses(args: { inputClass: string, classButton?: string }) {
  const { inputClass = '', classButton } = args
  return {

    wrapClass: 'text-theme-700 dark:text-theme-0 relative max-w-input font-mono',
    selector: {
      always: 'text-theme-300 dark:text-theme-0 group-hover:text-theme-400 dark:group-hover:text-theme-50 pointer-events-none flex items-center',
      active: 'text-theme-500',
    },
    buttonClasses: {
      always: twMerge([
        'focus:ring-0',
        'focus:outline-none',
        'focus:border-theme-400',
        'select-none',
        'font-mono',
        'font-medium',
        'group',
        'relative',
        'w-full',
        'cursor-pointer',
        'rounded-input',
        'border',
        'border-theme-300',
        'dark:border-theme-500',
        'py-1.5',
        'px-3',
        'text-left',
        'bg-theme-50/50',
        'shadow-xs',
        'dark:bg-theme-700',
        'text-[.9em]',
        'space-between',
        'flex',
        'items-center',
        'space-x-3',
        'antialiased',
        'hover:opacity-80',
        classButton,
      ]),
      disabled: ['opacity-80', 'cursor-not-allowed'].join(' '),
      regular: '',
    },
    dropdownClasses: [
      'text-[.9em]',
      'bg-theme-0',
      'dark:bg-theme-700',
      'ring-theme-300/60',
      'dark:ring-theme-600',
      'absolute',
      'z-50',
      'mt-1',
      'w-full',
      'rounded-md',
      'shadow-xl',
      'ring-1',
      'max-h-72',
      'overflow-auto',
    ].join(' '),
    optionClasses: {
      title: 'py-input-y px-input-x mt-[.5em] text-theme-300 dark:text-theme-0 text-[.8em]',
      divider: 'border-input-edge w-full border-t',
      always: ['py-1.5 pl-2 pr-1 group relative cursor-pointer select-none rounded-md mb-[1px] text-[.9em] antialiased flex items-center justify-between'].join(' '),
      disabled: ['opacity-60 cursor-not-allowed'].join(' '),
      hovered: ['bg-primary-500 dark:bg-primary-700/50 text-theme-0 dark:text-theme-0'].join(' '),
      selected: ['bg-theme-100/70 dark:bg-theme-900'].join(' '),
      notSelected: ['font-normal cursor-pointer dark:hover:text-theme-50 hover:bg-primary-500 hover:text-theme-0 dark:hover:bg-theme-600/50'].join(' '),
    },
  }
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
    'px-2',
    'py-1.5',
    'text-[.9em]',
    'input-shadow-sm',
    'border',
    'focus-within:border',
    'focus-within:border-theme-400 dark:focus:border-theme-500',
    'border-theme-300 dark:border-theme-600 focus:border-theme-400 dark:focus:border-theme-500',
    'placeholder:text-theme-300 dark:placeholder:text-theme-600',
    'bg-theme-50/50 dark:bg-theme-900',
    'text-theme-800 dark:text-theme-0',
    'max-w-input',
    inputClass,
  ]

  return twMerge(out)
}
