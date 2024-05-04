<script lang="ts" setup>
import { getNavComponentType, vue } from '@fiction/core'
import type { UiElementFormat, UiElementSize, UiElementStyle } from './utils'
import { getButtonClasses } from './utils'

defineOptions({ name: 'ElButton' })

const props = defineProps({
  loading: { type: [Boolean, String], default: false },

  to: { type: String, default: '' },
  href: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  noHover: { type: Boolean, default: false },
  format: { type: String as vue.PropType<UiElementFormat>, default: 'inline' },
  btn: { type: String as vue.PropType<UiElementStyle >, default: 'default' },
  size: { type: String as vue.PropType<UiElementSize>, default: '' },
  rounded: { type: String as vue.PropType<'md' | 'lg' | 'full'>, default: '' },
  wrapClass: { type: String, default: '' },
  icon: { type: String, default: '' },
  animate: { type: Boolean, default: false },
  tag: { type: String as vue.PropType<'button' | 'div'>, default: 'button' },
})

const animateSelected = vue.ref()
function onClick() {
  if (props.animate) {
    animateSelected.value = true
    setTimeout(() => animateSelected.value = false, 1000)
  }
}

const buttonClasses = vue.computed(() => {
  return getButtonClasses({
    size: props.size,
    btn: props.btn,
    format: props.format,
    isDisabled: props.disabled,
    useShadow: false,
    noHover: props.noHover,
  })
})
</script>

<template>
  <component
    :is="getNavComponentType({ name: 'btn', href }, props.noHover ? 'div' : tag)"
    :to="to || href"
    :class="[buttonClasses, animateSelected && animate ? 'animate-selected' : '']"
    :href="href"
    @click="onClick()"
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
    <span
      class="flex w-full min-w-0 items-center whitespace-nowrap"
      :class="[loading ? 'opacity-0' : '', wrapClass, format === 'spread' ? '' : 'justify-center']"
    >
      <div v-if="icon" class="flex space-x-1 items-center">
        <div class="text-[1.2em] -mt-[1px]" :class="[icon, $slots.default ? '-ml-0.5' : 'mx-[-2px]']" />
        <div v-if="$slots.default"><slot /></div>
      </div>
      <template v-else><slot /></template>
    </span>
  </component>
</template>

<style>
.animate-selected {
  animation: clickButton 0.3s linear forwards;
}

@keyframes clickButton {
  0% {
    opacity: 0.2;
  }
  25% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}
</style>
