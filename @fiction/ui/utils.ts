export type UiElementStyle = 'danger' | 'caution' | 'success' | 'primary' | 'default' | 'theme' | 'naked'
export type UiElementSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type UiElementFormat = 'block' | 'spread' | 'inline'

export function getButtonClasses(args: { btn: UiElementStyle | string, size: UiElementSize, format: UiElementFormat, isDisabled?: boolean, useShadow?: boolean, noHover?: boolean }) {
  const { btn = 'default', size, format, isDisabled, useShadow, noHover } = args

  const baseClasses = 'relative max-w-full select-none items-center font-sans font-semibold focus:outline-none antialiased'

  const hoverStyles = {
    danger: 'hover:bg-rose-400 dark:hover:bg-rose-800',
    caution: 'hover:bg-amber-400 dark:hover:bg-amber-600',
    primary: 'hover:bg-primary-600 dark:hover:bg-primary-900 hover:border-primary-600 dark:hover:border-primary-900',
    success: 'hover:bg-emerald-400 dark:hover:bg-emerald-600',
    theme: 'hover:bg-theme-400 dark:hover:bg-theme-600',
    default: 'hover:bg-theme-100 dark:hover:bg-theme-900',
  }

  const staticStyles = {
    danger: 'border bg-rose-500 dark:bg-rose-900 focus-visible:outline-rose-500 text-rose-50 dark:text-rose-900 border-rose-500 dark:border-rose-600',
    caution: 'border bg-amber-500 dark:bg-amber-700 focus-visible:outline-amber-500 text-amber-50 border-amber-500 dark:border-amber-600',
    primary: 'border bg-primary-500 dark:bg-primary-800 focus-visible:outline-primary-600 text-primary-50 border-primary-500 dark:border-primary-600',
    success: 'border bg-emerald-500 dark:bg-emerald-900 focus-visible:outline-emerald-500 text-emerald-50 border-emerald-500 dark:border-emerald-600',
    theme: 'border bg-theme-500 dark:bg-theme-700 focus-visible:outline-theme-500 text-theme-0 border-theme-500 dark:border-theme-600',
    naked: '',
    default: 'border bg-theme-0 dark:bg-theme-700 text-theme-600 dark:text-theme-0 border-theme-200 dark:border-theme-600',
  }

  const sizes = {
    'xxs': 'px-2 py-0.5 text-[9px]',
    'xs': 'px-2 py-1 text-[10px]',
    'sm': 'px-2.5 py-1 text-xs',
    'md': 'px-2.5 py-1.5 text-xs',
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
