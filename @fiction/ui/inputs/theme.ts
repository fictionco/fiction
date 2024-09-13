import type { StandardSize } from '@fiction/core/index.js'
import type { UiElementSize } from '../utils.js'
import { twMerge } from 'tailwind-merge'

// export function inputClasses(feature: 'box') {
//   const out: string[] = []

//   if (feature === 'box')
//     out.push('text-input-size bg-theme-100 hover:bg-theme-200 border-theme-200')

//   return out
// }

export function selectInputClasses(args: { inputClass: string, classButton?: string, uiSize: StandardSize }) {
  const { classButton, uiSize = 'md' } = args

  const sizeClasses = {
    'xxs': { button: 'py-1 px-2 text-xs', dropdown: 'text-[10px]', option: 'py-1 px-2' },
    'xs': { button: 'py-1 px-2 text-xs', dropdown: 'text-[11px]', option: 'py-1 px-2' },
    'sm': { button: 'py-1.5 px-2.5 text-sm', dropdown: 'text-xs', option: 'py-1.5 px-2.5' },
    'md': { button: 'py-2 px-3 text-sm', dropdown: 'text-xs', option: 'py-2 px-3' },
    'lg': { button: 'py-2 px-3.5 text-base', dropdown: 'text-sm', option: 'py-2.5 px-3.5' },
    'xl': { button: 'py-2.5 px-4 text-lg', dropdown: 'text-base', option: 'py-3 px-4' },
    '2xl': { button: 'py-3 px-4 text-xl', dropdown: 'text-lg', option: 'py-3 px-4' },
  }

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
        'rounded-lg',
        'border',
        'border-theme-300',
        'dark:border-theme-500',
        'bg-theme-50/50',
        'shadow-xs',
        'dark:bg-theme-700',
        'space-between',
        'flex',
        'items-center',
        'space-x-3',
        'antialiased',
        'hover:opacity-80',
        sizeClasses[uiSize].button,
        classButton,
      ]),
      disabled: 'opacity-80 cursor-not-allowed',
      regular: '',
    },
    dropdownClasses: twMerge([
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
      sizeClasses[uiSize].dropdown,
    ]),
    optionClasses: {
      title: `py-input-y px-input-x mt-[0.5em] text-theme-300 dark:text-theme-0 text-[0.8em]`,
      divider: 'border-input-edge w-full border-t',
      always: twMerge([
        'group relative cursor-pointer select-none rounded-md mb-[1px] antialiased flex items-center justify-between',
        sizeClasses[uiSize].option,
      ]),
      disabled: 'opacity-60 cursor-not-allowed',
      hovered: 'bg-primary-500 dark:bg-primary-700/50 text-theme-0 dark:text-theme-0',
      selected: 'bg-theme-100/70 dark:bg-theme-900',
      notSelected: 'font-normal cursor-pointer dark:hover:text-theme-50 hover:bg-primary-500 hover:text-theme-0 dark:hover:bg-theme-600/50',
    },
  }
}

export function inputClasses(args: { uiSize?: StandardSize }) {
  const { uiSize = 'md' } = args

  const sizeClasses: Record<UiElementSize, { padX: string, padY: string, textSize: string }> = {
    'xxs': { padX: 'px-2', padY: 'py-1', textSize: 'text-xs' },
    'xs': { padX: 'px-2', padY: 'py-1', textSize: 'text-xs' },
    'sm': { padX: 'px-2.5', padY: 'py-1', textSize: 'text-xs' },
    'md': { padX: 'px-3', padY: 'py-1.5', textSize: 'text-base' },
    'lg': { padX: 'px-3', padY: 'py-2', textSize: 'text-lg' },
    'xl': { padX: 'px-4', padY: 'py-2.5', textSize: 'text-xl' },
    '2xl': { padX: 'px-4', padY: 'py-3', textSize: 'text-xl' },
  }

  return {
    reset: 'text-inherit appearance-none border-none bg-transparent focus:outline-none focus:ring-0 focus:border-transparent',
    border: ['border-0', 'ring-1', 'ring-inset', 'ring-theme-300', 'dark:ring-theme-600/70'],
    padX: [sizeClasses[uiSize].padX],
    padY: [sizeClasses[uiSize].padY],
    textSize: sizeClasses[uiSize].textSize,
    bg: ['bg-theme-50', 'dark:bg-theme-800/50'],
    base: [
      'font-mono',
      'font-medium',
      'tracking-tight',
      'antialiased',
      'block',
      'w-full',
      'appearance-none',
      'outline-none',
      'resize-none',
      'input-shadow-sm',
      'max-w-input',
      'rounded-lg',
    ],
    focus: [
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-inset',
      'focus:ring-primary-700',
      'focus:bg-theme-50/50',
      'dark:focus:ring-2',
      'dark:focus:ring-inset',
      'dark:focus:ring-primary-400',
      'dark:focus:bg-theme-800',
      'focus-within:ring-primary-700',
      'focus-within:ring-2',
      'dark:focus-within:ring-2',
      'dark:focus-within:ring-primary-400',
    ],
    disabled: ['disabled:cursor-not-allowed', 'disabled:opacity-70'],
    text: ['text-theme-800', 'dark:text-theme-0', 'placeholder:text-theme-300', 'dark:placeholder:text-theme-600'],
  }
}

export function textInputClasses(args: { inputClass?: string, uiSize?: UiElementSize, isDisabled?: boolean }) {
  const { inputClass = '', uiSize = 'md', isDisabled = false } = args

  const cls = inputClasses({ uiSize })

  return twMerge([cls.base, cls.padX, cls.padY, cls.textSize, cls.bg, cls.border, cls.focus, cls.text, isDisabled ? cls.disabled : '', inputClass])

  // const baseClasses = [
  //   'font-mono',
  //   'font-medium',
  //   'tracking-tight',
  //   'antialiased',
  //   'block',
  //   'w-full',
  //   'appearance-none',
  //   'outline-none',
  //   'focus:outline-none',
  //   'resize-none',
  //   'input-shadow-sm',
  //   'max-w-input',
  //   'rounded-lg',
  // ]

  // const sizeClasses = {
  //   'xxs': 'px-1 py-0.5 text-[10px]',
  //   'xs': 'px-2 py-1 text-[10px]',
  //   'sm': 'px-2.5 py-1 text-xs',
  //   'md': 'px-3 py-2 text-sm',
  //   'lg': 'px-3 py-2.5 text-base',
  //   'xl': 'px-4 py-2.5 text-base',
  //   '2xl': 'px-4 py-3 text-lg',
  // }

  // const bgClasses = [
  //   'bg-theme-50',
  //   'dark:bg-theme-700/50',
  //   'focus:bg-theme-50/50',
  //   'dark:focus:bg-theme-800',
  // ]

  // const borderClasses = [
  //   'border-0',
  //   'ring-1',
  //   'ring-inset',
  //   'focus:ring-2',
  //   'focus:ring-inset',
  //   'ring-theme-300',
  //   'focus:ring-primary-700',
  //   'focus-within:ring-primary-700',
  //   'focus-within:ring-2',
  //   'dark:ring-theme-500/70',
  //   'dark:focus:ring-2',
  //   'dark:focus-within:ring-2',
  //   'dark:focus:ring-inset',
  //   'dark:focus:ring-primary-400',
  //   'dark:focus-within:ring-primary-400',
  // ]

  // const textClasses = [
  //   'text-theme-800',
  //   'dark:text-theme-0',
  //   'placeholder:text-theme-300',
  //   'dark:placeholder:text-theme-600',
  // ]

  // const stateClasses = [
  //   isDisabled ? 'disabled:cursor-not-allowed disabled:opacity-70' : '',
  //   'focus:shadow-[inset_0px_4px_4px_-4px_rgba(0,0,0,0.1)]',
  // ]

  // const classes = [
  //   ...baseClasses,
  //   sizeClasses[uiSize],
  //   ...bgClasses,
  //   ...borderClasses,
  //   ...textClasses,
  //   ...stateClasses,
  //   inputClass,
  // ]

  // return twMerge(classes.join(' '))
}

export function getCheckboxClasses(uiSize: StandardSize) {
  const baseClasses = {
    container: 'my-4',
    item: 'my-2',
    label: 'inline-flex cursor-pointer items-center',
    input: [
      'cursor-pointer',
      'mr-[.8em]',
      'appearance-none',
      'rounded-[.25em]',
      'focus:outline-none',
      'focus:ring-0',
      'focus:ring-offset-0',
      'bg-theme-100 focus:bg-theme-200 hover:bg-primary-500 dark:bg-theme-800',
      'active:bg-primary-500 selected:bg-primary-500',
    ],
    text: 'checkbox-label text-theme-700 dark:text-theme-50 dark:hover:text-theme-0 hover:text-theme-500 font-sans',
  }

  const sizeClasses = {
    'xxs': { input: 'h-3 w-3', text: 'text-[10px]' },
    'xs': { input: 'h-4 w-4', text: 'text-xs' },
    'sm': { input: 'h-5 w-5', text: 'text-sm' },
    'md': { input: 'h-6 w-6', text: 'text-md' },
    'lg': { input: 'h-7 w-7', text: 'text-lg' },
    'xl': { input: 'h-8 w-8', text: 'text-xl' },
    '2xl': { input: 'h-9 w-9', text: 'text-xl' },
  }

  return {
    container: baseClasses.container,
    item: baseClasses.item,
    label: baseClasses.label,
    input: twMerge(baseClasses.input, sizeClasses[uiSize].input),
    text: twMerge(baseClasses.text, sizeClasses[uiSize].text),
  }
}
