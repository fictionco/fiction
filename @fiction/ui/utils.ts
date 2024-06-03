import type { colorTheme } from '@fiction/core'

export type UiElementSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type UiElementStyle = 'danger' | 'caution' | 'success' | 'primary' | 'default' | 'theme' | 'naked'
export type UiElementFormat = 'block' | 'spread' | 'inline'

export type ColorTheme = typeof colorTheme[number] | 'theme' | 'overlay' | 'naked'

export function getColorThemeStyles(theme: ColorTheme = 'theme') {
  const cls = {
    naked: { text: 'text-theme-500', bg: '', ring: 'ring-transparent', border: 'border-transparent', hover: '', active: '' },
    overlay: { text: 'text-white/90', bg: '', ring: 'ring-white/50', border: 'border-white/50', hover: 'hover:bg-white/20', active: 'active:bg-white/30' },
    violet: { text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-400/10', ring: 'ring-violet-500/50 dark:ring-violet-400/20', border: 'border-violet-500/50 dark:border-violet-400/20', hover: 'hover:bg-violet-400 dark:hover:bg-violet-500/60', active: 'active:bg-violet-500/50 dark:active:bg-violet-400/20' },
    theme: { text: 'text-theme-600 dark:text-theme-200', bg: 'bg-theme-50 dark:bg-theme-400/10', ring: 'ring-theme-500/50 dark:ring-theme-500/40', border: 'border-theme-500/50 dark:border-theme-400/20', hover: 'hover:bg-theme-100 dark:hover:bg-theme-500/60', active: 'active:bg-theme-200 dark:active:bg-theme-400/20' },
    gray: { text: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-400/10', ring: 'ring-gray-500/50 dark:ring-gray-400/20', border: 'border-gray-500/50 dark:border-gray-400/20', hover: 'hover:bg-gray-100 dark:hover:bg-gray-700', active: 'active:bg-gray-200 dark:active:bg-gray-600' },
    red: { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-400/10', ring: 'ring-red-500/50 dark:ring-red-400/20', border: 'border-red-500/50 dark:border-red-400/20', hover: 'hover:bg-red-100 dark:hover:bg-red-700', active: 'active:bg-red-200 dark:active:bg-red-600' },
    yellow: { text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-400/10', ring: 'ring-yellow-500/10 dark:ring-yellow-400/20', border: 'border-yellow-500/10 dark:border-yellow-400/20', hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-700', active: 'active:bg-yellow-200 dark:active:bg-yellow-600' },
    green: { text: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-400/10', ring: 'ring-green-500/60 dark:ring-green-400/20', border: 'border-green-500/60 dark:border-green-400/20', hover: 'hover:bg-green-100 dark:hover:bg-green-700', active: 'active:bg-green-200 dark:active:bg-green-600' },
    blue: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-400/10', ring: 'ring-blue-500/50 dark:ring-blue-400/20', border: 'border-blue-500/50 dark:border-blue-400/20', hover: 'hover:bg-blue-100 dark:hover:bg-blue-700', active: 'active:bg-blue-200 dark:active:bg-blue-600' },
    indigo: { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-400/10', ring: 'ring-indigo-500/50 dark:ring-indigo-400/20', border: 'border-indigo-500/50 dark:border-indigo-400/20', hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-700', active: 'active:bg-indigo-200 dark:active:bg-indigo-600' },
    purple: { text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-400/10', ring: 'ring-purple-500/50 dark:ring-purple-400/20', border: 'border-purple-500/50 dark:border-purple-400/20', hover: 'hover:bg-purple-100 dark:hover:bg-purple-700', active: 'active:bg-purple-200 dark:active:bg-purple-600' },
    pink: { text: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-400/10', ring: 'ring-pink-500/50 dark:ring-pink-400/20', border: 'border-pink-500/50 dark:border-pink-400/20', hover: 'hover:bg-pink-100 dark:hover:bg-pink-700', active: 'active:bg-pink-200 dark:active:bg-pink-600' },
    sky: { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-400/10', ring: 'ring-sky-500/50 dark:ring-sky-400/20', border: 'border-sky-500/50 dark:border-sky-400/20', hover: 'hover:bg-sky-100 dark:hover:bg-sky-700', active: 'active:bg-sky-200 dark:active:bg-sky-600' },
    lime: { text: 'text-lime-600 dark:text-lime-400', bg: 'bg-lime-50 dark:bg-lime-400/10', ring: 'ring-lime-500/50 dark:ring-lime-400/20', border: 'border-lime-500/50 dark:border-lime-400/20', hover: 'hover:bg-lime-100 dark:hover:bg-lime-700', active: 'active:bg-lime-200 dark:active:bg-lime-600' },
    amber: { text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-400/10', ring: 'ring-amber-500/50 dark:ring-amber-400/20', border: 'border-amber-500/50 dark:border-amber-400/20', hover: 'hover:bg-amber-100 dark:hover:bg-amber-700', active: 'active:bg-amber-200 dark:active:bg-amber-600' },
    emerald: { text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-400/10', ring: 'ring-emerald-500/50 dark:ring-emerald-400/20', border: 'border-emerald-500/50 dark:border-emerald-400/20', hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-700', active: 'active:bg-emerald-200 dark:active:bg-emerald-600' },
    teal: { text: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-400/10', ring: 'ring-teal-500/50 dark:ring-teal-400/20', border: 'border-teal-500/50 dark:border-teal-400/20', hover: 'hover:bg-teal-100 dark:hover:bg-teal-700', active: 'active:bg-teal-200 dark:active:bg-teal-600' },
    cyan: { text: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-400/10', ring: 'ring-cyan-500/50 dark:ring-cyan-400/20', border: 'border-cyan-500/50 dark:border-cyan-400/20', hover: 'hover:bg-cyan-100 dark:hover:bg-cyan-700', active: 'active:bg-cyan-200 dark:active:bg-cyan-600' },
    orange: { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-400/10', ring: 'ring-orange-500/50 dark:ring-orange-400/20', border: 'border-orange-500/50 dark:border-orange-400/20', hover: 'hover:bg-orange-100 dark:hover:bg-orange-700', active: 'active:bg-orange-200 dark:active:bg-orange-600' },
    rose: { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-400/10', ring: 'ring-rose-500/50 dark:ring-rose-400/20', border: 'border-rose-500/50 dark:border-rose-400/20', hover: 'hover:bg-rose-100 dark:hover:bg-rose-700', active: 'active:bg-rose-200 dark:active:bg-rose-600' },
    fuchsia: { text: 'text-fuchsia-600 dark:text-fuchsia-400', bg: 'bg-fuchsia-50 dark:bg-fuchsia-400/10', ring: 'ring-fuchsia-500/50 dark:ring-fuchsia-400/20', border: 'border-fuchsia-500/50 dark:border-fuchsia-400/20', hover: 'hover:bg-fuchsia-100 dark:hover:bg-fuchsia-700', active: 'active:bg-fuchsia-200 dark:active:bg-fuchsia-600' },
  } as const

  return cls[theme as keyof typeof cls]
}

export function getBadgeClasses(args: { theme?: ColorTheme, size?: UiElementSize, isLink?: boolean, isActive?: boolean }) {
  const { theme = 'theme', size = 'sm', isLink = false } = args

  const base = `not-prose x-font-title antialiased inline-flex gap-1 items-center rounded-md font-medium ring-1 ring-inset`

  const stl = getColorThemeStyles(theme)

  const hoverStyle = isLink ? 'hover:bg-opacity-30 active:bg-opacity-100 cursor-pointer' : ''
  const activeStyle = args.isActive ? 'bg-opacity-80' : ''

  const sizeStyles = {
    'xxs': 'px-1 py-0.5 text-[10px]',
    'xs': 'px-2 py-1 text-xs',
    'sm': 'px-3 py-1.5 text-sm',
    'md': 'px-2 py-1 text-xs',
    'lg': 'px-5 py-2.5 text-base',
    'xl': 'px-6 py-3 text-base',
    '2xl': 'px-7 py-3.5 text-xl',
  }

  const sizeClasses = size ? sizeStyles[size] : ''

  const out = [base, stl.bg, stl.ring, stl.text, hoverStyle, sizeClasses]

  return out.join(' ')
}

export function getButtonClasses(args: { btn: UiElementStyle | string, size: UiElementSize, format: UiElementFormat, isDisabled?: boolean, useShadow?: boolean, noHover?: boolean }) {
  const { btn = 'default', size, format, isDisabled, useShadow, noHover } = args

  const baseClasses = 'relative max-w-full select-none items-center font-sans font-semibold focus:outline-none antialiased'

  const hoverStyles = {
    danger: 'hover:bg-rose-400 dark:hover:bg-rose-800',
    caution: 'hover:bg-amber-400 dark:hover:bg-amber-600',
    primary: 'hover:bg-primary-600 dark:hover:bg-primary-900 hover:border-primary-600 dark:hover:border-primary-700',
    success: 'hover:bg-emerald-400 dark:hover:bg-emerald-600',
    theme: 'hover:bg-theme-400 dark:hover:bg-theme-500/60',
    default: 'hover:bg-theme-100 dark:hover:bg-theme-900',
  }

  const staticStyles = {
    danger: 'border bg-rose-500 dark:bg-rose-900 focus-visible:outline-rose-500 text-rose-50 dark:text-rose-0 border-rose-500 dark:border-rose-600',
    caution: 'border bg-amber-500 dark:bg-amber-700 focus-visible:outline-amber-500 text-amber-50 border-amber-500 dark:border-amber-600',
    primary: 'border bg-primary-500 dark:bg-primary-800 focus-visible:outline-primary-600 text-primary-0 border-primary-500 dark:border-primary-600',
    success: 'border bg-emerald-500 dark:bg-emerald-900 focus-visible:outline-emerald-500 text-emerald-50 border-emerald-500 dark:border-emerald-600',
    theme: 'border bg-theme-500 dark:bg-theme-600 focus-visible:outline-theme-500 text-theme-0 border-theme-500 dark:border-theme-500',
    naked: '',
    default: 'border bg-theme-50/50 dark:bg-theme-700 text-theme-600 dark:text-theme-0 border-theme-300/50 dark:border-theme-600',
  }

  const sizes = {
    'xxs': 'px-2 py-0.5 text-[9px]',
    'xs': 'px-2 py-1 text-[10px]',
    'sm': 'px-2.5 py-1 text-xs',
    'md': 'px-3 py-1.5 text-sm',
    'lg': 'px-4 py-2 text-base',
    'xl': 'px-6 py-2.5 sm:text-base md:text-lg',
    '2xl': 'px-8 py-3 sm:text-base md:text-lg',
  }

  const formats = {
    block: 'flex justify-center w-full',
    spread: 'flex justify-between w-full',
    inline: 'inline-flex',
  }

  const roundedSizeMap = {
    'xxs': 'rounded-md',
    'xs': 'rounded-md',
    'sm': 'rounded-md',
    'md': 'rounded-lg',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
  }

  const getRoundedClass = (size: keyof typeof roundedSizeMap) => {
    return roundedSizeMap[size] || roundedSizeMap.md
  }

  const styleClasses = staticStyles[btn as keyof typeof staticStyles] || staticStyles.default
  const hoverClass = hoverStyles[btn as keyof typeof hoverStyles] && !isDisabled && !noHover ? hoverStyles[btn as keyof typeof hoverStyles] : ''

  const roundedClass = getRoundedClass(size)
  const sizeClasses = sizes[size as keyof typeof sizes] || sizes.md
  const formatClasses = formats[format as keyof typeof formats] || formats.inline

  return [
    baseClasses,
    styleClasses,
    hoverClass,
    sizeClasses,
    formatClasses,
    roundedClass,
    useShadow ? 'shadow-sm hover:shadow-md active:shadow-none' : '',
    isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
  ].join(' ')
}
