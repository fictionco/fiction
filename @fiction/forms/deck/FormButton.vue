<script lang="ts" setup>
import { vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/ElSpinner.vue'

const props = defineProps({
  loading: { type: [Boolean], default: false },
  ok: { type: [Boolean], default: false },
  btn: { type: String, default: '' },
  size: {
    type: String as vue.PropType<'xs' | 'sm' | 'md' | 'lg'>,
    default: '',
  },
  disabled: { type: Boolean, default: false },
  format: {
    type: String as vue.PropType<'block' | 'inline'>,
    default: 'inline',
  },
})
const animateSelected = vue.ref()
function onClick() {
  animateSelected.value = true
  setTimeout(() => {
    animateSelected.value = false
  }, 1000)
}

const btnClass = vue.computed(() => {
  const out = []
  if (props.btn === 'action') {
    out.push(
      'border-action-main text-action-contrast bg-action-main hover:bg-action-light',
    )
  }
  else {
    out.push(
      'border-input-border text-input-text bg-input-bg hover:border-input-border-alt',
    )
  }

  let formatClasses = 'inline-flex'
  if (props.format === 'block')
    formatClasses = 'flex justify-center w-full'

  out.push(formatClasses)

  if (props.disabled)
    out.push('opacity-40 cursor-not-allowed')

  if (animateSelected.value)
    out.push('animate-selected')

  return out
})
</script>

<template>
  <button
    class="text-input-size relative select-none items-center rounded-md border py-[.2em] px-[.6em] drop-shadow-md"
    :class="btnClass"
    @click="onClick()"
  >
    <transition name="slideIn" mode="out-in">
      <div v-if="loading" class="px-4">
        <ElSpinner class="h-8 w-8" />
      </div>
      <span
        v-else
        class="flex items-center"
        :class="loading ? 'opacity-0' : ''"
      >
        <slot />

        <transition name="slideIn" mode="out-in">
          <div v-if="ok" class="ml-3 -mr-2">
            <div class="i-carbon-checkmark" />
          </div>
        </transition>
      </span>
    </transition>
  </button>
</template>

<style lang="less">
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
.slideIn-enter-from,
.slideOut-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.slideIn-enter-to,
.slideIn-leave-from,
.slideOut-enter-to,
.slideOut-leave-from {
  transform: translateX(0);
}
.slideIn-enter-active,
.slideIn-leave-active,
.slideOut-enter-active,
.slideOut-leave-active {
  transition: 0.2s ease;
  transition-property: opacity, transform;
}

.slideIn-leave-to,
.slideOut-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
