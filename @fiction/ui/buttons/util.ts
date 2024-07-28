import type { ColorThemeUser, StandardSize } from '@fiction/core'
import { z } from 'zod'

export const ButtonFormatSchema = z.enum(['block', 'spread', 'default'])
export const ButtonDesignSchema = z.enum(['solid', 'ghost', 'outline', 'textOnly'])
export const ButtonRoundingSchema = z.enum(['none', 'md', 'full'])
export const ButtonHoverSchema = z.enum(['none', 'basic', 'rise', 'fade', 'slide', 'pop'])
export const ButtonShadowSchema = z.enum(['none', 'sm', 'md', 'lg'])
export const ButtonFontWeightSchema = z.enum(['normal', 'medium', 'semibold', 'bold'])
export const ButtonBorderSchema = z.enum(['none', 'normal', 'thick'])

// Inferred types
export type ButtonFormat = z.infer<typeof ButtonFormatSchema>
export type ButtonDesign = z.infer<typeof ButtonDesignSchema>
export type ButtonRounding = z.infer<typeof ButtonRoundingSchema>
export type ButtonHover = z.infer<typeof ButtonHoverSchema>
export type ButtonShadow = z.infer<typeof ButtonShadowSchema>
export type ButtonFontWeight = z.infer<typeof ButtonFontWeightSchema>
export type ButtonBorder = z.infer<typeof ButtonBorderSchema>

const THEMES: Record<ColorThemeUser, Record<ButtonDesign, { base: string, border: string, hover: string, icon: string }>> = {
  overlay: {
    solid: {
      base: 'bg-white/30 text-white',
      border: 'border-white',
      hover: 'hover:bg-white/20 ',
      icon: 'text-white',
    },
    ghost: {
      base: 'bg-white/20 text-white-900 ',
      border: 'border-white/40',
      hover: 'hover:bg-white/40',
      icon: 'text-white-900/80 ',
    },
    outline: {
      base: 'bg-white/10 text-white',
      border: 'border-white',
      hover: 'hover:border-white/80',
      icon: 'text-white',
    },
    textOnly: {
      base: 'bg-transparent text-white',
      border: 'border-transparent',
      hover: 'hover:text-white/70',
      icon: 'text-white',
    },
  },
  primary: {
    solid: {
      base: 'bg-primary-500 dark:bg-primary-700/70 text-primary-0 dark:text-primary-50',
      border: 'border-primary-500 dark:border-primary-600',
      hover: 'hover:bg-primary-600 dark:hover:bg-primary-800',
      icon: 'text-primary-0 dark:text-primary-50',
    },
    ghost: {
      base: 'bg-primary-100 dark:bg-primary-800/20 text-primary-900 dark:text-primary-100',
      border: 'border-primary-100 dark:border-primary-800/20',
      hover: 'hover:bg-primary-200 dark:hover:bg-primary-800/40',
      icon: 'text-primary-500 dark:text-primary-500',
    },
    outline: {
      base: 'bg-transparent text-primary-700 dark:text-primary-50',
      border: 'border-primary-500 dark:border-primary-600',
      hover: 'hover:bg-primary-500/10 dark:hover:bg-primary-400/10',
      icon: 'text-primary-700 dark:text-primary-0',
    },
    textOnly: {
      base: 'bg-transparent text-primary-600 dark:text-primary-400',
      border: 'border-transparent',
      hover: 'hover:text-primary-700 dark:hover:text-primary-300',
      icon: 'text-primary-600 dark:text-primary-400',
    },
  },
  theme: {
    solid: {
      base: 'bg-theme-500 dark:bg-theme-600/70 text-theme-50 dark:text-theme-50',
      border: 'border-theme-500 dark:border-theme-600',
      hover: 'hover:bg-theme-600 dark:hover:bg-theme-800',
      icon: 'text-theme-50 dark:text-theme-50',
    },
    ghost: {
      base: 'bg-theme-100 dark:bg-theme-600/50 text-theme-900 dark:text-theme-100',
      border: 'border-theme-100 dark:border-theme-800/20',
      hover: 'hover:bg-theme-200 dark:hover:bg-theme-600/40',
      icon: 'text-theme-500 dark:text-theme-500',
    },
    outline: {
      base: 'bg-transparent text-theme-500 dark:text-theme-50',
      border: 'border-theme-500 dark:border-theme-600',
      hover: 'hover:bg-theme-500/10 dark:hover:bg-theme-400/10',
      icon: 'text-theme-500 dark:text-theme-50',
    },
    textOnly: {
      base: 'bg-transparent text-theme-600 dark:text-theme-400',
      border: 'border-transparent',
      hover: 'hover:text-theme-700 dark:hover:text-theme-300',
      icon: 'text-theme-600 dark:text-theme-400',
    },
  },
  default: {
    solid: {
      base: 'bg-theme-500 dark:bg-theme-700/40 text-theme-50 dark:text-theme-50',
      border: 'border-theme-500 dark:border-theme-600',
      hover: 'hover:bg-theme-600 dark:hover:bg-theme-700/80',
      icon: 'text-theme-50 dark:text-theme-50',
    },
    ghost: {
      base: 'bg-theme-100 dark:bg-theme-600/30 text-theme-700 dark:text-theme-50',
      border: 'border-theme-100 dark:border-theme-800/20',
      hover: 'hover:bg-theme-200 dark:hover:bg-theme-600/50',
      icon: 'text-theme-500 dark:text-theme-500',
    },
    outline: {
      base: 'bg-transparent text-theme-700 dark:text-theme-50',
      border: 'border-theme-500 dark:border-theme-600',
      hover: 'hover:bg-theme-500/10 dark:hover:bg-theme-400/10',
      icon: 'text-theme-700 dark:text-theme-400',
    },
    textOnly: {
      base: 'bg-transparent text-theme-600 dark:text-theme-400',
      border: 'border-transparent',
      hover: 'hover:text-theme-700 dark:hover:text-theme-300',
      icon: 'text-theme-600 dark:text-theme-400',
    },
  },
  green: {
    solid: {
      base: 'bg-green-600 dark:bg-green-700/70 text-green-50 dark:text-green-50',
      border: 'border-green-500 dark:border-green-600',
      hover: 'hover:bg-green-600 dark:hover:bg-green-800',
      icon: 'text-green-50 dark:text-green-50',
    },
    ghost: {
      base: 'bg-green-100 dark:bg-green-800/20 text-green-900 dark:text-green-100',
      border: 'border-green-100 dark:border-green-800/20',
      hover: 'hover:bg-green-200 dark:hover:bg-green-800/40',
      icon: 'text-green-500 dark:text-green-500',
    },
    outline: {
      base: 'bg-transparent text-green-500 dark:text-green-50',
      border: 'border-green-500 dark:border-green-600',
      hover: 'hover:bg-green-500/10 dark:hover:bg-green-400/10',
      icon: 'text-green-500 dark:text-green-50',
    },
    textOnly: {
      base: 'bg-transparent text-green-600 dark:text-green-400',
      border: 'border-transparent',
      hover: 'hover:text-green-700 dark:hover:text-green-300',
      icon: 'text-green-600 dark:text-green-400',
    },
  },
  orange: {
    solid: {
      base: 'bg-orange-500 dark:bg-orange-700/70 text-orange-50 dark:text-orange-50',
      border: 'border-orange-500 dark:border-orange-600',
      hover: 'hover:bg-orange-600 dark:hover:bg-orange-800',
      icon: 'text-orange-50 dark:text-orange-50',
    },
    ghost: {
      base: 'bg-orange-100 dark:bg-orange-800/20 text-orange-900 dark:text-orange-100',
      border: 'border-orange-100 dark:border-orange-800/20',
      hover: 'hover:bg-orange-200 dark:hover:bg-orange-800/40',
      icon: 'text-orange-500 dark:text-orange-500',
    },
    outline: {
      base: 'bg-transparent text-orange-500 dark:text-orange-50',
      border: 'border-orange-500 dark:border-orange-600',
      hover: 'hover:bg-orange-500/10 dark:hover:bg-orange-400/10',
      icon: 'text-orange-500 dark:text-orange-50',
    },
    textOnly: {
      base: 'bg-transparent text-orange-600 dark:text-orange-400',
      border: 'border-transparent',
      hover: 'hover:text-orange-700 dark:hover:text-orange-300',
      icon: 'text-orange-600 dark:text-orange-400',
    },
  },
  rose: {
    solid: {
      base: 'bg-rose-500 dark:bg-rose-700/70 text-rose-50 dark:text-rose-50',
      border: 'border-rose-500 dark:border-rose-600',
      hover: 'hover:bg-rose-600 dark:hover:bg-rose-800',
      icon: 'text-rose-50 dark:text-rose-50',
    },
    ghost: {
      base: 'bg-rose-100 dark:bg-rose-800/20 text-rose-900 dark:text-rose-100',
      border: 'border-rose-100 dark:border-rose-800/20',
      hover: 'hover:bg-rose-200 dark:hover:bg-rose-800/40',
      icon: 'text-rose-500 dark:text-rose-500',
    },
    outline: {
      base: 'bg-transparent text-rose-500 dark:text-rose-50',
      border: 'border-rose-500 dark:border-rose-600',
      hover: 'hover:bg-rose-500/10 dark:hover:bg-rose-400/10',
      icon: 'text-rose-500 dark:text-rose-50',
    },
    textOnly: {
      base: 'bg-transparent text-rose-600 dark:text-rose-400',
      border: 'border-transparent',
      hover: 'hover:text-rose-700 dark:hover:text-rose-300',
      icon: 'text-rose-600 dark:text-rose-400',
    },
  },
  indigo: {
    solid: {
      base: 'bg-indigo-500 dark:bg-indigo-700/70 text-indigo-50 dark:text-indigo-50',
      border: 'border-indigo-500 dark:border-indigo-600',
      hover: 'hover:bg-indigo-600 dark:hover:bg-indigo-800',
      icon: 'text-indigo-50 dark:text-indigo-50',
    },
    ghost: {
      base: 'bg-indigo-100 dark:bg-indigo-800/20 text-indigo-900 dark:text-indigo-100',
      border: 'border-indigo-100 dark:border-indigo-800/20',
      hover: 'hover:bg-indigo-200 dark:hover:bg-indigo-800/40',
      icon: 'text-indigo-500 dark:text-indigo-500',
    },
    outline: {
      base: 'bg-transparent text-indigo-500 dark:text-indigo-50',
      border: 'border-indigo-500 dark:border-indigo-600',
      hover: 'hover:bg-indigo-500/10 dark:hover:bg-indigo-400/10',
      icon: 'text-indigo-500 dark:text-indigo-50',
    },
    textOnly: {
      base: 'bg-transparent text-indigo-600 dark:text-indigo-400',
      border: 'border-transparent',
      hover: 'hover:text-indigo-700 dark:hover:text-indigo-300',
      icon: 'text-indigo-600 dark:text-indigo-400',
    },
  },
  sky: {
    solid: {
      base: 'bg-sky-500 dark:bg-sky-700/70 text-sky-50 dark:text-sky-50',
      border: 'border-sky-500 dark:border-sky-600',
      hover: 'hover:bg-sky-600 dark:hover:bg-sky-800',
      icon: 'text-sky-50 dark:text-sky-50',
    },
    ghost: {
      base: 'bg-sky-100 dark:bg-sky-800/20 text-sky-900 dark:text-sky-100',
      border: 'border-sky-100 dark:border-sky-800/20',
      hover: 'hover:bg-sky-200 dark:hover:bg-sky-800/40',
      icon: 'text-sky-500 dark:text-sky-500',
    },
    outline: {
      base: 'bg-transparent text-sky-500 dark:text-sky-50',
      border: 'border-sky-500 dark:border-sky-600',
      hover: 'hover:bg-sky-500/10 dark:hover:bg-sky-400/10',
      icon: 'text-sky-500 dark:text-sky-50',
    },
    textOnly: {
      base: 'bg-transparent text-sky-600 dark:text-sky-400',
      border: 'border-transparent',
      hover: 'hover:text-sky-700 dark:hover:text-sky-300',
      icon: 'text-sky-600 dark:text-sky-400',
    },
  },
  teal: {
    solid: {
      base: 'bg-teal-500 dark:bg-teal-700/70 text-teal-50 dark:text-teal-50',
      border: 'border-teal-500 dark:border-teal-600',
      hover: 'hover:bg-teal-600 dark:hover:bg-teal-800',
      icon: 'text-teal-50 dark:text-teal-50',
    },
    ghost: {
      base: 'bg-teal-100 dark:bg-teal-800/20 text-teal-900 dark:text-teal-100',
      border: 'border-teal-100 dark:border-teal-800/20',
      hover: 'hover:bg-teal-200 dark:hover:bg-teal-800/40',
      icon: 'text-teal-500 dark:text-teal-500',
    },
    outline: {
      base: 'bg-transparent text-teal-500 dark:text-teal-50',
      border: 'border-teal-500 dark:border-teal-600',
      hover: 'hover:bg-teal-500/10 dark:hover:bg-teal-400/10',
      icon: 'text-teal-500 dark:text-teal-50',
    },
    textOnly: {
      base: 'bg-transparent text-teal-600 dark:text-teal-400',
      border: 'border-transparent',
      hover: 'hover:text-teal-700 dark:hover:text-teal-300',
      icon: 'text-teal-600 dark:text-teal-400',
    },
  },
  blue: {
    solid: {
      base: 'bg-blue-500 dark:bg-blue-700/70 text-blue-50 dark:text-blue-50',
      border: 'border-blue-500 dark:border-blue-600',
      hover: 'hover:bg-blue-600 dark:hover:bg-blue-800',
      icon: 'text-blue-50 dark:text-blue-50',
    },
    ghost: {
      base: 'bg-blue-100 dark:bg-blue-800/20 text-blue-900 dark:text-blue-100',
      border: 'border-blue-100 dark:border-blue-800/20',
      hover: 'hover:bg-blue-200 dark:hover:bg-blue-800/40',
      icon: 'text-blue-500 dark:text-blue-500',
    },
    outline: {
      base: 'bg-transparent text-blue-500 dark:text-blue-50',
      border: 'border-blue-500 dark:border-blue-600',
      hover: 'hover:bg-blue-500/10 dark:hover:bg-blue-400/10',
      icon: 'text-blue-500 dark:text-blue-50',
    },
    textOnly: {
      base: 'bg-transparent text-blue-600 dark:text-blue-400',
      border: 'border-transparent',
      hover: 'hover:text-blue-700 dark:hover:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
    },
  },
  purple: {
    solid: {
      base: 'bg-purple-500 dark:bg-purple-700/70 text-purple-50 dark:text-purple-50',
      border: 'border-purple-500 dark:border-purple-600',
      hover: 'hover:bg-purple-600 dark:hover:bg-purple-800',
      icon: 'text-purple-50 dark:text-purple-50',
    },
    ghost: {
      base: 'bg-purple-100 dark:bg-purple-800/20 text-purple-900 dark:text-purple-100',
      border: 'border-purple-100 dark:border-purple-800/20',
      hover: 'hover:bg-purple-200 dark:hover:bg-purple-800/40',
      icon: 'text-purple-500 dark:text-purple-500',
    },
    outline: {
      base: 'bg-transparent text-purple-500 dark:text-purple-50',
      border: 'border-purple-500 dark:border-purple-600',
      hover: 'hover:bg-purple-500/10 dark:hover:bg-purple-400/10',
      icon: 'text-purple-500 dark:text-purple-50',
    },
    textOnly: {
      base: 'bg-transparent text-purple-600 dark:text-purple-400',
      border: 'border-transparent',
      hover: 'hover:text-purple-700 dark:hover:text-purple-300',
      icon: 'text-purple-600 dark:text-purple-400',
    },
  },
  yellow: {
    solid: {
      base: 'bg-yellow-500 dark:bg-yellow-700/70 text-yellow-50 dark:text-yellow-50',
      border: 'border-yellow-500 dark:border-yellow-600',
      hover: 'hover:bg-yellow-600 dark:hover:bg-yellow-800',
      icon: 'text-yellow-50 dark:text-yellow-50',
    },
    ghost: {
      base: 'bg-yellow-100 dark:bg-yellow-800/20 text-yellow-900 dark:text-yellow-100',
      border: 'border-yellow-100 dark:border-yellow-800/20',
      hover: 'hover:bg-yellow-200 dark:hover:bg-yellow-800/40',
      icon: 'text-yellow-500 dark:text-yellow-500',
    },
    outline: {
      base: 'bg-transparent text-yellow-500 dark:text-yellow-50',
      border: 'border-yellow-500 dark:border-yellow-600',
      hover: 'hover:bg-yellow-500/10 dark:hover:bg-yellow-400/10',
      icon: 'text-yellow-500 dark:text-yellow-50',
    },
    textOnly: {
      base: 'bg-transparent text-yellow-600 dark:text-yellow-400',
      border: 'border-transparent',
      hover: 'hover:text-yellow-700 dark:hover:text-yellow-300',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
  },
  amber: {
    solid: {
      base: 'bg-amber-500 dark:bg-amber-700/70 text-amber-50 dark:text-amber-50',
      border: 'border-amber-500 dark:border-amber-600',
      hover: 'hover:bg-amber-600 dark:hover:bg-amber-800',
      icon: 'text-amber-50 dark:text-amber-50',
    },
    ghost: {
      base: 'bg-amber-100 dark:bg-amber-800/20 text-amber-900 dark:text-amber-100',
      border: 'border-amber-100 dark:border-amber-800/20',
      hover: 'hover:bg-amber-200 dark:hover:bg-amber-800/40',
      icon: 'text-amber-500 dark:text-amber-500',
    },
    outline: {
      base: 'bg-transparent text-amber-500 dark:text-amber-50',
      border: 'border-amber-500 dark:border-amber-600',
      hover: 'hover:bg-amber-500/10 dark:hover:bg-amber-400/10',
      icon: 'text-amber-500 dark:text-amber-50',
    },
    textOnly: {
      base: 'bg-transparent text-amber-600 dark:text-amber-400',
      border: 'border-transparent',
      hover: 'hover:text-amber-700 dark:hover:text-amber-300',
      icon: 'text-amber-600 dark:text-amber-400',
    },
  },
  fuchsia: {
    solid: {
      base: 'bg-fuchsia-500 dark:bg-fuchsia-700/70 text-fuchsia-50 dark:text-fuchsia-50',
      border: 'border-fuchsia-500 dark:border-fuchsia-600',
      hover: 'hover:bg-fuchsia-600 dark:hover:bg-fuchsia-800',
      icon: 'text-fuchsia-50 dark:text-fuchsia-50',
    },
    ghost: {
      base: 'bg-fuchsia-100 dark:bg-fuchsia-800/20 text-fuchsia-900 dark:text-fuchsia-100',
      border: 'border-fuchsia-100 dark:border-fuchsia-800/20',
      hover: 'hover:bg-fuchsia-200 dark:hover:bg-fuchsia-800/40',
      icon: 'text-fuchsia-500 dark:text-fuchsia-500',
    },
    outline: {
      base: 'bg-transparent text-fuchsia-500 dark:text-fuchsia-50',
      border: 'border-fuchsia-500 dark:border-fuchsia-600',
      hover: 'hover:bg-fuchsia-500/10 dark:hover:bg-fuchsia-400/10',
      icon: 'text-fuchsia-500 dark:text-fuchsia-50',
    },
    textOnly: {
      base: 'bg-transparent text-fuchsia-600 dark:text-fuchsia-400',
      border: 'border-transparent',
      hover: 'hover:text-fuchsia-700 dark:hover:text-fuchsia-300',
      icon: 'text-fuchsia-600 dark:text-fuchsia-400',
    },
  },
  slate: {
    solid: {
      base: 'bg-slate-500 dark:bg-slate-700/70 text-slate-50 dark:text-slate-50',
      border: 'border-slate-500 dark:border-slate-600',
      hover: 'hover:bg-slate-600 dark:hover:bg-slate-800',
      icon: 'text-slate-50 dark:text-slate-50',
    },
    ghost: {
      base: 'bg-slate-100 dark:bg-slate-600/20 text-slate-900 dark:text-slate-100',
      border: 'border-slate-100 dark:border-slate-800/20',
      hover: 'hover:bg-slate-200 dark:hover:bg-slate-600/40',
      icon: 'text-slate-500 dark:text-slate-500',
    },
    outline: {
      base: 'bg-transparent text-slate-500 dark:text-slate-50',
      border: 'border-slate-500 dark:border-slate-600',
      hover: 'hover:bg-slate-500/10 dark:hover:bg-slate-400/10',
      icon: 'text-slate-500 dark:text-slate-50',
    },
    textOnly: {
      base: 'bg-transparent text-slate-600 dark:text-slate-400',
      border: 'border-transparent',
      hover: 'hover:text-slate-700 dark:hover:text-slate-300',
      icon: 'text-slate-600 dark:text-slate-400',
    },
  },
  gray: {
    solid: {
      base: 'bg-gray-500 dark:bg-gray-700/70 text-gray-50 dark:text-gray-50',
      border: 'border-gray-500 dark:border-gray-600',
      hover: 'hover:bg-gray-600 dark:hover:bg-gray-800',
      icon: 'text-gray-50 dark:text-gray-50',
    },
    ghost: {
      base: 'bg-gray-100 dark:bg-gray-600/20 text-gray-900 dark:text-gray-100',
      border: 'border-gray-100 dark:border-gray-800/20',
      hover: 'hover:bg-gray-200 dark:hover:bg-gray-600/40',
      icon: 'text-gray-500 dark:text-gray-500',
    },
    outline: {
      base: 'bg-transparent text-gray-500 dark:text-gray-50',
      border: 'border-gray-500 dark:border-gray-600',
      hover: 'hover:bg-gray-500/10 dark:hover:bg-gray-400/10',
      icon: 'text-gray-500 dark:text-gray-50',
    },
    textOnly: {
      base: 'bg-transparent text-gray-600 dark:text-gray-400',
      border: 'border-transparent',
      hover: 'hover:text-gray-700 dark:hover:text-gray-300',
      icon: 'text-gray-600 dark:text-gray-400',
    },
  },
  zinc: {
    solid: {
      base: 'bg-zinc-500 dark:bg-zinc-700/70 text-zinc-50 dark:text-zinc-50',
      border: 'border-zinc-500 dark:border-zinc-600',
      hover: 'hover:bg-zinc-600 dark:hover:bg-zinc-800',
      icon: 'text-zinc-50 dark:text-zinc-50',
    },
    ghost: {
      base: 'bg-zinc-100 dark:bg-zinc-600/20 text-zinc-900 dark:text-zinc-100',
      border: 'border-zinc-100 dark:border-zinc-800/20',
      hover: 'hover:bg-zinc-200 dark:hover:bg-zinc-600/40',
      icon: 'text-zinc-500 dark:text-zinc-500',
    },
    outline: {
      base: 'bg-transparent text-zinc-500 dark:text-zinc-50',
      border: 'border-zinc-500 dark:border-zinc-600',
      hover: 'hover:bg-zinc-500/10 dark:hover:bg-zinc-400/10',
      icon: 'text-zinc-500 dark:text-zinc-50',
    },
    textOnly: {
      base: 'bg-transparent text-zinc-600 dark:text-zinc-400',
      border: 'border-transparent',
      hover: 'hover:text-zinc-700 dark:hover:text-zinc-300',
      icon: 'text-zinc-600 dark:text-zinc-400',
    },
  },
  neutral: {
    solid: {
      base: 'bg-neutral-500 dark:bg-neutral-700/70 text-neutral-50 dark:text-neutral-50',
      border: 'border-neutral-500 dark:border-neutral-600',
      hover: 'hover:bg-neutral-600 dark:hover:bg-neutral-800',
      icon: 'text-neutral-50 dark:text-neutral-50',
    },
    ghost: {
      base: 'bg-neutral-100 dark:bg-neutral-600/20 text-neutral-900 dark:text-neutral-100',
      border: 'border-neutral-100 dark:border-neutral-800/20',
      hover: 'hover:bg-neutral-200 dark:hover:bg-neutral-600/40',
      icon: 'text-neutral-500 dark:text-neutral-500',
    },
    outline: {
      base: 'bg-transparent text-neutral-500 dark:text-neutral-50',
      border: 'border-neutral-500 dark:border-neutral-600',
      hover: 'hover:bg-neutral-500/10 dark:hover:bg-neutral-400/10',
      icon: 'text-neutral-500 dark:text-neutral-50',
    },
    textOnly: {
      base: 'bg-transparent text-neutral-600 dark:text-neutral-400',
      border: 'border-transparent',
      hover: 'hover:text-neutral-700 dark:hover:text-neutral-300',
      icon: 'text-neutral-600 dark:text-neutral-400',
    },
  },
  stone: {
    solid: {
      base: 'bg-stone-500 dark:bg-stone-700/70 text-stone-50 dark:text-stone-50',
      border: 'border-stone-500 dark:border-stone-600',
      hover: 'hover:bg-stone-600 dark:hover:bg-stone-800',
      icon: 'text-stone-50 dark:text-stone-50',
    },
    ghost: {
      base: 'bg-stone-100 dark:bg-stone-600/20 text-stone-900 dark:text-stone-100',
      border: 'border-stone-100 dark:border-stone-800/20',
      hover: 'hover:bg-stone-200 dark:hover:bg-stone-600/40',
      icon: 'text-stone-500 dark:text-stone-500',
    },
    outline: {
      base: 'bg-transparent text-stone-500 dark:text-stone-50',
      border: 'border-stone-500 dark:border-stone-600',
      hover: 'hover:bg-stone-500/10 dark:hover:bg-stone-400/10',
      icon: 'text-stone-500 dark:text-stone-50',
    },
    textOnly: {
      base: 'bg-transparent text-stone-600 dark:text-stone-400',
      border: 'border-transparent',
      hover: 'hover:text-stone-700 dark:hover:text-stone-300',
      icon: 'text-stone-600 dark:text-stone-400',
    },
  },
  black: {
    solid: {
      base: 'bg-black dark:bg-black/70 text-white dark:text-white',
      border: 'border-black dark:border-black',
      hover: 'hover:bg-gray-900 dark:hover:bg-gray-900',
      icon: 'text-white dark:text-white',
    },
    ghost: {
      base: 'bg-gray-100 dark:bg-gray-800/20 text-black dark:text-white',
      border: 'border-gray-100 dark:border-gray-800/20',
      hover: 'hover:bg-gray-200 dark:hover:bg-gray-800/40',
      icon: 'text-black dark:text-white',
    },
    outline: {
      base: 'bg-transparent text-black dark:text-white',
      border: 'border-black dark:border-white',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
      icon: 'text-black dark:text-white',
    },
    textOnly: {
      base: 'bg-transparent text-black-600 dark:text-black-400',
      border: 'border-transparent',
      hover: 'hover:text-black-700 dark:hover:text-black-300',
      icon: 'text-black-600 dark:text-black-400',
    },
  },
  white: {
    solid: {
      base: 'bg-gray-100/50 dark:bg-white/90 text-gray-900 dark:text-black',
      border: 'border-gray-100 dark:border-white',
      hover: 'hover:bg-gray-100/70 dark:hover:bg-gray-100',
      icon: 'text-black dark:text-black',
    },
    ghost: {
      base: 'bg-gray-100/50 dark:bg-white/10 text-gray-900 dark:text-white',
      border: 'border-white/20 dark:border-white/20',
      hover: 'hover:bg-white/40 dark:hover:bg-white/20',
      icon: 'text-gray-900/80 dark:text-white',
    },
    outline: {
      base: 'bg-transparent text-gray-900 dark:text-white',
      border: 'border-gray-200 dark:border-white',
      hover: 'hover:border-gray-300 dark:hover:bg-gray-100',
      icon: 'text-gray-900 dark:text-white',
    },
    textOnly: {
      base: 'bg-transparent text-white',
      border: 'border-transparent',
      hover: 'hover:text-white/70',
      icon: 'text-white',
    },
  },

  red: {
    solid: {
      base: 'bg-red-500 dark:bg-red-700/70 text-red-50 dark:text-red-50',
      border: 'border-red-500 dark:border-red-600',
      hover: 'hover:bg-red-600 dark:hover:bg-red-800',
      icon: 'text-red-50 dark:text-red-50',
    },
    ghost: {
      base: 'bg-red-100 dark:bg-red-800/20 text-red-900 dark:text-red-100',
      border: 'border-red-100 dark:border-red-800/20',
      hover: 'hover:bg-red-200 dark:hover:bg-red-800/40',
      icon: 'text-red-500 dark:text-red-500',
    },
    outline: {
      base: 'bg-transparent text-red-500 dark:text-red-50',
      border: 'border-red-500 dark:border-red-600',
      hover: 'hover:bg-red-500/10 dark:hover:bg-red-400/10',
      icon: 'text-red-500 dark:text-red-50',
    },
    textOnly: {
      base: 'bg-transparent text-red-600 dark:text-red-400',
      border: 'border-transparent',
      hover: 'hover:text-red-700 dark:hover:text-red-300',
      icon: 'text-red-600 dark:text-red-400',
    },
  },
  lime: {
    solid: {
      base: 'bg-lime-500 dark:bg-lime-700/70 text-lime-50 dark:text-lime-50',
      border: 'border-lime-500 dark:border-lime-600',
      hover: 'hover:bg-lime-600 dark:hover:bg-lime-800',
      icon: 'text-lime-50 dark:text-lime-50',
    },
    ghost: {
      base: 'bg-lime-100 dark:bg-lime-800/20 text-lime-900 dark:text-lime-100',
      border: 'border-lime-100 dark:border-lime-800/20',
      hover: 'hover:bg-lime-200 dark:hover:bg-lime-800/40',
      icon: 'text-lime-500 dark:text-lime-500',
    },
    outline: {
      base: 'bg-transparent text-lime-500 dark:text-lime-50',
      border: 'border-lime-500 dark:border-lime-600',
      hover: 'hover:bg-lime-500/10 dark:hover:bg-lime-400/10',
      icon: 'text-lime-500 dark:text-lime-50',
    },
    textOnly: {
      base: 'bg-transparent text-lime-600 dark:text-lime-400',
      border: 'border-transparent',
      hover: 'hover:text-lime-700 dark:hover:text-lime-300',
      icon: 'text-lime-600 dark:text-lime-400',
    },
  },
  emerald: {
    solid: {
      base: 'bg-emerald-500 dark:bg-emerald-700/70 text-emerald-50 dark:text-emerald-50',
      border: 'border-emerald-500 dark:border-emerald-600',
      hover: 'hover:bg-emerald-600 dark:hover:bg-emerald-800',
      icon: 'text-emerald-50 dark:text-emerald-50',
    },
    ghost: {
      base: 'bg-emerald-100 dark:bg-emerald-800/20 text-emerald-900 dark:text-emerald-100',
      border: 'border-emerald-100 dark:border-emerald-800/20',
      hover: 'hover:bg-emerald-200 dark:hover:bg-emerald-800/40',
      icon: 'text-emerald-500 dark:text-emerald-500',
    },
    outline: {
      base: 'bg-transparent text-emerald-500 dark:text-emerald-50',
      border: 'border-emerald-500 dark:border-emerald-600',
      hover: 'hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10',
      icon: 'text-emerald-500 dark:text-emerald-50',
    },
    textOnly: {
      base: 'bg-transparent text-emerald-600 dark:text-emerald-400',
      border: 'border-transparent',
      hover: 'hover:text-emerald-700 dark:hover:text-emerald-300',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
  },
  cyan: {
    solid: {
      base: 'bg-cyan-500 dark:bg-cyan-700/70 text-cyan-50 dark:text-cyan-50',
      border: 'border-cyan-500 dark:border-cyan-600',
      hover: 'hover:bg-cyan-600 dark:hover:bg-cyan-800',
      icon: 'text-cyan-50 dark:text-cyan-50',
    },
    ghost: {
      base: 'bg-cyan-100 dark:bg-cyan-800/20 text-cyan-900 dark:text-cyan-100',
      border: 'border-cyan-100 dark:border-cyan-800/20',
      hover: 'hover:bg-cyan-200 dark:hover:bg-cyan-800/40',
      icon: 'text-cyan-500 dark:text-cyan-500',
    },
    outline: {
      base: 'bg-transparent text-cyan-500 dark:text-cyan-50',
      border: 'border-cyan-500 dark:border-cyan-600',
      hover: 'hover:bg-cyan-500/10 dark:hover:bg-cyan-400/10',
      icon: 'text-cyan-500 dark:text-cyan-50',
    },
    textOnly: {
      base: 'bg-transparent text-cyan-600 dark:text-cyan-400',
      border: 'border-transparent',
      hover: 'hover:text-cyan-700 dark:hover:text-cyan-300',
      icon: 'text-cyan-600 dark:text-cyan-400',
    },
  },
  violet: {
    solid: {
      base: 'bg-violet-500 dark:bg-violet-700/70 text-violet-50 dark:text-violet-50',
      border: 'border-violet-500 dark:border-violet-600',
      hover: 'hover:bg-violet-600 dark:hover:bg-violet-800',
      icon: 'text-violet-50 dark:text-violet-50',
    },
    ghost: {
      base: 'bg-violet-100 dark:bg-violet-800/20 text-violet-900 dark:text-violet-100',
      border: 'border-violet-100 dark:border-violet-800/20',
      hover: 'hover:bg-violet-200 dark:hover:bg-violet-800/40',
      icon: 'text-violet-500 dark:text-violet-500',
    },
    outline: {
      base: 'bg-transparent text-violet-500 dark:text-violet-50',
      border: 'border-violet-500 dark:border-violet-600',
      hover: 'hover:bg-violet-500/10 dark:hover:bg-violet-400/10',
      icon: 'text-violet-500 dark:text-violet-50',
    },
    textOnly: {
      base: 'bg-transparent text-violet-600 dark:text-violet-400',
      border: 'border-transparent',
      hover: 'hover:text-violet-700 dark:hover:text-violet-300',
      icon: 'text-violet-600 dark:text-violet-400',
    },
  },
  pink: {
    solid: {
      base: 'bg-pink-500 dark:bg-pink-700/70 text-pink-50 dark:text-pink-50',
      border: 'border-pink-500 dark:border-pink-600',
      hover: 'hover:bg-pink-600 dark:hover:bg-pink-800',
      icon: 'text-pink-50 dark:text-pink-50',
    },
    ghost: {
      base: 'bg-pink-100 dark:bg-pink-800/20 text-pink-900 dark:text-pink-100',
      border: 'border-pink-100 dark:border-pink-800/20',
      hover: 'hover:bg-pink-200 dark:hover:bg-pink-800/40',
      icon: 'text-pink-500 dark:text-pink-500',
    },
    outline: {
      base: 'bg-transparent text-pink-500 dark:text-pink-50',
      border: 'border-pink-500 dark:border-pink-600',
      hover: 'hover:bg-pink-500/10 dark:hover:bg-pink-400/10',
      icon: 'text-pink-500 dark:text-pink-50',
    },
    textOnly: {
      base: 'bg-transparent text-pink-600 dark:text-pink-400',
      border: 'border-transparent',
      hover: 'hover:text-pink-700 dark:hover:text-pink-300',
      icon: 'text-pink-600 dark:text-pink-400',
    },
  },

}
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

  const baseClasses = 'relative overflow-hidden max-w-full select-none items-center font-sans focus:outline-none antialiased'

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

  const hoverClasses = !disabled && hover ? (THEMES[theme]?.[design]?.hover || THEMES.default[design]?.hover) : ''

  const fontWeights: Record<ButtonFontWeight, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const themeClasses = THEMES[theme]?.[design] || THEMES.default[design]

  const borderClasses = {
    none: '',
    normal: `border ${themeClasses.border}`,
    thick: `border-2 ${themeClasses.border}`,
  }

  const classNames = [
    baseClasses,
    themeClasses.base,
    borderClasses[border],
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
    iconClasses: themeClasses.icon,
  }
}
