<script setup lang="ts">
import type { colorTheme } from '@fiction/core'
import { getNavComponentType, vue } from '@fiction/core'
// Define the possible sizes
type UiElementSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type ColorTheme = typeof colorTheme[number] | 'theme' | 'overlay' | 'naked'
// Props definitions
const props = defineProps({
  theme: { type: String as vue.PropType<ColorTheme>, default: 'theme' },
  size: { type: String as vue.PropType<UiElementSize>, default: 'md' },
  href: { type: String, default: null },
})

// Utility to generate badge classes based on theme and mode
function getBadgeClasses(theme: ColorTheme, size: UiElementSize) {
  const sizeClasses = {
    'xxs': 'px-1 py-0.5 text-[10px]',
    'xs': 'px-2 py-1 text-xs',
    'sm': 'px-3 py-1.5 text-sm',
    'md': 'px-2 py-1 text-xs',
    'lg': 'px-5 py-2.5 text-base',
    'xl': 'px-6 py-3 text-base',
    '2xl': 'px-7 py-3.5 text-xl',
  }

  const cls = {
    naked: 'ring-transparent text-theme-500',
    overlay: 'text-white/90 bg-white/10 ring-white/30',
    theme: 'bg-theme-50 text-theme-600 ring-theme-500/30 dark:bg-theme-400/10 dark:text-theme-400 dark:ring-theme-400/20',
    gray: 'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20',
    red: 'bg-red-50 text-red-600 ring-red-500/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20',
    yellow: 'bg-yellow-50 text-yellow-600 ring-yellow-500/10 dark:bg-yellow-400/10 dark:text-yellow-400 dark:ring-yellow-400/20',
    green: 'bg-green-50 text-green-600 ring-green-500/10 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20',
    blue: 'bg-blue-50 text-blue-600 ring-blue-500/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20',
    indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-500/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/20',
    purple: 'bg-purple-50 text-purple-600 ring-purple-500/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/20',
    pink: 'bg-pink-50 text-pink-600 ring-pink-500/10 dark:bg-pink-400/10 dark:text-pink-400 dark:ring-pink-400/20',
    sky: 'bg-sky-50 text-sky-600 ring-sky-500/10 dark:bg-sky-400/10 dark:text-sky-400 dark:ring-sky-400/20',
    lime: 'bg-lime-50 text-lime-600 ring-lime-500/10 dark:bg-lime-400/10 dark:text-lime-400 dark:ring-lime-400/20',
    amber: 'bg-amber-50 text-amber-600 ring-amber-500/10 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-500/10 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20',
    teal: 'bg-teal-50 text-teal-600 ring-teal-500/10 dark:bg-teal-400/10 dark:text-teal-400 dark:ring-teal-400/20',
    cyan: 'bg-cyan-50 text-cyan-600 ring-cyan-500/10 dark:bg-cyan-400/10 dark:text-cyan-400 dark:ring-cyan-400/20',
    orange: 'bg-orange-50 text-orange-600 ring-orange-500/10 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20',
    rose: 'bg-rose-50 text-rose-600 ring-rose-500/10 dark:bg-rose-400/10 dark:text-rose-400 dark:ring-rose-400/20',
    fuchsia: 'bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-500/10 dark:bg-fuchsia-400/10 dark:text-fuchsia-400 dark:ring-fuchsia-400/20',
    violet: 'bg-violet-50 text-violet-600 ring-violet-500/10 dark:bg-violet-400/10 dark:text-violet-400 dark:ring-violet-400/20',

  } as const

  const colorClasses = cls[theme as keyof typeof cls]

  const hoverStyle = props.href ? 'hover:opacity-80 cursor-pointer' : ''

  return `not-prose x-font-title antialiased inline-flex items-center rounded-md font-medium ring-1 ring-inset ${sizeClasses[size]} ${colorClasses} ${hoverStyle}`
}

// Computed badge class
const badgeClasses = vue.computed(() => getBadgeClasses(props.theme, props.size))
</script>

<template>
  <component :is="getNavComponentType({ href }, 'span')" :href="href" :to="href" :class="badgeClasses" class="">
    <slot />
  </component>
</template>
