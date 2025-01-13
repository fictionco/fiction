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

  const paddingConfig: Record<StandardSize, { x: string, y: string }> = {
    'xxs': { x: 'px-2', y: 'py-0.5' },
    'xs': { x: 'px-2', y: 'py-1' },
    'sm': { x: 'px-2', y: '5 py-1' },
    'md': { x: 'px-3', y: 'py-1.5' },
    'lg': { x: 'px-4', y: 'py-2' },
    'xl': { x: 'px-6', y: 'py-2.5' },
    '2xl': { x: 'px-8', y: 'py-3' },
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
    '2xl': 'rounded-xl',
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

  const { x, y } = paddingConfig[size]

  const defaultPadding = design === 'link' ? y : `${y} ${x}`

  const classNames = [
    baseClasses,
    themeClasses.base || '',
    borderClass,
    hoverClasses,
    sizes[size],
    padding || defaultPadding,
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
