<script lang="ts" setup>
import { vue } from '@factor/api'

const props = defineProps({
  loading: { type: [Boolean, String], default: false },
  btn: {
    type: String as vue.PropType<
      'danger' | 'caution' | 'success' | 'primary' | 'default' | string
    >,
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

const animateSelected = vue.ref()
function onClick() {
  console.log('CLICK')
  animateSelected.value = true
  setTimeout(() => {
    animateSelected.value = false
  }, 1000)
}

const btnClass = vue.computed(() => {
  let out = ''
  if (props.btn === 'danger') {
    out
      = 'text-danger-0 bg-danger-500 hover:bg-danger-600 focus:ring-danger-600 border-danger-600 hover:text-danger-0'
  }
  else if (props.btn === 'caution') {
    out
      = 'text-caution-600 bg-caution-50 hover:bg-caution-100 border-caution-500'
  }
  else if (props.btn === 'primary') {
    out
      = 'text-primary-0 bg-primary-700 hover:bg-primary-500 focus:ring-primary-500 border-primary-700 focus:ring-primary-500'
  }
  else if (props.btn === 'success') {
    out
      = 'text-success-600 bg-success-50 hover:bg-success-500 hover:bg-success-500 hover:text-success-0 focus:ring-success-500 border-success-50 hover:border-success-500'
  }
  else {
    out
      = 'border-theme-300 text-theme-700 bg-theme-0 hover:border-theme-400 focus:ring-theme-100'
  }

  let roundClass = 'rounded-lg'

  if (props.rounded === 'full')
    roundClass = 'rounded-full'
  else if (props.rounded === 'md')
    roundClass = 'rounded-md'
  else if (props.rounded === 'lg')
    roundClass = 'rounded-lg'

  let sizeClasses = 'px-3 py-1.5 text-[.9em]'
  if (props.size === 'md')
    sizeClasses = 'px-2.5 py-1 text-[.9em]'
  else if (props.size === 'sm')
    sizeClasses = 'px-3 py-1 text-xs'
  else if (props.size === 'xs')
    sizeClasses = 'px-2.5 py-1 text-xs'
  else if (props.size === 'lg')
    sizeClasses = 'px-4 py-2 text-base rounded-md'
  else if (props.size === 'xl')
    sizeClasses = 'px-5 py-2.5 sm:text-base md:text-lg rounded-md'

  let formatClasses = 'inline-flex'
  if (props.format === 'block')
    formatClasses = 'flex justify-center w-full'

  out += ` ${sizeClasses} ${formatClasses} ${roundClass}`

  if (props.disabled)
    out = `${out} opacity-40 cursor-not-allowed`

  return out
})
</script>

<template>
  <component
    :is="
      to || (href && !href?.includes('http'))
        ? 'router-link'
        : href
          ? 'a'
          : 'button'
    "
    :to="to || href"
    class="relative select-none items-center border font-semibold shadow-sm ring-offset-2 focus:outline-none focus:ring-2 transition-all"
    :class="[btnClass, animateSelected ? 'animate-selected' : '']"
    :href="href"
  >
    <div @click="onClick()">
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
    </div>
  </component>
</template>

<style>
.animate-selected {
  animation: clickButton 0.4s linear forwards;
}

@keyframes clickButton {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
