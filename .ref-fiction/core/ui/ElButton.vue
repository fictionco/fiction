<script lang="ts" setup>
import { vue } from '@factor/api'

const props = defineProps({
  loading: { type: [Boolean, String], default: false },
  btn: {
    type: String as vue.PropType<'primary' | 'default' | 'slateInverted'>,
    default: '',
  },
  size: {
    type: String as vue.PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl'>,
    default: '',
  },
  to: { type: String, default: '' },
  href: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  format: {
    type: String as vue.PropType<'block' | 'inline'>,
    default: 'inline',
  },
  rounded: {
    type: String as vue.PropType<'md' | 'lg' | 'full'>,
    default: '',
  },
})

const btnClass = vue.computed(() => {
  let out = ''
  if (props.btn === 'primary')
    out = 'text-white bg-primary-600 border-primary-600 hover:bg-primary-500'
  else if (props.btn === 'slateInverted')
    out = 'text-theme-900 bg-theme-200 border-slate-800 hover:bg-theme-600'
  else
    out = 'border-theme-300 text-theme-700 bg-theme-100 hover:border-theme-400 '

  if (props.disabled)
    out = `${out} opacity-40 cursor-not-allowed`

  return out
})
</script>

<template>
  <component
    :is="!href.includes('http') || to ? 'router-link' : href ? 'a' : 'button'"
    :to="to"
    class="relative inline-flex select-none items-center rounded-xl border"
    :class="btnClass"
    :href="href"
  >
    <div
      v-if="loading"
      class="absolute left-0 flex w-full items-center justify-center"
    >
      <svg
        class="h-4 w-4 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
    <span class="flex items-center" :class="loading ? 'opacity-0' : ''">
      <slot />
    </span>
  </component>
</template>
