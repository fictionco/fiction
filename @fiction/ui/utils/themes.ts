import type { ButtonDesign, ColorThemeUser } from '@fiction/core'

export const themes: Record<ColorThemeUser, Record<ButtonDesign, {
  base?: string
  border?: string
  hover?: string
  icon?: string
  input?: string
}>> = {
  default: {
    solid: {
      base: 'bg-theme-0 dark:bg-theme-700/40 text-theme-600 dark:text-theme-50',
      input: `bg-white dark:bg-theme-800/50
            ring-theme-200 dark:ring-theme-600/70
            focus:ring-theme-600 focus:bg-white
            dark:focus:ring-theme-500 dark:focus:bg-theme-800
            focus-within:ring-theme-600 dark:focus-within:ring-theme-500
            text-theme-900 dark:text-theme-100
            placeholder:text-theme-400 dark:placeholder:text-theme-500`,
      border: 'border-theme-300/80 dark:border-theme-600',
      hover: 'hover:border-theme-300 dark:hover:border-theme-500',
      icon: 'text-theme-600 dark:text-theme-50',
    },
    ghost: {
      base: 'bg-theme-100 dark:bg-theme-600/30 text-theme-700 dark:text-theme-50',
      border: 'border-theme-100 dark:border-theme-800/20',
      hover: 'hover:bg-theme-200 dark:hover:bg-theme-600/50',
      icon: 'text-theme-500 dark:text-theme-500',
    },
    outline: {
      base: 'bg-transparent text-theme-700 dark:text-theme-50',
      border: 'border-theme-500 dark:border-theme-400',
      hover: 'hover:opacity-70',
      icon: 'text-theme-700 dark:text-theme-300',
    },
    link: {
      base: 'bg-transparent text-theme-600 dark:text-theme-50',
      border: 'border-transparent',
      hover: 'hover:opacity-70',
      icon: 'text-theme-600 dark:text-theme-400',
    },
  },
  muted: {
    solid: {
      base: 'bg-gray-100 dark:bg-gray-700/40 text-gray-900 dark:text-gray-50',
      input: `bg-white dark:bg-gray-800/50
            ring-gray-200 dark:ring-gray-600/70
            focus:ring-gray-600 focus:bg-white
            dark:focus:ring-gray-500 dark:focus:bg-gray-800
            focus-within:ring-gray-600 dark:focus-within:ring-gray-500
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500`,
      border: 'border-gray-300/80 dark:border-gray-600',
      hover: 'hover:border-gray-300 dark:hover:border-gray-500',
      icon: 'text-gray-600 dark:text-gray-50',
    },
    ghost: {
      base: 'bg-gray-100 dark:bg-gray-600/30 text-gray-700 dark:text-gray-50',
      border: 'border-gray-100 dark:border-gray-800/20',
      hover: 'hover:bg-gray-200 dark:hover:bg-gray-600/50',
      icon: 'text-gray-500 dark:text-gray-500',
    },
    outline: {
      base: 'bg-transparent text-gray-700 dark:text-gray-50',
      border: 'border-gray-500 dark:border-gray-400',
      hover: 'hover:opacity-70',
      icon: 'text-gray-700 dark:text-gray-300',
    },
    link: {
      base: 'bg-transparent text-gray-600 dark:text-gray-50',
      border: 'border-transparent',
      hover: 'hover:opacity-70',
      icon: 'text-gray-600 dark:text-gray-400',
    },
  },
  overlay: {
    solid: {
      base: 'bg-white/100 text-black backdrop-blur-sm shadow-sm mix-blend-overlay [text-shadow:_0_1px_1px_rgb(255_255_255_/_100%)]',
      border: 'border-white/100',
      input: `bg-white/10 ring-white
            focus:ring-white/90 focus:bg-white/20
            dark:focus:ring-white/70
            text-white
            placeholder:text-white/60`,
      hover: 'hover:bg-white/70 ',
      icon: 'text-black',
    },
    ghost: {
      base: 'bg-white/70 text-black backdrop-blur-sm shadow-sm mix-blend-overlay [text-shadow:_0_1px_1px_rgb(255_255_255_/_100%)]',
      border: 'border-white/100',
      hover: 'hover:bg-white/70 ',
      icon: 'text-black',
    },
    outline: {
      base: 'bg-white/10 text-white backdrop-blur-sm shadow-sm [text-shadow:_0_0.5px_0_rgb(0_0_0_/_40%)]',
      border: 'border-white',
      hover: 'hover:border-white/80',
      icon: 'text-white',
    },
    link: {
      base: 'bg-transparent text-white [text-shadow:_0_0.5px_0_rgb(0_0_0_/_40%)]',
      border: 'border-transparent',
      hover: 'hover:opacity-70',
      icon: 'text-white',
    },
  },
  primary: {
    solid: {
      base: 'bg-primary-500 dark:bg-primary-700/70 text-primary-0 dark:text-primary-50',
      border: 'border-primary-600/80 dark:border-primary-600',
      input: `bg-primary-50 dark:bg-primary-800/20
            ring-primary-500 dark:ring-primary-600/70
            focus:ring-primary-700 focus:bg-primary-50/50
            dark:focus:ring-primary-600 dark:focus:bg-primary-800/40
            text-primary-800 dark:text-primary-0
            placeholder:text-primary-300 dark:placeholder:text-primary-600`,
      hover: 'hover:bg-primary-600 dark:hover:bg-primary-800',
      icon: 'text-primary-0 dark:text-primary-50',
    },
    ghost: {
      base: 'bg-primary-100 dark:bg-primary-800/40 text-primary-900 dark:text-primary-0',
      border: 'border-primary-100 dark:border-primary-800/20',
      hover: 'hover:bg-primary-200 dark:hover:bg-primary-800/60',
      icon: 'text-primary-500 dark:text-primary-500',
    },
    outline: {
      base: 'bg-transparent text-primary-500 dark:text-primary-100',
      border: 'border-primary-500 dark:border-primary-500',
      hover: 'hover:bg-primary-500/10 dark:hover:bg-primary-500/20',
      icon: 'text-primary-700 dark:text-primary-100',
    },
    link: {
      base: 'bg-transparent text-primary-600 dark:text-primary-400',
      border: 'border-transparent',
      hover: 'hover:opacity-70',
      icon: 'text-primary-600 dark:text-primary-400',
    },
  },
  theme: {
    solid: {
      base: 'bg-theme-500 dark:bg-theme-600/70 text-theme-0 dark:text-theme-0',
      border: 'border-theme-600/80 dark:border-theme-600',
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
      base: 'bg-transparent text-theme-500 dark:text-theme-300',
      border: 'border-theme-500 dark:border-theme-400',
      hover: 'hover:bg-theme-500/10 dark:hover:bg-theme-400/20',
      icon: 'text-theme-500 dark:text-theme-300',
    },
    link: {
      base: 'bg-transparent text-theme-600 dark:text-theme-400',
      border: 'border-transparent',
      hover: 'hover:opacity-70',
      icon: 'text-theme-600 dark:text-theme-400',
    },
  },

  green: {
    solid: {
      base: 'bg-green-600 dark:bg-green-700/70 text-green-50 dark:text-green-50',
      border: 'border-green-700 dark:border-green-600',
      hover: 'hover:bg-green-700 dark:hover:bg-green-800',
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
    link: {
      base: 'bg-transparent text-green-600 dark:text-green-400',
      border: 'border-transparent',
      hover: 'hover:opacity-70',
      icon: 'text-green-600 dark:text-green-400',
    },
  },
  orange: {
    solid: {
      base: 'bg-orange-500 dark:bg-orange-700/70 text-orange-50 dark:text-orange-50',
      border: 'border-orange-600/80 dark:border-orange-600',
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
    link: {
      base: 'bg-transparent text-orange-600 dark:text-orange-400',
      border: 'border-transparent',
      hover: 'hover:opacity-70',
      icon: 'text-orange-600 dark:text-orange-400',
    },
  },
  rose: {
    solid: {
      base: 'bg-rose-500 dark:bg-rose-700/70 text-rose-50 dark:text-rose-50',
      border: 'border-rose-600/80 dark:border-rose-600',
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
    link: {
      base: 'bg-transparent text-rose-600 dark:text-rose-400',
      border: 'border-transparent',
      hover: 'hover:opacity-70',
      icon: 'text-rose-600 dark:text-rose-400',
    },
  },
  indigo: {
    solid: {
      base: 'bg-indigo-500 dark:bg-indigo-700/70 text-indigo-50 dark:text-indigo-50',
      border: 'border-indigo-600/80 dark:border-indigo-600',
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
    link: {
      base: 'bg-transparent text-indigo-600 dark:text-indigo-400',
      border: 'border-transparent',
      hover: 'hover:text-indigo-700 dark:hover:text-indigo-300',
      icon: 'text-indigo-600 dark:text-indigo-400',
    },
  },
  sky: {
    solid: {
      base: 'bg-sky-500 dark:bg-sky-700/70 text-sky-50 dark:text-sky-50',
      border: 'border-sky-600/80 dark:border-sky-600',
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
    link: {
      base: 'bg-transparent text-sky-600 dark:text-sky-400',
      border: 'border-transparent',
      hover: 'hover:opacity-70',
      icon: 'text-sky-600 dark:text-sky-400',
    },
  },
  teal: {
    solid: {
      base: 'bg-teal-500 dark:bg-teal-700/70 text-teal-50 dark:text-teal-50',
      border: 'border-teal-600/80 dark:border-teal-600',
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
    link: {
      base: 'bg-transparent text-teal-600 dark:text-teal-400',
      border: 'border-transparent',
      hover: 'hover:opacity-70',
      icon: 'text-teal-600 dark:text-teal-400',
    },
  },
  blue: {
    solid: {
      base: 'bg-blue-500 dark:bg-blue-700/70 text-blue-50 dark:text-blue-50',
      border: 'border-blue-600/80 dark:border-blue-600',
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
    link: {
      base: 'bg-transparent text-blue-600 dark:text-blue-400',
      border: 'border-transparent',
      hover: 'hover:opacity-70',
      icon: 'text-blue-600 dark:text-blue-400',
    },
  },
  purple: {
    solid: {
      base: 'bg-purple-500 dark:bg-purple-700/70 text-purple-50 dark:text-purple-50',
      border: 'border-purple-600/80 dark:border-purple-600',
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
    link: {
      base: 'bg-transparent text-purple-600 dark:text-purple-400',
      border: 'border-transparent',
      hover: 'hover:opacity-70',
      icon: 'text-purple-600 dark:text-purple-400',
    },
  },
  yellow: {
    solid: {
      base: 'bg-yellow-500 dark:bg-yellow-700/70 text-yellow-50 dark:text-yellow-50',
      border: 'border-yellow-600/80 dark:border-yellow-600',
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
    link: {
      base: 'bg-transparent text-yellow-600 dark:text-yellow-400',
      border: 'border-transparent',
      hover: 'hover:opacity-70',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
  },
  amber: {
    solid: {
      base: 'bg-amber-500 dark:bg-amber-700/70 text-amber-50 dark:text-amber-50',
      border: 'border-amber-600/80 dark:border-amber-600',
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
    link: {
      base: 'bg-transparent text-amber-600 dark:text-amber-400',
      border: 'border-transparent',
      hover: 'hover:text-amber-700 dark:hover:text-amber-300',
      icon: 'text-amber-600 dark:text-amber-400',
    },
  },
  fuchsia: {
    solid: {
      base: 'bg-fuchsia-500 dark:bg-fuchsia-700/70 text-fuchsia-50 dark:text-fuchsia-50',
      border: 'border-fuchsia-600/80 dark:border-fuchsia-600',
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
    link: {
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
    link: {
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
    link: {
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
    link: {
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
    link: {
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
    link: {
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
    link: {
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
      hover: 'hover:bg-gray-100/70 dark:hover:bg-white',
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
    link: {
      base: 'bg-transparent text-white',
      border: 'border-transparent',
      hover: 'hover:text-white/70',
      icon: 'text-white',
    },
  },

  red: {
    solid: {
      base: 'bg-red-500 dark:bg-red-700/70 text-red-50 dark:text-red-50',
      border: 'border-red-600/80 dark:border-red-600',
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
    link: {
      base: 'bg-transparent text-red-600 dark:text-red-400',
      border: 'border-transparent',
      hover: 'hover:text-red-700 dark:hover:text-red-300',
      icon: 'text-red-600 dark:text-red-400',
    },
  },
  lime: {
    solid: {
      base: 'bg-lime-500 dark:bg-lime-700/70 text-lime-50 dark:text-lime-50',
      border: 'border-lime-600/80 dark:border-lime-600',
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
    link: {
      base: 'bg-transparent text-lime-600 dark:text-lime-400',
      border: 'border-transparent',
      hover: 'hover:text-lime-700 dark:hover:text-lime-300',
      icon: 'text-lime-600 dark:text-lime-400',
    },
  },
  emerald: {
    solid: {
      base: 'bg-emerald-500 dark:bg-emerald-700/70 text-emerald-50 dark:text-emerald-50',
      border: 'border-emerald-600/80 dark:border-emerald-600',
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
    link: {
      base: 'bg-transparent text-emerald-600 dark:text-emerald-400',
      border: 'border-transparent',
      hover: 'hover:text-emerald-700 dark:hover:text-emerald-300',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
  },
  cyan: {
    solid: {
      base: 'bg-cyan-500 dark:bg-cyan-700/70 text-cyan-50 dark:text-cyan-50',
      border: 'border-cyan-600/80 dark:border-cyan-600',
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
    link: {
      base: 'bg-transparent text-cyan-600 dark:text-cyan-400',
      border: 'border-transparent',
      hover: 'hover:text-cyan-700 dark:hover:text-cyan-300',
      icon: 'text-cyan-600 dark:text-cyan-400',
    },
  },
  violet: {
    solid: {
      base: 'bg-violet-500 dark:bg-violet-700/70 text-violet-50 dark:text-violet-50',
      border: 'border-violet-600/80 dark:border-violet-600',
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
    link: {
      base: 'bg-transparent text-violet-600 dark:text-violet-400',
      border: 'border-transparent',
      hover: 'hover:text-violet-700 dark:hover:text-violet-300',
      icon: 'text-violet-600 dark:text-violet-400',
    },
  },
  pink: {
    solid: {
      base: 'bg-pink-500 dark:bg-pink-700/70 text-pink-50 dark:text-pink-50',
      border: 'border-pink-600/80 dark:border-pink-600',
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
    link: {
      base: 'bg-transparent text-pink-600 dark:text-pink-400',
      border: 'border-transparent',
      hover: 'hover:text-pink-700 dark:hover:text-pink-300',
      icon: 'text-pink-600 dark:text-pink-400',
    },
  },

}

export const inputTheme: Record<Partial<ColorThemeUser>, {
  input: string
}> = {
  muted: { input: `bg-white dark:bg-theme-800/50
            ring-theme-200 dark:ring-theme-600/70
            focus:ring-theme-600 focus:bg-white
            dark:focus:ring-theme-500 dark:focus:bg-theme-800
            focus-within:ring-theme-600 dark:focus-within:ring-theme-500
            text-theme-900 dark:text-theme-100
            placeholder:text-theme-400 dark:placeholder:text-theme-500` },
  default: { input: `bg-white dark:bg-theme-800/50
            ring-theme-200 dark:ring-theme-600/70
            focus:ring-theme-600 focus:bg-white
            dark:focus:ring-theme-500 dark:focus:bg-theme-800
            focus-within:ring-theme-600 dark:focus-within:ring-theme-500
            text-theme-900 dark:text-theme-100
            placeholder:text-theme-400 dark:placeholder:text-theme-500` },
  primary: { input: `bg-primary-50/60 dark:bg-primary-800/20
            ring-primary-400 dark:ring-primary-600/70
            focus:ring-primary-700 focus:bg-primary-50/50
            dark:focus:ring-primary-600 dark:focus:bg-primary-800/40
            text-primary-800 dark:text-primary-0
            placeholder:text-primary-300 dark:placeholder:text-primary-600` },
  theme: { input: `bg-theme-50 dark:bg-theme-800/20
              ring-theme-300 dark:ring-theme-600/70
              focus:ring-theme-700 focus:bg-theme-50/50
              dark:focus:ring-theme-600 dark:focus:bg-theme-800/40
              text-theme-800 dark:text-theme-0
              placeholder:text-theme-300 dark:placeholder:text-theme-600` },
  overlay: { input: `bg-white/10 ring-white
              focus:ring-white/90 focus:bg-white/20
              dark:focus:ring-white/70
              text-white
              placeholder:text-white/60` },
  green: { input: `bg-green-50 dark:bg-green-800/20
              ring-green-300 dark:ring-green-600/70
              focus:ring-green-700 focus:bg-green-50/50
              dark:focus:ring-green-600 dark:focus:bg-green-800/40
              text-green-800 dark:text-green-0
              placeholder:text-green-300 dark:placeholder:text-green-600` },
  orange: { input: `bg-orange-50 dark:bg-orange-800/20
              ring-orange-300 dark:ring-orange-600/70
              focus:ring-orange-700 focus:bg-orange-50/50
              dark:focus:ring-orange-600 dark:focus:bg-orange-800/40
              text-orange-800 dark:text-orange-0
              placeholder:text-orange-300 dark:placeholder:text-orange-600` },
  // Add remaining color variants following the same pattern
  blue: { input: `bg-blue-50 dark:bg-blue-800/20
              ring-blue-300 dark:ring-blue-600/70
              focus:ring-blue-700 focus:bg-blue-50/50
              dark:focus:ring-blue-600 dark:focus:bg-blue-800/40
              text-blue-800 dark:text-blue-0
              placeholder:text-blue-300 dark:placeholder:text-blue-600` },
  indigo: { input: `bg-indigo-50 dark:bg-indigo-800/20
              ring-indigo-300 dark:ring-indigo-600/70
              focus:ring-indigo-700 focus:bg-indigo-50/50
              dark:focus:ring-indigo-600 dark:focus:bg-indigo-800/40
              text-indigo-800 dark:text-indigo-0
              placeholder:text-indigo-300 dark:placeholder:text-indigo-600` },
  rose: { input: `bg-rose-50 dark:bg-rose-800/20
              ring-rose-300 dark:ring-rose-600/70
              focus:ring-rose-700 focus:bg-rose-50/50
              dark:focus:ring-rose-600 dark:focus:bg-rose-800/40
              text-rose-800 dark:text-rose-0
              placeholder:text-rose-300 dark:placeholder:text-rose-600` },
  amber: { input: `bg-amber-50 dark:bg-amber-800/20
              ring-amber-300 dark:ring-amber-600/70
              focus:ring-amber-700 focus:bg-amber-50/50
              dark:focus:ring-amber-600 dark:focus:bg-amber-800/40
              text-amber-800 dark:text-amber-0
              placeholder:text-amber-300 dark:placeholder:text-amber-600` },
  fuchsia: { input: `bg-fuchsia-50 dark:bg-fuchsia-800/20
              ring-fuchsia-300 dark:ring-fuchsia-600/70
              focus:ring-fuchsia-700 focus:bg-fuchsia-50/50
              dark:focus:ring-fuchsia-600 dark:focus:bg-fuchsia-800/40
              text-fuchsia-800 dark:text-fuchsia-0
              placeholder:text-fuchsia-300 dark:placeholder:text-fuchsia-600` },
  sky: { input: `bg-sky-50 dark:bg-sky-800/20
              ring-sky-300 dark:ring-sky-600/70
              focus:ring-sky-700 focus:bg-sky-50/50
              dark:focus:ring-sky-600 dark:focus:bg-sky-800/40
              text-sky-800 dark:text-sky-0
              placeholder:text-sky-300 dark:placeholder:text-sky-600` },
  teal: { input: `bg-teal-50 dark:bg-teal-800/20
              ring-teal-600 dark:ring-teal-600/70
              focus:ring-teal-700 focus:bg-teal-50/50
              dark:focus:ring-teal-600 dark:focus:bg-teal-800/40
              text-teal-800 dark:text-teal-0
              placeholder:text-teal-300 dark:placeholder:text-teal-600` },
  purple: { input: `bg-purple-50 dark:bg-purple-800/20
              ring-purple-300 dark:ring-purple-600/70
              focus:ring-purple-700 focus:bg-purple-50/50
              dark:focus:ring-purple-600 dark:focus:bg-purple-800/40
              text-purple-800 dark:text-purple-0
              placeholder:text-purple-300 dark:placeholder:text-purple-600` },
  yellow: { input: `bg-yellow-50 dark:bg-yellow-800/20
              ring-yellow-300 dark:ring-yellow-600/70
              focus:ring-yellow-700 focus:bg-yellow-50/50
              dark:focus:ring-yellow-600 dark:focus:bg-yellow-800/40
              text-yellow-800 dark:text-yellow-0
              placeholder:text-yellow-300 dark:placeholder:text-yellow-600` },
  slate: { input: `bg-slate-50 dark:bg-slate-800/20
              ring-slate-300 dark:ring-slate-600/70
              focus:ring-slate-700 focus:bg-slate-50/50
              dark:focus:ring-slate-600 dark:focus:bg-slate-800/40
              text-slate-800 dark:text-slate-0
              placeholder:text-slate-300 dark:placeholder:text-slate-600` },
  zinc: { input: `bg-zinc-50 dark:bg-zinc-800/20
              ring-zinc-300 dark:ring-zinc-600/70
              focus:ring-zinc-700 focus:bg-zinc-50/50
              dark:focus:ring-zinc-600 dark:focus:bg-zinc-800/40
              text-zinc-800 dark:text-zinc-0
              placeholder:text-zinc-300 dark:placeholder:text-zinc-600` },
  neutral: { input: `bg-neutral-50 dark:bg-neutral-800/20
              ring-neutral-300 dark:ring-neutral-600/70
              focus:ring-neutral-700 focus:bg-neutral-50/50
              dark:focus:ring-neutral-600 dark:focus:bg-neutral-800/40
              text-neutral-800 dark:text-neutral-0
              placeholder:text-neutral-300 dark:placeholder:text-neutral-600` },
  stone: { input: `bg-stone-50 dark:bg-stone-800/20
              ring-stone-300 dark:ring-stone-600/70
              focus:ring-stone-700 focus:bg-stone-50/50
              dark:focus:ring-stone-600 dark:focus:bg-stone-800/40
              text-stone-800 dark:text-stone-0
              placeholder:text-stone-300 dark:placeholder:text-stone-600` },
  black: { input: `bg-gray-50 dark:bg-black/20
              ring-gray-300 dark:ring-gray-600/70
              focus:ring-gray-700 focus:bg-gray-50/50
              dark:focus:ring-gray-600 dark:focus:bg-black/40
              text-gray-800 dark:text-white
              placeholder:text-gray-300 dark:placeholder:text-gray-600` },
  white: { input: `bg-white/90 dark:bg-white/10
              ring-white/30 dark:ring-white/20
              focus:ring-white/90 focus:bg-white/100
              dark:focus:ring-white/30 dark:focus:bg-white/20
              text-gray-900 dark:text-white
              placeholder:text-gray-400 dark:placeholder:text-white/60` },
  cyan: { input: `bg-cyan-50 dark:bg-cyan-800/20
                ring-cyan-300 dark:ring-cyan-600/70
                focus:ring-cyan-700 focus:bg-cyan-50/50
                dark:focus:ring-cyan-600 dark:focus:bg-cyan-800/40
                text-cyan-800 dark:text-cyan-0
                placeholder:text-cyan-300 dark:placeholder:text-cyan-600` },
  violet: { input: `bg-violet-50 dark:bg-violet-800/20
                ring-violet-300 dark:ring-violet-600/70
                focus:ring-violet-700 focus:bg-violet-50/50
                dark:focus:ring-violet-600 dark:focus:bg-violet-800/40
                text-violet-800 dark:text-violet-0
                placeholder:text-violet-300 dark:placeholder:text-violet-600` },
  pink: { input: `bg-pink-50 dark:bg-pink-800/20
                ring-pink-300 dark:ring-pink-600/70
                focus:ring-pink-700 focus:bg-pink-50/50
                dark:focus:ring-pink-600 dark:focus:bg-pink-800/40
                text-pink-800 dark:text-pink-0
                placeholder:text-pink-300 dark:placeholder:text-pink-600` },
  red: { input: `bg-red-50 dark:bg-red-800/20
                ring-red-300 dark:ring-red-600/70
                focus:ring-red-700 focus:bg-red-50/50
                dark:focus:ring-red-600 dark:focus:bg-red-800/40
                text-red-800 dark:text-red-0
                placeholder:text-red-300 dark:placeholder:text-red-600` },
  lime: { input: `bg-lime-50 dark:bg-lime-800/20
                  ring-lime-300 dark:ring-lime-600/70
                  focus:ring-lime-700 focus:bg-lime-50/50
                  dark:focus:ring-lime-600 dark:focus:bg-lime-800/40
                  text-lime-800 dark:text-lime-0
                  placeholder:text-lime-300 dark:placeholder:text-lime-600` },
  emerald: { input: `bg-emerald-50 dark:bg-emerald-800/20
                  ring-emerald-300 dark:ring-emerald-600/70
                  focus:ring-emerald-700 focus:bg-emerald-50/50
                  dark:focus:ring-emerald-600 dark:focus:bg-emerald-800/40
                  text-emerald-800 dark:text-emerald-0
                  placeholder:text-emerald-300 dark:placeholder:text-emerald-600` },
  gray: { input: `bg-gray-50 dark:bg-gray-800/20
                  ring-gray-300 dark:ring-gray-600/70
                  focus:ring-gray-700 focus:bg-gray-50/50
                  dark:focus:ring-gray-600 dark:focus:bg-gray-800/40
                  text-gray-800 dark:text-gray-0
                  placeholder:text-gray-300 dark:placeholder:text-gray-600` },
}
