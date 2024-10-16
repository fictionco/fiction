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
  padding?: string
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
    padding,
  } = args

  const baseClasses = 'relative overflow-hidden max-w-full select-none items-center font-sans focus:outline-none antialiased leading-[1.2]'

  const sizes: Record<StandardSize, string> = {
    'xxs': 'text-[9px]',
    'xs': 'text-[10px]',
    'sm': 'text-xs',
    'md': 'text-sm',
    'lg': 'text-base',
    'xl': 'sm:text-base md:text-lg',
    '2xl': 'sm:text-base md:text-lg',
  }

  const defaultPadding: Record<StandardSize, string> = {
    'xxs': 'px-2 py-0.5',
    'xs': 'px-2 py-1',
    'sm': 'px-2.5 py-1',
    'md': 'px-3 py-1.5',
    'lg': 'px-4 py-2',
    'xl': 'px-6 py-2.5',
    '2xl': 'px-8 py-3',
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

  const hoverClasses = !disabled && hover && hover !== 'none' ? (themes[theme]?.[design]?.hover) : ''

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
    padding || defaultPadding[size],
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
