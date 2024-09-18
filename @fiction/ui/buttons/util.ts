import type { ButtonBorder, ButtonDesign, ButtonFontWeight, ButtonFormat, ButtonHover, ButtonRounding, ButtonShadow, ColorThemeUser, StandardSize } from '@fiction/core'
import { themes } from './themes'

export function getButtonClasses(args: {
  theme?: ColorThemeUser
  design?: ButtonDesign
  rounding?: ButtonRounding
  size?: StandardSize
  format?: ButtonFormat
  disabled?: boolean
  shadow?: ButtonShadow
  hover?: ButtonHover
  fontWeight?: ButtonFontWeight
  border?: ButtonBorder
}): { buttonClasses: string, iconClasses: string } {
  const {
    theme = 'default',
    design = 'solid',
    rounding = 'md',
    size = 'md',
    format = 'default',
    disabled = false,
    shadow = 'none',
    hover = 'standard',
    fontWeight = 'semibold',
    border = 'normal',
  } = args

  const baseClasses = 'relative overflow-hidden max-w-full select-none items-center font-sans focus:outline-none antialiased leading-[1.2]'

  const sizes: Record<StandardSize, string> = {
    'xxs': 'px-2 py-0.5 text-[9px]',
    'xs': 'px-2 py-1 text-[10px]',
    'sm': 'px-2.5 py-1 text-xs',
    'md': 'px-3 py-1.5 text-sm',
    'lg': 'px-4 py-2 text-base',
    'xl': 'px-6 py-2.5 sm:text-base md:text-lg',
    '2xl': 'px-8 py-3 sm:text-base md:text-lg',
  }

  const formats: Record<ButtonFormat, string> = {
    block: 'flex justify-center w-full',
    spread: 'flex justify-between w-full',
    default: 'inline-flex justify-center',
  }

  const roundedSizeMap: Record<StandardSize, string> = {
    'xxs': 'rounded-md',
    'xs': 'rounded-md',
    'sm': 'rounded-md',
    'md': 'rounded-lg',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
  }

  const shadows: Record<ButtonShadow, string> = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  }

  const hoverClasses = !disabled && hover ? (themes[theme]?.[design]?.hover) : ''

  const fontWeights: Record<ButtonFontWeight, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const themeClasses = themes[theme]?.[design] || themes.default[design]

  const borderClassList = {
    none: '',
    normal: `border ${themeClasses.border || ''}`,
    thick: `border-2 ${themeClasses.border || ''}`,
  }

  const borderClass = theme === 'naked' ? '' : borderClassList[border]

  const classNames = [
    baseClasses,
    themeClasses.base || '',
    borderClass,
    hoverClasses,
    sizes[size],
    formats[format],
    rounding === 'none' ? 'rounded-none' : rounding === 'full' ? 'rounded-full' : roundedSizeMap[size],
    shadows[shadow],
    fontWeights[fontWeight],
    disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
  ]

  return {
    buttonClasses: classNames.filter(Boolean).join(' '),
    iconClasses: themeClasses.icon || '',
  }
}
